import { useState } from 'react';
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, ChevronRight, CircleHelp, FileText, Flame, GraduationCap, MapPin, Sparkles, Trophy, Users, Zap, Compass, Briefcase, Search, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const colleges = [
  ['GLA University', 'Mathura, Uttar Pradesh', '12.4K', '2,340', 'G', 'from-indigo-500 to-blue-600', 'gla'],
  ['IIT Delhi', 'New Delhi, Delhi', '10.8K', '5,820', 'I', 'from-emerald-500 to-teal-600', 'iit-delhi'],
  ['DTU', 'New Delhi, Delhi', '15.1K', '3,160', 'D', 'from-violet-500 to-purple-600', 'dtu'],
];

const notes = [
  ['OS', 'Process Synchronization Notes', 'B.Tech CSE · 3rd Year', '4.8', '1.2K'],
  ['DBMS', 'Normalization & Transactions', 'B.Tech CSE · 2nd Year', '4.9', '980'],
  ['DSA', 'Graphs: Complete Revision', 'B.Tech CSE · 2nd Year', '4.7', '2.3K'],
];

const stateData = [
  { state: 'Uttar Pradesh', count: 142 },
  { state: 'Delhi', count: 98 },
  { state: 'Maharashtra', count: 210 },
  { state: 'Tamil Nadu', count: 164 },
  { state: 'Karnataka', count: 187 },
  { state: 'West Bengal', count: 112 },
  { state: 'Rajasthan', count: 96 },
  { state: 'Gujarat', count: 134 },
  { state: 'Madhya Pradesh', count: 88 },
  { state: 'Bihar', count: 74 },
  { state: 'Telangana', count: 102 },
  { state: 'Andhra Pradesh', count: 118 },
  { state: 'Kerala', count: 91 },
  { state: 'Punjab', count: 79 },
  { state: 'Haryana', count: 65 },
  { state: 'Uttarakhand', count: 52 },
  { state: 'Jharkhand', count: 43 },
  { state: 'Odisha', count: 68 },
  { state: 'Assam', count: 38 },
  { state: 'Chhattisgarh', count: 47 },
];

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Icon size={13} /></span>
        {label}
      </div>
      <p className="mt-2 text-lg font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

