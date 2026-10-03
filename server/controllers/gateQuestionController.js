const GateQuestion = require('../models/GateQuestion');

exports.getQuestions = async (req, res, next) => {
  try {
    const { subjectId, topicId } = req.query;
    
    if (!subjectId) {
      return res.status(400).json({ message: 'subjectId is required' });
    }

    const query = { subjectId };
    
    // If topicId is provided and it's not 'all', filter by it
    if (topicId && topicId !== 'all') {
      query.topicId = topicId;
    }

    const questions = await GateQuestion.find(query).sort({ examYear: -1, createdAt: -1 }).lean();
    
    // Map them to the frontend format expected by GatePracticeViewer
    const formattedQuestions = questions.map(q => ({
      id: q._id.toString(),
      subjectId: q.subjectId,
      topicId: q.topicId,
      question: q.questionHtml, 
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanationHtml,
      marks: q.marks,
      examYear: q.examYear
    }));

    res.json(formattedQuestions);
  } catch (error) {
    next(error);
  }
};
