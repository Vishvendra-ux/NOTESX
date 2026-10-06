const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true }, // Markdown support
  attachments: [{ type: String }],
  askerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  subjectName: { type: String, default: 'Operating Systems' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  collegeName: { type: String, default: '' },
  topic: { type: String, default: '' },
  tags: [{ type: String, trim: true, lowercase: true }],
  
  // GateOverflow style exam metadata
  examCategory: { type: String, default: 'GATE CSE' }, // 'GATE CSE', 'GATE DA', 'College / Semester', 'ISRO / BARC', 'Practice / General'
  examYear: { type: String, default: '' }, // e.g. 'GATE 2024', 'GATE 2023'
  questionType: { type: String, enum: ['MCQ', 'MSQ', 'NAT', 'Descriptive', 'General'], default: 'General' },
  marks: { type: Number, default: 2 }, // 1 or 2
  options: [{
    label: { type: String }, // 'A', 'B', 'C', 'D'
    text: { type: String }
  }],
  correctOption: { type: String, default: '' }, // e.g. 'B' or '12.5'
  
  // Voting
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Bookmarks
  bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  views: { type: Number, default: 0 },
  
  // Question status
  status: { type: String, enum: ['open', 'closed', 'duplicate', 'resolved'], default: 'open' },
  lastActivityAt: { type: Date, default: Date.now },
  
  // Denormalized counts for better performance
  answersCount: { type: Number, default: 0 },
  hasAcceptedAnswer: { type: Boolean, default: false },
}, { timestamps: true });

// Update lastActivityAt on save if not explicitly modified
doubtSchema.pre('save', function() {
  if (this.isModified() && !this.isModified('lastActivityAt')) {
    this.lastActivityAt = Date.now();
  }
});

// Add text indexing for optimized searching
doubtSchema.index({
  title: 'text',
  description: 'text',
  subjectName: 'text',
  topic: 'text',
  tags: 'text'
}, {
  weights: { title: 10, tags: 8, subjectName: 5, topic: 5, description: 1 }
});

// Query-supporting indexes for the filters and sorts used by doubtController.list
doubtSchema.index({ askerId: 1, createdAt: -1 });
doubtSchema.index({ bookmarkedBy: 1 });
doubtSchema.index({ answersCount: 1, createdAt: -1 });
doubtSchema.index({ hasAcceptedAnswer: 1, createdAt: -1 });
doubtSchema.index({ upvotes: -1, createdAt: -1 });
doubtSchema.index({ lastActivityAt: -1 });
doubtSchema.index({ subjectName: 1, examCategory: 1, createdAt: -1 });

module.exports = mongoose.model('Doubt', doubtSchema);
