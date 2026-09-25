const Answer = require('../models/Answer');
const Doubt = require('../models/Doubt');
const User = require('../models/User');

exports.create = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.doubtId);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    
    const answer = await Answer.create({
      ...req.body,
      doubtId: req.params.doubtId,
      answererId: req.user._id
    });
    
    res.status(201).json(answer);
  } catch (error) { next(error); }
};

exports.list = async (req, res, next) => {
  try {
    const answers = await Answer.find({ doubtId: req.params.doubtId })
      .populate('answererId', 'name profilePhoto reputation badges')
      .sort({ isAccepted: -1, upvotes: -1, createdAt: 1 });
      
    res.json(answers);
  } catch (error) { next(error); }
};

exports.upvote = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    
    const userId = req.user._id.toString();
    const upvotedByIndex = answer.upvotedBy.findIndex(id => id.toString() === userId);
    
    if (upvotedByIndex !== -1) {
      answer.upvotedBy.splice(upvotedByIndex, 1);
      answer.upvotes -= 1;
      await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: -10 } });
    } else {
      answer.upvotedBy.push(userId);
      answer.upvotes += 1;
      
      const downvotedByIndex = answer.downvotedBy.findIndex(id => id.toString() === userId);
      if (downvotedByIndex !== -1) {
        answer.downvotedBy.splice(downvotedByIndex, 1);
        answer.downvotes -= 1;
        await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: 2 } });
      }
      
      await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: 10 } });
    }
    
    await answer.save();
    res.json(answer);
  } catch (error) { next(error); }
};

exports.downvote = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    
    const userId = req.user._id.toString();
    const downvotedByIndex = answer.downvotedBy.findIndex(id => id.toString() === userId);
    
    if (downvotedByIndex !== -1) {
      answer.downvotedBy.splice(downvotedByIndex, 1);
      answer.downvotes -= 1;
      await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: 2 } });
    } else {
      answer.downvotedBy.push(userId);
      answer.downvotes += 1;
      
      const upvotedByIndex = answer.upvotedBy.findIndex(id => id.toString() === userId);
      if (upvotedByIndex !== -1) {
        answer.upvotedBy.splice(upvotedByIndex, 1);
        answer.upvotes -= 1;
        await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: -10 } });
      }
      
      await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: -2 } });
    }
    
    await answer.save();
    res.json(answer);
  } catch (error) { next(error); }
};

