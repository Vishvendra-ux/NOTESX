const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  points: { type: Number, default: 100 },
  category: { type: String, default: 'Algorithms' },
  description: { type: String, required: true },
  inputFormat: { type: String },
  outputFormat: { type: String },
  constraints: { type: String },
  sampleInput: { type: String },
  sampleOutput: { type: String },
  explanation: { type: String },
  starterCode: {
    python: { type: String },
    javascript: { type: String },
    cpp: { type: String },
    java: { type: String }
  },
  testCases: [
    {
      input: String,
      expectedOutput: String,
      isHidden: { type: Boolean, default: false }
    }
  ]
}, { _id: false });

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, default: 'Anonymous Student' },
  collegeName: { type: String, default: 'GLA University' },
  questionId: { type: String, required: true },
  language: { type: String, default: 'python' },
  code: { type: String },
  status: { type: String, enum: ['Accepted', 'Wrong Answer', 'Syntax Error', 'Time Limit Exceeded'], default: 'Accepted' },
  pointsAwarded: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

const leaderboardEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  avatar: { type: String, default: '' },
  collegeName: { type: String, required: true },
  solvedCount: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  solvedQuestions: [{ type: String }],
  lastSolvedAt: { type: Date, default: Date.now }
});

const collegeLeaderboardEntrySchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  score: { type: Number, default: 0 },
  solvedCount: { type: Number, default: 0 },
  studentCount: { type: Number, default: 0 },
  rankChange: { type: String, default: '0' },
  lastActive: { type: Date, default: Date.now }
});

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String },
  type: { type: String, enum: ['Coding', 'Quiz', 'Gaming'], default: 'Coding' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' }, // If it's a college-specific contest
  rules: { type: String },
  status: { type: String, enum: ['Upcoming', 'Live', 'Completed', 'Cancelled'], default: 'Live' },
  totalXpPool: { type: Number, default: 10000 },
  questions: [questionSchema],
  submissions: [submissionSchema],
  leaderboard: [leaderboardEntrySchema],
  collegeLeaderboard: [collegeLeaderboardEntrySchema],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);


