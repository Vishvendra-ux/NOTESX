const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const CourseCategory = require('../models/CourseCategory');
const Course = require('../models/Course');
const Branch = require('../models/Branch');
const AcademicYear = require('../models/AcademicYear');
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
const Review = require('../models/Review');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notesx';

const categoriesData = [
  { name: 'Engineering & Technology', slug: 'engineering-technology', icon: 'Laptop', description: 'B.Tech • B.E. • specialized engineering disciplines', order: 1 },
  { name: 'Computer Applications & IT', slug: 'computer-applications-it', icon: 'Code', description: 'BCA • MCA • Software, Cloud & Data Analytics', order: 2 },
  { name: 'Science', slug: 'science', icon: 'Atom', description: 'B.Sc • M.Sc • Physics, Chemistry, Math & Biology', order: 3 },
  { name: 'Commerce', slug: 'commerce', icon: 'BarChart3', description: 'B.Com • M.Com • Banking, Finance & Corporate Accounting', order: 4 },
  { name: 'Management', slug: 'management', icon: 'Briefcase', description: 'BBA • MBA • Marketing, Strategy & HR Management', order: 5 },
  { name: 'Arts & Humanities', slug: 'arts-humanities', icon: 'BookOpen', description: 'BA • MA • Literature, History, Political Science & Sociology', order: 6 },
  { name: 'Law', slug: 'law', icon: 'Scale', description: 'LLB • BA LLB • Constitutional, Criminal & Corporate Law', order: 7 },
  { name: 'Medical & Allied Health', slug: 'medical-allied-health', icon: 'HeartPulse', description: 'MBBS • BDS • BPT • Nursing & Allied Health Sciences', order: 8 },
  { name: 'Pharmacy', slug: 'pharmacy', icon: 'Pill', description: 'B.Pharm • M.Pharm • Pharmacology & Medicinal Chemistry', order: 9 },
  { name: 'Agriculture', slug: 'agriculture', icon: 'Sprout', description: 'B.Sc Agriculture • Agronomy, Soil Science & Plant Genetics', order: 10 },
  { name: 'Architecture & Planning', slug: 'architecture-planning', icon: 'Compass', description: 'B.Arch • Urban Design, Sustainable Structures & CAD', order: 11 },
  { name: 'Design', slug: 'design', icon: 'Palette', description: 'B.Des • UI/UX, Product Design, Graphic & Fashion Design', order: 12 },
  { name: 'Hotel Management', slug: 'hotel-management', icon: 'Utensils', description: 'BHM • Hospitality Operations, Culinary & Tourism', order: 13 },
  { name: 'Media & Journalism', slug: 'media-journalism', icon: 'Radio', description: 'BJMC • Broadcast Journalism, Digital Media & Advertising', order: 14 },
  { name: 'Fashion & Textile', slug: 'fashion-textile', icon: 'Sparkles', description: 'Apparel Design, Textile Tech & Merchandising', order: 15 },
  { name: 'Sports', slug: 'sports', icon: 'Activity', description: 'B.P.Ed • Sports Science, Kinesiology & Physical Education', order: 16 },
  { name: 'Vocational', slug: 'vocational', icon: 'Wrench', description: 'B.Voc • Industrial Automation, Practical Trade & Applied Skills', order: 17 }
];

