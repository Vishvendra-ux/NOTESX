import React, { useState } from 'react';
import { gatePyqs } from '../../data/gatePyqs';
import { CheckCircle2, XCircle, ArrowLeft, Lightbulb, FileQuestion } from 'lucide-react';

export default function GatePyqViewer({ subjectId, topicId, topicTitle, onBack }) {
  const pyqs = gatePyqs.filter(q => q.subjectId === subjectId && (!topicId || q.topicId === topicId));
  const storageKey = `gate_pyq_answers_${subjectId}_${topicId || 'all'}`;
  
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });
  const [showExplanation, setShowExplanation] = useState({});

  const handleSelectOption = (qId, option) => {
    const updated = { ...selectedAnswers, [qId]: option };
    setSelectedAnswers(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    // Save a global resume state
    localStorage.setItem('gate_pyq_resume', JSON.stringify({ subjectId, topicId, topicTitle, qId }));
  };

  const toggleExplanation = (qId) => {
    setShowExplanation(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  if (pyqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <FileQuestion size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No PYQs Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          We are continuously updating our database. PYQs for "{topicTitle}" will be added soon!
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
          <h2 className="text-xl font-black text-slate-900 dark:text-white">GATE PYQs: {topicTitle}</h2>
          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{pyqs.length} Questions Available</p>
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto pb-6">
        {pyqs.map((q, index) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
          const showExp = showExplanation[q.id];

          return (
            <div key={q.id} className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg">
                  Q{index + 1}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  GATE {q.year} · {q.marks} Mark{q.marks > 1 ? 's' : ''}
                </span>
              </div>
              
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-5 leading-relaxed">
                {q.question}
              </p>

              <div className="space-y-2.5 mb-4">
                {q.options.map((opt, i) => {
                  const isSelected = selectedAnswers[q.id] === opt;
                  let optStyle = "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50";
                  
                  if (isAnswered) {
                    if (opt === q.correctAnswer) {
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
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center justify-between ${optStyle} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && opt === q.correctAnswer && <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      {isAnswered && isSelected && opt !== q.correctAnswer && <XCircle size={18} className="text-rose-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={() => toggleExplanation(q.id)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:underline"
                  >
                    <Lightbulb size={14} />
                    {showExp ? "Hide Explanation" : "View Explanation"}
                  </button>
                  
                  {showExp && (
                    <div className="mt-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl">
                      <p className="text-xs leading-relaxed text-indigo-900 dark:text-indigo-200">
                        <span className="font-bold">Correct Answer:</span> {q.correctAnswer}
                      </p>
                      <p className="text-xs leading-relaxed text-indigo-800 dark:text-indigo-300 mt-2">
                        {q.explanation}
                      </p>
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
