const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  college: {
    type: String,
    default: 'Engineering Campus'
  },
  branch: {
    type: String
  },
  subject: {
    type: String
  },
  course: {
    type: String,
    default: 'B.Tech'
  },
  year: {
    type: String,
    default: '3rd Year'
  },
  yearNumber: {
    type: Number,
    default: 3
  },
  semester: {
    type: String,
    default: 'Semester 5'
  },
  semesterNumber: {
    type: Number,
    default: 5
  },
  unit: {
    type: String,
    default: 'Unit 1'
  },
  topic: {
    type: String,
    default: ''
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    default: 'pdf' // 'pdf', 'doc', 'ppt', 'img'
  },
  fileSize: {
    type: Number,
    default: 2400000 // bytes
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  ratingAverage: {
    type: Number,
    default: 4.8
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

noteSchema.index({ subjectId: 1, status: 1 });
noteSchema.index({ branchId: 1, semesterNumber: 1 });
noteSchema.index({ status: 1, createdAt: -1 });
noteSchema.index({ subjectId: 1, status: 1, createdAt: -1 });
noteSchema.index({ uploaderId: 1, createdAt: -1 });
noteSchema.index({ title: 'text', description: 'text', topic: 'text', tags: 'text' });

module.exports = mongoose.model('Note', noteSchema);
