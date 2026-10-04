const mongoose = require('mongoose');

// One document per (project, applicant) request. Replaces the unbounded
// `applications` array that used to be embedded in ProjectCollab.
const ProjectApplicationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectCollab', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotNumber: { type: Number },
  slotRole: { type: String },
  applicantName: String,
  applicantCollege: String,
  applicantEmail: String, // PRIVATE: only ever returned to the project creator/admin
  applicantPhoneOrContact: String, // PRIVATE
  applicantAvatar: String,
  roleApplied: String,
  skillsSummary: String,
  pitchMessage: String,
  portfolioOrGithub: String,
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date }
}, { timestamps: true });

// Only one open (pending) request per user per project.
ProjectApplicationSchema.index(
  { projectId: 1, applicantId: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);
ProjectApplicationSchema.index({ projectId: 1, status: 1, appliedAt: -1 });
ProjectApplicationSchema.index({ applicantId: 1, appliedAt: -1 });

module.exports = mongoose.model('ProjectApplication', ProjectApplicationSchema);
