const jwt = require('jsonwebtoken');
const ProjectMessage = require('../models/ProjectMessage');
const User = require('../models/User');

module.exports = (io) => {
  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error: Token missing'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) return next(new Error('Authentication error: User not found'));
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.name} connected to socket: ${socket.id}`);

    // Join a project room
    socket.on('join_project', (projectId) => {
      socket.join(projectId);
      console.log(`Socket ${socket.id} joined project room: ${projectId}`);
    });

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        const { projectId, text } = data;
        
        // Save to DB using authenticated user data, not client payload
        const message = await ProjectMessage.create({
          project: projectId,
          sender: socket.user._id,
          senderName: socket.user.name,
          senderAvatar: socket.user.profilePhoto || '',
          text
        });

        // Broadcast to room
        io.to(projectId).emit('receive_message', message);
      } catch (err) {
        console.error('Error handling send_message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user?.name} disconnected: ${socket.id}`);
    });
  });
};
