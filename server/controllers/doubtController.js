const Doubt = require('../models/Doubt');
const Answer = require('../models/Answer');
const User = require('../models/User');

exports.list = async (req, res, next) => { try { const { search = '', collegeId, sort = 'latest' } = req.query; const filter = search ? { $or: ['title', 'description', 'topic', 'tags'].map((field) => ({ [field]: { $regex: search, $options: 'i' } })) } : {}; if (collegeId) filter.collegeId = collegeId; let sortOption = { createdAt: -1 }; if (sort === 'trending') sortOption = { upvotes: -1, answersCount: -1 }; if (sort === 'unanswered') { filter.answersCount = 0; sortOption = { createdAt: -1 }; } res.json(await Doubt.find(filter).populate('askerId', 'name profilePhoto reputation badges').sort(sortOption)); } catch (error) { next(error); } };

exports.get = async (req, res, next) => { try { const doubt = await Doubt.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('askerId', 'name profilePhoto reputation badges'); if (!doubt) return res.status(404).json({ message: 'Doubt not found' }); res.json(doubt); } catch (error) { next(error); } };

exports.create = async (req, res, next) => { try { const doubt = await Doubt.create({ ...req.body, askerId: req.user._id }); res.status(201).json(doubt); } catch (error) { next(error); } };

exports.upvote = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    
    const userId = req.user._id.toString();
    const upvotedByIndex = doubt.upvotedBy.findIndex(id => id.toString() === userId);
    
    if (upvotedByIndex !== -1) {
      doubt.upvotedBy.splice(upvotedByIndex, 1);
      doubt.upvotes -= 1;
      await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: -5 } });
    } else {
      doubt.upvotedBy.push(userId);
      doubt.upvotes += 1;
      
      const downvotedByIndex = doubt.downvotedBy.findIndex(id => id.toString() === userId);
      if (downvotedByIndex !== -1) {
        doubt.downvotedBy.splice(downvotedByIndex, 1);
        doubt.downvotes -= 1;
        await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: 2 } });
      }
      
      await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: 5 } });
    }
    
    await doubt.save();
    res.json(doubt);
  } catch (error) { next(error); }
};

exports.downvote = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    
    const userId = req.user._id.toString();
    const downvotedByIndex = doubt.downvotedBy.findIndex(id => id.toString() === userId);
    
    if (downvotedByIndex !== -1) {
      doubt.downvotedBy.splice(downvotedByIndex, 1);
      doubt.downvotes -= 1;
      await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: 2 } });
    } else {
      doubt.downvotedBy.push(userId);
      doubt.downvotes += 1;
      
      const upvotedByIndex = doubt.upvotedBy.findIndex(id => id.toString() === userId);
      if (upvotedByIndex !== -1) {
        doubt.upvotedBy.splice(upvotedByIndex, 1);
        doubt.upvotes -= 1;
        await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: -5 } });
      }
      
      await User.findByIdAndUpdate(doubt.askerId, { $inc: { reputation: -2 } });
    }
    
    await doubt.save();
    res.json(doubt);
  } catch (error) { next(error); }
};

exports.acceptAnswer = async (req, res, next) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: 'Doubt not found' });
    
    if (doubt.askerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only asker can accept answer' });
    }
    
    const answer = await Answer.findById(req.params.answerId);
    if (!answer || answer.doubtId.toString() !== doubt._id.toString()) {
      return res.status(404).json({ message: 'Answer not found for this doubt' });
    }
    
    await Answer.updateMany({ doubtId: doubt._id }, { isAccepted: false });
    
    answer.isAccepted = true;
    await answer.save();
    
    doubt.hasAcceptedAnswer = true;
    doubt.status = 'resolved';
    await doubt.save();
    
    await User.findByIdAndUpdate(answer.answererId, { $inc: { reputation: 15 } });
    
    res.json({ message: 'Answer accepted', answer });
  } catch (error) { next(error); }
};
