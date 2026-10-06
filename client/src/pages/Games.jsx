import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Gamepad2,
  ArrowLeft,
  Hand,
  Grid3x3,
  Brain,
  Hash,
  Type,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Users,
  Flame,
  Radio,
  Sparkles,
  Trophy,
  Share2,
  Copy,
  Check,
  Zap,
  ShieldAlert,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { gameService } from '../services/api';
import GameRoomCard from '../components/games/GameRoomCard';
import FamousGameCard from '../components/games/FamousGameCard';
import HostRoomModal from '../components/games/HostRoomModal';
import RockPaperScissors from '../components/games/RockPaperScissors';
import TicTacToe from '../components/games/TicTacToe';

// Built-in Mini Games
const MINI_GAMES = [
  {
    id: 'rock-paper-scissors',
    title: 'Rock Paper Scissors',
    description: 'Beat the computer and build the longest winning streak.',
    icon: Hand,
    accent: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    players: '1 player',
    component: RockPaperScissors,
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description: 'Play a friend, or take on the computer on easy or hard.',
    icon: Grid3x3,
    accent: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
    players: '1–2 players',
    component: TicTacToe,
  },
];

const COMING_SOON_MINI = [
  { title: 'Memory Match', description: 'Flip cards and match the pairs.', icon: Brain },
  { title: '2048', description: 'Slide and merge tiles to reach 2048.', icon: Hash },
  { title: 'Word Guess', description: 'Guess the CS term before you run out of tries.', icon: Type },
];

