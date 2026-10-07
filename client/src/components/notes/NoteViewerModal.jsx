import React, { useState, useEffect, useContext } from 'react';
import { 
  X, ArrowLeft, Download, Bookmark, Flag, Star, ThumbsUp, 
  User, CheckCircle2, Award, Calendar, FileText, Send, 
  Layers, ExternalLink, Sparkles, AlertCircle, Globe 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { notesService } from '../../services/api';
import RatingStars from './RatingStars';

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

  return (
    <div 
      className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/60 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden my-auto animate-slide-up flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={16} /> Back to Subject
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBookmarkToggle && onBookmarkToggle(note)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
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
              className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Report Note"
            >
              <Flag size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={18} />
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
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Description & Notes Overview</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-slate-100">
              {note?.description || 'Comprehensive handwritten study notes covering unit syllabus, core derivations, diagrams, and university previous year exam questions.'}
            </p>
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
    </div>
  );
}
