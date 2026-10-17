const router = require('express').Router();
const controller = require('../controllers/contestController');
const { protect, optionalProtect, authorize } = require('../middleware/authMiddleware');

router.get('/', controller.list);
router.get('/:id/leaderboard', controller.getLeaderboard);
router.post('/:id/submit', optionalProtect, controller.submitSolution);
router.post('/:id/run', optionalProtect, controller.runCode);
router.get('/:id', controller.get);
router.post('/', protect, authorize('moderator', 'admin'), controller.create);

module.exports = router;

