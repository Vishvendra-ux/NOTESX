import React, { useState, useEffect, useContext } from 'react';
import { 
  X, Upload, CheckCircle2, AlertCircle, FileText, Sparkles, 
  Layers, ChevronRight, BookOpen, GraduationCap, Shield,
  Link2, Globe, ExternalLink, Info
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { hierarchyService, notesService } from '../../services/api';

const getLinkDetails = (url) => {
  if (!url) return null;
  const lower = url.trim().toLowerCase();
  if (lower.includes('drive.google.com')) {
    return {
      type: 'drive',
      name: 'Google Drive',
      badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300',
      hint: 'Make sure General access is set to "Anyone with the link can view"'
    };
  }
  if (lower.includes('docs.google.com/document')) {
    return {
      type: 'gdoc',
      name: 'Google Docs',
      badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300',
      hint: 'Make sure Share setting is set to "Anyone with the link can view"'
    };
  }
  if (lower.includes('docs.google.com/presentation')) {
    return {
      type: 'gslide',
      name: 'Google Slides',
      badge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300',
      hint: 'Make sure Share setting is set to "Anyone with the link can view"'
    };
  }
  if (lower.includes('docs.google.com/spreadsheets')) {
    return {
      type: 'gsheet',
      name: 'Google Sheets',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300',
      hint: 'Make sure Share setting is set to "Anyone with the link can view"'
    };
  }
  if (lower.endsWith('.pdf') || lower.includes('.pdf')) {
    return {
      type: 'pdf',
      name: 'Public Web PDF',
      badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300',
      hint: 'Direct PDF link accessible to everyone'
    };
  }
  if (/^https?:\/\//i.test(lower)) {
    return {
      type: 'web',
      name: 'Public Web Link',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300',
      hint: 'Make sure this web link is publicly accessible without requiring logins'
    };
  }
  return null;
};

export default function UploadNoteModal({
  isOpen,
  onClose,
  onNoteUploaded,
  prefilledCategory,
  prefilledCourse,
  prefilledBranch,
  prefilledYear,
  prefilledSemester,
  prefilledSubject
}) {
  const { user } = useContext(AuthContext);

  // Dynamic hierarchy state lists
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Selected hierarchy values
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedYearNumber, setSelectedYearNumber] = useState(3);
  const [selectedSemesterNumber, setSelectedSemesterNumber] = useState(5);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [customSubjectName, setCustomSubjectName] = useState('');

  // Form input fields
  const [unit, setUnit] = useState('Unit 1');
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [file, setFile] = useState(null);
  const [externalLink, setExternalLink] = useState('');

  const linkDetails = getLinkDetails(externalLink);

  // Terms & Copyright confirmation
  const [hasPermission, setHasPermission] = useState(false);
  const [noCopyrightInfringement, setNoCopyrightInfringement] = useState(false);

  // Status
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset terms agreement when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setHasPermission(false);
      setNoCopyrightInfringement(false);
      setFile(null);
      setExternalLink('');
    }
  }, [isOpen]);

  // 1. Load initial courses when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const loadInitialData = async () => {
      try {
        setLoadingInitial(true);
        const { data: coursesList } = await hierarchyService.getCourses();
        setCourses(coursesList || []);

        const defaultCourse = prefilledCourse || coursesList?.find(c => c.slug === 'btech') || coursesList?.[0];
        if (defaultCourse) {
          setSelectedCourseId(defaultCourse._id);
        }
      } catch (err) {
        console.error('Error loading courses for upload:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    loadInitialData();
  }, [isOpen, prefilledCourse]);

  // 2. When course changes -> load branches for that course
  useEffect(() => {
    if (!selectedCourseId) return;

    const loadBranches = async () => {
      try {
        const { data: branchList } = await hierarchyService.getBranches({ courseId: selectedCourseId });
        setBranches(branchList || []);

        const targetBranch = prefilledBranch || branchList?.find(b => b.shortCode === 'CSE') || branchList?.[0];
        if (targetBranch) {
          setSelectedBranchId(targetBranch._id);
        }
      } catch (err) {
        console.error('Error loading branches:', err);
      }
    };

    loadBranches();
  }, [selectedCourseId, prefilledBranch]);

  // 3. When branch changes -> load dynamic years for that branch/course duration
  useEffect(() => {
    if (!selectedBranchId) return;

    const loadYears = async () => {
      try {
        const { data: yearsList } = await hierarchyService.getYears({ branchId: selectedBranchId });
        setYears(yearsList || []);

        const initialYr = prefilledYear ? (typeof prefilledYear === 'number' ? prefilledYear : parseInt(prefilledYear.match(/\d+/)?.[0] || '3', 10)) : 3;
        setSelectedYearNumber(initialYr);
      } catch (err) {
        console.error('Error loading years:', err);
      }
    };

    loadYears();
  }, [selectedBranchId, prefilledYear]);

  // 4. When year changes -> load semesters for that year
  useEffect(() => {
    if (!selectedBranchId || !selectedYearNumber) return;

    const loadSemesters = async () => {
      try {
        const { data: semsList } = await hierarchyService.getSemesters({
          branchId: selectedBranchId,
          yearNumber: selectedYearNumber
        });
        setSemesters(semsList || []);

        const initialSem = prefilledSemester ? (typeof prefilledSemester === 'number' ? prefilledSemester : parseInt(prefilledSemester.match(/\d+/)?.[0] || '5', 10)) : semsList?.[0]?.semesterNumber || (selectedYearNumber * 2 - 1);
        setSelectedSemesterNumber(initialSem);
      } catch (err) {
        console.error('Error loading semesters:', err);
      }
    };

    loadSemesters();
  }, [selectedBranchId, selectedYearNumber, prefilledSemester]);

  // 5. When semester changes -> load subjects for that branch & semester
  useEffect(() => {
    if (!selectedBranchId || !selectedSemesterNumber) return;

    const loadSubjects = async () => {
      try {
        const { data: subList } = await hierarchyService.getSubjects({
          branchId: selectedBranchId,
          semesterNumber: selectedSemesterNumber
        });
        setSubjects(subList || []);

        if (prefilledSubject && subList) {
          const match = subList.find(s => s._id === prefilledSubject._id || s.name === prefilledSubject.name);
          if (match) setSelectedSubjectId(match._id);
          else if (subList.length > 0) setSelectedSubjectId(subList[0]._id);
        } else if (subList && subList.length > 0) {
          setSelectedSubjectId(subList[0]._id);
        } else {
          setSelectedSubjectId('__custom__');
        }
      } catch (err) {
        console.error('Error loading subjects:', err);
      }
    };

    loadSubjects();
  }, [selectedBranchId, selectedSemesterNumber, prefilledSubject]);

  if (!isOpen) return null;

  // File security check on frontend
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const disallowed = ['.exe', '.bat', '.sh', '.js', '.msi', '.cmd', '.vbs', '.php', '.py'];
    const isDisallowed = disallowed.some(ext => fileName.endsWith(ext));

    if (isDisallowed) {
      setError('Executable and script files (.exe, .sh, .js, etc.) are strictly prohibited.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25 MB maximum limit.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please log in before uploading study material.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a descriptive note title.');
      return;
    }

    if (!file && !externalLink.trim()) {
      setError('Please choose a document file or provide a public Google Drive / Docs / PDF link.');
      return;
    }

    if (externalLink.trim() && !/^https?:\/\//i.test(externalLink.trim())) {
      setError('Please enter a valid link starting with https:// or http://');
      return;
    }

    if (!hasPermission || !noCopyrightInfringement) {
      setError('Please agree to both copyright and upload permission terms before uploading.');
      return;
    }

    const isCustomSubject = selectedSubjectId === '__custom__';
    const finalSubjectName = isCustomSubject ? customSubjectName.trim() : subjects.find(s => s._id === selectedSubjectId)?.name;

    if (!finalSubjectName) {
      setError('Please select or specify a subject name.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (externalLink.trim()) {
        formData.append('externalLink', externalLink.trim());
      }
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('courseId', selectedCourseId);
      formData.append('branchId', selectedBranchId);
      formData.append('yearNumber', selectedYearNumber);
      formData.append('semesterNumber', selectedSemesterNumber);
      if (!isCustomSubject) {
        formData.append('subjectId', selectedSubjectId);
      }
      formData.append('subject', finalSubjectName);
      formData.append('unit', unit);
      formData.append('topic', topic.trim());

      const tagsArray = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      formData.append('tags', JSON.stringify(tagsArray.length > 0 ? tagsArray : [finalSubjectName, unit]));

      const { data: newNote } = await notesService.create(formData);

      setSuccess(`“${title}” was uploaded successfully and published!`);
      if (onNoteUploaded) onNoteUploaded(newNote);

      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please check file format and try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[95] grid place-items-center bg-slate-950/60 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden my-auto animate-slide-up flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Share with Classmates</span>
            <h3 className="text-xl font-extrabold text-slate-900">Upload Study Material</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* 1. Course & Branch Hierarchy Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="input-field py-2 text-xs font-semibold"
              >
                {courses.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.durationYears} Years)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Branch / Specialization</label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="input-field py-2 text-xs font-semibold"
              >
                {branches.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.shortCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Dependent Year & Semester Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
              <select
                value={selectedYearNumber}
                onChange={(e) => setSelectedYearNumber(parseInt(e.target.value, 10))}
                className="input-field py-2 text-xs font-semibold"
              >
                {years.map(y => (
                  <option key={y.yearNumber} value={y.yearNumber}>
                    {y.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
              <select
                value={selectedSemesterNumber}
                onChange={(e) => setSelectedSemesterNumber(parseInt(e.target.value, 10))}
                className="input-field py-2 text-xs font-semibold"
              >
                {semesters.map(s => (
                  <option key={s.semesterNumber} value={s.semesterNumber}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Dependent Subject Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="input-field py-2 text-xs font-semibold"
            >
              {subjects.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.code || 'Core'})
                </option>
              ))}
              <option value="__custom__">+ Custom / Elective Subject...</option>
            </select>

            {selectedSubjectId === '__custom__' && (
              <input
                required
                type="text"
                value={customSubjectName}
                onChange={(e) => setCustomSubjectName(e.target.value)}
                placeholder="Enter custom subject name..."
                className="input-field mt-2 py-2 text-xs"
              />
            )}
          </div>

          {/* 4. Unit & Topic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit / Syllabus Segment</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="input-field py-2 text-xs"
              >
                <option>Unit 1</option>
                <option>Unit 2</option>
                <option>Unit 3</option>
                <option>Unit 4</option>
                <option>Unit 5</option>
                <option>Complete Syllabus</option>
                <option>Lab Manual / Practical</option>
                <option>Previous Year Papers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specific Topic (Optional)</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Process Sync, B+ Trees..."
                className="input-field py-2 text-xs"
              />
            </div>
          </div>

          {/* 5. Title & Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Note Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Process Synchronization — Complete Unit 3 Handwritten Notes"
              className="input-field py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of formulas, diagrams, or questions covered..."
              className="input-field py-2 text-xs"
            />
          </div>

          {/* 6. Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Semaphores, Deadlocks, Unit 3, University PYQ"
              className="input-field py-2 text-xs"
            />
          </div>

          {/* 7. Study Document Link (Google Drive / Docs / PDF) or File */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Public Document Link (Google Drive, Google Docs, or Web PDF)
                </label>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  ⚡ Recommended for Instant Access
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Link2 size={16} />
                </div>
                <input
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="Paste Google Drive, Google Docs, or PDF public link (e.g. https://drive.google.com/...)"
                  className="input-field pl-9 pr-24 py-2.5 text-xs"
                />
                {externalLink.trim() && (
                  <div className="absolute inset-y-0 right-1.5 flex items-center">
                    <a
                      href={externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition shadow-xs"
                      title="Test if link opens publicly"
                    >
                      <ExternalLink size={12} /> Test Link
                    </a>
                  </div>
                )}
              </div>

              {/* Detected Link Badge */}
              {linkDetails && (
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[10px] font-extrabold border ${linkDetails.badge}`}>
                    <Globe size={11} /> {linkDetails.name} Detected
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{linkDetails.hint}</span>
                </div>
              )}

              {/* Public Sharing Instructions Box */}
              <div className="mt-2.5 rounded-xl border border-blue-200/80 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/40 p-3 text-xs text-blue-900 dark:text-blue-200">
                <div className="flex items-start gap-2.5">
                  <Info size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">Make Sure Link is Public for All Students:</span>
                    <p className="mt-0.5 text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                      In Google Drive or Google Docs, click <strong>Share</strong> → change General Access to <strong>"Anyone with the link can view"</strong>. This allows every student to access the notes immediately without permission requests.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {externalLink.trim() ? 'Optional File Attachment' : 'OR Upload File From Device'}
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* File Drag & Drop Dropzone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Attach Local Document {externalLink.trim() ? '(Optional)' : '(Required if no link provided)'}
              </label>
              <label className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition ${
                file ? 'border-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 dark:border-slate-800'
              }`}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div className="flex items-center justify-between w-full px-2">
                    <div className="flex items-center gap-2.5 text-left">
                      <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                      <div>
                        <b className="text-xs text-emerald-900 dark:text-emerald-300 block truncate max-w-xs">{file.name}</b>
                        <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to Upload
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setFile(null); }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1 rounded-lg hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-indigo-600 mb-1" />
                    <b className="text-xs text-slate-800 dark:text-slate-200">Choose PDF, Word, PowerPoint, or Image</b>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Max size: 25 MB • Executables strictly blocked
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* 8. Terms & Copyright Declaration */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/40 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Shield size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span>Academic Integrity & Copyright Declaration</span>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={hasPermission}
                  onChange={(e) => setHasPermission(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                  required
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-relaxed font-medium">
                  I have the right/permission to upload or link this study material.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={noCopyrightInfringement}
                  onChange={(e) => setNoCopyrightInfringement(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
                  required
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-relaxed font-medium">
                  This material does not knowingly infringe someone else's copyright.
                </span>
              </label>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2 px-5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !title.trim() || (!file && !externalLink.trim()) || !hasPermission || !noCopyrightInfringement}
              className="btn-primary py-2.5 px-6 text-xs font-bold gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 dark:shadow-none"
            >
              <Upload size={14} /> {uploading ? 'Publishing Notes...' : 'Publish Notes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
