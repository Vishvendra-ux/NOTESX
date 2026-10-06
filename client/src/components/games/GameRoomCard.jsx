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
  Play,
  Eye,
  EyeOff,
  Share2,
} from 'lucide-react';

const GAME_THEMES = {
  bgmi: {
    badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    border: 'hover:border-amber-500/50',
    accent: 'text-amber-600 dark:text-amber-400',
  },
  valorant: {
    badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    bar: 'bg-gradient-to-r from-rose-500 to-red-600',
    border: 'hover:border-rose-500/50',
    accent: 'text-rose-600 dark:text-rose-400',
  },
  'free-fire': {
    badge: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
    bar: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    border: 'hover:border-yellow-500/50',
    accent: 'text-yellow-600 dark:text-yellow-400',
  },
  chess: {
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    border: 'hover:border-emerald-500/50',
    accent: 'text-emerald-600 dark:text-emerald-400',
  },
  skribbl: {
    badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    bar: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    border: 'hover:border-blue-500/50',
    accent: 'text-blue-600 dark:text-blue-400',
  },
  codm: {
    badge: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
    bar: 'bg-gradient-to-r from-slate-600 to-zinc-700',
    border: 'hover:border-slate-500/50',
    accent: 'text-slate-600 dark:text-slate-400',
  },
  'among-us': {
    badge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    bar: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    border: 'hover:border-cyan-500/50',
    accent: 'text-cyan-600 dark:text-cyan-400',
  },
  minecraft: {
    badge: 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30',
    bar: 'bg-gradient-to-r from-green-500 to-emerald-600',
    border: 'hover:border-green-500/50',
    accent: 'text-green-600 dark:text-green-400',
  },
  'clash-royale': {
    badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    bar: 'bg-gradient-to-r from-sky-500 to-blue-600',
    border: 'hover:border-sky-500/50',
    accent: 'text-sky-600 dark:text-sky-400',
  },
};

const DEFAULT_THEME = {
  badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  bar: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  border: 'hover:border-indigo-500/50',
  accent: 'text-indigo-600 dark:text-indigo-400',
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
      className={`group relative flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all duration-200 ${theme.border} hover:shadow-lg`}
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
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {room.gameMode}
          </span>
        </div>

        {/* Status Badge */}
        <div>
          {room.status === 'OPEN' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Open
            </span>
          )}
          {room.status === 'FULL' && (
            <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Full Squad
            </span>
          )}
          {room.status === 'IN_PROGRESS' && (
            <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
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
      <div className="mt-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Room Credentials</span>
          <button
            onClick={copyBothCredentials}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
            title="Copy ID, Password, and Details to clipboard"
          >
            {copiedBoth ? (
              <>
                <Check size={12} className="text-emerald-600" /> Copied Both!
              </>
            ) : (
              <>
                <Share2 size={12} /> Copy Both
              </>
            )}
          </button>
        </div>

        {/* Room ID row */}
        <div className="flex items-center justify-between rounded-lg bg-white dark:bg-slate-900 px-3 py-2 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">ID:</span>
            <code className="font-mono text-sm font-extrabold text-slate-900 dark:text-white tracking-wide truncate select-all">
              {room.roomId}
            </code>
          </div>
          <button
            onClick={() => copyToClipboard(room.roomId, 'id')}
            className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
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
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">PASS:</span>
            {room.roomPassword ? (
              <span className="flex items-center gap-2">
                <code className="font-mono text-sm font-extrabold text-slate-900 dark:text-white tracking-wide select-all">
                  {showPassword ? room.roomPassword : '••••••'}
                </code>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
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
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
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
            <span className="text-[11px] text-slate-400 font-medium">Free Entry</span>
          )}
        </div>
      </div>

      {/* Slots Progress Bar & Squad Members */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Users size={14} className={theme.accent} />
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
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                title={`${p.name} ${p.college ? `(${p.college})` : ''}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {p.name.split(' ')[0]}
              </span>
            ))}
            {!isFull && (
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">
                +{maxSlots - currentCount} slot{maxSlots - currentCount > 1 ? 's' : ''} open
              </span>
            )}
          </div>
        )}
      </div>

      {/* Voice & Notes Metadata */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
          <Mic size={12} className="text-indigo-500" />
          {room.voiceChannel}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
          🌐 {room.serverRegion || 'India'}
        </span>
        {room.discordOrLink && (
          <a
            href={room.discordOrLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-medium hover:underline"
          >
            <ExternalLink size={11} /> Link
          </a>
        )}
      </div>

      {room.notes && (
        <p className="mt-2 text-xs italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 line-clamp-2">
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
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {room.hostName} {isHost && <span className="text-indigo-500">(You)</span>}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
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
                  className="rounded-lg bg-purple-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition"
                  title="Mark as Match Started"
                >
                  Start Match
                </button>
              )}
              <button
                onClick={() => onDelete(room._id)}
                className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
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
              className="rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 px-3 py-1.5 text-xs font-bold hover:bg-rose-200 transition"
            >
              {actionLoading ? 'Leaving...' : 'In Squad (Leave)'}
            </button>
          ) : isFull ? (
            <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
              Squad Full
            </span>
          ) : (
            <button
              onClick={handleJoin}
              disabled={actionLoading}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs hover:shadow transition"
            >
              {actionLoading ? 'Joining...' : 'Join Squad'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
