import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, ArrowLeft, Download, Bookmark, Flag, Star, ThumbsUp, 
  User, CheckCircle2, Award, Calendar, FileText, Send, 
  Layers, ExternalLink, Sparkles, AlertCircle, Globe,
  Copy, Check, HelpCircle, BookOpen, Lightbulb
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { notesService, aiService } from '../../services/api';
import RatingStars from './RatingStars';
import MarkdownRenderer from '../doubts/MarkdownRenderer';

const getEmbedUrl = (url) => {
  if (!url) return null;
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;

  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch) return `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`;

  const docsMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (docsMatch) return `https://docs.google.com/document/d/${docsMatch[1]}/preview`;

  const slidesMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slidesMatch) return `https://docs.google.com/presentation/d/${slidesMatch[1]}/preview`;

  return null;
};

export default function NoteViewerModal({
  noteId,
  initialNote,
  onClose,
  onBookmarkToggle,
  isBookmarked = false,
  onReport
}) {
  const { user } = useContext(AuthContext);
  const [note, setNote] = useState(initialNote || null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userReviewText, setUserReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSort, setReviewSort] = useState('newest');

  // Note-Grounded AI Exam Copilot state
  const [aiResult, setAiResult] = useState('');
  const [aiActiveMode, setAiActiveMode] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [aiQuota, setAiQuota] = useState(null);
  const [aiProvider, setAiProvider] = useState('');
  const [aiCopied, setAiCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Fetch full note details, reviews, related notes
  useEffect(() => {
    let isMounted = true;
    const fetchFullDetails = async () => {
      try {
        setLoading(true);
        const { data } = await notesService.get(noteId);
        if (isMounted && data) {
          setNote(data);
          setReviews(data.reviews || []);
        }
      } catch (err) {
        // Fallback to initial note if API error
        if (isMounted && initialNote) setNote(initialNote);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (noteId) fetchFullDetails();
    return () => { isMounted = false; };
  }, [noteId]);

  if (!note && !loading) return null;

  const author = note?.uploaderId || {};
  const authorName = author.name || note?.author || 'Student Contributor';
  const collegeName = author.collegeName || note?.college || 'Engineering Campus';
  const contributorStats = note?.contributorStats || {
    notesUploaded: 82,
    totalDownloads: 12420,
    averageRating: 4.8,
    badge: 'Top Contributor 🏆'
  };

  const targetLink = note?.externalLink || note?.fileUrl;
  const isCloudLink = Boolean(
    note?.isExternalLink ||
    (note?.externalLink && !note?.fileSize) ||
    note?.fileType === 'drive' ||
    note?.fileType === 'gdoc' ||
    String(targetLink).toLowerCase().includes('drive.google.com') ||
    String(targetLink).toLowerCase().includes('docs.google.com')
  );
  const embedUrl = getEmbedUrl(targetLink);

  const handleDownload = async () => {
    try {
      const { data } = await notesService.download(note._id || note.id);
      const url = data?.downloadUrl || targetLink;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        setNote(prev => ({ ...prev, downloadCount: (prev.downloadCount || 0) + 1 }));
      }
    } catch (err) {
      if (targetLink) window.open(targetLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRunAiCopilot = async (mode, customMessage = '') => {
    if (!user) {
      setAiError('Please log in to use the AI Exam Copilot for this note.');
      return;
    }
    if (mode === 'custom' && !customMessage.trim()) {
      setAiError('Please enter a question about this note.');
      return;
    }

    try {
      setAiLoading(true);
      setAiError('');
      setAiActiveMode(mode);

      const { data } = await aiService.ask({
        mode,
        message: customMessage.trim(),
        noteId: note?._id || note?.id,
        noteContext: {
          title: note?.title,
          subject: note?.subjectId?.name || note?.subject || 'Operating Systems',
          unit: note?.unit || 'Unit 1',
          topic: note?.topic || note?.title,
          description: note?.description,
          tags: note?.tags || []
        }
      });

      setAiResult(data.message || '');
      if (data.provider) setAiProvider(data.provider);
      if (data.quota) setAiQuota(data.quota);
      if (mode === 'custom') setAiCustomPrompt('');
    } catch (err) {
      setAiError(err.response?.data?.message || 'Could not generate AI exam insights right now. Please try again.');
      if (err.response?.data?.quota) setAiQuota(err.response.data.quota);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyAiResult = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setAiCopied(true);
    setTimeout(() => setAiCopied(false), 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please log in to submit a review.');
      return;
    }
    if (!userReviewText.trim()) {
      setReviewError('Please write a brief review.');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError('');
      const { data } = await notesService.addReview(note._id || note.id, {
        rating: userRating,
        review: userReviewText.trim()
      });

      setReviewSuccess('Review successfully submitted!');
      setUserReviewText('');

      // Refresh reviews list
      if (data && data.review) {
        setReviews(prev => [data.review, ...prev.filter(r => r.userId?._id !== user._id)]);
        setNote(prev => ({
          ...prev,
          ratingAverage: data.ratingAverage,
          ratingCount: data.ratingCount
        }));
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpfulVote = async (reviewId) => {
    if (!user) return;
    try {
      const { data } = await notesService.toggleHelpfulReview(note._id || note.id, reviewId);
      setReviews(prev => prev.map(r => (r._id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r)));
    } catch (err) {
      // Ignored
    }
  };

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    if (reviewSort === 'highest') return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/75 p-3 sm:p-6 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden my-auto animate-slide-up flex flex-col max-h-[90vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 bg-white sticky top-0 z-20 shadow-xs">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Subject
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookmarkToggle && onBookmarkToggle(note)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                isBookmarked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:text-rose-600'
              }`}
            >
              <Bookmark size={14} className={isBookmarked ? 'fill-rose-600' : ''} />
              <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>
            <button
              onClick={() => onReport && onReport(note)}
              className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Report Note"
              aria-label="Report Note"
            >
              <Flag size={15} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              title="Close (Esc)"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition flex items-center justify-center cursor-pointer border border-slate-200 hover:border-rose-200 shadow-2xs group"
            >
              <X size={18} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Note Title & Header Metadata */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 border border-indigo-100 text-indigo-700">
                {note?.subjectId?.name || note?.subject || 'Operating Systems'}
              </span>
              {note?.unit && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-50 border border-purple-100 text-purple-700">
                  {note?.unit}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                {note?.year || '3rd Year'} • {note?.semester || 'Semester 5'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-600">
                {isCloudLink ? 'Cloud Link' : `${note?.fileType || 'PDF'} • 2.4 MB`}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {note?.title}
            </h2>

            {/* Quick Stats Bar & Download Button */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-5 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-extrabold">{Number(note?.ratingAverage || 4.8).toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">/ 5 ({note?.ratingCount || 124} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Download size={15} />
                  <span><b>{Number(note?.downloadCount || 1240).toLocaleString()}</b> {isCloudLink ? 'views' : 'downloads'}</span>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold gap-2 w-full sm:w-auto shadow-md shadow-indigo-200"
              >
                {isCloudLink ? <ExternalLink size={16} /> : <Download size={16} />}
                {isCloudLink ? 'Open Public Document' : 'Download File'}
              </button>
            </div>
          </div>

          {/* Embedded Document Preview / Reader Box */}
          {embedUrl ? (
            <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white">
                <span className="flex items-center gap-2 font-bold">
                  <Globe size={15} className="text-blue-400" />
                  Public Cloud Reader (Google Drive / Docs)
                </span>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  Open in New Tab <ExternalLink size={13} />
                </button>
              </div>
              <iframe
                src={embedUrl}
                title={note?.title || 'Note Preview'}
                className="h-[480px] w-full border-0 bg-white"
                allow="autoplay"
              />
            </div>
          ) : (
            <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-900/5 p-4 sm:p-6 text-center">
              <div className="mx-auto max-w-md py-8">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-indigo-600 shadow-md mb-4">
                  {isCloudLink ? <Globe size={32} className="text-blue-600" /> : <FileText size={32} />}
                </div>
                <h4 className="text-base font-bold text-slate-800 mb-1">
                  {isCloudLink ? 'Public Cloud Material Ready' : 'Document Preview Ready'}
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  {isCloudLink 
                    ? 'Shared publicly on Google Drive / Docs with open view access for all students.'
                    : `${note?.title} (${note?.fileType?.toUpperCase() || 'PDF'} document)`}
                </p>
                <button
                  onClick={handleDownload}
                  className="btn-secondary py-2 px-5 text-xs font-semibold gap-1.5 mx-auto"
                >
                  <ExternalLink size={14} /> {isCloudLink ? 'Open Document in New Tab' : 'Open Full Screen Preview'}
                </button>
              </div>
            </div>
          )}

          {/* Note Description & Syllabus Coverage */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Description & Notes Overview</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100">
              {note?.description || 'Comprehensive handwritten study notes covering unit syllabus, core derivations, diagrams, and university previous year exam questions.'}
            </p>
          </div>

          {/* ── Note-Grounded AI Exam Copilot ── */}
          <div className="mb-8 rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/70 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm">
                  <Sparkles size={17} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      AI Exam Copilot for This Note
                    </h3>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                      Gemini Powered
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Instant Hinglish summary, viva Q&amp;A, analogies &amp; 10-mark exam answers grounded in <b>{note?.title}</b>
                  </p>
                </div>
              </div>

              {aiQuota && (
                <span className="self-start sm:self-auto rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600 border border-slate-200 shadow-2xs">
                  {aiQuota.isPro ? '✨ PRO Unlimited' : `⚡ ${aiQuota.remaining}/${aiQuota.limit} Free AI Left Today`}
                </span>
              )}
            </div>

            {/* 1-Click Exam Action Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-4">
              <button
                type="button"
                disabled={aiLoading}
                onClick={() => handleRunAiCopilot('summary')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition text-left cursor-pointer disabled:opacity-60 ${
                  aiActiveMode === 'summary' && aiResult
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white hover:bg-indigo-50/80 text-slate-700 hover:text-indigo-700 border-slate-200/90 hover:border-indigo-300'
                }`}
              >
                <Sparkles size={15} className="shrink-0 text-amber-500" />
                <span>Summarize in Hinglish</span>
              </button>

              <button
                type="button"
                disabled={aiLoading}
                onClick={() => handleRunAiCopilot('viva')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition text-left cursor-pointer disabled:opacity-60 ${
                  aiActiveMode === 'viva' && aiResult
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white hover:bg-indigo-50/80 text-slate-700 hover:text-indigo-700 border-slate-200/90 hover:border-indigo-300'
                }`}
              >
                <HelpCircle size={15} className="shrink-0 text-emerald-500" />
                <span>10 Viva Questions &amp; Ans</span>
              </button>

              <button
                type="button"
                disabled={aiLoading}
                onClick={() => handleRunAiCopilot('analogy')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition text-left cursor-pointer disabled:opacity-60 ${
                  aiActiveMode === 'analogy' && aiResult
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white hover:bg-indigo-50/80 text-slate-700 hover:text-indigo-700 border-slate-200/90 hover:border-indigo-300'
                }`}
              >
                <Lightbulb size={15} className="shrink-0 text-purple-500" />
                <span>Real-Life Analogy</span>
              </button>

              <button
                type="button"
                disabled={aiLoading}
                onClick={() => handleRunAiCopilot('university_questions')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition text-left cursor-pointer disabled:opacity-60 ${
                  aiActiveMode === 'university_questions' && aiResult
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white hover:bg-indigo-50/80 text-slate-700 hover:text-indigo-700 border-slate-200/90 hover:border-indigo-300'
                }`}
              >
                <BookOpen size={15} className="shrink-0 text-blue-500" />
                <span>5 Likely 10-Mark Qs</span>
              </button>
            </div>

            {/* Custom Question Input about this Note */}
            <div className="flex gap-2">
              <input
                type="text"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRunAiCopilot('custom', aiCustomPrompt);
                  }
                }}
                placeholder={`Ask anything about "${note?.title || 'this note'}" (e.g., explain the formula, numerical step)...`}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                disabled={aiLoading || !aiCustomPrompt.trim()}
                onClick={() => handleRunAiCopilot('custom', aiCustomPrompt)}
                className="btn-primary px-4 py-2.5 rounded-2xl text-xs font-bold gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
              >
                <Send size={13} />
                <span>Ask AI</span>
              </button>
            </div>

            {/* Error State */}
            {aiError && (
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                <AlertCircle size={15} className="shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {/* Loading Skeleton */}
            {aiLoading && (
              <div className="mt-4 rounded-2xl bg-white border border-indigo-100 p-4 flex items-center gap-3 text-xs font-bold text-indigo-700 animate-pulse">
                <Sparkles size={16} className="animate-spin text-indigo-600" />
                <span>Generating exam-ready study notes for &ldquo;{note?.title}&rdquo;...</span>
              </div>
            )}

            {/* AI Copilot Result Card */}
            {!aiLoading && aiResult && (
              <div className="mt-4 rounded-2xl bg-white border border-indigo-200/80 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                      ✨ AI Study Output
                    </span>
                    {aiProvider && (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        {aiProvider}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAiResult}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 transition cursor-pointer"
                    >
                      {aiCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{aiCopied ? 'Copied!' : 'Copy Notes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAiResult('');
                        setAiActiveMode('');
                      }}
                      className="rounded-lg bg-slate-100 hover:bg-rose-50 px-2 py-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 transition cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="max-h-[380px] overflow-y-auto pr-1">
                  <MarkdownRenderer content={aiResult} />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {note?.tags && note.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Syllabus Tags</h3>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contributor Profile Card */}
          <div className="mb-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white font-bold text-base shadow-md">
                  {authorName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-slate-900">{authorName}</h4>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                      {contributorStats.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{collegeName} • B.Tech CSE</p>
                </div>
              </div>

              {/* Contributor Stats */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-2 sm:pt-0 border-t sm:border-t-0 border-indigo-100/60 w-full sm:w-auto justify-between sm:justify-end">
                <div>
                  <b className="block text-sm font-extrabold text-slate-900">{contributorStats.notesUploaded}</b>
                  <span className="text-[11px] text-slate-500">Notes Uploaded</span>
                </div>
                <div className="h-6 w-px bg-indigo-200/60" />
                <div>
                  <b className="block text-sm font-extrabold text-slate-900">{contributorStats.totalDownloads.toLocaleString()}</b>
                  <span className="text-[11px] text-slate-500">Downloads</span>
                </div>
                <div className="h-6 w-px bg-indigo-200/60" />
                <div>
                  <b className="block text-sm font-extrabold text-slate-900">⭐ {contributorStats.averageRating}</b>
                  <span className="text-[11px] text-slate-500">Avg Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Reviews & Ratings Section ── */}
          <div className="border-t border-slate-100 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Student Reviews & Ratings</h3>
                <p className="text-xs text-slate-500">Verified peer ratings from engineering students.</p>
              </div>

              {/* Review Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Sort by:</span>
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-700 focus:border-indigo-600 focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="highest">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleSubmitReview} className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Rate this note</h4>
              
              <div className="flex items-center gap-3 mb-4">
                <RatingStars
                  value={userRating}
                  size={22}
                  interactive={true}
                  onChange={(val) => setUserRating(val)}
                />
                <span className="text-xs font-bold text-slate-700">{userRating} of 5 Stars</span>
              </div>

              <textarea
                rows={3}
                value={userReviewText}
                onChange={(e) => setUserReviewText(e.target.value)}
                placeholder="Write your honest review... Was it helpful for exams or units? Any advice for classmates?"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />

              {reviewError && <p className="mt-2 text-xs font-semibold text-rose-600">{reviewError}</p>}
              {reviewSuccess && <p className="mt-2 text-xs font-semibold text-emerald-600">{reviewSuccess}</p>}

              <div className="mt-3 flex justify-end">
                <button
                  disabled={submittingReview || !userReviewText.trim()}
                  className="btn-primary py-2 px-5 text-xs font-bold gap-1.5 disabled:opacity-50"
                >
                  <Send size={13} /> {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>

            {/* Reviews List */}
            {sortedReviews.length > 0 ? (
              <div className="space-y-4">
                {sortedReviews.map((rev, i) => (
                  <div key={rev._id || i} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                          {rev.userId?.name ? rev.userId.name[0] : 'S'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{rev.userId?.name || 'Rahul Sharma'}</p>
                          <p className="text-[10px] text-slate-400">{rev.userId?.collegeName || 'GLA University'}</p>
                        </div>
                      </div>
                      <RatingStars value={rev.rating || 5} size={13} />
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      {rev.review}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}</span>
                      <button
                        onClick={() => handleHelpfulVote(rev._id)}
                        className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-indigo-600 transition"
                      >
                        <ThumbsUp size={12} /> Helpful ({rev.helpfulCount || 0})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No reviews yet. Be the first to share your thoughts on this note!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
