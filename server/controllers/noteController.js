const Note = require('../models/Note');

exports.list = async (req, res, next) => {
  try {
    const { search = '', subjectId, collegeId } = req.query; const filter = { status: 'approved' };
    if (search) filter.$or = ['title', 'description', 'topic', 'tags'].map((field) => ({ [field]: { $regex: search, $options: 'i' } }));
    if (subjectId) filter.subjectId = subjectId; if (collegeId) filter.collegeId = collegeId;
    res.json(await Note.find(filter).populate('uploaderId', 'name profilePhoto').sort({ createdAt: -1 }));
  } catch (error) { next(error); }
};
exports.get = async (req, res, next) => { try { const note = await Note.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate('uploaderId', 'name profilePhoto'); if (!note) return res.status(404).json({ message: 'Note not found' }); res.json(note); } catch (error) { next(error); } };
exports.create = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'A note file is required' });
    const note = await Note.create({ ...req.body, uploaderId: req.user._id, fileUrl: `/uploads/${req.file.filename}`, fileType: req.file.mimetype, fileSize: req.file.size, status: 'approved', tags: req.body.tags ? JSON.parse(req.body.tags) : [] });
    res.status(201).json(note);
  } catch (error) { next(error); }
};
