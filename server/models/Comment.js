const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }, // Simple text for comments
  
  // Polymorphic association: A comment can belong to either a Doubt or an Answer
  onModel: {
    type: String,
    required: true,
    enum: ['Doubt', 'Answer']
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
}, { timestamps: true });

// Update the doubt's lastActivityAt when a comment is added
commentSchema.post('save', async function(doc) {
  if (doc.onModel === 'Doubt') {
    const Doubt = mongoose.model('Doubt');
    await Doubt.findByIdAndUpdate(doc.parentId, { lastActivityAt: Date.now() });
  } else if (doc.onModel === 'Answer') {
    const Answer = mongoose.model('Answer');
    const answer = await Answer.findById(doc.parentId);
    if (answer) {
      const Doubt = mongoose.model('Doubt');
      await Doubt.findByIdAndUpdate(answer.doubtId, { lastActivityAt: Date.now() });
    }
  }
});

module.exports = mongoose.model('Comment', commentSchema);