export default function Home() {
  const [stateSearch, setStateSearch] = useState('');
  const filteredStates = stateData.filter(s =>
    s.state.toLowerCase().includes(stateSearch.toLowerCase().trim())
  );

  return (
    <div className="pb-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-b-[2rem] border-b border-slate-200 bg-[#f8f9ff] px-1 pt-10 sm:pt-14 lg:pt-20">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(#dfe4ff_1px,transparent_1px),linear-gradient(90deg,#dfe4ff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_86%)]" />
        <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-200/45 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:pb-24">
          {/* Left */}
          <div className="max-w-xl lg:pb-4">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
              <Sparkles size={14} /> India's student network, reimagined
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.04] tracking-[-.055em] text-slate-950 sm:text-5xl lg:text-[62px]">
              Your college.<br />
              <span className="text-indigo-600">Your community.</span><br />
              Your future.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              The shared space for students who want to learn smarter, practice consistently, and grow together—on campus and beyond.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/colleges" className="btn-primary group px-5 py-3 text-sm">
                Explore colleges <ArrowRight size={17} className="ml-2 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/dashboard" className="btn-secondary px-5 py-3 text-sm">Start learning</Link>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['RA', 'PS', 'AK', 'NV'].map((n, i) => (
                  <span key={n} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#f8f9ff] text-[9px] font-bold text-white ${['bg-orange-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-violet-500'][i]}`}>{n}</span>
                ))}
              </div>
              <p className="text-xs text-slate-500"><b className="text-slate-800">50,000+</b> learners building momentum</p>
            </div>
          </div>

          {/* Right — dashboard card */}
          <div className="relative mx-auto w-full max-w-[600px] lg:ml-auto">
            <div className="absolute -right-3 -top-3 z-20 hidden rounded-xl border border-slate-200/80 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-sm sm:flex sm:items-center sm:gap-2.5">
              <Flame size={18} className="fill-amber-500 text-amber-500" />
              <div>
                <b className="block text-xs text-slate-900">7-day study streak</b>
                <span className="text-[11px] text-slate-500">+50 XP earned today</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_50px_-20px_rgba(79,70,229,.18)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20"><GraduationCap size={20} /></span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Your learning space</h3>
                    <p className="text-xs text-slate-500">GLA University · Computer Science</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">On track</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <MiniStat icon={Zap} label="Weekly XP" value="480" />
                <MiniStat icon={CircleHelp} label="Solved" value="142" />
                <MiniStat icon={Trophy} label="Campus rank" value="#18" />
              </div>

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Semester Exam Prep</span>
                  <span className="font-bold text-indigo-600">64% completed</span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[64%] rounded-full bg-indigo-600 transition-all duration-500" />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Current: Process Synchronization</span>
                  <Link to="/notes" className="font-semibold text-indigo-600 hover:text-indigo-700">Resume study →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Colleges ── */}
      <section className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-wide text-indigo-600">Find your community</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-slate-900">Explore your college</h2>
            <p className="mt-2 text-sm text-slate-500">Communities built around the campus you call home.</p>
          </div>
          <Link to="/colleges" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition" aria-label="View all colleges">
            View all colleges <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {colleges.map(([name, location, students, noteCount, initial, color, id]) => (
            <Link to={`/colleges/${id}`} key={name} className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
              <div className={`-mx-5 -mt-5 h-20 rounded-t-xl bg-gradient-to-r ${color} opacity-90`} />
              <span className={`-mt-7 grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${color} text-xl font-extrabold text-white shadow-lg`}>{initial}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{name}</h3>
              <p className="mt-1 text-xs text-slate-500">{location}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                <div className="flex gap-4">
                  <span className="text-slate-500"><b className="font-bold text-slate-800">{students}</b> Students</span>
                  <span className="text-slate-500"><b className="font-bold text-slate-800">{noteCount}</b> Notes</span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 transition group-hover:translate-x-0.5">
                  View community <ArrowRight size={14} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Browse by State ── */}
      <section className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-wide text-indigo-600">Colleges across India</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-slate-900">Browse by State</h2>
            <p className="mt-2 text-sm text-slate-500">
              Colleges, notes and student communities across <b className="text-slate-700">28+ states</b> in India.
            </p>
          </div>
          <Link to="/colleges" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition" aria-label="View all colleges by state">
            View all colleges <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Quick state search */}
        <div className="relative mb-6 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search state..."
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="Search states"
          />
        </div>

        {/* Responsive, breathable state cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filteredStates.map(({ state, count }) => (
            <Link
              key={state}
              to={`/colleges?state=${encodeURIComponent(state)}`}
              className="group flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-indigo-600 transition group-hover:scale-110" aria-hidden="true" />
                <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{state}</span>
              </div>
              <p className="pl-6 text-xs text-slate-500">
                {count} colleges
              </p>
            </Link>
          ))}
          {filteredStates.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-slate-400">
              No states matching "{stateSearch}".
            </p>
          )}
        </div>

        {/* Platform stats strip */}
        <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-4">
          {[
            { value: '28+', label: 'States covered' },
            { value: '2,400+', label: 'Colleges listed' },
            { value: '50K+', label: 'Active students' },
            { value: '1.2L+', label: 'Notes shared' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-indigo-600">{value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Career Roadmaps, Job Portal & BuildTogether ── */}
      <section className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Roadmaps Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-7 text-white border border-indigo-900/50 shadow-xl group flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-4">
                <Compass size={14} /> Step-by-Step Paths
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                Career Roadmaps
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Master modern engineering roles with structured milestone roadmaps, curated resources, and capstone guides.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['AI/ML', 'Full-Stack', 'DevOps', 'DSA'].map(r => (
                  <span key={r} className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-semibold text-slate-200 border border-white/10">
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/roadmaps" className="btn-primary inline-flex items-center justify-center gap-2 text-xs w-full">
              <span>Explore Roadmaps</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Jobs Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-7 text-white border border-blue-900/50 shadow-xl group flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
                <Briefcase size={14} /> Freshers & Internships
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                College Job Portal
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Verified software engineering roles, high-stipend summer internships, and graduate trainee openings for campus students.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['Google', 'Microsoft', 'Swiggy', 'Amazon'].map(c => (
                  <span key={c} className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-semibold text-slate-200 border border-white/10">
                    💼 {c}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/jobs" className="btn-primary inline-flex items-center justify-center gap-2 text-xs w-full">
              <span>Browse Job Openings</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* BuildTogether Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-7 text-white border border-purple-900/50 shadow-xl group flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 mb-4">
                <Rocket size={14} className="text-pink-400" /> Student Collaboration
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                BuildTogether
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                Assemble project teams, recruit student developers for national hackathons, and build startup MVPs together.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {['SIH 2026', 'Capstone Builds', 'Open Source', 'Startup MVP'].map(s => (
                  <span key={s} className="px-2.5 py-1 rounded-xl bg-purple-500/15 text-xs font-semibold text-purple-200 border border-purple-400/20">
                    ✨ {s}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/build-together" className="btn-primary inline-flex items-center justify-center gap-2 text-xs w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <span>Assemble & Build</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Learning Loop ── */}
      <section className="mx-auto max-w-[1280px] px-4 pt-24 sm:px-6">
        <div className="rounded-2xl bg-slate-950 px-6 py-10 text-white sm:px-10">
          <p className="text-xs font-semibold tracking-wide text-cyan-300">One connected study loop</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-.04em]">Build a habit that compounds.</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {[
              [BookOpen, 'Learn', 'Verified notes & resources'],
              [BrainCircuit, 'Practice', 'Focused test prep'],
              [Users, 'Ask', 'Real student answers'],
              [Trophy, 'Compete', 'Represent your college'],
              [CheckCircle2, 'Improve', 'See every win add up'],
            ].map(([Icon, title, desc], i) => (
              <div key={title} className="relative rounded-xl border border-white/10 bg-white/[.06] p-4">
                <span className="text-xs text-slate-400">0{i + 1}</span>
                <Icon className="mt-5 text-cyan-300" size={20} />
                <b className="mt-3 block text-sm">{title}</b>
                <p className="mt-1 text-xs leading-5 text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Notes ── */}
      <section className="mx-auto max-w-[1280px] px-4 pt-24 sm:px-6">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wide text-indigo-600">Exam preparation</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-slate-900">Everything you need for your next exam</h2>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['GLA University', 'B.Tech CSE', '3rd Year', 'Semester 5', 'All subjects'].map((filter, i) => (
            <button
              key={filter}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                i === 0
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {notes.map(([tag, title, meta, rating, downloads]) => (
            <Link key={title} to="/notes" className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><FileText size={20} /></span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">★ {rating}</span>
              </div>
              <span className="mt-5 inline-block rounded bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">{tag}</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
              <p className="mt-1 text-xs text-slate-500">{meta}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span>↓ {downloads} downloads</span>
                <span className="inline-flex items-center gap-1 font-bold text-indigo-600 transition group-hover:translate-x-0.5">
                  View notes <ArrowRight size={14} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
