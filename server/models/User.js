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
    enum: ['student', 'moderator', 'admin'],
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
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
