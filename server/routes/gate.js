const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const progressController = require('../controllers/gateProgressController');
const questionController = require('../controllers/gateQuestionController');

// Public or optional protect if you want non-logged in users to practice
router.get('/questions', questionController.getQuestions);

router.use(protect);
router.get('/progress', progressController.getProgress);
router.post('/topics/:topicId/start', progressController.startTopic);
router.post('/topics/:topicId/complete', progressController.completeTopic);
router.post('/topics/:topicId/reopen', progressController.reopenTopic);

module.exports = router;
