const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String, // e.g., B.Tech, B.E., BCA, B.Com, MBA
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseCategory',
    required: true
  },
  durationYears: {
    type: Number,
    required: true,
    default: 4
  },
  description: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: 'Undergraduate'
  },
  branchesCount: {
    type: Number,
    default: 0
  },
  subjectsCount: {
    type: Number,
    default: 0
  },
  notesCount: {
    type: Number,
    default: 0
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

courseSchema.index({ categoryId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Course', courseSchema);
