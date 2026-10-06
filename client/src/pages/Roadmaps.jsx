import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Compass, Search, ArrowRight, ArrowLeft, CheckCircle2, Circle, Clock,
  Award, Sparkles, BookOpen, ExternalLink, Code2, Layers,
  ChevronRight, BrainCircuit, Layout, Server, Cloud, Binary,
  Shield, Database, Smartphone, Check, Share2, Filter, Star,
  Terminal, Box, Zap, Cpu, GitBranch, FileText, SlidersHorizontal,
  Workflow, ListFilter, CheckCheck
} from 'lucide-react';
import { roadmapService } from '../services/api';

const ICON_MAP = {
  BrainCircuit,
  Layout,
  Server,
  Cloud,
  Binary,
  Shield,
  Database,
  Smartphone,
  Compass,
  Layers,
  Sparkles,
  Terminal,
  Box,
  Zap,
  Cpu,
  GitBranch,
  Workflow
};

const ROADMAP_TYPES = [
  { id: 'All Roadmaps', label: 'All Roadmaps', icon: Compass },
  { id: 'Role-based', label: 'Role-Based Paths', icon: Layers, desc: 'Complete career trajectories' },
  { id: 'Skill-based', label: 'Skill & Tech Roadmaps', icon: Zap, desc: 'Frameworks, tools & languages' }
];

const CATEGORIES = [
  'All Domains',
  'Web Development',
  'AI & Data Science',
  'Cloud & DevOps',
  'Languages & Frameworks',
  'Mobile & Software',
  'Databases & Architecture',
  'Core CS & Placement',
  'Cybersecurity'
];

const DIFFICULTIES = ['All Levels', 'Beginner Friendly', 'Intermediate', 'Advanced'];

export default function Roadmaps() {
  const { id: roadmapSlug } = useParams();
  const navigate = useNavigate();

  // If URL has /roadmaps/:id, show the detailed interactive roadmap
  if (roadmapSlug) {
    return <RoadmapDetail slug={roadmapSlug} onBack={() => navigate('/roadmaps')} />;
  }

  return <RoadmapDirectory />;
}

