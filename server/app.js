const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/contests', require('./routes/contests'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/comments', require('./routes/comments'));

// Basic Route
app.get('/', (req, res) => {
  res.send('NOTESX API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
