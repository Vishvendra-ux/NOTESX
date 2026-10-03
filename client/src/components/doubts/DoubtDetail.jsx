import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ChevronUp, ChevronDown, Check, Bookmark, Share2,
  Trash2, MessageSquare, Send, Sparkles, AlertCircle, Eye,
  Tag, Clock, User, CheckCircle2, Bold, Italic, Code, List, Quote,
  Edit3, HelpCircle, Layers, CheckCircle
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { doubtService } from '../../services/api';
import MarkdownRenderer from './MarkdownRenderer';

export default function DoubtDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [doubt, setDoubt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Option reveal state
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // New Answer State
  const [answerContent, setAnswerContent] = useState('');
  const [answerTab, setAnswerTab] = useState('write'); // 'write' | 'preview'
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState('');

  // Comment input state { [targetId]: commentText }
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentBox, setActiveCommentBox] = useState(null); // 'doubt' or answerId
  const [submittingComment, setSubmittingComment] = useState(false);

  // Copy link status
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchDoubtData();
  }, [id]);

  const fetchDoubtData = async () => {
    try {
      setLoading(true);
      setError('');
      const [doubtRes, answersRes] = await Promise.all([
        doubtService.get(id),
        doubtService.getAnswers(id)
      ]);
      setDoubt(doubtRes.data);
      setAnswers(answersRes.data || []);
    } catch (err) {
      console.error('Error fetching question:', err);
      setError(err.response?.data?.message || 'Failed to load doubt details. It may have been removed.');
    } finally {
      setLoading(false);
    }
  };

  // Upvote / Downvote Question
  const handleVoteQuestion = async (type) => {
    if (!user) {
      alert('Please log in to vote on questions.');
      return;
    }
    try {
      const res = type === 'up' 
        ? await doubtService.upvote(doubt._id)
        : await doubtService.downvote(doubt._id);
      
      setDoubt(prev => ({
        ...prev,
        upvotes: res.data.upvotes,
        downvotes: res.data.downvotes,
        netVotes: res.data.netVotes,
        hasUpvoted: res.data.hasUpvoted,
        hasDownvoted: res.data.hasDownvoted
      }));
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    if (!user) {
      alert('Please log in to bookmark questions.');
      return;
    }
    try {
      const res = await doubtService.toggleBookmark(doubt._id);
      setDoubt(prev => ({
        ...prev,
        isBookmarked: res.data.isBookmarked
      }));
    } catch (err) {
      console.error('Bookmark failed:', err);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async () => {
    if (!window.confirm('Are you sure you want to delete this question? This cannot be undone.')) return;
    try {
      await doubtService.delete(doubt._id);
      navigate('/doubts');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete question.');
    }
  };

  // Upvote / Downvote Answer
  const handleVoteAnswer = async (answerId, type) => {
    if (!user) {
      alert('Please log in to vote on answers.');
      return;
    }
    try {
      const res = type === 'up'
        ? await doubtService.upvoteAnswer(answerId)
        : await doubtService.downvoteAnswer(answerId);

      setAnswers(prev => prev.map(ans => {
        if (ans._id === answerId) {
          return {
            ...ans,
            upvotes: res.data.upvotes,
            downvotes: res.data.downvotes,
            netVotes: res.data.netVotes,
            hasUpvoted: res.data.hasUpvoted,
            hasDownvoted: res.data.hasDownvoted
          };
        }
        return ans;
      }));
    } catch (err) {
      console.error('Answer vote failed:', err);
    }
  };

  // Accept Best Answer (Asker or Admin only)
  const handleAcceptAnswer = async (answerId) => {
    try {
      const res = await doubtService.acceptAnswer(doubt._id, answerId);
      const isAccepted = res.data.isAccepted;

      // Update answers acceptance status
      setAnswers(prev => prev.map(ans => ({
        ...ans,
        isAccepted: ans._id === answerId ? isAccepted : false
      })));

      setDoubt(prev => ({
        ...prev,
        hasAcceptedAnswer: isAccepted,
        status: isAccepted ? 'resolved' : 'open'
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Only question author can accept solutions.');
    }
  };

  // Delete Answer
  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure you want to delete your answer?')) return;
    try {
      await doubtService.deleteAnswer(answerId);
      setAnswers(prev => prev.filter(a => a._id !== answerId));
      setDoubt(prev => ({
        ...prev,
        answersCount: Math.max(0, (prev.answersCount || 1) - 1)
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete answer.');
    }
  };

  // Submit New Answer
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to write an answer.');
      return;
    }
    if (!answerContent.trim()) {
      setAnswerError('Answer content cannot be empty.');
      return;
    }

    setSubmittingAnswer(true);
    setAnswerError('');

    try {
      const res = await doubtService.createAnswer(doubt._id, {
        content: answerContent.trim()
      });

      setAnswers(prev => [...prev, res.data]);
      setAnswerContent('');
      setAnswerTab('write');
      setDoubt(prev => ({
        ...prev,
        answersCount: (prev.answersCount || 0) + 1
      }));
    } catch (err) {
      setAnswerError(err.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Submit Comment (either for Question or Answer)
  const handleSubmitComment = async (onModel, parentId) => {
    const text = commentInputs[parentId]?.trim();
    if (!text) return;
    if (!user) {
      alert('Please log in to post comments.');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await doubtService.createComment({
        content: text,
        onModel,
        parentId
      });

      if (onModel === 'Doubt') {
        setDoubt(prev => ({
          ...prev,
          comments: [...(prev.comments || []), res.data]
        }));
      } else if (onModel === 'Answer') {
        setAnswers(prev => prev.map(ans => {
          if (ans._id === parentId) {
            return {
              ...ans,
              comments: [...(ans.comments || []), res.data]
            };
          }
          return ans;
        }));
      }

      setCommentInputs(prev => ({ ...prev, [parentId]: '' }));
      setActiveCommentBox(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Share Question Link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format insertion in Answer box
  const insertAnswerFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('answer-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = answerContent.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newText = answerContent.substring(0, start) + replacement + answerContent.substring(end);
    setAnswerContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading GATE question and explanations...</p>
      </div>
    );
  }

  if (error || !doubt) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center px-4">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Question Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'This doubt could not be located.'}</p>
        <Link to="/doubts" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Doubt Community
        </Link>
      </div>
    );
  }

  const isAsker = user && (doubt.askerId?._id === user._id || doubt.askerId === user._id);
  const isAdmin = user && user.role === 'admin';
  const netVotes = doubt.netVotes ?? ((doubt.upvotes || 0) - (doubt.downvotes || 0));

  return (
    <div className="animate-fade-in pb-16">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
          <Link
            to="/doubts"
            className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft size={16} />
            <span>Doubts</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[200px] sm:max-w-xs">
            {doubt.subjectName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied!' : 'Share Question'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              doubt.isBookmarked
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-700 dark:text-amber-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark size={14} className={doubt.isBookmarked ? 'fill-amber-500 text-amber-500' : ''} />
            <span>{doubt.isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>

          {(isAsker || isAdmin) && (
            <button
              type="button"
              onClick={handleDeleteQuestion}
              className="p-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40 transition cursor-pointer"
              title="Delete Question"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left 3 Cols: Question & Answers */}
        <div className="lg:col-span-3 space-y-8">
          {/* Main Question Container */}
          <div className="glass-card p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 relative">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {doubt.examCategory && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80">
                  {doubt.examCategory} {doubt.examYear && `• ${doubt.examYear}`}
                </span>
              )}

              {doubt.subjectName && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {doubt.subjectName}
                </span>
              )}

              {doubt.questionType && doubt.questionType !== 'General' && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60">
                  {doubt.questionType} {doubt.marks ? `(${doubt.marks}M)` : ''}
                </span>
              )}

              {doubt.hasAcceptedAnswer ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <Check size={12} strokeWidth={3} /> Solved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                  Open
                </span>
              )}
            </div>

            {/* Question Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-5">
              {doubt.title}
            </h1>

            {/* Question Body + Vote Column Layout */}
            <div className="flex gap-4 sm:gap-6">
              {/* Voting Column */}
              <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                <button
                  type="button"
                  onClick={() => handleVoteQuestion('up')}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    doubt.hasUpvoted
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 font-bold'
                      : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={doubt.hasUpvoted ? 'Remove upvote' : 'Upvote question'}
                >
                  <ChevronUp size={24} className={doubt.hasUpvoted ? 'stroke-[3px]' : ''} />
                </button>

                <span className={`text-base font-black ${
                  netVotes > 0
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : netVotes < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {netVotes}
                </span>

                <button
                  type="button"
                  onClick={() => handleVoteQuestion('down')}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    doubt.hasDownvoted
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 font-bold'
                      : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={doubt.hasDownvoted ? 'Remove downvote' : 'Downvote question'}
                >
                  <ChevronDown size={24} className={doubt.hasDownvoted ? 'stroke-[3px]' : ''} />
                </button>
              </div>

              {/* Question Markdown & Options */}
              <div className="flex-1 min-w-0">
                <MarkdownRenderer content={doubt.description} className="text-slate-800 dark:text-slate-200" />

                {/* Multiple Choice Options (GATE Style) */}
                {doubt.options && doubt.options.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                      Options:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {doubt.options.map((opt) => {
                        const isCorrectKey = showAnswerKey && doubt.correctOption && (
                          doubt.correctOption.toUpperCase() === opt.label.toUpperCase() ||
                          doubt.correctOption.toUpperCase().includes(opt.label.toUpperCase())
                        );

                        return (
                          <div
                            key={opt.label}
                            className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                              isCorrectKey
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold'
                                : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                              isCorrectKey
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                            }`}>
                              {opt.label}
                            </span>
                            <span className="text-xs sm:text-sm leading-relaxed flex-1">
                              {opt.text}
                            </span>
                            {isCorrectKey && (
                              <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Official Answer Key Toggle */}
                    {doubt.correctOption && (
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAnswerKey(!showAnswerKey)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition cursor-pointer"
                        >
                          {showAnswerKey ? 'Hide Official Answer Key' : 'Reveal Official Answer Key'}
                        </button>
                        {showAnswerKey && (
                          <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                            Key: Option ({doubt.correctOption})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tags List */}
                {doubt.tags && doubt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-6">
                    {doubt.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/doubts?tag=${tag}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition"
                      >
                        <Tag size={11} className="opacity-60" />
                        <span>{tag}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Asker Card Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      {doubt.askerId?.name ? doubt.askerId.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <b className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {doubt.askerId?.name || 'Anonymous Student'}
                        </b>
                        {doubt.askerId?.reputation !== undefined && (
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-100 dark:border-indigo-900/60">
                            {doubt.askerId.reputation} XP
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        {doubt.askerId?.collegeName && `${doubt.askerId.collegeName} • `}
                        Asked on {new Date(doubt.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveCommentBox(activeCommentBox === 'doubt' ? null : 'doubt')}
                    className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>Add Comment / Clarification</span>
                  </button>
                </div>

                {/* Question Threaded Comments */}
                <div className="mt-4 pt-3 border-t border-slate-100/80 dark:border-slate-800/80 space-y-2">
                  {doubt.comments?.map((c) => (
                    <div key={c._id} className="text-xs text-slate-600 dark:text-slate-300 pl-3 border-l-2 border-slate-200 dark:border-slate-700 py-1">
                      <span>{c.content}</span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        — <b className="text-slate-700 dark:text-slate-300 font-semibold">{c.authorId?.name || 'Student'}</b>{' '}
                        {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}

                  {/* Comment Input */}
                  {activeCommentBox === 'doubt' && (
                    <div className="flex gap-2 pt-2 animate-fade-in">
                      <input
                        type="text"
                        placeholder="Add a concise clarification or question comment..."
                        className="flex-1 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs font-medium outline-none focus:border-indigo-600"
                        value={commentInputs['doubt'] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, doubt: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSubmitComment('Doubt', doubt._id);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSubmitComment('Doubt', doubt._id)}
                        disabled={submittingComment || !commentInputs['doubt']?.trim()}
                        className="btn-primary h-9 px-3.5 text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
                </h2>
                {doubt.hasAcceptedAnswer && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
                    Solved
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  document.getElementById('answer')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 size={12} />
                Write Answer
              </button>
            </div>

            {/* Answer Cards List */}
            {answers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  No solutions posted yet for this question.
                </p>
                <p className="text-xs text-slate-400">
                  Know how to solve this? Write the first step-by-step solution below and earn reputation!
                </p>
              </div>
            ) : (
              answers.map((ans) => {
                const isAnswerer = user && (ans.answererId?._id === user._id || ans.answererId === user._id);
                const ansNetVotes = ans.netVotes ?? ((ans.upvotes || 0) - (ans.downvotes || 0));

                return (
                  <div
                    key={ans._id}
                    className={`glass-card p-5 sm:p-6 transition-all relative ${
                      ans.isAccepted
                        ? 'border-2 border-emerald-500/80 bg-emerald-50/10 dark:bg-emerald-950/20 shadow-md'
                        : 'border border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    {/* Top Accepted Banner */}
                    {ans.isAccepted && (
                      <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 px-5 py-2.5 rounded-t-xl mb-4 border-b border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Accepted Solution — Verified by Question Asker</span>
                      </div>
                    )}

                    <div className="flex gap-4 sm:gap-6">
                      {/* Voting Column + Accept Checkmark */}
                      <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                        <button
                          type="button"
                          onClick={() => handleVoteAnswer(ans._id, 'up')}
                          className={`p-1.5 rounded-xl transition cursor-pointer ${
                            ans.hasUpvoted
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 font-bold'
                              : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={ans.hasUpvoted ? 'Remove upvote' : 'Upvote answer'}
                        >
                          <ChevronUp size={22} className={ans.hasUpvoted ? 'stroke-[3px]' : ''} />
                        </button>

                        <span className={`text-sm font-black ${
                          ansNetVotes > 0
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : ansNetVotes < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {ansNetVotes}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleVoteAnswer(ans._id, 'down')}
                          className={`p-1.5 rounded-xl transition cursor-pointer ${
                            ans.hasDownvoted
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 font-bold'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={ans.hasDownvoted ? 'Remove downvote' : 'Downvote answer'}
                        >
                          <ChevronDown size={22} className={ans.hasDownvoted ? 'stroke-[3px]' : ''} />
                        </button>

                        {/* Accept Button for Question Asker */}
                        {(isAsker || isAdmin) && (
                          <button
                            type="button"
                            onClick={() => handleAcceptAnswer(ans._id)}
                            className={`mt-2 p-2 rounded-xl transition cursor-pointer ${
                              ans.isAccepted
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                            title={ans.isAccepted ? 'Click to unaccept' : 'Accept this solution as correct'}
                          >
                            <Check size={18} strokeWidth={3} />
                          </button>
                        )}
                      </div>

                      {/* Answer Body */}
                      <div className="flex-1 min-w-0">
                        <MarkdownRenderer content={ans.content} />

                        {/* Answer Footer Info */}
                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                              {ans.answererId?.name ? ans.answererId.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <b className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                  {ans.answererId?.name || 'Anonymous Contributor'}
                                </b>
                                {ans.answererId?.reputation !== undefined && (
                                  <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-100 dark:border-emerald-900/60">
                                    {ans.answererId.reputation} XP
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block">
                                Answered on {new Date(ans.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setActiveCommentBox(activeCommentBox === ans._id ? null : ans._id)}
                              className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
                            >
                              <MessageSquare size={13} />
                              <span>Comment</span>
                            </button>

                            {(isAnswerer || isAdmin) && (
                              <button
                                type="button"
                                onClick={() => handleDeleteAnswer(ans._id)}
                                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Answer Comments Thread */}
                        <div className="mt-4 pt-3 border-t border-slate-100/80 dark:border-slate-800/80 space-y-2">
                          {ans.comments?.map((c) => (
                            <div key={c._id} className="text-xs text-slate-600 dark:text-slate-300 pl-3 border-l-2 border-slate-200 dark:border-slate-700 py-1">
                              <span>{c.content}</span>
                              <span className="text-[11px] text-slate-400 ml-2">
                                — <b className="text-slate-700 dark:text-slate-300 font-semibold">{c.authorId?.name || 'Student'}</b>{' '}
                                {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          ))}

                          {activeCommentBox === ans._id && (
                            <div className="flex gap-2 pt-2 animate-fade-in">
                              <input
                                type="text"
                                placeholder="Add a comment to this answer..."
                                className="flex-1 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs font-medium outline-none focus:border-indigo-600"
                                value={commentInputs[ans._id] || ''}
                                onChange={(e) => setCommentInputs({ ...commentInputs, [ans._id]: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSubmitComment('Answer', ans._id);
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleSubmitComment('Answer', ans._id)}
                                disabled={submittingComment || !commentInputs[ans._id]?.trim()}
                                className="btn-primary h-9 px-3.5 text-xs font-bold cursor-pointer disabled:opacity-50"
                              >
                                <Send size={13} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Your Answer Composer (GATE Overflow style) */}
          <div id="answer" className="glass-card p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 scroll-mt-24">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
              <Edit3 size={18} className="text-indigo-600" />
              Your Solution / Answer
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Write a complete, structured solution. Use markdown, code blocks, or formulas (`$...$`) where necessary.
            </p>

            {answerError && (
              <div className="p-3 mb-4 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700">
                {answerError}
              </div>
            )}

            <form onSubmit={handleSubmitAnswer}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Answer Explanation</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setAnswerTab('write')}
                    className={`px-3 py-1 rounded-md transition cursor-pointer ${
                      answerTab === 'write' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswerTab('preview')}
                    className={`px-3 py-1 rounded-md transition cursor-pointer ${
                      answerTab === 'preview' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {answerTab === 'write' ? (
                <div>
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-xl border border-b-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                    <button
                      type="button"
                      onClick={() => insertAnswerFormatting('**', '**')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title="Bold"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAnswerFormatting('*', '*')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title="Italic"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAnswerFormatting('`', '`')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title="Inline code"
                    >
                      <Code size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAnswerFormatting('$', '$')}
                      className="px-2 py-1 rounded-lg text-xs font-mono font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400"
                      title="Math formula"
                    >
                      $x$
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAnswerFormatting('\n```c\n', '\n```\n')}
                      className="px-2 py-1 rounded-lg text-xs font-mono font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600"
                      title="Code block"
                    >
                      &lt;/&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAnswerFormatting('- ')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title="Bullet list"
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertAnswerFormatting('> ')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      title="Quote"
                    >
                      <Quote size={14} />
                    </button>
                  </div>

                  <textarea
                    id="answer-textarea"
                    rows={7}
                    className="w-full rounded-b-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-3.5 text-xs sm:text-sm font-normal text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none leading-relaxed"
                    placeholder="Provide your step-by-step mathematical derivation, algorithm trace, or explanation here..."
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                  />
                </div>
              ) : (
                <div className="min-h-[160px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 mb-4">
                  {answerContent.trim() ? (
                    <MarkdownRenderer content={answerContent} />
                  ) : (
                    <p className="text-xs text-slate-400 italic">No answer content written yet.</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 mt-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  Accepted solutions earn +15 reputation points.
                </span>

                <button
                  type="submit"
                  disabled={submittingAnswer || !answerContent.trim()}
                  className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submittingAnswer ? (
                    <span>Submitting Solution...</span>
                  ) : (
                    <>
                      <span>Post Your Answer</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Question Meta & Related Questions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Question Stats Card */}
          <div className="glass-card p-5 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3.5 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-600" />
              Question Meta
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Asked</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {new Date(doubt.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Viewed</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {doubt.views || 0} times
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Net Votes</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {netVotes}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status</span>
                <span className={`font-bold ${doubt.hasAcceptedAnswer ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300'}`}>
                  {doubt.hasAcceptedAnswer ? 'Solved' : 'Open for Answers'}
                </span>
              </div>
            </div>
          </div>

          {/* Related Questions */}
          {doubt.related && doubt.related.length > 0 && (
            <div className="glass-card p-5 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3.5 flex items-center gap-2">
                <Layers size={14} className="text-indigo-600" />
                Related Questions
              </h3>

              <div className="space-y-3">
                {doubt.related.map((rq) => (
                  <Link
                    key={rq._id}
                    to={`/doubts/${rq._id}`}
                    className="block group p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                  >
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 leading-snug mb-1">
                      {rq.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {rq.upvotes || 0} votes
                      </span>
                      <span>•</span>
                      <span className={rq.hasAcceptedAnswer ? 'text-emerald-600 font-bold' : ''}>
                        {rq.answersCount || 0} answers
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ask Question Card */}
          <div className="glass-card p-5 border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-indigo-50/50 to-blue-50/30 dark:from-slate-900 dark:to-slate-850">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1.5">
              Have another question?
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Post your doubt to get answers from GATE toppers and peer engineering students.
            </p>
            <Link
              to="/doubts"
              className="btn-primary w-full py-2.5 text-xs font-bold text-center block shadow-xs"
            >
              Browse All Doubts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
