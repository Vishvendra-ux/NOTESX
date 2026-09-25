const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number }, // index of options array
  explanation: { type: String },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  topic: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  type: { type: String, enum: ['MCQ', 'MSQ', 'NAT'], default: 'MCQ' },
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
  source: { type: String },
  year: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);

