import { useState } from 'react';
import { X, Sparkles, Code, Bold, Italic, List, Quote, Eye, Edit3, ArrowRight, Loader2 } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

const SUBJECT_OPTIONS = [
  'Operating Systems',
  'Algorithms',
  'Data Structures',
  'Theory of Computation',
  'Database Management Systems',
  'Computer Networks',
  'Computer Organization',
  'Digital Logic',
  'Compiler Design',
  'Engineering Mathematics',
  'Discrete Mathematics',
  'General Aptitude',
  'Object Oriented Programming',
  'Software Engineering'
];

const EXAM_CATEGORIES = [
  'GATE CSE',
  'GATE DA',
  'College / Semester',
  'ISRO / BARC',
  'Practice / General',
  'Coding / Placement'
];

export default function AskDoubtModal({ isOpen, onClose, onSubmitSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectName, setSubjectName] = useState('Operating Systems');
  const [examCategory, setExamCategory] = useState('GATE CSE');
  const [examYear, setExamYear] = useState('GATE 2024');
  const [questionType, setQuestionType] = useState('MCQ');
  const [marks, setMarks] = useState(2);
  const [tagsInput, setTagsInput] = useState('operating-systems, gate-pyq');
  
  // MCQ options
  const [options, setOptions] = useState([
    { label: 'A', text: '' },
    { label: 'B', text: '' },
    { label: 'C', text: '' },
    { label: 'D', text: '' },
  ]);
  const [correctOption, setCorrectOption] = useState('');

  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleOptionChange = (idx, value) => {
    const updated = [...options];
    updated[idx].text = value;
    setOptions(updated);
  };

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('doubt-description-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newText = description.substring(0, start) + replacement + description.substring(end);
    setDescription(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both question title and description.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const formattedTags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        subjectName,
        examCategory,
        examYear: examYear.trim(),
        questionType,
        marks: Number(marks) || 2,
        tags: formattedTags,
        options: questionType === 'MCQ' || questionType === 'MSQ' ? options.filter(o => o.text.trim()) : [],
        correctOption: correctOption.trim()
      };

      await onSubmitSuccess(payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post question. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl my-8 overflow-hidden animate-slide-up relative flex flex-col max-h-[90vh]">
        {/* Top Accent Strip */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Ask a Doubt / Post a Question
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Get step-by-step explanations, solutions, and community reviews.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 animate-fade-in">
              {error}
            </div>
          )}

          {/* Question Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Question Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-4 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition outline-none"
              placeholder="e.g. GATE CSE 2021 | Number of page faults with LRU replacement in 4 frames"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Row: Subject & Exam Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject
              </label>
              <select
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-600 outline-none"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
              >
                {SUBJECT_OPTIONS.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Exam Source / Category
              </label>
              <select
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-600 outline-none"
                value={examCategory}
                onChange={e => setExamCategory(e.target.value)}
              >
                {EXAM_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Question Type, Marks, and Exam Year */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Question Type
              </label>
              <select
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-600 outline-none"
                value={questionType}
                onChange={e => setQuestionType(e.target.value)}
              >
                <option value="MCQ">MCQ (Multiple Choice)</option>
                <option value="MSQ">MSQ (Multiple Select)</option>
                <option value="NAT">NAT (Numerical Answer)</option>
                <option value="Descriptive">Descriptive / Proof</option>
                <option value="General">General Doubt</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Marks
              </label>
              <select
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-600 outline-none"
                value={marks}
                onChange={e => setMarks(Number(e.target.value))}
              >
                <option value={1}>1 Mark</option>
                <option value={2}>2 Marks</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Year / Target
              </label>
              <input
                type="text"
                className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:bg-white focus:border-indigo-600 outline-none"
                placeholder="e.g. GATE 2024"
                value={examYear}
                onChange={e => setExamYear(e.target.value)}
              />
            </div>
          </div>

          {/* If MCQ / MSQ: Options Builder */}
          {(questionType === 'MCQ' || questionType === 'MSQ') && (
            <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2.5">
              <span className="block text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                Options & Answer Key
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((opt, idx) => (
                  <div key={opt.label} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {opt.label}
                    </span>
                    <input
                      type="text"
                      className="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-900 dark:text-white outline-none"
                      placeholder={`Option ${opt.label} text`}
                      value={opt.text}
                      onChange={e => handleOptionChange(idx, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Correct Option (Optional):</span>
                <input
                  type="text"
                  className="w-28 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 text-xs font-bold text-indigo-600 outline-none uppercase"
                  placeholder="e.g. B or A,C"
                  value={correctOption}
                  onChange={e => setCorrectOption(e.target.value.toUpperCase())}
                />
              </div>
            </div>
          )}

          {/* Description Editor with Toolbar & Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Question Description & Problem Statement <span className="text-rose-500">*</span>
              </label>

              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition cursor-pointer ${
                    activeTab === 'write' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  <Edit3 size={13} /> Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition cursor-pointer ${
                    activeTab === 'preview' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  <Eye size={13} /> Preview
                </button>
              </div>
            </div>

            {/* Markdown Toolbar */}
            {activeTab === 'write' && (
              <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-xl border border-b-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="Bold"
                >
                  <Bold size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="Italic"
                >
                  <Italic size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('`', '`')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="Inline code"
                >
                  <Code size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n```c\n', '\n```\n')}
                  className="px-2 py-1 rounded-lg text-xs font-mono font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="Code block"
                >
                  &lt;/&gt;
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('$', '$')}
                  className="px-2 py-1 rounded-lg text-xs font-mono font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 transition"
                  title="LaTeX Math Formula"
                >
                  $f(x)$
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="List item"
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ')}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  title="Quote"
                >
                  <Quote size={14} />
                </button>
              </div>
            )}

            {/* Write textarea or Preview container */}
            {activeTab === 'write' ? (
              <textarea
                id="doubt-description-textarea"
                rows={6}
                className="w-full rounded-b-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-3.5 text-xs sm:text-sm font-normal text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none leading-relaxed"
                placeholder="Include full question description, code snippet, constraints, or step you are stuck on..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            ) : (
              <div className="min-h-[160px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                {description.trim() ? (
                  <MarkdownRenderer content={description} />
                ) : (
                  <p className="text-xs text-slate-400 italic">Nothing to preview yet. Switch back to Write mode to compose.</p>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-4 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 outline-none"
              placeholder="e.g. operating-systems, semaphores, gate-2024"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-5 py-2.5 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2.5 text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Posting Question...</span>
                </>
              ) : (
                <>
                  <span>Post Question</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
