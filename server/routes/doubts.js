const router = require('express').Router(); 
const controller = require('../controllers/doubtController'); 
const answerController = require('../controllers/answerController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// Public / with user context
router.get('/', optionalProtect, controller.list); 
router.get('/stats', controller.stats);
router.get('/:id', optionalProtect, controller.get); 

// Protected doubt actions
router.post('/', protect, controller.create); 
router.delete('/:id', protect, controller.deleteDoubt);
router.post('/:id/upvote', protect, controller.upvote); 
router.post('/:id/downvote', protect, controller.downvote); 
router.post('/:id/bookmark', protect, controller.toggleBookmark);
router.post('/:id/accept/:answerId', protect, controller.acceptAnswer); 

// Nested answer routes
router.get('/:doubtId/answers', optionalProtect, answerController.list);
router.post('/:doubtId/answers', protect, answerController.create);

module.exports = router;
