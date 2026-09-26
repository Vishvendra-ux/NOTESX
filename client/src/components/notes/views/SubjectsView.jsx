import React, { useState } from 'react';
import { Search, Star, BookOpen, Users, FileText, ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import DynamicIcon from '../DynamicIcon';

export default function SubjectsView({ 
  course,
  branch, 
  semester, 
  subjects, 
  loading,
  onSelectSubject, 
  onUploadNote,
  onBack
}) {
  const [search, setSearch] = useState('');

  const filteredSubjects = subjects.filter(s => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.code && s.code.toLowerCase().includes(q));
  });

  const semName = typeof semester === 'object' ? semester.name : `Semester ${semester}`;
  const courseName = course?.name || 'Selected course';

  return (
    <div className="animate-fade-in">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs mb-4 transition hover:border-indigo-300"
        >
          <ArrowLeft size={14} /> Back to Semesters ({branch?.shortCode || 'CSE'})
        </button>
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {courseName} • {branch?.shortCode || branch?.name || 'Selected branch'} • {semName}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Curriculum Subjects
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Select a subject to browse unit-wise notes, previous year exam papers, and derivations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subject..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <button
            onClick={onUploadNote}
            className="btn-primary py-2 px-4 text-xs font-bold gap-1.5 whitespace-nowrap shadow-sm shadow-indigo-200"
          >
            <Upload size={14} /> Upload Note
          </button>
        </div>
      </div>

      {/* Subjects Grid matching Section 9 */}
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => (
          <div
            key={subject._id || subject.slug}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
          >
            <div>
              {/* Subject Icon & Code */}
              <div className="flex items-center justify-between mb-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <DynamicIcon name={subject.icon || 'BookOpen'} className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-50 border border-indigo-100/60 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700">
                    {subject.code || 'CS501'}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-600">
                    {subject.credits || 4} Credits
                  </span>
                </div>
              </div>

              {/* Subject Name */}
              <h3 
                onClick={() => onSelectSubject(subject)}
                className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-snug mb-2"
              >
                {subject.name}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {subject.description || `University approved curriculum syllabus and study material for ${subject.name}.`}
              </p>

              {/* Stats: Notes, Contributors, Rating */}
              <div className="py-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <b className="block text-sm font-extrabold text-slate-900">{subject.notesCount || 1248}</b>
                  <span className="text-[10px] text-slate-400 font-medium">Notes</span>
                </div>
                <div>
                  <b className="block text-sm font-extrabold text-slate-900">{subject.contributorCount || 428}</b>
                  <span className="text-[10px] text-slate-400 font-medium">Contributors</span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-amber-500">
                    <Star size={13} fill="currentColor" /> {Number(subject.ratingAverage || 4.7).toFixed(1)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Avg Rating</span>
                </div>
              </div>
            </div>

            {/* Action Button: [View Notes] */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => onSelectSubject(subject)}
                className="btn-primary w-full py-2 text-xs font-bold gap-2 justify-center shadow-xs"
              >
                <span>View Notes</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
          <p className="text-sm font-bold text-slate-800">
            {loading ? 'Loading subjects…' : search ? 'No subjects match your search' : `No subjects listed for ${courseName}`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {loading ? 'The semester curriculum is being loaded.' : search ? 'Try another subject name or course code.' : 'Subjects will appear here once the course curriculum is added.'}
          </p>
        </div>
      )}
    </div>
  );
}
