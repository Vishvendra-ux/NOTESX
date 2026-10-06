const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

const { generalLimiter } = require('./middleware/rateLimiter');

// Behind one reverse proxy (Render/Heroku/Nginx) in production, so rate
// limiters key on the real client IP instead of the proxy IP
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Allowed origins
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked: Origin not allowed.'));
  },
  credentials: true
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "http://localhost:5001", "http://localhost:5173", "https:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  }
}));

// Serve uploads securely as downloadable attachments with strict CSP to prevent script execution
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    res.setHeader('Content-Disposition', 'attachment');
  }
}));

// Apply general rate limiter across all /api routes
app.use('/api', generalLimiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gate', require('./routes/gate'));
app.use('/api', require('./routes/hierarchy'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/doubts', require('./routes/doubts'));
app.use('/api/answers', require('./routes/answers'));
app.use('/api/contests', require('./routes/contests'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/roadmaps', require('./routes/roadmaps'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/build-together', require('./routes/buildTogether'));
app.use('/api/games', require('./routes/games'));

// Basic Route
app.get('/', (req, res) => {
  res.send('NOTESX API is running...');
});

// JSON 404 for unknown API routes (Express's default HTML 404 is unhelpful for clients)
app.use('/api', (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';

  // Multer upload errors and bad ObjectIds are client mistakes, not server faults
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier format';
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'Uploaded file is too large';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload failed';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value for a unique field';
  }

  if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
    // Don't leak driver internals/file paths to clients in production
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
