const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String, // e.g., B.Tech CSE
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);

