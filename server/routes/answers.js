const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for nested routes
const controller = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

// Nested under /api/doubts/:doubtId/answers
router.get('/', controller.list);
router.post('/', protect, controller.create);

// Direct routes /api/answers/:id
router.post('/:id/upvote', protect, controller.upvote);
router.post('/:id/downvote', protect, controller.downvote);
router.delete('/:id', protect, controller.deleteAnswer);

module.exports = router;

