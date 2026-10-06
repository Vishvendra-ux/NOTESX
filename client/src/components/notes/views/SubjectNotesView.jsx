import React, { useState, useMemo } from 'react';
import {
  Search, Upload, Bookmark, Star, Download, Users, FileText,
  Filter, SlidersHorizontal, ArrowUpDown, Check, ArrowLeft
} from 'lucide-react';
import NoteCard from '../NoteCard';
import EmptyState from '../EmptyState';
import LoadingSkeleton from '../LoadingSkeleton';

export default function SubjectNotesView({
  subject,
  branch,
  semester,
  notes,
  loading,
  bookmarkedNoteIds = new Set(),
  isSubjectBookmarked = false,
  onToggleSubjectBookmark,
  onUploadNote,
  onViewNote,
  onBookmarkNote,
  onDownloadNote,
  onReportNote,
  // Filter state & setters from parent
  searchQuery,
  setSearchQuery,
  unitFilter,
  setUnitFilter,
  fileTypeFilter,
  setFileTypeFilter,
  sortBy,
  setSortBy,
  onBack
}) {
  const [showFilters, setShowFilters] = useState(false);

  const unitsList = [
    'All Units',
    'Unit 1',
    'Unit 2',
    'Unit 3',
    'Unit 4',
    'Unit 5',
    'Complete Syllabus',
    'Previous Year Papers'
  ];

  return (
    <div className="animate-fade-in">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs mb-4 transition hover:border-indigo-300"
        >
          <ArrowLeft size={14} /> Back to Subjects
        </button>
      )}
      {/* ── Top Hero Stats Bar matching Section 10 ── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
              <span>{subject?.code || 'CS501'}</span>
              <span>•</span>
              <span>Semester {subject?.semesterNumber || semester?.semesterNumber || 5}</span>
              <span>•</span>
              <span>{branch?.shortCode || 'CSE'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {subject?.name || 'Operating Systems'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
              Verified lecture notes, handwritten summaries, and past exam questions contributed by university toppers.
            </p>
          </div>

          {/* Action Buttons: [+ Upload Notes] and [Bookmark Subject] */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onUploadNote}
              className="btn-primary py-2.5 px-5 text-xs sm:text-sm font-bold gap-2 shadow-md shadow-indigo-200"
            >
              <Upload size={16} /> + Upload Notes
            </button>

            <button
              onClick={onToggleSubjectBookmark}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition ${
                isSubjectBookmarked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-rose-200 hover:text-rose-600'
              }`}
            >
              <Bookmark size={15} className={isSubjectBookmarked ? 'fill-rose-600' : ''} />
              <span>{isSubjectBookmarked ? 'Subject Saved' : 'Bookmark Subject'}</span>
            </button>
          </div>
        </div>

        {/* Top Statistics Bar matching Section 10 */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
              <FileText size={16} />
            </div>
            <div>
              <b className="block text-sm font-extrabold text-slate-900">{notes.length || subject?.notesCount || 1248}</b>
              <span className="text-[11px] text-slate-400">Notes Uploaded</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">
              <Users size={16} />
            </div>
            <div>
              <b className="block text-sm font-extrabold text-slate-900">{subject?.contributorCount || 428}</b>
              <span className="text-[11px] text-slate-400">Contributors</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-500">
              <Star size={16} fill="currentColor" />
            </div>
            <div>
              <b className="block text-sm font-extrabold text-slate-900">{Number(subject?.ratingAverage || 4.7).toFixed(1)}</b>
              <span className="text-[11px] text-slate-400">Average Rating</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <Download size={16} />
            </div>
            <div>
              <b className="block text-sm font-extrabold text-slate-900">{(subject?.downloadsCount || 12400).toLocaleString()}</b>
              <span className="text-[11px] text-slate-400">Downloads</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search Bar & Filter Controls matching Section 12 ── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm mb-6 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${subject?.name || 'notes'} (e.g. Unit 3, Semaphores, Deadlocks)...`}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Unit Filter */}
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 focus:border-indigo-600 focus:outline-none"
            >
              {unitsList.map((u, i) => (
                <option key={i} value={u}>{u}</option>
              ))}
            </select>

            {/* File Type Filter */}
            <select
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 focus:border-indigo-600 focus:outline-none"
            >
              <option value="all">All File Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="doc">Word (.doc, .docx)</option>
              <option value="ppt">PowerPoint (.ppt)</option>
              <option value="img">Images & Scans</option>
            </select>

            {/* Sort Options matching Section 12 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 focus:border-indigo-600 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="downloads">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Notes Grid ── */}
      {loading ? (
        <LoadingSkeleton count={6} />
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <NoteCard
              key={note._id || note.id}
              note={note}
              onView={onViewNote}
              onBookmark={onBookmarkNote}
              onDownload={onDownloadNote}
              onReport={onReportNote}
              isBookmarked={bookmarkedNoteIds.has(note._id || note.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No study notes found for ${subject?.name}`}
          description="Be the first contributor to share lecture summaries, formulas, or assignment solutions for this subject."
          actionText="Upload First Note"
          onAction={onUploadNote}
        />
      )}
    </div>
  );
}
