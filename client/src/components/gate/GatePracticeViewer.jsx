import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CheckCircle2, XCircle, ArrowLeft, Lightbulb, FileQuestion, RotateCcw } from 'lucide-react';

const readStoredAnswers = (key) => {
  try {
    const saved = window.localStorage.getItem(key);
    const value = saved ? JSON.parse(saved) : {};
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
};

const storeJson = (key, value) => {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Practice still works without browser storage. */ }
};

export default function GatePracticeViewer({ subjectId, topicId, topicTitle, resumeQuestionId, onResumeChange, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const storageKey = `gate_pyq_answers_${subjectId}_${topicId || 'all'}`;

  const [selectedAnswers, setSelectedAnswers] = useState(() => readStoredAnswers(storageKey));
  const [showExplanation, setShowExplanation] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await api.get('/gate/questions', { params: { subjectId, topicId: topicId || 'all' } });
        setQuestions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch GATE questions', err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subjectId, topicId]);

  useEffect(() => { storeJson(storageKey, selectedAnswers); }, [storageKey, selectedAnswers]);

  useEffect(() => {
    if (!resumeQuestionId || loading || questions.length === 0) return;
    window.setTimeout(() => {
      document.getElementById(`gate-pyq-${resumeQuestionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [resumeQuestionId, loading, questions]);

  const handleSelectOption = (qId, option) => {
    setSelectedAnswers((current) => ({ ...current, [qId]: option }));
    const resume = { subjectId, topicId, topicTitle, qId };
    storeJson('gate_pyq_resume', resume);
    onResumeChange?.(resume);
  };

  const retryQuestion = (qId) => {
    setSelectedAnswers((current) => {
      const updated = { ...current };
      delete updated[qId];
      return updated;
    });
    setShowExplanation((current) => ({ ...current, [qId]: false }));
  };

  const toggleExplanation = (qId) => {
    setShowExplanation(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium">Loading previous year questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <FileQuestion size={32} />
        </div>
        <h3 id="gate-pyq-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">No practice questions yet</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          There are no questions for “{topicTitle}” in the current practice set.
        </p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold rounded-xl flex items-center gap-2 transition hover:bg-indigo-100 dark:hover:bg-indigo-900/50">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 id="gate-pyq-title" className="text-xl font-black text-slate-900 dark:text-white">GATE CS practice: {topicTitle}</h2>
          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{questions.length} practice questions · answers save on this device</p>
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto pb-6">
        {questions.map((question, index) => {
          const isAnswered = selectedAnswers[question.id] !== undefined;
          const showExp = showExplanation[question.id];

          return (
            <div id={`gate-pyq-${question.id}`} key={question.id} className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg">
                  Q{index + 1}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  GATE-style practice · {question.marks} Mark{question.marks > 1 ? 's' : ''}
                </span>
              </div>
              
              <div 
                className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-5 leading-relaxed prose dark:prose-invert max-w-none gate-math-content"
                dangerouslySetInnerHTML={{ __html: question.question }}
              />

              <div className="space-y-2.5 mb-4">
                {question.options.map((opt, i) => {
                  const isSelected = selectedAnswers[question.id] === opt;
                  let optStyle = "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50";
                  
                  if (isAnswered) {
                    if (opt === question.correctAnswer) {
                      optStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300";
                    } else if (isSelected) {
                      optStyle = "border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300";
                    } else {
                      optStyle = "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(question.id, opt)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center justify-between ${optStyle} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && opt === question.correctAnswer && <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      {isAnswered && isSelected && opt !== question.correctAnswer && <XCircle size={18} className="text-rose-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={() => toggleExplanation(question.id)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:underline"
                  >
                    <Lightbulb size={14} />
                    {showExp ? 'Hide explanation' : 'View explanation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => retryQuestion(question.id)}
                    className="ml-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
                  >
                    <RotateCcw size={13} /> Try again
                  </button>
                  {showExp && (
                    <div className="mt-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl">
                      <p className="text-xs leading-relaxed text-indigo-900 dark:text-indigo-200">
                        <span className="font-bold">Correct answer:</span> {question.correctAnswer}
                      </p>
                      <div 
                        className="text-xs leading-relaxed text-indigo-800 dark:text-indigo-300 mt-2 prose dark:prose-invert max-w-none gate-math-content"
                        dangerouslySetInnerHTML={{ __html: question.explanation }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
