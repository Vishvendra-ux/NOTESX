import React from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import NoteCard from '../NoteCard';
import EmptyState from '../EmptyState';
import LoadingSkeleton from '../LoadingSkeleton';

export default function UserBookmarksView({
  bookmarkedNotes,
  loading,
  onBack,
  onViewNote,
  onBookmarkNote,
  onDownloadNote,
  onReportNote
}) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Saved Study Resources</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Bookmark size={24} className="text-rose-500 fill-rose-500" /> My Bookmarked Notes
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Quick access to your saved semester notes, guides, and question papers.
          </p>
        </div>

        <button
          onClick={onBack}
          className="btn-secondary py-2 px-4 text-xs font-semibold gap-1.5"
        >
          <ArrowLeft size={14} /> Back to Courses
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : bookmarkedNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookmarkedNotes.map((note) => (
            <NoteCard
              key={note._id || note.id}
              note={note}
              onView={onViewNote}
              onBookmark={onBookmarkNote}
              onDownload={onDownloadNote}
              onReport={onReportNote}
              isBookmarked={true}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No bookmarked notes yet"
          description="Click the bookmark icon on any note card to save it for quick revision before exams."
          actionText="Explore Notes"
          onAction={onBack}
        />
      )}
    </div>
  );
}
