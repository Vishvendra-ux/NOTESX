const mongoose = require('mongoose');

const noteReportSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: [
      'Incorrect content',
      'Copyright issue',
      'Spam',
      'Duplicate',
      'Inappropriate content',
      'Malicious file',
      'Other'
    ],
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'dismissed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('NoteReport', noteReportSchema);
