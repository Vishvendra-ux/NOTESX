const CourseCategory = require('../models/CourseCategory');
const Course = require('../models/Course');
const Branch = require('../models/Branch');
const AcademicYear = require('../models/AcademicYear');
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const Note = require('../models/Note');
const escapeRegex = require('../utils/escapeRegex');

// ── Course Categories ──
exports.getCourseCategories = async (req, res, next) => {
  try {
    const categories = await CourseCategory.find({ isActive: true }).sort({ order: 1, name: 1 });
    
    // Dynamically calculate course counts for each category
    const withCounts = await Promise.all(categories.map(async (cat) => {
      const courseCount = await Course.countDocuments({ categoryId: cat._id, isActive: true });
      return {
        ...cat.toObject(),
        courseCount: courseCount > 0 ? courseCount : cat.courseCount || 1
      };
    }));

    res.json(withCounts);
  } catch (err) {
    next(err);
  }
};

// ── Courses (Degrees) ──
exports.getCourses = async (req, res, next) => {
  try {
    const { categoryId, category } = req.query;
    const filter = { isActive: true };

    if (categoryId) {
      filter.categoryId = categoryId;
    } else if (category) {
      const catDoc = await CourseCategory.findOne({
        $or: [{ slug: category.toLowerCase() }, { name: new RegExp(`^${escapeRegex(category)}$`, 'i') }]
      });
      if (catDoc) filter.categoryId = catDoc._id;
    }

    const courses = await Course.find(filter).populate('categoryId', 'name slug icon').sort({ name: 1 });

    // Populate live branch, subject, and note counts
    const enriched = await Promise.all(courses.map(async (c) => {
      const branchesCount = await Branch.countDocuments({ courseId: c._id, isActive: true });
      const subjectsCount = await Subject.countDocuments({ courseId: c._id });
      const notesCount = await Note.countDocuments({ courseId: c._id, status: 'approved' });

      return {
        ...c.toObject(),
        branchesCount: branchesCount || c.branchesCount || 0,
        subjectsCount: subjectsCount || c.subjectsCount || 0,
        notesCount: notesCount || c.notesCount || 0
      };
    }));

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.getCourseByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    let course = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(id).populate('categoryId');
    }
    if (!course) {
      course = await Course.findOne({ slug: id.toLowerCase() }).populate('categoryId');
    }
    if (!course) return res.status(404).json({ message: 'Course degree not found' });

    res.json(course);
  } catch (err) {
    next(err);
  }
};

// ── Branches ──
exports.getBranches = async (req, res, next) => {
  try {
    const { courseId, course, search, category, featured } = req.query;
    const filter = { isActive: true };

    if (courseId) {
      filter.courseId = courseId;
    } else if (course) {
      const courseDoc = await Course.findOne({
        $or: [{ slug: course.toLowerCase() }, { name: new RegExp(`^${escapeRegex(course)}$`, 'i') }]
      });
      if (courseDoc) filter.courseId = courseDoc._id;
    }

    if (category && category !== 'All Featured' && category !== 'All 47 Branches' && category !== 'All') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: escapeRegex(search), $options: 'i' } },
        { shortCode: { $regex: escapeRegex(search), $options: 'i' } },
        { description: { $regex: escapeRegex(search), $options: 'i' } }
      ];
    }

    const branches = await Branch.find(filter).sort({ featured: -1, name: 1 });

    // Attach dynamic subject and notes counts
    const enriched = await Promise.all(branches.map(async (b) => {
      const subCount = await Subject.countDocuments({ branchId: b._id });
      const notesCount = await Note.countDocuments({ branchId: b._id, status: 'approved' });
      return {
        ...b.toObject(),
        subjectsCount: subCount > 0 ? subCount : b.subjectsCount || 6,
        notesCount: notesCount > 0 ? notesCount : b.notesCount || 0
      };
    }));

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.getBranchByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    let branch = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      branch = await Branch.findById(id).populate('courseId');
    }
    if (!branch) {
      branch = await Branch.findOne({ 
        $or: [{ slug: id.toLowerCase() }, { shortCode: id.toUpperCase() }] 
      }).populate('courseId');
    }
    if (!branch) return res.status(404).json({ message: 'Branch not found' });

    const subjectsCount = await Subject.countDocuments({ branchId: branch._id });
    const notesCount = await Note.countDocuments({ branchId: branch._id, status: 'approved' });

    res.json({
      ...branch.toObject(),
      subjectsCount: subjectsCount > 0 ? subjectsCount : branch.subjectsCount,
      notesCount: notesCount > 0 ? notesCount : branch.notesCount
    });
  } catch (err) {
    next(err);
  }
};

