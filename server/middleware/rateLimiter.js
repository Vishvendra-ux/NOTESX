const rateLimit = require('express-rate-limit');

// Rate limiter for authentication endpoints: login, register, google auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// Rate limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 AI queries per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many AI requests. Please wait a moment before sending more queries.'
  }
});

// Rate limiter for file uploads (resumes & notes)
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Upload rate limit reached. Please wait before uploading additional files.'
  }
});

// General API request limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests. Please slow down and try again later.'
  }
});

module.exports = {
  authLimiter,
  aiLimiter,
  uploadLimiter,
  generalLimiter
};
