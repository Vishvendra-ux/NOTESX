const router = require('express').Router();
const { ask } = require('../controllers/aiController');
const { optionalProtect } = require('../middleware/authMiddleware');

router.post('/chat', optionalProtect, ask);

module.exports = router;

