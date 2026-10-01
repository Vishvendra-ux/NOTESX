import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, ChevronDown, Sparkles, LogOut, ShieldCheck, User, BookOpen, Check, Users2 } from 'lucide-react';
import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { notesService } from '../services/api';
import SearchModal from './SearchModal';

const getNotificationId = (note) => String(note._id || note.id);

const formatRelativeDate = (dateValue) => {
  if (!dateValue) return '';
  const timestamp = new Date(dateValue).getTime();
  if (!Number.isFinite(timestamp)) return '';

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(timestamp);
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState(new Set());
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(false);
  const [notificationRefresh, setNotificationRefresh] = useState(0);
  const notificationPanelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const userKey = user ? String(user._id || user.id || user.email || 'account') : '';
  const readStorageKey = userKey ? `notesx:notifications:seen:${userKey}` : '';
  const unreadCount = notifications.filter((note) => !readNotificationIds.has(getNotificationId(note))).length;

  useEffect(() => {
    if (!readStorageKey) {
      setReadNotificationIds(new Set());
      return;
    }

    try {
      const savedIds = JSON.parse(localStorage.getItem(readStorageKey) || '[]');
      setReadNotificationIds(new Set(Array.isArray(savedIds) ? savedIds.map(String) : []));
    } catch {
      setReadNotificationIds(new Set());
    }
  }, [readStorageKey]);

  useEffect(() => {
    let isCurrent = true;
    if (!user) {
      setNotifications([]);
      setNotificationsError(false);
      setNotificationsLoading(false);
      return () => { isCurrent = false; };
    }

    setNotificationsLoading(true);
    setNotificationsError(false);
    notesService.list({ limit: 5, sort: 'newest' })
      .then(({ data }) => {
        if (isCurrent) setNotifications(Array.isArray(data?.notes) ? data.notes : []);
      })
      .catch(() => {
        if (isCurrent) setNotificationsError(true);
      })
      .finally(() => {
        if (isCurrent) setNotificationsLoading(false);
      });

    return () => { isCurrent = false; };
  }, [userKey, notificationRefresh]);

  const markNotificationsRead = useCallback((items = notifications) => {
    if (!readStorageKey || !items.length) return;

    setReadNotificationIds((previous) => {
      const next = new Set(previous);
      items.forEach((note) => next.add(getNotificationId(note)));
      try {
        localStorage.setItem(readStorageKey, JSON.stringify([...next]));
      } catch {
        // Keep the in-memory read state even when browser storage is unavailable.
      }
      return next;
    });
  }, [notifications, readStorageKey]);

  useEffect(() => {
    if (notificationsOpen) markNotificationsRead();
  }, [notificationsOpen, markNotificationsRead]);

  useEffect(() => {
    if (!notificationsOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!notificationPanelRef.current?.contains(event.target)) setNotificationsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setNotificationsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notificationsOpen]);

  useEffect(() => {
    setNotificationsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Colleges', path: '/colleges' },
    { name: 'Notes', path: '/notes' },
    { name: 'Roadmaps', path: '/roadmaps' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'GATE', path: '/gate' },
    { name: 'Doubts', path: '/doubts' },
    { name: 'Contests', path: '/contests' },
    { name: 'BuildTogether', path: '/build-together', isNew: true, icon: Users2 },
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
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-2.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${
                      isActive(link.path)
                        ? 'text-indigo-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                    }`}
                  >
                    {Icon && (
                      <Icon
                        size={15}
                        className={isActive(link.path) ? "text-indigo-600" : "text-indigo-500/80"}
                      />
                    )}
                    <span className="relative">
                      {link.name}
                      {isActive(link.path) && (
                        <span className="absolute inset-x-0 -bottom-[14px] h-0.5 bg-indigo-600 rounded-full" />
                      )}
                    </span>
                    {link.isNew && (
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full leading-none shadow-xs shadow-indigo-500/20">
                        New
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {location.pathname === '/colleges' ? (
                <button 
                  onClick={() => setSearchOpen(true)} 
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-200 hover:text-indigo-600 hover:bg-white transition-all shadow-sm"
                  aria-label="Global quick search (⌘K)"
                  title="Global quick search (⌘K)"
                >
                  <Search size={16} aria-hidden="true" />
                </button>
              ) : (
                <button 
                  onClick={() => setSearchOpen(true)} 
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 hover:border-indigo-200"
                  aria-label="Search"
                >
                  <Search size={16} />
                  <span>Search</span>
                  <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
                </button>
              )}

              {user ? (
                <>
                  <div className="relative" ref={notificationPanelRef}>
                    <button
                      onClick={() => setNotificationsOpen((open) => !open)}
                      className={`p-2 rounded-xl transition-colors relative ${notificationsOpen ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                      aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
                      aria-expanded={notificationsOpen}
                      aria-haspopup="dialog"
                    >
                      <Bell size={18} />
                      {unreadCount > 0 && <span className="absolute top-1 right-1 flex min-w-4 h-4 items-center justify-center rounded-full border-2 border-white bg-red-500 px-0.5 text-[9px] font-bold leading-none text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                    </button>

                    {notificationsOpen && (
                      <section
                        role="dialog"
                        aria-label="Notifications"
                        className="absolute right-0 top-full z-[60] mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 animate-slide-up"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                          <div>
                            <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
                            <p className="mt-0.5 text-[11px] text-slate-500">Recent notes shared with the community</p>
                          </div>
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={() => markNotificationsRead()}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50"
                            >
                              <Check size={13} /> Mark read
                            </button>
                          )}
                        </div>

                        {notificationsLoading ? (
                          <div className="px-4 py-8 text-center text-xs text-slate-500">Loading recent notes…</div>
                        ) : notificationsError ? (
                          <div className="px-4 py-7 text-center">
                            <p className="text-xs text-slate-600">Couldn’t load recent notes.</p>
                            <button type="button" onClick={() => setNotificationRefresh((count) => count + 1)} className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700">Try again</button>
                          </div>
                        ) : notifications.length ? (
                          <div className="max-h-[min(60vh,24rem)] overflow-y-auto py-1">
                            {notifications.map((note) => {
                              const notificationId = getNotificationId(note);
                              const isUnread = !readNotificationIds.has(notificationId);
                              return (
                                <button
                                  type="button"
                                  key={notificationId}
                                  onClick={() => {
                                    markNotificationsRead([note]);
                                    setNotificationsOpen(false);
                                    navigate(`/notes/${notificationId}`);
                                  }}
                                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                                >
                                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isUnread ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}><BookOpen size={17} /></span>
                                  <span className="min-w-0 flex-1">
                                    <span className="flex items-start justify-between gap-2">
                                      <span className="line-clamp-2 text-xs font-bold text-slate-800">{note.title || 'New study note'}</span>
                                      {isUnread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" aria-label="Unread" />}
                                    </span>
                                    <span className="mt-1 block truncate text-[11px] text-slate-500">{note.subject || note.branch || 'New study material'}{note.createdAt ? ` · ${formatRelativeDate(note.createdAt)}` : ''}</span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Bell size={18} /></span>
                            <p className="mt-3 text-xs font-semibold text-slate-700">You’re all caught up</p>
                            <p className="mt-1 text-[11px] text-slate-500">New study notes will show up here.</p>
                          </div>
                        )}

                        <div className="border-t border-slate-100 px-4 py-2.5">
                          <button type="button" onClick={() => { setNotificationsOpen(false); navigate('/notes'); }} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Browse all notes</button>
                        </div>
                      </section>
                    )}
                  </div>

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
                        <Link 
                          to="/ai-assistant" 
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl"
                        >
                          <Sparkles size={14} /> AI Study Assistant
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
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold ${
                    isActive(link.path)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="text-indigo-600" />}
                    <span>{link.name}</span>
                  </div>
                  {link.isNew && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full leading-none">
                      New
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              to="/ai-assistant"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50"
            >
              <Sparkles size={16} /> AI Study Assistant
            </Link>

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
