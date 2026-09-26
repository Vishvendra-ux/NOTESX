import React from 'react';
import { ArrowRight, ArrowLeft, Users, BookOpen, FileText, Award, Calendar } from 'lucide-react';
import DynamicIcon from '../DynamicIcon';

export default function BranchDashboardView({ branch, years, onSelectYear, onBack }) {
  const studentCount = Number(branch.studentCount || 12450).toLocaleString();
  const subjectsCount = Number(branch.subjectsCount || 42).toLocaleString();
  const notesCount = Number(branch.notesCount || 2840).toLocaleString();
  const contributorCount = Number(branch.contributorCount || 680).toLocaleString();

  return (
    <div className="animate-fade-in">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs mb-4 transition hover:border-indigo-300"
        >
          <ArrowLeft size={14} /> Back to Branches
        </button>
      )}
      {/* Branch Hero Dashboard Header matching Section 6 */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
          <div className={`grid h-16 w-16 sm:h-20 sm:w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${branch.color || 'from-blue-600 to-indigo-600'} text-white shadow-lg`}>
            <DynamicIcon name={branch.icon} className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-0.5 text-xs font-bold text-indigo-700 mb-1.5">
              {branch.shortCode} • Engineering & Technology
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {branch.name}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Study materials, notes and resources for {branch.shortCode || branch.name} students.
            </p>
          </div>
        </div>

        {/* 4 Core Metrics: Students, Subjects, Notes, Contributors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <Users size={14} className="text-indigo-600" /> Students
            </span>
            <b className="text-lg sm:text-xl font-extrabold text-slate-900">{studentCount}</b>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <BookOpen size={14} className="text-violet-600" /> Subjects
            </span>
            <b className="text-lg sm:text-xl font-extrabold text-slate-900">{subjectsCount}</b>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <FileText size={14} className="text-emerald-600" /> Notes
            </span>
            <b className="text-lg sm:text-xl font-extrabold text-slate-900">{notesCount}</b>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
              <Award size={14} className="text-amber-500" /> Contributors
            </span>
            <b className="text-lg sm:text-xl font-extrabold text-slate-900">{contributorCount}</b>
          </div>
        </div>
      </div>

      {/* Select Year Section matching Section 7 */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Select Year
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Choose your current academic stage to access semester-specific curriculum subjects:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {years.map((yearObj) => (
          <div
            key={yearObj.yearNumber}
            onClick={() => onSelectYear(yearObj)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base border border-indigo-100 shadow-2xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  Y{yearObj.yearNumber}
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                  {yearObj.yearNumber === 1 ? 'Freshman' : yearObj.yearNumber === 2 ? 'Sophomore' : yearObj.yearNumber === 3 ? 'Junior' : 'Senior'}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {yearObj.name}
              </h3>
              
              <div className="mt-4 space-y-1.5 py-2.5 border-t border-slate-100 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subjects</span>
                  <span className="font-extrabold text-slate-900">{yearObj.subjectsCount || 6} Subjects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Notes</span>
                  <span className="font-extrabold text-slate-900">{yearObj.notesCount || 428} Notes</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">View Semesters</span>
              <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
