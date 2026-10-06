'use strict';

const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { once } = require('node:events');
const { after, before, test } = require('node:test');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = 'notesx-build-together-integration-test-secret';
let baseUrl;
let httpServer;
let testDbName;

const User = require('../models/User');
const ProjectCollab = require('../models/ProjectCollab');
const ProjectApplication = require('../models/ProjectApplication');
const Notification = require('../models/Notification');

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
    Notification.init()
  ]);

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
