'use strict';

const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { once } = require('node:events');
const { createServer } = require('node:http');
const { after, before, test } = require('node:test');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Server: SocketServer } = require('socket.io');
// Use the same Socket.IO client package that the NOTESX frontend runs.
const { io: socketClient } = require('../../client/node_modules/socket.io-client');

const JWT_SECRET = 'notesx-build-together-integration-test-secret';
let baseUrl;
let httpServer;
let socketServer;
let testDbName;

const User = require('../models/User');
const ProjectCollab = require('../models/ProjectCollab');
const ProjectApplication = require('../models/ProjectApplication');
const Notification = require('../models/Notification');
const ProjectMessage = require('../models/ProjectMessage');

function getTestMongoConfig() {
  // This default points only at a dedicated local test database. TEST_MONGO_URI
  // may override the host, but its database name must still contain "test".
  const uri = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/notesx_buildtogether_test';
  const parsed = new URL(uri);
  const sourceDbName = decodeURIComponent(parsed.pathname.replace(/^\/+|\/+$/g, ''));
  if (!/(^|[_-])test($|[_-])/i.test(sourceDbName)) {
    throw new Error('TEST_MONGO_URI must use a database name containing a separate "test" segment.');
  }

  testDbName = `notesx_buildtogether_test_${process.pid}_${randomUUID().slice(0, 8)}`;
  return { uri, dbName: testDbName };
}

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = JWT_SECRET;
  const { uri, dbName } = getTestMongoConfig();
  // Keep any app modules that read dotenv pointed at a test URI as well.
  process.env.MONGO_URI = uri;

  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 5000 });
  await Promise.all([
    User.init(),
    ProjectCollab.init(),
    ProjectApplication.init(),
    Notification.init(),
    ProjectMessage.init()
  ]);

  const app = require('../app');
  httpServer = createServer(app);
  socketServer = new SocketServer(httpServer);
  require('../socket')(socketServer);
  httpServer.listen(0, '127.0.0.1');
  await once(httpServer, 'listening');
  baseUrl = `http://127.0.0.1:${httpServer.address().port}`;
});

after(async () => {
  if (socketServer) {
    await new Promise(resolve => socketServer.close(resolve));
  } else if (httpServer) {
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

function waitForSocketEvent(socket, eventName, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.off(eventName, handleEvent);
      reject(new Error(`Timed out waiting for Socket.IO event: ${eventName}`));
    }, timeoutMs);
    const handleEvent = value => {
      clearTimeout(timeout);
      resolve(value);
    };
    socket.once(eventName, handleEvent);
  });
}

