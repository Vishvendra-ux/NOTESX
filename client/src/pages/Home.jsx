import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, ChevronRight, CircleHelp, FileText, Flame, GraduationCap, MapPin, Sparkles, Trophy, Users, Zap, Compass, Briefcase } from 'lucide-react';
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
  { state: 'Uttar Pradesh', count: 142, dot: 'bg-indigo-500', text: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-100' },
  { state: 'Delhi', count: 98, dot: 'bg-violet-500', text: 'text-violet-700', bg: 'bg-violet-50 border-violet-100 hover:border-violet-400 hover:bg-violet-100' },
  { state: 'Maharashtra', count: 210, dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50 border-orange-100 hover:border-orange-400 hover:bg-orange-100' },
  { state: 'Tamil Nadu', count: 164, dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100 hover:border-emerald-400 hover:bg-emerald-100' },
  { state: 'Karnataka', count: 187, dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50 border-red-100 hover:border-red-400 hover:bg-red-100' },
  { state: 'West Bengal', count: 112, dot: 'bg-cyan-500', text: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-100 hover:border-cyan-400 hover:bg-cyan-100' },
  { state: 'Rajasthan', count: 96, dot: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-100 hover:border-yellow-400 hover:bg-yellow-100' },
  { state: 'Gujarat', count: 134, dot: 'bg-pink-500', text: 'text-pink-700', bg: 'bg-pink-50 border-pink-100 hover:border-pink-400 hover:bg-pink-100' },
  { state: 'Madhya Pradesh', count: 88, dot: 'bg-teal-500', text: 'text-teal-700', bg: 'bg-teal-50 border-teal-100 hover:border-teal-400 hover:bg-teal-100' },
  { state: 'Bihar', count: 74, dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-100 hover:border-amber-400 hover:bg-amber-100' },
  { state: 'Telangana', count: 102, dot: 'bg-lime-600', text: 'text-lime-700', bg: 'bg-lime-50 border-lime-100 hover:border-lime-400 hover:bg-lime-100' },
  { state: 'Andhra Pradesh', count: 118, dot: 'bg-sky-500', text: 'text-sky-700', bg: 'bg-sky-50 border-sky-100 hover:border-sky-400 hover:bg-sky-100' },
  { state: 'Kerala', count: 91, dot: 'bg-green-600', text: 'text-green-700', bg: 'bg-green-50 border-green-100 hover:border-green-400 hover:bg-green-100' },
  { state: 'Punjab', count: 79, dot: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50 border-rose-100 hover:border-rose-400 hover:bg-rose-100' },
  { state: 'Haryana', count: 65, dot: 'bg-fuchsia-500', text: 'text-fuchsia-700', bg: 'bg-fuchsia-50 border-fuchsia-100 hover:border-fuchsia-400 hover:bg-fuchsia-100' },
  { state: 'Uttarakhand', count: 52, dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50 border-blue-100 hover:border-blue-400 hover:bg-blue-100' },
  { state: 'Jharkhand', count: 43, dot: 'bg-orange-600', text: 'text-orange-800', bg: 'bg-orange-50 border-orange-100 hover:border-orange-400 hover:bg-orange-100' },
  { state: 'Odisha', count: 68, dot: 'bg-purple-500', text: 'text-purple-700', bg: 'bg-purple-50 border-purple-100 hover:border-purple-400 hover:bg-purple-100' },
  { state: 'Assam', count: 38, dot: 'bg-emerald-600', text: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-100 hover:border-emerald-400 hover:bg-emerald-100' },
  { state: 'Chhattisgarh', count: 47, dot: 'bg-indigo-600', text: 'text-indigo-800', bg: 'bg-indigo-50 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-100' },
];

function MiniStat({ icon: Icon, label, value, tint }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className={`grid h-6 w-6 place-items-center rounded-lg ${tint}`}><Icon size={13} /></span>
        {label}
      </div>
      <p className="mt-2 text-lg font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

export default function Home() {
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
            <div className="absolute -left-7 top-14 z-20 hidden rounded-xl border border-slate-100 bg-white p-3 shadow-xl sm:flex sm:items-center sm:gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><FileText size={15} /></span>
              <span><b className="block text-xs text-slate-800">New note uploaded</b><small className="text-[10px] text-slate-500">Operating Systems</small></span>
            </div>
            <div className="absolute -right-4 bottom-10 z-20 hidden rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-xl sm:flex sm:items-center sm:gap-2">
              <Flame size={18} className="fill-orange-500 text-orange-500" />
              <span><b className="block text-xs text-slate-800">7 day streak</b><small className="text-[10px] text-emerald-600">+50 XP today</small></span>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_28px_60px_-24px_rgba(39,58,171,.35)] sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white"><GraduationCap size={19} /></span>
                  <div><b className="block text-sm text-slate-800">Your learning space</b><small className="text-xs text-slate-500">GLA University · CSE</small></div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">On track</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <MiniStat icon={Zap} label="Weekly XP" value="480" tint="bg-amber-50 text-amber-600" />
                <MiniStat icon={CircleHelp} label="Solved" value="142" tint="bg-indigo-50 text-indigo-600" />
                <MiniStat icon={Trophy} label="College rank" value="#18" tint="bg-violet-50 text-violet-600" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
                <div className="rounded-xl bg-slate-950 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">GATE preparation</span>
                    <span className="text-[10px] text-emerald-300">+8% this month</span>
                  </div>
                  <div className="mt-5 flex items-end gap-2"><b className="text-3xl">64%</b><span className="mb-1 text-xs text-slate-400">complete</span></div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-700"><i className="block h-full w-[64%] rounded-full bg-cyan-400" /></div>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded bg-white/10 px-2 py-1 text-[10px]">DSA 90%</span>
                    <span className="rounded bg-white/10 px-2 py-1 text-[10px]">OS 70%</span>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Live now
                  </div>
                  <b className="mt-3 block text-sm text-slate-900">College Coding Battle</b>
                  <p className="mt-1 text-xs text-slate-500">1,248 students competing</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-600">42:18 left</span>
                    <span className="rounded-lg bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white">Join</span>
                  </div>
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
            <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Find your people</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-slate-900">Explore your college</h2>
            <p className="mt-2 text-sm text-slate-500">Communities built around the campus you call home.</p>
          </div>
          <Link to="/colleges" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600">Browse all colleges <ChevronRight size={16} /></Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {colleges.map(([name, location, students, noteCount, initial, color, id]) => (
            <Link to={`/colleges/${id}`} key={name} className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
              <div className={`-mx-5 -mt-5 h-20 rounded-t-xl bg-gradient-to-r ${color} opacity-90`} />
              <span className={`-mt-7 grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${color} text-xl font-extrabold text-white shadow-lg`}>{initial}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{name}</h3>
              <p className="mt-1 text-xs text-slate-500">{location}</p>
              <div className="mt-5 grid grid-cols-2 border-t border-slate-100 pt-4 text-xs">
                <span className="text-slate-500"><b className="block text-sm text-slate-800">{students}</b> Students</span>
                <span className="text-slate-500"><b className="block text-sm text-slate-800">{noteCount}</b> Notes</span>
              </div>
              <p className="mt-5 text-sm font-bold text-indigo-600">View community →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Browse by State ── */}
      <section className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Every corner of India</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-slate-900">Browse by State</h2>
            <p className="mt-2 text-sm text-slate-500">
              Colleges, notes and student communities across <b className="text-slate-700">28+ states</b> in India.
            </p>
          </div>
          <Link to="/colleges" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {stateData.map(({ state, count, dot, text, bg }) => (
            <Link
              key={state}
              to={`/colleges?state=${encodeURIComponent(state)}`}
              className={`flex flex-col gap-2.5 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${bg}`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
                <span className={`text-sm font-bold leading-tight ${text}`}>{state}</span>
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={11} /> {count} colleges
              </p>
            </Link>
          ))}
        </div>

        {/* Platform stats strip */}
        <div className="mt-10 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-4">
          {[
            { value: '28+', label: 'States covered', color: 'text-indigo-600' },
            { value: '2,400+', label: 'Colleges listed', color: 'text-emerald-600' },
            { value: '50K+', label: 'Active students', color: 'text-violet-600' },
            { value: '1.2L+', label: 'Notes shared', color: 'text-orange-500' },
          ].map(({ value, label, color }) => (
            <div key={label} className="text-center">
              <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Career Roadmaps & Job Portal ── */}
      <section className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Roadmaps Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-7 sm:p-8 text-white border border-indigo-900/50 shadow-xl group">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-4">
              <Compass size={14} /> Step-by-Step Learning Paths
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              Career & Tech Roadmaps
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              Master modern engineering roles with structured milestone roadmaps, curated free resources, and resume-ready capstone projects.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['AI / ML Engineer', 'Frontend (React/Next)', 'Backend (Node/Go)', 'DevOps & Cloud', 'DSA & System Design'].map(r => (
                <span key={r} className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-semibold text-slate-200 border border-white/10">
                  {r}
                </span>
              ))}
            </div>
            <Link to="/roadmaps" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition group-hover:translate-x-1">
              <span>Explore Roadmaps</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Jobs Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-7 sm:p-8 text-white border border-blue-900/50 shadow-xl group">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
              <Briefcase size={14} /> Freshers & Internships
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
              College Job Portal
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
              Verified software engineering roles, high-stipend summer internships, and graduate trainee opportunities for 2024, 2025 & 2026 batches.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Google', 'Microsoft', 'Swiggy', 'Razorpay', 'Cred', 'Amazon'].map(c => (
                <span key={c} className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-semibold text-slate-200 border border-white/10">
                  💼 {c}
                </span>
              ))}
            </div>
            <Link to="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition group-hover:translate-x-1">
              <span>Browse Job Openings</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Learning Loop ── */}
      <section className="mx-auto max-w-[1280px] px-4 pt-24 sm:px-6">
        <div className="rounded-2xl bg-slate-950 px-6 py-10 text-white sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">One connected loop</p>
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
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Exam ready</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-slate-900">Everything you need for your next exam</h2>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['GLA University', 'B.Tech CSE', '3rd Year', 'Semester 5', 'All subjects'].map((filter, i) => (
            <button key={filter} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${i === 0 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>
              {filter}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {notes.map(([tag, title, meta, rating, downloads]) => (
            <Link key={title} to="/notes" className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-500"><FileText size={20} /></span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">★ {rating}</span>
              </div>
              <span className="mt-5 inline-block rounded bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">{tag}</span>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-xs text-slate-500">{meta}</p>
              <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                ↓ {downloads} downloads
                <span className="float-right font-bold text-indigo-600">View notes →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
