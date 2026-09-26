import React from 'react';
import { ArrowRight, ArrowLeft, BookOpen, FileText } from 'lucide-react';

function formatYear(year) {
  if (typeof year === 'object' && year?.name) return year.name;
  const yearNumber = Number(typeof year === 'object' ? year?.yearNumber : year);
  const suffix = yearNumber % 10 === 1 && yearNumber % 100 !== 11
    ? 'st'
    : yearNumber % 10 === 2 && yearNumber % 100 !== 12
      ? 'nd'
      : yearNumber % 10 === 3 && yearNumber % 100 !== 13
        ? 'rd'
        : 'th';
  return `${yearNumber}${suffix} Year`;
}

export default function SemestersView({ course, branch, year, semesters, loading, onSelectSemester, onBack }) {
  const yearTitle = formatYear(year);
  const courseName = course?.name || branch?.course?.name || 'Selected course';
  const branchName = branch?.shortCode || branch?.name || 'Selected branch';

  return (
    <div className="animate-fade-in">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs mb-4 transition hover:border-indigo-300"
        >
          <ArrowLeft size={14} /> Back to Years ({branchName})
        </button>
      )}

      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          {courseName} <span className="text-slate-400">/</span> {branchName} <span className="text-slate-400">/</span> {yearTitle}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Semester curriculum
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Subjects are listed under the course and branch they belong to. Choose a semester to open its notes.
        </p>
      </div>

      {semesters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {semesters.map((sem) => {
            const semesterSubjects = Array.isArray(sem.subjects) ? sem.subjects : [];
            const subjectsCount = sem.subjectsCount ?? semesterSubjects.length;
            const notesCount = sem.notesCount ?? 0;

            return (
              <button
                key={sem.semesterNumber}
                type="button"
                onClick={() => onSelectSemester(sem)}
                aria-label={`Open ${sem.name || `Semester ${sem.semesterNumber}`} for ${courseName}, ${branchName}; ${subjectsCount} subjects`}
                className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:p-7"
              >
                <div className="flex w-full items-start justify-between gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-indigo-100 bg-indigo-50 text-base font-extrabold text-indigo-600 shadow-2xs transition-all group-hover:bg-indigo-600 group-hover:text-white">
                    S{sem.semesterNumber}
                  </div>
                  <div className="flex min-w-0 flex-col items-end gap-1.5">
                    <span className="max-w-full truncate rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700">
                      {courseName}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                      {yearTitle}
                    </span>
                  </div>
                </div>

                <div className="mt-4 w-full">
                  <h3 className="text-xl font-extrabold text-slate-900 transition-colors group-hover:text-indigo-600">
                    {sem.name || `Semester ${sem.semesterNumber}`}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{branchName} · {courseName}</p>
                </div>

                <div className="mt-5 w-full rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <BookOpen size={14} className="text-violet-600" />
                      Subjects for {courseName}
                    </span>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-slate-600 shadow-2xs">
                      {subjectsCount} {subjectsCount === 1 ? 'subject' : 'subjects'}
                    </span>
                  </div>

                  {semesterSubjects.length > 0 ? (
                    <ul className="space-y-2">
                      {semesterSubjects.map((subject) => (
                        <li key={subject._id || `${sem.semesterNumber}-${subject.code}-${subject.name}`} className="flex min-w-0 items-start gap-2 text-xs text-slate-700">
                          {subject.code && (
                            <span className="shrink-0 rounded-md border border-indigo-100 bg-white px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-700">
                              {subject.code}
                            </span>
                          )}
                          <span className="min-w-0 leading-relaxed">{subject.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs leading-relaxed text-slate-500">
                      No subjects have been added for this semester yet.
                    </p>
                  )}
                </div>

                <div className="mt-4 flex w-full items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                    <FileText size={13} className="text-emerald-600" />
                    {notesCount} {notesCount === 1 ? 'note' : 'notes'}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-indigo-600 transition-transform group-hover:translate-x-1">
                    View subjects <ArrowRight size={13} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
          <p className="text-sm font-bold text-slate-800">
            {loading ? 'Loading semester subjects…' : `No semesters available for ${courseName}`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {loading ? 'The course curriculum is being loaded.' : 'Choose another year or check back when the course curriculum is added.'}
          </p>
        </div>
      )}
    </div>
  );
}
