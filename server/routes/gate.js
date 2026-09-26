const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const controller = require('../controllers/gateProgressController');

router.use(protect);
router.get('/progress', controller.getProgress);
router.post('/topics/:topicId/start', controller.startTopic);
router.post('/topics/:topicId/complete', controller.completeTopic);
router.post('/topics/:topicId/reopen', controller.reopenTopic);

module.exports = router;
