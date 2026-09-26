import { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useCreatorAuth } from '../../context/CreatorAuthContext';
import CreatorOverview from './CreatorOverview';
import CreatorProfile from './CreatorProfile';
import CreatorSettings from './CreatorSettings';
import CreatorHelp from './CreatorHelp';

const TOP_NAV_ITEMS = [
  {
    name: 'Overview',
    path: '/creator-dashboard',
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
    path: '/creator-dashboard/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    name: 'Setting',
    path: '/creator-dashboard/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    name: 'Help',
    path: '/creator-dashboard/help',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const CreatorDashboard = () => {
  const { creator, logoutCreator } = useCreatorAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

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
    logoutCreator();
    navigate('/creator/login');
  };

  const isActiveRoute = (item) => {
    if (item.exact) {
      return location.pathname === '/creator-dashboard' || location.pathname === '/creator-dashboard/';
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex h-screen bg-[#070913] overflow-hidden text-slate-100 font-sans selection:bg-rose-500/20 selection:text-rose-300">
      {/* ── LEFT SIDEBAR (Sticky, not scrollable) ── */}
      <aside
        className={`flex flex-col justify-between shrink-0 bg-[#070912]/95 backdrop-blur-xl border-r border-white/[0.07] transition-all duration-300 relative z-30 ${
          collapsed ? 'w-[68px]' : 'w-64'
        }`}
      >
        {/* Top: Logo area */}
        <div>
          <div
            className={`flex items-center border-b border-white/[0.06] h-16 shrink-0 transition-all duration-300 ${
              collapsed ? 'px-3.5 justify-center' : 'px-4 gap-2.5'
            }`}
          >
            {collapsed ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/60 border border-white/[0.08] flex items-center justify-center shrink-0 shadow-md" title="MyCastNow - Creator Studio">
                <img src="/logo.png" alt="MyCastNow" className="w-10 h-10 object-cover object-left" />
              </div>
            ) : (
              <div className="flex flex-col min-w-0">
                <img src="/logo.png" alt="MyCastNow" className="h-8 max-w-[170px] object-contain object-left" />
                <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                  Creator Studio
                </span>
              </div>
            )}
          </div>

          {/* Top Navigation Links (Overview) */}
          <div className="p-2.5 space-y-1.5">
            {!collapsed && (
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-2 block">
                Creator Hub
              </span>
            )}
            {TOP_NAV_ITEMS.map((item) => {
              const active = isActiveRoute(item);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    collapsed ? 'justify-center w-11 h-11 mx-auto' : 'gap-3.5 px-3 py-2.5'
                  } ${
                    active
                      ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/10 text-rose-300 border border-rose-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={`${active ? 'text-rose-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.name}</span>}
                  {active && !collapsed && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-rose-400" />
                  )}
                  {active && collapsed && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Section (Profile, Setting, Help) ── */}
        <div className="border-t border-white/[0.06] bg-black/20">
          <div className="p-2.5 space-y-1.5">
            {!collapsed && (
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 py-1.5 block">
                Account & Channels
              </span>
            )}
            {BOTTOM_NAV_ITEMS.map((item) => {
              const active = isActiveRoute(item);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    collapsed ? 'justify-center w-11 h-11 mx-auto' : 'gap-3.5 px-3 py-2.5'
                  } ${
                    active
                      ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/10 text-rose-300 border border-rose-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={`${active ? 'text-rose-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.name}</span>}
                  {active && !collapsed && (
                    <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-rose-400" />
                  )}
                  {active && collapsed && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3.5 px-4 border-t border-white/[0.06]">
            {!collapsed ? (
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Studio Pro v2.4</span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  Monetized
                </span>
              </div>
            ) : (
              <div className="flex justify-center">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── RIGHT MAIN CONTAINER (Scrollable) ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-[#070912]/80 backdrop-blur-xl border-b border-white/[0.07] px-4 sm:px-6 flex items-center justify-between shrink-0 relative z-20">
          <div className="flex items-center gap-3.5">
            {/* Sidebar Collapse Toggle Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all duration-200 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              🎙️ Creator Studio
            </span>
            <span className="text-slate-500 hidden sm:inline">/</span>
            <span className="text-xs text-slate-400 hidden sm:inline capitalize">
              {location.pathname.replace('/creator-dashboard', '').replace('/', '') || 'Overview'}
            </span>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4">
            {/* Direct quick link to Help */}
            <Link
              to="/creator-dashboard/help"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors relative"
              title="Creator Help Desk"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>

            {/* Email + Avatar Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                id="creator-user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all duration-150"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {creator?.name ? creator.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="text-left hidden sm:block max-w-[180px]">
                  <span className="text-xs font-semibold text-white block leading-none truncate">
                    {creator?.name || 'Creator'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                    {creator?.email || 'creator@mycastnow.com'}
                  </span>
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0f1422] border border-white/[0.1] rounded-2xl shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-2xl">
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                    <p className="text-xs font-semibold text-white truncate">{creator?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{creator?.email}</p>
                    <span className="mt-1 inline-block text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                      Podcast Creator
                    </span>
                  </div>

                  <Link
                    to="/creator-dashboard/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Channel Profile
                  </Link>

                  <Link
                    to="/creator-dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Studio Settings
                  </Link>

                  <div className="border-t border-white/[0.06] my-1" />

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

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<CreatorOverview />} />
            <Route path="overview" element={<CreatorOverview />} />
            <Route path="profile" element={<CreatorProfile />} />
            <Route path="settings" element={<CreatorSettings />} />
            <Route path="help" element={<CreatorHelp />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default CreatorDashboard;
