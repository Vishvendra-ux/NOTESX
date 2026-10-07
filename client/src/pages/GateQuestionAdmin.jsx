import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Database, ListChecks, ShieldCheck, Upload } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

const SAMPLE = JSON.stringify([
  {
    subjectId: 'algorithms',
    topicId: 'algo-analysis',
    examYear: 'GATE 2024',
    questionType: 'MCQ',
    marks: 2,
    questionHtml: '<p>What is the worst-case time complexity of quicksort?</p>',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    correctAnswer: 'O(n^2)',
    explanationHtml: '<p>Sorted input with a poor pivot degrades to quadratic time.</p>'
  }
], null, 2);

export default function GateQuestionAdmin() {
  const { user } = useContext(AuthContext);

  const [subjects, setSubjects] = useState([]);
  const [raw, setRaw] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [fillMissing, setFillMissing] = useState(false);
  const [fillSubject, setFillSubject] = useState('');
  const [fillTopic, setFillTopic] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return;
    api.get('/gate/catalog')
      .then((res) => setSubjects(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSubjects([]));
  }, [isAdmin]);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === fillSubject),
    [subjects, fillSubject]
  );

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRaw(String(reader.result || ''));
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImport = async () => {
    setError('');
    setReport(null);
    let questions;
    try {
      questions = JSON.parse(raw);
    } catch {
      setError('The text is not valid JSON — fix it and try again.');
      return;
    }
    if (!Array.isArray(questions)) {
      setError('The JSON must be an array of question objects.');
      return;
    }
    if (fillMissing) {
      questions = questions.map((q) => ({
        ...q,
        subjectId: q.subjectId || fillSubject,
        topicId: q.topicId || fillTopic
      }));
    }
    setBusy(true);
    try {
      const res = await api.post('/gate/questions/import', { questions });
      setReport(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Import failed — is the server running?');
    } finally {
      setBusy(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto mt-16 glass-card p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Admins only</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          You need an admin account to import GATE questions.
        </p>
        <Link to="/" className="btn-primary inline-block mt-5 text-xs px-4 py-2">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      <header className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
          <Upload size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">GATE question import</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Paste or drop a JSON array of questions — imports are idempotent (re-uploading a fixed file updates, never duplicates).
          </p>
        </div>
      </header>

      <section className="glass-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ListChecks size={16} className="text-indigo-600" /> Question JSON
          </h2>
          <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">
            Load from .json file
            <input type="file" accept=".json,application/json" onChange={handleFile} className="hidden" />
          </label>
        </div>

        <textarea
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          rows={12}
          spellCheck={false}
          placeholder={SAMPLE}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={fillMissing} onChange={(e) => setFillMissing(e.target.checked)} />
            Fill missing subject/topic with:
          </label>
          <select
            value={fillSubject}
            onChange={(e) => { setFillSubject(e.target.value); setFillTopic(''); }}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5"
          >
            <option value="">Select subject…</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
          <select
            value={fillTopic}
            onChange={(e) => setFillTopic(e.target.value)}
            disabled={!selectedSubject}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 disabled:opacity-50"
          >
            <option value="">Select topic…</option>
            {(selectedSubject?.topics || []).map((topic) => (
              <option key={topic.id} value={topic.id}>{topic.name}</option>
            ))}
          </select>
          <button
            onClick={handleImport}
            disabled={busy || !raw.trim()}
            className="ml-auto btn-primary px-5 py-2 text-xs font-bold disabled:opacity-50"
          >
            {busy ? 'Importing…' : 'Import questions'}
          </button>
        </div>

        {error && (
          <p className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <AlertTriangle size={14} /> {error}
          </p>
        )}
      </section>

      {report && (
        <section className="glass-card p-5 sm:p-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Import report</h2>
          <div className="flex flex-wrap gap-3 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{report.total} received</span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">{report.inserted} inserted</span>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">{report.updated} updated</span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">{report.rejected.length} rejected</span>
          </div>
          {report.rejected.length > 0 && (
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {report.rejected.map((item) => (
                <li key={item.row} className="flex gap-2">
                  <span className="font-bold text-rose-500">Row {item.row}:</span> {item.reason}
                </li>
              ))}
            </ul>
          )}
          {report.updated === 0 && report.inserted === 0 && report.rejected.length === 0 && (
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 size={14} /> Everything was already up to date.
            </p>
          )}
        </section>
      )}

      <section className="glass-card p-5 sm:p-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Database size={16} className="text-indigo-600" /> Valid subject & topic IDs
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {subjects.map((subject) => (
            <details key={subject.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
              <summary className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                {subject.name} <span className="text-slate-400 font-mono">{subject.id}</span>
              </summary>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                {subject.topics.map((topic) => (
                  <li key={topic.id} className="font-mono">{topic.id} — {topic.name}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
