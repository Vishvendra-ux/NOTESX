const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['Coding', 'Quiz', 'Gaming'], required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' }, // If it's a college-specific contest
  rules: { type: String },
  status: { type: String, enum: ['Upcoming', 'Live', 'Completed', 'Cancelled'], default: 'Upcoming' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);

