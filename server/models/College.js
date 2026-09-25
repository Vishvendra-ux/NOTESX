const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  initial: {
    type: String,
  },
  logo: {
    type: String,
  },
  location: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
  established: {
    type: String,
  },
  rank: {
    type: String,
  },
  bannerColor: {
    type: String,
    default: 'from-indigo-600 via-blue-600 to-cyan-500',
  },
  bannerImage: {
    type: String,
    default: '',
  },
  courses: [{
    type: String,
  }],
  departments: [{
    name: String,
    students: String,
    head: String,
  }],
  stats: {
    studentCount: { type: String, default: '1,000+' },
    notesCount: { type: String, default: '500+' },
    doubtsCount: { type: String, default: '200+' },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('College', collegeSchema);
