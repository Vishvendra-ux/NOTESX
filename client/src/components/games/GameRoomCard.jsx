import { useState } from 'react';
import {
  Copy,
  Check,
  Users,
  Mic,
  Clock,
  ExternalLink,
  Lock,
  Unlock,
  Radio,
  Trash2,
  Eye,
  EyeOff,
  Share2,
} from 'lucide-react';

const GAME_THEMES = {
  bgmi: {
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    border: 'hover:border-amber-500/50',
  },
  valorant: {
    badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    bar: 'bg-gradient-to-r from-rose-500 to-red-600',
    border: 'hover:border-rose-500/50',
  },
  'free-fire': {
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    border: 'hover:border-amber-500/50',
  },
  chess: {
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    border: 'hover:border-emerald-500/50',
  },
  skribbl: {
    badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    bar: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    border: 'hover:border-indigo-500/50',
  },
  codm: {
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
    bar: 'bg-gradient-to-r from-slate-600 to-zinc-700',
    border: 'hover:border-slate-500/50',
  },
  'among-us': {
    badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    bar: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    border: 'hover:border-indigo-500/50',
  },
  minecraft: {
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    border: 'hover:border-emerald-500/50',
  },
  'clash-royale': {
    badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    bar: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    border: 'hover:border-indigo-500/50',
  },
  'ludo-king': {
    badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    bar: 'bg-gradient-to-r from-amber-500 to-rose-500',
    border: 'hover:border-rose-500/50',
  },
  cs2: {
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    bar: 'bg-gradient-to-r from-orange-500 to-amber-600',
    border: 'hover:border-amber-500/50',
  },
  'gta-v': {
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    bar: 'bg-gradient-to-r from-emerald-500 to-green-700',
    border: 'hover:border-emerald-500/50',
  },
  'ea-fc': {
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    bar: 'bg-gradient-to-r from-teal-500 to-emerald-600',
    border: 'hover:border-emerald-500/50',
  },
  'rocket-league': {
    badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    bar: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    border: 'hover:border-indigo-500/50',
  },
  'brawl-stars': {
    badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    bar: 'bg-gradient-to-r from-purple-500 to-pink-600',
    border: 'hover:border-purple-500/50',
  },
  'stumble-guys': {
    badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    bar: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    border: 'hover:border-purple-500/50',
  },
  geoguessr: {
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    border: 'hover:border-emerald-500/50',
  },
  'genshin-impact': {
    badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    bar: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    border: 'hover:border-indigo-500/50',
  },
  'apex-legends': {
    badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    bar: 'bg-gradient-to-r from-rose-500 to-orange-500',
    border: 'hover:border-rose-500/50',
  },
  roblox: {
    badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    bar: 'bg-gradient-to-r from-rose-500 to-pink-500',
    border: 'hover:border-rose-500/50',
  },
  phasmophobia: {
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
    bar: 'bg-gradient-to-r from-slate-600 to-zinc-800',
    border: 'hover:border-slate-500/50',
  },
  'asphalt-9': {
    badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    bar: 'bg-gradient-to-r from-purple-500 to-rose-500',
    border: 'hover:border-purple-500/50',
  },
  'pokemon-unite': {
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    bar: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    border: 'hover:border-amber-500/50',
  },
  'league-of-legends': {
    badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    bar: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    border: 'hover:border-indigo-500/50',
  },
};

const DEFAULT_THEME = {
  badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  bar: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  border: 'hover:border-indigo-500/50',
};

