import { ChevronUp, ChevronDown, Check, MessageSquare, Eye, Bookmark, Share2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function DoubtCard({
  doubt,
  onVote,
  onBookmark,
  onTagClick,
  onSubjectClick
}) {
  const [copied, setCopied] = useState(false);

  const netVotes = (doubt.upvotes || 0) - (doubt.downvotes || 0);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/doubts/${doubt._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-4 sm:p-5 hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all duration-200 group flex flex-col sm:flex-row gap-4 relative">
      {/* Left Column: GateOverflow Metric Boxes */}
      <div className="flex sm:flex-col items-center sm:items-center justify-between sm:justify-start gap-2.5 sm:min-w-[4.5rem] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800 pb-2.5 sm:pb-0 sm:pr-4">
        {/* Vote Widget */}
        <div className="flex sm:flex-col items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onVote(doubt._id, 'up');
            }}
            className={`p-1 rounded-lg transition cursor-pointer ${
              doubt.hasUpvoted
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-bold'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={doubt.hasUpvoted ? 'Remove upvote' : 'Upvote question'}
            aria-label="Upvote"
          >
            <ChevronUp size={20} className={doubt.hasUpvoted ? 'stroke-[3px]' : ''} />
          </button>

          <span className={`text-xs sm:text-sm font-extrabold ${
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onVote(doubt._id, 'down');
            }}
            className={`p-1 rounded-lg transition cursor-pointer ${
              doubt.hasDownvoted
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 font-bold'
                : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={doubt.hasDownvoted ? 'Remove downvote' : 'Downvote question'}
            aria-label="Downvote"
          >
            <ChevronDown size={20} className={doubt.hasDownvoted ? 'stroke-[3px]' : ''} />
          </button>
        </div>

        {/* Answer Count Status Pill (GateOverflow signature) */}
        <div className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-xl border text-center transition ${
          doubt.hasAcceptedAnswer
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 shadow-xs'
            : (doubt.answersCount > 0)
            ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
        }`}>
          <div className="flex items-center gap-1 font-bold text-xs">
            {doubt.hasAcceptedAnswer && <Check size={14} strokeWidth={3} className="text-emerald-600 dark:text-emerald-400" />}
            <span>{doubt.answersCount || 0}</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider">
            {doubt.answersCount === 1 ? 'answer' : 'answers'}
          </span>
        </div>

        {/* Views counter */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Eye size={13} />
          <span>{doubt.views || 0}</span>
        </div>
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {doubt.examCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-900/60">
                {doubt.examCategory} {doubt.examYear && `• ${doubt.examYear}`}
              </span>
            )}

            {doubt.subjectName && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubjectClick && onSubjectClick(doubt.subjectName);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                {doubt.subjectName}
              </button>
            )}

            {doubt.questionType && doubt.questionType !== 'General' && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60">
                {doubt.questionType} {doubt.marks ? `(${doubt.marks}M)` : ''}
              </span>
            )}

            {doubt.hasAcceptedAnswer && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                <Check size={11} strokeWidth={3} /> Solved
              </span>
            )}
          </div>

          {/* Question Title */}
          <Link
            to={`/doubts/${doubt._id}`}
            className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2 block mb-2"
          >
            {doubt.title}
          </Link>

          {/* Snippet / Preview */}
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3 font-normal">
            {doubt.description?.replace(/```[\s\S]*?```/g, '[code snippet]').replace(/[\$\#\*\_]/g, '')}
          </p>

          {/* Tags */}
          {doubt.tags && doubt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {doubt.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onTagClick && onTagClick(tag);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition cursor-pointer"
                >
                  <Tag size={10} className="opacity-60" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer line: Author info & Question actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
              {doubt.askerId?.name ? doubt.askerId.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {doubt.askerId?.name || 'Anonymous Learner'}
              </span>
              {doubt.askerId?.reputation !== undefined && (
                <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.2 rounded border border-indigo-100 dark:border-indigo-900/60">
                  {doubt.askerId.reputation} XP
                </span>
              )}
              {doubt.askerId?.collegeName && (
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  • {doubt.askerId.collegeName}
                </span>
              )}
              <span className="text-[11px] text-slate-400">
                • {new Date(doubt.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              title="Copy share link"
              aria-label="Share"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBookmark && onBookmark(doubt._id);
              }}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                doubt.isBookmarked
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={doubt.isBookmarked ? 'Remove bookmark' : 'Bookmark for revision'}
              aria-label="Bookmark"
            >
              <Bookmark size={14} className={doubt.isBookmarked ? 'fill-amber-500' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
