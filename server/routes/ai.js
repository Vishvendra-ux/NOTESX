const router = require('express').Router();
const { ask } = require('../controllers/aiController');
const { optionalProtect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/chat', aiLimiter, optionalProtect, ask);

module.exports = router;

