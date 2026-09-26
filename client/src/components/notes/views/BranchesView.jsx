import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, ArrowLeft, BookOpen, Users, FileText, Filter } from 'lucide-react';
import DynamicIcon from '../DynamicIcon';

export default function BranchesView({ course, branches, onSelectBranch, onBack }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set();
    branches.forEach(b => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, [branches]);

  const filteredBranches = useMemo(() => {
    return branches.filter(b => {
      if (activeCategory !== 'All' && b.category !== activeCategory) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.shortCode.toLowerCase().includes(q) ||
          (b.description && b.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [branches, activeCategory, search]);

  return (
    <div className="animate-fade-in">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs mb-4 transition hover:border-indigo-300"
        >
          <ArrowLeft size={14} /> Back to Degrees
        </button>
      )}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {course?.name || 'B.Tech'} Specializations
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Choose Your Branch
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Select your discipline to access year-wise syllabus, semesters, and verified student notes.
          </p>
        </div>

        {/* Search Input for branches */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search branch (e.g. CSE, AIML, Aero)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Category filter tabs */}
      {categories.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Branches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBranches.map((branch) => (
          <div
            key={branch._id || branch.slug}
            onClick={() => onSelectBranch(branch)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${branch.color || 'from-blue-600 to-indigo-600'} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <DynamicIcon name={branch.icon} className="w-6 h-6" />
                </div>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                  {branch.shortCode}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                {branch.name}
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {branch.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <BookOpen size={13} className="text-indigo-500" /> {branch.subjectsCount || 42} Subjects
              </span>
              <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore <ArrowRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
