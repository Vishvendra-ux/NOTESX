import { useContext, useState } from 'react';
import { Search, Filter, Star, Download, Eye, FileText, FileImage, Upload, X, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { notesService } from '../services/api';

export default function Notes() {
  const starterNotes = [
    { id: 1, title: 'Operating Systems - Process Synchronization', subject: 'OS', course: 'B.Tech CSE', year: '3rd Year', rating: 4.8, downloads: '1.2K', type: 'pdf' },
    { id: 2, title: 'DBMS Normalization Complete Guide', subject: 'DBMS', course: 'B.Tech CSE', year: '3rd Year', rating: 4.9, downloads: '840', type: 'pdf' },
    { id: 3, title: 'Data Structures - Graph Algorithms', subject: 'DSA', course: 'B.Tech CSE', year: '2nd Year', rating: 4.7, downloads: '2.1K', type: 'pdf' },
    { id: 4, title: 'Computer Networks - OSI Model', subject: 'CN', course: 'B.Tech CSE', year: '3rd Year', rating: 4.5, downloads: '530', type: 'doc' },
    { id: 5, title: 'Compiler Design - Parsing Techniques', subject: 'CD', course: 'B.Tech CSE', year: '3rd Year', rating: 4.6, downloads: '412', type: 'ppt' },
    { id: 6, title: 'TOC Automata Handwritten Notes', subject: 'TOC', course: 'B.Tech CSE', year: '3rd Year', rating: 4.9, downloads: '3.4K', type: 'img' },
  ];
  const [notes, setNotes] = useState(starterNotes);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', subject: 'Operating Systems', course: 'B.Tech CSE', year: '3rd Year' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitUpload = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !file) return;
    if (!user) { setShowUpload(false); navigate('/login'); return; }
    setUploading(true); setError('');
    try {
      const payload = new FormData();
      payload.append('file', file); payload.append('title', form.title); payload.append('description', `${form.subject} notes for ${form.year}`); payload.append('topic', form.subject);
      const { data } = await notesService.create(payload);
      setNotes((current) => [{ id: data._id, title: data.title, subject: form.subject, course: form.course, year: form.year, rating: 'New', downloads: '0', type: file.type.includes('image') ? 'img' : 'pdf' }, ...current]);
      setSuccess(`“${form.title}” was uploaded and is now available in NOTESX.`);
      setShowUpload(false); setFile(null); setForm({ title: '', subject: 'Operating Systems', course: 'B.Tech CSE', year: '3rd Year' });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not upload this note. Please try again.');
    } finally { setUploading(false); }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="text-red-500" />;
      case 'doc': return <FileText className="text-blue-500" />;
      case 'ppt': return <FileText className="text-orange-500" />;
      case 'img': return <FileImage className="text-emerald-500" />;
      default: return <FileText className="text-slate-500" />;
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Everything You Need for Your Next Exam</h1>
        <p className="text-slate-500 text-lg">Search through thousands of verified notes, study materials, and previous year papers uploaded by top students.</p>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 mb-8 md:sticky md:top-[76px] z-30 shadow-md backdrop-blur-xl">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none text-lg placeholder-slate-400" 
            placeholder="Search notes, topics, or subjects..." 
          />
        </div>
        <div className="hidden md:block w-px h-12 bg-slate-200 dark:bg-slate-700 mx-2 self-center"></div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <select className="input-field py-2.5 min-w-[140px] appearance-none bg-white dark:bg-slate-800 cursor-pointer text-sm">
            <option>All Colleges</option>
            <option>GLA University</option>
            <option>IIT Delhi</option>
          </select>
          <select className="input-field py-2.5 min-w-[140px] appearance-none bg-white dark:bg-slate-800 cursor-pointer text-sm">
            <option>All Subjects</option>
            <option>DBMS</option>
            <option>OS</option>
            <option>DSA</option>
          </select>
          <button className="btn-secondary px-4 min-w-fit gap-2">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-6">
        <h3 className="text-xl font-bold">Trending Notes</h3>
        <button onClick={() => { setSuccess(''); setShowUpload(true); }} className="btn-primary py-2 text-sm px-4 gap-2"><Upload size={16}/> Upload Note</button>
      </div>

      {success && <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span className="flex items-center gap-2"><CheckCircle2 size={17}/>{success}</span><button onClick={() => setSuccess('')} aria-label="Dismiss"><X size={16}/></button></div>}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div key={note.id} className="glass-card p-5 group flex flex-col cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                {getFileIcon(note.type)}
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                  <Star size={14} fill="currentColor" /> {note.rating}
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
              {note.title}
            </h4>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                {note.subject}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                {note.course}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                {note.year}
              </span>
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><Download size={14} /> {note.downloads}</span>
                <span className="flex items-center gap-1.5"><Eye size={14} /> {(parseFloat(note.downloads) * 1.5).toFixed(1)}K</span>
              </div>
              <span className="text-primary-600 font-bold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                View →
              </span>
            </div>
          </div>
        ))}
      </div>

      {showUpload && <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="upload-note-title" onMouseDown={() => setShowUpload(false)}>
        <form onSubmit={submitUpload} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
          <div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Share knowledge</p><h2 id="upload-note-title" className="mt-1 text-2xl font-extrabold text-slate-900">Upload a subject note</h2><p className="mt-1 text-sm text-slate-500">Help your community prepare with quality material.</p></div><button type="button" onClick={() => setShowUpload(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close upload form"><X size={19}/></button></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Note title</span><input required value={form.title} onChange={(event) => setForm({...form, title: event.target.value})} className="input-field" placeholder="e.g. Unit 3 — Process Synchronization"/></label><label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Subject</span><select value={form.subject} onChange={(event) => setForm({...form, subject: event.target.value})} className="input-field"><option>Operating Systems</option><option>DBMS</option><option>Data Structures</option><option>Computer Networks</option><option>Theory of Computation</option></select></label><label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Year</span><select value={form.year} onChange={(event) => setForm({...form, year: event.target.value})} className="input-field"><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></label></div>
          <label className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition ${file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'}`}><input required type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] || null)}/>{file ? <><CheckCircle2 size={24} className="text-emerald-600"/><b className="mt-2 text-sm text-emerald-800">{file.name}</b><span className="mt-1 text-xs text-emerald-700">Ready to upload</span></> : <><Upload size={24} className="text-indigo-600"/><b className="mt-2 text-sm text-slate-800">Choose a PDF, DOC, PPT, or image</b><span className="mt-1 text-xs text-slate-500">Click to browse your files</span></>}</label>
          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setShowUpload(false)} className="btn-secondary">Cancel</button><button disabled={!form.title.trim() || !file || uploading} className="btn-primary gap-2 disabled:cursor-not-allowed disabled:opacity-50"><Upload size={16}/>{uploading ? 'Uploading…' : 'Publish note'}</button></div>
        </form>
      </div>}
    </div>
  );
}
