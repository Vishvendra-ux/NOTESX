import { useState } from 'react';
import { Search, ChevronUp, MessageSquare, Check, Filter } from 'lucide-react';

const initialDoubts = [
  {
    id: 1,
    votes: 124,
    hasUpvoted: false,
    title: 'Why does this Java code throw NullPointerException when the array is initialized?',
    tags: ['Java', 'OOP', 'Exceptions'],
    author: 'Rahul Sharma',
    answers: 8,
    time: '2 hours ago',
    hasAccepted: true
  },
  {
    id: 2,
    votes: 86,
    hasUpvoted: false,
    title: 'Time complexity difference between Dijkstra and Bellman Ford in dense graphs?',
    tags: ['Algorithms', 'Graphs', 'GATE'],
    author: 'Priya Patel',
    answers: 3,
    time: '5 hours ago',
    hasAccepted: false
  },
  {
    id: 3,
    votes: 42,
    hasUpvoted: false,
    title: 'How to calculate effective memory access time with TLB?',
    tags: ['OS', 'Memory Management'],
    author: 'Aman Kumar',
    answers: 5,
    time: '1 day ago',
    hasAccepted: true
  }
];

export default function Doubts() {
  const [activeTab, setActiveTab] = useState('trending');
  const [doubts, setDoubts] = useState(initialDoubts);

  // ACCURATE TOGGLE UPVOTE LOGIC (FIRST CLICK +1, SECOND CLICK REMOVES UPVOTE)
  const handleToggleVote = (id) => {
    setDoubts(doubts.map(d => {
      if (d.id === id) {
        const isCurrentlyUpvoted = d.hasUpvoted || false;
        return {
          ...d,
          hasUpvoted: !isCurrentlyUpvoted,
          votes: isCurrentlyUpvoted ? Math.max(0, d.votes - 1) : d.votes + 1
        };
      }
      return d;
    }));
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-primary-600 dark:text-primary-400 uppercase mb-2">DOUBT COMMUNITY</h2>
          <h1 className="text-4xl font-bold">Ask. Explain. Learn together.</h1>
        </div>
        <button className="btn-primary py-2.5 px-6 shadow-lg shadow-primary-500/20 whitespace-nowrap">
          + Ask a Doubt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto scrollbar-hide shrink-0">
              {['latest', 'trending', 'unanswered'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                className="input-field pl-9 py-2 text-sm" 
                placeholder="Search doubts..." 
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {doubts.map(doubt => {
              const isUpvoted = doubt.hasUpvoted || false;
              return (
                <div key={doubt.id} className="glass-card p-5 flex gap-4 hover:border-primary-200 dark:hover:border-primary-800 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                    {/* ACCURATE UPVOTE TOGGLE BUTTON */}
                    <button 
                      onClick={() => handleToggleVote(doubt.id)}
                      className={`p-1.5 rounded-lg transition-all ${
                        isUpvoted 
                          ? 'bg-indigo-100 text-indigo-700 font-bold' 
                          : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                      }`}
                      title={isUpvoted ? 'Remove Upvote' : 'Upvote'}
                    >
                      <ChevronUp size={24} className={isUpvoted ? 'stroke-[3px]' : ''} />
                    </button>
                    <span className={`font-bold text-base ${isUpvoted ? 'text-indigo-600' : 'text-slate-700'}`}>
                      {doubt.votes}
                    </span>
                    {doubt.hasAccepted && (
                      <div className="mt-2 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary-600 transition-colors leading-snug">
                      {doubt.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doubt.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 text-white flex items-center justify-center text-[10px] font-bold">
                          {doubt.author.charAt(0)}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">{doubt.author}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{doubt.time}</span>
                      </div>
                      
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${doubt.answers > 0 ? (doubt.hasAccepted ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-primary-600 bg-primary-50 dark:bg-primary-900/20') : ''}`}>
                        <MessageSquare size={14} />
                        <span>{doubt.answers} {doubt.answers === 1 ? 'answer' : 'answers'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Filter size={18} className="text-primary-500" />
              Filter by Subject
            </h3>
            <div className="flex flex-col gap-2">
              {['Java', 'Data Structures', 'Algorithms', 'Operating Systems', 'DBMS'].map(sub => (
                <label key={sub} className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{sub}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-5 border-t-4 border-t-emerald-500">
            <h3 className="font-bold mb-2">Top Contributors</h3>
            <p className="text-xs text-slate-500 mb-4">Earn reputation by answering questions correctly.</p>
            
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">U{i}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold leading-none">User {i}</p>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1">1,240 XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
