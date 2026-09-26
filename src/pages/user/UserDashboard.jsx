import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import UserOverview from './UserOverview';
import UserProfile from './UserProfile';
import UserSettings from './UserSettings';
import UserHelp from './UserHelp';

const TOP_NAV_ITEMS = [
  {
    name: 'Overview',
    path: '/user-dashboard',
    exact: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
];

const BOTTOM_NAV_ITEMS = [
  {
    name: 'Profile',
    path: '/user-dashboard/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    name: 'Setting',
    path: '/user-dashboard/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: 'Help',
    path: '/user-dashboard/help',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const UserDashboard = () => {
  const { user, logoutUser } = useUserAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showUserMenu]);

  const handleLogout = () => {
    logoutUser();
    navigate('/user/login');
  };

  const isActiveRoute = (item) => {
    if (item.exact) {
      return location.pathname === '/user-dashboard' || location.pathname === '/user-dashboard/';
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex h-screen bg-[#070e13] overflow-hidden text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* ── Mobile Drawer Backdrop ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* ── LEFT SIDEBAR (Sticky, not scrollable on desktop; slide drawer on mobile) ── */}
      <aside
        className={`flex flex-col justify-between shrink-0 bg-[#070e13] md:bg-[#070e13]/95 backdrop-blur-xl border-r border-white/[0.07] transition-all duration-300 fixed inset-y-0 left-0 z-50 md:relative md:z-30 overflow-hidden ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${
          collapsed ? 'w-64 md:w-[68px]' : 'w-64'
        }`}
      >
        {/* Top: Logo area */}
        <div>
          <div
            className={`flex items-center justify-between border-b border-white/[0.06] shrink-0 transition-all duration-300 ${
              collapsed ? 'h-16 px-3 md:justify-center' : 'h-[78px] px-4'
            }`}
          >
            {collapsed ? (
              <>
                <div className="hidden md:flex w-11 h-11 rounded-xl overflow-hidden bg-black/60 border border-white/[0.08] items-center justify-center shrink-0 shadow-md p-1" title="MyCastNow - Listener Space">
                  <img src="/logo.png" alt="MyCastNow" className="w-full h-full object-cover object-left mix-blend-screen" />
                </div>
                <div className="md:hidden flex flex-col justify-center min-w-0 py-1">
                  <img
                    src="/logo.png"
                    alt="MyCastNow"
                    className="h-11 w-auto max-w-[180px] object-contain object-left mix-blend-screen"
                  />
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">
                      Listener Space
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center min-w-0 w-full py-1">
                <img
                  src="/logo.png"
                  alt="MyCastNow"
                  className="h-11 w-auto max-w-[180px] object-contain object-left mix-blend-screen"
                />
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">
                    Listener Space
                  </span>
                </div>
              </div>
            )}

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0 ml-2"
              title="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Top Navigation Links (Overview) */}
          <div className="p-2.5 space-y-1.5">
            <span className={`text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 block ${collapsed ? 'md:hidden' : ''}`}>
              Main Menu
            </span>
            {TOP_NAV_ITEMS.map((item) => {
              const active = isActiveRoute(item);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    collapsed ? 'md:justify-center md:w-11 md:h-11 md:mx-auto gap-3.5 px-3 py-2.5' : 'gap-3.5 px-3 py-2.5'
                  } ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={`${active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'} shrink-0`}>
                    {item.icon}
                  </span>
                  <span className={collapsed ? 'md:hidden' : ''}>{item.name}</span>
                  {active && (
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${collapsed ? 'md:absolute md:top-1.5 md:right-1.5 ml-auto' : 'ml-auto'}`} />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Section (Profile, Setting, Help) ── */}
        <div className="border-t border-white/[0.06] bg-black/20">
          <div className="p-2.5 space-y-1.5">
            <span className={`text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-1.5 block ${collapsed ? 'md:hidden' : ''}`}>
              Preferences & Support
            </span>
            {BOTTOM_NAV_ITEMS.map((item) => {
              const active = isActiveRoute(item);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    collapsed ? 'md:justify-center md:w-11 md:h-11 md:mx-auto gap-3.5 px-3 py-2.5' : 'gap-3.5 px-3 py-2.5'
                  } ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={`${active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'} shrink-0`}>
                    {item.icon}
                  </span>
                  <span className={collapsed ? 'md:hidden' : ''}>{item.name}</span>
                  {active && (
                    <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${collapsed ? 'md:absolute md:top-1.5 md:right-1.5 ml-auto' : 'ml-auto'}`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3.5 px-4 border-t border-white/[0.06]">
            <div className={`text-[11px] text-slate-500 flex items-center justify-between ${collapsed ? 'md:hidden' : ''}`}>
              <span>Listener v2.4</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Hi-Fi 320k
              </span>
            </div>
            {collapsed && (
              <div className="hidden md:flex justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── RIGHT MAIN CONTAINER (Scrollable) ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#070e13]/80 backdrop-blur-xl border-b border-white/[0.07] px-4 sm:px-6 flex items-center justify-between shrink-0 relative z-20">
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            {/* Sidebar Collapse / Mobile Drawer Toggle Button */}
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileOpen(!mobileOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-200 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              🎧 Listener Space
            </span>
            <span className="text-slate-500 hidden sm:inline">/</span>
            <span className="text-xs text-slate-400 hidden sm:inline capitalize truncate">
              {location.pathname.replace('/user-dashboard', '').replace('/', '') || 'Overview'}
            </span>
          </div>

          {/* Right Header: Quick Search + User Profile Dropdown */}
          <div className="flex items-center gap-4">
            {/* Audio quality badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>320 kbps Stereo</span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-500/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-white leading-none">{user?.name || 'Listener'}</p>
                  <p className="text-[11px] text-slate-400 leading-none mt-1 truncate max-w-[140px]">
                    {user?.email || 'user@mycastnow.com'}
                  </p>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0a141b] border border-white/[0.1] shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2.5 border-b border-white/[0.08] mb-1">
                    <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                      Listener Member
                    </span>
                  </div>

                  <Link
                    to="/user-dashboard/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </Link>

                  <Link
                    to="/user-dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Streaming Quality
                  </Link>

                  <Link
                    to="/user-dashboard/help"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Help & FAQs
                  </Link>

                  <div className="border-t border-white/[0.08] my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#070e13]">
          <Routes>
            <Route index element={<UserOverview />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="help" element={<UserHelp />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
