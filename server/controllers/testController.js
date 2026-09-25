const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');

exports.list = async (req, res, next) => { try { res.json(await Test.find({ creatorId: req.user._id }).populate('questions').sort({ createdAt: -1 })); } catch (error) { next(error); } };
exports.get = async (req, res, next) => { try { const test = await Test.findById(req.params.id).populate('questions'); if (!test) return res.status(404).json({ message: 'Test not found' }); res.json(test); } catch (error) { next(error); } };
exports.create = async (req, res, next) => { try { const test = await Test.create({ ...req.body, creatorId: req.user._id }); res.status(201).json(test); } catch (error) { next(error); } };
exports.submit = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id).populate('questions'); if (!test) return res.status(404).json({ message: 'Test not found' });
    const answers = req.body.answers || {}; const score = test.questions.reduce((total, question) => total + (Number(answers[question._id]) === question.correctAnswer ? question.marks : 0), 0);
    const attempt = await TestAttempt.create({ userId: req.user._id, testId: test._id, answers, score, status: 'Completed', endTime: new Date() });
    res.status(201).json({ attempt, score, totalMarks: test.totalMarks });
  } catch (error) { next(error); }
};
