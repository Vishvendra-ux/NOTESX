const mongoose = require('mongoose');

const trackedTopicSchema = new mongoose.Schema({
  topicId: { type: String, required: true },
  subjectId: { type: String, required: true },
  status: { type: String, enum: ['in_progress', 'completed'], required: true },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date },
  lastActivityAt: { type: Date, required: true },
}, { _id: false });

const gateProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  topics: { type: [trackedTopicSchema], default: [] },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('GateProgress', gateProgressSchema);
