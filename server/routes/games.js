const express = require('express');
const router = express.Router();
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const gameController = require('../controllers/gameController');

// Famous games catalog
router.get('/famous', gameController.getFamousGames);

// Game rooms listing
router.get('/rooms', optionalProtect, gameController.getRooms);

// Host a new game room
router.post('/rooms', protect, gameController.createRoom);

// Join squad in room
router.post('/rooms/:id/join', protect, gameController.joinRoom);

// Leave squad in room
router.post('/rooms/:id/leave', protect, gameController.leaveRoom);

// Update room status / password / info
router.patch('/rooms/:id/status', protect, gameController.updateRoomStatus);

// Delete room
router.delete('/rooms/:id', protect, gameController.deleteRoom);

module.exports = router;
