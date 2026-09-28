import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { 
  Search, Upload, Bookmark, BookOpen, Layers, X, 
  ArrowLeft, ArrowRight, Sparkles, Filter, CheckCircle2 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { hierarchyService, notesService } from '../services/api';

// Components
import BreadcrumbNav from '../components/notes/BreadcrumbNav';
import CourseCategoriesView from '../components/notes/views/CourseCategoriesView';
import DegreesView from '../components/notes/views/DegreesView';
import BranchesView from '../components/notes/views/BranchesView';
import BranchDashboardView from '../components/notes/views/BranchDashboardView';
import SemestersView from '../components/notes/views/SemestersView';
import SubjectsView from '../components/notes/views/SubjectsView';
import SubjectNotesView from '../components/notes/views/SubjectNotesView';
import UserBookmarksView from '../components/notes/views/UserBookmarksView';
import NoteViewerModal from '../components/notes/NoteViewerModal';
import UploadNoteModal from '../components/notes/UploadNoteModal';
import ReportModal from '../components/notes/ReportModal';
import LoadingSkeleton from '../components/notes/LoadingSkeleton';

export default function Notes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: routeNoteId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ── Hierarchy State (Loaded dynamically from MongoDB) ──
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [catalogCourses, setCatalogCourses] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);

  // Active selections
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isBookmarksView, setIsBookmarksView] = useState(false);

  // Notes filtering & pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilter, setUnitFilter] = useState('All Units');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(false);

  // Global search suggestions (courses, study areas, branches, subjects, notes)
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalResults, setGlobalResults] = useState([]);
  const [searchingGlobal, setSearchingGlobal] = useState(false);

  // User bookmarked note IDs set
  const [bookmarkedNoteIds, setBookmarkedNoteIds] = useState(new Set());
  const [bookmarkedNotesList, setBookmarkedNotesList] = useState([]);
  const [subjectBookmarked, setSubjectBookmarked] = useState(false);

  // Modals
  const [activeViewerNote, setActiveViewerNote] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [reportingNote, setReportingNote] = useState(null);
  const [successBanner, setSuccessBanner] = useState('');

  // ── 1. Fetch Categories on Mount ──
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await hierarchyService.getCategories();
        if (isMounted && data) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setCategoriesLoading(false);
        }
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  // Load the full course catalog once so search can find programmes from any category.
  useEffect(() => {
    let isMounted = true;
    const fetchCatalogCourses = async () => {
      try {
        const { data } = await hierarchyService.getCourses();
        if (isMounted && Array.isArray(data)) setCatalogCourses(data);
      } catch (err) {
        console.error('Error fetching course catalog:', err);
      } finally {
        if (isMounted) setCatalogLoading(false);
      }
    };
    fetchCatalogCourses();
    return () => { isMounted = false; };
  }, []);

  // ── 2. Load User Bookmarks ──
  useEffect(() => {
    let isMounted = true;
    const fetchUserBookmarks = async () => {
      if (!user) return;
      try {
        const { data } = await notesService.getBookmarks();
        if (isMounted && data && Array.isArray(data)) {
          setBookmarkedNotesList(data);
          const ids = new Set(data.map(n => n._id || n.id));
          setBookmarkedNoteIds(ids);
        }
      } catch (err) {
        // Ignored if unauthenticated
      }
    };
    fetchUserBookmarks();
    return () => { isMounted = false; };
  }, [user]);

  // Notification links can open a note directly at /notes/:id.
  useEffect(() => {
    if (!routeNoteId || routeNoteId === 'upload') {
      setActiveViewerNote(null);
      return undefined;
    }

    let isMounted = true;
    setActiveViewerNote(null);
    notesService.get(routeNoteId)
      .then(({ data }) => {
        if (isMounted) setActiveViewerNote(data);
      })
      .catch(() => {
        if (isMounted) navigate('/notes', { replace: true });
      });

    return () => { isMounted = false; };
  }, [routeNoteId, navigate]);

  // ── 3. Synchronize Active Selections with URL SearchParams (Enables Browser Back/Forward Step-by-Step) ──
  useEffect(() => {
    const catSlug = searchParams.get('category');
    const courseSlug = searchParams.get('course');
    const branchSlug = searchParams.get('branch');
    const yrNum = searchParams.get('year') ? parseInt(searchParams.get('year'), 10) : null;
    const semNum = searchParams.get('semester') ? parseInt(searchParams.get('semester'), 10) : null;
    const subjSlug = searchParams.get('subject');
    const isBm = searchParams.get('bookmarks') === 'true';

    setIsBookmarksView(isBm);

    // If no category in URL, reset everything down the line
    if (!catSlug) {
      setSelectedCategory(null);
      setSelectedCourse(null);
      setSelectedBranch(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSubject(null);
      return;
    }

    // Resolve Category
    if (categories.length > 0) {
      const foundCat = categories.find(c => c.slug === catSlug || c._id === catSlug);
      if (foundCat && (!selectedCategory || selectedCategory._id !== foundCat._id)) {
        setSelectedCategory(foundCat);
      }
    }

    // If no course in URL, reset deeper selections
    if (!courseSlug) {
      setSelectedCourse(null);
      setSelectedBranch(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSubject(null);
      return;
    }

    // Resolve Course
    if (courses.length > 0) {
      const foundCourse = courses.find(c => c.slug === courseSlug || c._id === courseSlug);
      if (foundCourse && (!selectedCourse || selectedCourse._id !== foundCourse._id)) {
        setSelectedCourse(foundCourse);
      }
    }

    // If no branch in URL, reset deeper selections
    if (!branchSlug) {
      setSelectedBranch(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSubject(null);
      return;
    }

    // Resolve Branch
    if (branches.length > 0) {
      const foundBranch = branches.find(b => 
        b.shortCode?.toLowerCase() === branchSlug.toLowerCase() || 
        b.slug === branchSlug || 
        b._id === branchSlug
      );
      if (foundBranch && (!selectedBranch || selectedBranch._id !== foundBranch._id)) {
        setSelectedBranch(foundBranch);
      }
    }

    // If no year in URL, reset deeper selections
    if (!yrNum) {
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSubject(null);
      return;
    }
    setSelectedYear(yrNum);

    // If no semester in URL, reset subject
    if (!semNum) {
      setSelectedSemester(null);
      setSelectedSubject(null);
      return;
    }
    setSelectedSemester(semNum);

    // If no subject in URL, reset subject
    if (!subjSlug) {
      setSelectedSubject(null);
      return;
    }

    // Resolve Subject
    if (subjects.length > 0) {
      const foundSubj = subjects.find(s => 
        s.slug === subjSlug || 
        s._id === subjSlug || 
        s.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === subjSlug
      );
      if (foundSubj && (!selectedSubject || selectedSubject._id !== foundSubj._id)) {
        setSelectedSubject(foundSubj);
      }
    }
  }, [searchParams, categories, courses, branches, subjects]);

  // ── 4. Load Courses when Category is Selected ──
  useEffect(() => {
    if (!selectedCategory) {
      setCourses([]);
      return;
    }
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data } = await hierarchyService.getCourses({ categoryId: selectedCategory._id });
        setCourses(data || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCategory]);

  // ── 5. Load Branches when Course is Selected ──
  useEffect(() => {
    if (!selectedCourse) {
      setBranches([]);
      return;
    }
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const { data } = await hierarchyService.getBranches({ courseId: selectedCourse._id });
        setBranches(data || []);
      } catch (err) {
        console.error('Error fetching branches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [selectedCourse]);

  // ── 6. Load Dynamic Years when Branch is Selected ──
  useEffect(() => {
    if (!selectedBranch) {
      setYears([]);
      return;
    }
    const fetchYears = async () => {
      try {
        setLoading(true);
        const { data } = await hierarchyService.getYears({ branchId: selectedBranch._id });
        setYears(data || []);
      } catch (err) {
        console.error('Error fetching years:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchYears();
  }, [selectedBranch]);

  // ── 7. Load Semesters when Year is Selected ──
  useEffect(() => {
    if (!selectedBranch || !selectedYear) {
      setSemesters([]);
      return;
    }
    const fetchSemesters = async () => {
      try {
        setLoading(true);
        const yrNum = typeof selectedYear === 'object' ? selectedYear.yearNumber : selectedYear;
        const { data } = await hierarchyService.getSemesters({
          branchId: selectedBranch._id,
          yearNumber: yrNum
        });
        setSemesters(data || []);
      } catch (err) {
        console.error('Error fetching semesters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, [selectedBranch, selectedYear]);

  // ── 8. Load Subjects when Semester is Selected ──
  useEffect(() => {
    if (!selectedBranch || !selectedSemester) {
      setSubjects([]);
      return;
    }
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const semNum = typeof selectedSemester === 'object' ? selectedSemester.semesterNumber : selectedSemester;
        const { data } = await hierarchyService.getSubjects({
          branchId: selectedBranch._id,
          yearNumber: typeof selectedYear === 'object' ? selectedYear.yearNumber : selectedYear,
          semesterNumber: semNum
        });
        setSubjects(data || []);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [selectedBranch, selectedSemester]);

  // ── 9. Load Notes when Subject is Selected ──
  useEffect(() => {
    if (!selectedSubject) {
      setNotes([]);
      return;
    }
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const params = {
          subjectId: selectedSubject._id,
          sort: sortBy
        };
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (unitFilter !== 'All Units') params.unit = unitFilter;
        if (fileTypeFilter !== 'all') params.fileType = fileTypeFilter;

        const { data } = await notesService.list(params);
        setNotes(data.notes || []);
      } catch (err) {
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [selectedSubject, searchQuery, unitFilter, fileTypeFilter, sortBy]);

  // ── Global Search Query Listener ──
  useEffect(() => {
    if (!globalSearch.trim()) {
      setGlobalResults([]);
      setSearchingGlobal(false);
      return;
    }

    let isCurrentSearch = true;
    setSearchingGlobal(true);

    const query = globalSearch.trim().toLowerCase();
    const matchesQuery = (...values) => values.some(value => String(value || '').toLowerCase().includes(query));
    const courseResults = catalogCourses
      .filter(course => matchesQuery(
        course.name,
        course.slug,
        course.badge,
        course.description,
        course.categoryId?.name
      ))
      .slice(0, 3)
      .map(course => ({
        type: 'course',
        data: course,
        title: course.name,
        subtitle: `${course.categoryId?.name || 'Course'} • ${course.badge || `${course.durationYears || ''} year programme`}`
      }));
    const categoryResults = categories
      .filter(category => matchesQuery(category.name, category.slug, category.description))
      .slice(0, 2)
      .map(category => ({
        type: 'category',
        data: category,
        title: category.name,
        subtitle: `${category.courseCount || 0} ${category.courseCount === 1 ? 'course' : 'courses'} • Study area`
      }));

    setGlobalResults([...courseResults, ...categoryResults]);

    const timeout = setTimeout(async () => {
      try {
        const [notesResult, branchesResult, subjectsResult] = await Promise.allSettled([
          notesService.list({ search: globalSearch.trim(), limit: 4 }),
          hierarchyService.getBranches({ search: globalSearch.trim() }),
          hierarchyService.getSubjects({ search: globalSearch.trim() })
        ]);

        if (!isCurrentSearch) return;

        const notesData = notesResult.status === 'fulfilled' ? notesResult.value.data : null;
        const branchesData = branchesResult.status === 'fulfilled' ? branchesResult.value.data : [];
        const subjectsData = subjectsResult.status === 'fulfilled' ? subjectsResult.value.data : [];

        const combined = [...courseResults, ...categoryResults];
        (branchesData || []).slice(0, 3).forEach(b => {
          combined.push({ type: 'branch', data: b, title: b.name, subtitle: `${b.shortCode} • Engineering Branch` });
        });
        (subjectsData || []).slice(0, 3).forEach(s => {
          combined.push({ type: 'subject', data: s, title: s.name, subtitle: `${s.code} • Subject` });
        });
        (notesData?.notes || []).slice(0, 4).forEach(n => {
          combined.push({ type: 'note', data: n, title: n.title, subtitle: `${n.subject || 'Note'} • ${n.fileType?.toUpperCase() || 'PDF'}` });
        });

        setGlobalResults(combined.slice(0, 10));
      } catch (err) {
        // Fallback
      } finally {
        if (isCurrentSearch) setSearchingGlobal(false);
      }
    }, 250);

    return () => {
      isCurrentSearch = false;
      clearTimeout(timeout);
    };
  }, [globalSearch, catalogCourses, categories]);

  // ── Step-by-Step Serial Back Handler (Fix for user issue) ──
  const handleStepBack = () => {
    // 1. If in Bookmarks view, step back to where student was
    if (isBookmarksView) {
      setIsBookmarksView(false);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('bookmarks');
      setSearchParams(newParams);
      return;
    }

    // 2. If viewing a note modal, close it
    if (activeViewerNote) {
      setActiveViewerNote(null);
      return;
    }

    // 3. Serial Step-by-Step Backward unwinding of searchParams
    const newParams = new URLSearchParams(searchParams);
    if (selectedSubject || newParams.has('subject')) {
      newParams.delete('subject');
      setSelectedSubject(null);
    } else if (selectedSemester || newParams.has('semester')) {
      newParams.delete('semester');
      setSelectedSemester(null);
    } else if (selectedYear || newParams.has('year')) {
      newParams.delete('year');
      setSelectedYear(null);
    } else if (selectedBranch || newParams.has('branch')) {
      newParams.delete('branch');
      setSelectedBranch(null);
    } else if (selectedCourse || newParams.has('course')) {
      newParams.delete('course');
      setSelectedCourse(null);
    } else if (selectedCategory || newParams.has('category')) {
      newParams.delete('category');
      setSelectedCategory(null);
    } else {
      // At root level of Notes, go back to previous history page (front page)
      navigate(-1);
      return;
    }

    setSearchParams(newParams);
  };

  // ── Selection Handlers with SearchParams History Push ──
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSelectedCourse(null);
    setSelectedBranch(null);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setIsBookmarksView(false);
    setSearchParams({ category: cat.slug || cat._id });
  };

  const handleSelectCourse = (c) => {
    const populatedCategory = c.categoryId && typeof c.categoryId === 'object' ? c.categoryId : null;
    const categoryId = populatedCategory?._id || c.categoryId;
    const courseCategory = categories.find(category => String(category._id) === String(categoryId))
      || (selectedCategory && String(selectedCategory._id) === String(categoryId) ? selectedCategory : null)
      || populatedCategory
      || selectedCategory;

    if (courseCategory) setSelectedCategory(courseCategory);
    setSelectedCourse(c);
    setSelectedBranch(null);
    setSelectedYear(null);
    setSelectedSemester(null);
    setSelectedSubject(null);
    setIsBookmarksView(false);
    setSearchParams({
      category: courseCategory?.slug || searchParams.get('category') || 'engineering-technology',
      course: c.slug || c._id
    });
  };

  const handleSelectBranch = (b) => {
    setSelectedBranch(b);
    setSearchParams({
      category: selectedCategory?.slug || searchParams.get('category') || 'engineering-technology',
      course: selectedCourse?.slug || searchParams.get('course') || 'btech',
      branch: b.shortCode ? b.shortCode.toLowerCase() : (b.slug || b._id)
    });
  };

  const handleSelectYear = (yr) => {
    const yrNum = typeof yr === 'object' ? yr.yearNumber : yr;
    setSelectedYear(yrNum);
    setSearchParams({
      category: selectedCategory?.slug || searchParams.get('category') || 'engineering-technology',
      course: selectedCourse?.slug || searchParams.get('course') || 'btech',
      branch: selectedBranch?.shortCode ? selectedBranch.shortCode.toLowerCase() : (selectedBranch?.slug || searchParams.get('branch')),
      year: yrNum
    });
  };

  const handleSelectSemester = (sem) => {
    const semNum = typeof sem === 'object' ? sem.semesterNumber : sem;
    setSelectedSemester(semNum);
    setSearchParams({
      category: selectedCategory?.slug || searchParams.get('category') || 'engineering-technology',
      course: selectedCourse?.slug || searchParams.get('course') || 'btech',
      branch: selectedBranch?.shortCode ? selectedBranch.shortCode.toLowerCase() : (selectedBranch?.slug || searchParams.get('branch')),
      year: typeof selectedYear === 'object' ? selectedYear.yearNumber : (selectedYear || searchParams.get('year') || '3'),
      semester: semNum
    });
  };

  const handleSelectSubject = (subj) => {
    setSelectedSubject(subj);
    setSearchParams({
      category: selectedCategory?.slug || searchParams.get('category') || 'engineering-technology',
      course: selectedCourse?.slug || searchParams.get('course') || 'btech',
      branch: selectedBranch?.shortCode ? selectedBranch.shortCode.toLowerCase() : (selectedBranch?.slug || searchParams.get('branch')),
      year: typeof selectedYear === 'object' ? selectedYear.yearNumber : (selectedYear || searchParams.get('year') || '3'),
      semester: typeof selectedSemester === 'object' ? selectedSemester.semesterNumber : (selectedSemester || searchParams.get('semester') || '5'),
      subject: subj.slug || subj._id
    });
  };

  // ── Breadcrumb Navigation Jump ──
  const handleBreadcrumbNavigate = (level) => {
    const newParams = new URLSearchParams();
    if (level === 'root') {
      setSelectedCategory(null);
      setSelectedCourse(null);
      setSelectedBranch(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSubject(null);
      setIsBookmarksView(false);
      setSearchParams(newParams);
    } else if (level === 'category') {
      const cat = searchParams.get('category') || selectedCategory?.slug;
      if (cat) newParams.set('category', cat);
      setSelectedCourse(null);
      setSelectedBranch(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSubject(null);
      setIsBookmarksView(false);
      setSearchParams(newParams);
    } else if (level === 'course') {
      const cat = searchParams.get('category') || selectedCategory?.slug;
      const crs = searchParams.get('course') || selectedCourse?.slug;
      if (cat) newParams.set('category', cat);
      if (crs) newParams.set('course', crs);
      setSelectedBranch(null);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSubject(null);
      setIsBookmarksView(false);
      setSearchParams(newParams);
    } else if (level === 'branch') {
      const cat = searchParams.get('category') || selectedCategory?.slug;
      const crs = searchParams.get('course') || selectedCourse?.slug;
      const br = searchParams.get('branch') || selectedBranch?.shortCode?.toLowerCase();
      if (cat) newParams.set('category', cat);
      if (crs) newParams.set('course', crs);
      if (br) newParams.set('branch', br);
      setSelectedYear(null);
      setSelectedSemester(null);
      setSelectedSubject(null);
      setIsBookmarksView(false);
      setSearchParams(newParams);
    } else if (level === 'year') {
      const cat = searchParams.get('category') || selectedCategory?.slug;
      const crs = searchParams.get('course') || selectedCourse?.slug;
      const br = searchParams.get('branch') || selectedBranch?.shortCode?.toLowerCase();
      const yr = searchParams.get('year') || selectedYear;
      if (cat) newParams.set('category', cat);
      if (crs) newParams.set('course', crs);
      if (br) newParams.set('branch', br);
      if (yr) newParams.set('year', yr);
      setSelectedSemester(null);
      setSelectedSubject(null);
      setIsBookmarksView(false);
      setSearchParams(newParams);
    } else if (level === 'semester') {
      const cat = searchParams.get('category') || selectedCategory?.slug;
      const crs = searchParams.get('course') || selectedCourse?.slug;
      const br = searchParams.get('branch') || selectedBranch?.shortCode?.toLowerCase();
      const yr = searchParams.get('year') || selectedYear;
      const sem = searchParams.get('semester') || selectedSemester;
      if (cat) newParams.set('category', cat);
      if (crs) newParams.set('course', crs);
      if (br) newParams.set('branch', br);
      if (yr) newParams.set('year', yr);
      if (sem) newParams.set('semester', sem);
      setSelectedSubject(null);
      setIsBookmarksView(false);
      setSearchParams(newParams);
    }
  };

  // ── Global Search Selection ──
  const handleSelectSearchResult = (item) => {
    setGlobalSearch('');
    setGlobalResults([]);

    if (item.type === 'course') {
      handleSelectCourse(item.data);
    } else if (item.type === 'category') {
      handleSelectCategory(item.data);
    } else if (item.type === 'branch') {
      handleSelectBranch(item.data);
    } else if (item.type === 'subject') {
      handleSelectSubject(item.data);
    } else if (item.type === 'note') {
      setActiveViewerNote(item.data);
    }
  };

  // ── Bookmark Actions ──
  const handleToggleBookmark = async (note) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const noteId = note._id || note.id;
    try {
      const { data } = await notesService.toggleBookmark(noteId);
      setBookmarkedNoteIds(prev => {
        const next = new Set(prev);
        if (data.bookmarked) next.add(noteId);
        else next.delete(noteId);
        return next;
      });

      const res = await notesService.getBookmarks();
      if (res.data) setBookmarkedNotesList(res.data);

      setSuccessBanner(data.message || (data.bookmarked ? 'Note saved to bookmarks!' : 'Removed from bookmarks'));
      setTimeout(() => setSuccessBanner(''), 3000);
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleDownloadNote = async (note) => {
    const noteId = note._id || note.id;
    try {
      const { data } = await notesService.download(noteId);
      if (data && data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      } else if (note.fileUrl) {
        window.open(note.fileUrl, '_blank');
      }
    } catch (err) {
      if (note.fileUrl) window.open(note.fileUrl, '_blank');
    }
  };

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* ── Top Global Search Bar & Nav Actions ── */}
      <div className="pt-2 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200/80 mb-6">
        {/* Global Search Bar matching Section 29 */}
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search courses, notes, subjects, or topics..."
            aria-label="Search courses, notes, subjects, or topics"
            aria-autocomplete="list"
            aria-expanded={Boolean(globalSearch.trim())}
            aria-controls="notes-global-search-results"
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
          />
          {globalSearch && (
            <button 
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}

          {/* Autocomplete Results Overlay */}
          {globalSearch.trim() && (
            <div id="notes-global-search-results" role="listbox" aria-label="Search suggestions" className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-slide-up">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                {searchingGlobal ? 'Searching all study materials…' : 'Search Results'}
              </div>
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {globalResults.length > 0 ? globalResults.map((item, idx) => (
                    <button
                      key={`${item.type}-${item.data?._id || item.title}-${idx}`}
                      type="button"
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left p-2 rounded-xl hover:bg-indigo-50/80 transition flex items-center justify-between group"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                    </button>
                  )) : (
                    <p className="px-2 py-3 text-xs text-slate-500">
                      {searchingGlobal || catalogLoading ? 'Looking across courses, notes, and subjects…' : 'No matching courses, notes, subjects, or topics found.'}
                    </p>
                  )}
              </div>
            </div>
          )}
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              const nextState = !isBookmarksView;
              setIsBookmarksView(nextState);
              const p = new URLSearchParams(searchParams);
              if (nextState) p.set('bookmarks', 'true');
              else p.delete('bookmarks');
              setSearchParams(p);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              isBookmarksView
                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600'
            }`}
          >
            <Bookmark size={14} className={isBookmarksView ? 'fill-rose-600' : ''} />
            <span>My Bookmarks ({bookmarkedNoteIds.size})</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary py-2 px-4 text-xs font-bold gap-1.5 shadow-sm shadow-indigo-200"
          >
            <Upload size={14} /> Upload Notes
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successBanner && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-900 shadow-2xs animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner('')} className="p-1 hover:text-emerald-700">
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Breadcrumb Navigation matching Section 30 ── */}
      <BreadcrumbNav
        category={selectedCategory}
        course={selectedCourse}
        branch={selectedBranch}
        year={selectedYear}
        semester={selectedSemester}
        subject={selectedSubject}
        onNavigate={handleBreadcrumbNavigate}
      />

      {/* ─────────────────────────────────────────────────────────────
          DYNAMIC VIEW SWITCHER ACCORDING TO USER FLOW (SECTION 2, 48)
      ───────────────────────────────────────────────────────────── */}
      {isBookmarksView ? (
        <UserBookmarksView
          bookmarkedNotes={bookmarkedNotesList}
          loading={loading}
          onBack={handleStepBack}
          onViewNote={(note) => setActiveViewerNote(note)}
          onBookmarkNote={handleToggleBookmark}
          onDownloadNote={handleDownloadNote}
          onReportNote={(note) => setReportingNote(note)}
        />
      ) : selectedSubject ? (
        /* STAGE 6: Subject Notes Page */
        <SubjectNotesView
          subject={selectedSubject}
          branch={selectedBranch}
          semester={selectedSemester}
          notes={notes}
          loading={loading}
          bookmarkedNoteIds={bookmarkedNoteIds}
          isSubjectBookmarked={subjectBookmarked}
          onToggleSubjectBookmark={() => setSubjectBookmarked(!subjectBookmarked)}
          onUploadNote={() => setShowUploadModal(true)}
          onViewNote={(note) => setActiveViewerNote(note)}
          onBookmarkNote={handleToggleBookmark}
          onDownloadNote={handleDownloadNote}
          onReportNote={(note) => setReportingNote(note)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          unitFilter={unitFilter}
          setUnitFilter={setUnitFilter}
          fileTypeFilter={fileTypeFilter}
          setFileTypeFilter={setFileTypeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onBack={handleStepBack}
        />
      ) : selectedSemester ? (
        /* STAGE 5: Subjects Page */
        <SubjectsView
          course={selectedCourse}
          branch={selectedBranch}
          semester={selectedSemester}
          subjects={subjects}
          loading={loading}
          onSelectSubject={(subj) => handleSelectSubject(subj)}
          onUploadNote={() => setShowUploadModal(true)}
          onBack={handleStepBack}
        />
      ) : selectedYear ? (
        /* STAGE 4: Semesters Page */
        <SemestersView
          course={selectedCourse}
          branch={selectedBranch}
          year={selectedYear}
          semesters={semesters}
          loading={loading}
          onSelectSemester={(sem) => handleSelectSemester(sem)}
          onBack={handleStepBack}
        />
      ) : selectedBranch ? (
        /* STAGE 3: Branch Dashboard & Year Selection */
        <BranchDashboardView
          branch={selectedBranch}
          years={years}
          onSelectYear={(yr) => handleSelectYear(yr)}
          onBack={handleStepBack}
        />
      ) : selectedCourse ? (
        /* STAGE 2: Branches / Specializations Page */
        <BranchesView
          course={selectedCourse}
          branches={branches}
          onSelectBranch={(b) => handleSelectBranch(b)}
          onBack={handleStepBack}
        />
      ) : selectedCategory ? (
        /* STAGE 1b: Degrees Page under Category */
        <DegreesView
          category={selectedCategory}
          courses={courses}
          onSelectCourse={(c) => handleSelectCourse(c)}
          onBack={handleStepBack}
        />
      ) : (
        /* STAGE 1a: Course Categories Page */
        <CourseCategoriesView
          categories={categories}
          loading={categoriesLoading}
          onSelectCategory={(cat) => handleSelectCategory(cat)}
        />
      )}

      {/* ── Dedicated Note Viewer Modal (Sections 16, 17, 18, 20) ── */}
      {activeViewerNote && (
        <NoteViewerModal
          noteId={activeViewerNote._id || activeViewerNote.id}
          initialNote={activeViewerNote}
          isBookmarked={bookmarkedNoteIds.has(activeViewerNote._id || activeViewerNote.id)}
          onClose={() => {
            setActiveViewerNote(null);
            if (routeNoteId && routeNoteId !== 'upload') navigate('/notes', { replace: true });
          }}
          onBookmarkToggle={handleToggleBookmark}
          onReport={(note) => setReportingNote(note)}
        />
      )}

      {/* ── Dependent Hierarchy Upload Note Modal (Sections 13, 14, 44) ── */}
      {showUploadModal && (
        <UploadNoteModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          prefilledCategory={selectedCategory}
          prefilledCourse={selectedCourse}
          prefilledBranch={selectedBranch}
          prefilledYear={selectedYear}
          prefilledSemester={selectedSemester}
          prefilledSubject={selectedSubject}
          onNoteUploaded={(newNote) => {
            setNotes(prev => [newNote, ...prev]);
            setSuccessBanner(`“${newNote.title}” successfully published!`);
            setTimeout(() => setSuccessBanner(''), 4000);
          }}
        />
      )}

      {/* ── Report Note Modal (Section 23) ── */}
      {reportingNote && (
        <ReportModal
          isOpen={Boolean(reportingNote)}
          onClose={() => setReportingNote(null)}
          note={reportingNote}
        />
      )}
    </div>
  );
}
