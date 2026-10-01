const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');

const escapeRegex = (s) => String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    List all jobs with rich search, filters & pagination
// @route   GET /api/jobs
// @access  Public
exports.list = async (req, res, next) => {
  try {
    const {
      search = '',
      jobType,
      workplaceType,
      category,
      experienceLevel,
      batch,
      location,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    if (search && search.trim()) {
      const s = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { company: { $regex: s, $options: 'i' } },
        { skills: { $in: [new RegExp(s, 'i')] } },
        { location: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } }
      ];
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (workplaceType && workplaceType !== 'All') {
      query.workplaceType = workplaceType;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    if (batch && batch !== 'All') {
      query.eligibleBatches = { $in: [batch] };
    }

    if (location && location !== 'All') {
      query.location = { $regex: escapeRegex(location), $options: 'i' };
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { applicationsCount: -1, savesCount: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * take;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(take)
        .lean(),
      Job.countDocuments(query)
    ]);

    const userIdStr = req.user ? req.user._id.toString() : null;

    const formatted = jobs.map(job => ({
      ...job,
      isSaved: userIdStr ? job.savedBy?.some(id => id.toString() === userIdStr) : false
    }));

    res.json({
      jobs: formatted,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / take)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get portal stats (total jobs, internships, companies)
// @route   GET /api/jobs/stats
// @access  Public
exports.stats = async (req, res, next) => {
  try {
    const [totalJobs, totalInternships, totalFullTime, remoteJobs, categories, companies] = await Promise.all([
      Job.countDocuments({ isActive: true }),
      Job.countDocuments({ isActive: true, jobType: 'Internship' }),
      Job.countDocuments({ isActive: true, jobType: 'Full-time' }),
      Job.countDocuments({ isActive: true, workplaceType: 'Remote' }),
      Job.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Job.distinct('company', { isActive: true })
    ]);

    res.json({
      totalJobs,
      totalInternships,
      totalFullTime,
      remoteJobs,
      topCompaniesCount: companies.length,
      categories: categories.map(c => ({ name: c._id, count: c.count }))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID with related jobs & application status
// @route   GET /api/jobs/:id
// @access  Public
exports.get = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name collegeName role');

    if (!job) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    const userIdStr = req.user ? req.user._id.toString() : null;
    let hasApplied = false;

    if (userIdStr) {
      hasApplied = await JobApplication.exists({ jobId: job._id, applicantId: req.user._id });
    }

    // Related jobs in same domain
    const related = await Job.find({
      _id: { $ne: job._id },
      category: job.category,
      isActive: true
    })
      .select('title company companyLogo location workplaceType salary jobType eligibleBatches')
      .limit(4)
      .lean();

    res.json({
      ...job.toObject(),
      isSaved: userIdStr ? job.savedBy?.some(id => id.toString() === userIdStr) : false,
      hasApplied: Boolean(hasApplied),
      related
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job opportunity
// @route   POST /api/jobs
// @access  Private
exports.create = async (req, res, next) => {
  try {
    const {
      title,
      company,
      companyLogo,
      companyWebsite,
      jobType,
      workplaceType,
      location,
      experienceLevel,
      eligibleBatches,
      salary,
      category,
      skills,
      description,
      responsibilities,
      requirements,
      perks,
      applyUrl,
      allowDirectApply,
      deadline
    } = req.body;

    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'recruiter')) {
      return res.status(403).json({ message: 'Access denied. Only recruiters and administrators can post jobs.' });
    }

    if (!title || !company || !salary || !description) {
      return res.status(400).json({ message: 'Title, company, salary, and description are required.' });
    }

    const job = await Job.create({
      title: title.trim(),
      company: company.trim(),
      companyLogo: companyLogo || '',
      companyWebsite: companyWebsite || '',
      jobType: jobType || 'Internship',
      workplaceType: workplaceType || 'Remote',
      location: location || 'Bengaluru, India',
      experienceLevel: experienceLevel || 'Internship / College Student',
      eligibleBatches: Array.isArray(eligibleBatches) ? eligibleBatches : ['2025', '2026'],
      salary: salary.trim(),
      category: category || 'Software Engineering',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      description: description.trim(),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      requirements: Array.isArray(requirements) ? requirements : [],
      perks: Array.isArray(perks) ? perks : [],
      applyUrl: applyUrl || '',
      allowDirectApply: allowDirectApply !== undefined ? allowDirectApply : true,
      deadline: deadline ? new Date(deadline) : null,
      postedBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark / save on a job
// @route   POST /api/jobs/:id/save
// @access  Private
exports.toggleSave = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const userId = req.user._id.toString();
    const isSaved = job.savedBy.some(id => id.toString() === userId);

    if (isSaved) {
      job.savedBy = job.savedBy.filter(id => id.toString() !== userId);
      job.savesCount = Math.max(0, job.savesCount - 1);
    } else {
      job.savedBy.push(userId);
      job.savesCount += 1;
    }

    await job.save();

    res.json({
      _id: job._id,
      isSaved: !isSaved,
      savesCount: job.savesCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply directly for a job
// @route   POST /api/jobs/:id/apply
// @access  Private
exports.apply = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await JobApplication.findOne({
      jobId: job._id,
      applicantId: req.user._id
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this role.' });
    }

    const {
      fullName,
      email,
      phone,
      college,
      degree,
      graduationYear,
      resumeUrl,
      portfolioUrl,
      githubUrl,
      linkedinUrl,
      coverNote
    } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ message: 'Full name, email, and contact phone are required.' });
    }

    const application = await JobApplication.create({
      jobId: job._id,
      applicantId: req.user._id,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      college: college || req.user.collegeName || '',
      degree: degree || 'B.Tech / B.E.',
      graduationYear: graduationYear || '2025',
      resumeUrl: resumeUrl || '',
      portfolioUrl: portfolioUrl || '',
      githubUrl: githubUrl || '',
      linkedinUrl: linkedinUrl || '',
      coverNote: coverNote || ''
    });

    // Increment application count on the job
    await Job.findByIdAndUpdate(job._id, { $inc: { applicationsCount: 1 } });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's job applications
// @route   GET /api/jobs/my/applications
// @access  Private
exports.myApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ applicantId: req.user._id })
      .populate('jobId', 'title company companyLogo location salary jobType workplaceType')
      .sort({ createdAt: -1 })
      .lean();

    res.json(applications);
  } catch (error) {
    next(error);
  }
};
