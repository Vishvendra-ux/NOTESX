import { useMemo, useState } from 'react';
import { AlertCircle, LoaderCircle, Play, X } from 'lucide-react';
import { testService } from '../../services/api';

const questionOptions = [5, 10, 15, 20, 30, 45];
const durationOptions = [10, 15, 20, 30, 45, 60, 90, 180];
const difficultyOptions = ['Any difficulty', 'Easy', 'Medium', 'Hard'];

export default function GateTestBuilder({ subjects, onTestStarted, onClose }) {
  const [subjectId, setSubjectId] = useState('all');
  const [selectedTopicIds, setSelectedTopicIds] = useState([]);
  const [difficulty, setDifficulty] = useState('Any difficulty');
  const [questionCount, setQuestionCount] = useState(10);
  const [duration, setDuration] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedSubject = subjects.find((subject) => subject.id === subjectId);
  const chosenTopics = useMemo(() => {
    if (subjectId === 'all') return subjects.flatMap((subject) => subject.topics);
    if (!selectedSubject) return [];
    return selectedTopicIds.length
      ? selectedSubject.topics.filter((topic) => selectedTopicIds.includes(topic.id))
      : selectedSubject.topics;
  }, [selectedSubject, selectedTopicIds, subjectId, subjects]);

  const toggleTopic = (topicId) => {
    setSelectedTopicIds((current) => current.includes(topicId)
      ? current.filter((id) => id !== topicId)
      : [...current, topicId]);
  };

  const buildTest = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const topicTerms = chosenTopics.flatMap((topic) => [topic.title, ...topic.concepts]);
      const response = await testService.customize({
        subjectName: selectedSubject?.name || 'All subjects',
        topicTerms,
        topicLabels: selectedSubject ? chosenTopics.map((topic) => topic.title) : [],
        difficulty: difficulty === 'Any difficulty' ? 'Any' : difficulty,
        questionCount: Number(questionCount),
        duration: Number(duration),
      });
      onTestStarted(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'The custom test could not be created. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="glass-card relative mt-6 overflow-hidden p-5 sm:p-7" aria-label="Custom GATE test builder">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-widest text-primary-600">Make it yours</p><h2 className="mt-1 text-2xl font-bold">Customize your test</h2><p className="mt-1 text-sm text-slate-500">Choose what to practise, how many questions, and how much time you want.</p></div>
        <button type="button" aria-label="Close test builder" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><X size={19} /></button>
      </div>

      <form onSubmit={buildTest}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Subject
            <select value={subjectId} onChange={(event) => { setSubjectId(event.target.value); setSelectedTopicIds([]); }} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900">
              <option value="all">All GATE CS subjects</option>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Difficulty
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900">
              {difficultyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Number of questions
            <select value={questionCount} onChange={(event) => setQuestionCount(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900">
              {questionOptions.map((count) => <option key={count} value={count}>{count} questions</option>)}
            </select>
          </label>
          <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Time limit
            <select value={duration} onChange={(event) => setDuration(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900">
              {durationOptions.map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}
            </select>
          </label>
        </div>

        {selectedSubject && <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
          <div className="flex flex-wrap items-baseline justify-between gap-2"><div><h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Narrow it to topics</h3><p className="mt-1 text-xs text-slate-500">Select specific topics, or leave these clear to include the whole subject.</p></div><button type="button" onClick={() => setSelectedTopicIds([])} className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">Use all topics</button></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">{selectedSubject.topics.map((topic) => {
            const checked = selectedTopicIds.includes(topic.id);
            return <label key={topic.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${checked ? 'border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-200' : 'border-slate-200 text-slate-600 hover:border-indigo-200 dark:border-slate-700 dark:text-slate-300'}`}>
              <input type="checkbox" checked={checked} onChange={() => toggleTopic(topic.id)} className="mt-0.5 accent-indigo-600" />
              <span className="font-semibold">{topic.title}</span>
            </label>;
          })}</div>
        </div>}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
          <p className="text-sm text-slate-500">{questionCount} MCQs · {duration} minutes · {difficulty === 'Any difficulty' ? 'mixed difficulty' : difficulty.toLowerCase()}</p>
          <button type="submit" disabled={submitting} className="btn-primary gap-2 px-5 py-3 disabled:cursor-wait disabled:opacity-60">{submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Play size={15} fill="currentColor" />}{submitting ? 'Building test…' : 'Create my test'}</button>
        </div>
        {error && <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-950/30 dark:text-amber-200"><AlertCircle size={17} className="mt-0.5 shrink-0" />{error}</p>}
      </form>
    </section>
  );
}
