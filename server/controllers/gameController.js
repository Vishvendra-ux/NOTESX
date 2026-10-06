const GameRoom = require('../models/GameRoom');
const User = require('../models/User');

const FAMOUS_GAMES = [
  {
    id: 'bgmi',
    name: 'BGMI (Battlegrounds Mobile India)',
    shortName: 'BGMI',
    category: 'Battle Royale',
    platforms: ['Android', 'iOS'],
    maxSquad: 4,
    color: 'from-amber-500 to-orange-600',
    accentColor: '#f97316',
    defaultModes: ['TDM 4v4 WareHouse', 'Classic Erangel Squad', 'Livik Rush', 'Custom Scrims'],
    description: "India's most popular battle royale. Drop into Erangel, Miramar, or battle in 4v4 TDM warehouse.",
    popularMaps: ['Warehouse (TDM)', 'Erangel', 'Livik', 'Miramar'],
  },
  {
    id: 'valorant',
    name: 'Valorant',
    shortName: 'Valorant',
    category: 'Tactical FPS',
    platforms: ['PC'],
    maxSquad: 5,
    color: 'from-rose-500 to-red-600',
    accentColor: '#e11d48',
    defaultModes: ['5v5 Custom Match', 'Swiftplay Party', 'Competitive 5-Stack', 'Unrated', 'Deathmatch Warmup'],
    description: 'Riot Games precision 5v5 tactical shooter. Plant or defuse the spike with agent abilities.',
    popularMaps: ['Ascent', 'Bind', 'Haven', 'Split', 'Sunset', 'Lotus'],
  },
  {
    id: 'free-fire',
    name: 'Free Fire MAX',
    shortName: 'Free Fire',
    category: 'Battle Royale',
    platforms: ['Android', 'iOS'],
    maxSquad: 4,
    color: 'from-yellow-500 to-amber-600',
    accentColor: '#eab308',
    defaultModes: ['Clash Squad Custom (CS)', 'Battle Royale Ranked', 'Lone Wolf 2v2', 'Custom Room (Unlimited Gloo)'],
    description: 'High-speed battle royale tailored for mobile squad showdowns and Gloo Wall clutch battles.',
    popularMaps: ['Bermuda', 'Purgatory', 'Kalahari', 'NexTerra'],
  },
  {
    id: 'chess',
    name: 'Chess (Chess.com / Lichess)',
    shortName: 'Chess',
    category: 'Strategy & Mind',
    platforms: ['Web', 'Mobile', 'PC'],
    maxSquad: 2,
    color: 'from-emerald-600 to-teal-700',
    accentColor: '#059669',
    defaultModes: ['Blitz 3+2 min', 'Rapid 10 min', 'Bullet 1+0 min', 'Friendly Classical'],
    description: 'Test your tactical masterstrokes against fellow college students on Chess.com or Lichess.',
    popularMaps: ['Standard Board', 'Chess960', 'Puzzle Duel'],
  },
  {
    id: 'skribbl',
    name: 'Skribbl.io',
    shortName: 'Skribbl.io',
    category: 'Party & Casual',
    platforms: ['Web / Browser'],
    maxSquad: 12,
    color: 'from-blue-500 to-indigo-600',
    accentColor: '#3b82f6',
    defaultModes: ['Custom College Words', 'Standard Casual (80s)', 'Speed Draw (40s)'],
    description: 'Free multiplayer drawing and guessing game right in your browser. Perfect for hostel night sessions.',
    popularMaps: ['Browser Private Room'],
  },
  {
    id: 'codm',
    name: 'Call of Duty: Mobile (CODM)',
    shortName: 'COD Mobile',
    category: 'Action FPS',
    platforms: ['Android', 'iOS'],
    maxSquad: 5,
    color: 'from-slate-700 to-zinc-900',
    accentColor: '#475569',
    defaultModes: ['Search & Destroy 5v5', 'Team Deathmatch', 'Battle Royale Squad', 'Hardpoint Shipment'],
    description: 'Iconic Call of Duty multiplayer combat, scorestreaks, and battle royale on smartphone.',
    popularMaps: ['Crash', 'Shipment', 'Firing Range', 'Raid', 'Isolated'],
  },
  {
    id: 'among-us',
    name: 'Among Us',
    shortName: 'Among Us',
    category: 'Social Deduction',
    platforms: ['Mobile', 'PC', 'Console'],
    maxSquad: 10,
    color: 'from-cyan-500 to-blue-600',
    accentColor: '#06b6d4',
    defaultModes: ['The Skeld (2 Impostors)', 'Polus (2 Impostors)', 'Hide & Seek Mode', 'Mira HQ'],
    description: 'Crewmates vs Impostors. Complete ship tasks or deceive everyone in emergency meetings.',
    popularMaps: ['The Skeld', 'Mira HQ', 'Polus', 'Airship'],
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    shortName: 'Minecraft',
    category: 'Sandbox / Survival',
    platforms: ['PC', 'Mobile', 'Console'],
    maxSquad: 8,
    color: 'from-green-600 to-emerald-700',
    accentColor: '#16a34a',
    defaultModes: ['Survival SMP Server', 'Bedwars Squads', 'Skywars Duels', 'Creative Build Battle'],
    description: 'Mine, craft, survive, and build together in private student realms and multiplayer servers.',
    popularMaps: ['Private Survival World', 'Bedwars Arena', 'Aternos / Local Server'],
  },
  {
    id: 'clash-royale',
    name: 'Clash Royale',
    shortName: 'Clash Royale',
    category: 'Card & Strategy',
    platforms: ['Android', 'iOS'],
    maxSquad: 2,
    color: 'from-sky-500 to-blue-600',
    accentColor: '#0284c7',
    defaultModes: ['1v1 Friendly Battle', '2v2 Clan Friendly', 'Draft Tournament'],
    description: 'Fast-paced real-time card strategy battles with troops, spells, and defenses.',
    popularMaps: ['Legendary Arena', 'Tournament Standard'],
  },
  {
    id: 'other',
    name: 'Custom / Other Games',
    shortName: 'Other Game',
    category: 'Multiplayer Party',
    platforms: ['Cross-platform'],
    maxSquad: 8,
    color: 'from-purple-600 to-indigo-700',
    accentColor: '#7c3aed',
    defaultModes: ['Custom Room', 'Multiplayer Lobby', 'Online Match'],
    description: 'Host rooms for EA FC, Rocket League, Roblox, Fall Guys, or any favorite game.',
    popularMaps: ['Custom Lobby'],
  },
];

