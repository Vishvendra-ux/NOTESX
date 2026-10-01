const router = require('express').Router();
const controller = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, controller.list);
router.get('/stats', protect, controller.stats);
router.get('/my/applications', protect, controller.myApplications);
router.get('/:id', protect, controller.get);

router.post('/', protect, authorize('admin', 'recruiter'), controller.create);
router.post('/:id/save', protect, controller.toggleSave);
router.post('/:id/apply', protect, controller.apply);

module.exports = router;
