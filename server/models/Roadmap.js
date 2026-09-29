const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Article', 'Documentation', 'Video', 'Course', 'GitHub', 'Book'], default: 'Documentation' },
  url: { type: String, required: true },
  isFree: { type: Boolean, default: true }
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  techStack: [String]
}, { _id: false });

const RoadmapNodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  importance: { type: String, enum: ['Crucial', 'Recommended', 'Optional'], default: 'Crucial' },
  skills: [String],
  resources: [ResourceSchema],
  projects: [ProjectSchema]
}, { _id: false });

const RoadmapStageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  level: { type: String, default: 'Fundamentals' },
  nodes: [RoadmapNodeSchema]
}, { _id: false });

const RoadmapSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development',
      'AI & Data Science',
      'Cloud & DevOps',
      'Mobile & Software',
      'Cybersecurity',
      'Core CS & Placement'
    ],
    index: true
  },
  difficulty: { type: String, enum: ['Beginner Friendly', 'Intermediate', 'Advanced'], default: 'Beginner Friendly' },
  estimatedDuration: { type: String, required: true },
  icon: { type: String, default: 'Compass' },
  color: { type: String, default: 'from-blue-600 to-indigo-600' },
  tags: [String],
  stages: [RoadmapStageSchema],
  careerPaths: [String],
  salaryRange: { type: String, default: '₹8 LPA - ₹25+ LPA' },
  prerequisites: [String],
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', RoadmapSchema);
