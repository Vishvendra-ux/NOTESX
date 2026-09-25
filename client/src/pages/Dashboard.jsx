import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Award, BookOpen, MessageSquare, Zap, Trophy, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // Mock data for display
  const stats = [
    { label: 'Progress', value: '78%', icon: <Zap className="text-orange-500" /> },
    { label: 'Questions Solved', value: '142', icon: <BookOpen className="text-primary-500" /> },
    { label: 'College Rank', value: '#18', icon: <Trophy className="text-purple-500" /> },
    { label: 'Total XP', value: '1,240', icon: <Award className="text-emerald-500" /> },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      
      {/* Header Profile Section */}
      <section className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg overflow-hidden">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user?.name?.charAt(0).toUpperCase() || 'V'
          )}
        </div>
        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Good evening, {user?.name || 'Vishvendra'} 👋</h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold mx-auto md:mx-0">
              <Flame size={14} /> 14 Day Streak
            </div>
          </div>
          <p className="text-slate-500 font-semibold text-xs">{user?.course || 'B.Tech CSE'} • {user?.year || '3rd Year'}</p>
          <p className="text-indigo-600 font-bold text-sm mt-1">{user?.collegeName || 'GLA University'}</p>
        </div>
        <div className="z-10 mt-4 md:mt-0">
          <Link to="/profile" className="btn-secondary text-xs px-4 py-2 font-bold">Edit Profile</Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Continue Learning */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xl font-bold">Continue Learning</h3>
              <Link to="/gate" className="text-sm font-medium text-primary-600 hover:underline">View GATE Dashboard</Link>
            </div>
            <div className="glass-card p-6 flex flex-col gap-5">
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex flex-col items-center justify-center border border-blue-100 dark:border-blue-800">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">DBMS</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm">Database Management</span>
                    <span className="text-sm font-bold text-slate-500">80%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex flex-col items-center justify-center border border-emerald-100 dark:border-emerald-800">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">OS</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm">Operating Systems</span>
                    <span className="text-sm font-bold text-slate-500">60%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Recommended Notes */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xl font-bold">Recommended Notes</h3>
              <Link to="/notes" className="text-sm font-medium text-primary-600 hover:underline">Browse All</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              
              <div className="glass-card p-5 group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                    <BookOpen size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">★ 4.8</span>
                </div>
                <h4 className="font-bold mb-1 group-hover:text-primary-600 transition-colors">Process Synchronization</h4>
                <p className="text-xs text-slate-500 mb-3">B.Tech CSE • 3rd Year</p>
                <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
                  <span>1.2K downloads</span>
                  <span className="text-primary-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                </div>
              </div>

              <div className="glass-card p-5 group cursor-pointer hover:-translate-y-1 transition-transform">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                    <BookOpen size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">★ 4.9</span>
                </div>
                <h4 className="font-bold mb-1 group-hover:text-primary-600 transition-colors">B-Trees & Indexing</h4>
                <p className="text-xs text-slate-500 mb-3">B.Tech CSE • 3rd Year</p>
                <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
                  <span>840 downloads</span>
                  <span className="text-primary-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">View →</span>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-8">
          
          {/* Recent Doubts */}
          <section>
            <h3 className="text-xl font-bold mb-4">Recent Doubts</h3>
            <div className="glass-card p-0 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              
              <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center justify-center px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded min-w-[2.5rem]">
                    <span className="text-xs font-bold">12</span>
                    <span className="text-[10px] text-slate-500 uppercase">Votes</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1 line-clamp-2 hover:text-primary-600 transition-colors">How does a TLB miss handle page faults in OS?</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">OS</span>
                      <span>2 hrs ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center justify-center px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded min-w-[2.5rem]">
                    <span className="text-xs font-bold">5</span>
                    <span className="text-[10px] text-slate-500 uppercase">Votes</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1 line-clamp-2 hover:text-primary-600 transition-colors">Dijkstra's vs Bellman Ford time complexity comparison</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Algorithms</span>
                      <span>4 hrs ago</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Upcoming Contests */}
          <section>
            <h3 className="text-xl font-bold mb-4">Upcoming Contests</h3>
            <div className="glass-card p-5 relative overflow-hidden group border-primary-200 dark:border-primary-900/50 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400 to-purple-500 opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
              
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                LIVE NOW
              </div>
              
              <h4 className="font-bold text-lg mb-1">College Coding Battle #42</h4>
              <p className="text-sm text-slate-500 mb-4">1,248 participants currently competing</p>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800"></div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500">+1k</div>
                </div>
                <span className="text-sm font-bold text-primary-600">Join →</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

