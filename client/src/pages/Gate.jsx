import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown,
  ChevronRight, Clock3, Flame, LoaderCircle, Play, RotateCcw, Search, Sparkles,
  Target, X, FileQuestion
} from 'lucide-react';
import { gatePhases, gateSubjects, gateTopicCount } from '../data/gateSyllabus';
import { gateService } from '../services/api';

const GateTestBuilder = lazy(() => import('../components/gate/GateTestBuilder'));
const GateTestSession = lazy(() => import('../components/gate/GateTestSession'));
const GatePracticeViewer = lazy(() => import('../components/gate/GatePracticeViewer'));

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

const actionLabel = {
  in_progress: 'In progress',
  completed: 'Completed',
};

const readStoredJson = (key, fallback) => {
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return fallback;
    const value = JSON.parse(saved);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
};

function TopicStatus({ entry }) {
  if (!entry) return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">Not started</span>;
  const done = entry.status === 'completed';
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${done ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300'}`}>
    {done ? <CheckCircle2 size={12} /> : <Activity size={12} />}{actionLabel[entry.status] || 'In progress'}
  </span>;
}

export default function Gate() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyTopic, setBusyTopic] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSubjectForPyqs, setSelectedSubjectForPyqs] = useState(null);
  const [showPyqsForTopic, setShowPyqsForTopic] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All subjects');
  const [query, setQuery] = useState('');
  const [showTestBuilder, setShowTestBuilder] = useState(false);
  const [testSession, setTestSession] = useState(null);
  const [resumeState, setResumeState] = useState(() => readStoredJson('gate_pyq_resume', null));

  const loadProgress = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await gateService.getProgress();
      setProgress(response.data);
    } catch (error) {
      setLoadError(error.response?.data?.message || 'Your GATE progress could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProgress(); }, []);

  useEffect(() => {
    if (!selectedTopic && !selectedSubjectForPyqs) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedTopic(null);
        setSelectedSubjectForPyqs(null);
        setShowPyqsForTopic(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedTopic, selectedSubjectForPyqs]);

  const progressByTopic = useMemo(() => new Map((progress?.topics || []).map((entry) => [entry.topicId, entry])), [progress]);
  const visibleSubjects = useMemo(() => gateSubjects.filter((subject) => {
    const matchesPhase = filter === 'All subjects' || subject.phase === filter;
    const text = `${subject.name} ${subject.topics.map((topic) => `${topic.title} ${topic.goal} ${topic.concepts.join(' ')}`).join(' ')}`.toLowerCase();
    return matchesPhase && text.includes(query.trim().toLowerCase());
  }), [filter, query]);

  const allTopics = gateSubjects.flatMap((subject) => subject.topics.map((topic) => ({ ...topic, subject })));
  const completedTopics = (progress?.topics || []).filter((entry) => entry.status === 'completed').length;
  const inProgressTopics = (progress?.topics || []).filter((entry) => entry.status === 'in_progress').length;
  const activeSubjects = new Set((progress?.topics || []).map((entry) => entry.subjectId)).size;
  const weightedProgress = allTopics.reduce((sum, topic) => {
    const entry = progressByTopic.get(topic.id);
    return sum + (entry?.status === 'completed' ? 1 : entry?.status === 'in_progress' ? 0.35 : 0);
  }, 0);
  const overallProgress = Math.round((weightedProgress / gateTopicCount) * 100);
  const nextTopic = allTopics.find(({ id }) => progressByTopic.get(id)?.status === 'in_progress')
    || allTopics.find(({ id }) => !progressByTopic.has(id));

  const updateTopic = async (topic, subject, action) => {
    setBusyTopic(topic.id);
    setActionError('');
    try {
      const response = await gateService[`${action}Topic`](topic.id, subject.id);
      setProgress(response.data);
    } catch (error) {
      setActionError(error.response?.data?.message || 'Progress could not be saved. Check your connection and try again.');
    } finally {
      setBusyTopic('');
    }
  };

  const findTopic = (topicId) => allTopics.find((item) => item.id === topicId);

  return (
    <main className="animate-fade-in pb-14">
      {resumeState && (
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-800">
            <div>
              <p className="text-xs font-bold text-indigo-600 mb-1">Resume practice</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Continue practice: {resumeState.topicTitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const subject = gateSubjects.find((item) => item.id === resumeState.subjectId);
                  if (resumeState.topicId) {
                    const topic = subject?.topics.find((item) => item.id === resumeState.topicId);
                    if (topic) {
                      setSelectedTopic({ ...topic, subject });
                      setShowPyqsForTopic(true);
                    }
                  } else if (subject) {
                    setSelectedSubjectForPyqs(subject);
                    setShowPyqsForTopic(true);
                  }
                }}
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm flex items-center gap-2 transition"
              >
                Resume practice <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  try { window.localStorage.removeItem('gate_pyq_resume'); } catch { /* Storage may be unavailable. */ }
                  setResumeState(null);
                }}
                className="whitespace-nowrap rounded-xl border border-indigo-200 px-3 py-2 text-sm font-bold text-indigo-700 transition hover:bg-white dark:border-indigo-700 dark:text-indigo-100 dark:hover:bg-indigo-950/50"
              >
                Dismiss
              </button>
            </div>
          </div>
        </section>
      )}
      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#f5f7ff] via-[#f3f4ff] to-[#eeeaff] p-6 shadow-sm ring-1 ring-indigo-100 sm:p-9 lg:p-10 dark:from-slate-900 dark:via-indigo-950/50 dark:to-violet-950/40 dark:ring-slate-700">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-[22%] -z-10 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[670px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-400/20 dark:bg-slate-900/70 dark:text-indigo-300">
              <Sparkles size={14} /> GATE CS · 2027
            </div>
            <h1 className="mb-3 max-w-[15ch] text-3xl font-black leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-5xl dark:text-white">Your next big idea starts with one topic.</h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">Ten CS syllabus sections plus General Aptitude. Work through the topics one at a time, track your progress, and practise with the questions available in the bank.</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">The official CS paper is 180 minutes, 65 questions and 100 marks, with MCQ, MSQ and NAT questions. Custom tests here use available MCQs. <a href="https://gate2027.iitm.ac.in/question_paper_pattern" target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 underline underline-offset-2 dark:text-indigo-300">See the official exam pattern ↗</a></p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => { setShowTestBuilder((open) => !open); setTestSession(null); }} className="btn-primary gap-2 px-5 py-3"><Play size={16} fill="currentColor" />Customize a test</button>
              <button onClick={() => nextTopic && setSelectedTopic(findTopic(nextTopic.id))} disabled={!nextTopic || loading} className="btn-secondary gap-2 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50">{nextTopic && progressByTopic.get(nextTopic.id)?.status === 'in_progress' ? 'Continue your topic' : 'Start your next topic'} <ArrowRight size={16} /></button>
              <a href="#subject-map" className="btn-secondary gap-2 px-5 py-3">Explore subjects <ArrowRight size={16} className="rotate-90" /></a>
            </div>
          </div>
          <div className="grid w-full grid-cols-3 divide-x divide-indigo-100/80 rounded-2xl bg-white/75 px-2 py-4 shadow-sm ring-1 ring-white/90 backdrop-blur lg:w-[350px] lg:shrink-0 dark:divide-slate-700 dark:bg-slate-900/65 dark:ring-slate-700">
            <div className="px-2 text-center"><p className="text-2xl font-black tracking-tight text-indigo-700 dark:text-indigo-300">{gateSubjects.length}</p><p className="mt-1 text-xs font-semibold text-slate-500">subjects</p></div>
            <div className="px-2 text-center"><p className="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-300">{loading ? '—' : activeSubjects}<span className="text-sm">{loading ? '' : `/${gateSubjects.length}`}</span></p><p className="mt-1 text-xs font-semibold text-slate-500">in motion</p></div>
            <div className="px-2 text-center"><p className="text-2xl font-black tracking-tight text-amber-700 dark:text-amber-300">{loading ? '—' : overallProgress}<span className="text-sm">{loading ? '' : '%'}</span></p><p className="mt-1 text-xs font-semibold text-slate-500">prep progress</p></div>
          </div>
        </div>
      </section>

      {showTestBuilder && !testSession && <Suspense fallback={<div className="glass-card mt-6 p-6 text-sm font-semibold text-slate-500">Loading test builder…</div>}><GateTestBuilder subjects={gateSubjects} onClose={() => setShowTestBuilder(false)} onTestStarted={(test) => { setTestSession(test); setShowTestBuilder(false); }} /></Suspense>}
      {testSession && <Suspense fallback={<div className="glass-card mt-6 p-6 text-sm font-semibold text-slate-500">Preparing your test…</div>}><GateTestSession test={testSession} onExit={() => setTestSession(null)} /></Suspense>}

      {loadError && <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-400/20 dark:bg-rose-950/30 dark:text-rose-200"><span>{loadError}</span><button onClick={loadProgress} className="font-bold underline underline-offset-2">Retry</button></div>}

      <section className="mt-10 grid gap-7 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div id="subject-map" className="scroll-mt-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Your syllabus, made navigable</p><h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Choose your next chapter</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Browse by phase, or check the <a href="https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf" target="_blank" rel="noreferrer" className="font-bold text-indigo-600 underline decoration-indigo-300 underline-offset-4 hover:text-indigo-500 dark:text-indigo-300">Official 2027 syllabus ↗</a>.</p></div><div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{visibleSubjects.length} subjects shown · {gateTopicCount} total topics</span></div></div>
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{gatePhases.map((phase) => <button key={phase} onClick={() => setFilter(phase)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === phase ? 'bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900' : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}>{phase}</button>)}</div>
          <label className="relative mb-5 block"><span className="sr-only">Search subjects and topics</span><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a subject or topic…" className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:pr-24 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-900" /><span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 text-xs text-slate-500 sm:inline">{gateTopicCount} topics</span></label>
          {loading && <div className="glass-card flex items-center justify-center gap-3 p-10 text-sm font-semibold text-slate-500"><LoaderCircle size={20} className="animate-spin text-indigo-500" /> Loading your saved progress…</div>}
          {!loading && <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {visibleSubjects.map((subject, index) => {
              const Icon = subject.icon;
              const isOpen = expanded === subject.id;
              const topicProgress = subject.topics.reduce((sum, topic) => {
                const entry = progressByTopic.get(topic.id);
                return sum + (entry?.status === 'completed' ? 1 : entry?.status === 'in_progress' ? 0.35 : 0);
              }, 0);
              const subjectPercent = Math.round((topicProgress / subject.topics.length) * 100);
              const subjectCompleted = subject.topics.filter((topic) => progressByTopic.get(topic.id)?.status === 'completed').length;
              const subjectActive = subject.topics.some((topic) => progressByTopic.has(topic.id));
              return <article key={subject.id} className={`group relative overflow-hidden rounded-[1.25rem] border bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(51,65,125,0.12)] dark:bg-slate-900 ${isOpen ? 'border-indigo-200 ring-2 ring-indigo-100 dark:border-indigo-400/40 dark:ring-indigo-900/50' : 'border-slate-200/80 dark:border-slate-700'}`}>
                <div className={`absolute inset-x-0 top-0 h-1 ${subjectPercent === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-400'} opacity-80`} />
                <div className="flex items-start justify-between gap-3"><span className={`grid h-11 w-11 place-items-center rounded-2xl ring-1 ring-black/[0.03] ${colorTokens[subject.color]}`}><Icon size={21} /></span><span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">{String(index + 1).padStart(2, '0')}</span></div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{subject.phase}</p><h3 className="mt-1 min-h-[3rem] text-lg font-extrabold leading-snug text-slate-900 dark:text-white">{subject.name}</h3><p className="mt-1 min-h-6 text-sm text-slate-500 dark:text-slate-400">{subject.note}</p>
                <div className="mt-4 flex items-center justify-between text-xs"><span className="font-semibold text-slate-500">Prep progress</span><span className="font-extrabold text-slate-800 dark:text-slate-200">{subjectPercent}% <span className="font-medium text-slate-500">· {subjectCompleted}/{subject.topics.length} done</span></span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full transition-all ${subjectPercent === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`} style={{ width: `${subjectPercent}%` }} /></div>
                <button aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : subject.id)} className="mt-4 flex w-full items-center justify-between border-t border-slate-100 pt-3 text-sm font-bold text-indigo-700 transition hover:text-indigo-500 dark:border-slate-800 dark:text-indigo-300"><span>{isOpen ? 'Hide topics' : `Explore ${subject.topics.length} topics`}</span>{isOpen ? <ChevronDown size={16} className="rotate-180 transition" /> : <ChevronRight size={16} className="transition group-hover:translate-x-0.5" />}</button>
                {isOpen && (
                  <div className="mt-3 space-y-2">
                    {subject.topics.map((topic) => {
                      const entry = progressByTopic.get(topic.id);
                      return <button key={topic.id} onClick={() => { setSelectedTopic({ ...topic, subject }); setActionError(''); }} className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-left transition hover:border-indigo-200 hover:bg-indigo-50/70 dark:border-slate-800 dark:bg-slate-800/70 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-400/10"><span className="min-w-0"><span className="block truncate text-xs font-bold text-slate-800 dark:text-slate-100">{topic.title}</span><span className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Clock3 size={11} /> {topic.minutes} min</span></span><TopicStatus entry={entry} /></button>;
                    })}
                    <button 
                      onClick={() => { setSelectedSubjectForPyqs(subject); setShowPyqsForTopic(true); }} 
                      className="mt-2 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition dark:bg-indigo-900/20 dark:border-indigo-800/50 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
                    >
                      <FileQuestion size={14} /> Practice {subject.name} questions <ArrowRight size={14} />
                    </button>
                  </div>
                )}
                {subjectActive && <p className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">You have study activity in this subject.</p>}
              </article>;
            })}
            {!visibleSubjects.length && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700"><p className="font-bold">No subjects or topics found</p><p className="mt-1 text-sm text-slate-500">Try another subject name or topic.</p></div>}
          </div>}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-2xl bg-indigo-900 p-5 text-white shadow-sm dark:bg-indigo-950/70"><div className="flex items-center gap-2 text-indigo-300"><Target size={17} /><span className="text-xs font-bold uppercase tracking-wider">Your momentum</span></div><p className="mt-4 text-3xl font-black">{loading ? '—' : overallProgress}<span className="text-xl text-indigo-300">{loading ? '' : '%'}</span></p><p className="mt-1 text-sm text-indigo-100">of your syllabus has study activity</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 transition-all" style={{ width: `${overallProgress}%` }} /></div><p className="mt-3 flex items-center gap-1.5 text-xs text-indigo-100"><ArrowDownRight size={14} /> Started topics count as 35%; completed topics count as 100%.</p></div>
          <div className="glass-card p-5"><h3 className="text-base font-extrabold">The full picture</h3><p className="mt-1 text-xs text-slate-500">Your activity, saved to your account.</p><div className="mt-4 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300"><Activity size={17} /></span><span className="text-sm font-semibold">Topics in progress</span></div><span className="font-extrabold">{loading ? '—' : inProgressTopics}</span></div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"><CheckCircle2 size={17} /></span><span className="text-sm font-semibold">Topics completed</span></div><span className="font-extrabold">{loading ? '—' : completedTopics}</span></div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300"><Flame size={17} /></span><span className="text-sm font-semibold">Active day streak</span></div><span className="font-extrabold">{loading ? '—' : progress?.currentStreak || 0}</span></div></div></div>
          <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 dark:border-indigo-400/20 dark:from-indigo-950/40 dark:to-violet-950/30"><div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300"><BookOpen size={17} /><span className="text-xs font-bold uppercase tracking-wider">Your next step</span></div>{loading ? <p className="mt-3 text-sm text-slate-500">Loading your study plan…</p> : nextTopic ? <><p className="mt-3 text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-100">{progressByTopic.get(nextTopic.id)?.status === 'in_progress' ? 'Pick up where you left off:' : 'Start with:'} {nextTopic.title}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{nextTopic.subject.name} · about {nextTopic.minutes} minutes</p><button onClick={() => setSelectedTopic(findTopic(nextTopic.id))} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-500 dark:text-indigo-300">Open topic <ArrowRight size={15} /></button></> : <p className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">You have worked through every topic in this syllabus.</p>}</div>
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-400/20 dark:from-amber-950/40 dark:to-orange-950/30"><div className="flex items-center gap-2 text-amber-700 dark:text-amber-300"><Sparkles size={17} /><span className="text-xs font-bold uppercase tracking-wider">A good rhythm</span></div><p className="mt-3 text-sm font-bold leading-relaxed text-slate-800 dark:text-slate-100">Mix one core topic with a little aptitude practice each week.</p><p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Steady revision helps ideas stick long after a study session ends.</p></div>
        </aside>
      </section>

      {selectedTopic && <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) { setSelectedTopic(null); setShowPyqsForTopic(false); } }}>
        <section role="dialog" aria-modal="true" aria-labelledby={showPyqsForTopic ? 'gate-pyq-title' : 'gate-topic-title'} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7 dark:border-slate-700 dark:bg-slate-900">
          {showPyqsForTopic ? (
            <Suspense fallback={<p className="p-6 text-sm font-semibold text-slate-500">Loading practice questions…</p>}>
              <GatePracticeViewer
                subjectId={selectedTopic.subject.id}
                topicId={selectedTopic.id}
                topicTitle={selectedTopic.title}
                resumeQuestionId={resumeState?.topicId === selectedTopic.id ? resumeState.qId : null}
                onResumeChange={setResumeState}
                onBack={() => setShowPyqsForTopic(false)}
              />
            </Suspense>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{selectedTopic.subject.name} · Topic guide</p><h2 id="gate-topic-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">{selectedTopic.title}</h2></div><button aria-label="Close topic" onClick={() => { setSelectedTopic(null); setShowPyqsForTopic(false); }} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button></div>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedTopic.goal}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2"><TopicStatus entry={progressByTopic.get(selectedTopic.id)} /><span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"><Clock3 size={12} /> {selectedTopic.minutes} min suggested</span></div>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-800/60"><h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Study checklist</h3><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Work through these ideas, then mark the topic complete.</p><ul className="mt-4 space-y-3">{selectedTopic.concepts.map((concept) => <li key={concept} className="flex gap-3 text-sm leading-5 text-slate-700 dark:text-slate-200"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border border-indigo-200 bg-white text-indigo-600 dark:border-indigo-400/30 dark:bg-slate-900 dark:text-indigo-300"><Check size={12} /></span>{concept}</li>)}</ul></div>
              {actionError && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-950/30 dark:text-rose-200">{actionError}</p>}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <p className="text-xs leading-5 text-slate-500">Your progress follows you across visits when you’re signed in.</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setShowPyqsForTopic(true)} className="btn-secondary gap-2 px-5 py-3">
                    <FileQuestion size={15} /> Practice questions
                  </button>
                  {!progressByTopic.has(selectedTopic.id) && <button onClick={() => updateTopic(selectedTopic, selectedTopic.subject, 'start')} disabled={busyTopic === selectedTopic.id} className="btn-primary gap-2 px-5 py-3 disabled:opacity-60">{busyTopic === selectedTopic.id ? <LoaderCircle size={16} className="animate-spin" /> : <Play size={15} fill="currentColor" />} Start topic</button>}
                  {progressByTopic.get(selectedTopic.id)?.status === 'in_progress' && <button onClick={() => updateTopic(selectedTopic, selectedTopic.subject, 'complete')} disabled={busyTopic === selectedTopic.id} className="btn-primary gap-2 px-5 py-3 disabled:opacity-60">{busyTopic === selectedTopic.id ? <LoaderCircle size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Mark complete</button>}
                  {progressByTopic.get(selectedTopic.id)?.status === 'completed' && <button onClick={() => updateTopic(selectedTopic, selectedTopic.subject, 'reopen')} disabled={busyTopic === selectedTopic.id} className="btn-secondary gap-2 px-5 py-3 disabled:opacity-60">{busyTopic === selectedTopic.id ? <LoaderCircle size={16} className="animate-spin" /> : <RotateCcw size={15} />} Reopen topic</button>}
                </div>
              </div>
            </>
          )}
        </section>
      </div>}

      {selectedSubjectForPyqs && showPyqsForTopic && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) { setSelectedSubjectForPyqs(null); setShowPyqsForTopic(false); } }}>
          <section role="dialog" aria-modal="true" aria-labelledby="gate-pyq-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7 dark:border-slate-700 dark:bg-slate-900">
            <Suspense fallback={<p className="p-6 text-sm font-semibold text-slate-500">Loading practice questions…</p>}>
              <GatePracticeViewer
                subjectId={selectedSubjectForPyqs.id}
                topicId={null}
                topicTitle={`All ${selectedSubjectForPyqs.name} Topics`}
                resumeQuestionId={resumeState?.subjectId === selectedSubjectForPyqs.id && !resumeState.topicId ? resumeState.qId : null}
                onResumeChange={setResumeState}
                onBack={() => { setSelectedSubjectForPyqs(null); setShowPyqsForTopic(false); }}
              />
            </Suspense>
          </section>
        </div>
      )}
    </main>
  );
}
