const router = require('express').Router(); 
const controller = require('../controllers/doubtController'); 
const { protect } = require('../middleware/authMiddleware');
const answerRouter = require('./answers');

// Mount answer router
router.use('/:doubtId/answers', answerRouter);

router.get('/', controller.list); 
router.get('/:id', controller.get); 
router.post('/', protect, controller.create); 
router.post('/:id/upvote', protect, controller.upvote); 
router.post('/:id/downvote', protect, controller.downvote); 
router.post('/:id/accept/:answerId', protect, controller.acceptAnswer); 
module.exports = router;
