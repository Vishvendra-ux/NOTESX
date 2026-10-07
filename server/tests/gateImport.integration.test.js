'use strict';

const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { once } = require('node:events');
const { after, before, test } = require('node:test');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = 'notesx-gate-import-integration-test-secret';
let baseUrl;
let httpServer;

const User = require('../models/User');
const GateQuestion = require('../models/GateQuestion');

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = JWT_SECRET;
  const uri = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/notesx_gate_import_test';
  const parsed = new URL(uri);
  const sourceDbName = decodeURIComponent(parsed.pathname.replace(/^\/+|\/+$/g, ''));
  if (!/(^|[_-])test($|[_-])/i.test(sourceDbName)) {
    throw new Error('TEST_MONGO_URI must use a database name containing a separate "test" segment.');
  }
  const dbName = `notesx_gate_import_test_${process.pid}_${randomUUID().slice(0, 8)}`;

  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 5000 });
  await User.init();
  await GateQuestion.init();

  const app = require('../app');
  httpServer = app.listen(0, '127.0.0.1');
  await once(httpServer, 'listening');
  baseUrl = `http://127.0.0.1:${httpServer.address().port}`;
});

after(async () => {
  if (httpServer) {
    await new Promise((resolve, reject) => {
      httpServer.close(error => error ? reject(error) : resolve());
    });
  }
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

async function requestJson(path, { method = 'GET', token, body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  let parsedBody = null;
  if (text) {
    try {
      parsedBody = JSON.parse(text);
    } catch {
      parsedBody = text;
    }
  }
  return { status: response.status, body: parsedBody };
}

async function createUser(name, role = 'student') {
  const user = await User.create({
    name,
    email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${randomUUID()}@notesx.test`,
    password: 'integration-test-only-password',
    role,
    collegeName: 'NOTESX Integration Test College'
  });

  return {
    user,
    token: jwt.sign({ id: user._id.toString() }, JWT_SECRET)
  };
}

function question(overrides = {}) {
  return {
    subjectId: 'algorithms',
    topicId: 'algo-analysis',
    examYear: 'GATE 2020',
    questionType: 'MCQ',
    marks: 2,
    questionHtml: `<p>What is the growth of T(n) = 2T(n/2) + n? (${randomUUID()})</p>`,
    options: ['Θ(n)', 'Θ(n log n)', 'Θ(n²)', 'Θ(log n)'],
    correctAnswer: 'Θ(n log n)',
    explanationHtml: '<p>Master theorem case 2.</p>',
    ...overrides
  };
}

test('unauthenticated import requests are rejected with 401', async () => {
  const result = await requestJson('/api/gate/questions/import', {
    method: 'POST',
    body: { questions: [question()] }
  });
  assert.equal(result.status, 401);
});

test('non-admin import requests are rejected with 403', async () => {
  const student = await createUser('GateStudent');
  const result = await requestJson('/api/gate/questions/import', {
    method: 'POST',
    token: student.token,
    body: { questions: [question()] }
  });
  assert.equal(result.status, 403);
});

test('admin imports valid rows and gets per-row rejections for invalid ones', async () => {
  const admin = await createUser('GateAdmin', 'admin');

  const result = await requestJson('/api/gate/questions/import', {
    method: 'POST',
    token: admin.token,
    body: {
      questions: [
        question(),
        question({ topicId: 'algo-greedy', questionHtml: '<p>Which technique builds MSTs via cut property?</p>', correctAnswer: 'Greedy', options: ['Greedy', 'Divide and conquer', 'Dynamic programming', 'Backtracking'] }),
        question({ subjectId: 'not-a-subject' }),
        question({ correctAnswer: 'Θ(n!)' })
      ]
    }
  });

  assert.equal(result.status, 200, JSON.stringify(result.body));
  assert.equal(result.body.total, 4);
  assert.equal(result.body.inserted, 2);
  assert.equal(result.body.rejected.length, 2);
  assert.match(result.body.rejected[0].reason, /unknown subjectId/);
  assert.match(result.body.rejected[1].reason, /exactly match one of the options/);

  const list = await requestJson('/api/gate/questions?subjectId=algorithms');
  assert.equal(list.status, 200);
  assert.equal(list.body.length, 2);
  assert.ok(list.body.every((q) => q.correctAnswer && q.options.length >= 2));
});

test('re-importing the same rows updates instead of duplicating', async () => {
  const admin = await createUser('GateAdmin2', 'admin');
  // Distinct subject so counts are not affected by the other tests in this file
  const rows = [
    question({ subjectId: 'databases', topicId: 'dbms-transactions', questionHtml: '<p>ACID: what does D stand for?</p>', correctAnswer: 'Durability', options: ['Durability', 'Distribution', 'Determinism', 'Denormalization'] }),
    question({ subjectId: 'databases', topicId: 'dbms-sql', questionHtml: '<p>Which SQL clause filters grouped rows?</p>', correctAnswer: 'HAVING', options: ['WHERE', 'HAVING', 'GROUP BY', 'FILTER'] })
  ];

  const first = await requestJson('/api/gate/questions/import', {
    method: 'POST', token: admin.token, body: { questions: rows }
  });
  assert.equal(first.body.inserted, 2);

  const second = await requestJson('/api/gate/questions/import', {
    method: 'POST', token: admin.token, body: { questions: rows }
  });
  assert.equal(second.status, 200);
  assert.equal(second.body.inserted, 0);
  assert.equal(second.body.rejected.length, 0);
  assert.equal(second.body.matched, 2);

  const count = await GateQuestion.countDocuments({ subjectId: 'databases' });
  assert.equal(count, 2);
});

test('catalog endpoint exposes subjects and topics for the uploader', async () => {
  const result = await requestJson('/api/gate/catalog');
  assert.equal(result.status, 200);
  assert.ok(Array.isArray(result.body));
  const algorithms = result.body.find((s) => s.id === 'algorithms');
  assert.ok(algorithms);
  assert.ok(algorithms.topics.some((t) => t.id === 'algo-analysis'));
});

test('import without a questions array returns 400', async () => {
  const admin = await createUser('GateAdmin3', 'admin');
  const result = await requestJson('/api/gate/questions/import', {
    method: 'POST', token: admin.token, body: { nope: true }
  });
  assert.equal(result.status, 400);
});
