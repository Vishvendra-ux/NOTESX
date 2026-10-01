const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  collegeSlug: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    default: 'Student Member',
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  role: {
    type: String,
    default: 'Campus Student',
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    enum: ['Announcement', 'Event', 'Doubt', 'General', 'Exam', 'Hackathon'],
    default: 'General',
  },
  upvotes: {
    type: Number,
    default: 1,
  },
  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  commentsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
