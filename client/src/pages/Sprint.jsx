import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Code2, GitBranch, Users } from 'lucide-react';

const sprintSteps = [
  {
    week: 'Week 1',
    title: 'Choose a small, shippable idea',
    copy: 'Meet your team, agree on a user problem, and turn the idea into a short build plan.'
  },
  {
    week: 'Week 2',
    title: 'Build the first working version',
    copy: 'Use one group check-in to unblock the team and keep the scope focused.'
  },
  {
    week: 'Week 3',
    title: 'Demo it and document the work',
    copy: 'Finish with a working demo and a clear GitHub README that explains what your team built.'
  }
];

export default function Sprint() {
  return (
    <div className="space-y-12 pb-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-indigo-900/40 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-6 py-12 text-white shadow-xl sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-indigo-100">
            <Code2 size={15} /> NOTESX student pilot
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Build a project you can show, in three weeks.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            A small, peer-led sprint for college students who want to find teammates, finish a manageable project, and leave with a demo and a portfolio-ready README.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/build-together" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-400">
              Preview student projects <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              Create a free account
            </Link>
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
              <Users className="mt-0.5 shrink-0 text-fuchsia-300" size={18} />
              <p className="text-sm text-slate-200">Team matching and shared project workspace</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
              <CalendarDays className="mt-0.5 shrink-0 text-indigo-300" size={18} />
              <p className="text-sm text-slate-200">One group check-in each week</p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
              <GitBranch className="mt-0.5 shrink-0 text-emerald-300" size={18} />
              <p className="text-sm text-slate-200">A working demo and GitHub README as the finish line</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="project-preview-title" className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[1.15fr_0.85fr] sm:items-center sm:p-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">Illustrative project preview · not an active team</p>
          <h2 id="project-preview-title" className="mt-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Campus event finder</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">A small example brief: help students find club and department events in one searchable page. A first version could list event name, date, venue, and organizer, with a simple README explaining setup and scope.</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Possible team roles</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Frontend', 'Backend', 'Design / testing'].map((role) => <span key={role} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{role}</span>)}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">This is a sample brief to show the kind of project scope a cohort could tackle. It does not represent a real listing or team.</p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">How the sprint works</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Three weeks, one finished project.</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Keep the scope small enough to finish alongside college. The sprint is designed around a concrete demo, not a promise of an internship or job.</p>
          </div>
          <div className="mt-6 space-y-3">
            {sprintSteps.map((step) => (
              <article key={step.week} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <span className="h-fit shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{step.week}</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/30">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-300">Pilot status</p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">Validating the first cohort</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            The proposed pilot is up to 10 students. ₹499 per student is a price hypothesis, not a confirmed fee. Dates, final deliverables, and refund terms are not published yet.
          </p>
          <p className="mt-3 rounded-xl border border-amber-300/70 bg-white/60 p-3 text-xs font-semibold leading-relaxed text-amber-950 dark:border-amber-900 dark:bg-black/10 dark:text-amber-200">
            No payment is being collected through NOTESX. Those details will be published before any cohort payment is requested.
          </p>
          <Link to="/build-together" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-200">
            See the project preview <ArrowRight size={15} />
          </Link>
        </aside>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">Already have a project idea?</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Browse teams or start a pitch on NOTESX.</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">You can preview listings without signing in. Posting, applying, and team chat require an account.</p>
          </div>
          <Link to="/build-together" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500">
            Open BuildTogether <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
