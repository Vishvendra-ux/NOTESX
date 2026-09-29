import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Briefcase, Search, MapPin, Building, DollarSign, Clock, Users,
  Bookmark, Share2, Sparkles, Filter, Check, ArrowRight, ExternalLink,
  Plus, CheckCircle2, AlertCircle, FileText, Send, X, Layers,
  ChevronRight, Calendar, Award, Globe
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { jobService } from '../services/api';

const CATEGORIES = [
  'All Domains',
  'Software Engineering',
  'Frontend',
  'Backend',
  'AI & Machine Learning',
  'Data Science & Analytics',
  'DevOps & Cloud',
  'Mobile Engineering',
  'Cybersecurity'
];

const JOB_TYPES = ['All Types', 'Internship', 'Full-time'];
const WORKPLACE_TYPES = ['All Modes', 'Remote', 'Hybrid', 'On-site'];
const BATCHES = ['All Batches', '2025', '2026', '2027', '2024'];

export default function Jobs() {
  const { id: routeJobId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Domains');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedWorkplace, setSelectedWorkplace] = useState('All Modes');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');

  // Modals & Active Job
  const [activeJob, setActiveJob] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-applications'
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchJobs();
  }, [selectedCategory, selectedType, selectedWorkplace, selectedBatch]);

  // If URL has /jobs/:id, fetch & open that job
  useEffect(() => {
    if (routeJobId) {
      jobService.get(routeJobId)
        .then((res) => setActiveJob(res.data))
        .catch(() => navigate('/jobs', { replace: true }));
    }
  }, [routeJobId]);

  const fetchStats = async () => {
    try {
      const res = await jobService.stats();
      setStats(res.data);
    } catch (e) {
      console.error('Failed to load job stats:', e);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedCategory !== 'All Domains') params.category = selectedCategory;
      if (selectedType !== 'All Types') params.jobType = selectedType;
      if (selectedWorkplace !== 'All Modes') params.workplaceType = selectedWorkplace;
      if (selectedBatch !== 'All Batches') params.batch = selectedBatch;
      if (search.trim()) params.search = search.trim();

      const res = await jobService.list(params);
      setJobs(res.data?.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError('Could not load job postings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    if (!user) return;
    setLoadingApps(true);
    try {
      const res = await jobService.myApplications();
      setMyApplications(res.data || []);
    } catch (e) {
      console.error('Failed to load applications:', e);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'my-applications') {
      fetchMyApplications();
    }
  };

  const handleToggleSave = async (jobId, e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!user) {
      alert('Please sign in to save job openings.');
      return;
    }
    try {
      const res = await jobService.toggleSave(jobId);
      setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, isSaved: res.data.isSaved } : j)));
      if (activeJob && activeJob._id === jobId) {
        setActiveJob((prev) => ({ ...prev, isSaved: res.data.isSaved }));
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const filteredJobs = useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase().trim();
    return jobs.filter((j) =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.skills?.some((s) => s.toLowerCase().includes(q))
    );
  }, [jobs, search]);

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-10 text-white mb-10 shadow-2xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4 backdrop-blur-md">
              <Briefcase size={13} className="text-blue-400" />
              <span>COLLEGE CAREER & INTERNSHIP PORTAL</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white mb-4">
              Find Your Dream <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Tech Role & Internship</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6">
              Curated fresher openings, high-stipend summer internships, and graduate trainee drives from top product companies and fast-growing startups.
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-blue-300">
                <CheckCircle2 size={15} />
                <span>{stats?.totalJobs || 8} Active Openings</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Award size={15} />
                <span>{stats?.totalInternships || 3} Paid Internships</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1.5 text-indigo-300">
                <Globe size={15} />
                <span>{stats?.remoteJobs || 2} Remote Friendly</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  alert('Please sign in to post a hiring opportunity.');
                  return;
                }
                setIsPostModalOpen(true);
              }}
              className="btn-primary py-3 px-6 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 font-bold cursor-pointer whitespace-nowrap"
            >
              <Plus size={18} />
              <span>+ Post an Opportunity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs: Explore vs My Applications */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 mb-6 pb-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleTabSwitch('explore')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'explore'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Briefcase size={16} />
            <span>Explore Opportunities</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={() => handleTabSwitch('my-applications')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'my-applications'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText size={16} />
              <span>My Applications</span>
              {myApplications.length > 0 && (
                <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {myApplications.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {activeTab === 'explore' ? (
        <>
          {/* Search & Domain Filter Bar */}
          <div className="glass-card p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {/* Keyword Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by job title, company, or skills (e.g. Google, React, Python, AWS)..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-600 outline-none transition"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                <select
                  value={selectedWorkplace}
                  onChange={(e) => setSelectedWorkplace(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                >
                  {WORKPLACE_TYPES.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>

                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                >
                  {BATCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-1">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Listings Grid */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">Loading verified tech openings...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
              {error}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 max-w-md mx-auto">
              <Briefcase size={36} className="mx-auto text-indigo-500 mb-3 opacity-60" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">No Openings Match Filters</h3>
              <p className="text-xs text-slate-400 mb-4">Try removing specific filters or search keywords.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All Domains');
                  setSelectedType('All Types');
                  setSelectedWorkplace('All Modes');
                  setSelectedBatch('All Batches');
                }}
                className="btn-primary text-xs py-2 px-4"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : 'C';

                return (
                  <div
                    key={job._id}
                    onClick={() => setActiveJob(job)}
                    className="glass-card group flex flex-col justify-between p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/80 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer relative"
                  >
                    <div>
                      {/* Top Header: Company Avatar & Badges */}
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-md shadow-indigo-200 dark:shadow-none">
                            {companyInitial}
                          </div>
                          <div className="min-w-0">
                            <span className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider truncate">
                              {job.company}
                            </span>
                            <h2 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                              {job.title}
                            </h2>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleToggleSave(job._id, e)}
                          className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                            job.isSaved
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={job.isSaved ? 'Remove bookmark' : 'Bookmark job'}
                        >
                          <Bookmark size={16} className={job.isSaved ? 'fill-amber-500' : ''} />
                        </button>
                      </div>

                      {/* Location, Mode & Type Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                          <MapPin size={11} className="text-slate-400" />
                          <span>{job.location}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-100 dark:border-indigo-900/60">
                          {job.workplaceType}
                        </span>

                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/60">
                          {job.jobType}
                        </span>
                      </div>

                      {/* Stipend / Salary Display */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-blue-50/30 dark:from-slate-800/60 dark:to-slate-800/40 border border-emerald-100/70 dark:border-slate-700 mb-3.5">
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-0.5">
                          Compensation / Package
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {job.salary}
                        </span>
                      </div>

                      {/* Skills Tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {job.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                              +{job.skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Line */}
                    <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] font-medium">
                        Batches: <b className="text-slate-700 dark:text-slate-300">{job.eligibleBatches?.join(', ')}</b>
                      </span>

                      <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* My Applications Tab */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 font-semibold">
            Track your internship and job applications submitted through NOTESX.
          </div>

          {loadingApps ? (
            <div className="py-20 text-center text-xs text-slate-500 font-bold">Loading your applications...</div>
          ) : myApplications.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800">
              <FileText size={36} className="mx-auto text-slate-400 mb-2" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Applications Yet</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">You haven’t applied for any roles yet.</p>
              <button type="button" onClick={() => handleTabSwitch('explore')} className="btn-primary text-xs py-2 px-4">
                Explore Opportunities
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app._id}
                  className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0">
                      {app.jobId?.company ? app.jobId.company.charAt(0).toUpperCase() : 'J'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {app.jobId?.title || 'Engineering Role'}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {app.jobId?.company} • {app.jobId?.location} • {app.jobId?.salary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-slate-400">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      {app.status || 'Submitted'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Job Detail & Application Modal */}
      {activeJob && (
        <JobDetailModal
          job={activeJob}
          user={user}
          onClose={() => {
            setActiveJob(null);
            if (routeJobId) navigate('/jobs', { replace: true });
          }}
          onSaveToggle={(id) => handleToggleSave(id)}
          onApplySuccess={() => {
            setActiveJob((prev) => ({ ...prev, hasApplied: true }));
            fetchMyApplications();
          }}
        />
      )}

      {/* Post a Job Modal */}
      {isPostModalOpen && (
        <PostJobModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onSuccess={() => {
            setIsPostModalOpen(false);
            fetchJobs();
            fetchStats();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. JOB DETAIL & APPLICATION MODAL
// ─────────────────────────────────────────────────────────────
function JobDetailModal({ job, user, onClose, onSaveToggle, onApplySuccess }) {
  const [copied, setCopied] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [hasAppliedSuccess, setHasAppliedSuccess] = useState(job.hasApplied || false);

  // Form Fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState(user?.collegeName || '');
  const [degree, setDegree] = useState('B.Tech / B.E.');
  const [graduationYear, setGraduationYear] = useState('2025');
  const [resumeUrl, setResumeUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/jobs/${job._id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to apply.');
      return;
    }
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setApplyError('Full name, email, and phone number are required.');
      return;
    }

    setIsSubmitting(true);
    setApplyError('');

    try {
      await jobService.apply(job._id, {
        fullName,
        email,
        phone,
        college,
        degree,
        graduationYear,
        resumeUrl,
        githubUrl,
        linkedinUrl,
        coverNote
      });

      setHasAppliedSuccess(true);
      setShowApplyForm(false);
      onApplySuccess && onApplySuccess();
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl my-8 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Accent Strip */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 shrink-0" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
              {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
            </div>

            <div className="min-w-0">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                {job.company}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                <span>{job.location}</span>
                <span>•</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{job.workplaceType}</span>
                <span>•</span>
                <span className="font-bold text-emerald-600">{job.jobType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 transition"
              title="Copy job link"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
            </button>

            <button
              type="button"
              onClick={() => onSaveToggle(job._id)}
              className={`p-2 rounded-xl border transition ${
                job.isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700'
              }`}
              title="Save opening"
            >
              <Bookmark size={16} className={job.isSaved ? 'fill-amber-500' : ''} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Details Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Package / Stipend</span>
              <b className="text-emerald-700 dark:text-emerald-400 font-black">{job.salary}</b>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
              <b className="text-slate-800 dark:text-slate-200 font-bold">{job.experienceLevel}</b>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Eligible Batches</span>
              <b className="text-indigo-600 dark:text-indigo-400 font-bold">{job.eligibleBatches?.join(', ')}</b>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Domain</span>
              <b className="text-slate-800 dark:text-slate-200 font-bold">{job.category}</b>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
              Role Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                Key Responsibilities
              </h3>
              <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="leading-relaxed">{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                Eligibility & Requirements
              </h3>
              <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {job.requirements.map((req, i) => (
                  <li key={i} className="leading-relaxed">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Perks */}
          {job.perks && job.perks.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                Perks & Benefits
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.perks.map((p, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60"
                  >
                    ✨ {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Application Form Dropdown */}
          {showApplyForm && (
            <div className="p-5 rounded-2xl border-2 border-indigo-500/80 bg-indigo-50/20 dark:bg-indigo-950/30 space-y-3.5 animate-slide-up">
              <h3 className="text-sm font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <Send size={15} />
                <span>Submit Direct Application to {job.company}</span>
              </h3>

              {applyError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                  {applyError}
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      College / University
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Graduation Year
                    </label>
                    <select
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-xs outline-none"
                    >
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Resume Link (Google Drive / Dropbox)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      GitHub or Portfolio URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brief Note to Recruiter (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Highlight your key achievements, projects, or why you are a great fit..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary py-2 px-5 text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm & Apply'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Applications</span>
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              {job.applicationsCount || 0} students applied
            </span>
          </div>

          <div className="flex items-center gap-3">
            {hasAppliedSuccess ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                <CheckCircle2 size={16} /> Application Submitted
              </span>
            ) : (
              <>
                {job.allowDirectApply && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        alert('Please sign in to apply directly.');
                        return;
                      }
                      setShowApplyForm(!showApplyForm);
                    }}
                    className="btn-primary py-2.5 px-6 text-xs font-bold shadow-lg shadow-indigo-500/20 cursor-pointer"
                  >
                    {showApplyForm ? 'Close Application Form' : 'Easy Apply on NOTESX'}
                  </button>
                )}

                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
                  >
                    <span>Apply on Company Site</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. POST A JOB MODAL
// ─────────────────────────────────────────────────────────────
function PostJobModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('Internship');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [location, setLocation] = useState('Bengaluru, India');
  const [category, setCategory] = useState('Software Engineering');
  const [skillsInput, setSkillsInput] = useState('Python, React, SQL');
  const [description, setDescription] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !salary.trim() || !description.trim()) {
      setError('Title, company, salary, and description are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

      await jobService.create({
        title: title.trim(),
        company: company.trim(),
        salary: salary.trim(),
        jobType,
        workplaceType,
        location: location.trim(),
        category,
        skills,
        description: description.trim(),
        applyUrl: applyUrl.trim(),
        allowDirectApply: true
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job posting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shrink-0" />

        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Post a Hiring Opportunity</h2>
            <p className="text-xs text-slate-500">Share internships or fresher jobs with verified students.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. SDE Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Google or Startup Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs outline-none"
              >
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Workplace Mode</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-xs outline-none"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Compensation *</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹50,000/mo or ₹14 LPA"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
            <input
              type="text"
              placeholder="e.g. Bengaluru / Remote (India)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Required Skills (comma separated)</label>
            <input
              type="text"
              placeholder="Python, React, FastAPI, SQL"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Description *</label>
            <textarea
              rows={4}
              required
              placeholder="Explain the role, requirements, and responsibilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">External Application Link (Optional)</label>
            <input
              type="url"
              placeholder="https://company.com/careers/..."
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary py-2 px-5 text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Posting Opportunity...' : 'Post Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
