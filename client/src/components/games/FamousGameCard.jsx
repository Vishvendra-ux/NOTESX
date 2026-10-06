import { Gamepad2, Users, Monitor, Smartphone, Globe, Plus, Filter } from 'lucide-react';

export default function FamousGameCard({ game, onSelectFilter, onHostForGame }) {
  const renderPlatformIcon = (platform) => {
    if (platform === 'PC') return <Monitor size={12} title="PC" />;
    if (platform === 'Android' || platform === 'iOS' || platform === 'Mobile')
      return <Smartphone size={12} title="Mobile" />;
    return <Globe size={12} title="Web Browser" />;
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md">
      {/* Top Banner & Active Indicator */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${game.color} text-white shadow-sm`}
        >
          <Gamepad2 size={24} />
        </div>

        <div className="flex flex-col items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                game.activeRoomCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            {game.activeRoomCount} {game.activeRoomCount === 1 ? 'Room' : 'Rooms'} Active
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {game.category}
          </span>
        </div>
      </div>

      {/* Title & Platforms */}
      <div className="mt-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          {game.name}
        </h3>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
          {game.description}
        </p>
      </div>

      {/* Platforms & Max Squad Size */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {game.platforms?.map((plat) => (
          <span
            key={plat}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400"
          >
            {renderPlatformIcon(plat)}
            {plat}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Users size={12} /> Up to {game.maxSquad} Squad
        </span>
      </div>

      {/* Popular Modes */}
      {game.defaultModes && game.defaultModes.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Popular Modes:
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {game.defaultModes.slice(0, 3).map((mode) => (
              <span
                key={mode}
                className="text-xs px-2 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
              >
                {mode}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Card Actions */}
      <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => onSelectFilter(game.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <Filter size={13} /> View Lobbies
        </button>

        <button
          onClick={() => onHostForGame(game.id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 font-bold transition shadow-2xs"
        >
          <Plus size={13} /> Host Room
        </button>
      </div>
    </div>
  );
}
