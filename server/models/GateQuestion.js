const mongoose = require('mongoose');

const GateQuestionSchema = new mongoose.Schema({
  examCategory: { type: String, default: 'GATE CSE' },
  examYear: { type: String },
  
  subjectId: { type: String, required: true }, // e.g., 'algorithms'
  topicId: { type: String, required: true }, // e.g., 'algo-analysis'
  
  subjectName: { type: String }, 
  topicName: { type: String },

  questionType: { type: String, enum: ['MCQ', 'MSQ', 'NAT'], default: 'MCQ' },
  marks: { type: Number, default: 1 },

  questionHtml: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  explanationHtml: { type: String },

  createdAt: { type: Date, default: Date.now }
});

// Index for fast querying by subject and topic
GateQuestionSchema.index({ subjectId: 1, topicId: 1 });

module.exports = mongoose.model('GateQuestion', GateQuestionSchema);