// ─────────────────────────────────────────────────────────────
// 1. DIRECTORY VIEW: Browse All Engineering Roadmaps (like roadmap.sh)
// ─────────────────────────────────────────────────────────────
function RoadmapDirectory() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All Roadmaps');
  const [selectedCategory, setSelectedCategory] = useState('All Domains');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');

  // Load user progress from localStorage
  const [completedNodesMap, setCompletedNodesMap] = useState({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('notesx:roadmap:completed_nodes') || '{}');
      setCompletedNodesMap(saved);
    } catch {
      setCompletedNodesMap({});
    }
  }, []);

  useEffect(() => {
    fetchRoadmaps();
  }, [selectedType, selectedCategory, selectedDifficulty]);

  const fetchSeq = useRef(0);
  const fetchRoadmaps = async () => {
    const seq = ++fetchSeq.current;
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedType !== 'All Roadmaps') params.type = selectedType;
      if (selectedCategory !== 'All Domains') params.category = selectedCategory;
      if (selectedDifficulty !== 'All Levels') params.difficulty = selectedDifficulty;

      const res = await roadmapService.list(params);
      if (seq !== fetchSeq.current) return; // a newer request superseded this one
      setRoadmaps(res.data || []);
    } catch (err) {
      if (seq !== fetchSeq.current) return;
      console.error('Failed to load roadmaps:', err);
      setError('Could not load career roadmaps. Please try again.');
    } finally {
      if (seq === fetchSeq.current) setLoading(false);
    }
  };

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((r) => {
      // Type filter
      if (selectedType !== 'All Roadmaps' && r.roadmapType && r.roadmapType !== selectedType) {
        return false;
      }
      // Search filter
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        r.title?.toLowerCase().includes(q) ||
        r.subtitle?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q)) ||
        r.careerPaths?.some((cp) => cp.toLowerCase().includes(q))
      );
    });
  }, [roadmaps, search, selectedType]);

  const countsByType = useMemo(() => {
    const roleCount = roadmaps.filter((r) => r.roadmapType === 'Role-based').length;
    const skillCount = roadmaps.filter((r) => r.roadmapType === 'Skill-based').length;
    return {
      all: roadmaps.length,
      role: roleCount,
      skill: skillCount
    };
  }, [roadmaps]);

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Header Inspired by roadmap.sh Community Blueprints */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-6 sm:p-10 text-white mb-8 shadow-2xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-md">
              <Compass size={13} className="text-indigo-400" />
              <span>COMMUNITY ROADMAPS & CURRICULUMS</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-slate-300 backdrop-blur-md">
              <Sparkles size={11} className="text-amber-400" />
              <span>roadmap.sh Blueprint Format</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white mb-4">
            Master Tech Skills with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">Proven Blueprints</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
            Step-by-step career and skill pathways inspired by industry standards. Track your mastery topic by topic, learn with official documentation and curated tutorials, and build resume-worthy capstone projects.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, framework, or skill (e.g. React, Docker, Python, Full Stack, Go)..."
              className="w-full h-13 pl-11 pr-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white/15 focus:border-indigo-400 focus:outline-none transition shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Role-based vs Skill-based Toggle (roadmap.sh feature) */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-fit">
        {ROADMAP_TYPES.map((t) => {
          const isSelected = selectedType === t.id;
          const Icon = t.icon;
          const count =
            t.id === 'All Roadmaps'
              ? countsByType.all
              : t.id === 'Role-based'
              ? countsByType.role
              : countsByType.skill;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={15} />
              <span>{t.label}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isSelected
                    ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Pills & Difficulty Filter */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter size={14} className="text-indigo-600" />
            <span>Difficulty:</span>
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-slate-200 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <span className="text-slate-400 font-medium">
            Showing {filteredRoadmaps.length} roadmaps
          </span>
        </div>
      </div>

      {/* Roadmaps Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading industry roadmaps...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
          {error}
        </div>
      ) : filteredRoadmaps.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 max-w-md mx-auto">
          <Compass size={36} className="mx-auto text-indigo-500 mb-3 opacity-60" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">No Roadmaps Found</h3>
          <p className="text-xs text-slate-400 mb-4">Try clearing your search query or switching categories.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedType('All Roadmaps');
              setSelectedCategory('All Domains');
              setSelectedDifficulty('All Levels');
            }}
            className="btn-primary text-xs py-2 px-4"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((r) => {
            const IconComponent = ICON_MAP[r.icon] || Compass;
            const completedForThis = completedNodesMap[r.slug]?.length || 0;
            const totalNodes = r.totalNodes || 10;
            const progressPercent = Math.min(100, Math.round((completedForThis / totalNodes) * 100));

            return (
              <Link
                key={r.slug}
                to={`/roadmaps/${r.slug}`}
                className="glass-card group flex flex-col justify-between p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/80 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 relative overflow-hidden"
              >
                {/* Top Accent Strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${r.color || 'from-indigo-600 to-blue-500'} absolute top-0 inset-x-0`} />

                <div>
                  {/* Category, Type & Difficulty Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
                        {r.category}
                      </span>
                      {r.roadmapType && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                          {r.roadmapType === 'Role-based' ? 'Role Path' : 'Skill Blueprint'}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                      {r.difficulty}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color || 'from-indigo-600 to-blue-600'} text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent size={24} />
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {r.title}
                      </h2>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                        {r.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {r.description}
                  </p>

                  {/* Tags */}
                  {r.tags && r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {r.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                      {r.tags.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                          +{r.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer with Duration, Salary & Progress */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      <span>{r.estimatedDuration}</span>
                    </div>

                    <div className="font-bold text-slate-700 dark:text-slate-200">
                      {r.salaryRange}
                    </div>
                  </div>

                  {/* Progress Bar (if student started) */}
                  {completedForThis > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1 font-bold">
                        <span className="text-indigo-600 dark:text-indigo-400">{progressPercent}% Mastered</span>
                        <span className="text-slate-400">{completedForThis}/{totalNodes} topics</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Explore Roadmap</span>
                      <ArrowRight size={14} />
                    </span>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {r.totalStages || 4} Stages • {r.totalNodes || 10}+ Topics
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. DETAILED ROADMAP VIEW: Interactive Flow & Milestone Drawer
// ─────────────────────────────────────────────────────────────
function RoadmapDetail({ slug, onBack }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeNode, setActiveNode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [exportedChecklist, setExportedChecklist] = useState(false);

  // View mode: 'flowchart' (roadmap.sh graph style) or 'syllabus' (structured list)
  const [viewMode, setViewMode] = useState('flowchart');

  // Topic search & importance filter inside this roadmap
  const [topicFilter, setTopicFilter] = useState('');
  const [importanceFilter, setImportanceFilter] = useState('All');

  // Student Completed Nodes Set
  const [completedNodeIds, setCompletedNodeIds] = useState(new Set());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchRoadmapData();

    // Load progress for this roadmap
    try {
      const savedMap = JSON.parse(localStorage.getItem('notesx:roadmap:completed_nodes') || '{}');
      const list = savedMap[slug] || [];
      setCompletedNodeIds(new Set(list));
    } catch {
      setCompletedNodeIds(new Set());
    }
  }, [slug]);

  const fetchRoadmapData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await roadmapService.get(slug);
      setRoadmap(res.data);
      // Default to first node for preview
      if (res.data?.stages?.[0]?.nodes?.[0]) {
        setActiveNode(res.data.stages[0].nodes[0]);
      }
    } catch (err) {
      console.error('Failed to load roadmap:', err);
      setError('Could not locate roadmap details. Please return to the directory.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle node completion
  const toggleNodeCompletion = (nodeId) => {
    setCompletedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }

      // Persist to localStorage
      try {
        const savedMap = JSON.parse(localStorage.getItem('notesx:roadmap:completed_nodes') || '{}');
        savedMap[slug] = Array.from(next);
        localStorage.setItem('notesx:roadmap:completed_nodes', JSON.stringify(savedMap));
      } catch (e) {
        console.error('Failed to save progress:', e);
      }

      return next;
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportChecklist = () => {
    if (!roadmap) return;
    let md = `# Study Roadmap: ${roadmap.title}\n`;
    md += `**Domain:** ${roadmap.category} | **Difficulty:** ${roadmap.difficulty} | **Est. Time:** ${roadmap.estimatedDuration}\n\n`;
    md += `### Syllabus Checklist\n`;

    roadmap.stages?.forEach((stage, sIdx) => {
      md += `\n#### ${stage.title}\n`;
      stage.nodes?.forEach((node) => {
        const done = completedNodeIds.has(node.id) ? '[x]' : '[ ]';
        md += `- ${done} **${node.title}** (${node.importance || 'Recommended'})\n`;
        if (node.skills?.length) {
          md += `  * Competencies: ${node.skills.join(', ')}\n`;
        }
      });
    });

    navigator.clipboard.writeText(md);
    setExportedChecklist(true);
    setTimeout(() => setExportedChecklist(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading interactive curriculum roadmap...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">Roadmap Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'Could not find this curriculum.'}</p>
        <button type="button" onClick={onBack} className="btn-primary text-xs py-2 px-5">
          ← Back to Roadmaps
        </button>
      </div>
    );
  }

  const allNodes = roadmap.stages?.flatMap((s) => s.nodes || []) || [];
  const totalNodesCount = allNodes.length;
  const completedCount = allNodes.filter((n) => completedNodeIds.has(n.id)).length;
  const progressPercent = totalNodesCount > 0 ? Math.round((completedCount / totalNodesCount) * 100) : 0;
  const IconComponent = ICON_MAP[roadmap.icon] || Compass;

  // Filter nodes inside stages based on search & importance
  const filteredStages = roadmap.stages?.map((stage) => {
    const nodes = stage.nodes?.filter((node) => {
      // Importance filter
      if (importanceFilter === 'Crucial' && node.importance !== 'Crucial') return false;
      if (importanceFilter === 'Incomplete' && completedNodeIds.has(node.id)) return false;
      if (importanceFilter === 'Mastered' && !completedNodeIds.has(node.id)) return false;

      // Text search
      if (!topicFilter.trim()) return true;
      const q = topicFilter.toLowerCase().trim();
      return (
        node.title?.toLowerCase().includes(q) ||
        node.description?.toLowerCase().includes(q) ||
        node.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }) || [];

    return {
      ...stage,
      filteredNodes: nodes
    };
  }) || [];

  return (
    <div className="animate-fade-in pb-24">
      {/* Top Breadcrumb & Share / Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>All Roadmaps</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-extrabold truncate max-w-xs">{roadmap.title}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportChecklist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Export full roadmap checklist as markdown"
          >
            {exportedChecklist ? <CheckCheck size={14} className="text-emerald-500" /> : <FileText size={14} />}
            <span>{exportedChecklist ? 'Checklist Copied!' : 'Export Checklist'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied!' : 'Share Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Roadmap Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white mb-6 border border-indigo-900/50 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                {roadmap.category}
              </span>
              {roadmap.roadmapType && (
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300">
                  {roadmap.roadmapType}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300">
                {roadmap.difficulty}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/10 text-slate-300">
                Est. {roadmap.estimatedDuration}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2 flex items-center gap-3">
              <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roadmap.color || 'from-indigo-600 to-blue-600'} flex items-center justify-center shrink-0`}>
                <IconComponent size={22} />
              </span>
              <span>{roadmap.title}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-4">
              {roadmap.description}
            </p>

            {/* Career Outcomes & Salary */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Roles</span>
                <b className="text-indigo-300 font-semibold">{roadmap.careerPaths?.join(' • ') || 'Software Engineer'}</b>
              </div>
              <div className="h-6 w-px bg-white/20 hidden sm:block" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Expected Salary</span>
                <b className="text-emerald-400 font-bold">{roadmap.salaryRange}</b>
              </div>
            </div>
          </div>

          {/* Student Mastery Ring / Progress Box */}
          <div className="w-full lg:w-auto p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-4 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-700"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-black text-white">{progressPercent}%</span>
            </div>

            <div>
              <b className="block text-sm font-bold text-white">Your Progress</b>
              <span className="text-xs text-slate-300 font-medium">
                {completedCount} of {totalNodesCount} topics mastered
              </span>
              <p className="text-[10px] text-indigo-300 font-semibold mt-0.5">
                {progressPercent === 100 ? '🎉 Roadmap Completed!' : 'Click nodes to track progress'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Controls: Search Topics, Filter Status & View Switcher */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Topic search inside roadmap */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            placeholder="Search topics in this curriculum..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['All', 'Crucial', 'Incomplete', 'Mastered'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setImportanceFilter(f)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                importanceFilter === f
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {f} Topics
            </button>
          ))}
        </div>

        {/* View Mode Toggle: Flowchart (roadmap.sh style) vs Syllabus */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('flowchart')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'flowchart'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Workflow size={13} />
            <span>Flowchart View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('syllabus')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'syllabus'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListFilter size={13} />
            <span>Syllabus View</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Stage Timeline (Left 7 cols) & Detail Drawer (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stages & Nodes Flow (7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          {filteredStages.map((stage, stageIdx) => (
            <div
              key={stage.id || stageIdx}
              className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 relative overflow-hidden"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {stage.level || `Stage ${stageIdx + 1}`}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {stage.nodes?.filter((n) => completedNodeIds.has(n.id)).length || 0}/{stage.nodes?.length || 0} Done
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1.5 leading-snug">
                {stage.title}
              </h2>
              {stage.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {stage.description}
                </p>
              )}

              {/* If no nodes match filter */}
              {stage.filteredNodes.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                  No topics in this stage match your current filter.
                </div>
              ) : viewMode === 'flowchart' ? (
                /* Flowchart View: roadmap.sh Visual Path with connecting vertical lines */
                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900/60">
                  {stage.filteredNodes.map((node, nodeIdx) => {
                    const isCompleted = completedNodeIds.has(node.id);
                    const isSelected = activeNode?.id === node.id;

                    return (
                      <div key={node.id} className="relative">
                        {/* Node connector dot */}
                        <div
                          className={`absolute -left-6 top-3.5 w-3 h-3 rounded-full border-2 transition-all ${
                            isCompleted
                              ? 'bg-emerald-500 border-white dark:border-slate-900 ring-2 ring-emerald-500/20'
                              : isSelected
                              ? 'bg-indigo-600 border-white dark:border-slate-900 ring-2 ring-indigo-500/30'
                              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                          }`}
                        />

                        {/* Node Card */}
                        <div
                          onClick={() => setActiveNode(node)}
                          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                              : isCompleted
                              ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20'
                              : 'border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-850 hover:border-indigo-300 dark:hover:border-indigo-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Checkbox */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNodeCompletion(node.id);
                              }}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                              }`}
                              title={isCompleted ? 'Mark as incomplete' : 'Mark as mastered'}
                            >
                              {isCompleted && <Check size={14} strokeWidth={3} />}
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs sm:text-sm font-bold truncate ${
                                  isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'
                                }`}>
                                  {node.title}
                                </span>
                              </div>

                              <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                {node.skills?.slice(0, 3).join(' • ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              node.importance === 'Crucial'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60'
                                : node.importance === 'Recommended'
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {node.importance}
                            </span>

                            <ChevronRight size={16} className={isSelected ? 'text-indigo-600' : 'text-slate-300 dark:text-slate-600'} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Syllabus View: Compact list */
                <div className="space-y-2">
                  {stage.filteredNodes.map((node) => {
                    const isCompleted = completedNodeIds.has(node.id);
                    const isSelected = activeNode?.id === node.id;

                    return (
                      <div
                        key={node.id}
                        onClick={() => setActiveNode(node)}
                        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                            : isCompleted
                            ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/10'
                            : 'border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-850 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNodeCompletion(node.id);
                            }}
                            className={`w-5 h-5 rounded flex items-center justify-center transition shrink-0 ${
                              isCompleted ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                            }`}
                          >
                            {isCompleted && <Check size={12} strokeWidth={3} />}
                          </button>
                          <span className={`text-xs font-bold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                            {node.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {node.importance}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Milestone Detail Inspector (Right 5 Columns) */}
        <div className="lg:col-span-5 sticky top-24">
          {activeNode ? (
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-200/80 dark:border-slate-800 shadow-xl space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                    activeNode.importance === 'Crucial'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60'
                      : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                  }`}>
                    {activeNode.importance} Topic
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleNodeCompletion(activeNode.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      completedNodeIds.has(activeNode.id)
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <Check size={13} strokeWidth={3} />
                    <span>{completedNodeIds.has(activeNode.id) ? 'Mastered' : 'Mark as Done'}</span>
                  </button>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                  {activeNode.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeNode.description}
                </p>
              </div>

              {/* Skills to Master */}
              {activeNode.skills && activeNode.skills.length > 0 && (
                <div>
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-indigo-600" />
                    Key Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Free Curated Learning Resources */}
              {activeNode.resources && activeNode.resources.length > 0 && (
                <div>
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
                    <BookOpen size={13} className="text-indigo-600" />
                    Free Curated Resources
                  </span>
                  <div className="space-y-2">
                    {activeNode.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-800 transition"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="block text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                            {res.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {res.type} {res.isFree && '• 100% Free'}
                          </span>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Hands-on Projects */}
              {activeNode.projects && activeNode.projects.length > 0 && (
                <div>
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
                    <Code2 size={13} className="text-emerald-600" />
                    Recommended Projects to Build
                  </span>
                  <div className="space-y-2.5">
                    {activeNode.projects.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-950 bg-emerald-50/30 dark:bg-emerald-950/20"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <b className="text-xs font-bold text-slate-900 dark:text-white">
                            {proj.title}
                          </b>
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
                            {proj.difficulty}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2 font-normal">
                          {proj.description}
                        </p>
                        {proj.techStack && (
                          <div className="flex flex-wrap gap-1">
                            {proj.techStack.map((tech) => (
                              <span key={tech} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-8 text-center rounded-3xl border border-slate-200 dark:border-slate-800">
              <Compass size={32} className="mx-auto text-indigo-500 mb-2 opacity-60" />
              <p className="text-xs text-slate-500">Select any milestone topic from the left to inspect competencies, curated free resources, and capstone projects.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
