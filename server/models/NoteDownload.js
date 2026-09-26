const mongoose = require('mongoose');

const noteDownloadSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ip: {
    type: String,
    default: ''
  }
}, { timestamps: true });

noteDownloadSchema.index({ noteId: 1, createdAt: -1 });

module.exports = mongoose.model('NoteDownload', noteDownloadSchema);
