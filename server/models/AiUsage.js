const mongoose = require('mongoose');

const aiUsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: String, // 'YYYY-MM-DD' (UTC calendar day)
    required: true,
    index: true,
  },
  questionCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastPromptAt: {
    type: Date,
    default: Date.now,
  },
  tokensUsed: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Composite unique index ensures atomic tracking per student per day
aiUsageSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('AiUsage', aiUsageSchema);
