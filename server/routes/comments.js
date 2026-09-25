const express = require('express');
const router = express.Router();
const controller = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', controller.list);
router.post('/', protect, controller.create);

module.exports = router;

