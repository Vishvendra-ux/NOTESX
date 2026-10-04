/**
 * One-time, idempotent migration to the new database design.
 *   node server/scripts/migrateDatabaseDesign.js
 *
 * 1. Embedded project `applications`  -> ProjectApplication collection
 * 2. Embedded project `upvotes`       -> Reaction collection (+ recount)
 * 3. Doubt/Answer upvotedBy/downvotedBy -> Reaction collection
 * 4. Recompute derived counters from source records (answersCount, note ratings/downloads)
 * 5. Sync indexes
 * Safe to re-run: every write is an upsert.
 */
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const ProjectCollab = require('../models/ProjectCollab');
const ProjectApplication = require('../models/ProjectApplication');
const Reaction = require('../models/Reaction');
const Doubt = require('../models/Doubt');
const Answer = require('../models/Answer');
const Note = require('../models/Note');
const Review = require('../models/Review');
const NoteDownload = require('../models/NoteDownload');

const reactionOp = (targetType, targetId, userId, kind) => ({
  updateOne: {
    filter: { targetType, targetId, userId, kind },
    update: { $setOnInsert: { targetType, targetId, userId, kind } },
    upsert: true
  }
});

async function flush(ops) {
  if (ops.length) await Reaction.bulkWrite(ops, { ordered: false });
  ops.length = 0;
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected.');

  // 1 + 2: projects (read raw docs since the schema no longer declares these arrays)
  const rawProjects = await mongoose.connection.collection('projectcollabs').find({}).toArray();
  let apps = 0, upv = 0;
  const rops = [];
  for (const p of rawProjects) {
    for (const a of (p.applications || [])) {
      if (!a.applicantId) continue;
      const filter = a.status === 'pending'
        ? { projectId: p._id, applicantId: a.applicantId, status: 'pending' }
        : { projectId: p._id, applicantId: a.applicantId, appliedAt: a.appliedAt };
      const { _id, ...rest } = a;
      await ProjectApplication.updateOne(filter, { $setOnInsert: { ...rest, projectId: p._id } }, { upsert: true });
      apps++;
    }
    for (const uid of (p.upvotes || [])) { rops.push(reactionOp('project', p._id, uid, 'upvote')); upv++; }
    if (rops.length > 500) await flush(rops);
  }
  await flush(rops);
  for (const p of rawProjects) {
    const n = await Reaction.countDocuments({ targetType: 'project', targetId: p._id, kind: 'upvote' });
    await mongoose.connection.collection('projectcollabs').updateOne(
      { _id: p._id },
      { $set: { upvotesCount: n }, $unset: { applications: '', upvotes: '' } }
    );
  }
  console.log(`Projects: moved ${apps} applications, ${upv} upvotes.`);

  // 3: doubts + answers
  let dv = 0;
  const ops = [];
  for (const [Model, type] of [[Doubt, 'doubt'], [Answer, 'answer']]) {
    const cur = Model.collection.find({});
    for await (const d of cur) {
      for (const u of (d.upvotedBy || [])) { ops.push(reactionOp(type, d._id, u, 'upvote')); dv++; }
      for (const u of (d.downvotedBy || [])) { ops.push(reactionOp(type, d._id, u, 'downvote')); dv++; }
      if (ops.length > 500) await flush(ops);
    }
  }
  await flush(ops);
  console.log(`Doubts/answers: copied ${dv} vote records into Reaction (legacy arrays left in place).`);

  // 4: recompute counters from source records
  const ansAgg = await Answer.aggregate([{ $group: { _id: '$doubtId', n: { $sum: 1 } } }]);
  const ansMap = new Map(ansAgg.map(r => [r._id.toString(), r.n]));
  for await (const d of Doubt.find({}, '_id').lean()) {
    await Doubt.updateOne({ _id: d._id }, { $set: { answersCount: ansMap.get(d._id.toString()) || 0 } });
  }
  const revAgg = await Review.aggregate([{ $group: { _id: '$noteId', n: { $sum: 1 }, avg: { $avg: '$rating' } } }]);
  const dlAgg = await NoteDownload.aggregate([{ $group: { _id: '$noteId', n: { $sum: 1 } } }]);
  const revMap = new Map(revAgg.map(r => [r._id.toString(), r]));
  const dlMap = new Map(dlAgg.map(r => [r._id.toString(), r.n]));
  for await (const n of Note.find({}, '_id').lean()) {
    const r = revMap.get(n._id.toString());
    await Note.updateOne({ _id: n._id }, { $set: {
      ratingCount: r ? r.n : 0,
      ratingAverage: r ? Math.round(r.avg * 10) / 10 : 0,
      downloadCount: dlMap.get(n._id.toString()) || 0
    } });
  }
  console.log('Counters recomputed.');

  // 5: indexes
  for (const M of [ProjectCollab, ProjectApplication, Reaction, Note, Doubt, require('../models/GateQuestion'),
                   require('../models/Course'), require('../models/Branch'), require('../models/Subject'),
                   require('../models/RoadmapProgress'), require('../models/Notification')]) {
    try { await M.syncIndexes(); console.log(`indexes ok: ${M.modelName}`); }
    catch (e) { console.warn(`index warning (${M.modelName}): ${e.message}`); }
  }
  await mongoose.disconnect();
  console.log('Done.');
})().catch(e => { console.error(e); process.exit(1); });
