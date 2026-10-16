import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Command, FileText, Building2, MessageCircle, Trophy, X, Users, Map, Briefcase, Gamepad2, GraduationCap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SEARCH_DIRECTORY = [
  { icon: Building2, label: 'GLA University', meta: 'College · Mathura, Uttar Pradesh', to: '/colleges/gla', category: 'Colleges' },
  { icon: Building2, label: 'IIT Delhi', meta: 'College · New Delhi, Delhi', to: '/colleges/iit-delhi', category: 'Colleges' },
  { icon: Building2, label: 'Explore All Colleges', meta: 'Browse 12+ top engineering campuses across India', to: '/colleges', category: 'Colleges' },
  { icon: FileText, label: 'Process Synchronization Notes', meta: 'Operating Systems · B.Tech CSE', to: '/notes', category: 'Notes' },
  { icon: FileText, label: 'Browse Verified Study Notes', meta: 'Filter semester notes by subject, semester, and college', to: '/notes', category: 'Notes' },
  { icon: Sparkles, label: 'AI Study Assistant', meta: 'Ask complex syllabus questions & summarize notes', to: '/ai-assistant', category: 'AI Tools' },
  { icon: Users, label: 'BuildTogether Developer Squads', meta: 'Find student teammates for hackathons & projects', to: '/build-together', category: 'Community' },
  { icon: MessageCircle, label: 'BFS traversal using a queue', meta: 'Doubt · Data Structures & Algorithms', to: '/doubts', category: 'Doubts' },
  { icon: MessageCircle, label: 'Student Doubt Forum', meta: 'Ask peer questions and earn verified reputation', to: '/doubts', category: 'Doubts' },
  { icon: Trophy, label: 'College Coding Battle', meta: 'Live contest · Compete for campus rank & XP', to: '/contests', category: 'Contests' },
  { icon: GraduationCap, label: 'GATE Preparation & PYQs', meta: 'Topic-wise mock tests, previous year papers & stats', to: '/gate', category: 'GATE' },
  { icon: Map, label: 'Engineering Career Roadmaps', meta: 'Step-by-step guides for Full Stack, DevOps, AI & System Design', to: '/roadmaps', category: 'Roadmaps' },
  { icon: Briefcase, label: 'Campus Jobs & Internships', meta: 'Verified student opportunities, hiring drives & referral board', to: '/jobs', category: 'Careers' },
  { icon: Gamepad2, label: 'Focus & Study Break Games', meta: 'Multiplayer quiz arena & speed brain breaks', to: '/games', category: 'Games' },
];

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_DIRECTORY.slice(0, 6);
    return SEARCH_DIRECTORY.filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.meta.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [query]);

  const activeIndex = selectedIndex >= filteredResults.length ? 0 : selectedIndex;

  const handleClose = () => {
    setQuery('');
    setSelectedIndex(0);
    onClose();
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredResults.length ? (prev + 1) % filteredResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredResults.length ? (prev - 1 + filteredResults.length) % filteredResults.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults.length > 0 && filteredResults[activeIndex]) {
          navigate(filteredResults[activeIndex].to);
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredResults, activeIndex, navigate]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm p-4 pt-[10vh] sm:pt-[12vh] animate-fade-in"
      onMouseDown={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
    >
      <div
        className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5">
          <Search size={20} className="text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="min-w-0 flex-1 text-sm md:text-base text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Search colleges, notes, doubts, contests, jobs..."
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Clear query"
            >
              <X size={15} />
            </button>
          )}
          <button
            onClick={handleClose}
            className="rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-3 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-1.5">
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">
              {query.trim() ? `Search Results (${filteredResults.length})` : 'Suggested for you'}
            </p>
            {query.trim() && (
              <span className="text-[11px] text-slate-400">Press ↵ to select</span>
            )}
          </div>

          {filteredResults.length > 0 ? (
            <div className="flex flex-col gap-1 mt-1">
              {filteredResults.map(({ icon: Icon, label, meta, to, category }, index) => {
                const isSelected = index === activeIndex;
                return (
                  <button
                    key={`${label}-${to}`}
                    type="button"
                    onClick={() => {
                      navigate(to);
                      handleClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center gap-4 rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                      isSelected ? 'bg-indigo-50/90 text-indigo-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                        isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="block text-sm font-semibold truncate">{label}</span>
                        <span className="hidden sm:inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                          {category}
                        </span>
                      </span>
                      <span className="block text-xs text-slate-500 truncate">{meta}</span>
                    </span>
                    <span className={`text-xs font-medium shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                      Open ↵
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-slate-600">No matching pages or notes found</p>
              <p className="mt-1 text-xs text-slate-400">Try searching for &quot;GATE&quot;, &quot;Colleges&quot;, &quot;Roadmaps&quot;, or &quot;Contests&quot;</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-400 bg-slate-50/50">
          <Command size={14} /> Use <kbd className="rounded border bg-white px-1 font-mono text-[10px] text-slate-600">↑</kbd> <kbd className="rounded border bg-white px-1 font-mono text-[10px] text-slate-600">↓</kbd> to navigate, <kbd className="rounded border bg-white px-1 font-mono text-[10px] text-slate-600">↵</kbd> to open
          <span className="ml-auto">ESC to close</span>
        </div>
      </div>
    </div>
  );
}

