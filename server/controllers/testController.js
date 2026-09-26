const Test = require('../models/Test');
const TestAttempt = require('../models/TestAttempt');
const Question = require('../models/Question');

const questionPreview = { path: 'questions', select: 'questionText options topic difficulty type marks negativeMarks' };

exports.list = async (req, res, next) => {
  try {
    res.json(await Test.find({ creatorId: req.user._id }).populate(questionPreview).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
};

exports.get = async (req, res, next) => {
  try {
    const test = await Test.findOne({ _id: req.params.id, creatorId: req.user._id }).populate(questionPreview);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => { try { const test = await Test.create({ ...req.body, creatorId: req.user._id }); res.status(201).json(test); } catch (error) { next(error); } };

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.customize = async (req, res, next) => {
  try {
    const {
      subjectName = 'All subjects',
      topicTerms = [],
      topicLabels = [],
      difficulty = 'Any',
      questionCount = 10,
      duration = 20,
    } = req.body;
    const allowedCounts = [5, 10, 15, 20, 30, 45];
    const allowedDurations = [10, 15, 20, 30, 45, 60, 90, 180];
    if (!allowedCounts.includes(Number(questionCount)) || !allowedDurations.includes(Number(duration))) {
      return res.status(400).json({ message: 'Choose a supported question count and time limit.' });
    }
    if (!['Any', 'Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Choose a supported difficulty.' });
    }
    if (!Array.isArray(topicTerms) || topicTerms.length > 300 || !Array.isArray(topicLabels) || topicLabels.length > 30) {
      return res.status(400).json({ message: 'The topic selection is too large.' });
    }

    const filter = { type: 'MCQ', correctAnswer: { $type: 'number' }, options: { $exists: true, $ne: [] } };
    if (difficulty !== 'Any') filter.difficulty = difficulty;
    const safeTerms = [...new Set(topicTerms
      .filter((term) => typeof term === 'string')
      .map((term) => term.trim().slice(0, 100))
      .filter(Boolean))];
    if (safeTerms.length) {
      const stopWords = new Set(['about', 'after', 'and', 'basic', 'basics', 'from', 'into', 'other', 'system', 'systems', 'their', 'these', 'through', 'using', 'with', 'data', 'design']);
      const words = safeTerms.flatMap((term) => term.match(/[a-z0-9]{5,}/gi) || [])
        .filter((word) => !stopWords.has(word.toLowerCase()));
      const searchableTerms = [...new Set([...safeTerms, ...words])].slice(0, 500);
      filter.topic = { $in: searchableTerms.map((term) => new RegExp(escapeRegex(term), 'i')) };
    }

    const pool = await Question.find(filter)
      .select('questionText options correctAnswer explanation topic difficulty type marks negativeMarks')
      .limit(500)
      .lean();
    const count = Number(questionCount);
    if (pool.length < count) {
      const scope = subjectName === 'All subjects' ? 'the question bank' : `${subjectName}`;
      return res.status(422).json({ message: `Only ${pool.length} matching MCQ${pool.length === 1 ? '' : 's'} are available for ${scope}. Choose a broader topic, easier filters, or a smaller test.` });
    }

    // Shuffle a bounded pool so repeated custom tests vary for the student.
    for (let index = pool.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
    }
    const questions = pool.slice(0, count);
    const totalMarks = questions.reduce((total, question) => total + (question.marks || 1), 0);
    const safeSubjectName = String(subjectName).slice(0, 100);
    const safeTopicLabels = topicLabels.filter((label) => typeof label === 'string').map((label) => label.trim().slice(0, 80)).filter(Boolean);
    const scope = safeTopicLabels.length ? `${safeSubjectName}: ${safeTopicLabels.join(', ')}` : safeSubjectName;
    const title = `GATE CS · ${safeSubjectName === 'All subjects' ? 'Mixed practice' : safeSubjectName}`;
    const test = await Test.create({
      title,
      description: `${count} MCQs · ${scope} · ${difficulty === 'Any' ? 'mixed difficulty' : difficulty} · ${duration} minutes`,
      creatorId: req.user._id,
      questions: questions.map((question) => question._id),
      duration: Number(duration),
      totalMarks,
    });

    res.status(201).json({
      _id: test._id,
      title: test.title,
      description: test.description,
      duration: test.duration,
      totalMarks: test.totalMarks,
      questions: questions.map(({ _id, questionText, options, topic, difficulty: questionDifficulty, type, marks, negativeMarks }) => ({
        _id, questionText, options, topic, difficulty: questionDifficulty, type, marks, negativeMarks,
      })),
    });
  } catch (error) { next(error); }
};

exports.submit = async (req, res, next) => {
  try {
    const test = await Test.findOne({ _id: req.params.id, creatorId: req.user._id }).populate('questions');
    if (!test) return res.status(404).json({ message: 'Test not found' });
    const answers = req.body.answers || {};
    let score = 0;
    let correctCount = 0;
    let attemptedCount = 0;
    const results = test.questions.map((question) => {
      const answer = answers[question._id.toString()];
      const isAnswered = answer !== undefined && answer !== null && answer !== '';
      const isCorrect = isAnswered && Number(answer) === question.correctAnswer;
      if (isAnswered) attemptedCount += 1;
      if (isCorrect) {
        correctCount += 1;
        score += question.marks || 1;
      } else if (isAnswered) {
        score -= question.negativeMarks || 0;
      }
      return {
        questionId: question._id.toString(),
        selectedAnswer: isAnswered ? Number(answer) : null,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation || '',
      };
    });
    const attempt = await TestAttempt.create({ userId: req.user._id, testId: test._id, answers, score, status: 'Completed', endTime: new Date() });
    const accuracy = attemptedCount ? Math.round((correctCount / attemptedCount) * 100) : 0;
    res.status(201).json({ attempt, results, score, totalMarks: test.totalMarks, correctCount, attemptedCount, accuracy });
  } catch (error) { next(error); }
};
