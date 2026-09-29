const router = require('express').Router();
const controller = require('../controllers/roadmapController');
const { optionalProtect } = require('../middleware/authMiddleware');

router.get('/', controller.list);
router.get('/categories', controller.categories);
router.get('/:idOrSlug', optionalProtect, controller.get);

module.exports = router;