// Helper to broadcast socket events
const emitSocket = (req, event, data) => {
  try {
    const io = req.app.get('io');
    if (io) {
      io.to('game_lobby').emit(event, data);
      io.emit(event, data);
    }
  } catch (err) {
    console.warn('Socket emit error in gameController:', err.message);
  }
};

// GET /api/games/famous
exports.getFamousGames = async (req, res) => {
  try {
    const now = new Date();
    // Count active rooms per gameId
    const roomCounts = await GameRoom.aggregate([
      { $match: { expiresAt: { $gt: now }, status: { $ne: 'CLOSED' } } },
      { $group: { _id: '$gameId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    roomCounts.forEach((r) => {
      countMap[r._id] = r.count;
    });

    const gamesWithCounts = FAMOUS_GAMES.map((game) => ({
      ...game,
      activeRoomCount: countMap[game.id] || 0,
    }));

    res.json({ success: true, games: gamesWithCounts });
  } catch (error) {
    console.error('Error fetching famous games:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch games' });
  }
};

// GET /api/games/rooms
exports.getRooms = async (req, res) => {
  try {
    const { gameId, status, search } = req.query;
    const now = new Date();

    const query = {
      expiresAt: { $gt: now },
      status: { $ne: 'CLOSED' },
    };

    if (gameId && gameId !== 'all') {
      query.gameId = gameId;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { roomId: { $regex: term, $options: 'i' } },
        { gameTitle: { $regex: term, $options: 'i' } },
        { hostName: { $regex: term, $options: 'i' } },
        { hostCollege: { $regex: term, $options: 'i' } },
        { gameMode: { $regex: term, $options: 'i' } },
      ];
    }

    let rooms = await GameRoom.find(query).sort({ createdAt: -1 }).lean();

    // If zero rooms and no search filter, auto-seed starter rooms so student sees activity
    if (rooms.length === 0 && !search && (!gameId || gameId === 'all') && (!status || status === 'all')) {
      await seedDefaultRooms();
      rooms = await GameRoom.find(query).sort({ createdAt: -1 }).lean();
    }

    // Annotate whether current user has joined
    const userId = req.user?._id?.toString();
    const formattedRooms = rooms.map((room) => {
      const isHost = userId && room.hostId?.toString() === userId;
      const isPlayer = userId && room.players?.some((p) => p.userId?.toString() === userId);
      return {
        ...room,
        isHost: Boolean(isHost),
        hasJoined: Boolean(isPlayer),
        availableSlots: Math.max(0, room.maxPlayers - (room.players?.length || room.currentPlayers || 1)),
      };
    });

    res.json({
      success: true,
      count: formattedRooms.length,
      rooms: formattedRooms,
    });
  } catch (error) {
    console.error('Error fetching game rooms:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch game rooms' });
  }
};

