const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    trim: true,
    uppercase: true,
    default: 'CS501'
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester'
  },
  yearNumber: {
    type: Number,
    required: true
  },
  semesterNumber: {
    type: Number,
    required: true
  },
  credits: {
    type: Number,
    default: 4
  },
  icon: {
    type: String,
    default: 'BookOpen'
  },
  description: {
    type: String,
    default: ''
  },
  notesCount: {
    type: Number,
    default: 0
  },
  contributorCount: {
    type: Number,
    default: 0
  },
  ratingAverage: {
    type: Number,
    default: 4.8
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  downloadsCount: {
    type: Number,
    default: 0
  },
  syllabusUnits: [{
    unitNumber: Number,
    title: String,
    topics: [String]
  }]
}, { timestamps: true });

subjectSchema.index({ branchId: 1, semesterNumber: 1 });
subjectSchema.index({ slug: 1 });
// A subject code is unique within a branch (only enforced when a code is set)
subjectSchema.index({ branchId: 1, code: 1 }, { unique: true, partialFilterExpression: { code: { $type: 'string' } } });

module.exports = mongoose.model('Subject', subjectSchema);
