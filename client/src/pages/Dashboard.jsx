import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, BookOpen, BriefcaseBusiness, Code2, GraduationCap, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const shortcuts = [
  {
    title: 'Build with a team',
    description: 'Browse project pitches, find collaborators, and work together in a shared workspace.',
    to: '/build-together',
    icon: Code2,
    tone: 'from-indigo-600 to-violet-600'
  },
  {
    title: 'Follow a roadmap',
    description: 'Pick a learning path and move through practical milestones at your own pace.',
    to: '/roadmaps',
    icon: BriefcaseBusiness,
    tone: 'from-emerald-600 to-teal-600'
  },
  {
    title: 'Find study material',
    description: 'Explore the notes and practice tools available for your course.',
    to: '/notes',
    icon: BookOpen,
    tone: 'from-sky-600 to-blue-600'
  }
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const firstName = user?.name?.trim().split(/\s+/)[0] || 'there';

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 pb-12">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-900/40 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/10 text-3xl font-black ring-1 ring-white/15">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt={`${user.name}'s profile`} className="h-full w-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || <UserRound size={32} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-200">
              <GraduationCap size={15} /> Your NOTESX workspace
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Welcome, {firstName}.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              Pick a next step for your semester or start building something with other students.
            </p>
            {(user?.course || user?.year || user?.collegeName) && (
              <p className="mt-3 text-xs font-semibold text-indigo-200">
                {[user?.course, user?.year, user?.collegeName].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          <Link to="/profile" className="relative inline-flex shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold transition hover:bg-white/10">
            Edit profile
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">Choose your next step</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Make progress on something real.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <Link key={shortcut.title} to={shortcut.to} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700">
                <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${shortcut.tone} text-white shadow-sm`}>
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-extrabold text-slate-950 dark:text-white">{shortcut.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{shortcut.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                  Open <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6 dark:border-indigo-900/60 dark:bg-indigo-950/30 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">Three-week student pilot</p>
          <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Build a demo with a small team.</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">See the proposed Build-to-Portfolio Sprint and its current pilot status.</p>
        </div>
        <Link to="/sprint" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
          View sprint details <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
