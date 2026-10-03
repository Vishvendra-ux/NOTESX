const ProjectMessage = require('../models/ProjectMessage');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected to socket: ${socket.id}`);

    // Join a project room
    socket.on('join_project', (projectId) => {
      socket.join(projectId);
      console.log(`Socket ${socket.id} joined project room: ${projectId}`);
    });

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        const { projectId, senderId, senderName, senderAvatar, text } = data;
        
        // Save to DB
        const message = await ProjectMessage.create({
          project: projectId,
          sender: senderId,
          senderName,
          senderAvatar,
          text
        });

        // Broadcast to room
        io.to(projectId).emit('receive_message', message);
      } catch (err) {
        console.error('Error handling send_message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