// ── Years (Dynamic from Course Duration) ──
exports.getYears = async (req, res, next) => {
  try {
    const { branchId, courseId } = req.query;
    let targetCourseId = courseId;

    if (branchId) {
      const branch = await Branch.findById(branchId);
      if (branch) targetCourseId = branch.courseId;
    }

    let durationYears = 4;
    if (targetCourseId) {
      const course = await Course.findById(targetCourseId);
      if (course && course.durationYears) durationYears = course.durationYears;
    }

    // Build years dynamically
    const years = [];
    for (let yr = 1; yr <= durationYears; yr++) {
      const yrName = `${yr}${yr === 1 ? 'st' : yr === 2 ? 'nd' : yr === 3 ? 'rd' : 'th'} Year`;
      
      let subFilter = { yearNumber: yr };
      let noteFilter = { yearNumber: yr, status: 'approved' };
      if (branchId) {
        subFilter.branchId = branchId;
        noteFilter.branchId = branchId;
      }

      const subjectsCount = await Subject.countDocuments(subFilter);
      const notesCount = await Note.countDocuments(noteFilter);

      years.push({
        yearNumber: yr,
        name: yrName,
        subjectsCount,
        notesCount
      });
    }

    res.json(years);
  } catch (err) {
    next(err);
  }
};

// ── Semesters ──
exports.getSemesters = async (req, res, next) => {
  try {
    const { branchId, yearNumber, year } = req.query;
    const yrNum = parseInt(yearNumber || year || '1', 10);

    const sem1 = (yrNum * 2) - 1;
    const sem2 = yrNum * 2;

    const semestersList = [
      { semesterNumber: sem1, name: `Semester ${sem1}` },
      { semesterNumber: sem2, name: `Semester ${sem2}` }
    ];

    const enriched = await Promise.all(semestersList.map(async (s) => {
      let subFilter = { semesterNumber: s.semesterNumber, yearNumber: yrNum };
      let noteFilter = { semesterNumber: s.semesterNumber, yearNumber: yrNum, status: 'approved' };
      if (branchId) {
        subFilter.branchId = branchId;
        noteFilter.branchId = branchId;
      }

      const [subjects, notesCount] = await Promise.all([
        Subject.find(subFilter).select('name code credits').sort({ name: 1 }).lean(),
        Note.countDocuments(noteFilter)
      ]);

      return {
        ...s,
        yearNumber: yrNum,
        subjects,
        subjectsCount: subjects.length,
        notesCount
      };
    }));

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

// ── Subjects ──
exports.getSubjects = async (req, res, next) => {
  try {
    const { branchId, semesterNumber, semester, yearNumber, search } = req.query;
    const filter = {};

    if (branchId) filter.branchId = branchId;
    if (semesterNumber || semester) {
      filter.semesterNumber = parseInt(semesterNumber || semester, 10);
    }
    if (yearNumber) filter.yearNumber = parseInt(yearNumber, 10);

    if (search) {
      filter.$or = [
        { name: { $regex: escapeRegex(search), $options: 'i' } },
        { code: { $regex: escapeRegex(search), $options: 'i' } }
      ];
    }

    const subjects = await Subject.find(filter).populate('branchId', 'name shortCode').sort({ name: 1 });

    // Enrich with live note counts and average rating
    const enriched = await Promise.all(subjects.map(async (subj) => {
      const notesCount = await Note.countDocuments({ subjectId: subj._id, status: 'approved' });
      return {
        ...subj.toObject(),
        notesCount: notesCount > 0 ? notesCount : subj.notesCount || 0
      };
    }));

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.getSubjectByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    let subject = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      subject = await Subject.findById(id).populate('branchId courseId semesterId');
    }
    if (!subject) {
      subject = await Subject.findOne({ slug: id.toLowerCase() }).populate('branchId courseId semesterId');
    }
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const notesCount = await Note.countDocuments({ subjectId: subject._id, status: 'approved' });

    res.json({
      ...subject.toObject(),
      notesCount: notesCount > 0 ? notesCount : subject.notesCount
    });
  } catch (err) {
    next(err);
  }
};
