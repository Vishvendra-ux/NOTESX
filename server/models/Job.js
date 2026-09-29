const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  company: { type: String, required: true, trim: true, index: true },
  companyLogo: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  jobType: {
    type: String,
    required: true,
    enum: ['Full-time', 'Internship', 'Part-time', 'Contract'],
    default: 'Internship',
    index: true
  },
  workplaceType: {
    type: String,
    required: true,
    enum: ['Remote', 'Hybrid', 'On-site'],
    default: 'Remote',
    index: true
  },
  location: { type: String, required: true, default: 'Bengaluru, India' },
  experienceLevel: {
    type: String,
    enum: ['Fresher (0-1 Years)', 'Internship / College Student', '1-3 Years'],
    default: 'Internship / College Student',
    index: true
  },
  eligibleBatches: {
    type: [String],
    default: ['2025', '2026', '2027']
  },
  salary: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Software Engineering',
      'Frontend',
      'Backend',
      'AI & Machine Learning',
      'Data Science & Analytics',
      'DevOps & Cloud',
      'Mobile Engineering',
      'Cybersecurity',
      'Product & Design'
    ],
    index: true
  },
  skills: { type: [String], default: [] },
  description: { type: String, required: true },
  responsibilities: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  perks: { type: [String], default: [] },
  applyUrl: { type: String, default: '' },
  allowDirectApply: { type: Boolean, default: true },
  deadline: { type: Date },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationsCount: { type: Number, default: 0 },
  savesCount: { type: Number, default: 0 },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

JobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', JobSchema);
