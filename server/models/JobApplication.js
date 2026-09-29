const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  degree: { type: String, required: true },
  graduationYear: { type: String, required: true },
  resumeUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  coverNote: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Shortlisted', 'Interviewing', 'Rejected', 'Selected'],
    default: 'Submitted'
  }
}, { timestamps: true });

JobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
