const Doubt = require('../models/Doubt');
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Get all doubts with GateOverflow filtering, sorting & search
// @route   GET /api/doubts
// @access  Public
exports.list = async (req, res, next) => {
  try {
    const {
      search = '',
      subject,
      tag,
      examCategory,
      questionType,
      filter = 'all', // 'all', 'unanswered', 'solved', 'my', 'bookmarked'
      sort = 'latest', // 'latest', 'trending', 'votes', 'activity'
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Text search
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { topic: { $regex: s, $options: 'i' } },
        { tags: { $in: [new RegExp(s, 'i')] } },
        { subjectName: { $regex: s, $options: 'i' } }
      ];
    }

    // Filter by Subject
    if (subject && subject !== 'All') {
      query.subjectName = { $regex: new RegExp(`^${subject}$`, 'i') };
    }

    // Filter by Tag
    if (tag) {
      query.tags = tag.toLowerCase().trim();
    }

    // Filter by Exam Category
    if (examCategory && examCategory !== 'All') {
      query.examCategory = examCategory;
    }

    // Filter by Question Type
    if (questionType && questionType !== 'All') {
      query.questionType = questionType;
    }

    // Filter status / ownership
    if (filter === 'unanswered') {
      query.answersCount = 0;
    } else if (filter === 'solved') {
      query.hasAcceptedAnswer = true;
    } else if (filter === 'my' && req.user) {
      query.askerId = req.user._id;
    } else if (filter === 'bookmarked' && req.user) {
      query.bookmarkedBy = req.user._id;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'trending' || sort === 'hot') {
      sortOption = { upvotes: -1, answersCount: -1, lastActivityAt: -1 };
    } else if (sort === 'votes' || sort === 'most-voted') {
      sortOption = { upvotes: -1, createdAt: -1 };
    } else if (sort === 'activity') {
      sortOption = { lastActivityAt: -1 };
    } else if (sort === 'unanswered') {
      sortOption = { createdAt: -1 };
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [doubts, total] = await Promise.all([
      Doubt.find(query)
        .populate('askerId', 'name profilePhoto reputation badges collegeName')
        .sort(sortOption)
        .skip(skip)
        .limit(take)
        .lean(),
      Doubt.countDocuments(query)
    ]);

    // Format doubts with helper flags if user is logged in
    const userIdStr = req.user ? req.user._id.toString() : null;
    const formattedDoubts = doubts.map(d => ({
      ...d,
      hasUpvoted: userIdStr ? d.upvotedBy?.some(id => id.toString() === userIdStr) : false,
      hasDownvoted: userIdStr ? d.downvotedBy?.some(id => id.toString() === userIdStr) : false,
      isBookmarked: userIdStr ? d.bookmarkedBy?.some(id => id.toString() === userIdStr) : false,
      netVotes: (d.upvotes || 0) - (d.downvotes || 0)
    }));

    res.json({
      doubts: formattedDoubts,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / take)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get community stats, subject counts and top contributors
// @route   GET /api/doubts/stats
// @access  Public
exports.stats = async (req, res, next) => {
  try {
    const [totalDoubts, solvedDoubts, unansweredDoubts, totalAnswers, subjectCounts, topContributors] = await Promise.all([
      Doubt.countDocuments(),
      Doubt.countDocuments({ hasAcceptedAnswer: true }),
      Doubt.countDocuments({ answersCount: 0 }),
      Answer.countDocuments(),
      Doubt.aggregate([
        { $group: { _id: '$subjectName', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      User.find({ reputation: { $gt: 0 } })
        .select('name profilePhoto reputation badges collegeName')
        .sort({ reputation: -1 })
        .limit(6)
        .lean()
    ]);

    res.json({
      totalDoubts,
      solvedDoubts,
      unansweredDoubts,
      totalAnswers,
      solvedRate: totalDoubts > 0 ? Math.round((solvedDoubts / totalDoubts) * 100) : 0,
      subjects: subjectCounts.map(s => ({ name: s._id || 'General', count: s.count })),
      topContributors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doubt with full details & related questions
// @route   GET /api/doubts/:id
// @access  Public
exports.get = async (req, res, next) => {
  try {
    const doubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('askerId', 'name profilePhoto reputation badges collegeName');

    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    // Fetch comments on this doubt
    const comments = await Comment.find({ parentId: doubt._id, onModel: 'Doubt' })
      .populate('authorId', 'name profilePhoto reputation')
      .sort({ createdAt: 1 })
      .lean();

    // Fetch related doubts in same subject
    const related = await Doubt.find({
      _id: { $ne: doubt._id },
      $or: [
        { subjectName: doubt.subjectName },
        { tags: { $in: doubt.tags || [] } }
      ]
    })
      .select('title subjectName upvotes answersCount hasAcceptedAnswer createdAt')
      .sort({ upvotes: -1 })
      .limit(5)
      .lean();

    const userIdStr = req.user ? req.user._id.toString() : null;

    res.json({
      ...doubt.toObject(),
      hasUpvoted: userIdStr ? doubt.upvotedBy?.some(id => id.toString() === userIdStr) : false,
      hasDownvoted: userIdStr ? doubt.downvotedBy?.some(id => id.toString() === userIdStr) : false,
      isBookmarked: userIdStr ? doubt.bookmarkedBy?.some(id => id.toString() === userIdStr) : false,
      netVotes: (doubt.upvotes || 0) - (doubt.downvotes || 0),
      comments,
      related
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new doubt
// @route   POST /api/doubts
// @access  Private
exports.create = async (req, res, next) => {
  try {
    const {
      title,
      description,
      subjectName,
      topic,
      tags,
      examCategory,
      examYear,
      questionType,
      marks,
      options,
      correctOption,
      attachments
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Process tags
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map(t => String(t).trim().toLowerCase()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    }

    const doubt = await Doubt.create({
      title: title.trim(),
      description,
      subjectName: subjectName || 'Operating Systems',
      topic: topic || '',
      tags: processedTags,
      examCategory: examCategory || 'GATE CSE',
      examYear: examYear || '',
      questionType: questionType || 'General',
      marks: Number(marks) || 2,
      options: Array.isArray(options) ? options : [],
      correctOption: correctOption || '',
      attachments: Array.isArray(attachments) ? attachments : [],
      askerId: req.user._id,
      collegeName: req.user.collegeName || ''
    });

    // Reward asker with reputation points
    await User.findByIdAndUpdate(req.user._id, { $inc: { reputation: 5 } });

    const populated = await Doubt.findById(doubt._id).populate('askerId', 'name profilePhoto reputation badges collegeName');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a doubt
// @route   DELETE /api/doubts/:id
// @access  Private (Asker or Admin)
exports.deleteDoubt = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const isOwner = doubt.askerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    // Delete associated answers and comments
    await Answer.deleteMany({ doubtId: doubt._id });
    await Comment.deleteMany({ parentId: doubt._id, onModel: 'Doubt' });
    await Doubt.findByIdAndDelete(doubt._id);

    res.json({ message: 'Doubt removed successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote a doubt
// @route   POST /api/doubts/:id/upvote
// @access  Private
exports.upvote = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const userId = req.user._id.toString();
    const upvotedByIndex = doubt.upvotedBy.findIndex(id => id.toString() === userId);
    const downvotedByIndex = doubt.downvotedBy.findIndex(id => id.toString() === userId);

    if (upvotedByIndex !== -1) {
      // Toggle off upvote
      doubt.upvotedBy.splice(upvotedByIndex, 1);
      doubt.upvotes = Math.max(0, doubt.upvotes - 1);
      await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: -5 } });
    } else {
      // Add upvote
      doubt.upvotedBy.push(userId);
      doubt.upvotes += 1;

      // If previously downvoted, remove downvote
      if (downvotedByIndex !== -1) {
        doubt.downvotedBy.splice(downvotedByIndex, 1);
        doubt.downvotes = Math.max(0, doubt.downvotes - 1);
        await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: 2 } });
      }

      await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: 5 } });
    }

    await doubt.save();

    res.json({
      _id: doubt._id,
      upvotes: doubt.upvotes,
      downvotes: doubt.downvotes,
      netVotes: doubt.upvotes - doubt.downvotes,
      hasUpvoted: doubt.upvotedBy.some(id => id.toString() === userId),
      hasDownvoted: doubt.downvotedBy.some(id => id.toString() === userId)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Downvote a doubt
// @route   POST /api/doubts/:id/downvote
// @access  Private
exports.downvote = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const userId = req.user._id.toString();
    const upvotedByIndex = doubt.upvotedBy.findIndex(id => id.toString() === userId);
    const downvotedByIndex = doubt.downvotedBy.findIndex(id => id.toString() === userId);

    if (downvotedByIndex !== -1) {
      // Toggle off downvote
      doubt.downvotedBy.splice(downvotedByIndex, 1);
      doubt.downvotes = Math.max(0, doubt.downvotes - 1);
      await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: 2 } });
    } else {
      // Add downvote
      doubt.downvotedBy.push(userId);
      doubt.downvotes += 1;

      // If previously upvoted, remove upvote
      if (upvotedByIndex !== -1) {
        doubt.upvotedBy.splice(upvotedByIndex, 1);
        doubt.upvotes = Math.max(0, doubt.upvotes - 1);
        await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: -5 } });
      }

      await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: -2 } });
    }

    await doubt.save();

    res.json({
      _id: doubt._id,
      upvotes: doubt.upvotes,
      downvotes: doubt.downvotes,
      netVotes: doubt.upvotes - doubt.downvotes,
      hasUpvoted: doubt.upvotedBy.some(id => id.toString() === userId),
      hasDownvoted: doubt.downvotedBy.some(id => id.toString() === userId)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark on a doubt
// @route   POST /api/doubts/:id/bookmark
// @access  Private
exports.toggleBookmark = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const userId = req.user._id.toString();
    const isBookmarked = doubt.bookmarkedBy.some(id => id.toString() === userId);

    if (isBookmarked) {
      doubt.bookmarkedBy = doubt.bookmarkedBy.filter(id => id.toString() !== userId);
    } else {
      doubt.bookmarkedBy.push(userId);
    }

    await doubt.save();
    res.json({
      _id: doubt._id,
      isBookmarked: !isBookmarked,
      bookmarksCount: doubt.bookmarkedBy.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept an answer as best answer
// @route   POST /api/doubts/:id/accept/:answerId
// @access  Private (Asker or Admin)
exports.acceptAnswer = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const isAsker = doubt.askerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAsker && !isAdmin) {
      return res.status(403).json({ message: 'Only the question author or an admin can accept an answer' });
    }

    const answer = await Answer.findById(req.params.answerId);
    if (!answer || answer.doubtId.toString() !== doubt._id.toString()) {
      return res.status(404).json({ message: 'Answer not found for this question' });
    }

    // Toggle acceptance: if already accepted, unaccept it
    if (answer.isAccepted) {
      answer.isAccepted = false;
      await answer.save();

      doubt.hasAcceptedAnswer = false;
      doubt.status = 'open';
      await doubt.save();

      await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: -15 } });
      return res.json({ message: 'Answer unaccepted', isAccepted: false, answerId: answer._id });
    }

    // Reset any other accepted answer for this doubt
    await Answer.updateMany({ doubtId: doubt._id }, { isAccepted: false });

    answer.isAccepted = true;
    await answer.save();

    doubt.hasAcceptedAnswer = true;
    doubt.status = 'resolved';
    await doubt.save();

    // Reward answerer
    await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: 15 } });

    res.json({ message: 'Answer accepted as best solution', isAccepted: true, answerId: answer._id });
  } catch (error) {
    next(error);
  }
};
