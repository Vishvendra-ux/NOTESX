const router = require('express').Router();
const controller = require('../controllers/jobController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.get('/', optionalProtect, controller.list);
router.get('/stats', controller.stats);
router.get('/my/applications', protect, controller.myApplications);
router.get('/:id', optionalProtect, controller.get);

router.post('/', protect, controller.create);
router.post('/:id/save', protect, controller.toggleSave);
router.post('/:id/apply', protect, controller.apply);

module.exports = router;
