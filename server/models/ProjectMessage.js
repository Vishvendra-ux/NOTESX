const mongoose = require('mongoose');

const ProjectMessageSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectCollab',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderAvatar: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexing for faster retrieval within a specific project room
ProjectMessageSchema.index({ project: 1, createdAt: 1 });

module.exports = mongoose.model('ProjectMessage', ProjectMessageSchema);
