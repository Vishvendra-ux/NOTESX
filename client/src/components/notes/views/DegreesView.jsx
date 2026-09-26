import React from 'react';
import { ArrowRight, ArrowLeft, Layers, BookOpen, FileText } from 'lucide-react';
import DynamicIcon from '../DynamicIcon';

export default function DegreesView({ category, courses, onSelectCourse, onBack }) {
  return (
    <div className="animate-fade-in">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs mb-4 transition hover:border-indigo-300"
        >
          <ArrowLeft size={14} /> Back to Course Streams
        </button>
      )}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Available Programmes
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          {category?.name || 'Engineering & Technology'}
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl">
          Select your degree program to access specialized branches, curriculums, and semester study notes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id || course.slug}
            onClick={() => onSelectCourse(course)}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs group-hover:scale-105 transition-transform">
                  <Layers size={24} />
                </div>
                <span className="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-700">
                  {course.badge || `${course.durationYears} Years`}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                {course.name}
              </h3>
              <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {course.description || `Comprehensive ${course.durationYears}-year undergraduate engineering curriculum.`}
              </p>

              {/* Stats matching Section 4 */}
              <div className="mt-5 space-y-2 py-3 border-y border-slate-100 text-xs font-semibold text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Layers size={13} className="text-indigo-500" /> Branches
                  </span>
                  <span className="font-extrabold text-slate-900">{course.branchesCount || 47} Branches</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <BookOpen size={13} className="text-violet-500" /> Subjects
                  </span>
                  <span className="font-extrabold text-slate-900">{course.subjectsCount || 480} Subjects</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <FileText size={13} className="text-emerald-500" /> Study Notes
                  </span>
                  <span className="font-extrabold text-slate-900">{(course.notesCount || 8420).toLocaleString()} Notes</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs pt-1">
              <span className="font-semibold text-slate-400">View Specializations</span>
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
