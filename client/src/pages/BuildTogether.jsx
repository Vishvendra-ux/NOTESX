import { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Plus, Search, Rocket, Sparkles, Code2, GitBranch, MessageSquare,
  Heart, CheckCircle2, X, ChevronRight, UserPlus, Check, ArrowRight, AlertCircle, Trash2,
  Ticket, UserCheck, Phone, ExternalLink, ShieldCheck, Clock
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { buildTogetherService } from '../services/api';

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile App',
  'AI & Machine Learning',
  'Open Source',
  'IoT & Robotics',
  'Blockchain / Web3',
  'DevOps & Cloud'
];

const TARGET_GOALS = [
  'All Goals',
  'Hackathon Squad',
  'College Capstone / Final Year',
  'Startup MVP',
  'Open Source Project',
  'Portfolio & Learning'
];

export default function BuildTogether() {
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGoal, setSelectedGoal] = useState('All Goals');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'my-projects' | 'applied'

  // Modals
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Seat Booking Modal State
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    college: '',
    contact: '',
    skills: '',
    github: '',
    pitch: ''
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Pitch Project Form State
  const [pitchForm, setPitchForm] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Web Development',
    targetGoal: 'Hackathon Squad',
    projectStage: 'Idea / Planning',
    techStack: 'React, Node.js, TailwindCSS',
    rolesNeeded: [
      { roleTitle: 'Frontend Developer', count: 1, skills: 'React, TailwindCSS' },
      { roleTitle: 'Backend Developer', count: 1, skills: 'Node.js, Express, MongoDB' }
    ],
    githubUrl: '',
    communicationChannel: 'Discord',
    communicationLink: '',
    maxTeamSize: 4
  });
  const [isSubmittingPitch, setIsSubmittingPitch] = useState(false);
  const [pitchError, setPitchError] = useState('');

  // Fetch projects from backend
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await buildTogetherService.list({
        search: search.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        targetGoal: selectedGoal !== 'All Goals' ? selectedGoal : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        limit: 50
      });
      setProjects(res.data?.projects || []);

      // If a project is currently viewed in detail modal, refresh its view
      if (selectedProject) {
        const refreshed = (res.data?.projects || []).find(p => p._id === selectedProject._id);
        if (refreshed) {
          setSelectedProject(refreshed);
        }
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Unable to load projects right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, selectedGoal, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync user info into booking form when modal opens
  const openBookingModalForSlot = (project, slot) => {
    if (!user) {
      alert('Please log in to book a collaboration seat!');
      return;
    }
    setSelectedProject(project);
    setSelectedSlotForBooking(slot);
    setBookingForm({
      name: user?.name || '',
      college: user?.collegeName || '',
      contact: '',
      skills: slot.skillsRequired?.join(', ') || '',
      github: user?.github || '',
      pitch: ''
    });
    setBookingError('');
    setBookingSuccess(false);
    setIsBookingModalOpen(true);
  };

  // Toggle upvote
  const handleToggleUpvote = async (projectId) => {
    if (!user) {
      alert('Please log in to upvote projects!');
      return;
    }
    try {
      const res = await buildTogetherService.toggleUpvote(projectId);
      setProjects(prev => prev.map(p => {
        if (p._id === projectId) {
          return {
            ...p,
            upvotesCount: res.data.upvotesCount,
            hasUpvoted: res.data.hasUpvoted
          };
        }
        return p;
      }));

      if (selectedProject && selectedProject._id === projectId) {
        setSelectedProject(prev => ({
          ...prev,
          upvotesCount: res.data.upvotesCount,
          hasUpvoted: res.data.hasUpvoted
        }));
      }
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  // Submit Slot Booking Application
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject || !selectedSlotForBooking || !user) return;
    setIsSubmittingBooking(true);
    setBookingError('');

    try {
      await buildTogetherService.apply(selectedProject._id, {
        slotNumber: selectedSlotForBooking.slotNumber,
        roleApplied: selectedSlotForBooking.roleTitle,
        applicantPhoneOrContact: bookingForm.contact,
        skillsSummary: bookingForm.skills,
        pitchMessage: bookingForm.pitch,
        portfolioOrGithub: bookingForm.github
      });

      setBookingSuccess(true);
      fetchProjects();

      setTimeout(() => {
        setIsBookingModalOpen(false);
        setBookingSuccess(false);
        setBookingError('');
      }, 1600);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to submit seat reservation. Please try again.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Submit Project Pitch
  const handlePitchSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setPitchError('');
    setIsSubmittingPitch(true);

    try {
      await buildTogetherService.create({
        ...pitchForm,
        rolesNeeded: pitchForm.rolesNeeded.filter(r => r.roleTitle.trim())
      });
      setIsPitchModalOpen(false);
      // Reset form
      setPitchForm({
        title: '',
        tagline: '',
        description: '',
        category: 'Web Development',
        targetGoal: 'Hackathon Squad',
        projectStage: 'Idea / Planning',
        techStack: 'React, Node.js, TailwindCSS',
        rolesNeeded: [
          { roleTitle: 'Frontend Developer', count: 1, skills: 'React, Tailwind' },
          { roleTitle: 'Backend Developer', count: 1, skills: 'Node.js, Express, MongoDB' }
        ],
        githubUrl: '',
        communicationChannel: 'Discord',
        communicationLink: '',
        maxTeamSize: 4
      });
      fetchProjects();
    } catch (err) {
      setPitchError(err.response?.data?.message || 'Failed to create project pitch');
    } finally {
      setIsSubmittingPitch(false);
    }
  };

  // Add role row in pitch form
  const handleAddRoleRow = () => {
    setPitchForm(prev => ({
      ...prev,
      rolesNeeded: [...prev.rolesNeeded, { roleTitle: '', count: 1, skills: '' }]
    }));
  };

  // Remove role row in pitch form
  const handleRemoveRoleRow = (index) => {
    setPitchForm(prev => ({
      ...prev,
      rolesNeeded: prev.rolesNeeded.filter((_, i) => i !== index)
    }));
  };

  // Pitcher verifies & manages application (Accept & Fill Seat OR Decline)
  const handleManageApplication = async (projectId, appId, action) => {
    try {
      const res = await buildTogetherService.manageApplication(projectId, appId, { action });
      if (res.data?.project) {
        setSelectedProject(res.data.project);
      } else {
        const refreshed = await buildTogetherService.get(projectId);
        setSelectedProject(refreshed.data);
      }
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} application`);
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project collaboration pitch?')) return;
    try {
      await buildTogetherService.delete(projectId);
      setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  // Filtered list based on active tab
  const displayedProjects = useMemo(() => {
    if (activeTab === 'my-projects') {
      return projects.filter(p => p.isCreator);
    }
    if (activeTab === 'applied') {
      return projects.filter(p => p.hasApplied || p.isMember);
    }
    return projects;
  }, [projects, activeTab]);

  const myProjectsCount = projects.filter(project => project.isCreator).length;
  const pendingApplicationsCount = projects
    .filter(project => project.isCreator)
    .reduce((count, project) => count + (project.applications || []).filter(application => application.status === 'pending').length, 0);

  const myBookedOrAppliedCount = projects.filter(p => p.hasApplied || p.isMember).length;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 pt-4 sm:pt-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── HERO BANNER ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-10 lg:p-12 text-white shadow-xl shadow-indigo-950/20 mb-8 border border-indigo-900/50">
          {/* Ambient glow effects */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Issue 3 fix: Natural Title Case without uppercase */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-bold tracking-wide mb-4">
              <Ticket size={14} className="text-amber-400" />
              <span>Project Seat Booking System</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4">
              Pitch your vision. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-indigo-200">Book your team seats.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Just like booking a concert or airline ticket, choose an open collaboration seat, send your skills and details to the project pitcher, and get your seat confirmed to build together!
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (!user) {
                    alert('Please log in to pitch a project!');
                    return;
                  }
                  setIsPitchModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
              >
                <Plus size={18} />
                <span>Pitch a Project & Open Seats</span>
              </button>

              <a
                href="#browse-projects"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-sm transition cursor-pointer"
              >
                <Rocket size={17} className="text-indigo-300" />
                <span>Find an Open Seat</span>
              </a>
            </div>

            {/* Ticket Booking Workflow Steps (Issue 4 fix: text-xs instead of 11px) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/10">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-bold text-indigo-300">1</span>
                  <p className="text-xs font-bold text-white">Select an Open Seat</p>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">Browse live pitches and click on any open seat (Frontend, Backend, ML, UI/UX).</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-bold text-indigo-300">2</span>
                  <p className="text-xs font-bold text-white">Send Collaborator Details</p>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">Submit your WhatsApp/Discord contact, GitHub portfolio, and pitch to the project pitcher.</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/30 text-xs font-bold text-emerald-300">3</span>
                  <p className="text-xs font-bold text-white">Pitcher Verifies & Fills Seat</p>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">Pitcher reviews your application, approves it, and the seat is permanently filled with your badge!</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTROLS: TABS, SEARCH & FILTERS ── */}
        <div id="browse-projects" className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm mb-6">
          {/* Top Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'explore'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Rocket size={14} />
                <span>Explore Pitches</span>
              </button>
              {user && (
                <>
                  <button
                    onClick={() => setActiveTab('my-projects')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'my-projects'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>My Pitches ({myProjectsCount})</span>
                    {pendingApplicationsCount > 0 && (
                      <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                        {pendingApplicationsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('applied')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'applied'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Ticket size={14} />
                    <span>My Booked Seats ({myBookedOrAppliedCount})</span>
                  </button>
                </>
              )}
            </div>

            {/* Issue 24 fix: Solid primary button matching hero CTA */}
            <button
              onClick={() => {
                if (!user) {
                  alert('Please log in to pitch a project!');
                  return;
                }
                setIsPitchModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer ml-auto"
            >
              <Plus size={15} />
              <span>Pitch New Project</span>
            </button>
          </div>

          {/* Issue 25 fix: Standardized heights, rounded corners, and aligned grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-6 relative flex items-center">
              <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects by name, role (Frontend, ML), tech (React, PyTorch), or college..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 text-slate-400 hover:text-slate-600">
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="lg:col-span-3">
              <select
                value={selectedGoal}
                onChange={e => setSelectedGoal(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
              >
                {TARGET_GOALS.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 focus:bg-white focus:border-indigo-600 focus:outline-none transition"
              >
                <option value="All">All Seat Status</option>
                <option value="Looking for Members">Seats Available (Open)</option>
                <option value="Team Full">All Seats Filled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Issue 19 fix: Semantic H2 section heading preserving H1 -> H2 -> H3 outline */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'my-projects' ? 'My Pitched Projects' : activeTab === 'applied' ? 'My Booked Seats & Applications' : 'Explore Project Pitches'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {activeTab === 'my-projects'
                ? 'Projects you pitched. Review collaborator requests and manage team seats.'
                : activeTab === 'applied'
                ? 'Projects where you reserved a collaboration seat or submitted an application.'
                : 'Browse student project teams, select an open seat, and collaborate.'}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            {displayedProjects.length} {displayedProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        {/* ── PROJECT CARDS GRID ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200/80 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full mb-4" />
                <div className="h-20 bg-slate-100 rounded-xl mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded-full w-16" />
                  <div className="h-6 bg-slate-200 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-700">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Projects didn’t load</h3>
            <p className="mt-1 text-sm text-slate-600">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 cursor-pointer"
            >
              Try again <ArrowRight size={14} />
            </button>
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Ticket size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {activeTab === 'my-projects' ? 'You haven’t pitched a project yet' : activeTab === 'applied' ? 'No seat reservations yet' : 'No projects found'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-5 leading-relaxed">
              {activeTab === 'applied'
                ? 'Explore pitches with open collaboration seats, select an available seat, and send your details to the pitcher!'
                : activeTab === 'my-projects'
                ? 'Pitch your idea, specify the roles and seats needed, and let students apply for collaboration seats.'
                : search
                ? `No results match "${search}". Try another keyword or clear filters.`
                : 'There are no active projects right now. Be the first to pitch one!'}
            </p>
            <button
              onClick={() => {
                if (activeTab === 'applied') {
                  setActiveTab('explore');
                } else if (search || selectedCategory !== 'All' || selectedGoal !== 'All Goals' || statusFilter !== 'All') {
                  setSearch('');
                  setSelectedCategory('All');
                  setSelectedGoal('All Goals');
                  setStatusFilter('All');
                } else {
                  if (!user) {
                    alert('Please log in to pitch a project!');
                    return;
                  }
                  setIsPitchModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer"
            >
              {activeTab === 'applied'
                ? <><Rocket size={16} /> Explore Open Seats</>
                : search || selectedCategory !== 'All' || selectedGoal !== 'All Goals' || statusFilter !== 'All'
                ? <><X size={16} /> Clear Filters</>
                : <><Plus size={16} /> Pitch a Project</>}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map(project => {
              const slots = project.bookingSlots || [];
              const availableSlots = slots.filter(s => s.status === 'available');
              const reservedSlots = slots.filter(s => s.status === 'reserved');
              const totalSlots = slots.length || project.maxTeamSize || 4;
              const isFull = availableSlots.length === 0;

              return (
                <div
                  key={project._id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Card Header Top */}
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {/* Issue 9 fix: text-xs on goal badge */}
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {project.targetGoal}
                      </span>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        !isFull
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : project.status === 'Completed'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {!isFull ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{availableSlots.length} Seats Open</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span>All {totalSlots} Seats Filled</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Issue 21 fix: line-clamp-2 with min height so full titles display cleanly without single-line ellipsis */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[3rem] mb-1.5">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-4 leading-relaxed">
                      {project.tagline || project.description}
                    </p>

                    {/* 
                      Issues 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 23 fix:
                      Replaced cramped 2x2 grid with a clean, scannable Collaboration Seats overview.
                      - Uses readable text-xs (no 10px text)
                      - Shows full role names without truncation
                      - Eliminates visual density and clutter
                      - Removes 9px faux Book/Fill buttons
                    */}
                    <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70 mb-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                        <span className="flex items-center gap-1.5 text-indigo-700">
                          <Ticket size={14} />
                          <span>Collaboration Seats</span>
                        </span>
                        <span className="text-slate-600">
                          {reservedSlots.length}/{totalSlots} Filled
                        </span>
                      </div>

                      {/* Visual segmented capacity bar */}
                      <div className="flex gap-1.5 mb-2.5">
                        {slots.map((slot) => (
                          <div
                            key={slot.slotNumber}
                            className={`h-2 flex-1 rounded-full transition-all ${
                              slot.status === 'reserved' ? 'bg-indigo-600' : 'bg-emerald-400'
                            }`}
                            title={`Seat #${slot.slotNumber}: ${slot.roleTitle} (${slot.status === 'reserved' ? 'Filled' : 'Open'})`}
                          />
                        ))}
                      </div>

                      {/* Open Roles Badges */}
                      {availableSlots.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {availableSlots.slice(0, 3).map((slot) => (
                            <span
                              key={slot.slotNumber}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Seat {slot.slotNumber}: {slot.roleTitle}</span>
                            </span>
                          ))}
                          {availableSlots.length > 3 && (
                            <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                              +{availableSlots.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          <span>All collaborator seats verified and confirmed</span>
                        </p>
                      )}
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {project.techStack?.slice(0, 4).map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                          #{tech}
                        </span>
                      ))}
                      {project.techStack?.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                    {/* Pitcher Snippet */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                        {project.creatorAvatar ? (
                          <img src={project.creatorAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          project.creatorName?.charAt(0) || 'U'
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {project.creatorName}
                        </p>
                        <p className="text-xs text-slate-600 truncate">
                          {project.creatorCollege || 'Campus Pitcher'}
                        </p>
                      </div>
                    </div>

                    {/* Actions: standardized button styles */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleUpvote(project._id)}
                        className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                          project.hasUpvoted
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:text-rose-700'
                        }`}
                        title="Upvote project"
                      >
                        <Heart size={14} className={project.hasUpvoted ? 'fill-rose-600 text-rose-600' : ''} />
                        <span>{project.upvotesCount || 0}</span>
                      </button>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer flex items-center gap-1"
                      >
                        <span>View Seats</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL: PROJECT DETAILS & FULL SEAT BOOKING DECK ── */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header info */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedProject.targetGoal}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                  {selectedProject.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {selectedProject.projectStage}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  (selectedProject.bookingSlots || []).some(s => s.status === 'available')
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {(selectedProject.bookingSlots || []).some(s => s.status === 'available')
                    ? '🟢 Open Collaboration Seats'
                    : '🔒 All Team Seats Booked'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                {selectedProject.title}
              </h2>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                {selectedProject.tagline}
              </p>
            </div>

            {/* Pitcher / Team Bar */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center overflow-hidden">
                  {selectedProject.creatorAvatar ? (
                    <img src={selectedProject.creatorAvatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    selectedProject.creatorName?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{selectedProject.creatorName}</span>
                    <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full font-bold">
                      👑 Project Pitcher
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    {selectedProject.creatorCollege}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition shadow-xs flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <GitBranch size={15} />
                    <span>Shared Repo</span>
                  </a>
                )}
                {selectedProject.communicationLink && (
                  <a
                    href={selectedProject.communicationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition shadow-xs flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <MessageSquare size={15} className="text-indigo-600" />
                    <span>Join {selectedProject.communicationChannel || 'Team'} Chat</span>
                  </a>
                )}
                {selectedProject.isCreator && (
                  <button
                    onClick={() => handleDeleteProject(selectedProject._id)}
                    className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition cursor-pointer text-xs font-bold flex items-center gap-1"
                    title="Delete project"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-600 mb-2">
                About The Project Vision
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-100 rounded-2xl p-4">
                {selectedProject.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-600 mb-2">
                Tech Stack Required
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.techStack?.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── INTERACTIVE SEAT BOOKING DECK (CORE TICKET SYSTEM) ── */}
            <div className="mb-8 p-5 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl text-white shadow-xl border border-indigo-900/50">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                    <Ticket size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Collaboration Seat Map & Booking Deck
                    </h3>
                    <p className="text-xs text-slate-300">
                      Select an open seat to send your details to the project pitcher. Confirmed seats show verified collaborators.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Available Seat</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span>Filled / Booked</span>
                  </span>
                </div>
              </div>

              {/* Grid of Seats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(selectedProject.bookingSlots || []).map((slot) => {
                  const isBooked = slot.status === 'reserved';
                  const isLead = slot.slotNumber === 1;
                  const isCurrentUserOccupant = user && slot.filledBy?.userId && String(slot.filledBy.userId) === String(user._id);

                  // Has the current user applied for this specific seat?
                  const userAppForThisSlot = (selectedProject.applications || []).find(
                    app => String(app.applicantId) === String(user?._id) && app.slotNumber === slot.slotNumber
                  );

                  return (
                    <div
                      key={slot.slotNumber}
                      className={`relative rounded-2xl p-4 border transition-all ${
                        isBooked
                          ? isLead
                            ? 'bg-indigo-950/40 border-indigo-500/40 text-white'
                            : 'bg-slate-800/60 border-slate-700/60 text-white'
                          : 'bg-emerald-950/30 border-emerald-500/40 text-white hover:border-emerald-400 hover:bg-emerald-950/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                            isBooked ? 'bg-white/10 text-slate-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            SEAT #{slot.slotNumber < 10 ? `0${slot.slotNumber}` : slot.slotNumber}
                          </span>
                          {isLead && (
                            <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-indigo-500/30 text-indigo-200">
                              👑 Lead Pitcher
                            </span>
                          )}
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          isBooked
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {isBooked ? 'Filled Seat' : 'Open for Booking'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">
                        {slot.roleTitle}
                      </h4>

                      {/* Skills required */}
                      {slot.skillsRequired?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3.5">
                          {slot.skillsRequired.map((skill, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-slate-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Seat Occupant or Booking Action */}
                      {isBooked ? (
                        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {slot.filledBy?.avatar ? (
                                <img src={slot.filledBy.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                              ) : (
                                slot.filledBy?.name?.charAt(0) || 'C'
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                                <span>{slot.filledBy?.name || 'Verified Teammate'}</span>
                                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {slot.filledBy?.college || 'Engineering Campus'}
                              </p>
                            </div>
                          </div>

                          {isCurrentUserOccupant ? (
                            <span className="px-2.5 py-1 rounded-xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold shrink-0">
                              Your Seat 🎉
                            </span>
                          ) : slot.filledBy?.github ? (
                            <a
                              href={slot.filledBy.github}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition shrink-0"
                              title="View Collaborator Profile"
                            >
                              <ExternalLink size={13} />
                            </a>
                          ) : null}
                        </div>
                      ) : (
                        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                          <p className="text-xs text-emerald-300 font-medium">
                            Seat open for assignment
                          </p>

                          {selectedProject.isCreator ? (
                            <span className="text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
                              Awaiting Applicant
                            </span>
                          ) : userAppForThisSlot ? (
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              userAppForThisSlot.status === 'declined'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {userAppForThisSlot.status === 'declined' ? 'Request Declined' : 'Under Review'}
                            </span>
                          ) : (
                            <button
                              onClick={() => openBookingModalForSlot(selectedProject, slot)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                            >
                              <Ticket size={13} />
                              <span>Book Seat #{slot.slotNumber}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── PITCHER VERIFICATION DESK (VISIBLE ONLY TO CREATOR / ADMIN) ── */}
            {selectedProject.isCreator && (
              <div className="mb-6 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Pitcher Verification Desk: Seat Applications ({selectedProject.applications?.length || 0})
                      </h4>
                      <p className="text-xs text-slate-600">
                        Review collaborator credentials and contact info. Approve to fill their requested seat!
                      </p>
                    </div>
                  </div>
                </div>

                {(!selectedProject.applications || selectedProject.applications.length === 0) ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <Clock size={24} className="text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No collaborator applications yet</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      When students apply for your open seats, their verification requests will appear here for your approval.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedProject.applications.map((app, idx) => {
                      const isPending = app.status === 'pending';

                      return (
                        <div key={app._id || idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div>
                              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{app.applicantName}</span>
                                <span className="text-slate-600 font-normal">({app.applicantCollege || 'Student'})</span>
                              </p>
                              <p className="text-xs font-semibold text-indigo-600">
                                Applied for: <span className="font-bold">Seat #{app.slotNumber || '?'}: {app.slotRole || app.roleApplied}</span>
                              </p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                              app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                              app.status === 'declined' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {app.status === 'accepted' ? '✓ Seat Assigned & Filled' : app.status}
                            </span>
                          </div>

                          {/* Applicant contact details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 mb-2">
                            <div>
                              <span className="font-bold text-slate-700">Direct Contact: </span>
                              <span>{app.applicantPhoneOrContact || app.applicantEmail || 'Not provided'}</span>
                            </div>
                            {app.skillsSummary && (
                              <div>
                                <span className="font-bold text-slate-700">Skills / Tech: </span>
                                <span>{app.skillsSummary}</span>
                              </div>
                            )}
                            {app.portfolioOrGithub && (
                              <div className="sm:col-span-2">
                                <span className="font-bold text-slate-700">GitHub / Portfolio: </span>
                                <a href={app.portfolioOrGithub} target="_blank" rel="noreferrer" className="text-indigo-600 underline font-medium">
                                  {app.portfolioOrGithub}
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Collaborator Pitch Message */}
                          <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-slate-100 mb-3 leading-relaxed">
                            "{app.pitchMessage}"
                          </p>

                          {/* Pitcher Decision Buttons */}
                          {isPending && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleManageApplication(selectedProject._id, app._id, 'accept')}
                                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Check size={14} />
                                <span>Approve & Fill Seat #{app.slotNumber || ''}</span>
                              </button>
                              <button
                                onClick={() => handleManageApplication(selectedProject._id, app._id, 'decline')}
                                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Footer Connect Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleUpvote(selectedProject._id)}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-rose-700 cursor-pointer"
              >
                <Heart size={16} className={selectedProject.hasUpvoted ? 'fill-rose-600 text-rose-700' : ''} />
                <span>{selectedProject.upvotesCount || 0} students interested</span>
              </button>

              <div className="flex items-center gap-2">
                {(selectedProject.isCreator || selectedProject.isMember) && (
                  <Link
                    to={`/build-together/${selectedProject._id}/workspace`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition shadow-sm flex items-center gap-1.5"
                  >
                    <MessageSquare size={16} />
                    Open Team Workspace
                  </Link>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: BOOK COLLABORATION SEAT (TICKET PASS FORM) ── */}
      {isBookingModalOpen && selectedProject && selectedSlotForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Ticket Header */}
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Ticket size={24} />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-emerald-100 text-emerald-700">
                  Seat #{selectedSlotForBooking.slotNumber} Reservation
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {selectedSlotForBooking.roleTitle}
                </h3>
                <p className="text-xs text-slate-600 truncate max-w-xs">
                  Pitcher: {selectedProject.creatorName} ({selectedProject.creatorCollege})
                </p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Seat Request Sent!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
                  Your details have been submitted to <span className="font-bold text-slate-900">{selectedProject.creatorName}</span>. Once verified and approved, Seat #{selectedSlotForBooking.slotNumber} will be marked as filled by you!
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                {bookingError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 flex items-center gap-2" role="alert">
                    <AlertCircle size={15} />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.name}
                      onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      College / Campus *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GLA University"
                      value={bookingForm.college}
                      onChange={e => setBookingForm({ ...bookingForm, college: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Direct Contact (WhatsApp / Discord / Phone) *</span>
                    <span className="text-xs text-slate-400 font-normal">For pitcher to reach you</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WhatsApp: +91 9876543210 or Discord: username#1234"
                    value={bookingForm.contact}
                    onChange={e => setBookingForm({ ...bookingForm, contact: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Relevant Skills for this Seat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React, TailwindCSS, REST APIs, Git"
                    value={bookingForm.skills}
                    onChange={e => setBookingForm({ ...bookingForm, skills: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GitHub / Portfolio URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-username"
                    value={bookingForm.github}
                    onChange={e => setBookingForm({ ...bookingForm, github: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Pitch to the Pitcher *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Why do you want this seat? Mention past projects, availability, and what you're excited to contribute..."
                    value={bookingForm.pitch}
                    onChange={e => setBookingForm({ ...bookingForm, pitch: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-600 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Ticket size={14} />
                    <span>{isSubmittingBooking ? 'Submitting Request...' : `Submit Seat #${selectedSlotForBooking.slotNumber} Request`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: PITCH A PROJECT (CREATOR OPENS SEATS) ── */}
      {isPitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
            <button
              onClick={() => setIsPitchModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Rocket size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pitch a Project & Open Seats</h2>
                <p className="text-xs text-slate-600">You will hold Seat #1 (Lead). Add seats for other developers to book.</p>
              </div>
            </div>

            {pitchError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle size={16} />
                <span>{pitchError}</span>
              </div>
            )}

            <form onSubmit={handlePitchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeForge: Realtime Collaborative IDE"
                  value={pitchForm.title}
                  onChange={e => setPitchForm({ ...pitchForm, title: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  One-Line Catchy Tagline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Docs meets VS Code with WebRTC audio & live terminal execution"
                  value={pitchForm.tagline}
                  onChange={e => setPitchForm({ ...pitchForm, tagline: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={pitchForm.category}
                    onChange={e => setPitchForm({ ...pitchForm, category: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-indigo-600 focus:outline-none bg-white"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Goal *
                  </label>
                  <select
                    value={pitchForm.targetGoal}
                    onChange={e => setPitchForm({ ...pitchForm, targetGoal: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-indigo-600 focus:outline-none bg-white"
                  >
                    {TARGET_GOALS.filter(g => g !== 'All Goals').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Project Description & Vision *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the problem you are solving, target architecture, and what you plan to accomplish..."
                  value={pitchForm.description}
                  onChange={e => setPitchForm({ ...pitchForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-indigo-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, WebRTC, Docker, TailwindCSS"
                  value={pitchForm.techStack}
                  onChange={e => setPitchForm({ ...pitchForm, techStack: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Roles Needed / Booking Slots to create */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    Seats & Roles Needed (Seat 1 is reserved for you as Pitcher)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRoleRow}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Seat Role
                  </button>
                </div>

                <div className="space-y-2.5">
                  {pitchForm.rolesNeeded.map((role, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Role title (e.g. Frontend Architect)"
                          value={role.roleTitle}
                          onChange={e => {
                            const updated = pitchForm.rolesNeeded.map((item, i) => i === idx ? { ...item, roleTitle: e.target.value } : item);
                            setPitchForm({ ...pitchForm, rolesNeeded: updated });
                          }}
                          className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-xs focus:border-indigo-600 focus:outline-none"
                        />
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={role.count}
                          onChange={e => {
                            const updated = pitchForm.rolesNeeded.map((item, i) => i === idx ? { ...item, count: parseInt(e.target.value, 10) || 1 } : item);
                            setPitchForm({ ...pitchForm, rolesNeeded: updated });
                          }}
                          className="w-16 h-10 px-2 rounded-lg border border-slate-200 text-xs text-center focus:border-indigo-600 focus:outline-none"
                          title="Number of seats for this role"
                          aria-label="Number of seats for this role"
                        />
                        {pitchForm.rolesNeeded.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRoleRow(idx)}
                            className="p-2 text-slate-400 hover:text-rose-700 transition cursor-pointer"
                            aria-label="Remove role"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Key skills needed (e.g. React, Tailwind, Next.js)"
                        value={role.skills}
                        onChange={e => {
                          const updated = pitchForm.rolesNeeded.map((item, i) => i === idx ? { ...item, skills: e.target.value } : item);
                          setPitchForm({ ...pitchForm, rolesNeeded: updated });
                        }}
                        className="mt-2 w-full h-10 px-3 rounded-lg border border-slate-200 text-xs focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GitHub / Repo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={pitchForm.githubUrl}
                    onChange={e => setPitchForm({ ...pitchForm, githubUrl: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Team Chat Channel
                  </label>
                  <select
                    value={pitchForm.communicationChannel}
                    onChange={e => setPitchForm({ ...pitchForm, communicationChannel: e.target.value })}
                    className="mb-2 w-full h-11 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-indigo-600 focus:outline-none bg-white"
                  >
                    {['Discord', 'WhatsApp', 'Slack', 'Other'].map(channel => (
                      <option key={channel} value={channel}>{channel}</option>
                    ))}
                  </select>
                  <input
                    type="url"
                    placeholder="Invite link for your team chat"
                    value={pitchForm.communicationLink}
                    onChange={e => setPitchForm({ ...pitchForm, communicationLink: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPitchModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPitch}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPitch ? 'Publishing...' : 'Publish Pitch & Open Booking Slots 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
