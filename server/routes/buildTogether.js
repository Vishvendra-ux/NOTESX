const router = require('express').Router();
const controller = require('../controllers/buildTogetherController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.get('/', optionalProtect, controller.list);
router.get('/:id', optionalProtect, controller.get);

router.post('/', protect, controller.create);
router.post('/:id/apply', protect, controller.apply);
router.post('/:id/upvote', protect, controller.toggleUpvote);
router.patch('/:id/applications/:appId', protect, controller.manageApplication);
router.delete('/:id', protect, controller.delete);

module.exports = router;
