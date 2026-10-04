const mongoose = require('mongoose');

// Roadmap completion stored server-side so progress follows the student
// across devices (previously localStorage only).
const RoadmapProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap', required: true },
  completedItems: { type: [String], default: [] }, // bounded by roadmap size
  lastVisitedAt: { type: Date, default: Date.now }
}, { timestamps: true });

RoadmapProgressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

module.exports = mongoose.model('RoadmapProgress', RoadmapProgressSchema);
