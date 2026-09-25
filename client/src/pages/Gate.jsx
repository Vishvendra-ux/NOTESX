import { useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, Atom, Binary, BookOpen, BrainCircuit,
  Check, CheckCircle2, ChevronDown, ChevronRight, Clock3, Code2, Cpu,
  Database, Filter, Layers3, Network, Play, Search, Sparkles,
  Target, Terminal, X,
} from 'lucide-react';

const subjects = [
  { name: 'Engineering Mathematics', short: 'Maths', icon: BrainCircuit, color: 'violet', progress: 58, phase: 'Build foundations', topics: ['Linear algebra', 'Calculus', 'Discrete mathematics', 'Probability & statistics'], note: 'The logic behind every great solution.' },
  { name: 'Digital Logic', short: 'Logic', icon: Binary, color: 'amber', progress: 42, phase: 'Build foundations', topics: ['Boolean algebra', 'Combinational circuits', 'Sequential circuits', 'Number representation'], note: 'Turn bits into building blocks.' },
  { name: 'Computer Organization & Architecture', short: 'COA', icon: Cpu, color: 'blue', progress: 60, phase: 'Build foundations', topics: ['Instruction sets', 'Pipelining', 'Memory hierarchy', 'I/O systems'], note: 'See what happens beneath the code.' },
  { name: 'Programming & Data Structures', short: 'PDS', icon: Code2, color: 'emerald', progress: 90, phase: 'Core computing', topics: ['C programming', 'Recursion', 'Arrays & linked lists', 'Trees, heaps & graphs'], note: 'Write it well. Structure it better.' },
  { name: 'Algorithms', short: 'Algo', icon: Layers3, color: 'rose', progress: 68, phase: 'Core computing', topics: ['Searching & sorting', 'Greedy methods', 'Dynamic programming', 'Graph algorithms'], note: 'Find the elegant path to an answer.' },
  { name: 'Theory of Computation', short: 'TOC', icon: Atom, color: 'cyan', progress: 80, phase: 'Core computing', topics: ['Finite automata', 'Regular languages', 'Context-free grammars', 'Decidability'], note: 'Explore the limits of computation.' },
  { name: 'Compiler Design', short: 'Compiler', icon: Terminal, color: 'orange', progress: 35, phase: 'Core computing', topics: ['Lexical analysis', 'Parsing', 'Syntax-directed translation', 'Code optimization'], note: 'Follow a language from source to machine.' },
  { name: 'Operating Systems', short: 'OS', icon: Activity, color: 'indigo', progress: 70, phase: 'Systems', topics: ['Processes & threads', 'CPU scheduling', 'Synchronization', 'Virtual memory & file systems'], note: 'Make sense of the machine multitasking.' },
  { name: 'Databases', short: 'DBMS', icon: Database, color: 'purple', progress: 60, phase: 'Systems', topics: ['ER models & SQL', 'Relational algebra', 'Normalization', 'Transactions & indexing'], note: 'Design data that stays useful.' },
  { name: 'Computer Networks', short: 'Networks', icon: Network, color: 'teal', progress: 50, phase: 'Systems', topics: ['Network layers', 'IP addressing', 'Routing & switching', 'TCP, UDP & applications'], note: 'Trace the journey from one packet to another.' },
  { name: 'General Aptitude', short: 'Aptitude', icon: Sparkles, color: 'pink', progress: 46, phase: 'Every week', topics: ['Verbal aptitude', 'Quantitative aptitude', 'Analytical aptitude', 'Spatial aptitude'], note: 'A few focused minutes make a difference.' },
];

const phases = ['All subjects', 'Build foundations', 'Core computing', 'Systems', 'Every week'];
const colorTokens = {
  violet: 'text-violet-600 bg-violet-50 dark:bg-violet-400/10 dark:text-violet-300',
  amber: 'text-amber-600 bg-amber-50 dark:bg-amber-400/10 dark:text-amber-300',
  blue: 'text-blue-600 bg-blue-50 dark:bg-blue-400/10 dark:text-blue-300',
  emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-400/10 dark:text-emerald-300',
  rose: 'text-rose-600 bg-rose-50 dark:bg-rose-400/10 dark:text-rose-300',
  cyan: 'text-cyan-700 bg-cyan-50 dark:bg-cyan-400/10 dark:text-cyan-300',
  orange: 'text-orange-600 bg-orange-50 dark:bg-orange-400/10 dark:text-orange-300',
  indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-400/10 dark:text-indigo-300',
  purple: 'text-purple-600 bg-purple-50 dark:bg-purple-400/10 dark:text-purple-300',
  teal: 'text-teal-600 bg-teal-50 dark:bg-teal-400/10 dark:text-teal-300',
  pink: 'text-pink-600 bg-pink-50 dark:bg-pink-400/10 dark:text-pink-300',
};

