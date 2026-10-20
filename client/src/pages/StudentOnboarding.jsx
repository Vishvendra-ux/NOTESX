import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { collegeService } from '../services/api';
import { 
  Sparkles, GraduationCap, Building2, BookOpen, Calendar, 
  Code2, Globe, Share2, Target, CheckCircle2, 
  ArrowRight, ArrowLeft, Loader2, Award, Terminal, Trophy
} from 'lucide-react';

const COMMON_COLLEGES = [
  'GLA University',
  'IIT Delhi',
  'IIT Bombay',
  'IIT Madras',
  'IIT Roorkee',
  'IIT Kanpur',
  'IIT Kharagpur',
  'NIT Trichy',
  'NIT Surathkal',
  'BITS Pilani',
  'Delhi University (DU)',
  'Vellore Institute of Technology (VIT)',
  'SRM Institute of Science and Technology',
  'Manipal Institute of Technology (MIT)',
  'Thapar University',
  'Amity University',
];

const COMMON_COURSES = [
  'B.Tech Computer Science & Engineering (CSE)',
  'B.Tech Artificial Intelligence & Data Science',
  'B.Tech Information Technology (IT)',
  'B.Tech Electronics & Communication (ECE)',
  'B.Tech Mechanical Engineering',
  'B.Tech Electrical & Electronics (EEE)',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'B.Sc Computer Science / IT',
  'M.Tech Computer Science',
  'Other / Custom Course',
];

const YEARS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
  '5th Year / Dual Degree',
  'Postgraduate / Master’s',
  'Alumni / Graduate',
];

const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8',
];

const CAREER_GOALS = [
  { id: 'fullstack', label: 'Full-Stack Web & App Development', icon: '💻', desc: 'Building real-world web/mobile applications & systems' },
  { id: 'dsa_cp', label: 'DSA & Competitive Programming', icon: '⚡', desc: 'Grinding LeetCode, Codeforces & algorithmic contests' },
  { id: 'ai_ml', label: 'AI, Machine Learning & Data Science', icon: '🤖', desc: 'LLMs, PyTorch, computer vision & predictive models' },
  { id: 'gate', label: 'GATE CS / IT Competitive Exam', icon: '🎯', desc: 'Preparing for M.Tech at IISc/IITs & PSU recruitment' },
  { id: 'devops_cloud', label: 'Cloud, DevOps & Distributed Systems', icon: '☁️', desc: 'Kubernetes, AWS/GCP, Docker & high-scale infra' },
  { id: 'open_source', label: 'Open Source & Product Innovation', icon: '🚀', desc: 'Contributing to open ecosystem and building startups' },
];

const POPULAR_SKILLS = [
  'C++', 'Python', 'Java', 'JavaScript', 'TypeScript',
  'React', 'Node.js', 'Next.js', 'Express', 'MongoDB',
  'PostgreSQL', 'SQL', 'Docker', 'Git', 'TailwindCSS',
  'PyTorch', 'TensorFlow', 'Linux', 'Go', 'Rust'
];

