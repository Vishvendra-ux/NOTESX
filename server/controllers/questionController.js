const Question = require('../models/Question');
exports.list = async (req, res, next) => { try { const filter = {}; ['subjectId', 'topic', 'difficulty', 'type'].forEach((key) => { if (req.query[key]) filter[key] = req.query[key]; }); res.json(await Question.find(filter).select('-correctAnswer').sort({ createdAt: -1 })); } catch (error) { next(error); } };
exports.create = async (req, res, next) => { try { res.status(201).json(await Question.create({ ...req.body, createdBy: req.user._id })); } catch (error) { next(error); } };
