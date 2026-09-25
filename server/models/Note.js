const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String }, // e.g. PDF, PPT, DOCX
  fileSize: { type: Number }, // in bytes
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  topic: { type: String },
  tags: [{ type: String }],
  downloads: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);

