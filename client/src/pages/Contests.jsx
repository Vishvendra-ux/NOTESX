import { useState } from 'react';
import { Trophy, Code, Users, Zap, Clock, ChevronRight, Award } from 'lucide-react';

export default function Contests() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const leaderboards = [
    { rank: 1, name: 'IIT Delhi', score: '94,200', change: '+2' },
    { rank: 2, name: 'GLA University', score: '88,150', change: '+5' },
    { rank: 3, name: 'BITS Pilani', score: '86,400', change: '-1' },
    { rank: 4, name: 'AKTU', score: '82,100', change: '0' },
  ];

  const contests = [
    {
      id: 'live-42',
      title: 'Weekly Coding Battle #42',
      status: 'live',
      tag: 'LIVE NOW',
      accent: 'from-red-500 to-orange-500',
      borderClass: 'border-red-200 dark:border-red-900/50',
      iconBg: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-100 dark:border-red-800',
      tagBg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      icon: Code,
      description: 'Data Structures and Algorithms focused contest. 4 programming questions. Top 10 colleges earn 500 bonus XP.',
      timeLabel: 'Ends In',
      timeValue: '01:45:20',
      meta: '1,248 participants · 10,000 XP Pool',
      buttonText: 'Enter Arena',
      buttonClass: 'px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-lg transition-colors',
    },
    {
      id: 'upcoming-gate-5',
      title: 'GATE Mock Test 5: Computer Networks',
      status: 'upcoming',
      tag: 'UPCOMING',
      accent: 'from-indigo-500 to-purple-600',
      borderClass: 'hover:border-indigo-300 dark:hover:border-indigo-700',
      iconBg: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 border-primary-100 dark:border-primary-800',
      tagBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      icon: Zap,
      description: 'Full length CN mock test. 65 Questions, 180 Minutes. Standard GATE marking scheme applies.',
      timeLabel: 'Starts',
      timeValue: 'Oct 18, 10:00 AM',
      meta: 'Starts Oct 18, 10:00 AM · 420 Registered',
      buttonText: 'Register Now',
      buttonClass: 'btn-secondary px-4 py-2 text-sm',
    },
    {
      id: 'upcoming-os-cup',
      title: 'Operating Systems Concurrency Cup',
      status: 'upcoming',
      tag: 'UPCOMING',
      accent: 'from-amber-500 to-yellow-500',
      borderClass: 'hover:border-amber-300 dark:hover:border-amber-700',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800',
      tagBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      icon: Zap,
      description: 'Race conditions, synchronization semaphores, and memory deadlock puzzles.',
      timeLabel: 'Starts',
      timeValue: 'Oct 22, 06:00 PM',
      meta: 'Starts Oct 22, 06:00 PM · 280 Registered',
      buttonText: 'Register Now',
      buttonClass: 'btn-secondary px-4 py-2 text-sm',
    },
    {
      id: 'past-41',
      title: 'Weekly Coding Battle #41',
      status: 'past',
      tag: 'CONCLUDED',
      accent: 'from-slate-400 to-slate-500',
      borderClass: 'hover:border-slate-300 dark:hover:border-slate-700 opacity-90',
      iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      tagBg: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
      icon: Code,
      description: 'Dynamic Programming & Graph shortest paths. 1,120 participants across 45 campus teams.',
      timeLabel: 'Finished',
      timeValue: 'Oct 11, 2026',
      meta: '1,120 participants · Won by IIT Delhi',
      buttonText: 'View Problems & Standings',
      buttonClass: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold rounded-lg',
    },
    {
      id: 'past-dbms-3',
      title: 'DBMS SQL Speedrun Challenge #3',
      status: 'past',
      tag: 'CONCLUDED',
      accent: 'from-slate-400 to-slate-500',
      borderClass: 'hover:border-slate-300 dark:hover:border-slate-700 opacity-90',
      iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      tagBg: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
      icon: Award,
      description: 'Advanced aggregation, window functions, and query plan optimization challenges.',
      timeLabel: 'Finished',
      timeValue: 'Oct 04, 2026',
      meta: '890 participants · Won by GLA University',
      buttonText: 'View Problems & Standings',
      buttonClass: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold rounded-lg',
    },
  ];

  const visibleContests = contests.filter((c) => c.status === activeTab);

  return (
    <div className="animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="glass-card overflow-hidden relative p-8 md:p-12 mb-8 bg-slate-900 border-slate-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xNSkiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-wider mb-4 text-white backdrop-blur-md shadow-sm">
              <Zap size={14} className="text-amber-400" /> College vs College
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight !text-white text-white drop-shadow-md">
              Prove your college is the best in India.
            </h1>
            <p className="text-slate-200 text-base md:text-lg mb-6 leading-relaxed max-w-lg">
              Compete in coding battles, logical reasoning, and GATE mock contests. Earn points for your college leaderboard.
            </p>
            <button className="btn-primary text-base font-bold px-7 py-3 shadow-lg shadow-indigo-500/30 w-full md:w-auto">
              View Global Leaderboard
            </button>
          </div>
          
          <div className="hidden md:block flex-shrink-0">
            <Trophy size={160} strokeWidth={1.2} className="text-white/30 drop-shadow-2xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contests List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex bg-slate-100 p-1.5 rounded-xl overflow-x-auto scrollbar-hide shrink-0 w-fit border border-slate-200">
            {['upcoming', 'live', 'past'].map(tab => {
              const count = contests.filter((c) => c.status === tab).length;
              return (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all flex items-center gap-2 ${
                    activeTab === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            {visibleContests.length > 0 ? (
              visibleContests.map((contest) => {
                const Icon = contest.icon;
                return (
                  <div
                    key={contest.id}
                    className={`glass-card overflow-hidden group cursor-pointer transition-all duration-200 ${contest.borderClass}`}
                  >
                    <div className={`h-1.5 w-full bg-gradient-to-r ${contest.accent}`}></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${contest.iconBg}`}>
                            <Icon size={24} />
                          </div>
                          <div>
                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider mb-1 ${contest.tagBg}`}>
                              {contest.status === 'live' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                              )}
                              {contest.tag}
                            </div>
                            <h3 className="text-xl font-bold group-hover:text-primary-600 transition-colors">
                              {contest.title}
                            </h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                            {contest.timeLabel}
                          </p>
                          <p className="text-base font-black font-mono text-slate-800 dark:text-slate-200">
                            {contest.timeValue}
                          </p>
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                        {contest.description}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-4">
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                          <span>{contest.meta}</span>
                        </div>
                        <button className={contest.buttonClass}>
                          {contest.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white dark:bg-slate-900/50">
                <Trophy size={36} className="mx-auto text-slate-300 mb-3" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">No {activeTab} contests right now</h4>
                <p className="text-xs text-slate-500 mt-1">Check back soon or explore upcoming college battles.</p>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-0 overflow-hidden sticky top-24">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" />
                Global College Rank
              </h3>
            </div>
            
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/50">
              {leaderboards.map((lb) => (
                <div key={lb.rank} className={`p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${lb.name === 'GLA University' ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    lb.rank === 1 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                    lb.rank === 2 ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                    lb.rank === 3 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                    'font-bold text-slate-400'
                  }`}>
                    {lb.rank}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${lb.name === 'GLA University' ? 'text-primary-600 dark:text-primary-400' : ''}`}>{lb.name}</p>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{lb.score} XP</p>
                  </div>
                  
                  <div className={`text-xs font-bold ${lb.change.startsWith('+') ? 'text-emerald-500' : lb.change.startsWith('-') ? 'text-red-500' : 'text-slate-400'}`}>
                    {lb.change}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50 text-center">
              <button className="text-sm font-bold text-primary-600 hover:text-primary-700">View Full Leaderboard</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

