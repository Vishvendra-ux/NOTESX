import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, ChevronDown, Sparkles, LogOut, ShieldCheck, User } from 'lucide-react';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const navLinks = [
    { name: 'Colleges', path: '/colleges' },
    { name: 'Notes', path: '/notes' },
    { name: 'GATE', path: '/gate' },
    { name: 'Doubts', path: '/doubts' },
    { name: 'Contests', path: '/contests' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[68px]">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#273aab] flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Sparkles size={18} />
                </div>
                <span className="font-extrabold text-[17px] tracking-[-.04em] text-slate-900">
                  NOTE<span className="text-indigo-600">SX</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && <span className="absolute inset-x-3 -bottom-[14px] h-0.5 bg-indigo-600" />}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <button 
                onClick={() => setSearchOpen(true)} 
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 hover:border-indigo-200"
                aria-label="Search"
              >
                <Search size={16} />
                <span>Search</span>
                <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
              </button>

              {user ? (
                <>
                  <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative" aria-label="Notifications">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>

                  <div className="h-6 w-px bg-slate-200 mx-1"></div>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="text-left leading-tight">
                        <b className="block text-xs font-bold text-slate-900 truncate max-w-[110px]">{user.name || 'Student'}</b>
                        <span className="text-[10px] text-indigo-600 font-bold capitalize">{user.role || 'Student'}</span>
                      </div>
                      <ChevronDown size={14} className="text-slate-400" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-slide-up">
                        <div className="px-3 py-2 border-b border-slate-100">
                          <b className="block text-xs font-bold text-slate-900">{user.name}</b>
                          <span className="text-[11px] text-slate-500 truncate block">{user.email}</span>
                          {user.role === 'admin' && (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[9px] font-extrabold text-indigo-700">
                              <ShieldCheck size={11} /> Admin Verified
                            </span>
                          )}
                        </div>
                        <Link 
                          to="/profile" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl mt-1"
                        >
                          <User size={14} /> My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary py-2 px-4 text-xs font-bold">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center gap-2">
              <button className="text-slate-600 p-2" onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search size={20} />
              </button>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-2 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-bold ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-slate-100 pt-3 mt-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut size={16} /> Sign Out ({user.email})
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 rounded-xl text-xs font-bold text-slate-700 border border-slate-200">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center btn-primary py-2 text-xs font-bold">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
