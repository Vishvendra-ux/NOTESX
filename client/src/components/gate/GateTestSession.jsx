import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock3, LoaderCircle, Send, XCircle } from 'lucide-react';
import { testService } from '../../services/api';

const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

export default function GateTestSession({ test, onExit }) {
  const questions = test.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState((test.duration || 20) * 60);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);
  const submitLock = useRef(false);
  const question = questions[currentIndex];
  const resultByQuestion = useMemo(() => new Map((result?.results || []).map((item) => [item.questionId, item])), [result]);

  const submit = useCallback(async () => {
    if (submitLock.current || result) return;
    submitLock.current = true;
    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await testService.submit(test._id, { answers });
      setResult(response.data);
    } catch (error) {
      submitLock.current = false;
      setSubmitError(error.response?.data?.message || 'Your answers could not be submitted. Try again.');
    } finally {
      setSubmitting(false);
    }
  }, [answers, result, test._id]);

  useEffect(() => {
    if (result || submitting || submitError) return undefined;
    const timer = window.setInterval(() => setRemainingSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [result, submitError, submitting]);

  useEffect(() => {
    if (remainingSeconds <= 0 && !result && !submitting && !submitError) submit();
  }, [remainingSeconds, result, submit, submitError, submitting]);

  const selectAnswer = (questionId, optionIndex) => setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
  const answeredCount = Object.keys(answers).length;
  const currentResult = question ? resultByQuestion.get(question._id) : null;

  return (
    <section className="glass-card relative mt-6 overflow-hidden p-5 sm:p-7" aria-label="Custom GATE test">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-700">
        <div><p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{result ? 'Test submitted' : 'Custom practice test'}</p><h2 className="mt-1 text-2xl font-black">{test.title}</h2><p className="mt-1 text-sm text-slate-500">{test.description}</p></div>
        <div className="flex items-center gap-3"><div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 font-mono text-lg font-black ${remainingSeconds < 60 && !result ? 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'}`}><Clock3 size={17} />{formatTime(remainingSeconds)}</div><button type="button" onClick={onExit} aria-label="Close test" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"><XCircle size={19} /></button></div>
      </div>

      {result && <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-950/30"><div><p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Score: {result.score} / {result.totalMarks}</p><p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">{result.correctCount} correct · {result.attemptedCount} answered · {result.accuracy}% accuracy</p></div><button type="button" onClick={onExit} className="btn-primary px-4 py-2">Finish review</button></div>}

      {question ? <>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold text-slate-500">Question {currentIndex + 1} of {questions.length} <span className="mx-1 text-slate-300">·</span> {question.marks || 1} mark{question.marks === 1 ? '' : 's'}</p><p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">{answeredCount}/{questions.length} answered</p></div>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-700 dark:bg-slate-900"><div className="mb-3 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500"><span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{question.topic || 'GATE CS'}</span>{question.difficulty && <span className="rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">{question.difficulty}</span>}{question.negativeMarks > 0 && <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300">−{question.negativeMarks} for a wrong answer</span>}</div><p className="whitespace-pre-wrap text-base font-semibold leading-7 text-slate-900 dark:text-white">{question.questionText}</p>
          <div className="mt-5 space-y-2.5">{(question.options || []).map((option, optionIndex) => {
            const selected = answers[question._id] === optionIndex;
            const isCorrect = currentResult?.correctAnswer === optionIndex;
            const isWrongSelection = currentResult && selected && !currentResult.isCorrect;
            const optionStyle = currentResult
              ? isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100' : isWrongSelection ? 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100' : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
              : selected ? 'border-indigo-300 bg-indigo-50 text-indigo-900 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-100' : 'border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-400/30';
            return <button key={`${question._id}-${optionIndex}`} type="button" disabled={Boolean(result) || submitting} onClick={() => selectAnswer(question._id, optionIndex)} aria-pressed={selected} className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${optionStyle}`}><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold ${selected ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-300 text-slate-500 dark:border-slate-600'}`}>{String.fromCharCode(65 + optionIndex)}</span><span className="pt-0.5">{option}</span>{currentResult && isCorrect && <CheckCircle2 size={17} className="ml-auto shrink-0 text-emerald-600" />}</button>;
          })}</div>
          {currentResult?.explanation && <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><strong className="text-slate-800 dark:text-white">Explanation: </strong>{currentResult.explanation}</div>}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} disabled={currentIndex === 0} className="btn-secondary gap-2 px-4 py-2.5 disabled:opacity-40"><ArrowLeft size={15} />Previous</button>
          <div className="flex flex-wrap justify-center gap-1.5">{questions.map((item, index) => <button key={item._id} type="button" aria-label={`Go to question ${index + 1}`} onClick={() => setCurrentIndex(index)} className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold transition ${currentIndex === index ? 'bg-indigo-600 text-white' : answers[item._id] !== undefined ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-400/20 dark:text-indigo-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>{index + 1}</button>)}</div>
          {currentIndex < questions.length - 1 ? <button type="button" onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))} className="btn-secondary gap-2 px-4 py-2.5">Next<ArrowRight size={15} /></button> : result ? <button type="button" onClick={onExit} className="btn-primary px-4 py-2.5">Finish test</button> : <button type="button" onClick={submit} disabled={submitting} className="btn-primary gap-2 px-4 py-2.5 disabled:opacity-60">{submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={15} />}Submit test</button>}
        </div>
      </> : <p className="mt-6 text-sm text-slate-500">This test has no questions.</p>}

      {submitError && <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-400/20 dark:bg-rose-950/30 dark:text-rose-200"><span className="flex items-center gap-2"><AlertCircle size={16} />{submitError}</span><button type="button" onClick={submit} className="font-bold underline underline-offset-2">Retry submit</button></div>}
    </section>
  );
}
