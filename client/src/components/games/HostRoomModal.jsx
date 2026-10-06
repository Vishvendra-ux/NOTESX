import { useState, useEffect } from 'react';
import { X, Gamepad2, Lock, Radio, Users, Mic, Share2, Sparkles, AlertCircle } from 'lucide-react';

export default function HostRoomModal({
  isOpen,
  onClose,
  onSubmit,
  games,
  preselectedGameId,
}) {
  const [formData, setFormData] = useState({
    gameId: 'bgmi',
    gameTitle: 'BGMI (Battlegrounds Mobile India)',
    title: '',
    roomId: '',
    roomPassword: '',
    gameMode: 'TDM 4v4 WareHouse',
    serverRegion: 'India / Mumbai',
    maxPlayers: 4,
    voiceChannel: 'In-game Mic',
    discordOrLink: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync preselected game if provided
  useEffect(() => {
    if (preselectedGameId && games && games.length > 0) {
      const selected = games.find((g) => g.id === preselectedGameId);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          gameId: selected.id,
          gameTitle: selected.name,
          maxPlayers: selected.maxSquad || 4,
          gameMode: selected.defaultModes?.[0] || 'Custom Match',
        }));
      }
    }
  }, [preselectedGameId, games]);

  if (!isOpen) return null;

  const currentGame = games?.find((g) => g.id === formData.gameId);

  const handleGameChange = (e) => {
    const selectedId = e.target.value;
    const selected = games?.find((g) => g.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      gameId: selectedId,
      gameTitle: selected ? selected.name : 'Custom Game',
      maxPlayers: selected?.maxSquad || 4,
      gameMode: selected?.defaultModes?.[0] || 'Custom Match',
    }));
  };

  const handleQuickMode = (mode) => {
    setFormData((prev) => ({ ...prev, gameMode: mode }));
  };

  const handleQuickSlot = (slots) => {
    setFormData((prev) => ({ ...prev, maxPlayers: slots }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a room title or match description.');
      return;
    }

    if (!formData.roomId.trim()) {
      setError('Room ID or Code is required so other students can join!');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to host game room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
            <Radio size={24} className="animate-pulse" />
          </div>
          <div>
            <h2 id="modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Host a Game Room
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Share your Room ID & Password so college mates can join your squad!
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 p-3 text-xs sm:text-sm font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Game */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Select Famous Game *
            </label>
            <select
              value={formData.gameId}
              onChange={handleGameChange}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {games?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.category})
                </option>
              ))}
            </select>
          </div>

          {/* Room Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Room Title / Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TDM 4v4 WareHouse - Need 2 rushers for rank push!"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Credentials: Room ID & Password (side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-950/60 p-4 border border-indigo-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-300 mb-1.5 flex items-center gap-1">
                <span>Room ID / Code *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 849201 or VALO-MUM"
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full rounded-xl border border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                In-game room number or party code
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-300 mb-1.5 flex items-center gap-1">
                <Lock size={12} />
                <span>Password (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1234 (Leave blank if open)"
                value={formData.roomPassword}
                onChange={(e) => setFormData({ ...formData, roomPassword: e.target.value })}
                className="w-full rounded-xl border border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Leave empty for open free entry
              </p>
            </div>
          </div>

          {/* Game Mode with Quick Preset Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Game Mode / Map
            </label>
            <input
              type="text"
              placeholder="e.g. TDM 4v4, Custom Ascent, Blitz 5 min"
              value={formData.gameMode}
              onChange={(e) => setFormData({ ...formData, gameMode: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500"
            />
            {currentGame?.defaultModes && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {currentGame.defaultModes.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleQuickMode(mode)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      formData.gameMode === mode
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Squad Slots & Voice Comms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Users size={12} /> Max Squad Players
              </label>
              <div className="flex gap-1.5">
                {[2, 4, 5, 8, 10, 12].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleQuickSlot(slot)}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition border ${
                      formData.maxPlayers === slot
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Mic size={12} /> Voice Chat Channel
              </label>
              <select
                value={formData.voiceChannel}
                onChange={(e) => setFormData({ ...formData, voiceChannel: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              >
                <option value="In-game Mic">In-game Voice Mic</option>
                <option value="Discord Voice">Discord Voice Server</option>
                <option value="Google Meet / Voice">Google Meet / Voice</option>
                <option value="No Mic Required">No Mic Required (Text Only)</option>
              </select>
            </div>
          </div>

          {/* Notes / Special Rules */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Requirements / Host Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Beginners welcome! Be ready on time, match starts in 10 mins."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? (
                'Publishing Room...'
              ) : (
                <>
                  <Share2 size={16} /> Publish Game Room
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
