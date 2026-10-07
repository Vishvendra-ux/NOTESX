import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  Compass,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Users,
  Check,
  Search,
  Award,
  ShieldCheck,
  TrendingUp,
  Zap,
  ChevronRight,
  Star,
  FileText,
  Code2,
  HelpCircle,
  ExternalLink,
  BookMarked
} from 'lucide-react';
import { Link } from 'react-router-dom';

const quickSurfPills = [
  { name: 'Course Notes', to: '/notes', icon: BookOpen, badge: 'Units 1-5' },
  { name: '24/7 AI Tutor', to: '/ai-assistant', icon: BrainCircuit, badge: 'Instant' },
  { name: 'GATE Arena', to: '/gate', icon: Target, badge: 'Test Series' },
  { name: 'BuildTogether', to: '/build-together', icon: Users, badge: 'Find Teams' },
  { name: 'Career Roadmaps', to: '/roadmaps', icon: Compass, badge: 'Tech Paths' },
  { name: 'Jobs & Internships', to: '/jobs', icon: Briefcase, badge: 'Fresher' },
  { name: 'Doubts Forum', to: '/doubts', icon: MessageCircle, badge: 'Q&A' },
  { name: 'Campus Hubs', to: '/colleges', icon: GraduationCap, badge: '50+ Colleges' },
  { name: 'Game Lounge', to: '/games', icon: Gamepad2, badge: 'Break Time' }
];

