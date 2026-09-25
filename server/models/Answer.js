const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  doubtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doubt', required: true },
  answererId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }, // Markdown support
  attachments: [{ type: String }],
  
  // GateOverflow style features
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  isAccepted: { type: Boolean, default: false },
}, { timestamps: true });

// After saving an answer, update the parent Doubt's answersCount and lastActivityAt
answerSchema.post('save', async function(doc) {
  const Doubt = mongoose.model('Doubt');
  await Doubt.findByIdAndUpdate(doc.doubtId, {
    $inc: { answersCount: 1 },
    lastActivityAt: Date.now()
  });
});

// If answer is removed, decrement the count
answerSchema.post('remove', async function(doc) {
  const Doubt = mongoose.model('Doubt');
  await Doubt.findByIdAndUpdate(doc.doubtId, {
    $inc: { answersCount: -1 }
  });
});

module.exports = mongoose.model('Answer', answerSchema);