// POST /api/games/rooms
exports.createRoom = async (req, res) => {
  try {
    const {
      gameId,
      gameTitle,
      title,
      roomId,
      roomPassword,
      gameMode,
      serverRegion,
      maxPlayers,
      voiceChannel,
      discordOrLink,
      notes,
    } = req.body;

    if (!gameId || !roomId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Game, Title, and Room ID are required to host a room.',
      });
    }

    const gameMeta = FAMOUS_GAMES.find((g) => g.id === gameId);
    const parsedMax = parseInt(maxPlayers, 10) || gameMeta?.maxSquad || 4;

    const newRoom = new GameRoom({
      gameId,
      gameTitle: gameTitle || gameMeta?.name || 'Custom Game',
      title: title.trim(),
      roomId: roomId.trim(),
      roomPassword: roomPassword ? roomPassword.trim() : '',
      gameMode: gameMode ? gameMode.trim() : 'Custom Match',
      serverRegion: serverRegion ? serverRegion.trim() : 'India / Asia',
      maxPlayers: Math.min(Math.max(parsedMax, 2), 100),
      currentPlayers: 1,
      players: [
        {
          userId: req.user._id,
          name: req.user.name,
          college: req.user.collegeName || 'Student',
          joinedAt: new Date(),
        },
      ],
      voiceChannel: voiceChannel || 'In-game Mic',
      discordOrLink: discordOrLink ? discordOrLink.trim() : '',
      notes: notes ? notes.trim() : '',
      hostId: req.user._id,
      hostName: req.user.name,
      hostCollege: req.user.collegeName || 'Student',
      status: 'OPEN',
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    });

    await newRoom.save();

    emitSocket(req, 'game_room_created', newRoom);

    res.status(201).json({
      success: true,
      message: 'Game room hosted successfully! Others can now see your Room ID and Password.',
      room: newRoom,
    });
  } catch (error) {
    console.error('Error creating game room:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create game room' });
  }
};

// POST /api/games/rooms/:id/join
exports.joinRoom = async (req, res) => {
  try {
    const room = await GameRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Game room not found or has expired.' });
    }

    if (room.status === 'CLOSED') {
      return res.status(400).json({ success: false, message: 'This room has already been closed.' });
    }

    const userIdStr = req.user._id.toString();
    const alreadyJoined = room.players.some((p) => p.userId.toString() === userIdStr);

    if (alreadyJoined) {
      return res.json({
        success: true,
        message: 'You have already joined this room squad!',
        room,
      });
    }

    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({
        success: false,
        message: 'This room squad is already full!',
      });
    }

    room.players.push({
      userId: req.user._id,
      name: req.user.name,
      college: req.user.collegeName || 'Student',
      joinedAt: new Date(),
    });

    room.currentPlayers = room.players.length;
    if (room.currentPlayers >= room.maxPlayers) {
      room.status = 'FULL';
    }

    await room.save();

    emitSocket(req, 'game_room_updated', room);

    res.json({
      success: true,
      message: 'Successfully joined squad! Room credentials are ready to copy.',
      room,
    });
  } catch (error) {
    console.error('Error joining game room:', error);
    res.status(500).json({ success: false, message: 'Failed to join game room' });
  }
};

