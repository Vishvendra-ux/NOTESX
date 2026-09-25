const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true }, // Markdown support
  attachments: [{ type: String }],
  askerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  topic: { type: String },
  tags: [{ type: String, trim: true, lowercase: true }],
  
  // GateOverflow style features
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  views: { type: Number, default: 0 },
  
  // Question status
  status: { type: String, enum: ['open', 'closed', 'duplicate', 'resolved'], default: 'open' },
  lastActivityAt: { type: Date, default: Date.now },
  
  // Denormalized counts for better performance
  answersCount: { type: Number, default: 0 },
  hasAcceptedAnswer: { type: Boolean, default: false },
}, { timestamps: true });

// Update lastActivityAt on save if not explicitly modified
doubtSchema.pre('save', function(next) {
  if (this.isModified() && !this.isModified('lastActivityAt')) {
    this.lastActivityAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Doubt', doubtSchema);
