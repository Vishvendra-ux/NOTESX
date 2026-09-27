import { Filter, Trophy, Sparkles, CheckCircle2, BookOpen, Layers } from 'lucide-react';

export default function DoubtSidebar({
  stats,
  selectedSubject,
  onSelectSubject,
  selectedCategory,
  onSelectCategory,
  totalQuestionsCount
}) {
  const subjects = stats?.subjects || [
    { name: 'Operating Systems', count: 2 },
    { name: 'Algorithms', count: 1 },
    { name: 'Theory of Computation', count: 1 },
    { name: 'Database Management Systems', count: 1 },
    { name: 'Computer Networks', count: 1 },
    { name: 'Computer Organization', count: 1 },
    { name: 'Digital Logic', count: 1 },
  ];

  const categories = [
    { id: 'All', label: 'All Exams' },
    { id: 'GATE CSE', label: 'GATE CSE' },
    { id: 'GATE DA', label: 'GATE DA' },
    { id: 'College / Semester', label: 'College Exam' },
    { id: 'Practice / General', label: 'Practice' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Subject Filter Card */}
      <div className="glass-card p-5 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Filter size={15} className="text-indigo-600 dark:text-indigo-400" />
            Filter by Subject
          </h3>
          {selectedSubject && (
            <button
              type="button"
              onClick={() => onSelectSubject(null)}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectSubject(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              !selectedSubject
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Subjects</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              !selectedSubject ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold'
            }`}>
              {stats?.totalDoubts || totalQuestionsCount || 8}
            </span>
          </button>

          {subjects.map((sub) => {
            const isSelected = selectedSubject?.toLowerCase() === sub.name?.toLowerCase();
            return (
              <button
                key={sub.name}
                type="button"
                onClick={() => onSelectSubject(isSelected ? null : sub.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="truncate pr-2">{sub.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                  isSelected ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold'
                }`}>
                  {sub.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exam Category Filter */}
      <div className="glass-card p-5 border border-slate-200/80 dark:border-slate-800">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
          <Layers size={15} className="text-blue-600 dark:text-blue-400" />
          Exam Source
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected = (selectedCategory || 'All') === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id === 'All' ? null : cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Stats Card */}
      <div className="glass-card p-5 border-t-4 border-t-indigo-600 bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/40 dark:from-slate-900 dark:to-slate-850">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-3">
          <Sparkles size={15} className="text-indigo-600" />
          Community Pulse
        </h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100/80 dark:border-slate-700">
            <span className="block text-xl font-black text-slate-900 dark:text-white">
              {stats?.totalDoubts || 8}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Questions</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-100 dark:border-slate-700">
            <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">
              {stats?.solvedRate || 75}%
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Solved Rate</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
          <span>Peer Answers</span>
          <b className="text-indigo-600 dark:text-indigo-400 font-bold">{stats?.totalAnswers || 7} Answers</b>
        </div>
      </div>

      {/* Top Contributors Leaderboard */}
      <div className="glass-card p-5 border border-slate-200/80 dark:border-slate-800">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
          <Trophy size={16} className="text-amber-500" />
          Top Contributors
        </h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
          Earn reputation by writing accepted answers.
        </p>

        <div className="space-y-2.5">
          {stats?.topContributors?.map((user, idx) => (
            <div key={user._id || idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                  idx === 0
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : idx === 1
                    ? 'bg-slate-200 text-slate-800 border border-slate-300'
                    : idx === 2
                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  #{idx + 1}
                </span>

                <div className="min-w-0">
                  <b className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user.name}
                  </b>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {user.collegeName || 'Learner'}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60 shrink-0">
                {user.reputation} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
