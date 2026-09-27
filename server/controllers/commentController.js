const Comment = require('../models/Comment');
const Doubt = require('../models/Doubt');
const Answer = require('../models/Answer');

exports.create = async (req, res, next) => {
  try {
    const { content, onModel, parentId } = req.body;
    
    // Validate parent exists
    let parentExists = false;
    if (onModel === 'Doubt') {
      parentExists = await Doubt.exists({ _id: parentId });
    } else if (onModel === 'Answer') {
      parentExists = await Answer.exists({ _id: parentId });
    }
    
    if (!parentExists) return res.status(404).json({ message: `${onModel} not found` });
    
    const comment = await Comment.create({
      content,
      onModel,
      parentId,
      authorId: req.user._id
    });
    
    const populated = await Comment.findById(comment._id)
      .populate('authorId', 'name profilePhoto reputation');

    res.status(201).json(populated);
  } catch (error) { next(error); }
};

exports.list = async (req, res, next) => {
  try {
    const { parentId, onModel } = req.query;
    if (!parentId || !onModel) {
      return res.status(400).json({ message: 'parentId and onModel are required' });
    }
    
    const comments = await Comment.find({ parentId, onModel })
      .populate('authorId', 'name profilePhoto reputation')
      .sort({ createdAt: 1 });
      
    res.json(comments);
  } catch (error) { next(error); }
};

