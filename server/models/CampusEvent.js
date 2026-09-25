const mongoose = require('mongoose');

const campusEventSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  collegeSlug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: 'All Departments',
  },
  type: {
    type: String,
    enum: ['Exam', 'Hackathon', 'Fest', 'Workshop'],
    default: 'Exam',
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('CampusEvent', campusEventSchema);
