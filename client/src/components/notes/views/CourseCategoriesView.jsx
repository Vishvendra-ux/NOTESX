import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import DynamicIcon from '../DynamicIcon';

export default function CourseCategoriesView({ categories, loading, onSelectCategory }) {
  const totalCourses = categories.reduce((total, category) => total + (Number(category.courseCount) || 0), 0);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-2xs mb-4">
          <Sparkles size={14} className="text-indigo-600" /> Academic Degrees & Streams
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Explore Study Materials
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          Choose your course to find notes, subjects and resources.
        </p>
      </div>

      <section aria-labelledby="course-categories-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="course-categories-heading" className="text-sm font-extrabold text-slate-900">Browse by study area</h2>
            <p className="mt-0.5 text-xs text-slate-500">Choose a stream to see its degree programmes.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
            {categories.length} {categories.length === 1 ? 'study area' : 'study areas'}
            {totalCourses > 0 && ` · ${totalCourses} ${totalCourses === 1 ? 'course' : 'courses'}`}
          </span>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const courseCount = Number(cat.courseCount) || 0;
              return (
                <button
                  key={cat._id || cat.slug}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  aria-label={`Explore ${cat.name}, ${courseCount} ${courseCount === 1 ? 'course' : 'courses'}`}
                  className="group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-2xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                        <DynamicIcon name={cat.icon} className="w-6 h-6" />
                      </span>
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-extrabold text-slate-600">
                        {courseCount} {courseCount === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {cat.description || 'Undergraduate and postgraduate degree syllabi & study notes.'}
                    </p>
                  </div>

                  <span className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="font-semibold text-slate-400">Explore programmes</span>
                    <span className="flex items-center gap-1 font-bold text-indigo-600 transition-transform group-hover:translate-x-1">
                      Explore <ArrowRight size={13} />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
            <div className="mx-auto max-w-sm">
              <p className="text-sm font-bold text-slate-800">
                {loading ? 'Loading study areas…' : 'No study areas available yet'}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {loading ? 'Your course catalogue will appear here shortly.' : 'Please check back soon for available courses and programmes.'}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
