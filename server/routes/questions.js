const router = require('express').Router(); const controller = require('../controllers/questionController'); const { protect, authorize } = require('../middleware/authMiddleware');
router.get('/', controller.list); router.post('/', protect, authorize('moderator', 'admin'), controller.create); module.exports = router;
