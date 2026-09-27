import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Sparkles, Filter, CheckCircle2, Bookmark, Flame,
  Clock, Award, HelpCircle, Layers, X, ChevronLeft, ChevronRight,
  RefreshCw, BookOpen, AlertCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { doubtService } from '../services/api';
import DoubtCard from '../components/doubts/DoubtCard';
import DoubtSidebar from '../components/doubts/DoubtSidebar';
import AskDoubtModal from '../components/doubts/AskDoubtModal';
import DoubtDetail from '../components/doubts/DoubtDetail';

export default function Doubts() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // If URL has /doubts/:id, render DoubtDetail
  if (id) {
    return <DoubtDetail />;
  }

  return <DoubtList user={user} searchParams={searchParams} setSearchParams={setSearchParams} />;
}

function DoubtList({ user, searchParams, setSearchParams }) {
  // Read initial query params from URL
  const activeTab = searchParams.get('tab') || 'trending';
  const selectedSubject = searchParams.get('subject') || null;
  const selectedTag = searchParams.get('tag') || null;
  const selectedCategory = searchParams.get('exam') || null;
  const selectedType = searchParams.get('type') || 'All';
  const searchQueryParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchQueryParam);
  const [doubts, setDoubts] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(pageParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  // Fetch Stats (once and on updates)
  const fetchStats = async () => {
    try {
      const res = await doubtService.stats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Fetch Questions
  const fetchDoubts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Build API query parameters
      const params = {
        page,
        limit: 15,
        search: searchQueryParam || undefined,
        subject: selectedSubject || undefined,
        tag: selectedTag || undefined,
        examCategory: selectedCategory && selectedCategory !== 'All' ? selectedCategory : undefined,
        questionType: selectedType && selectedType !== 'All' ? selectedType : undefined,
      };

      // Map tabs to backend filters and sorts
      if (activeTab === 'trending') {
        params.sort = 'trending';
      } else if (activeTab === 'latest') {
        params.sort = 'latest';
      } else if (activeTab === 'votes') {
        params.sort = 'votes';
      } else if (activeTab === 'unanswered') {
        params.filter = 'unanswered';
      } else if (activeTab === 'solved') {
        params.filter = 'solved';
      } else if (activeTab === 'my') {
        params.filter = 'my';
      } else if (activeTab === 'bookmarked') {
        params.filter = 'bookmarked';
      }

      const res = await doubtService.list(params);
      setDoubts(res.data.doubts || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch doubts:', err);
      setError(err.response?.data?.message || 'Could not load questions. Please check connection.');
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedSubject, selectedTag, selectedCategory, selectedType, searchQueryParam, page]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchDoubts();
  }, [fetchDoubts]);

  // URL query helper
  const updateQuery = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === 'All') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });
    // Reset to page 1 on filter/tab changes unless page was specifically changed
    if (!updates.page) {
      nextParams.delete('page');
      setPage(1);
    }
    setSearchParams(nextParams);
  };

  // Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQuery({ q: searchInput.trim() });
  };

  // Handle Tab Switch
  const handleTabChange = (tabId) => {
    updateQuery({ tab: tabId });
  };

  // Handle live upvote/downvote toggle
  const handleVote = async (doubtId, type) => {
    if (!user) {
      alert('Please log in to vote on questions.');
      return;
    }

    try {
      const res = type === 'up'
        ? await doubtService.upvote(doubtId)
        : await doubtService.downvote(doubtId);

      setDoubts(prev => prev.map(d => {
        if (d._id === doubtId) {
          return {
            ...d,
            upvotes: res.data.upvotes,
            downvotes: res.data.downvotes,
            netVotes: res.data.netVotes,
            hasUpvoted: res.data.hasUpvoted,
            hasDownvoted: res.data.hasDownvoted
          };
        }
        return d;
      }));
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  // Handle live bookmark toggle
  const handleBookmark = async (doubtId) => {
    if (!user) {
      alert('Please log in to save bookmarks.');
      return;
    }

    try {
      const res = await doubtService.toggleBookmark(doubtId);
      setDoubts(prev => prev.map(d => {
        if (d._id === doubtId) {
          return {
            ...d,
            isBookmarked: res.data.isBookmarked
          };
        }
        return d;
      }));
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  };

  // On Ask Doubt success
  const handleAskSuccess = async (payload) => {
    const res = await doubtService.create(payload);
    // Prepend new doubt and refresh stats
    setDoubts(prev => [res.data, ...prev]);
    setTotal(prev => prev + 1);
    fetchStats();
  };

  const tabs = [
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'latest', label: 'Recent', icon: Clock },
    { id: 'votes', label: 'Highest Voted', icon: Award },
    { id: 'unanswered', label: 'Unanswered', icon: HelpCircle },
    { id: 'solved', label: 'Solved', icon: CheckCircle2 },
    ...(user ? [
      { id: 'bookmarked', label: 'Bookmarked', icon: Bookmark },
      { id: 'my', label: 'My Doubts', icon: BookOpen }
    ] : [])
  ];

  const hasActiveFilters = Boolean(
    selectedSubject || selectedTag || (selectedCategory && selectedCategory !== 'All') || (selectedType && selectedType !== 'All') || searchQueryParam
  );

  return (
    <div className="animate-fade-in pb-16">
      {/* Page Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-900/60 mb-2">
            <Sparkles size={13} className="text-indigo-600 dark:text-indigo-400" />
            <span>GATE OVERFLOW DISCUSSION FORUM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Ask. Explain. Learn Together.
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Browse verified solutions, PYQs, conceptual derivations, and discussions for GATE CSE, GATE DA, and core engineering subjects.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!user) {
              alert('Please log in to post a question.');
              return;
            }
            setIsAskModalOpen(true);
          }}
          className="btn-primary py-2.5 px-6 shadow-lg shadow-indigo-500/20 whitespace-nowrap flex items-center gap-2 font-bold cursor-pointer"
        >
          <Plus size={18} />
          <span>+ Ask a Doubt</span>
        </button>
      </div>

      {/* Main Grid Layout: Feed (3 cols) + Sidebar (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Top Control Bar: Tabs + Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto scrollbar-hide shrink-0 border border-slate-200/70 dark:border-slate-700/60">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={15} />
              </div>
              <input
                type="text"
                className="w-full h-10 pl-9 pr-9 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-600 outline-none"
                placeholder="Search doubts by title, tag, or formula..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateQuery({ q: '' });
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 text-[10px] pl-1">
                Active Filters:
              </span>

              {selectedSubject && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 font-bold text-indigo-700 dark:text-indigo-300">
                  Subject: {selectedSubject}
                  <button type="button" onClick={() => updateQuery({ subject: null })} className="cursor-pointer hover:opacity-75">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedTag && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 font-bold text-indigo-700 dark:text-indigo-300">
                  Tag: #{selectedTag}
                  <button type="button" onClick={() => updateQuery({ tag: null })} className="cursor-pointer hover:opacity-75">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 font-bold text-indigo-700 dark:text-indigo-300">
                  Exam: {selectedCategory}
                  <button type="button" onClick={() => updateQuery({ exam: null })} className="cursor-pointer hover:opacity-75">
                    <X size={12} />
                  </button>
                </span>
              )}

              {searchQueryParam && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 font-bold text-indigo-700 dark:text-indigo-300">
                  Query: "{searchQueryParam}"
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      updateQuery({ q: '' });
                    }}
                    className="cursor-pointer hover:opacity-75"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearchParams(new URLSearchParams());
                }}
                className="text-[11px] font-bold text-rose-600 hover:underline ml-auto cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={fetchDoubts}
                className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-[11px] transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Questions Feed List */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">Loading GATE doubts and discussions...</p>
            </div>
          ) : doubts.length === 0 ? (
            <div className="glass-card p-10 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                No Doubts Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
                {hasActiveFilters
                  ? 'No questions matched your search criteria. Try removing or adjusting filters.'
                  : 'Be the first student to post a question in this category!'}
              </p>
              <button
                type="button"
                onClick={() => setIsAskModalOpen(true)}
                className="btn-primary py-2 px-5 text-xs font-bold cursor-pointer"
              >
                + Ask the First Doubt
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {doubts.map((doubt) => (
                <DoubtCard
                  key={doubt._id}
                  doubt={doubt}
                  onVote={handleVote}
                  onBookmark={handleBookmark}
                  onTagClick={(tag) => updateQuery({ tag })}
                  onSubjectClick={(subject) => updateQuery({ subject })}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>
                Showing {doubts.length} of {total} questions
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    const nextPage = page - 1;
                    setPage(nextPage);
                    updateQuery({ page: nextPage });
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    updateQuery({ page: nextPage });
                  }}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-1">
          <DoubtSidebar
            stats={stats}
            selectedSubject={selectedSubject}
            onSelectSubject={(subject) => updateQuery({ subject })}
            selectedCategory={selectedCategory}
            onSelectCategory={(exam) => updateQuery({ exam })}
            totalQuestionsCount={total}
          />
        </div>
      </div>

      {/* Ask Doubt Modal */}
      <AskDoubtModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        onSubmitSuccess={handleAskSuccess}
      />
    </div>
  );
}
