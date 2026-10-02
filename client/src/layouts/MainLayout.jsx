import Navbar from '../components/Navbar';
import AIAssistant from '../components/AIAssistant';
import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Target, MessageCircle, UserRound } from 'lucide-react';

function MobileBottomNav() {
  const { pathname } = useLocation();
  if (pathname === '/login' || pathname === '/register') return null;
  const items = [[Home, 'Home', '/'], [Compass, 'Explore', '/colleges'], [Target, 'GATE', '/gate'], [MessageCircle, 'Community', '/doubts'], [UserRound, 'Profile', '/profile']];
  return <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Mobile navigation">{items.map(([Icon,label,to]) => { const on = to === '/' ? pathname === '/' : pathname.startsWith(to); return <Link key={label} to={to} className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold ${on ? 'text-indigo-600' : 'text-slate-500'}`}><Icon size={19} strokeWidth={on ? 2.5 : 2}/>{label}</Link>; })}</nav>;
}

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col relative bg-grid-pattern">
      <div className="fixed inset-0 radial-gradient-bg pointer-events-none -z-10"></div>
      <Navbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 animate-fade-in">
        <Outlet />
      </main>
      
      <AIAssistant />

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-auto glass-panel">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} NOTESX. All rights reserved.
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  );
}