const all47BtechBranches = [
  { name: 'Computer Science and Engineering', shortCode: 'CSE', category: 'Computer & AI', featured: true, color: 'from-blue-600 to-indigo-600', icon: 'Laptop', description: 'Core computing, algorithms, systems, compilers, networks, and software architecture.' },
  { name: 'Information Technology', shortCode: 'IT', category: 'Computer & AI', featured: true, color: 'from-cyan-600 to-blue-600', icon: 'Globe', description: 'Enterprise computing, internet technologies, web engineering, and database systems.' },
  { name: 'Artificial Intelligence', shortCode: 'AI', category: 'Computer & AI', featured: true, color: 'from-purple-600 to-indigo-600', icon: 'Brain', description: 'Heuristic search, reasoning, autonomous agents, neural models, and cognitive computing.' },
  { name: 'Artificial Intelligence and Machine Learning', shortCode: 'AIML', category: 'Computer & AI', featured: true, color: 'from-violet-600 to-purple-600', icon: 'Sparkles', description: 'Supervised/unsupervised models, computer vision, deep architectures, and predictive analytics.' },
  { name: 'Data Science', shortCode: 'DS', category: 'Computer & AI', featured: true, color: 'from-emerald-600 to-teal-600', icon: 'Database', description: 'Big data pipelines, statistical modeling, machine learning, and data visualization.' },
  { name: 'Computer Science and Data Science', shortCode: 'CS-DS', category: 'Computer & AI', featured: false, color: 'from-teal-600 to-cyan-600', icon: 'BarChart3', description: 'Integration of computer systems, algorithmic design, and large-scale data science.' },
  { name: 'Cyber Security', shortCode: 'CYB', category: 'Computer & AI', featured: true, color: 'from-red-600 to-rose-600', icon: 'Shield', description: 'Network security, cryptography, ethical hacking, digital forensics, and threat analysis.' },
  { name: 'Information Security', shortCode: 'INFOSEC', category: 'Computer & AI', featured: false, color: 'from-rose-600 to-pink-600', icon: 'Lock', description: 'Security policies, risk assessment, access control architectures, and cloud governance.' },
  { name: 'Software Engineering', shortCode: 'SE', category: 'Computer & AI', featured: false, color: 'from-blue-500 to-cyan-600', icon: 'Code', description: 'Software design patterns, agile lifecycle, CI/CD pipelines, and enterprise architectures.' },
  { name: 'Computer Science and Information Technology', shortCode: 'CS-IT', category: 'Computer & AI', featured: false, color: 'from-indigo-600 to-blue-500', icon: 'Layers', description: 'Unified curriculum bridging computational theory with modern IT enterprise solutions.' },
  { name: 'Computer Engineering', shortCode: 'CE', category: 'Computer & AI', featured: false, color: 'from-slate-700 to-blue-600', icon: 'Cpu', description: 'Hardware-software codesign, microprocessors, embedded OS, and VLSI integration.' },
  { name: 'Electronics and Communication Engineering', shortCode: 'ECE', category: 'Electronics & Electrical', featured: true, color: 'from-sky-600 to-blue-700', icon: 'Radio', description: 'Wireless networks, DSP, RF systems, microcontrollers, and telecommunication.' },
  { name: 'Electrical Engineering', shortCode: 'EE', category: 'Electronics & Electrical', featured: true, color: 'from-amber-500 to-orange-600', icon: 'Zap', description: 'Power generation, high voltage networks, electrical machines, and smart grids.' },
  { name: 'Electrical and Electronics Engineering', shortCode: 'EEE', category: 'Electronics & Electrical', featured: false, color: 'from-yellow-500 to-amber-600', icon: 'Zap', description: 'Hybrid discipline covering electric power transmission and solid-state electronics.' },
  { name: 'Electronics Engineering', shortCode: 'ELECTRONICS', category: 'Electronics & Electrical', featured: false, color: 'from-indigo-500 to-sky-600', icon: 'Cpu', description: 'Analog/digital electronic circuit design, semiconductor devices, and sensors.' },
  { name: 'Electronics and Instrumentation Engineering', shortCode: 'EIE', category: 'Electronics & Electrical', featured: false, color: 'from-emerald-500 to-cyan-600', icon: 'Activity', description: 'Process measurement, electronic transducers, medical instrumentation, and telemetry.' },
  { name: 'Instrumentation and Control Engineering', shortCode: 'ICE', category: 'Electronics & Electrical', featured: false, color: 'from-cyan-600 to-teal-700', icon: 'Sliders', description: 'Feedback control systems, SCADA, industrial automation, and robotics control.' },
  { name: 'Mechanical Engineering', shortCode: 'ME', category: 'Mechanical & Allied', featured: true, color: 'from-orange-600 to-red-600', icon: 'Cog', description: 'Thermodynamics, fluid mechanics, machine design, CAD/CAM, and thermal systems.' },
  { name: 'Civil Engineering', shortCode: 'CIVIL', category: 'Civil & Infrastructure', featured: true, color: 'from-amber-600 to-yellow-700', icon: 'HardHat', description: 'Structural engineering, geotech, hydrology, transportation, and surveying.' },
  { name: 'Chemical Engineering', shortCode: 'CHE', category: 'Chemical & Materials', featured: true, color: 'from-emerald-600 to-green-700', icon: 'Beaker', description: 'Reaction kinetics, thermodynamics, mass transfer, and polymer processing.' },
  { name: 'Aerospace Engineering', shortCode: 'AERO-SP', category: 'Mechanical & Allied', featured: true, color: 'from-indigo-600 to-violet-700', icon: 'Rocket', description: 'Aerodynamics, spacecraft propulsion, orbital mechanics, and space structures.' },
  { name: 'Aeronautical Engineering', shortCode: 'AERO-NT', category: 'Mechanical & Allied', featured: false, color: 'from-blue-600 to-sky-700', icon: 'Plane', description: 'Aircraft design, flight mechanics, avionics, jet propulsion, and airworthiness.' },
  { name: 'Automobile Engineering', shortCode: 'AUTO', category: 'Mechanical & Allied', featured: false, color: 'from-red-600 to-orange-700', icon: 'Car', description: 'IC engines, chassis dynamics, electric vehicles (EV), and vehicle telemetry.' },
  { name: 'Biomedical Engineering', shortCode: 'BME', category: 'Chemical & Materials', featured: false, color: 'from-rose-500 to-red-600', icon: 'HeartPulse', description: 'Medical imaging, physiological sensors, artificial organs, and biomaterials.' },
  { name: 'Biotechnology', shortCode: 'BIOTECH', category: 'Chemical & Materials', featured: true, color: 'from-teal-500 to-emerald-600', icon: 'Dna', description: 'Genetic engineering, bioprocesses, bioinformatics, and microbial tech.' },
  { name: 'Industrial Engineering', shortCode: 'IE', category: 'Mechanical & Allied', featured: false, color: 'from-slate-600 to-stone-700', icon: 'Factory', description: 'Operations research, supply chain, ergonomics, and production scheduling.' },
  { name: 'Production Engineering', shortCode: 'PE', category: 'Mechanical & Allied', featured: false, color: 'from-stone-600 to-neutral-700', icon: 'Hammer', description: 'Metal casting, forming, machining, CNC automation, and quality control.' },
  { name: 'Manufacturing Engineering', shortCode: 'MFG', category: 'Mechanical & Allied', featured: false, color: 'from-neutral-600 to-zinc-700', icon: 'Settings', description: 'Additive manufacturing, lean systems, robotics assembly, and plant automation.' },
  { name: 'Mechatronics Engineering', shortCode: 'MTRX', category: 'Mechanical & Allied', featured: false, color: 'from-violet-600 to-purple-700', icon: 'Bot', description: 'Electro-mechanical systems, sensors, programmable PLCs, and micro-actuators.' },
  { name: 'Robotics and Automation', shortCode: 'ROBOTICS', category: 'Mechanical & Allied', featured: true, color: 'from-purple-600 to-indigo-700', icon: 'Bot', description: 'Autonomous navigation, robot kinematics, SLAM, ROS, and computer vision.' },
  { name: 'Environmental Engineering', shortCode: 'ENV', category: 'Civil & Infrastructure', featured: false, color: 'from-green-600 to-teal-700', icon: 'Leaf', description: 'Water purification, air pollution control, waste management, and EIA.' },
  { name: 'Petroleum Engineering', shortCode: 'PETRO', category: 'Chemical & Materials', featured: false, color: 'from-amber-700 to-yellow-800', icon: 'Flame', description: 'Drilling engineering, reservoir simulations, oil recovery, and petrophysics.' },
  { name: 'Mining Engineering', shortCode: 'MINING', category: 'Civil & Infrastructure', featured: false, color: 'from-stone-700 to-slate-800', icon: 'Mountain', description: 'Surface/underground mining, rock mechanics, mine surveying, and ventilation.' },
  { name: 'Metallurgical Engineering', shortCode: 'MET', category: 'Chemical & Materials', featured: false, color: 'from-slate-600 to-zinc-700', icon: 'Boxes', description: 'Extractive metallurgy, alloy development, phase diagrams, and heat treatment.' },
  { name: 'Materials Engineering', shortCode: 'MAT', category: 'Chemical & Materials', featured: false, color: 'from-zinc-600 to-slate-700', icon: 'Boxes', description: 'Nanomaterials, polymers, smart composites, and mechanical characterization.' },
  { name: 'Marine Engineering', shortCode: 'MARINE', category: 'Mechanical & Allied', featured: false, color: 'from-cyan-700 to-blue-800', icon: 'Ship', description: 'Ship propulsion, marine diesel powerplants, naval architecture, and navigation.' },
  { name: 'Agricultural Engineering', shortCode: 'AGRI', category: 'Civil & Infrastructure', featured: false, color: 'from-lime-600 to-green-700', icon: 'Sprout', description: 'Farm machinery, precision irrigation, soil conservation, and post-harvest tech.' },
  { name: 'Food Technology', shortCode: 'FOODTECH', category: 'Chemical & Materials', featured: false, color: 'from-yellow-600 to-orange-600', icon: 'Utensils', description: 'Food chemistry, preservation, quality audit (HACCP), and beverage packaging.' },
  { name: 'Food Engineering', shortCode: 'FOODENG', category: 'Chemical & Materials', featured: false, color: 'from-orange-500 to-amber-600', icon: 'Utensils', description: 'Thermal processing, rheology, food plant design, and bioprocess equipment.' },
  { name: 'Textile Engineering', shortCode: 'TEXTILE', category: 'Chemical & Materials', featured: false, color: 'from-pink-600 to-rose-700', icon: 'Sparkles', description: 'Fibre science, yarn spinning, weaving tech, dyeing, and smart textiles.' },
  { name: 'Printing Technology', shortCode: 'PRINT', category: 'Chemical & Materials', featured: false, color: 'from-fuchsia-600 to-purple-700', icon: 'Printer', description: 'Offset printing, digital packaging, prepress, colorimetry, and inks.' },
  { name: 'Polymer Engineering', shortCode: 'POLYMER', category: 'Chemical & Materials', featured: false, color: 'from-teal-600 to-cyan-700', icon: 'Beaker', description: 'Polymer synthesis, injection moulding, elastomers, and bioplastics.' },
  { name: 'Ceramic Engineering', shortCode: 'CERAMIC', category: 'Chemical & Materials', featured: false, color: 'from-amber-600 to-stone-700', icon: 'Gem', description: 'Refractories, optical glass, bioceramics, structural ceramics, and kilns.' },
  { name: 'Mining Machinery Engineering', shortCode: 'MINE-MACH', category: 'Civil & Infrastructure', featured: false, color: 'from-zinc-700 to-neutral-800', icon: 'Wrench', description: 'Excavators, draglines, underground transport, hydraulic pumps, and maintenance.' },
  { name: 'Fire and Safety Engineering', shortCode: 'FIRE-SAFE', category: 'Civil & Infrastructure', featured: false, color: 'from-red-600 to-orange-700', icon: 'ShieldAlert', description: 'Industrial hazard analysis, fire dynamics, explosion safety, and egress design.' },
  { name: 'Construction Engineering', shortCode: 'CONST', category: 'Civil & Infrastructure', featured: false, color: 'from-amber-600 to-orange-700', icon: 'HardHat', description: 'Construction project management, BIM 3D modeling, estimation, and safety.' },
  { name: 'Architectural Engineering', shortCode: 'ARCH-ENG', category: 'Civil & Infrastructure', featured: false, color: 'from-sky-700 to-indigo-800', icon: 'Compass', description: 'Building energy modeling, structural systems, HVAC, acoustics, and daylighting.' }
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB successfully!');

  // Get or create a sample user for uploading and reviews
  let adminUser = await User.findOne({ email: 'pratapsinghvishvendra6@gmail.com' });
  if (!adminUser) {
    adminUser = await User.findOne();
  }

  // Clear existing notes hierarchy collections cleanly to re-seed fresh database-driven structures
  console.log('Refreshing course categories, degrees, branches, subjects, and notes...');
  await CourseCategory.deleteMany({});
  await Course.deleteMany({});
  await Branch.deleteMany({});
  await AcademicYear.deleteMany({});
  await Semester.deleteMany({});
  await Subject.deleteMany({});
  await Review.deleteMany({});

  // 1. Seed Categories
  const categoryDocs = await CourseCategory.insertMany(categoriesData);
  const catMap = {};
  categoryDocs.forEach(c => { catMap[c.slug] = c._id; });
  console.log(`Seeded ${categoryDocs.length} Course Categories`);

  // 2. Seed Degrees / Courses
  const coursesData = [
    { name: 'B.Tech', slug: 'btech', categoryId: catMap['engineering-technology'], durationYears: 4, badge: 'Popular Degree', description: 'Bachelor of Technology with 47 specialized engineering branches.' },
    { name: 'B.E.', slug: 'be', categoryId: catMap['engineering-technology'], durationYears: 4, badge: 'Engineering', description: 'Bachelor of Engineering foundational curriculum.' },
    { name: 'B.Tech (Honours)', slug: 'btech-honours', categoryId: catMap['engineering-technology'], durationYears: 4, badge: 'Honours', description: 'Advanced honours programme with specialization minors.' },
    { name: 'Other Engineering Programmes', slug: 'other-engineering', categoryId: catMap['engineering-technology'], durationYears: 4, badge: 'Allied', description: 'Dual degree and integrated diploma-to-degree programmes.' },
    { name: 'BCA', slug: 'bca', categoryId: catMap['computer-applications-it'], durationYears: 3, badge: 'Popular Degree', description: 'Bachelor of Computer Applications for software and web systems.' },
    { name: 'MCA', slug: 'mca', categoryId: catMap['computer-applications-it'], durationYears: 2, badge: 'Postgraduate', description: 'Master of Computer Applications enterprise architectures.' },
    { name: 'B.Com', slug: 'bcom', categoryId: catMap['commerce'], durationYears: 3, badge: 'Popular Degree', description: 'Bachelor of Commerce corporate accounting, taxation and audit.' },
    { name: 'BBA', slug: 'bba', categoryId: catMap['management'], durationYears: 3, badge: 'Popular Degree', description: 'Bachelor of Business Administration organizational strategy.' }
  ];

  const courseDocs = await Course.insertMany(coursesData);
  const btechCourse = courseDocs.find(c => c.slug === 'btech');
  const bcaCourse = courseDocs.find(c => c.slug === 'bca');
  const bcomCourse = courseDocs.find(c => c.slug === 'bcom');
  console.log(`Seeded ${courseDocs.length} Courses`);

  // Update category courseCount
  await CourseCategory.findByIdAndUpdate(catMap['engineering-technology'], { courseCount: 4 });
  await CourseCategory.findByIdAndUpdate(catMap['computer-applications-it'], { courseCount: 2 });
  await CourseCategory.findByIdAndUpdate(catMap['commerce'], { courseCount: 2 });
  await CourseCategory.findByIdAndUpdate(catMap['management'], { courseCount: 2 });

  // 3. Seed Branches for B.Tech
  const branchDocsToInsert = all47BtechBranches.map(b => ({
    name: b.name,
    slug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    courseId: btechCourse._id,
    shortCode: b.shortCode,
    category: b.category,
    featured: b.featured,
    color: b.color,
    icon: b.icon,
    description: b.description,
    studentCount: Math.floor(Math.random() * 8000) + 4000,
    contributorCount: Math.floor(Math.random() * 500) + 150
  }));

  // Add sample branch for BCA and B.Com to showcase multi-course architecture
  branchDocsToInsert.push({
    name: 'Computer Applications & Web Tech',
    slug: 'computer-applications-web-tech',
    courseId: bcaCourse._id,
    shortCode: 'BCA-GEN',
    category: 'Computer Applications & IT',
    featured: true,
    color: 'from-blue-600 to-cyan-600',
    icon: 'Laptop',
    description: 'Full stack development, database concepts, and operating systems for BCA.',
    studentCount: 6500,
    contributorCount: 230
  });

  branchDocsToInsert.push({
    name: 'Accounting and Finance',
    slug: 'accounting-and-finance',
    courseId: bcomCourse._id,
    shortCode: 'BCOM-ACC',
    category: 'Commerce',
    featured: true,
    color: 'from-emerald-600 to-teal-700',
    icon: 'BarChart3',
    description: 'Corporate accounting, cost management, direct tax laws, and business auditing.',
    studentCount: 9200,
    contributorCount: 340
  });

  const branchDocs = await Branch.insertMany(branchDocsToInsert);
  console.log(`Seeded ${branchDocs.length} Branches across Courses`);

  // Update B.Tech branchesCount
  await Course.findByIdAndUpdate(btechCourse._id, { branchesCount: 47 });
  await Course.findByIdAndUpdate(bcaCourse._id, { branchesCount: 1 });
  await Course.findByIdAndUpdate(bcomCourse._id, { branchesCount: 1 });

  // 4. Seed Years and Semesters
  const cseBranch = branchDocs.find(b => b.shortCode === 'CSE');
  const aimlBranch = branchDocs.find(b => b.shortCode === 'AIML');
  const eceBranch = branchDocs.find(b => b.shortCode === 'ECE');
  const meBranch = branchDocs.find(b => b.shortCode === 'ME');
  const aeroBranch = branchDocs.find(b => b.shortCode === 'AERO-SP');

  // Helper to generate years and semesters dynamically based on course duration
  for (const branch of branchDocs) {
    const isBTech = branch.courseId.toString() === btechCourse._id.toString();
    const duration = isBTech ? 4 : 3;

    for (let yr = 1; yr <= duration; yr++) {
      const yearName = `${yr}${yr === 1 ? 'st' : yr === 2 ? 'nd' : yr === 3 ? 'rd' : 'th'} Year`;
      await AcademicYear.create({
        yearNumber: yr,
        name: yearName,
        courseId: branch.courseId,
        branchId: branch._id,
        subjectsCount: 6,
        notesCount: Math.floor(Math.random() * 80) + 20
      });

      const sem1 = (yr * 2) - 1;
      const sem2 = yr * 2;

      await Semester.create({
        branchId: branch._id,
        courseId: branch.courseId,
        yearNumber: yr,
        semesterNumber: sem1,
        name: `Semester ${sem1}`,
        subjectsCount: 6,
        notesCount: Math.floor(Math.random() * 40) + 15
      });

      await Semester.create({
        branchId: branch._id,
        courseId: branch.courseId,
        yearNumber: yr,
        semesterNumber: sem2,
        name: `Semester ${sem2}`,
        subjectsCount: 6,
        notesCount: Math.floor(Math.random() * 40) + 15
      });
    }
  }
  console.log('Seeded dynamic Academic Years and Semesters across all branches!');

  // 5. Seed Real Subjects for Branches (especially CSE, AIML, ECE, Mechanical, Aerospace)
  const cseSubjects = [
    // Sem 5
    { name: 'Operating Systems', code: 'CS501', yearNumber: 3, semesterNumber: 5, credits: 4, notesCount: 1248, contributorCount: 428, ratingAverage: 4.7, icon: 'Laptop' },
    { name: 'Database Management Systems', code: 'CS502', yearNumber: 3, semesterNumber: 5, credits: 4, notesCount: 890, contributorCount: 310, ratingAverage: 4.8, icon: 'Database' },
    { name: 'Computer Networks', code: 'CS503', yearNumber: 3, semesterNumber: 5, credits: 4, notesCount: 650, contributorCount: 220, ratingAverage: 4.6, icon: 'Globe' },
    { name: 'Theory of Computation', code: 'CS504', yearNumber: 3, semesterNumber: 5, credits: 4, notesCount: 910, contributorCount: 290, ratingAverage: 4.9, icon: 'Brain' },
    { name: 'Software Engineering', code: 'CS505', yearNumber: 3, semesterNumber: 5, credits: 3, notesCount: 430, contributorCount: 150, ratingAverage: 4.5, icon: 'Code' },
    { name: 'Web Technologies', code: 'CS506', yearNumber: 3, semesterNumber: 5, credits: 3, notesCount: 520, contributorCount: 190, ratingAverage: 4.7, icon: 'Layers' },
    // Sem 6
    { name: 'Compiler Design', code: 'CS601', yearNumber: 3, semesterNumber: 6, credits: 4, notesCount: 450, contributorCount: 130, ratingAverage: 4.8, icon: 'Code' },
    { name: 'Artificial Intelligence', code: 'CS602', yearNumber: 3, semesterNumber: 6, credits: 4, notesCount: 780, contributorCount: 240, ratingAverage: 4.9, icon: 'Sparkles' },
    { name: 'Cloud Computing', code: 'CS603', yearNumber: 3, semesterNumber: 6, credits: 3, notesCount: 360, contributorCount: 110, ratingAverage: 4.6, icon: 'Globe' },
    // Sem 3
    { name: 'Data Structures & Algorithms', code: 'CS301', yearNumber: 2, semesterNumber: 3, credits: 4, notesCount: 2300, contributorCount: 620, ratingAverage: 4.9, icon: 'Cpu' },
    { name: 'Computer Organization & Architecture', code: 'CS302', yearNumber: 2, semesterNumber: 3, credits: 4, notesCount: 680, contributorCount: 190, ratingAverage: 4.7, icon: 'Cpu' },
    { name: 'Discrete Mathematics', code: 'CS303', yearNumber: 2, semesterNumber: 3, credits: 4, notesCount: 840, contributorCount: 210, ratingAverage: 4.8, icon: 'BookOpen' }
  ];

  const insertedCseSubjects = [];
  for (const s of cseSubjects) {
    const semDoc = await Semester.findOne({ branchId: cseBranch._id, semesterNumber: s.semesterNumber });
    const sub = await Subject.create({
      ...s,
      slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      branchId: cseBranch._id,
      courseId: btechCourse._id,
      semesterId: semDoc ? semDoc._id : null,
      description: `Comprehensive syllabus and study resources for ${s.name} (${s.code}).`
    });
    insertedCseSubjects.push(sub);
  }

  // Seed sample subjects for other branches
  const otherBranchSubjectsData = [
    { branch: aimlBranch, name: 'Machine Learning Algorithms', code: 'AI501', sem: 5, yr: 3 },
    { branch: aimlBranch, name: 'Deep Learning Architectures', code: 'AI502', sem: 5, yr: 3 },
    { branch: aimlBranch, name: 'Natural Language Processing', code: 'AI503', sem: 5, yr: 3 },
    { branch: eceBranch, name: 'Digital Signal Processing (DSP)', code: 'EC501', sem: 5, yr: 3 },
    { branch: eceBranch, name: 'VLSI Design & CMOS Circuits', code: 'EC502', sem: 5, yr: 3 },
    { branch: meBranch, name: 'Strength of Materials (SOM)', code: 'ME301', sem: 3, yr: 2 },
    { branch: meBranch, name: 'Engineering Thermodynamics', code: 'ME401', sem: 4, yr: 2 },
    { branch: aeroBranch, name: 'Aerodynamics & Compressible Flow', code: 'AE501', sem: 5, yr: 3 },
    { branch: aeroBranch, name: 'Aircraft Propulsion & Jet Engines', code: 'AE502', sem: 5, yr: 3 }
  ];

  for (const item of otherBranchSubjectsData) {
    if (item.branch) {
      const semDoc = await Semester.findOne({ branchId: item.branch._id, semesterNumber: item.sem });
      await Subject.create({
        name: item.name,
        code: item.code,
        slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        branchId: item.branch._id,
        courseId: btechCourse._id,
        semesterId: semDoc ? semDoc._id : null,
        yearNumber: item.yr,
        semesterNumber: item.sem,
        credits: 4,
        notesCount: Math.floor(Math.random() * 40) + 10,
        contributorCount: Math.floor(Math.random() * 30) + 5,
        ratingAverage: 4.8,
        description: `Official subject syllabus materials for ${item.name}.`
      });
    }
  }

  console.log(`Seeded subjects across branches!`);

  // 6. Seed High Quality Notes for Operating Systems & Core Subjects
  const osSub = insertedCseSubjects.find(s => s.name === 'Operating Systems');
  const dbmsSub = insertedCseSubjects.find(s => s.name === 'Database Management Systems');
  const dsaSub = insertedCseSubjects.find(s => s.name === 'Data Structures & Algorithms');

  const uploaderId = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

  // Clear existing notes to seed fresh linked notes
  await Note.deleteMany({});

  const sampleNotes = [
    {
      title: 'Process Synchronization — Complete Notes & Peterson Algorithm',
      description: 'Comprehensive handwritten guide covering Race Conditions, Critical Section Problem, Semaphores, Mutex Locks, and Classic Synchronization Problems (Dining Philosophers & Bounded Buffer).',
      subjectId: osSub._id,
      branchId: cseBranch._id,
      courseId: btechCourse._id,
      college: 'GLA University',
      branch: 'Computer Science and Engineering',
      subject: 'Operating Systems',
      course: 'B.Tech CSE',
      year: '3rd Year',
      yearNumber: 3,
      semester: 'Semester 5',
      semesterNumber: 5,
      unit: 'Unit 3',
      topic: 'Process Synchronization & Semaphores',
      uploaderId: uploaderId,
      fileUrl: '/uploads/sample_os_unit3.pdf',
      fileType: 'pdf',
      fileSize: 2450000,
      tags: ['Operating Systems', 'Process Synchronization', 'Semaphores', 'Unit 3', 'GATE'],
      status: 'approved',
      ratingAverage: 4.8,
      ratingCount: 124,
      downloadCount: 1240,
      views: 2850
    },
    {
      title: 'Deadlock Detection, Prevention & Avoidance Banker Algorithm',
      description: 'Step-by-step mathematical examples of Resource Allocation Graphs (RAG), Safe State check, Banker\'s Algorithm matrices (Allocation, Max, Need), and Deadlock Recovery techniques.',
      subjectId: osSub._id,
      branchId: cseBranch._id,
      courseId: btechCourse._id,
      college: 'IIT Delhi',
      branch: 'Computer Science and Engineering',
      subject: 'Operating Systems',
      course: 'B.Tech CSE',
      year: '3rd Year',
      yearNumber: 3,
      semester: 'Semester 5',
      semesterNumber: 5,
      unit: 'Unit 3',
      topic: 'Deadlock Management',
      uploaderId: uploaderId,
      fileUrl: '/uploads/sample_os_deadlocks.pdf',
      fileType: 'pdf',
      fileSize: 1840000,
      tags: ['Deadlocks', 'Bankers Algorithm', 'Operating Systems', 'Unit 3'],
      status: 'approved',
      ratingAverage: 4.9,
      ratingCount: 88,
      downloadCount: 980,
      views: 1940
    },
    {
      title: 'CPU Scheduling Algorithms with Solved Gantt Charts',
      description: 'Comparison of FCFS, SJF (Preemptive and Non-Preemptive), Round Robin with varied time quantum, Priority Scheduling, and Multi-level Feedback Queue calculation of Turnaround Time and Waiting Time.',
      subjectId: osSub._id,
      branchId: cseBranch._id,
      courseId: btechCourse._id,
      college: 'DTU',
      branch: 'Computer Science and Engineering',
      subject: 'Operating Systems',
      course: 'B.Tech CSE',
      year: '3rd Year',
      yearNumber: 3,
      semester: 'Semester 5',
      semesterNumber: 5,
      unit: 'Unit 2',
      topic: 'CPU Scheduling',
      uploaderId: uploaderId,
      fileUrl: '/uploads/sample_os_scheduling.pdf',
      fileType: 'pdf',
      fileSize: 3100000,
      tags: ['CPU Scheduling', 'Gantt Charts', 'SJF', 'Round Robin', 'Unit 2'],
      status: 'approved',
      ratingAverage: 4.9,
      ratingCount: 165,
      downloadCount: 2300,
      views: 4500
    },
    {
      title: 'Virtual Memory, Paging, Segmentation & Page Replacement FIFO/LRU',
      description: 'Detailed analysis of Paging hardware, TLB hit/miss ratio calculations, Inverted Page Tables, Segmentation with Paging, and Page Replacement Algorithms (FIFO, LRU, Optimal, Belady\'s Anomaly).',
      subjectId: osSub._id,
      branchId: cseBranch._id,
      courseId: btechCourse._id,
      college: 'IIT Bombay',
      branch: 'Computer Science and Engineering',
      subject: 'Operating Systems',
      course: 'B.Tech CSE',
      year: '3rd Year',
      yearNumber: 3,
      semester: 'Semester 5',
      semesterNumber: 5,
      unit: 'Unit 4',
      topic: 'Memory Management',
      uploaderId: uploaderId,
      fileUrl: '/uploads/sample_os_paging.pdf',
      fileType: 'pdf',
      fileSize: 2200000,
      tags: ['Virtual Memory', 'Paging', 'LRU', 'Memory Management', 'Unit 4'],
      status: 'approved',
      ratingAverage: 4.7,
      ratingCount: 64,
      downloadCount: 840,
      views: 1650
    },
    // DBMS Notes
    {
      title: 'Complete Relational Normalization (1NF, 2NF, 3NF, BCNF) with Solved Gate PYQs',
      description: 'Functional dependencies, Attribute Closure, Minimal Cover, Lossless Join Decomposition, Dependency Preservation, and Step-by-step conversion of tables to BCNF.',
      subjectId: dbmsSub._id,
      branchId: cseBranch._id,
      courseId: btechCourse._id,
      college: 'GLA University',
      branch: 'Computer Science and Engineering',
      subject: 'Database Management Systems',
      course: 'B.Tech CSE',
      year: '3rd Year',
      yearNumber: 3,
      semester: 'Semester 5',
      semesterNumber: 5,
      unit: 'Unit 2',
      topic: 'Normalization',
      uploaderId: uploaderId,
      fileUrl: '/uploads/sample_dbms_norm.pdf',
      fileType: 'pdf',
      fileSize: 1950000,
      tags: ['DBMS', 'Normalization', 'BCNF', 'Unit 2'],
      status: 'approved',
      ratingAverage: 4.9,
      ratingCount: 94,
      downloadCount: 1540,
      views: 2780
    },
    // DSA Notes
    {
      title: 'Graph Algorithms Cheat Sheet: Dijkstra, Bellman-Ford, Kruskal, Prim & Topological Sort',
      description: 'Shortest path derivations, MST proofs, cycle detection in directed/undirected graphs, adjacency list implementation, and complexity comparisons.',
      subjectId: dsaSub._id,
      branchId: cseBranch._id,
      courseId: btechCourse._id,
      college: 'IIT Delhi',
      branch: 'Computer Science and Engineering',
      subject: 'Data Structures & Algorithms',
      course: 'B.Tech CSE',
      year: '2nd Year',
      yearNumber: 2,
      semester: 'Semester 3',
      semesterNumber: 3,
      unit: 'Unit 5',
      topic: 'Graphs & Advanced Algorithms',
      uploaderId: uploaderId,
      fileUrl: '/uploads/sample_dsa_graphs.pdf',
      fileType: 'pdf',
      fileSize: 2800000,
      tags: ['DSA', 'Graphs', 'Dijkstra', 'Topological Sort'],
      status: 'approved',
      ratingAverage: 5.0,
      ratingCount: 210,
      downloadCount: 3400,
      views: 5900
    }
  ];

  const noteDocs = await Note.insertMany(sampleNotes);
  console.log(`Seeded ${noteDocs.length} Core Notes with full metadata!`);

  // 7. Seed Real User Reviews for the first note
  const primaryNote = noteDocs[0];
  const sampleReviews = [
    {
      noteId: primaryNote._id,
      userId: uploaderId,
      rating: 5,
      review: 'Very useful notes! Especially helpful for Unit 3 university exams. The semaphore examples are crystal clear.',
      helpfulCount: 24
    }
  ];

  await Review.insertMany(sampleReviews);
  console.log('Seeded sample reviews!');

  console.log('✅ Notes hierarchy database seeding completed successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
