const router = require('express').Router();
const { ask, getQuota } = require('../controllers/aiAssistantController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');

// Rate-limited & authenticated: forwards prompts to Gemini 2.5 Flash / NOTESX Knowledge Base
router.post('/chat', aiLimiter, protect, ask);

// Check remaining daily AI questions and Pro status
router.get('/quota', protect, getQuota);

module.exports = router;

