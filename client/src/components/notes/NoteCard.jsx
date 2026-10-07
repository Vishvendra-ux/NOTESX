import React, { useState } from 'react';
import { 
  FileText, Download, Eye, Star, User, Bookmark, MoreVertical, 
  Flag, Check, ExternalLink, Sparkles, Globe 
} from 'lucide-react';

export default function NoteCard({
  note,
  onView,
  onBookmark,
  onDownload,
  onReport,
  isBookmarked = false
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const getFileBadge = (type, extLink, url) => {
    const t = (type || 'pdf').toLowerCase();
    const link = (extLink || url || '').toLowerCase();

    if (t.includes('drive') || link.includes('drive.google.com')) {
      return { icon: <Globe size={18} className="text-amber-500" />, label: 'G-Drive', bg: 'bg-amber-50 border-amber-100 text-amber-700' };
    }
    if (t.includes('gdoc') || link.includes('docs.google.com/document')) {
      return { icon: <Globe size={18} className="text-blue-500" />, label: 'G-Docs', bg: 'bg-blue-50 border-blue-100 text-blue-700' };
    }
    if (link.includes('docs.google.com/presentation')) {
      return { icon: <FileText size={18} className="text-orange-500" />, label: 'G-Slides', bg: 'bg-orange-50 border-orange-100 text-orange-700' };
    }
    if (t.includes('pdf') || link.endsWith('.pdf')) {
      return { icon: <FileText size={18} className="text-rose-500" />, label: 'PDF', bg: 'bg-rose-50 border-rose-100 text-rose-700' };
    }
    if (t.includes('doc') || t.includes('word')) {
      return { icon: <FileText size={18} className="text-blue-500" />, label: 'DOC', bg: 'bg-blue-50 border-blue-100 text-blue-700' };
    }
    if (t.includes('ppt') || t.includes('presentation')) {
      return { icon: <FileText size={18} className="text-amber-500" />, label: 'PPT', bg: 'bg-amber-50 border-amber-100 text-amber-700' };
    }
    if (t.includes('image') || t.includes('img')) {
      return { icon: <FileText size={18} className="text-emerald-500" />, label: 'IMG', bg: 'bg-emerald-50 border-emerald-100 text-emerald-700' };
    }
    if (extLink) {
      return { icon: <ExternalLink size={18} className="text-indigo-500" />, label: 'Public Link', bg: 'bg-indigo-50 border-indigo-100 text-indigo-700' };
    }
    return { icon: <FileText size={18} className="text-indigo-500" />, label: 'PDF', bg: 'bg-indigo-50 border-indigo-100 text-indigo-700' };
  };

  const badge = getFileBadge(note.fileType, note.externalLink, note.fileUrl);

  const formatFileSize = (bytes) => {
    if (note.isExternalLink || (note.externalLink && !bytes)) return 'Cloud Link';
    if (!bytes) return '2.4 MB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const authorName = note.uploaderId?.name || note.author || 'Student Contributor';
  const collegeName = note.uploaderId?.collegeName || note.college || 'Engineering Campus';

  const handleDownloadClick = async (e) => {
    e.stopPropagation();
    setDownloading(true);
    const targetUrl = note.externalLink || note.fileUrl;
    try {
      if (onDownload) {
        await onDownload(note);
      } else if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  return (
    <div 
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
    >
      <div>
        {/* Top Header: File Badge & More Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-50 border border-slate-100 shadow-2xs group-hover:scale-105 transition-transform">
              {badge.icon}
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${badge.bg}`}>
              {badge.label} • {formatFileSize(note.fileSize)}
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Note options"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-20 animate-slide-up text-xs font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => { setShowMenu(false); onReport && onReport(note); }}
                  className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-left transition"
                >
                  <Flag size={13} /> Report Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Note Title */}
        <h4 
          onClick={() => onView && onView(note)}
          className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2 leading-snug mb-2"
        >
          {note.title}
        </h4>

        {/* Description Snippet */}
        {note.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {note.description}
          </p>
        )}

        {/* Meta Pills: Subject, Unit, Semester */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/60">
            {note.subjectId?.name || note.subject || 'Core Subject'}
          </span>
          {note.unit && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100/60">
              {note.unit}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
            {note.year || (note.yearNumber ? `${note.yearNumber}th Year` : '3rd Year')}
          </span>
          {note.semester && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
              {note.semester}
            </span>
          )}
        </div>

        {/* Ratings and Stats */}
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md font-bold text-[11px]">
            <Star size={12} fill="currentColor" />
            <span>{Number(note.ratingAverage || 4.8).toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({note.ratingCount || 124})</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <Download size={12} className="text-slate-400" />
            {Number(note.downloadCount || 1240).toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <Eye size={12} className="text-slate-400" />
            {Number(note.views || 2400).toLocaleString()}
          </span>
        </div>

        {/* Uploader Contributor */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold">
              {authorName[0]}
            </div>
            <span className="truncate">
              <b>{authorName}</b> • {collegeName}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onView && onView(note)}
          className="btn-primary py-1.5 px-3.5 text-xs font-bold gap-1 flex-1 justify-center shadow-xs"
        >
          View Notes
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark && onBookmark(note);
          }}
          className={`p-2 rounded-xl border transition ${
            isBookmarked
              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
              : 'border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/40'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Note'}
          aria-label="Bookmark Note"
        >
          <Bookmark size={15} className={isBookmarked ? 'fill-rose-600' : ''} />
        </button>

        <button
          type="button"
          onClick={handleDownloadClick}
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition"
          title="Download File"
          aria-label="Download File"
        >
          {downloading ? <Check size={15} className="text-emerald-600" /> : <Download size={15} />}
        </button>
      </div>
    </div>
  );
}
