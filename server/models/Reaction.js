const mongoose = require('mongoose');

// Generic vote / save relation. Replaces upvotedBy / savedBy / participants
// arrays that grow without bound on the parent document.
const ReactionSchema = new mongoose.Schema({
  targetType: {
    type: String,
    enum: ['doubt', 'answer', 'project', 'job', 'communityPost', 'note'],
    required: true
  },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kind: { type: String, enum: ['upvote', 'downvote', 'save'], default: 'upvote' }
}, { timestamps: true });

// One reaction of each kind per user per target.
ReactionSchema.index({ targetType: 1, targetId: 1, userId: 1, kind: 1 }, { unique: true });
// "What did this user save / vote on?"
ReactionSchema.index({ userId: 1, targetType: 1, kind: 1, createdAt: -1 });

module.exports = mongoose.model('Reaction', ReactionSchema);
