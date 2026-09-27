const Answer = require('../models/Answer');
const Doubt = require('../models/Doubt');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Create an answer for a doubt
// @route   POST /api/doubts/:doubtId/answers or POST /api/answers
// @access  Private
exports.create = async (req, res, next) => {
  try {
    const doubtId = req.params.doubtId || req.body.doubtId;
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });

    const { content, attachments } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Answer content cannot be empty' });
    }

    const answer = await Answer.create({
      doubtId,
      answererId: req.user._id,
      content: content.trim(),
      attachments: Array.isArray(attachments) ? attachments : []
    });

    // Reward answerer
    await User.findByIdAndUpdate(req.user._id, { $inc: { reputation: 10 } });

    // Update Doubt answersCount and activity timestamp
    await Doubt.findByIdAndUpdate(doubtId, {
      $inc: { answersCount: 1 },
      lastActivityAt: new Date()
    });

    const populated = await Answer.findById(answer._id)
      .populate('answererId', 'name profilePhoto reputation badges collegeName');

    res.status(201).json({
      ...populated.toObject(),
      comments: [],
      hasUpvoted: false,
      hasDownvoted: false,
      netVotes: 0
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List answers for a doubt with author & comments
// @route   GET /api/doubts/:doubtId/answers
// @access  Public
exports.list = async (req, res, next) => {
  try {
    const answers = await Answer.find({ doubtId: req.params.doubtId })
      .populate('answererId', 'name profilePhoto reputation badges collegeName')
      .sort({ isAccepted: -1, upvotes: -1, createdAt: 1 })
      .lean();

    const answerIds = answers.map(a => a._id);
    const comments = await Comment.find({ parentId: { $in: answerIds }, onModel: 'Answer' })
      .populate('authorId', 'name profilePhoto reputation')
      .sort({ createdAt: 1 })
      .lean();

    const userIdStr = req.user ? req.user._id.toString() : null;

    const formattedAnswers = answers.map(ans => ({
      ...ans,
      comments: comments.filter(c => c.parentId.toString() === ans._id.toString()),
      hasUpvoted: userIdStr ? ans.upvotedBy?.some(id => id.toString() === userIdStr) : false,
      hasDownvoted: userIdStr ? ans.downvotedBy?.some(id => id.toString() === userIdStr) : false,
      netVotes: (ans.upvotes || 0) - (ans.downvotes || 0)
    }));

    res.json(formattedAnswers);
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote an answer
// @route   POST /api/answers/:id/upvote
// @access  Private
exports.upvote = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const userId = req.user._id.toString();
    const upvotedByIndex = answer.upvotedBy.findIndex(id => id.toString() === userId);
    const downvotedByIndex = answer.downvotedBy.findIndex(id => id.toString() === userId);

    if (upvotedByIndex !== -1) {
      answer.upvotedBy.splice(upvotedByIndex, 1);
      answer.upvotes = Math.max(0, answer.upvotes - 1);
      await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: -10 } });
    } else {
      answer.upvotedBy.push(userId);
      answer.upvotes += 1;

      if (downvotedByIndex !== -1) {
        answer.downvotedBy.splice(downvotedByIndex, 1);
        answer.downvotes = Math.max(0, answer.downvotes - 1);
        await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: 2 } });
      }

      await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: 10 } });
    }

    await answer.save();

    res.json({
      _id: answer._id,
      upvotes: answer.upvotes,
      downvotes: answer.downvotes,
      netVotes: answer.upvotes - answer.downvotes,
      hasUpvoted: answer.upvotedBy.some(id => id.toString() === userId),
      hasDownvoted: answer.downvotedBy.some(id => id.toString() === userId)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Downvote an answer
// @route   POST /api/answers/:id/downvote
// @access  Private
exports.downvote = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const userId = req.user._id.toString();
    const upvotedByIndex = answer.upvotedBy.findIndex(id => id.toString() === userId);
    const downvotedByIndex = answer.downvotedBy.findIndex(id => id.toString() === userId);

    if (downvotedByIndex !== -1) {
      answer.downvotedBy.splice(downvotedByIndex, 1);
      answer.downvotes = Math.max(0, answer.downvotes - 1);
      await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: 2 } });
    } else {
      answer.downvotedBy.push(userId);
      answer.downvotes += 1;

      if (upvotedByIndex !== -1) {
        answer.upvotedBy.splice(upvotedByIndex, 1);
        answer.upvotes = Math.max(0, answer.upvotes - 1);
        await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: -10 } });
      }

      await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: -2 } });
    }

    await answer.save();

    res.json({
      _id: answer._id,
      upvotes: answer.upvotes,
      downvotes: answer.downvotes,
      netVotes: answer.upvotes - answer.downvotes,
      hasUpvoted: answer.upvotedBy.some(id => id.toString() === userId),
      hasDownvoted: answer.downvotedBy.some(id => id.toString() === userId)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an answer
// @route   DELETE /api/answers/:id
// @access  Private (Answerer or Admin)
exports.deleteAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const isOwner = answer.answererId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this answer' });
    }

    const doubtId = answer.doubtId;
    const wasAccepted = answer.isAccepted;

    await Comment.deleteMany({ parentId: answer._id, onModel: 'Answer' });
    await Answer.findByIdAndDelete(answer._id);

    // Update Doubt answersCount
    const count = await Answer.countDocuments({ doubtId });
    const updateObj = { answersCount: count };
    if (wasAccepted) {
      updateObj.hasAcceptedAnswer = false;
      updateObj.status = 'open';
    }
    await Doubt.findByIdAndUpdate(doubtId, updateObj);

    res.json({ message: 'Answer removed', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