// POST /api/games/rooms/:id/leave
exports.leaveRoom = async (req, res) => {
  try {
    const room = await GameRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Game room not found.' });
    }

    const userIdStr = req.user._id.toString();

    // If host leaves, either close or keep open
    if (room.hostId.toString() === userIdStr) {
      room.status = 'CLOSED';
      await room.save();
      emitSocket(req, 'game_room_deleted', { roomId: room._id });
      return res.json({
        success: true,
        message: 'You closed your hosted game room.',
      });
    }

    room.players = room.players.filter((p) => p.userId.toString() !== userIdStr);
    room.currentPlayers = room.players.length;
    if (room.status === 'FULL' && room.currentPlayers < room.maxPlayers) {
      room.status = 'OPEN';
    }

    await room.save();
    emitSocket(req, 'game_room_updated', room);

    res.json({
      success: true,
      message: 'Left the game squad.',
      room,
    });
  } catch (error) {
    console.error('Error leaving game room:', error);
    res.status(500).json({ success: false, message: 'Failed to leave game room' });
  }
};

// PATCH /api/games/rooms/:id/status
exports.updateRoomStatus = async (req, res) => {
  try {
    const { status, roomId, roomPassword, gameMode, notes } = req.body;
    const room = await GameRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    const isHost = room.hostId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only the host or admin can update this room.' });
    }

    if (status) room.status = status;
    if (roomId) room.roomId = roomId.trim();
    if (roomPassword !== undefined) room.roomPassword = roomPassword.trim();
    if (gameMode) room.gameMode = gameMode.trim();
    if (notes !== undefined) room.notes = notes.trim();

    await room.save();
    emitSocket(req, 'game_room_updated', room);

    res.json({ success: true, message: 'Room updated successfully!', room });
  } catch (error) {
    console.error('Error updating game room status:', error);
    res.status(500).json({ success: false, message: 'Failed to update room' });
  }
};

// DELETE /api/games/rooms/:id
exports.deleteRoom = async (req, res) => {
  try {
    const room = await GameRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    const isHost = room.hostId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isHost && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only the host or admin can delete this room.' });
    }

    await GameRoom.findByIdAndDelete(req.params.id);
    emitSocket(req, 'game_room_deleted', { roomId: req.params.id });

    res.json({ success: true, message: 'Game room deleted successfully.' });
  } catch (error) {
    console.error('Error deleting game room:', error);
    res.status(500).json({ success: false, message: 'Failed to delete room' });
  }
};

