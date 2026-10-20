const express = require('express');
const router = express.Router();
const { register, login, googleLogin, completeStudentOnboarding, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleLogin);
router.put('/onboarding', protect, completeStudentOnboarding);
router.get('/me', protect, getMe);

module.exports = router;