export default function StudentOnboarding() {
  const { user, completeOnboarding } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [collegesList, setCollegesList] = useState(COMMON_COLLEGES);

  // Form Fields
  const [name, setName] = useState(() => user?.name || '');
  const [collegeName, setCollegeName] = useState(() => user?.collegeName || '');
  const [customCollege, setCustomCollege] = useState('');
  const [course, setCourse] = useState(() => user?.course || '');
  const [customCourse, setCustomCourse] = useState('');
  const [year, setYear] = useState(() => user?.year || '1st Year (Freshman)');
  const [isSemesterSystem, setIsSemesterSystem] = useState(true);
  const [semester, setSemester] = useState(() => user?.semester || 'Semester 1');
  const [customTerm, setCustomTerm] = useState('');

  // Coding Handles
  const [leetcode, setLeetcode] = useState(() => user?.codingProfiles?.handles?.leetcode || '');
  const [codeforces, setCodeforces] = useState(() => user?.codingProfiles?.handles?.codeforces || '');
  const [codechef, setCodechef] = useState(() => user?.codingProfiles?.handles?.codechef || '');

  // Dev Footprint & Aspirations
  const [github, setGithub] = useState(() => user?.github || '');
  const [linkedin, setLinkedin] = useState(() => user?.linkedin || '');
  const [careerGoal, setCareerGoal] = useState(() => user?.careerGoal || CAREER_GOALS[0].label);
  const [selectedSkills, setSelectedSkills] = useState(() => user?.skills?.length ? user.skills : ['C++', 'JavaScript', 'React']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [bio, setBio] = useState(() => user?.bio || '');

  // Fetch registered colleges from database
  useEffect(() => {
    let active = true;
    collegeService.list()
      .then(res => {
        if (!active || !Array.isArray(res.data)) return;
        const dbColleges = res.data.map(c => c.name).filter(Boolean);
        const combined = Array.from(new Set([...COMMON_COLLEGES, ...dbColleges]));
        setCollegesList(combined);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !selectedSkills.includes(clean)) {
      setSelectedSkills([...selectedSkills, clean]);
      setCustomSkillInput('');
    }
  };

  const validateStep1 = () => {
    if (!name.trim()) {
      setError('Please provide your full name.');
      return false;
    }
    const finalCollege = collegeName === 'Other' ? customCollege.trim() : collegeName.trim();
    if (!finalCollege) {
      setError('Please select or enter your college / university name.');
      return false;
    }
    const finalCourse = course === 'Other / Custom Course' ? customCourse.trim() : course.trim();
    if (!finalCourse) {
      setError('Please select or specify your course / degree.');
      return false;
    }
    if (!year) {
      setError('Please select your academic year.');
      return false;
    }
    if (!isSemesterSystem && !customTerm.trim()) {
      setError('Please specify your current academic term, annual year, or trimester.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setError('');
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setError('');

    const finalCollege = collegeName === 'Other' ? customCollege.trim() : collegeName.trim();
    const finalCourse = course === 'Other / Custom Course' ? customCourse.trim() : course.trim();
    const finalSemester = isSemesterSystem ? semester : customTerm.trim();

    const onboardingPayload = {
      name: name.trim(),
      collegeName: finalCollege,
      course: finalCourse,
      year,
      semester: finalSemester,
      codingHandles: {
        leetcode: leetcode.trim(),
        codeforces: codeforces.trim(),
        codechef: codechef.trim(),
      },
      github: github.trim(),
      linkedin: linkedin.trim(),
      careerGoal,
      skills: selectedSkills,
      bio: bio.trim() || `${year} student at ${finalCollege} studying ${finalCourse}.`,
    };

    try {
      await completeOnboarding(onboardingPayload);
      const destination = location.state?.from?.pathname || '/';
      navigate(destination === '/login' || destination === '/onboarding' ? '/' : destination, { replace: true });
    } catch (err) {
      console.error('Onboarding failed:', err);
      setError(err.response?.data?.message || 'Failed to complete profile setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-3xl mx-auto">
        {/* Header Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3 shadow-xs">
            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Student Onboarding & Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome to NOTESX, <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{name || 'Scholar'}</span>!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Set up your academic profile, link your competitive coding handles, and unlock your college study community and live leaderboard.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              type="button"
              onClick={() => step > 1 && setStep(1)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
                step === 1
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : step > 1
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 cursor-pointer'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <GraduationCap size={16} />
              <span>1. College & Course</span>
            </button>
            <button
              type="button"
              onClick={() => step > 2 && setStep(2)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
                step === 2
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : step > 2
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 cursor-pointer'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <Code2 size={16} />
              <span>2. Coding Handles</span>
            </button>
            <button
              type="button"
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
                step === 3
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <Target size={16} />
              <span>3. Skills & Career</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50/90 dark:bg-rose-950/30 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-start gap-2.5 animate-shake">
            <span className="shrink-0 text-rose-600">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Wizard Card */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl shadow-slate-900/5">
          {/* STEP 1: Academic Identity */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={22} />
                  Your Academic Profile
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Connect with classmates, access syllabus notes for your semester, and join your campus hub.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition"
                  required
                />
              </div>

              {/* College / University */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  College / University <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <select
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition cursor-pointer"
                  >
                    <option value="">-- Select Your College --</option>
                    {collegesList.map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                    <option value="Other">+ Other / My College is not listed</option>
                  </select>
                </div>

                {collegeName === 'Other' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customCollege}
                      onChange={(e) => setCustomCollege(e.target.value)}
                      placeholder="Type your exact college / university name..."
                      className="w-full h-11 px-4 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-950/20 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Degree / Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Degree / Program <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <BookOpen size={18} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition cursor-pointer"
                  >
                    <option value="">-- Select Your Degree / Course --</option>
                    {COMMON_COURSES.map((crs) => (
                      <option key={crs} value={crs}>{crs}</option>
                    ))}
                  </select>
                </div>

                {course === 'Other / Custom Course' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customCourse}
                      onChange={(e) => setCustomCourse(e.target.value)}
                      placeholder="e.g. B.Tech Cyber Security, Integrated M.Sc Data Science..."
                      className="w-full h-11 px-4 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/30 dark:bg-indigo-950/20 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Year & Semester Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Year of Study <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition cursor-pointer"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Semester / Academic Term */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Academic Term
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSemesterSystem(!isSemesterSystem)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                    >
                      {isSemesterSystem ? 'Not on Semester System?' : 'Switch to Semester'}
                    </button>
                  </div>

                  {isSemesterSystem ? (
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition cursor-pointer"
                    >
                      {SEMESTERS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={customTerm}
                      onChange={(e) => setCustomTerm(e.target.value)}
                      placeholder="e.g. Annual Year 2, Trimester 3, N/A"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition"
                    />
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Coding Profiles</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Coding & Platform Handles */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="text-indigo-600 dark:text-indigo-400" size={22} />
                  Connect Coding & Platform Handles
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  We automatically track your problems solved and contest ratings across LeetCode, Codeforces, and CodeChef to rank your college!
                </p>
              </div>

              {/* Informational Callout */}
              <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 flex items-start gap-3">
                <Trophy size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <strong>Earn +25 XP & Campus Ranking:</strong> Entering your usernames lets NOTESX track your live DSA progress. You can input raw usernames (e.g. <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">tourist</code>) or full profile URLs.
                </div>
              </div>

              {/* LeetCode Handle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    LeetCode Username / URL
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 lowercase">e.g. neal_wu or https://leetcode.com/u/neal_wu</span>
                </label>
                <div className="relative">
                  <Code2 size={17} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={leetcode}
                    onChange={(e) => setLeetcode(e.target.value)}
                    placeholder="leetcode username or profile URL"
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-amber-500 outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Codeforces Handle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Codeforces Handle / URL
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 lowercase">e.g. tourist</span>
                </label>
                <div className="relative">
                  <Code2 size={17} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={codeforces}
                    onChange={(e) => setCodeforces(e.target.value)}
                    placeholder="codeforces handle"
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-rose-500 outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* CodeChef Handle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    CodeChef Handle / URL
                  </span>
                  <span className="text-[11px] font-normal text-slate-400 lowercase">e.g. chef_coder</span>
                </label>
                <div className="relative">
                  <Code2 size={17} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={codechef}
                    onChange={(e) => setCodechef(e.target.value)}
                    placeholder="codechef handle"
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Developer Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    GitHub Profile / Username
                  </label>
                  <div className="relative">
                    <Globe size={17} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="e.g. octocat or https://github.com/octocat"
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <Share2 size={17} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-600 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Skills & Aspirations</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Skills & Aspirations */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="text-indigo-600 dark:text-indigo-400" size={22} />
                  Your Career Goal & Tech Stack
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  We customize your roadmaps, doubt feeds, and project partner recommendations based on what you want to master.
                </p>
              </div>

              {/* Career Goal Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 uppercase tracking-wider">
                  Primary Career Focus <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAREER_GOALS.map((goal) => {
                    const isSelected = careerGoal === goal.label;
                    return (
                      <div
                        key={goal.id}
                        onClick={() => setCareerGoal(goal.label)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-xl shrink-0">{goal.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-xs font-bold leading-tight ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>
                              {goal.label}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                              {goal.desc}
                            </p>
                          </div>
                          {isSelected && <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                  Your Primary Tech Stack & Languages (Click to select)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {POPULAR_SKILLS.map((sk) => {
                    const active = selectedSkills.includes(sk);
                    return (
                      <button
                        type="button"
                        key={sk}
                        onClick={() => toggleSkill(sk)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          active
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {active ? `✓ ${sk}` : `+ ${sk}`}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Skill */}
                <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Add other skill (e.g. Flutter, GraphQL, Kotlin, Solidity)..."
                    className="flex-1 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-600"
                  />
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Short Bio / Headline (Optional)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. CSE sophomore passionate about fullstack web dev, cloud native systems, and competitive coding."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-600 transition resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-11 px-8 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Syncing & Launching...</span>
                    </>
                  ) : (
                    <>
                      <Award size={16} />
                      <span>Complete Setup & Launch NOTESX 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
