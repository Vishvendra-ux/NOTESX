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

// After creating an answer, update the parent Doubt's answersCount and lastActivityAt.
// Only fire on new documents — vote/accept updates also call save() and must not
// increment the count again.
answerSchema.post('save', async function(doc) {
  if (!this.$isNew) return;
  const Doubt = mongoose.model('Doubt');
  await Doubt.findByIdAndUpdate(doc.doubtId, {
    $inc: { answersCount: 1 },
    lastActivityAt: Date.now()
  });
});

// answersCount is maintained explicitly: incremented by the hook above on creation
// and recomputed in answerController.deleteAnswer, which uses findByIdAndDelete
// (a query operation that does not fire document 'remove' hooks).

module.exports = mongoose.model('Answer', answerSchema);