// Helper: Seed active starter rooms if empty
async function seedDefaultRooms() {
  try {
    const demoUser = await User.findOne({ role: { $in: ['student', 'admin'] } });
    if (!demoUser) return;

    const sampleRooms = [
      {
        gameId: 'bgmi',
        gameTitle: 'BGMI (Battlegrounds Mobile India)',
        title: '🔥 4v4 TDM Warehouse - M24 & Sniper Only! Mic Required',
        roomId: '839201',
        roomPassword: '1234',
        gameMode: 'TDM 4v4 WareHouse',
        serverRegion: 'India / Mumbai',
        maxPlayers: 4,
        currentPlayers: 2,
        players: [
          { userId: demoUser._id, name: demoUser.name, college: demoUser.collegeName || 'GLA University' },
          { userId: demoUser._id, name: 'Aman Sharma', college: 'IIT Delhi' },
        ],
        voiceChannel: 'In-game Mic',
        notes: 'Room starting in 5 mins! Friendly match, no toxic players.',
        hostId: demoUser._id,
        hostName: demoUser.name,
        hostCollege: demoUser.collegeName || 'GLA University',
        status: 'OPEN',
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      },
      {
        gameId: 'valorant',
        gameTitle: 'Valorant',
        title: '⚡ 5v5 Custom Ascent - Need 2 Players (Gold/Plat Elo)',
        roomId: 'VALO-DELHI-55',
        roomPassword: 'valo',
        gameMode: '5v5 Custom Match',
        serverRegion: 'Mumbai Server',
        maxPlayers: 5,
        currentPlayers: 3,
        players: [
          { userId: demoUser._id, name: 'Rohan Verma', college: 'DTU Delhi' },
          { userId: demoUser._id, name: 'Siddharth K', college: 'NSUT' },
          { userId: demoUser._id, name: demoUser.name, college: demoUser.collegeName || 'GLA University' },
        ],
        voiceChannel: 'Discord Voice',
        discordOrLink: 'https://discord.gg/student-gaming-notesx',
        notes: 'Casual swiftplay/unrated custom. Join Discord voice for calls.',
        hostId: demoUser._id,
        hostName: 'Rohan Verma',
        hostCollege: 'DTU Delhi',
        status: 'OPEN',
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      },
      {
        gameId: 'chess',
        gameTitle: 'Chess (Chess.com / Lichess)',
        title: '♟️ Friendly 5-Min Blitz Arena - Join Lichess Link or Code',
        roomId: 'LICHESS-BLITZ-99',
        roomPassword: 'open',
        gameMode: 'Blitz 3+2 min',
        serverRegion: 'Global',
        maxPlayers: 2,
        currentPlayers: 1,
        players: [
          { userId: demoUser._id, name: 'Priya Patel', college: 'BITS Pilani' },
        ],
        voiceChannel: 'No Mic Required',
        discordOrLink: 'https://lichess.org',
        notes: 'Looking for a challenging game over study break! Anyone rated 1200-1800 welcome.',
        hostId: demoUser._id,
        hostName: 'Priya Patel',
        hostCollege: 'BITS Pilani',
        status: 'OPEN',
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      },
      {
        gameId: 'skribbl',
        gameTitle: 'Skribbl.io',
        title: '🎨 CS Engineering Wordlist Drawing Night! Everyone Welcome',
        roomId: 'SKRIBBL-ENGG-2026',
        roomPassword: '',
        gameMode: 'Custom College Words',
        serverRegion: 'Web Browser',
        maxPlayers: 12,
        currentPlayers: 5,
        players: [
          { userId: demoUser._id, name: demoUser.name, college: demoUser.collegeName || 'GLA University' },
          { userId: demoUser._id, name: 'Kavya S', college: 'VIT Vellore' },
          { userId: demoUser._id, name: 'Arjun N', college: 'NIT Trichy' },
          { userId: demoUser._id, name: 'Dev P', college: 'GLA University' },
          { userId: demoUser._id, name: 'Rahul R', college: 'IIT Delhi' },
        ],
        voiceChannel: 'Google Meet / Voice',
        discordOrLink: 'https://skribbl.io',
        notes: 'Room ID is custom link code. Enter room and guess hilarious coding terms!',
        hostId: demoUser._id,
        hostName: demoUser.name,
        hostCollege: demoUser.collegeName || 'GLA University',
        status: 'OPEN',
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
      },
      {
        gameId: 'free-fire',
        gameTitle: 'Free Fire MAX',
        title: '🔫 Clash Squad (CS) 4v4 Unlimited Gloo Wall Room',
        roomId: 'FF-772910',
        roomPassword: '999',
        gameMode: 'Clash Squad Custom (CS)',
        serverRegion: 'India',
        maxPlayers: 4,
        currentPlayers: 3,
        players: [
          { userId: demoUser._id, name: 'Varun Singh', college: 'AKGEC' },
          { userId: demoUser._id, name: 'Harshit J', college: 'GLA University' },
          { userId: demoUser._id, name: demoUser.name, college: demoUser.collegeName || 'GLA University' },
        ],
        voiceChannel: 'In-game Mic',
        notes: 'Need 1 rusher! Unlimited ammo & gloo wall custom card activated.',
        hostId: demoUser._id,
        hostName: 'Varun Singh',
        hostCollege: 'AKGEC',
        status: 'OPEN',
        expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
      },
    ];

    await GameRoom.insertMany(sampleRooms);
    console.log('Seeded sample active game rooms successfully');
  } catch (err) {
    console.warn('Sample game rooms seeding skipped:', err.message);
  }
}
