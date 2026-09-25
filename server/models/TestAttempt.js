const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Maps questionId to the chosen option index or text
  },
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['Started', 'Completed'], default: 'Started' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('TestAttempt', testAttemptSchema);

