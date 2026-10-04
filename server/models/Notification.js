const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['answer', 'comment', 'answer_accepted', 'application_received',
           'application_accepted', 'application_declined', 'project_message', 'system'],
    required: true
  },
  title: { type: String, required: true },
  link: { type: String, default: '' },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  readAt: { type: Date, default: null }
}, { timestamps: true });

NotificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });
// Auto-expire after 90 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

module.exports = mongoose.model('Notification', NotificationSchema);
