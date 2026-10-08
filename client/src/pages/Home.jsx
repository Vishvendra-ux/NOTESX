import { useState, useEffect } from 'react';
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

const liveQueries = [
  {
    q: "Explain Dijkstra vs Bellman-Ford negative cycles?",
    tag: "AI Tutor • Unit 4 Algo",
    res: "Solved in 3 steps • Unit 4 Algorithms notes & PYQs linked",
    match: "99% Syllabus Match"
  },
  {
    q: "Looking for 2 full-stack teammates for campus hackathon",
    tag: "BuildTogether • Lab",
    res: "3 GLA & 2 NIT batchmates ready to build with you",
    match: "Live Teaming"
  },
  {
    q: "GATE CS Operating Systems: Process Sync & Semaphores",
    tag: "GATE CS 2027 • Mock Arena",
    res: "128 Topic MCQs with AIR 214 solutions ready",
    match: "Topper Verified"
  },
  {
    q: "Web Dev Roadmap: Frontend to Backend Milestone 3",
    tag: "Career Roadmaps",
    res: "Interactive checklist with 14 hands-on projects",
    match: "Industry Standard"
  }
];

const collegeRow1 = [
  { name: 'GLA University', badge: '2.4k Students', icon: '🏛️' },
  { name: 'IIT Delhi', badge: 'Verified PYQs', icon: '⚡' },
  { name: 'IIT Bombay', badge: 'Rank 1 Hub', icon: '🏆' },
  { name: 'NIT Trichy', badge: 'AIR 214 Alum', icon: '🔥' },
  { name: 'BITS Pilani', badge: 'Hackathon Lead', icon: '🚀' },
  { name: 'DTU Delhi', badge: 'Internship Portal', icon: '💼' },
  { name: 'IIIT Hyderabad', badge: 'AI & Coding', icon: '🧠' },
  { name: 'VIT Vellore', badge: '3.1k Active', icon: '🎓' }
];

