import { useEffect, useRef } from 'react';
import { Search, Command, FileText, Building2, MessageCircle, Trophy, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const results = [
  { icon: Building2, label: 'GLA University', meta: 'College · Mathura, Uttar Pradesh', to: '/colleges' },
  { icon: FileText, label: 'Process Synchronization Notes', meta: 'Operating Systems · B.Tech CSE', to: '/notes' },
  { icon: MessageCircle, label: 'BFS traversal using a queue', meta: 'Doubt · 18 answers', to: '/doubts' },
  { icon: Trophy, label: 'College Coding Battle', meta: 'Live contest · 42 min remaining', to: '/contests' },
];

export default function SearchModal({ open, onClose }) {
  const input = useRef(null);
  useEffect(() => {
    if (open) input.current?.focus();
    const close = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] bg-slate-950/35 backdrop-blur-sm p-4 pt-[12vh]" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label="Global search">
    <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <Search size={20} className="text-indigo-500" /><input ref={input} className="min-w-0 flex-1 outline-none" placeholder="Search colleges, notes, doubts, topics..." />
        <button onClick={onClose} className="rounded-md bg-slate-100 p-1 text-slate-500" aria-label="Close search"><X size={16}/></button>
      </div>
      <div className="p-3"><p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[.14em] text-slate-400">Suggested for you</p>
        {results.map(({ icon: Icon, label, meta, to }) => <Link key={label} to={to} onClick={onClose} className="flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-indigo-50">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600"><Icon size={17}/></span><span className="flex-1"><span className="block text-sm font-semibold text-slate-800">{label}</span><span className="text-xs text-slate-500">{meta}</span></span><span className="text-xs text-slate-400">Open</span>
        </Link>)}
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-400"><Command size={14}/> Use ↑ ↓ to navigate <span className="ml-auto">ESC to close</span></div>
    </div>
  </div>;
}
