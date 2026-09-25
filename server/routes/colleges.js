const router = require('express').Router();
const collegeController = require('../controllers/collegeController');
const communityController = require('../controllers/collegeCommunityController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Standard College routes
router.get('/', collegeController.list);

// College Community Specific Routes
router.get('/community/:slugOrId', communityController.getCollegeDetails);
router.get('/community/:slugOrId/posts', communityController.getCollegePosts);
router.post('/community/:slugOrId/posts', communityController.createCollegePost);
router.post('/community/posts/:postId/upvote', communityController.upvotePost);
router.delete('/community/posts/:postId', communityController.deleteCollegePost);
router.get('/community/:slugOrId/events', communityController.getCollegeEvents);
router.get('/community/:slugOrId/leaderboard', communityController.getCollegeLeaderboard);

// Fallback GET by ID
router.get('/:id', collegeController.get);
router.post('/', protect, authorize('admin'), collegeController.create);

module.exports = router;