export default function Gate() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All subjects');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(['Programming & Data Structures', 'Algorithms']);
  const visibleSubjects = useMemo(() => subjects.filter((subject) => {
    const matchesPhase = filter === 'All subjects' || subject.phase === filter;
    const text = `${subject.name} ${subject.topics.join(' ')}`.toLowerCase();
    return matchesPhase && text.includes(query.trim().toLowerCase());
  }), [filter, query]);
  const completed = subjects.filter((subject) => subject.progress >= 80).length;

  return (
    <main className="animate-fade-in pb-14">
      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#f5f7ff] via-[#f3f4ff] to-[#eeeaff] p-6 shadow-sm ring-1 ring-indigo-100 sm:p-9 lg:p-10 dark:from-slate-900 dark:via-indigo-950/50 dark:to-violet-950/40 dark:ring-slate-700">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-[22%] -z-10 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[670px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700 dark:border-indigo-400/20 dark:bg-slate-900/70 dark:text-indigo-300">
              <Sparkles size={14} /> GATE CS · 2027
            </div>
            <h1 className="mb-3 max-w-[15ch] text-4xl font-black leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-5xl dark:text-white">Your next big idea starts with one topic.</h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">Eleven subjects. One clear path. Pick a topic, build your momentum, and make exam day feel familiar.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setShowBuilder(true)} className="btn-primary gap-2 px-5 py-3"><Play size={16} fill="currentColor" /> Build a custom test</button>
              <a href="#subject-map" className="btn-secondary gap-2 px-5 py-3">Explore subjects <ArrowRight size={16} /></a>
            </div>
          </div>
          <div className="grid w-full grid-cols-3 divide-x divide-indigo-100/80 rounded-2xl bg-white/75 px-2 py-4 shadow-sm ring-1 ring-white/90 backdrop-blur lg:w-[330px] lg:shrink-0 dark:divide-slate-700 dark:bg-slate-900/65 dark:ring-slate-700">
            <div className="px-2 text-center"><p className="text-2xl font-black tracking-tight text-indigo-700 dark:text-indigo-300">11</p><p className="mt-1 text-[11px] font-semibold text-slate-500">subjects</p></div>
            <div className="px-2 text-center"><p className="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-300">{completed}<span className="text-sm">/11</span></p><p className="mt-1 text-[11px] font-semibold text-slate-500">in motion</p></div>
            <div className="px-2 text-center"><p className="text-2xl font-black tracking-tight text-amber-700 dark:text-amber-300">64<span className="text-sm">%</span></p><p className="mt-1 text-[11px] font-semibold text-slate-500">overall</p></div>
          </div>
        </div>
      </section>

      {showBuilder && <section className="glass-card relative mt-6 overflow-hidden p-5 sm:p-7" aria-label="Custom test builder">
        <div className="mb-5 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-primary-600">Quick challenge</p><h2 className="mt-1 text-2xl font-bold">Build your test</h2><p className="mt-1 text-sm text-slate-500">Choose the subjects you want to practise.</p></div><button aria-label="Close test builder" onClick={() => setShowBuilder(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={19}/></button></div>
        <div className="flex flex-wrap gap-2">{subjects.map((subject) => <button key={subject.short} onClick={() => setSelected((current) => current.includes(subject.name) ? current.filter((item) => item !== subject.name) : [...current, subject.name])} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${selected.includes(subject.name) ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-400/40 dark:bg-indigo-400/10 dark:text-indigo-200' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}><span className={`grid h-4 w-4 place-items-center rounded-full ${selected.includes(subject.name) ? 'bg-indigo-600 text-white' : 'border border-slate-300'}`}>{selected.includes(subject.name) && <Check size={11}/>}</span>{subject.short}</button>)}</div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-700"><p className="text-sm text-slate-500">{selected.length} subjects selected <span className="mx-1 text-slate-300">·</span> 30 questions <span className="mx-1 text-slate-300">·</span> 45 minutes</p><button disabled={!selected.length} className="btn-primary gap-2 disabled:cursor-not-allowed disabled:opacity-50"><Play size={15} fill="currentColor"/> Generate test</button></div>
      </section>}

      <section className="mt-10 grid gap-7 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div id="subject-map" className="scroll-mt-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Your syllabus, made navigable</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Choose your next chapter</h2></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{visibleSubjects.length} subjects</span></div>
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{phases.map((phase) => <button key={phase} onClick={() => setFilter(phase)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === phase ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900' : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}>{phase}</button>)}</div>
          <label className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-400 shadow-sm focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:ring-indigo-900"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a subject or topic…" className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"/><Filter size={16}/></label>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {visibleSubjects.map((subject, index) => {
              const Icon = subject.icon;
              const isOpen = expanded === subject.name;
              return <article key={subject.name} className={`group relative overflow-hidden rounded-[1.25rem] border bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(51,65,125,0.12)] dark:bg-slate-900 ${isOpen ? 'border-indigo-200 ring-2 ring-indigo-100 dark:border-indigo-400/40 dark:ring-indigo-900/50' : 'border-slate-200/80 dark:border-slate-700'}`}>
                <div className={`absolute inset-x-0 top-0 h-1 ${subject.progress >= 80 ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-400'} opacity-80`}/>
                <div className="flex items-start justify-between gap-3"><span className={`grid h-11 w-11 place-items-center rounded-2xl ring-1 ring-black/[0.03] ${colorTokens[subject.color]}`}><Icon size={21}/></span><span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">{String(index + 1).padStart(2, '0')}</span></div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{subject.phase}</p><h3 className="mt-1 min-h-[3rem] text-lg font-extrabold leading-snug text-slate-900 dark:text-white">{subject.name}</h3><p className="mt-1 min-h-6 text-sm text-slate-500 dark:text-slate-400">{subject.note}</p>
                <div className="mt-4 flex items-center justify-between text-xs"><span className="font-semibold text-slate-500">Study progress</span><span className="font-extrabold text-slate-800 dark:text-slate-200">{subject.progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full transition-all ${subject.progress >= 80 ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`} style={{ width: `${subject.progress}%` }}/></div>
                <button aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : subject.name)} className="mt-4 flex w-full items-center justify-between border-t border-slate-100 pt-3 text-sm font-bold text-indigo-700 transition hover:text-indigo-500 dark:border-slate-800 dark:text-indigo-300"><span>{isOpen ? 'Hide topics' : 'Explore topics'}</span>{isOpen ? <ChevronDown size={16} className="rotate-180 transition"/> : <ChevronRight size={16} className="transition group-hover:translate-x-0.5"/>}</button>
                {isOpen && <div className="mt-3 flex flex-wrap gap-2">{subject.topics.map((topic) => <span key={topic} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{topic}</span>)}</div>}
              </article>;
            })}
            {!visibleSubjects.length && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700"><p className="font-bold">No subjects found</p><p className="mt-1 text-sm text-slate-500">Try another subject name or topic.</p></div>}
          </div>
        </div>

        <aside className="space-y-4 xl:pt-1">
          <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-lg shadow-indigo-950/10 dark:bg-indigo-950/70"><div className="flex items-center gap-2 text-indigo-300"><Target size={17}/><span className="text-xs font-bold uppercase tracking-[0.14em]">Your momentum</span></div><p className="mt-4 text-4xl font-black">64<span className="text-xl text-indigo-300">%</span></p><p className="mt-1 text-sm text-slate-300">of your prep plan is on track</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" style={{width:'64%'}}/></div><p className="mt-3 flex items-center gap-1.5 text-xs text-indigo-200"><ArrowDownRight size={14}/> Keep your daily streak going</p></div>
          <div className="glass-card p-5"><h3 className="text-base font-extrabold">The full picture</h3><p className="mt-1 text-xs text-slate-500">Small steps add up.</p><div className="mt-4 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300"><CheckCircle2 size={17}/></span><span className="text-sm font-semibold">Questions solved</span></div><span className="font-extrabold">1,284</span></div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"><Activity size={17}/></span><span className="text-sm font-semibold">Accuracy</span></div><span className="font-extrabold">78%</span></div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300"><Clock3 size={17}/></span><span className="text-sm font-semibold">Mock tests</span></div><span className="font-extrabold">24</span></div></div></div>
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-400/20 dark:from-amber-950/40 dark:to-orange-950/30"><div className="flex items-center gap-2 text-amber-700 dark:text-amber-300"><BookOpen size={17}/><span className="text-xs font-bold uppercase tracking-[0.14em]">A good rhythm</span></div><p className="mt-3 text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-100">Mix one core topic with a little aptitude practice each week.</p><p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Steady revision helps ideas stick long after a study session ends.</p></div>
        </aside>
      </section>
    </main>
  );
}
