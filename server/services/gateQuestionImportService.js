'use strict';

const crypto = require('crypto');
const GateQuestion = require('../models/GateQuestion');
const syllabus = require('../data/gateSyllabus.json');

const MAX_BATCH_SIZE = 2000;

const subjectIndex = new Map(
  syllabus.subjects.map((subject) => [
    subject.id,
    { name: subject.name, topics: new Map(subject.topics.map((topic) => [topic.id, topic.name])) }
  ])
);

function fail(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function asTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// Must stay in sync with scripts/importGateQuestions.js history: same input
// must produce the same key so re-imports update existing documents.
function sourceKeyFor(row) {
  return crypto.createHash('sha1')
    .update([row.subjectId, row.topicId, row.examYear, row.questionHtml].join('|'))
    .digest('hex');
}

function validateRow(raw) {
  const subjectId = asTrimmedString(raw.subjectId);
  const subject = subjectIndex.get(subjectId);
  if (!subject) return { error: `unknown subjectId "${subjectId || '(missing)'}" — see GET /api/gate/catalog` };

  const topicId = asTrimmedString(raw.topicId);
  if (!subject.topics.has(topicId)) {
    return { error: `unknown topicId "${topicId || '(missing)'}" for subject "${subjectId}"` };
  }

  const questionHtml = asTrimmedString(raw.questionHtml || raw.question);
  if (!questionHtml) return { error: 'questionHtml is required' };

  const questionType = (asTrimmedString(raw.questionType).toUpperCase()) || 'MCQ';
  if (questionType !== 'MCQ') {
    return { error: `questionType "${questionType}" is not supported yet: the practice viewer only renders MCQ` };
  }

  const options = Array.isArray(raw.options)
    ? raw.options.map((option) => String(option ?? '').trim()).filter(Boolean)
    : [];
  if (options.length < 2) return { error: 'MCQ requires at least 2 non-empty options' };

  const correctAnswer = String(raw.correctAnswer ?? '').trim();
  if (!correctAnswer) return { error: 'correctAnswer is required' };
  if (!options.includes(correctAnswer)) {
    return { error: 'correctAnswer must exactly match one of the options' };
  }

  const marks = Number(raw.marks);
  const examYear = asTrimmedString(raw.examYear) || 'Practice';

  return {
    row: {
      examCategory: asTrimmedString(raw.examCategory) || 'GATE CSE',
      examYear: examYear.slice(0, 60),
      subjectId,
      topicId,
      subjectName: subject.name,
      topicName: subject.topics.get(topicId),
      questionType: 'MCQ',
      marks: Number.isFinite(marks) && marks > 0 ? Math.min(marks, 10) : 1,
      questionHtml,
      options,
      correctAnswer,
      explanationHtml: asTrimmedString(raw.explanationHtml || raw.explanation)
    }
  };
}

async function importQuestions(payload = {}) {
  const rows = Array.isArray(payload.questions) ? payload.questions : [];
  if (rows.length === 0) throw fail('Body must contain a non-empty "questions" array');
  if (rows.length > MAX_BATCH_SIZE) {
    throw fail(`A single import is limited to ${MAX_BATCH_SIZE} questions; split the upload into batches`);
  }

  const operations = [];
  const rejected = [];
  const seenKeys = new Set();

  rows.forEach((raw, index) => {
    const rowNumber = index + 1;
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      rejected.push({ row: rowNumber, reason: 'entry is not an object' });
      return;
    }
    const result = validateRow(raw);
    if (result.error) {
      rejected.push({ row: rowNumber, reason: result.error });
      return;
    }
    const sourceKey = sourceKeyFor(result.row);
    if (seenKeys.has(sourceKey)) {
      rejected.push({ row: rowNumber, reason: 'duplicate of an earlier row in this upload' });
      return;
    }
    seenKeys.add(sourceKey);
    operations.push({
      updateOne: {
        filter: { sourceKey },
        update: { $set: { ...result.row, sourceKey } },
        upsert: true
      }
    });
  });

  let inserted = 0;
  let updated = 0;
  let matched = 0;
  if (operations.length > 0) {
    const result = await GateQuestion.bulkWrite(operations, { ordered: false });
    inserted = result.upsertedCount;
    matched = result.matchedCount;
    updated = result.modifiedCount;
  }

  return { total: rows.length, valid: operations.length, inserted, updated, matched, rejected };
}

module.exports = { importQuestions, syllabus };