const collegeRow2 = [
  { name: 'Anna University', badge: 'Units 1-5', icon: '📚' },
  { name: 'AKTU Lucknow', badge: '4.8k Students', icon: '🏛️' },
  { name: 'IIT Kanpur', badge: 'GATE Toppers', icon: '🎯' },
  { name: 'NIT Surathkal', badge: 'Project Labs', icon: '💻' },
  { name: 'IIT Kharagpur', badge: 'Verified Notes', icon: '📖' },
  { name: 'Jadavpur University', badge: 'Core Engg', icon: '⚙️' },
  { name: 'BITS Goa', badge: 'Open Source', icon: '🌐' },
  { name: 'Delhi University', badge: 'CS Community', icon: '✨' }
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
  const [queryIndex, setQueryIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQueryIndex((prev) => (prev + 1) % liveQueries.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  const filteredServices = activeCategory === 'all'
    ? allServices
    : allServices.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-24 pb-20 sm:space-y-32">
      {/* QUICK SURF / DISCOVERY RIBBON */}
      <section className="relative -mt-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2.5 min-w-max px-1">
          <span className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping-radar absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <Zap size={14} className="text-indigo-600 dark:text-indigo-400" /> Quick Surf:
          </span>
          {quickSurfPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <Link
                key={pill.name}
                to={pill.to}
                className="group sheen-btn flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-400/80 hover:bg-indigo-50/50 hover:text-indigo-700 hover:scale-[1.03] active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <Icon size={14} className="text-slate-400 group-hover:text-indigo-600 dark:text-slate-400 transition-colors" />
                <span>{pill.name}</span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-400 transition-colors">
                  {pill.badge}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* HERO SECTION (TAAI.LIVE SIGNATURE STYLING & ANIMATIONS) */}
      <section className="relative isolate overflow-hidden rounded-[2.5rem] border border-violet-900/40 taai-dot-matrix p-6 text-white shadow-2xl sm:p-10 lg:p-14">
        {/* Ambient Counter-Rotating Glow Orbs (from taai.live) */}
        <div className="pointer-events-none absolute -right-24 -top-36 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,127,183,0.24)_0%,rgba(139,92,246,0.12)_45%,transparent_68%)] animate-hero-orb-1" />
        <div className="pointer-events-none absolute -bottom-32 -left-28 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(77,139,255,0.22)_0%,rgba(139,92,246,0.12)_45%,transparent_68%)] animate-hero-orb-2" />

        {/* Ambient Twinkling Cosmic Sparkles */}
        <div className="pointer-events-none absolute left-1/4 top-10 text-pink-300 animate-twinkle-1 text-xs select-none">✦</div>
        <div className="pointer-events-none absolute left-1/2 top-20 text-violet-300 animate-twinkle-2 text-sm select-none">✧</div>
        <div className="pointer-events-none absolute right-1/3 top-14 text-blue-300 animate-twinkle-3 text-xs select-none">✦</div>
        <div className="pointer-events-none absolute left-12 bottom-20 text-pink-200 animate-twinkle-2 text-sm select-none">✦</div>
        <div className="pointer-events-none absolute right-16 bottom-14 text-violet-200 animate-twinkle-1 text-xs select-none">✧</div>

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="max-w-2xl">
            {/* Stagger 1: Badge with Live Radar Ping */}
            <div className="hero-in-1 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-950/60 px-4 py-2 text-xs font-bold text-violet-200 shadow-lg backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <Sparkles size={14} className="text-[#FF7FB7]" />
              <span>India's All-In-One Engineering Learning & Project Hub</span>
            </div>

            {/* Stagger 2: Title with Gradient Flow */}
            <h1 className="hero-in-2 mt-6 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.9rem]">
              Learn Smarter,
              <span className="mt-1 block bg-gradient-to-r from-[#FF7FB7] via-[#C4B0FF] to-[#4D8BFF] bg-clip-text text-transparent">
                Build Real Projects &
              </span>
              <span className="block text-white">Accelerate Your Degree.</span>
            </h1>

            {/* Stagger 3: Subtitle */}
            <p className="hero-in-3 mt-6 text-base leading-relaxed text-slate-300 sm:text-lg">
              Say goodbye to messy WhatsApp groups and dead Google Drive links. <strong className="text-white">NOTESX</strong> unites syllabus-aligned unit notes, a 24/7 AI study assistant, GATE practice arenas, peer hackathon teams, and verified tech internships in one unified student space.
            </p>

            {/* Stagger 4: Verified Checklist */}
            <div className="hero-in-4 mt-6 flex flex-col gap-2.5 text-sm text-slate-200 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#FF7FB7] shrink-0" />
                <span>Units 1 to 5 structured syllabi mapped to your university & semester</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#8B5CF6] shrink-0" />
                <span>24/7 AI Tutor + peer doubts forum for midnight conceptual clarity</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[#4D8BFF] shrink-0" />
                <span>GATE CS mock tests, BuildTogether team matching & vetted jobs</span>
              </div>
            </div>

            {/* Stagger 5: CTAs with Sweep Sheen */}
            <div className="hero-in-5 mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Link
                to="/notes"
                className="sheen-btn inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF7FB7] via-[#8B5CF6] to-[#4D8BFF] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_25px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_12px_35px_rgba(139,92,246,0.55)] hover:scale-105 active:scale-95"
              >
                <BookOpen size={18} />
                Explore Course Notes
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/ai-assistant"
                className="sheen-btn inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
              >
                <BrainCircuit size={18} className="text-[#C4B0FF]" />
                Ask 24/7 AI Tutor
              </Link>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-bold text-slate-300 transition hover:text-white hover:underline underline-offset-4"
              >
                All 9 Services ↓
              </a>
            </div>

            {/* Stagger 6: Trust Proof */}
            <div className="hero-in-6 mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" /> 10,000+ Verified Notes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" /> 50+ Top Indian Colleges
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-400" /> 100% Free Forever
              </span>
            </div>
          </div>

          {/* HERO VISUAL WITH TAAI-STYLE FLOATING BENTO CARDS & AI STUDENTS */}
          <div className="hero-in-6 relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Playful Wobbling Sticker Badge (taai.live signature) */}
            <div className="hero-sticker animate-wobble-sticker -top-6 -right-3 sm:-top-8 sm:-right-4">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-100">100% FREE</span>
                <span className="text-xs font-black tracking-wider text-white">VERIFIED</span>
                <span className="text-[9px] font-bold text-violet-200">NOTES & AI</span>
              </div>
            </div>

            {/* Main AI Student Photo Container */}
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/20 bg-slate-950 shadow-[0_32px_80px_-24px_rgba(20,16,43,0.85)]">
              <img
                src="/images/notesx-hero-students.jpg"
                alt="Diverse Indian engineering college students collaborating with laptops, tablets, and notes in modern campus library"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03] sm:aspect-[1.3/1]"
                fetchPriority="high"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07051a] via-[#07051a]/30 to-transparent" />

              {/* Live Campus Radar Pill (Top Left) */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/85 px-3.5 py-1.5 backdrop-blur-md shadow-lg sm:left-6 sm:top-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">Live Campus Network</span>
                <span className="text-[11px] font-medium text-slate-300">• 50+ Hubs</span>
              </div>

              {/* Interactive Live AI Query & Doubt Solver Widget */}
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-4 rounded-2xl border border-white/20 bg-slate-950/90 p-3 backdrop-blur-md shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between text-[11px] font-bold text-violet-300">
                  <span className="inline-flex items-center gap-1.5">
                    <BrainCircuit size={13} className="text-[#FF7FB7] animate-pulse" />
                    <span>{liveQueries[queryIndex].tag}</span>
                  </span>
                  <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-emerald-300 border border-emerald-500/30 font-mono text-[9px] font-bold">
                    {liveQueries[queryIndex].match}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span className="text-[#FF7FB7] font-mono">Q:</span>
                  <span className="truncate">"{liveQueries[queryIndex].q}"</span>
                  <span className="animate-cursor inline-block h-3.5 w-1 bg-[#FF7FB7] shrink-0" />
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
                  <Check size={12} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{liveQueries[queryIndex].res}</span>
                </div>
              </div>
            </div>

            {/* Floating Bento Card 1: Syllabus Coverage (animate-float-1) */}
            <div className="glass-bento-navy animate-float-1 absolute -bottom-8 -left-4 sm:-bottom-10 sm:-left-8 max-w-[250px] sm:max-w-[270px] rounded-2xl p-4 text-white shadow-2xl z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-violet-200 uppercase">
                  <BookOpen size={11} /> Syllabus Coverage
                </span>
                <span className="text-[10px] font-bold text-violet-300">Units 1 - 5</span>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between">
                <p className="text-xl font-black tracking-tight text-white">100% Curated</p>
                <span className="text-xs font-bold text-emerald-400">Verified PYQs</span>
              </div>
              {/* Animated Progress Bar (taai.live signature) */}
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="animate-bar-grow h-full w-full rounded-full bg-gradient-to-r from-[#FF7FB7] via-[#8B5CF6] to-[#4D8BFF]" />
              </div>
              <p className="mt-2 text-[11px] text-slate-300 leading-snug">
                Structured by semester & branch with senior formula sheets.
              </p>
            </div>

            {/* Floating Bento Card 2: BuildTogether Co-Builders (animate-float-2) */}
            <div className="glass-bento-rose animate-float-2 absolute -top-8 -right-4 sm:-top-10 sm:-right-6 max-w-[230px] sm:max-w-[250px] rounded-2xl p-4 text-white shadow-2xl z-10">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-pink-400/30 bg-pink-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-pink-200 uppercase">
                  <Users size={11} /> BuildTogether
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping-radar absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-black tracking-tight text-white">2,500+</p>
                <p className="text-[11px] font-semibold text-pink-200">Active Student Co-Builders</p>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img src="/images/notesx-avatar-rahul.jpg" alt="Student" className="h-6 w-6 rounded-full border border-slate-900 object-cover" />
                  <img src="/images/notesx-avatar-priya.jpg" alt="Student" className="h-6 w-6 rounded-full border border-slate-900 object-cover" />
                  <img src="/images/notesx-avatar-ayush.jpg" alt="Student" className="h-6 w-6 rounded-full border border-slate-900 object-cover" />
                </div>
                <span className="text-[10px] font-bold text-slate-300">Teaming up for hackathons</span>
              </div>
            </div>

            {/* Floating Bento Card 3: GATE CS AIR Benchmark (animate-float-3) */}
            <div className="glass-bento-navy animate-float-3 absolute -bottom-10 -right-2 sm:-bottom-12 sm:-right-4 max-w-[220px] sm:max-w-[240px] rounded-2xl p-3.5 text-white shadow-2xl z-20 hidden md:block">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-emerald-300 uppercase">
                  <Trophy size={10} /> AIR 214 Benchmark
                </span>
                <span className="text-[10px] font-extrabold text-[#38bdf8]">GATE CS</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-lg font-black tracking-tight text-white">88.4 / 100</p>
                  <p className="text-[10px] text-slate-300">Mock Exam Score</p>
                </div>
                <div className="relative grid h-10 w-10 place-items-center">
                  <svg className="h-10 w-10 -rotate-90 transform" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#FF7FB7] animate-pen-draw"
                      strokeDasharray="88, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-black text-white">88%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS & CREDIBILITY COUNTER (TAAI.LIVE SIGNATURE STATS) */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-900/40 taai-dot-matrix p-6 sm:p-10 shadow-2xl text-white">
        {/* Glowing streaks */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_90%_at_15%_50%,rgba(236,72,153,0.18)_0%,transparent_65%),radial-gradient(ellipse_35%_80%_at_50%_50%,rgba(139,92,246,0.18)_0%,transparent_65%),radial-gradient(ellipse_40%_90%_at_85%_50%,rgba(56,189,248,0.18)_0%,transparent_65%)]" />

        <div className="relative grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {/* Stat 1 */}
          <div className="flex flex-col items-center text-center p-3 relative">
            <div className="mb-4 h-0.5 w-10 rounded-full bg-[#ec4899] shadow-[0_0_12px_2px_rgba(236,72,153,0.7)]" />
            <p className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-b from-white via-[#ffc0dc] to-[#ec4899] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(236,72,153,0.5)]">
              50+
            </p>
            <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Campus Hubs
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              GLA, IITs, NITs, BITS, DTU & more
            </p>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center text-center p-3 relative lg:border-l lg:border-white/10">
            <div className="mb-4 h-0.5 w-10 rounded-full bg-[#8b5cf6] shadow-[0_0_12px_2px_rgba(139,92,246,0.7)]" />
            <p className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-b from-white via-[#d8b4fe] to-[#8b5cf6] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(139,92,246,0.5)]">
              10,000+
            </p>
            <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Curated Unit Notes
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Units 1 to 5 + Solved PYQs
            </p>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center text-center p-3 relative border-t border-white/10 pt-6 lg:border-t-0 lg:border-l lg:pt-3">
            <div className="mb-4 h-0.5 w-10 rounded-full bg-[#38bdf8] shadow-[0_0_12px_2px_rgba(56,189,248,0.7)]" />
            <p className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-b from-white via-[#bae6fd] to-[#38bdf8] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(56,189,248,0.5)]">
              15,000+
            </p>
            <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Practice Questions
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              GATE CS MCQs with full solutions
            </p>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center text-center p-3 relative border-t border-white/10 pt-6 lg:border-t-0 lg:border-l lg:pt-3">
            <div className="mb-4 h-0.5 w-10 rounded-full bg-[#10b981] shadow-[0_0_12px_2px_rgba(16,185,129,0.7)]" />
            <p className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-b from-white via-[#a7f3d0] to-[#10b981] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(16,185,129,0.5)]">
              2,500+
            </p>
            <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              Project Builders
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Teaming up & shipping real apps
            </p>
          </div>
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
                className="interactive-hover-card group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-400/80 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-500/70"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 ${service.iconBg}`}>
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
                    className="sheen-btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-indigo-700 transition group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white dark:bg-slate-800 dark:text-indigo-300 dark:group-hover:text-white"
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
          <div className="relative min-h-[360px] bg-slate-950 lg:col-span-5 overflow-hidden">
            <img
              src="/images/notesx-ai-study.jpg"
              alt="Dedicated Indian engineering student studying late evening with warm desk lamp and glowing AI study interface"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-bold backdrop-blur">
                <Lightbulb size={14} className="text-[#FF7FB7]" /> High-Yield Learning Focus
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

            <div className="mt-8 space-y-4">
              {comparisonPoints.map((item, index) => (
                <div
                  key={index}
                  className="interactive-hover-card rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <h4 className="text-sm font-extrabold text-slate-950 dark:text-white">
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
                className="sheen-btn btn-primary inline-flex items-center gap-2 text-xs font-bold py-2.5 px-5 rounded-xl shadow-md"
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
          {/* 4 Interactive Step Cards with Animated Flow Beam */}
          <div className="relative space-y-4 lg:col-span-7 pl-4 sm:pl-6">
            {/* Vertical Progressive Glow Beam */}
            <div className="pointer-events-none absolute left-0 top-6 bottom-6 w-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-28 w-full rounded-full bg-gradient-to-b from-[#FF7FB7] via-[#8B5CF6] to-[#4D8BFF] animate-vertical-beam" />
            </div>

            {onboardingSteps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  className="interactive-hover-card group relative flex items-start gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-700 font-black text-lg dark:from-indigo-950/70 dark:to-violet-950/70 dark:text-indigo-300 shadow-sm">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {step.title}
                      </h3>
                      <StepIcon size={18} className="text-slate-400 group-hover:text-indigo-600 dark:text-slate-500 transition-colors" />
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
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur shadow-md">
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
              className="interactive-hover-card flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                {/* Highlight Badge with subtle bounce */}
                <span className="animate-badge-bounce inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
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
                  className="sheen-btn btn-primary inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg"
                >
                  Find Your Campus Hub <ArrowRight size={14} />
                </Link>
                <Link
                  to="/register"
                  className="sheen-btn inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur hover:bg-white/20 transition"
                >
                  Create Student Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED UNIVERSITIES STRIP (INFINITE SMOOTH DUAL-MARQUEE) */}
      <section className="text-center overflow-hidden">
        <div className="mx-auto max-w-2xl px-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50/70 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
            <GraduationCap size={14} /> Campus Network
          </span>
          <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
            Active Across India's Premier Institutions
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Verified university syllabi, branch PYQs, and student communities from top engineering campuses
          </p>
        </div>

        {/* Marquee Wrapper with Smooth Left & Right Edge Fade Masks */}
        <div className="relative mt-8 overflow-hidden py-3 before:pointer-events-none before:absolute before:left-0 before:top-0 before:bottom-0 before:w-24 sm:before:w-36 before:z-10 before:bg-gradient-to-r before:from-[#F8FAFC] dark:before:from-[#0B1020] before:to-transparent after:pointer-events-none after:absolute after:right-0 after:top-0 after:bottom-0 after:w-24 sm:after:w-36 after:z-10 after:bg-gradient-to-l after:from-[#F8FAFC] dark:after:from-[#0B1020] after:to-transparent">
          {/* Row 1: Scrolling Left */}
          <div className="animate-marquee flex gap-3">
            {[...collegeRow1, ...collegeRow1].map((col, idx) => (
              <Link
                key={`r1-${col.name}-${idx}`}
                to="/colleges"
                className="group sheen-btn flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition hover:border-indigo-400 hover:scale-105 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <span className="text-base">{col.icon}</span>
                <span>{col.name}</span>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                  {col.badge}
                </span>
              </Link>
            ))}
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="animate-marquee-rev mt-3 flex gap-3">
            {[...collegeRow2, ...collegeRow2].map((col, idx) => (
              <Link
                key={`r2-${col.name}-${idx}`}
                to="/colleges"
                className="group sheen-btn flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition hover:border-purple-400 hover:scale-105 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <span className="text-base">{col.icon}</span>
                <span>{col.name}</span>
                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-extrabold text-purple-600 dark:bg-purple-950/80 dark:text-purple-400">
                  {col.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CLOSING CTA (TAAI-INSPIRED GLOW & ATMOSPHERE) */}
      <section className="relative overflow-hidden rounded-[2.5rem] taai-dot-matrix border border-violet-900/40 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 lg:px-16">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,127,183,0.25)_0%,rgba(139,92,246,0.12)_45%,transparent_68%)] animate-hero-orb-1" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(77,139,255,0.22)_0%,rgba(139,92,246,0.12)_45%,transparent_68%)] animate-hero-orb-2" />

        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-950/60 px-3.5 py-1.5 text-xs font-bold text-violet-200 backdrop-blur">
              <Sparkles size={14} className="text-[#FF7FB7]" />
              100% Free Forever for Engineering Students
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Ready to Upgrade Your <span className="bg-gradient-to-r from-[#FF7FB7] via-[#C4B0FF] to-[#4D8BFF] bg-clip-text text-transparent animate-gradient-flow">College Journey?</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              Unlock verified unit notes, 24/7 AI explanations, GATE tests, and team project workspaces today.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row">
            <Link
              to="/register"
              className="sheen-btn inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF7FB7] via-[#8B5CF6] to-[#4D8BFF] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_25px_rgba(139,92,246,0.4)] transition-all hover:shadow-[0_12px_32px_rgba(139,92,246,0.55)] hover:scale-105 active:scale-95"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link
              to="/notes"
              className="sheen-btn inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 backdrop-blur"
            >
              Browse Course Notes
            </Link>
            <Link
              to="/ai-assistant"
              className="sheen-btn inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 backdrop-blur"
            >
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
