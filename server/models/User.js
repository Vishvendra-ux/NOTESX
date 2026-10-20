const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'moderator', 'admin', 'recruiter'],
    default: 'student',
  },
  bio: {
    type: String,
    default: 'Computer Science student passionate about coding and problem solving.',
  },
  collegeName: {
    type: String,
    default: 'GLA University',
  },
  course: {
    type: String,
    default: 'B.Tech CSE',
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  year: {
    type: String,
    default: '3rd Year',
  },
  semester: {
    type: String,
    default: 'Semester 5',
  },
  github: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
  reputation: {
    type: Number,
    default: 0,
  },
  badges: [{
    type: String
  }],
  bookmarkedDoubts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doubt'
  }],
  profilePhoto: {
    type: String,
    default: '',
  },
  resume: {
    type: String,
    default: '',
  },
  resumeOriginalName: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPro: {
    type: Boolean,
    default: false,
  },
  proExpiresAt: {
    type: Date,
    default: null,
  },
  isOnboarded: {
    type: Boolean,
    default: false,
  },
  careerGoal: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
    trim: true,
  }],
  codingProfiles: {
    handles: {
      leetcode: { type: String, default: '', trim: true },
      codeforces: { type: String, default: '', trim: true },
      codechef: { type: String, default: '', trim: true },
    },
    leetcode: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 },
      totalSolved: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      contestsAttended: { type: Number, default: 0 },
      globalRanking: { type: Number, default: 0 },
    },
    codeforces: {
      rating: { type: Number, default: 0 },
      maxRating: { type: Number, default: 0 },
      rank: { type: String, default: 'Unrated' },
      totalSolved: { type: Number, default: 0 },
    },
    codechef: {
      rating: { type: Number, default: 0 },
      maxRating: { type: Number, default: 0 },
      stars: { type: String, default: '1★' },
      totalSolved: { type: Number, default: 0 },
    },
    codingScore: { type: Number, default: 0, index: true },
    totalProblemsSolved: { type: Number, default: 0 },
    verificationCode: { type: String, default: '' },
    isVerifiedCoder: { type: Boolean, default: false },
    lastSyncedAt: { type: Date, default: null },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
