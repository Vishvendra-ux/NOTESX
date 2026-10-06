const router = require('express').Router();
const { ask } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');

// Auth required: this endpoint forwards prompts to the paid Gemini API, so
// anonymous traffic would be an unbounded cost-abuse vector.
router.post('/chat', aiLimiter, protect, ask);

module.exports = router;

