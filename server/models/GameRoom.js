const mongoose = require('mongoose');

const gameRoomSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    gameTitle: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    roomId: {
      type: String,
      required: [true, 'Room ID or Code is required'],
      trim: true,
      maxlength: 60,
    },
    roomPassword: {
      type: String,
      trim: true,
      default: '',
      maxlength: 60,
    },
    gameMode: {
      type: String,
      default: 'Custom Match',
      trim: true,
      maxlength: 60,
    },
    serverRegion: {
      type: String,
      default: 'India / Asia',
      trim: true,
      maxlength: 60,
    },
    maxPlayers: {
      type: Number,
      required: true,
      min: 2,
      max: 100,
      default: 4,
    },
    currentPlayers: {
      type: Number,
      default: 1,
      min: 1,
    },
    players: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        college: {
          type: String,
          default: '',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    voiceChannel: {
      type: String,
      default: 'In-game Mic',
      enum: ['In-game Mic', 'Discord Voice', 'Google Meet / Voice', 'No Mic Required'],
    },
    discordOrLink: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hostName: {
      type: String,
      required: true,
    },
    hostCollege: {
      type: String,
      default: 'College Student',
    },
    status: {
      type: String,
      enum: ['OPEN', 'FULL', 'IN_PROGRESS', 'CLOSED'],
      default: 'OPEN',
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours validity
    },
  },
  {
    timestamps: true,
  }
);

// Auto-delete expired rooms using MongoDB TTL index
gameRoomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('GameRoom', gameRoomSchema);