const allServices = [
  {
    category: 'academic',
    icon: BookOpen,
    title: 'Curated Course Notes & PYQs',
    tagline: 'Syllabus-aligned units with previous year papers',
    copy: 'Browse unit-by-unit study notes organized by University, Branch, Semester, and Subject. Access formula cheat-sheets, lecture summaries, and solved exam papers verified by top academic seniors.',
    to: '/notes',
    badge: 'Core Academic',
    color: 'from-blue-600 to-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
    features: [
      'Unit 1 to 5 structured syllabi',
      'Previous Year Questions (PYQs) & solutions',
      'High-yield formula & revision summaries'
    ]
  },
  {
    category: 'ai',
    icon: BrainCircuit,
    title: '24/7 AI Study Assistant',
    tagline: 'Your personal engineering tutor on demand',
    copy: 'Get instant conceptual clarity on complex theorems, debug code snippets, generate practice problems, and receive tailored explanations that point directly to corresponding campus notes.',
    to: '/ai-assistant',
    badge: 'AI Powered',
    color: 'from-violet-600 to-purple-600',
    iconBg: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
    features: [
      'Step-by-step math & code walkthroughs',
      'Context-aware answers mapped to syllabus',
      'Instant study summaries & quiz generation'
    ]
  },
  {
    category: 'academic',
    icon: Target,
    title: 'GATE CS Prep & Mock Arena',
    tagline: 'Topic-wise practice & simulated exams',
    copy: 'Master the complete GATE CS curriculum with high-quality MCQs, time-bound mock tests, syllabus progression tracking, and performance analytics modeled after actual national exams.',
    to: '/gate',
    badge: 'Exam Prep',
    color: 'from-rose-600 to-pink-600',
    iconBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
    features: [
      'Subject & topic-wise practice question banks',
      'Custom timed mock test generator',
      'Detailed solutions & accuracy diagnostics'
    ]
  },
  {
    category: 'career',
    icon: Users,
    title: 'BuildTogether Project Lab',
    tagline: 'Find co-builders, collaborate & ship apps',
    copy: 'Discover open student projects, apply for roles like Frontend, Backend, ML, or UI/UX, or post your own startup idea to recruit talented peers from campuses across India.',
    to: '/build-together',
    badge: 'Collaboration',
    color: 'from-emerald-600 to-teal-600',
    iconBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    features: [
      'Skill-based student team matching',
      'Dedicated collaborative workspaces',
      'Showcase portfolio apps for recruiters'
    ]
  },
  {
    category: 'career',
    icon: Compass,
    title: 'Career Roadmaps & Milestones',
    tagline: 'Verified industry paths from scratch',
    copy: 'Follow structured step-by-step career blueprints for Full-Stack, AI/ML, DevOps, Cloud, and Core Engineering with handpicked free resources, projects, and checklist milestones.',
    to: '/roadmaps',
    badge: 'Career Path',
    color: 'from-cyan-600 to-blue-600',
    iconBg: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300',
    features: [
      'Role & technology-based learning paths',
      'Interactive progress & milestone tracking',
      'Vetted free tutorials, docs & repositories'
    ]
  },
  {
    category: 'career',
    icon: Briefcase,
    title: 'Tech Jobs & Student Internships',
    tagline: 'Curated fresher openings without spam',
    copy: 'Browse verified internships, entry-level developer roles, and tech gigs tailored specifically for college students and recent grads. Apply directly with zero recruitment noise.',
    to: '/jobs',
    badge: 'Opportunities',
    color: 'from-amber-600 to-orange-600',
    iconBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    features: [
      'Vetted fresher & internship listings',
      'Role filters: Frontend, Backend, AI, Data',
      'Direct company application portals'
    ]
  },
  {
    category: 'ai',
    icon: MessageCircle,
    title: 'Doubts & Peer Discussion Forum',
    tagline: 'Get peer answers when you get stuck',
    copy: 'Post technical questions, paste error traces, or discuss challenging assignments. Receive answers from experienced seniors and batchmates with upvotes for the most helpful explanations.',
    to: '/doubts',
    badge: 'Peer Support',
    color: 'from-fuchsia-600 to-pink-600',
    iconBg: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300',
    features: [
      'Code syntax highlighting & image uploads',
      'Verified topper & peer responses',
      'Subject & topic categorization'
    ]
  },
  {
    category: 'community',
    icon: GraduationCap,
    title: 'College Campus Communities',
    tagline: 'Connect directly with your university peers',
    copy: 'Join verified community hubs for GLA University, IITs, NITs, BITS, DTU, and 50+ other campuses. Share university circulars, discuss internal exams, and exchange subject notes.',
    to: '/colleges',
    badge: 'Campus Hubs',
    color: 'from-indigo-600 to-blue-600',
    iconBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
    features: [
      '50+ campus-specific community boards',
      'Internal exam discussions & announcements',
      'Direct peer networking within your branch'
    ]
  },
  {
    category: 'community',
    icon: Gamepad2,
    title: 'Game Lounge & Study Breaks',
    tagline: 'Healthy mental recharge between sessions',
    copy: 'Unwind after intense study marathons with interactive mini-games, casual multiplayer rooms, and coding trivia challenges designed to refresh your mind without wasting time.',
    to: '/games',
    badge: 'Recharge',
    color: 'from-purple-600 to-indigo-600',
    iconBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
    features: [
      'Quick web minigames & memory challenges',
      'Multiplayer rooms to play with batchmates',
      'Designed for healthy, productive study breaks'
    ]
  }
];

const comparisonPoints = [
  {
    title: 'Syllabus-Aligned Precision vs. Messy Drive Folders',
    traditional: 'Scattered across 20+ WhatsApp groups and broken Google Drive links with duplicate, disorganized PDFs.',
    notesx: 'Structured Unit-by-Unit (Units 1 to 5) directly aligned with your university, branch, and semester curriculum.'
  },
  {
    title: 'Senior-Verified High-Yield Content',
    traditional: 'Unverified random uploads, illegible handwriting, and missing topics right before exam night.',
    notesx: 'Curated and vetted by academic toppers and rankers with clear formula sheets and solved previous years questions.'
  },
  {
    title: 'Active 24/7 AI Connected to Your Course',
    traditional: 'Generic chatbots that know nothing about your university syllabus or specific unit modules.',
    notesx: 'Intelligent AI study assistant that understands engineering topics and connects explanations directly to your campus notes.'
  },
  {
    title: 'Theory Linked to Real Projects & Tech Careers',
    traditional: 'Memorizing theory for marks, ending college with zero hands-on projects or industry portfolio.',
    notesx: 'Seamless progression from learning notes to finding teammates in BuildTogether, practicing in GATE Arena, and landing tech jobs.'
  }
];

