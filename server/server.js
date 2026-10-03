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

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Using * for dev, can be configured for production
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
