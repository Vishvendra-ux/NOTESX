const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  yearNumber: {
    type: Number,
    required: true // 1, 2, 3, 4, 5
  },
  name: {
    type: String,
    required: true // '1st Year', '2nd Year', '3rd Year', '4th Year'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
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

academicYearSchema.index({ branchId: 1, yearNumber: 1 });
academicYearSchema.index({ courseId: 1, yearNumber: 1 });

module.exports = mongoose.model('AcademicYear', academicYearSchema);
