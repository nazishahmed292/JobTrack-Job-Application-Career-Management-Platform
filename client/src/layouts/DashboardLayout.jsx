import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowUpRight, BarChart3, Bell, Briefcase, CalendarDays, CheckCheck, ChevronDown, FileText, LayoutDashboard, LogOut, Menu, Moon, Search, Settings, Sparkles, Sun, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Applications', path: '/applications', icon: Briefcase },
  { label: 'Pipeline', path: '/pipeline', icon: BarChart3 },
  { label: 'Interviews', path: '/interviews', icon: CalendarDays },
  { label: 'Resume', path: '/resume', icon: FileText },
  { label: 'Job Analyzer', path: '/analyzer', icon: Sparkles },
  { label: 'Profile', path: '/profile', icon: UserRound },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('jobtrack_theme') || 'light');
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('jobtrack_theme', theme);
  }, [theme]);

  useEffect(() => {
    const syncTheme = (event) => setTheme(event.detail === 'dark' ? 'dark' : 'light');
    window.addEventListener('jobtrack-theme-change', syncTheme);
    return () => window.removeEventListener('jobtrack-theme-change', syncTheme);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const markNotificationsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
    }
  };

  const handleThemeToggle = async () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      await api.put('/users/preferences', { theme: nextTheme });
      window.dispatchEvent(new CustomEvent('jobtrack-theme-change', { detail: nextTheme }));
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    if (search.trim()) navigate(`/applications?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="app-shell flex min-h-screen">
      <aside className={`sidebar fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col border-r border-white/5 px-3 py-5 transition-all duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${collapsed ? 'md:w-[76px]' : ''}`}>
        <div className="mb-8 flex h-10 items-center justify-between px-2">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-400 text-white"><Briefcase size={17} /></span>
            <span className={`whitespace-nowrap text-[17px] font-bold text-white ${collapsed ? 'md:hidden' : ''}`}>JobTrack<span className="text-indigo-300">.</span></span>
          </Link>
          <button aria-label="Close navigation" className="rounded-md p-1 text-slate-300 hover:bg-white/10 md:hidden" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>

        <div className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 ${collapsed ? 'md:hidden' : ''}`}>Workspace</div>
        <nav className="space-y-1" aria-label="Main navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} title={collapsed ? label : undefined} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} flex h-10 items-center gap-3 rounded-md px-3 text-[13px] font-medium ${collapsed ? 'md:justify-center md:px-0' : ''}`} onClick={() => setMobileOpen(false)}>
              <Icon size={17} strokeWidth={1.8} /><span className={`whitespace-nowrap ${collapsed ? 'md:hidden' : ''}`}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={`mt-8 border-t border-white/10 pt-5 ${collapsed ? 'md:hidden' : ''}`}>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Your momentum</div>
          <div className="mx-1 rounded-lg border border-white/10 bg-white/[0.035] p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-300"><span>Unread updates</span><span className="font-semibold text-white">{unreadCount}</span></div>
            <div className="mt-3 h-1 rounded-full bg-white/10"><div className="h-1 w-2/3 rounded-full bg-indigo-400" /></div>
            <div className="mt-2 text-[11px] text-slate-500">Keep your search moving</div>
          </div>
        </div>

        <div className="mt-auto border-t border-white/10 pt-4">
          <button onClick={() => setCollapsed((value) => !value)} className="hidden h-9 w-full items-center justify-center rounded-md text-xs text-slate-400 hover:bg-white/5 hover:text-white md:flex" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ArrowUpRight size={16} className="rotate-45" /> : <span className="flex items-center gap-2"><span>Collapse sidebar</span><ArrowUpRight size={14} className="rotate-[225deg]" /></span>}
          </button>
          <button onClick={handleLogout} className={`mt-1 flex h-10 w-full items-center gap-3 rounded-md px-3 text-[13px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white ${collapsed ? 'md:justify-center md:px-0' : ''}`} title={collapsed ? 'Sign out' : undefined}>
            <LogOut size={17} /><span className={collapsed ? 'md:hidden' : ''}>Sign out</span>
          </button>
        </div>
      </aside>

      <div className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[margin] duration-200 ${collapsed ? 'md:ml-[76px]' : 'md:ml-[258px]'}`}>
        <header className="topbar sticky top-0 z-30 border-b">
          <div className="flex min-h-[66px] items-center justify-between gap-3 px-4 md:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button aria-label="Open navigation" className="rounded-md border border-[var(--border)] p-2 text-[var(--muted)] md:hidden" onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
              <div className="hidden min-w-0 sm:block"><div className="text-[11px] text-[var(--muted)]">{greeting},</div><div className="truncate text-[13px] font-semibold text-[var(--text)]">{user?.fullName || 'User'}</div></div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <form onSubmit={submitSearch} className="relative hidden md:block">
                <Search size={15} className="absolute left-3 top-[11px] text-[var(--muted)]" />
                <input aria-label="Search applications" className="input h-9 w-56 bg-[var(--panel-soft)] py-1 pl-9 pr-3 text-xs" placeholder="Search applications..." value={search} onChange={(event) => setSearch(event.target.value)} />
              </form>
              <button onClick={handleThemeToggle} className="rounded-md p-2 text-[var(--muted)] transition hover:bg-[var(--panel-strong)] hover:text-[var(--text)]" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title="Toggle theme">{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button>
              <div className="relative">
                <button onClick={() => { setNotificationOpen((value) => !value); setProfileOpen(false); }} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`} className="relative rounded-md p-2 text-[var(--muted)] transition hover:bg-[var(--panel-strong)] hover:text-[var(--text)]">
                  <Bell size={17} />{unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[var(--panel)]" />}
                </button>
                {notificationOpen && <div className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-32px))] rounded-lg border border-[var(--border)] bg-[var(--panel)] p-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[var(--border)] px-1 pb-3"><span className="font-semibold text-[var(--text)]">Notifications</span><button onClick={markNotificationsRead} className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] disabled:opacity-50" disabled={!unreadCount}><CheckCheck size={14} /> Mark all read</button></div>
                  <div className="max-h-72 overflow-auto pt-2">
                    {notifications.length ? notifications.slice(0, 8).map((item) => <div key={item._id} className="border-b border-[var(--border)] px-1 py-3 last:border-0"><div className="flex items-start gap-2"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.read ? 'bg-transparent' : 'bg-indigo-500'}`} /><div><div className="text-sm font-medium text-[var(--text)]">{item.title || item.message}</div>{item.title && <p className="mt-1 text-xs text-[var(--muted)]">{item.message}</p>}</div></div></div>) : <div className="py-8 text-center text-sm text-[var(--muted)]">You&apos;re all caught up.</div>}
                  </div>
                </div>}
              </div>
              <div className="relative">
                <button onClick={() => { setProfileOpen((value) => !value); setNotificationOpen(false); }} className="flex items-center gap-2 rounded-md p-1.5 transition hover:bg-[var(--panel-strong)]" aria-expanded={profileOpen} aria-label="Open profile menu">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e3e7ff] text-xs font-bold text-[#485ac4]">{user?.fullName?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'U'}</span>
                  <span className="hidden text-left sm:block"><span className="block max-w-32 truncate text-xs font-semibold text-[var(--text)]">{user?.fullName || 'User'}</span><span className="block max-w-32 truncate text-[10px] text-[var(--muted)]">{user?.email || ''}</span></span>
                  <ChevronDown size={14} className="hidden text-[var(--muted)] sm:block" />
                </button>
                {profileOpen && <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-1.5 shadow-xl">
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[var(--text)] hover:bg-[var(--panel-strong)]"><UserRound size={15} /> Profile</Link>
                  <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[var(--text)] hover:bg-[var(--panel-strong)]"><Settings size={15} /> Settings</Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"><LogOut size={15} /> Sign out</button>
                </div>}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-7 md:py-8"><div className="page-wrap fade-in"><Outlet /></div></main>
      </div>

      {mobileOpen && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-black/45 md:hidden" onClick={() => setMobileOpen(false)} />}
    </div>
  );
};

export default DashboardLayout;