export default function Games() {
  const { gameId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms', 'famous', 'minigames'
  const [rooms, setRooms] = useState([]);
  const [famousGames, setFamousGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Filters & Search
  const [selectedGameFilter, setSelectedGameFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [famousCategoryFilter, setFamousCategoryFilter] = useState('all');

  // Modal State
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [preselectedGameId, setPreselectedGameId] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const socketRef = useRef(null);

  // Fetch data
  const fetchSeq = useRef(0);
  const fetchData = async (isManualRefresh = false) => {
    const seq = ++fetchSeq.current;
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const [famousRes, roomsRes] = await Promise.all([
        gameService.getFamousGames(),
        gameService.getRooms({
          gameId: selectedGameFilter !== 'all' ? selectedGameFilter : undefined,
          status: selectedStatusFilter !== 'all' ? selectedStatusFilter : undefined,
          search: searchQuery.trim() || undefined,
        }),
      ]);

      if (seq !== fetchSeq.current) return; // a newer request superseded this one

      if (famousRes.data.success) {
        setFamousGames(famousRes.data.games || []);
      }

      if (roomsRes.data.success) {
        setRooms(roomsRes.data.rooms || []);
      }
      setError('');
    } catch (err) {
      if (seq !== fetchSeq.current) return;
      console.error('Failed to load games data:', err);
      setError('Failed to load game rooms. Please check your connection.');
    } finally {
      if (seq === fetchSeq.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedGameFilter, selectedStatusFilter]);

  // Socket.IO real-time setup
  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_API_URL?.replace('/api', '') ||
      (window.location.hostname === 'localhost' ? 'http://localhost:5001' : '/');
    const token = localStorage.getItem('token');

    try {
      socketRef.current = io(socketUrl, {
        auth: { token: token || '' },
        transports: ['websocket', 'polling'],
      });

      socketRef.current.emit('join_game_lobby');

      // Listen for newly created rooms
      socketRef.current.on('game_room_created', (newRoom) => {
        setRooms((prev) => {
          if (prev.some((r) => r._id === newRoom._id)) return prev;
          return [newRoom, ...prev];
        });
        showToast(`🎮 New room hosted: ${newRoom.gameTitle}!`);
      });

      // Listen for room updates (squad joins, leaves, status changes)
      socketRef.current.on('game_room_updated', (updatedRoom) => {
        setRooms((prev) =>
          prev.map((r) => (r._id === updatedRoom._id ? { ...r, ...updatedRoom } : r))
        );
      });

      // Listen for room deletions
      socketRef.current.on('game_room_deleted', ({ roomId }) => {
        setRooms((prev) => prev.filter((r) => r._id !== roomId));
      });
    } catch (e) {
      console.warn('Socket connection warning in Games:', e);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_game_lobby');
        socketRef.current.disconnect();
      }
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Single game route view (/games/rock-paper-scissors or /games/tic-tac-toe)
  if (gameId) {
    const miniGame = MINI_GAMES.find((g) => g.id === gameId);
    if (!miniGame) return <Navigate to="/games" replace />;
    const GameComponent = miniGame.component;
    const Icon = miniGame.icon;

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 transition"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to Game Zone
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${miniGame.accent}`}>
            <Icon size={22} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {miniGame.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{miniGame.description}</p>
          </div>
        </div>
        <GameComponent />
      </div>
    );
  }

  // Handlers
  const handleOpenHostModal = (gameIdToPreselect) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setPreselectedGameId(gameIdToPreselect || '');
    setIsHostModalOpen(true);
  };

  const handleCreateRoom = async (roomData) => {
    try {
      const res = await gameService.createRoom(roomData);
      if (res.data.success) {
        showToast('🎉 Room hosted successfully! Others can now view your Room ID & Password.');
        fetchData();
        return true;
      }
      return false;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to host the room. Please try again.');
      return false;
    }
  };

  const handleJoinSquad = async (roomId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await gameService.joinRoom(roomId);
      if (res.data.success) {
        showToast('✅ Joined squad! Room credentials copied / ready.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join room');
    }
  };

  const handleLeaveSquad = async (roomId) => {
    try {
      const res = await gameService.leaveRoom(roomId);
      if (res.data.success) {
        showToast('Left squad.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to leave room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to close and delete this game room?')) return;
    try {
      const res = await gameService.deleteRoom(roomId);
      if (res.data.success) {
        showToast('Room closed.');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleUpdateStatus = async (roomId, newStatus) => {
    try {
      await gameService.updateRoomStatus(roomId, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Summary Metrics
  const totalRooms = rooms.length;
  const openRooms = rooms.filter((r) => r.status === 'OPEN').length;
  const totalPlayersActive = rooms.reduce(
    (acc, r) => acc + (r.players?.length || r.currentPlayers || 1),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 shadow-2xl border border-slate-700/50 text-sm font-bold animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          {toastMessage}
        </div>
      )}

      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-6 sm:p-10 shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-400/30 mb-3">
              <Radio size={14} className="animate-pulse text-emerald-400" />
              <span>College Esports &amp; Gaming Lounge</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Game Zone &amp; Custom Lobbies
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Find college teammates, post your custom <strong className="text-white">Room ID &amp; Password</strong> for BGMI, Valorant, Ludo King, GTA V, EA FC, Rocket League, GeoGuessr, or Chess!
            </p>

            {/* Quick Stats Banner */}
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Radio size={16} />
                </span>
                <div>
                  <div className="text-white font-extrabold">{openRooms} Open</div>
                  <div className="text-slate-400 text-xs">Active Lobbies</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Users size={16} />
                </span>
                <div>
                  <div className="text-white font-extrabold">{totalPlayersActive}+ Students</div>
                  <div className="text-slate-400 text-xs">In Squads</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Flame size={16} />
                </span>
                <div>
                  <div className="text-white font-extrabold">{famousGames.length} Famous</div>
                  <div className="text-slate-400 text-xs">Supported Titles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenHostModal()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition transform active:scale-95"
            >
              <Plus size={20} className="stroke-[3]" />
              Host Room / Share ID &amp; Pass
            </button>
            <p className="text-center text-xs text-slate-400">
              Instant 1-click copy for players
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto" aria-label="Game Zone sections">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'rooms'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio size={16} className={activeTab === 'rooms' ? 'animate-pulse' : ''} />
          Live Room Lobbies ({totalRooms})
        </button>

        <button
          onClick={() => setActiveTab('famous')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'famous'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame size={16} />
          Famous Games Catalog ({famousGames.length})
        </button>

        <button
          onClick={() => setActiveTab('minigames')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'minigames'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap size={16} />
          Instant Web Mini-Games
        </button>
      </nav>

      {/* ================= TAB 1: LIVE GAME ROOMS ================= */}
      {activeTab === 'rooms' && (
        <section aria-labelledby="live-rooms-heading" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h2 id="live-rooms-heading" className="sr-only">Live Game Rooms</h2>
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by game, room ID, host name, or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
              />
            </form>

            {/* Filters & Refresh */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Game Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Game:</span>
                <select
                  value={selectedGameFilter}
                  onChange={(e) => setSelectedGameFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="all">All Games</option>
                  {famousGames.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="OPEN">Open Only</option>
                  <option value="FULL">Full Squads</option>
                  <option value="IN_PROGRESS">In Match</option>
                </select>
              </div>

              {/* Manual Refresh */}
              <button
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                title="Refresh rooms"
                aria-label="Refresh game rooms"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin text-indigo-600' : ''} />
              </button>
            </div>
          </div>

          {/* Quick How to Play Banner */}
          <div className="rounded-xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 p-4 sm:p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
              How to join a custom room:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="flex items-start gap-3 rounded-lg bg-white dark:bg-slate-800/80 p-3.5 border border-indigo-100/60 dark:border-slate-700/60">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs">
                  1
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Click <strong className="text-slate-900 dark:text-white">"Copy ID"</strong> and <strong className="text-slate-900 dark:text-white">"Copy Pass"</strong> on any room card below.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-white dark:bg-slate-800/80 p-3.5 border border-indigo-100/60 dark:border-slate-700/60">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs">
                  2
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Open your game (BGMI, Valorant, or Chess) &amp; select <strong className="text-slate-900 dark:text-white">Custom Room</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-white dark:bg-slate-800/80 p-3.5 border border-indigo-100/60 dark:border-slate-700/60">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs">
                  3
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Paste credentials to enter the lobby, join the squad, and enjoy playing together!
                </p>
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 animate-pulse space-y-4"
                >
                  <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Gamepad2 size={48} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                No Active Game Rooms Found
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                No rooms match your filter. Be the first to host a room and share your Room ID and Password with fellow students!
              </p>
              <button
                onClick={() => handleOpenHostModal()}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-bold transition shadow-sm"
              >
                <Plus size={16} /> Host a Game Room Now
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <GameRoomCard
                  key={room._id}
                  room={room}
                  currentUser={user}
                  onJoin={handleJoinSquad}
                  onLeave={handleLeaveSquad}
                  onDelete={handleDeleteRoom}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= TAB 2: FAMOUS GAMES CATALOG ================= */}
      {activeTab === 'famous' && (
        <section aria-labelledby="famous-games-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 id="famous-games-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Famous Games Played by College Students
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Explore {famousGames.length} popular titles across competitive, sports, party, and casual genres.
              </p>
            </div>
          </div>

          {/* Genre Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            {[
              { id: 'all', label: `All Games (${famousGames.length})` },
              { id: 'Shooter', label: '🎯 Shooters & Battle Royale' },
              { id: 'Board', label: '🎲 Board & Strategy' },
              { id: 'Sports', label: '⚽ Sports & Racing' },
              { id: 'OpenWorld', label: '🌍 Open World & Co-op' },
              { id: 'Party', label: '🎉 Party & Casual' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFamousCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  famousCategoryFilter === cat.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {famousGames
              .filter((g) => {
                if (famousCategoryFilter === 'all') return true;
                if (famousCategoryFilter === 'Shooter') {
                  return (
                    g.category.includes('Battle Royale') ||
                    g.category.includes('FPS') ||
                    g.category.includes('Shooter')
                  );
                }
                if (famousCategoryFilter === 'Board') {
                  return (
                    g.category.includes('Board') ||
                    g.category.includes('Strategy') ||
                    g.category.includes('Mind') ||
                    g.category.includes('Trivia')
                  );
                }
                if (famousCategoryFilter === 'Sports') {
                  return (
                    g.category.includes('Sports') ||
                    g.category.includes('Football') ||
                    g.category.includes('Vehicular') ||
                    g.category.includes('Racing')
                  );
                }
                if (famousCategoryFilter === 'OpenWorld') {
                  return (
                    g.category.includes('Open World') ||
                    g.category.includes('RPG') ||
                    g.category.includes('Survival') ||
                    g.category.includes('Horror')
                  );
                }
                if (famousCategoryFilter === 'Party') {
                  return (
                    g.category.includes('Party') ||
                    g.category.includes('Casual') ||
                    g.category.includes('Social') ||
                    g.category.includes('MOBA') ||
                    g.category.includes('Sandbox')
                  );
                }
                return true;
              })
              .map((game) => (
                <FamousGameCard
                  key={game.id}
                  game={game}
                  onSelectFilter={(id) => {
                    setSelectedGameFilter(id);
                    setActiveTab('rooms');
                  }}
                  onHostForGame={(id) => handleOpenHostModal(id)}
                />
              ))}
          </div>
        </section>
      )}

      {/* ================= TAB 3: INSTANT MINI-GAMES ================= */}
      {activeTab === 'minigames' && (
        <section aria-labelledby="minigames-heading" className="space-y-8">
          <div>
            <h2 id="minigames-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Instant Web Mini-Games
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Play right in your browser without downloads. Great for a 2-minute refresh between revision blocks.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {MINI_GAMES.map((game) => {
              const Icon = game.icon;
              return (
                <Link
                  key={game.id}
                  to={`/games/${game.id}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition hover:border-indigo-400 hover:shadow-lg"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${game.accent}`}>
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                    {game.title}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-slate-600 dark:text-slate-300">{game.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="text-xs font-semibold text-slate-500">{game.players}</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                      Play Now →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Coming Soon */}
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-3">
              Upcoming Web Minigames
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {COMING_SOON_MINI.map((game) => {
                const Icon = game.icon;
                return (
                  <div
                    key={game.title}
                    className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 p-5"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <Icon size={20} />
                    </span>
                    <h4 className="mt-3 font-bold text-slate-800 dark:text-slate-100">{game.title}</h4>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{game.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Host Room Modal */}
      <HostRoomModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        onSubmit={handleCreateRoom}
        games={famousGames}
        preselectedGameId={preselectedGameId}
      />
    </div>
  );
}
