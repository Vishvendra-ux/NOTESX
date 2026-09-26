const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  yearNumber: {
    type: Number,
    required: true
  },
  semesterNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true // 'Semester 5', '5th Semester'
  },
  subjectsCount: {
    type: Number,
    default: 0
  },
  notesCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

semesterSchema.index({ branchId: 1, yearNumber: 1, semesterNumber: 1 });

module.exports = mongoose.model('Semester', semesterSchema);
