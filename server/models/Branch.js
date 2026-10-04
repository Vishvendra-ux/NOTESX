const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  icon: {
    type: String,
    default: 'GraduationCap'
  },
  color: {
    type: String,
    default: 'from-blue-600 to-indigo-600'
  },
  description: {
    type: String,
    default: ''
  },
  studentCount: {
    type: Number,
    default: 12450
  },
  subjectsCount: {
    type: Number,
    default: 0
  },
  notesCount: {
    type: Number,
    default: 0
  },
  contributorCount: {
    type: Number,
    default: 680
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'Core'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

branchSchema.index({ courseId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Branch', branchSchema);