const onboardingSteps = [
  {
    step: '01',
    title: 'Pin Your College & Fetch Unit Notes',
    description: 'Select your university, branch, and semester to instantly access unit-wise notes, handwritten summaries, and past papers before your lectures.',
    linkText: 'Browse Course Notes',
    linkTo: '/notes',
    icon: BookOpen
  },
  {
    step: '02',
    title: 'Unpack Complex Concepts with AI & Doubts',
    description: 'Stuck on an algorithm or mathematical proof at midnight? Ask the 24/7 AI Study Assistant or post in the Doubts forum for peer validation.',
    linkText: 'Ask AI Assistant',
    linkTo: '/ai-assistant',
    icon: BrainCircuit
  },
  {
    step: '03',
    title: 'Benchmark Retention in GATE Arena',
    description: 'Test your understanding with topic-wise MCQ quizzes and timed GATE simulations to pinpoint weak areas before exams.',
    linkText: 'Practice in GATE Arena',
    linkTo: '/gate',
    icon: Target
  },
  {
    step: '04',
    title: 'Build Team Projects & Land Internships',
    description: 'Collaborate with fellow students on BuildTogether to ship real-world portfolio apps, follow verified career roadmaps, and apply to tech jobs.',
    linkText: 'Find Project Teams',
    linkTo: '/build-together',
    icon: Rocket
  }
];

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'B.Tech CSE, 3rd Year',
    college: 'GLA University, Mathura',
    avatar: '/images/notesx-avatar-rahul.jpg',
    quote: 'Before NOTESX, our batch was drowning in 20 different WhatsApp groups for notes and past papers. Having unit-wise notes aligned to our semester syllabus plus the 24/7 AI tutor bumped my CGPA from 7.4 to 8.9.',
    highlight: 'CGPA jumped from 7.4 to 8.9'
  },
  {
    name: 'Priya Patel',
    role: 'ECE to CS Minor, 4th Year',
    college: 'NIT Trichy',
    avatar: '/images/notesx-avatar-priya.jpg',
    quote: 'The GATE Prep Arena and topic-wise MCQ tests gave me real exam simulation. Practicing every day and getting instant doubt resolutions helped me secure AIR 214 in GATE CSE! Absolute game-changer.',
    highlight: 'Secured AIR 214 in GATE CSE'
  },
  {
    name: 'Ayush Verma',
    role: 'B.Tech IT, Final Year',
    college: 'Delhi Technological University (DTU)',
    avatar: '/images/notesx-avatar-ayush.jpg',
    quote: 'I met my hackathon co-builder on NOTESX BuildTogether. We built a full-stack project together, followed the React/Node roadmap, and both received internship offers through the job portal!',
    highlight: 'Landed Tech Internship via BuildTogether'
  }
];

