const app = require('./app');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const INSECURE_SECRETS = [
  'supersecretjwtkey_replace_in_production',
  'secret',
  'jwtsecret',
  '123456'
];

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || INSECURE_SECRETS.includes(process.env.JWT_SECRET)) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: A cryptographically strong JWT_SECRET (at least 32 characters) is required in production.');
    process.exit(1);
  } else {
    console.warn('⚠️  SECURITY WARNING: Using placeholder or weak JWT_SECRET in development. Set a strong secret in .env before deploying to production.');
  }
}

const http = require('http');
const socketIo = require('socket.io');
const setupSocket = require('./socket/index');

const PORT = process.env.PORT || 5000;

// Lock the socket handshake to the same origins the REST API allows (app.js).
// Requests with no Origin header (non-browser clients) are still accepted.
const allowedOrigins = app.get('allowedOrigins') || [];
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  }
});

app.set('io', io);

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process (with a hard exit fallback in case close stalls)
  server.close(() => process.exit(1));
  setTimeout(() => process.exit(1), 5000).unref();
});

// Graceful shutdown: close the HTTP server and Mongo connections on SIGTERM/SIGINT
async function shutdown(signal) {
  console.log(`\n${signal} received — shutting down...`);
  server.close(async () => {
    try {
      await require('mongoose').connection.close();
      process.exit(0);
    } catch (err) {
      process.exit(1);
    }
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
