const router = require('express').Router();
const controller = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, controller.list);
router.get('/categories', protect, controller.categories);
router.get('/:idOrSlug', protect, controller.get);

module.exports = router;