const featuredColleges = [
  'GLA University',
  'IIT Delhi',
  'IIT Bombay',
  'NIT Trichy',
  'BITS Pilani',
  'DTU Delhi',
  'Anna University',
  'AKTU',
  'VIT Vellore',
  'IIIT Hyderabad'
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all'
    ? allServices
    : allServices.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-24 pb-20 sm:space-y-32">
      {/* QUICK SURF / DISCOVERY RIBBON */}
      <section className="relative -mt-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2.5 min-w-max px-1">
          <span className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Zap size={14} className="text-indigo-600" /> Quick Surf:
          </span>
          {quickSurfPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <Link
                key={pill.name}
                to={pill.to}
                className="group flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <Icon size={14} className="text-slate-400 group-hover:text-indigo-600 dark:text-slate-400" />
                <span>{pill.name}</span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-400">
                  {pill.badge}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-gradient-to-br from-[#f8faff] via-white to-[#edf2ff] p-6 shadow-sm dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 sm:p-10 lg:p-14">
        {/* Glow ambient decorations */}
        <div className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/20" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-900/20" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/95 px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm dark:border-indigo-800/60 dark:bg-slate-800/90 dark:text-indigo-300">
              <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span>India's All-In-One Engineering Learning & Project Hub</span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl lg:text-[3.8rem]">
              Learn Smarter,
              <span className="mt-1 block bg-gradient-to-r from-indigo-700 via-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-blue-300 dark:to-violet-400">
                Build Real Projects &
              </span>
              <span className="block text-slate-950 dark:text-white">Accelerate Your Degree.</span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              Say goodbye to messy WhatsApp groups and dead Google Drive links. <strong>NOTESX</strong> unites syllabus-aligned unit notes, a 24/7 AI study assistant, GATE practice arenas, peer hackathon teams, and verified tech internships in one unified student space.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Link
                to="/notes"
                className="btn-primary inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold shadow-lg shadow-indigo-600/25"
              >
                <BookOpen size={18} />
                Explore Course Notes
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/ai-assistant"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold hover:border-indigo-300"
              >
                <BrainCircuit size={18} className="text-violet-600" />
                Ask 24/7 AI Tutor
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-xl px-4 py-3.5 text-sm font-bold text-slate-600 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                All 9 Services ↓
              </a>
            </div>

            {/* Trust highlights */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200/80 pt-6 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" /> 10,000+ Verified Notes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" /> 50+ Top Indian Colleges
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" /> 100% Free Forever
              </span>
            </div>
          </div>

          {/* HERO VISUAL WITH AI-GENERATED STUDENTS */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Background accent backdrop */}
            <div className="absolute -inset-3 -rotate-1 rounded-[2.5rem] bg-gradient-to-tr from-indigo-300/40 via-violet-200/30 to-blue-200/40 dark:from-indigo-950/60 dark:to-slate-800/60" />

            <div className="relative overflow-hidden rounded-[2.2rem] border-2 border-white/80 bg-slate-100 shadow-[0_32px_80px_-24px_rgba(30,27,75,0.35)] dark:border-slate-700/80 dark:bg-slate-800">
              <img
                src="/images/notesx-hero-students.jpg"
                alt="Diverse Indian engineering college students collaborating with laptops, tablets, and notes in modern campus library"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02] sm:aspect-[1.3/1]"
                fetchPriority="high"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

              {/* Floating Stat Card: Top Left */}
              <div className="absolute left-4 top-4 rounded-xl border border-white/20 bg-slate-900/80 px-3.5 py-2.5 text-white backdrop-blur-md shadow-lg sm:left-6 sm:top-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Live Campus Network</span>
                </div>
                <p className="mt-1 text-sm font-bold">50+ Universities Connected</p>
              </div>

              {/* Floating Stat Card: Bottom Right */}
              <div className="absolute bottom-4 right-4 max-w-[240px] rounded-2xl border border-white/20 bg-slate-900/85 p-3.5 text-white backdrop-blur-md shadow-xl sm:bottom-6 sm:right-6">
                <div className="flex items-center gap-2 text-indigo-300">
                  <Users size={16} />
                  <span className="text-xs font-bold">BuildTogether Active</span>
                </div>
                <p className="mt-1 text-xs text-slate-200 leading-snug">
                  2,500+ students actively teaming up for hackathons & side projects.
                </p>
              </div>

              {/* Bottom bar caption */}
              <div className="absolute bottom-4 left-4 text-white sm:bottom-6 sm:left-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
                  <Sparkles size={12} /> Student Powerhouse
                </span>
                <p className="mt-1.5 text-base font-extrabold sm:text-lg">Study together. Build together.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS & CREDIBILITY COUNTER */}
      <section className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-4 lg:p-8">
        <div className="border-r-0 border-b border-slate-100 p-3 pb-5 dark:border-slate-800 sm:p-4 lg:border-b-0 lg:border-r">
          <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400 sm:text-4xl">50+</p>
          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Partner & Campus Hubs</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">GLA, IITs, NITs, BITS, DTU & more</p>
        </div>
        <div className="border-b border-slate-100 p-3 pb-5 dark:border-slate-800 sm:p-4 lg:border-b-0 lg:border-r">
          <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400 sm:text-4xl">10,000+</p>
          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Curated Unit Notes</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Structured syllabus units & PYQs</p>
        </div>
        <div className="border-r-0 border-slate-100 p-3 pt-5 dark:border-slate-800 sm:p-4 lg:border-r lg:pt-4">
          <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400 sm:text-4xl">15,000+</p>
          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Practice Questions</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">GATE CS MCQs with full solutions</p>
        </div>
        <div className="p-3 pt-5 sm:p-4 lg:pt-4">
          <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400 sm:text-4xl">2,500+</p>
          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">Student Project Builders</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Collaborating on real tech products</p>
        </div>
      </section>

      {/* SECTION 1: WHAT SERVICES WE PROVIDE */}
      <section id="services" className="scroll-mt-24 space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              <Sparkles size={14} /> Full Spectrum Platform
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
              What Services We Provide
            </h2>
            <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
              NOTESX isn’t just a notes repository. It is a complete 9-pillar engineering operating system built to take you from first-semester basics to hackathons, exams, and high-paying jobs.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Services (9)' },
              { id: 'academic', label: 'Academic & Exams (2)' },
              { id: 'ai', label: 'AI & Doubts (2)' },
              { id: 'career', label: 'Career & Projects (3)' },
              { id: 'community', label: 'Campus & Lounge (2)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-500'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 9 Interactive Service Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-600/60"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm ${service.iconBg}`}>
                      <Icon size={24} />
                    </span>
                    <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-extrabold text-slate-950 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {service.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {service.copy}
                  </p>

                  {/* Concrete feature bullet points */}
                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <Check size={14} className="shrink-0 text-emerald-500" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-2">
                  <Link
                    to={service.to}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800 dark:text-indigo-300 dark:group-hover:bg-indigo-600 dark:group-hover:text-white"
                  >
                    Surf {service.title.split(' ')[0]} Hub
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: WHY WE ARE DIFFERENT FROM OTHERS */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid items-stretch lg:grid-cols-12">
          {/* AI-Generated Image: Student Late Night Study Setup */}
          <div className="relative min-h-[360px] bg-slate-900 lg:col-span-5">
            <img
              src="/images/notesx-ai-study.jpg"
              alt="Dedicated Indian engineering student studying late evening with warm desk lamp and glowing AI study interface"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-bold backdrop-blur">
                <Lightbulb size={14} /> High-Yield Learning Focus
              </span>
              <h4 className="mt-3 text-xl font-bold">No noise. Just pure exam and project clarity.</h4>
              <p className="mt-1 text-xs text-slate-300">
                Created to eliminate 2 AM exam panic and fragmented study material.
              </p>
            </div>
          </div>

          {/* Right Comparison Content */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              <ShieldCheck size={16} /> The Unfair Advantage
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
              Why NOTESX is Different From Others
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Most portals either dump unorganized PDFs or try to sell expensive test series. Here is why thousands of engineering students make NOTESX their primary browser tab:
            </p>

            <div className="mt-8 space-y-5">
              {comparisonPoints.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <div className="mt-2.5 grid gap-2 sm:grid-cols-2 text-xs">
                    <div className="rounded-xl border border-rose-200/60 bg-rose-50/60 p-2.5 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                      <span className="font-bold text-rose-600 block mb-0.5">✕ The Usual Way:</span>
                      {item.traditional}
                    </div>
                    <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/60 p-2.5 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <span className="font-bold text-emerald-600 block mb-0.5">✓ The NOTESX Way:</span>
                      {item.notesx}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/notes"
                className="btn-primary inline-flex items-center gap-2 text-xs font-bold py-2.5 px-4"
              >
                Experience The Difference <ArrowRight size={14} />
              </Link>
              <Link
                to="/colleges"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
              >
                Explore 50+ College Hubs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW YOU TAKE OUT MORE SERVICES FROM US (4-STEP BLUEPRINT) */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/60 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 sm:p-10 lg:p-14">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <TrendingUp size={16} /> Maximum Value Blueprint
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
            How to Extract Maximum Value from NOTESX
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            Follow this 4-step progressive workflow every semester to stay ahead in your classroom GPA, master competitive exam prep, and build an exceptional engineering portfolio.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-12">
          {/* 4 Interactive Step Cards */}
          <div className="space-y-4 lg:col-span-7">
            {onboardingSteps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  className="group relative flex items-start gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700 font-black text-lg dark:bg-indigo-950/70 dark:text-indigo-300">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {step.title}
                      </h3>
                      <StepIcon size={18} className="text-slate-400 group-hover:text-indigo-600 dark:text-slate-500" />
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {step.description}
                    </p>
                    <Link
                      to={step.linkTo}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      {step.linkText} <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI-Generated Image: Hackathon BuildTogether Team */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-2xl dark:border-slate-700">
              <img
                src="/images/notesx-build-together.jpg"
                alt="Energetic Indian student hackathon team collaborating on laptops and monitors debugging a project"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
                  <Rocket size={12} /> Step 4: Ship Together
                </span>
                <p className="mt-2 text-base font-black">
                  "Don't just study code. Ship apps that get you hired."
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Connect with frontend, backend & AI peers in BuildTogether.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WE PROVIDE THE BEST CONTENT FOR LEARNING (TESTIMONIALS & CAMPUS LIFE) */}
      <section className="space-y-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <Award size={16} /> Proven Results
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl">
            We Provide The Best Content For Learning
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            From GPA turnarounds to national rank achievements and tech internships—hear directly from students who use NOTESX every single day.
          </p>
        </div>

        {/* Photorealistic Student Testimonial Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                {/* Highlight Badge */}
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                  <Star size={12} className="fill-indigo-600 text-indigo-600" />
                  {t.highlight}
                </span>

                <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Student Profile Info */}
              <div className="mt-6 flex items-center gap-3.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <img
                  src={t.avatar}
                  alt={`Portrait of ${t.name}, student at ${t.college}`}
                  className="h-12 w-12 rounded-full border-2 border-indigo-200 object-cover shadow-sm dark:border-indigo-800"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-950 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-xs text-indigo-600 font-semibold dark:text-indigo-400">
                    {t.role}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.college}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CAMPUS LIFE PHOTO BANNER */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-900 shadow-lg dark:border-slate-800">
          <img
            src="/images/notesx-campus-life.jpg"
            alt="Joyful Indian college students walking together in campus courtyard in golden hour sunlight"
            className="h-64 w-full object-cover sm:h-80 lg:h-96"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12 text-white">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur">
                <GraduationCap size={15} /> Built for Indian Campuses
              </span>
              <h3 className="mt-3 text-2xl font-black sm:text-3xl lg:text-4xl">
                Join a Thriving Community of Ambitious Learners.
              </h3>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed sm:text-base">
                Whether you are studying at GLA University, an IIT, NIT, BITS, DTU, or a state university, NOTESX connects you to verified course notes, peer study groups, and hackathon teammates.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/colleges"
                  className="btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5"
                >
                  Find Your Campus Hub <ArrowRight size={14} />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur hover:bg-white/20 transition"
                >
                  Create Student Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED UNIVERSITIES STRIP */}
      <section className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Active Student Communities & Verified Syllabi Across Top Institutions
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {featuredColleges.map((college) => (
            <Link
              key={college}
              to="/colleges"
              className="rounded-full border border-slate-200/90 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            >
              🎓 {college}
            </Link>
          ))}
        </div>
      </section>

      {/* BOTTOM HIGH-CONVERTING CLOSING CTA */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#121640] via-[#1e256b] to-[#3644b3] px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 lg:px-16">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-100 backdrop-blur">
              <Sparkles size={14} />
              100% Free Forever for Engineering Students
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Ready to Upgrade Your College Journey?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-indigo-100 sm:text-lg">
              Unlock verified unit notes, 24/7 AI explanations, GATE tests, and team project workspaces today.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-indigo-900 shadow-xl transition hover:bg-indigo-50 active:scale-95"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link
              to="/notes"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 backdrop-blur"
            >
              Browse Course Notes
            </Link>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 backdrop-blur"
            >
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