function emitSocketWithAck(socket, eventName, ...args) {
  return new Promise((resolve, reject) => {
    socket.timeout(3000).emit(eventName, ...args, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
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

function projectPayload(title, rolesNeeded = [
  { roleTitle: 'Frontend Developer', count: 1, skills: ['React'] }
]) {
  return {
    title: `${title} ${randomUUID().slice(0, 8)}`,
    tagline: 'Integration test project',
    description: 'A disposable project created by the BuildTogether API integration suite.',
    category: 'Web Development',
    targetGoal: 'Hackathon Squad',
    projectStage: 'Idea / Planning',
    rolesNeeded,
    maxTeamSize: 2
  };
}

async function createProject(owner, title, rolesNeeded) {
  const result = await requestJson('/api/build-together', {
    method: 'POST',
    token: owner.token,
    body: projectPayload(title, rolesNeeded)
  });
  assert.equal(result.status, 201, JSON.stringify(result.body));
  return result.body;
}

function applicationPayload(slotNumber, roleApplied) {
  return {
    slotNumber,
    roleApplied,
    applicantPhoneOrContact: '+1-555-0100',
    skillsSummary: 'React, API integration testing',
    pitchMessage: 'I would like to contribute to this role.',
    portfolioOrGithub: 'https://github.com/notesx-test-user'
  };
}

async function apply(user, project, slotNumber, roleApplied) {
  return requestJson(`/api/build-together/${project._id}/apply`, {
    method: 'POST',
    token: user.token,
    body: applicationPayload(slotNumber, roleApplied)
  });
}

async function review(owner, project, applicationId, action) {
  return requestJson(`/api/build-together/${project._id}/applications/${applicationId}`, {
    method: 'PATCH',
    token: owner.token,
    body: { action }
  });
}

test('pitcher acceptance and decline persist the expected team and application state', async () => {
  const owner = await createUser('Pitch Owner');
  const acceptedApplicant = await createUser('Accepted Applicant');
  const declinedApplicant = await createUser('Declined Applicant');
  const project = await createProject(owner, 'Acceptance flow', [
    { roleTitle: 'Frontend Developer', count: 1, skills: ['React'] },
    { roleTitle: 'Backend Developer', count: 1, skills: ['Node.js'] }
  ]);

  const acceptedApply = await apply(acceptedApplicant, project, 2, 'Frontend Developer');
  assert.equal(acceptedApply.status, 200, JSON.stringify(acceptedApply.body));
  const acceptedApplicationId = acceptedApply.body.project.applications[0]._id;

  const acceptedReview = await review(owner, project, acceptedApplicationId, 'accept');
  assert.equal(acceptedReview.status, 200, JSON.stringify(acceptedReview.body));

  const persistedProjectAfterAccept = await ProjectCollab.findById(project._id).lean();
  const persistedAcceptedApplication = await ProjectApplication.findById(acceptedApplicationId).lean();
  assert.equal(persistedAcceptedApplication.status, 'accepted');
  assert.ok(persistedAcceptedApplication.reviewedAt);
  assert.equal(persistedProjectAfterAccept.bookingSlots.find(slot => slot.slotNumber === 2).status, 'reserved');
  assert.equal(
    persistedProjectAfterAccept.bookingSlots.find(slot => slot.slotNumber === 2).filledBy.userId.toString(),
    acceptedApplicant.user._id.toString()
  );
  assert.equal(
    persistedProjectAfterAccept.members.filter(member => member.userId?.toString() === acceptedApplicant.user._id.toString()).length,
    1
  );
  assert.equal(persistedProjectAfterAccept.rolesNeeded.find(role => role.roleTitle === 'Frontend Developer').filled, 1);
  assert.equal(await Notification.countDocuments({
    userId: acceptedApplicant.user._id,
    type: 'application_accepted'
  }), 1);

  const declinedApply = await apply(declinedApplicant, project, 3, 'Backend Developer');
  assert.equal(declinedApply.status, 200, JSON.stringify(declinedApply.body));
  const declinedApplicationId = declinedApply.body.project.applications[0]._id;
  const declinedReview = await review(owner, project, declinedApplicationId, 'decline');
  assert.equal(declinedReview.status, 200, JSON.stringify(declinedReview.body));

  const persistedProjectAfterDecline = await ProjectCollab.findById(project._id).lean();
  const persistedDeclinedApplication = await ProjectApplication.findById(declinedApplicationId).lean();
  assert.equal(persistedDeclinedApplication.status, 'declined');
  assert.ok(persistedDeclinedApplication.reviewedAt);
  assert.equal(persistedProjectAfterDecline.bookingSlots.find(slot => slot.slotNumber === 3).status, 'available');
  assert.equal(
    persistedProjectAfterDecline.members.some(member => member.userId?.toString() === declinedApplicant.user._id.toString()),
    false
  );
  assert.equal(await Notification.countDocuments({
    userId: declinedApplicant.user._id,
    type: 'application_declined'
  }), 1);
});

test('capacity is enforced for locked, closed, stale, and concurrently accepted seats', async () => {
  const owner = await createUser('Capacity Owner');
  const applicantOne = await createUser('Capacity Applicant One');
  const applicantTwo = await createUser('Capacity Applicant Two');
  const project = await createProject(owner, 'Capacity race', [
    { roleTitle: 'Frontend Developer', count: 1, skills: ['React'] },
    { roleTitle: 'Backend Developer', count: 1, skills: ['Node.js'] }
  ]);

  const [firstApply, secondApply] = await Promise.all([
    apply(applicantOne, project, 2, 'Frontend Developer'),
    apply(applicantTwo, project, 2, 'Frontend Developer')
  ]);
  assert.equal(firstApply.status, 200, JSON.stringify(firstApply.body));
  assert.equal(secondApply.status, 200, JSON.stringify(secondApply.body));

  const firstApplicationId = firstApply.body.project.applications[0]._id;
  const secondApplicationId = secondApply.body.project.applications[0]._id;
  const acceptResults = await Promise.all([
    review(owner, project, firstApplicationId, 'accept'),
    review(owner, project, secondApplicationId, 'accept')
  ]);
  assert.deepEqual(acceptResults.map(result => result.status).sort(), [200, 409]);

  let persistedProject = await ProjectCollab.findById(project._id).lean();
  let applications = await ProjectApplication.find({ projectId: project._id }).lean();
  assert.equal(persistedProject.members.length, 2);
  assert.equal(persistedProject.bookingSlots.filter(slot => slot.status === 'reserved').length, 2);
  assert.equal(persistedProject.bookingSlots.find(slot => slot.slotNumber === 2).status, 'reserved');
  assert.equal(persistedProject.bookingSlots.find(slot => slot.slotNumber === 3).status, 'available');
  assert.equal(applications.filter(application => application.status === 'accepted').length, 1);
  assert.equal(applications.filter(application => application.status === 'pending').length, 1);

  const thirdApplicant = await createUser('Capacity Applicant Three');
  const staleSeatApply = await apply(thirdApplicant, project, 2, 'Frontend Developer');
  assert.equal(staleSeatApply.status, 409);

  const fourthApplicant = await createUser('Capacity Applicant Four');
  const finalSeatApply = await apply(fourthApplicant, project, 3, 'Backend Developer');
  assert.equal(finalSeatApply.status, 200, JSON.stringify(finalSeatApply.body));
  const finalSeatApplicationId = finalSeatApply.body.project.applications[0]._id;
  const finalSeatReview = await review(owner, project, finalSeatApplicationId, 'accept');
  assert.equal(finalSeatReview.status, 200, JSON.stringify(finalSeatReview.body));

  persistedProject = await ProjectCollab.findById(project._id).lean();
  assert.equal(persistedProject.status, 'Team Full');
  assert.equal(persistedProject.members.length, 3);
  const fifthApplicant = await createUser('Capacity Applicant Five');
  const fullProjectApply = await apply(fifthApplicant, project, 3, 'Backend Developer');
  assert.equal(fullProjectApply.status, 409);

  const lockedProject = await createProject(owner, 'Locked seat', [
    { roleTitle: 'Frontend Developer', count: 1, skills: ['React'] }
  ]);
  await ProjectCollab.updateOne(
    { _id: lockedProject._id },
    { $set: { 'bookingSlots.1.status': 'locked' } }
  );
  const lockedSeatApply = await apply(fifthApplicant, lockedProject, 2, 'Frontend Developer');
  assert.equal(lockedSeatApply.status, 409);

  const completedProject = await createProject(owner, 'Completed project', [
    { roleTitle: 'Frontend Developer', count: 1, skills: ['React'] }
  ]);
  await ProjectCollab.updateOne({ _id: completedProject._id }, { $set: { status: 'Completed' } });
  const completedProjectApply = await apply(fifthApplicant, completedProject, 2, 'Frontend Developer');
  assert.equal(completedProjectApply.status, 409);
});

test('application contact details are visible only to the applicant and project owner', async () => {
  const owner = await createUser('Privacy Owner');
  const applicant = await createUser('Privacy Applicant');
  const stranger = await createUser('Privacy Stranger');
  const project = await createProject(owner, 'Privacy flow');

  const applyResult = await apply(applicant, project, 2, 'Frontend Developer');
  assert.equal(applyResult.status, 200, JSON.stringify(applyResult.body));
  const applicationId = applyResult.body.project.applications[0]._id;

  const [guestView, strangerView, applicantView, ownerView] = await Promise.all([
    requestJson(`/api/build-together/${project._id}`),
    requestJson(`/api/build-together/${project._id}`, { token: stranger.token }),
    requestJson(`/api/build-together/${project._id}`, { token: applicant.token }),
    requestJson(`/api/build-together/${project._id}`, { token: owner.token })
  ]);

  assert.deepEqual(guestView.body.applications, []);
  assert.deepEqual(strangerView.body.applications, []);
  assert.equal(JSON.stringify(guestView.body).includes(applicant.user.email), false);
  assert.equal(JSON.stringify(strangerView.body).includes(applicant.user.email), false);
  assert.equal(applicantView.body.applications.length, 1);
  assert.equal(applicantView.body.applications[0].applicantEmail, applicant.user.email);
  assert.equal(ownerView.body.applications.length, 1);
  assert.equal(ownerView.body.applications[0].applicantEmail, applicant.user.email);
  assert.equal(ownerView.body.applications[0].applicantPhoneOrContact, '+1-555-0100');

  const unauthorizedReview = await review(stranger, project, applicationId, 'accept');
  assert.equal(unauthorizedReview.status, 403);
});

test('anonymous project previews keep team links private and illustrative projects read-only', async () => {
  const owner = await createUser('Preview Owner');
  const member = await createUser('Preview Member');
  const stranger = await createUser('Preview Stranger');
  const project = await createProject(owner, 'Public preview');
  const inviteLink = 'https://chat.example.test/private-team-invite';
  await ProjectCollab.updateOne({ _id: project._id }, { $set: { communicationLink: inviteLink } });

  const [guestView, strangerView, ownerView, memberView, publicList] = await Promise.all([
    requestJson(`/api/build-together/${project._id}`),
    requestJson(`/api/build-together/${project._id}`, { token: stranger.token }),
    requestJson(`/api/build-together/${project._id}`, { token: owner.token }),
    (async () => {
      await ProjectCollab.updateOne({ _id: project._id }, {
        $push: { members: { userId: member.user._id, name: member.user.name, role: 'Frontend Developer' } }
      });
      return requestJson(`/api/build-together/${project._id}`, { token: member.token });
    })(),
    requestJson('/api/build-together')
  ]);

  assert.equal(guestView.status, 200);
  assert.equal(guestView.body.communicationLink, '');
  assert.deepEqual(guestView.body.applications, []);
  assert.equal(JSON.stringify(guestView.body).includes(inviteLink), false);
  assert.equal(strangerView.body.communicationLink, '');
  assert.equal(ownerView.body.communicationLink, inviteLink);
  assert.equal(memberView.body.communicationLink, inviteLink);
  assert.ok(publicList.body.projects.some(item => item._id === project._id));

  const example = await ProjectCollab.create({
    title: 'Illustrative preview only',
    tagline: 'A sample project for showing how a pitch appears.',
    description: 'This is not an active student team.',
    category: 'Web Development',
    targetGoal: 'Portfolio & Learning',
    creatorId: owner.user._id,
    creatorName: owner.user.name,
    isDemo: true,
    communicationLink: inviteLink,
    rolesNeeded: [{ roleTitle: 'Frontend Developer', count: 1, skills: ['React'] }]
  });

  const exampleView = await requestJson(`/api/build-together/${example._id}`);
  const exampleApply = await requestJson(`/api/build-together/${example._id}/apply`, {
    method: 'POST',
    token: stranger.token,
    body: applicationPayload(2, 'Frontend Developer')
  });
  const exampleUpvote = await requestJson(`/api/build-together/${example._id}/upvote`, {
    method: 'POST',
    token: stranger.token
  });

  assert.equal(exampleView.body.isDemo, true);
  assert.equal(exampleView.body.communicationLink, '');
  assert.equal(exampleApply.status, 409);
  assert.equal(exampleUpvote.status, 409);
});

test('approved teammates can read workspace chat and the owner can publish a final demo', async () => {
  const owner = await createUser('Demo Owner');
  const teammate = await createUser('Demo Teammate');
  const stranger = await createUser('Demo Stranger');
  const project = await createProject(owner, 'Final demo flow');

  const application = await apply(teammate, project, 2, 'Frontend Developer');
  assert.equal(application.status, 200, JSON.stringify(application.body));
  const applicationId = application.body.project.applications[0]._id;
  const approval = await review(owner, project, applicationId, 'accept');
  assert.equal(approval.status, 200, JSON.stringify(approval.body));

  const ownerSocket = socketClient(baseUrl, { auth: { token: owner.token }, transports: ['websocket'], reconnection: false });
  const teammateSocket = socketClient(baseUrl, { auth: { token: teammate.token }, transports: ['websocket'], reconnection: false });
  const strangerSocket = socketClient(baseUrl, { auth: { token: stranger.token }, transports: ['websocket'], reconnection: false });
  try {
    await Promise.all([
      waitForSocketEvent(ownerSocket, 'connect'),
      waitForSocketEvent(teammateSocket, 'connect'),
      waitForSocketEvent(strangerSocket, 'connect')
    ]);

    assert.deepEqual(await emitSocketWithAck(ownerSocket, 'join_project', project._id.toString()), { ok: true });
    assert.deepEqual(await emitSocketWithAck(teammateSocket, 'join_project', project._id.toString()), { ok: true });
    const receivedByOwner = waitForSocketEvent(ownerSocket, 'receive_message');
    const receivedByTeammate = waitForSocketEvent(teammateSocket, 'receive_message');
    const sentMessage = await emitSocketWithAck(teammateSocket, 'send_message', {
      projectId: project._id.toString(),
      senderId: stranger.user._id.toString(),
      senderName: 'Untrusted client name',
      text: 'The demo is ready for review.'
    });
    const [ownerMessage, teammateMessage] = await Promise.all([receivedByOwner, receivedByTeammate]);
    assert.equal(sentMessage.ok, true);
    assert.equal(ownerMessage.text, 'The demo is ready for review.');
    assert.equal(ownerMessage.sender.toString(), teammate.user._id.toString());
    assert.equal(ownerMessage.senderName, teammate.user.name);
    assert.equal(teammateMessage._id.toString(), ownerMessage._id.toString());

    const deniedJoin = await emitSocketWithAck(strangerSocket, 'join_project', project._id.toString());
    const deniedSend = await emitSocketWithAck(strangerSocket, 'send_message', {
      projectId: project._id.toString(),
      text: 'I am not a member.'
    });
    assert.equal(deniedJoin.ok, false);
    assert.equal(deniedSend.ok, false);
  } finally {
    ownerSocket.disconnect();
    teammateSocket.disconnect();
    strangerSocket.disconnect();
  }

  const [ownerMessages, teammateMessages, strangerMessages] = await Promise.all([
    requestJson(`/api/build-together/${project._id}/messages`, { token: owner.token }),
    requestJson(`/api/build-together/${project._id}/messages`, { token: teammate.token }),
    requestJson(`/api/build-together/${project._id}/messages`, { token: stranger.token })
  ]);
  assert.equal(ownerMessages.status, 200);
  assert.equal(teammateMessages.status, 200);
  assert.equal(teammateMessages.body[0].text, 'The demo is ready for review.');
  assert.equal(teammateMessages.body[0].senderName, teammate.user.name);
  assert.equal(strangerMessages.status, 403);

  const nonOwnerPublish = await requestJson(`/api/build-together/${project._id}/demo`, {
    method: 'PATCH',
    token: teammate.token,
    body: { demoUrl: 'https://demo.example.test', githubUrl: 'https://github.com/team/project' }
  });
  const invalidPublish = await requestJson(`/api/build-together/${project._id}/demo`, {
    method: 'PATCH',
    token: owner.token,
    body: { demoUrl: 'javascript:alert(1)', githubUrl: 'https://github.com/team/project' }
  });
  const publish = await requestJson(`/api/build-together/${project._id}/demo`, {
    method: 'PATCH',
    token: owner.token,
    body: { demoUrl: 'https://demo.example.test', githubUrl: 'https://github.com/team/project' }
  });
  const lateApplication = await apply(stranger, project, 2, 'Frontend Developer');
  const completedPreview = await requestJson(`/api/build-together/${project._id}`);

  assert.equal(nonOwnerPublish.status, 403);
  assert.equal(invalidPublish.status, 400);
  assert.equal(publish.status, 200, JSON.stringify(publish.body));
  assert.equal(publish.body.project.status, 'Completed');
  assert.equal(publish.body.project.demoUrl, 'https://demo.example.test');
  assert.equal(publish.body.project.githubUrl, 'https://github.com/team/project');
  assert.equal(lateApplication.status, 409);
  assert.equal(completedPreview.body.status, 'Completed');
  assert.equal(completedPreview.body.demoUrl, 'https://demo.example.test');
});

test('duplicate pending applications are rejected, including simultaneous submissions', async () => {
  const owner = await createUser('Duplicate Owner');
  const applicant = await createUser('Duplicate Applicant');
  const project = await createProject(owner, 'Duplicate flow');
  const payload = applicationPayload(2, 'Frontend Developer');

  const submit = () => requestJson(`/api/build-together/${project._id}/apply`, {
    method: 'POST',
    token: applicant.token,
    body: payload
  });
  const results = await Promise.all([submit(), submit()]);

  assert.deepEqual(results.map(result => result.status).sort(), [200, 400]);
  assert.equal(await ProjectApplication.countDocuments({
    projectId: project._id,
    applicantId: applicant.user._id,
    status: 'pending'
  }), 1);
  assert.equal(await Notification.countDocuments({
    userId: owner.user._id,
    type: 'application_received'
  }), 1);
});
