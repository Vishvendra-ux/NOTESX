const mongoose = require('mongoose');

const ProjectCollabSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  tagline: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'Mobile App',
      'AI & Machine Learning',
      'DevOps & Cloud',
      'Open Source',
      'Blockchain / Web3',
      'IoT & Robotics',
      'Game Development',
      'Cybersecurity'
    ],
    default: 'Web Development',
    index: true,
  },
  targetGoal: {
    type: String,
    required: true,
    enum: [
      'Hackathon Squad',
      'College Capstone / Final Year',
      'Startup MVP',
      'Open Source Project',
      'Portfolio & Learning'
    ],
    default: 'Hackathon Squad',
    index: true,
  },
  projectStage: {
    type: String,
    enum: ['Idea / Planning', 'Prototype / MVP', 'Active Development', 'Ready to Scale'],
    default: 'Idea / Planning',
  },
  status: {
    type: String,
    enum: ['Looking for Members', 'Team Full', 'Completed'],
    default: 'Looking for Members',
    index: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  rolesNeeded: [{
    roleTitle: { type: String, required: true },
    count: { type: Number, default: 1 },
    filled: { type: Number, default: 0 },
    skills: { type: [String], default: [] },
  }],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creatorName: {
    type: String,
    required: true,
  },
  creatorCollege: {
    type: String,
    default: 'Engineering Campus',
  },
  creatorAvatar: {
    type: String,
    default: '',
  },
  creatorGithub: {
    type: String,
    default: '',
  },
  githubUrl: {
    type: String,
    default: '',
  },
  demoUrl: {
    type: String,
    default: '',
  },
  communicationChannel: {
    type: String,
    default: 'Discord',
  },
  communicationLink: {
    type: String,
    default: '',
  },
  maxTeamSize: {
    type: Number,
    default: 4,
  },
  bookingSlots: [{
    slotNumber: { type: Number, required: true },
    roleTitle: { type: String, required: true },
    skillsRequired: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['available', 'reserved', 'locked'],
      default: 'available'
    },
    filledBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
      college: String,
      avatar: String,
      github: String,
      confirmedAt: { type: Date, default: Date.now }
    }
  }],
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: String,
    college: String,
    avatar: String,
    joinedAt: { type: Date, default: Date.now },
  }],
  // NOTE: applications live in the ProjectApplication collection and
  // per-user upvotes live in the Reaction collection (unbounded relations).
  upvotesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  optimisticConcurrency: true,
});

ProjectCollabSchema.index({ createdAt: -1 });
ProjectCollabSchema.index({ upvotesCount: -1, createdAt: -1 });
ProjectCollabSchema.index({ creatorId: 1, createdAt: -1 });
ProjectCollabSchema.index({ 'members.userId': 1 });
ProjectCollabSchema.index({ status: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('ProjectCollab', ProjectCollabSchema);
