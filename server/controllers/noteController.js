const path = require('path');
const Note = require('../models/Note');
const Subject = require('../models/Subject');
const Branch = require('../models/Branch');
const Course = require('../models/Course');
const Review = require('../models/Review');
const Bookmark = require('../models/Bookmark');
const NoteDownload = require('../models/NoteDownload');
const NoteReport = require('../models/NoteReport');
const User = require('../models/User');

const escapeRegex = (s) => String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ── List Notes with Filters, Sort & Pagination ──
exports.list = async (req, res, next) => {
  try {
    const {
      search = '',
      subjectId,
      subject,
      branchId,
      branch,
      courseId,
      course,
      year,
      yearNumber,
      semester,
      semesterNumber,
      unit,
      topic,
      fileType,
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    const filter = { status: 'approved' };

    // Subject Filter (by ID or name/slug)
    if (subjectId && subjectId !== 'all') {
      filter.subjectId = subjectId;
    } else if (subject && subject !== 'all') {
      const safeSub = escapeRegex(subject);
      const subDoc = await Subject.findOne({
        $or: [{ slug: subject.toLowerCase() }, { name: new RegExp(`^${safeSub}$`, 'i') }]
      });
      if (subDoc) filter.subjectId = subDoc._id;
      else filter.subject = new RegExp(safeSub, 'i');
    }

    // Branch Filter (by ID or name/slug)
    if (branchId && branchId !== 'all') {
      filter.branchId = branchId;
    } else if (branch && branch !== 'all') {
      const safeBranch = escapeRegex(branch);
      const branchDoc = await Branch.findOne({
        $or: [{ slug: branch.toLowerCase() }, { shortCode: branch.toUpperCase() }, { name: new RegExp(`^${safeBranch}$`, 'i') }]
      });
      if (branchDoc) filter.branchId = branchDoc._id;
      else filter.branch = new RegExp(safeBranch, 'i');
    }

    // Course Filter
    if (courseId && courseId !== 'all') {
      filter.courseId = courseId;
    } else if (course && course !== 'all') {
      const safeCourse = escapeRegex(course);
      const courseDoc = await Course.findOne({
        $or: [{ slug: course.toLowerCase() }, { name: new RegExp(`^${safeCourse}$`, 'i') }]
      });
      if (courseDoc) filter.courseId = courseDoc._id;
    }

    // Year Filter
    if (yearNumber) {
      filter.yearNumber = parseInt(yearNumber, 10);
    } else if (year && year !== 'All Years') {
      const match = year.match(/\d+/);
      if (match) filter.yearNumber = parseInt(match[0], 10);
    }

    // Semester Filter
    if (semesterNumber) {
      filter.semesterNumber = parseInt(semesterNumber, 10);
    } else if (semester && semester !== 'All Semesters') {
      const match = semester.match(/\d+/);
      if (match) filter.semesterNumber = parseInt(match[0], 10);
    }

    // Unit & Topic Filter
    if (unit && unit !== 'All Units') {
      filter.unit = new RegExp(escapeRegex(unit), 'i');
    }
    if (topic) {
      filter.topic = new RegExp(escapeRegex(topic), 'i');
    }

    // File Type Filter
    if (fileType && fileType !== 'all') {
      filter.fileType = new RegExp(escapeRegex(fileType), 'i');
    }

    // Search Filter
    if (search.trim()) {
      const q = escapeRegex(search.trim());
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { branch: { $regex: q, $options: 'i' } },
        { topic: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'rating' || sort === 'Highest Rated') sortObj = { ratingAverage: -1, ratingCount: -1 };
    else if (sort === 'downloads' || sort === 'Most Downloaded') sortObj = { downloadCount: -1 };
    else if (sort === 'reviews' || sort === 'Most Reviewed') sortObj = { ratingCount: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [notes, total] = await Promise.all([
      Note.find(filter)
        .populate('uploaderId', 'name profilePhoto collegeName reputation badges')
        .populate('subjectId', 'name code credits')
        .populate('branchId', 'name shortCode icon color')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      Note.countDocuments(filter)
    ]);

    res.json({
      notes,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      hasMore: pageNum * limitNum < total
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Note by ID (with View Tracking & Related Notes) ──
exports.get = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    )
      .populate('uploaderId', 'name profilePhoto collegeName course reputation badges')
      .populate('subjectId', 'name code credits')
      .populate('branchId', 'name shortCode icon color')
      .populate('courseId', 'name durationYears');

    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Fetch Reviews
    const reviews = await Review.find({ noteId: note._id })
      .populate('userId', 'name profilePhoto collegeName')
      .sort({ createdAt: -1 });

    // Fetch Related Notes (same subject or same branch/semester)
    const relatedNotes = await Note.find({
      _id: { $ne: note._id },
      $or: [
        { subjectId: note.subjectId },
        { branchId: note.branchId, semesterNumber: note.semesterNumber }
      ],
      status: 'approved'
    })
      .populate('uploaderId', 'name profilePhoto')
      .limit(4);

    // Contributor Stats for uploader
    let contributorStats = null;
    if (note.uploaderId && note.uploaderId._id) {
      const uploadCount = await Note.countDocuments({ uploaderId: note.uploaderId._id });
      const dlStats = await Note.aggregate([
        { $match: { uploaderId: note.uploaderId._id } },
        { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' }, avgRating: { $avg: '$ratingAverage' } } }
      ]);

      contributorStats = {
        notesUploaded: uploadCount,
        totalDownloads: dlStats[0]?.totalDownloads || 0,
        averageRating: dlStats[0]?.avgRating ? Number(dlStats[0].avgRating.toFixed(1)) : 4.8,
        badge: uploadCount >= 5 ? 'Top Contributor 🏆' : 'Active Contributor ⭐'
      };
    }

    res.json({
      ...note.toObject(),
      reviews,
      relatedNotes,
      contributorStats
    });
  } catch (error) {
    next(error);
  }
};

// ── Create / Upload Note with Strict Hierarchy Validation & Public Link Support ──
exports.create = async (req, res, next) => {
  try {
    const {
      title,
      description,
      courseId,
      branchId,
      yearNumber,
      semesterNumber,
      subjectId,
      unit = 'Unit 1',
      topic = '',
      tags = '[]',
      externalLink = ''
    } = req.body;

    const trimmedLink = (externalLink || req.body.link || req.body.fileUrl || '').trim();

    if (!req.file && !trimmedLink) {
      return res.status(400).json({ 
        message: 'Please provide either a study document file or a public Google Drive / Docs / PDF link.' 
      });
    }

    if (trimmedLink && !/^https?:\/\//i.test(trimmedLink)) {
      return res.status(400).json({
        message: 'Invalid link. Please provide a valid URL starting with http:// or https://'
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Note title is required' });
    }

    // Daily upload quota check to prevent storage and resource exhaustion
    if (req.user && req.user.role !== 'admin') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentUploadsCount = await Note.countDocuments({
        uploaderId: req.user._id,
        createdAt: { $gte: oneDayAgo }
      });
      if (recentUploadsCount >= 15) {
        return res.status(429).json({ message: 'Daily upload quota reached (maximum 15 notes per 24 hours). Please try again tomorrow.' });
      }
    }

    // ── Hierarchy Validation ──
    let validatedCourseId = courseId;
    let validatedBranch = null;
    let validatedSubject = null;

    if (branchId) {
      validatedBranch = await Branch.findById(branchId);
      if (!validatedBranch) {
        return res.status(400).json({ message: 'Specified branch does not exist' });
      }
      if (courseId && validatedBranch.courseId.toString() !== courseId.toString()) {
        return res.status(400).json({ message: 'Selected branch does not belong to the selected course' });
      }
      validatedCourseId = validatedBranch.courseId;
    }

    if (subjectId) {
      validatedSubject = await Subject.findById(subjectId);
      if (!validatedSubject) {
        return res.status(400).json({ message: 'Specified subject does not exist' });
      }
      if (validatedBranch && validatedSubject.branchId.toString() !== validatedBranch._id.toString()) {
        return res.status(400).json({ message: 'Selected subject does not belong to the selected branch' });
      }
    }

    // Determine normalized file type, file URL, and size
    let normType = 'pdf';
    let finalFileUrl = '';
    let finalFileSize = 0;
    const isExternal = Boolean(trimmedLink && !req.file);

    if (req.file) {
      const mime = req.file.mimetype.toLowerCase();
      const originalName = req.file.originalname.toLowerCase();
      if (mime.includes('image') || originalName.match(/\.(jpg|jpeg|png)$/)) normType = 'img';
      else if (mime.includes('word') || originalName.match(/\.(doc|docx)$/)) normType = 'doc';
      else if (mime.includes('presentation') || originalName.match(/\.(ppt|pptx)$/)) normType = 'ppt';
      else normType = 'pdf';

      finalFileUrl = req.file.path && req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
      finalFileSize = req.file.size;
    } else {
      const lowerLink = trimmedLink.toLowerCase();
      if (lowerLink.includes('drive.google.com')) normType = 'drive';
      else if (lowerLink.includes('docs.google.com/document')) normType = 'gdoc';
      else if (lowerLink.includes('docs.google.com/presentation')) normType = 'ppt';
      else if (lowerLink.includes('docs.google.com/spreadsheets')) normType = 'sheet';
      else if (lowerLink.includes('.pdf')) normType = 'pdf';
      else normType = 'link';

      finalFileUrl = trimmedLink;
      finalFileSize = 0;
    }

    let parsedTags = [];
    try {
      parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    } catch (e) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [];
    }

    const yrNum = parseInt(yearNumber || (validatedSubject?.yearNumber) || '1', 10);
    const semNum = parseInt(semesterNumber || (validatedSubject?.semesterNumber) || '1', 10);

    const note = await Note.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      courseId: validatedCourseId,
      branchId: validatedBranch ? validatedBranch._id : null,
      subjectId: validatedSubject ? validatedSubject._id : null,
      course: validatedBranch ? 'B.Tech' : 'Engineering',
      branch: validatedBranch ? validatedBranch.name : req.body.branch || '',
      subject: validatedSubject ? validatedSubject.name : req.body.subject || '',
      year: `${yrNum}${yrNum === 1 ? 'st' : yrNum === 2 ? 'nd' : yrNum === 3 ? 'rd' : 'th'} Year`,
      yearNumber: yrNum,
      semester: `Semester ${semNum}`,
      semesterNumber: semNum,
      unit: unit || 'Unit 1',
      topic: topic || '',
      tags: parsedTags,
      uploaderId: req.user._id,
      fileUrl: finalFileUrl,
      externalLink: trimmedLink,
      isExternalLink: isExternal,
      fileType: normType,
      fileSize: finalFileSize,
      status: 'approved', // Auto-approved so students see their uploaded notes immediately
      college: req.user.collegeName || 'Engineering Campus',
      ratingAverage: 0,
      ratingCount: 0,
      downloadCount: 0,
      views: 1
    });

    // Update Subject and Branch note counts
    if (validatedSubject) {
      await Subject.findByIdAndUpdate(validatedSubject._id, { $inc: { notesCount: 1 } });
    }
    if (validatedBranch) {
      await Branch.findByIdAndUpdate(validatedBranch._id, { $inc: { notesCount: 1 } });
    }

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// ── Download / Access Note with Backend Tracking ──
exports.download = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { returnDocument: 'after' }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Track download record
    await NoteDownload.create({
      noteId: note._id,
      userId: req.user ? req.user._id : null,
      ip: req.ip || req.connection.remoteAddress || ''
    });

    res.json({
      downloadUrl: note.externalLink || note.fileUrl,
      downloadCount: note.downloadCount
    });
  } catch (error) {
    next(error);
  }
};

// ── Bookmark Note (Toggle) ──
exports.toggleBookmark = async (req, res, next) => {
  try {
    const existing = await Bookmark.findOne({
      noteId: req.params.id,
      userId: req.user._id
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({ bookmarked: false, message: 'Removed from bookmarks' });
    } else {
      await Bookmark.create({
        noteId: req.params.id,
        userId: req.user._id
      });
      return res.json({ bookmarked: true, message: 'Saved to bookmarks' });
    }
  } catch (error) {
    next(error);
  }
};

// ── Get User's Bookmarks ──
exports.getUserBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate({
        path: 'noteId',
        populate: [
          { path: 'uploaderId', select: 'name profilePhoto' },
          { path: 'subjectId', select: 'name code' },
          { path: 'branchId', select: 'name shortCode' }
        ]
      })
      .sort({ createdAt: -1 });

    const notes = bookmarks.map(b => b.noteId).filter(Boolean);
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// ── Reviews & Ratings System ──
exports.addOrUpdateReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const numRating = parseInt(rating, 10);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5 stars' });
    }
    if (!review || !review.trim()) {
      return res.status(400).json({ message: 'Review description is required' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // One review per student per note (upsert). On a concurrent first review
    // the unique index fires E11000 — retry against the winner's document.
    let savedReview;
    try {
      savedReview = await Review.findOneAndUpdate(
        { noteId: note._id, userId: req.user._id },
        { rating: numRating, review: review.trim() },
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
      ).populate('userId', 'name profilePhoto collegeName');
    } catch (err) {
      if (err.code !== 11000) throw err;
      savedReview = await Review.findOneAndUpdate(
        { noteId: note._id, userId: req.user._id },
        { rating: numRating, review: review.trim() },
        { returnDocument: 'after', setDefaultsOnInsert: true }
      ).populate('userId', 'name profilePhoto collegeName');
    }

    // Recalculate dynamic average rating for this note
    const stats = await Review.aggregate([
      { $match: { noteId: note._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const newAvg = stats.length > 0 ? Number(stats[0].avgRating.toFixed(1)) : numRating;
    const newCount = stats.length > 0 ? stats[0].count : 1;

    await Note.findByIdAndUpdate(note._id, {
      ratingAverage: newAvg,
      ratingCount: newCount
    });

    if (note.subjectId) {
      await Subject.findByIdAndUpdate(note.subjectId, {
        ratingAverage: newAvg
      });
    }

    res.json({
      review: savedReview,
      ratingAverage: newAvg,
      ratingCount: newCount,
      message: 'Review successfully submitted!'
    });
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ noteId: req.params.id })
      .populate('userId', 'name profilePhoto collegeName')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.toggleHelpfulReview = async (req, res, next) => {
  try {
    const exists = await Review.findById(req.params.reviewId).select('_id').lean();
    if (!exists) return res.status(404).json({ message: 'Review not found' });

    const userId = req.user._id;

    // Atomic toggle: withdraw first, else guarded add — concurrent requests
    // cannot double-vote or drift helpfulCount
    const removed = await Review.updateOne(
      { _id: req.params.reviewId, helpfulVotes: userId },
      { $pull: { helpfulVotes: userId }, $inc: { helpfulCount: -1 } }
    );

    let hasVoted;
    if (removed.modifiedCount > 0) {
      hasVoted = false;
    } else {
      const added = await Review.updateOne(
        { _id: req.params.reviewId, helpfulVotes: { $ne: userId } },
        { $addToSet: { helpfulVotes: userId }, $inc: { helpfulCount: 1 } }
      );
      hasVoted = added.modifiedCount > 0;
    }

    const fresh = await Review.findById(req.params.reviewId).select('helpfulCount').lean();
    res.json({ helpfulCount: fresh.helpfulCount, hasVoted });
  } catch (error) {
    next(error);
  }
};

// ── Report Note ──
exports.report = async (req, res, next) => {
  try {
    const { reason, details } = req.body;
    if (!reason) return res.status(400).json({ message: 'Report reason is required' });

    const report = await NoteReport.create({
      noteId: req.params.id,
      userId: req.user._id,
      reason,
      details: details ? details.trim() : ''
    });

    res.status(201).json({ message: 'Report received. Our moderation team will review this note.', report });
  } catch (error) {
    next(error);
  }
};

// ── Contributor Profile Stats ──
exports.getContributorProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name collegeName course reputation badges profilePhoto');
    if (!user) return res.status(404).json({ message: 'Contributor not found' });

    const notesCount = await Note.countDocuments({ uploaderId: user._id, status: 'approved' });
    const stats = await Note.aggregate([
      { $match: { uploaderId: user._id, status: 'approved' } },
      { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' }, avgRating: { $avg: '$ratingAverage' } } }
    ]);

    res.json({
      user,
      notesUploaded: notesCount,
      totalDownloads: stats[0]?.totalDownloads || 0,
      averageRating: stats[0]?.avgRating ? Number(stats[0].avgRating.toFixed(1)) : 4.8,
      badge: notesCount >= 5 ? 'Top Contributor 🏆' : 'Community Contributor ⭐'
    });
  } catch (error) {
    next(error);
  }
};