export default function GameRoomCard({
  room,
  currentUser,
  onJoin,
  onLeave,
  onDelete,
  onUpdateStatus,
}) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedBoth, setCopiedBoth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const theme = GAME_THEMES[room.gameId] || DEFAULT_THEME;
  const currentCount = room.players?.length || room.currentPlayers || 1;
  const maxSlots = room.maxPlayers || 4;
  const fillPercent = Math.min(100, Math.round((currentCount / maxSlots) * 100));
  const isFull = currentCount >= maxSlots;

  const isHost =
    currentUser &&
    (room.hostId === currentUser._id || room.hostId?._id === currentUser._id);
  const hasJoined =
    currentUser &&
    room.players?.some((p) => p.userId === currentUser._id || p.userId?._id === currentUser._id);

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else if (type === 'pass') {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    } else if (type === 'both') {
      setCopiedBoth(true);
      setTimeout(() => setCopiedBoth(false), 2000);
    }
  };

  const copyBothCredentials = () => {
    const text = `🎮 Game: ${room.gameTitle}\n🆔 Room ID: ${room.roomId}\n🔑 Password: ${
      room.roomPassword || 'None (Open Room)'
    }\n📍 Mode: ${room.gameMode}\n🎙️ Voice: ${room.voiceChannel}\n👥 Hosted by ${room.hostName} on NOTESX`;
    copyToClipboard(text, 'both');
  };

  const handleJoin = async () => {
    setActionLoading(true);
    await onJoin(room._id);
    setActionLoading(false);
  };

  const handleLeave = async () => {
    setActionLoading(true);
    await onLeave(room._id);
    setActionLoading(false);
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 60000);
    if (diff < 1) return 'Just now';
    if (diff === 1) return '1m ago';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    return `${hours}h ago`;
  };

  return (
    <article
      className={`group relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-200 ${theme.border} hover:shadow-lg`}
    >
      {/* Header Bar */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${theme.badge}`}
          >
            <Radio size={12} className="animate-pulse" />
            {room.gameTitle}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {room.gameMode}
          </span>
        </div>

        {/* Status Badge */}
        <div>
          {room.status === 'OPEN' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Open
            </span>
          )}
          {room.status === 'FULL' && (
            <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
              Full Squad
            </span>
          )}
          {room.status === 'IN_PROGRESS' && (
            <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 text-xs font-bold text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-800">
              In Match
            </span>
          )}
        </div>
      </div>

      {/* Room Title */}
      <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white line-clamp-2">
        {room.title}
      </h3>

      {/* Credentials Box (Room ID & Password) */}
      <div className="mt-4 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Room Credentials</span>
          {/* Issue 8 Fix: 'Copy Both' styled as a clear secondary button */}
          <button
            onClick={copyBothCredentials}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 transition shadow-2xs"
            title="Copy ID, Password, and Details to clipboard"
          >
            {copiedBoth ? (
              <>
                <Check size={13} className="text-emerald-600" /> Copied Both!
              </>
            ) : (
              <>
                <Share2 size={13} /> Copy Both
              </>
            )}
          </button>
        </div>

        {/* Room ID row */}
        <div className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-900 px-3 py-2 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">ID:</span>
            <code className="font-mono text-sm font-extrabold text-slate-900 dark:text-white tracking-wide truncate select-all">
              {room.roomId}
            </code>
          </div>
          <button
            onClick={() => copyToClipboard(room.roomId, 'id')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            aria-label="Copy Room ID"
          >
            {copiedId ? (
              <>
                <Check size={13} className="text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy size={13} /> Copy
              </>
            )}
          </button>
        </div>

        {/* Password row */}
        <div className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-900 px-3 py-2 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">PASS:</span>
            {room.roomPassword ? (
              <span className="flex items-center gap-2">
                <code className="font-mono text-sm font-extrabold text-slate-900 dark:text-white tracking-wide select-all">
                  {showPassword ? room.roomPassword : '••••••'}
                </code>
                {/* Issue 7 Fix: Increased hit area to min 32x32px and larger icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="inline-flex items-center justify-center min-w-[32px] min-h-[32px] p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Unlock size={12} /> Open / No Password
              </span>
            )}
          </div>
          {room.roomPassword ? (
            <button
              onClick={() => copyToClipboard(room.roomPassword, 'pass')}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              aria-label="Copy Password"
            >
              {copiedPass ? (
                <>
                  <Check size={13} className="text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy size={13} /> Copy
                </>
              )}
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Free Entry</span>
          )}
        </div>
      </div>

      {/* Slots Progress Bar & Squad Members */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <Users size={14} />
            Squad Capacity
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {currentCount} / {maxSlots} Players
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${theme.bar}`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        {/* Squad Player Avatars / List */}
        {room.players && room.players.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {room.players.map((p, idx) => (
              <span
                key={p.userId?._id || p.userId || idx}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                title={`${p.name} ${p.college ? `(${p.college})` : ''}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {p.name.split(' ')[0]}
              </span>
            ))}
            {!isFull && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                +{maxSlots - currentCount} slot{maxSlots - currentCount > 1 ? 's' : ''} open
              </span>
            )}
          </div>
        )}
      </div>

      {/* Voice & Notes Metadata */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
          <Mic size={12} className="text-indigo-500" />
          {room.voiceChannel}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium">
          🌐 {room.serverRegion || 'India'}
        </span>
        {/* Issue 11 Fix: Actionable link styling distinct from passive metadata */}
        {room.discordOrLink && (
          <a
            href={room.discordOrLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold shadow-2xs hover:shadow transition"
          >
            <ExternalLink size={12} /> Join Link
          </a>
        )}
      </div>

      {room.notes && (
        <p className="mt-2 text-xs italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 line-clamp-2">
          "{room.notes}"
        </p>
      )}

      {/* Footer: Host & Action */}
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white text-xs">
            {room.hostName?.charAt(0)?.toUpperCase() || 'H'}
          </div>
          <div className="truncate">
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {room.hostName} {isHost && <span className="text-indigo-500">(You)</span>}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {room.hostCollege} • {timeAgo(room.createdAt)}
            </p>
          </div>
        </div>

        {/* Join / Leave / Host Actions */}
        <div className="flex items-center gap-2">
          {isHost ? (
            <div className="flex items-center gap-1.5">
              {room.status === 'OPEN' && (
                <button
                  onClick={() => onUpdateStatus(room._id, 'IN_PROGRESS')}
                  className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition"
                  title="Mark as Match Started"
                >
                  Start Match
                </button>
              )}
              <button
                onClick={() => onDelete(room._id)}
                className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                title="Delete / Close Room"
                aria-label="Delete room"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : hasJoined ? (
            <button
              onClick={handleLeave}
              disabled={actionLoading}
              className="inline-flex items-center justify-center min-h-[36px] rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 px-3.5 py-2 text-xs font-bold hover:bg-rose-100 transition"
            >
              {actionLoading ? 'Leaving...' : 'In Squad (Leave)'}
            </button>
          ) : isFull ? (
            <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              Squad Full
            </span>
          ) : (
            /* Issue 10 Fix: Upgraded Join Squad button to min-h-[36px] px-4 py-2 with primary weight */
            <button
              onClick={handleJoin}
              disabled={actionLoading}
              className="inline-flex items-center justify-center min-h-[36px] rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-extrabold shadow-sm hover:shadow-md transition active:scale-95"
            >
              {actionLoading ? 'Joining...' : 'Join Squad'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
