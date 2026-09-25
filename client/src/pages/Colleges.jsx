import { useMemo, useState } from 'react';
import { Search, MapPin, Users, BookOpen, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const colleges = [
  { 
    id: 'gla', 
    name: 'GLA University', 
    location: 'Mathura, Uttar Pradesh', 
    state: 'Uttar Pradesh', 
    students: '12.4K', 
    notes: '2,340', 
    initial: 'G', 
    color: 'from-blue-500 to-indigo-600',
    bannerImage: '/colleges/gla.webp'
  },
  { 
    id: 'iit-delhi', 
    name: 'Indian Institute of Technology Delhi', 
    location: 'New Delhi, Delhi', 
    state: 'Delhi', 
    students: '10.8K', 
    notes: '5,820', 
    initial: 'I', 
    color: 'from-emerald-500 to-teal-600',
    bannerImage: '/colleges/iit-delhi.jpg'
  },
  { 
    id: 'dtu', 
    name: 'Delhi Technological University', 
    location: 'New Delhi, Delhi', 
    state: 'Delhi', 
    students: '15.1K', 
    notes: '3,160', 
    initial: 'D', 
    color: 'from-violet-500 to-purple-600',
    bannerImage: '/colleges/dtu.jpg'
  },
  { 
    id: 'aktu', 
    name: 'Dr. A.P.J. Abdul Kalam Technical University', 
    location: 'Lucknow, Uttar Pradesh', 
    state: 'Uttar Pradesh', 
    students: '400K', 
    notes: '8,420', 
    initial: 'A', 
    color: 'from-orange-500 to-red-600',
    bannerImage: '/colleges/aktu.jpg'
  },
  { 
    id: 'iit-bombay', 
    name: 'Indian Institute of Technology Bombay', 
    location: 'Mumbai, Maharashtra', 
    state: 'Maharashtra', 
    students: '11.2K', 
    notes: '6,140', 
    initial: 'I', 
    color: 'from-sky-500 to-blue-700',
    bannerImage: '/colleges/iit-bombay.jpg'
  },
  { 
    id: 'vit', 
    name: 'Vellore Institute of Technology', 
    location: 'Vellore, Tamil Nadu', 
    state: 'Tamil Nadu', 
    students: '34K', 
    notes: '4,980', 
    initial: 'V', 
    color: 'from-cyan-500 to-blue-600',
    bannerImage: '/colleges/vit.jpg'
  },
  { 
    id: 'bits', 
    name: 'BITS Pilani', 
    location: 'Pilani, Rajasthan', 
    state: 'Rajasthan', 
    students: '6.5K', 
    notes: '3,720', 
    initial: 'B', 
    color: 'from-rose-500 to-pink-600',
    bannerImage: '/colleges/bits.jpg'
  },
  { 
    id: 'nit-trichy', 
    name: 'National Institute of Technology Tiruchirappalli', 
    location: 'Tiruchirappalli, Tamil Nadu', 
    state: 'Tamil Nadu', 
    students: '7.8K', 
    notes: '2,860', 
    initial: 'N', 
    color: 'from-amber-500 to-orange-600',
    bannerImage: '/colleges/nit-trichy.png'
  },
  { 
    id: 'manipal', 
    name: 'Manipal Institute of Technology', 
    location: 'Manipal, Karnataka', 
    state: 'Karnataka', 
    students: '10.2K', 
    notes: '2,940', 
    initial: 'M', 
    color: 'from-fuchsia-500 to-violet-600',
    bannerImage: '/colleges/manipal.jpg'
  },
  { 
    id: 'iit-kanpur', 
    name: 'Indian Institute of Technology Kanpur', 
    location: 'Kanpur, Uttar Pradesh', 
    state: 'Uttar Pradesh', 
    students: '8.1K', 
    notes: '4,640', 
    initial: 'I', 
    color: 'from-lime-500 to-emerald-600',
    bannerImage: '/colleges/iit-kanpur.jpg'
  },
  { 
    id: 'jadavpur', 
    name: 'Jadavpur University', 
    location: 'Kolkata, West Bengal', 
    state: 'West Bengal', 
    students: '13.3K', 
    notes: '2,520', 
    initial: 'J', 
    color: 'from-indigo-500 to-violet-600',
    bannerImage: '/colleges/jadavpur.jpg'
  },
  { 
    id: 'rvce', 
    name: 'RV College of Engineering', 
    location: 'Bengaluru, Karnataka', 
    state: 'Karnataka', 
    students: '5.6K', 
    notes: '1,840', 
    initial: 'R', 
    color: 'from-teal-500 to-emerald-600',
    bannerImage: '/colleges/rvce.jpg'
  },
];

const filters = ['All Colleges', 'Uttar Pradesh', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Karnataka'];

export default function Colleges() {
  const [query, setQuery] = useState(''); 
  const [state, setState] = useState('All Colleges');

  const visible = useMemo(() => colleges.filter((college) => {
    const text = `${college.name} ${college.location} ${college.state}`.toLowerCase();
    return (state === 'All Colleges' || college.state === state) && text.includes(query.trim().toLowerCase());
  }), [query, state]);

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-600">Campus communities</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-slate-900">Explore colleges</h1>
          <p className="mt-2 text-sm text-slate-500">Find your campus to unlock notes, discussions, contests, and peers.</p>
        </div>
        <div className="relative w-full md:w-[360px]">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            type="search" 
            className="input-field py-3 pl-10 pr-10 text-sm" 
            placeholder="Search by college, city, or state..." 
            aria-label="Search colleges"
          />
          {query && (
            <button 
              onClick={() => setQuery('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" 
              aria-label="Clear search"
            >
              <X size={16}/>
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button 
            key={filter} 
            onClick={() => setState(filter)} 
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${state === filter ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{visible.length} {visible.length === 1 ? 'college' : 'colleges'} found</span>
        {(query || state !== 'All Colleges') && (
          <button onClick={() => { setQuery(''); setState('All Colleges'); }} className="font-semibold text-indigo-600">
            Clear filters
          </button>
        )}
      </div>

      {visible.length ? (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((college) => (
            <Link 
              to={`/colleges/${college.id}`} 
              key={college.id} 
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
            >
              <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                {college.bannerImage ? (
                  <>
                    <img 
                      src={college.bannerImage} 
                      alt={college.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-black/20" />
                  </>
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${college.color} opacity-90 transition group-hover:opacity-100`} />
                )}
              </div>

              <div className="relative flex flex-1 flex-col p-5">
                <div className={`absolute -top-9 left-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${college.color} border-4 border-white text-2xl font-extrabold text-white shadow-lg`}>
                  {college.initial}
                </div>
                <div className="mb-5 mt-8">
                  <h2 className="text-lg font-bold leading-tight text-slate-900 group-hover:text-indigo-700">
                    {college.name}
                  </h2>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={14}/>
                    {college.location}
                  </p>
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <Users size={15} className="text-indigo-500"/>
                    <span>
                      <b className="block text-sm text-slate-800">{college.students}</b>
                      Students
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <BookOpen size={15} className="text-violet-500"/>
                    <span>
                      <b className="block text-sm text-slate-800">{college.notes}</b>
                      Notes
                    </span>
                  </span>
                </div>
                <span className="mt-5 flex items-center gap-1 text-sm font-bold text-indigo-600">
                  View college <ArrowRight size={15} className="transition group-hover:translate-x-1"/>
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid min-h-72 place-items-center border border-dashed border-slate-300 bg-white p-8 text-center">
          <div>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Search size={21}/>
            </span>
            <h2 className="mt-4 text-lg font-bold text-slate-900">No colleges found</h2>
            <p className="mt-1 text-sm text-slate-500">Try a different college name, city, or state.</p>
            <button onClick={() => { setQuery(''); setState('All Colleges'); }} className="mt-5 text-sm font-bold text-indigo-600">
              Show all colleges
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
