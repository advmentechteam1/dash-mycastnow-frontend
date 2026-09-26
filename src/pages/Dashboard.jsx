import { useState, useRef, useEffect } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Overview from './Overview';
import Admins from './Admins';
import ComingSoon from './ComingSoon';

const topNavItems = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/super-admin-dashboard/overview',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'admins',
    label: 'Admins',
    path: '/super-admin-dashboard/admins',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

const bottomNavItems = [
  {
    id: 'settings',
    label: 'Settings',
    path: '/super-admin-dashboard/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/super-admin-dashboard/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 'help',
    label: 'Help',
    path: '/super-admin-dashboard/help',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

/* ── Simple Hamburger (always 3 lines) ── */
const HamburgerIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Dashboard = () => {
  const { superAdmin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'SA';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="h-screen bg-[#060912] flex overflow-hidden">

      {/* ── Sidebar ── */}
      <aside
        className={`h-screen shrink-0 flex flex-col bg-white/[0.03] border-r border-white/[0.06] relative overflow-hidden
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[68px]' : 'w-64'}`}
      >
        {/* Sidebar glow */}
        <div className="absolute top-0 left-0 w-full h-40 bg-violet-600/5 pointer-events-none" />

        {/* Logo area */}
        <div className={`flex items-center border-b border-white/[0.06] shrink-0 overflow-hidden
          transition-all duration-300
          ${collapsed ? 'h-16 px-3 justify-center' : 'h-[78px] px-4'}`}
        >
          {collapsed ? (
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-black/60 border border-white/[0.08] flex items-center justify-center shrink-0 shadow-md p-1" title="MyCastNow - Super Admin">
              <img src="/logo.png" alt="MyCastNow" className="w-full h-full object-cover object-left mix-blend-screen" />
            </div>
          ) : (
            <div className="flex flex-col justify-center min-w-0 w-full py-1">
              <img
                src="/logo.png"
                alt="MyCastNow"
                className="h-11 w-auto max-w-[200px] object-contain object-left mix-blend-screen"
              />
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest leading-none">
                  Super Admin
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-4 flex flex-col">
          {/* Top section: Overview + Admins */}
          <div className="space-y-1">
            <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'h-0 opacity-0 mb-0' : 'h-6 opacity-100 mb-1'}`}>
              <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 whitespace-nowrap">
                Main Menu
              </p>
            </div>
            {topNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                id={`nav-${item.id}`}
                title={collapsed ? item.label : ''}
                className={({ isActive }) =>
                  `flex items-center rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden
                  ${collapsed ? 'justify-center px-0 py-2.5 mx-auto w-11 h-11' : 'gap-3 px-3 py-2.5'}
                  ${isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`shrink-0 transition-colors ${isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {item.icon}
                    </span>
                    <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                      {item.label}
                    </span>
                    {isActive && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom section: Settings, Profile, Help */}
          <div className="space-y-1">
            <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'h-0 opacity-0 mb-0' : 'h-6 opacity-100 mb-1'}`}>
              <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 whitespace-nowrap">
                Account
              </p>
            </div>
            {bottomNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                id={`nav-${item.id}`}
                title={collapsed ? item.label : ''}
                className={({ isActive }) =>
                  `flex items-center rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden
                  ${collapsed ? 'justify-center px-0 py-2.5 mx-auto w-11 h-11' : 'gap-3 px-3 py-2.5'}
                  ${isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`shrink-0 transition-colors ${isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {item.icon}
                    </span>
                    <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                      {item.label}
                    </span>
                    {isActive && !collapsed && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-4">

            {/* Hamburger Toggle */}
            <button
              id="sidebar-toggle-btn"
              onClick={() => setCollapsed((prev) => !prev)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-200"
            >
              <HamburgerIcon />
            </button>

            {/* Page title */}
            <div>
              <Routes>
                <Route path="/overview" element={<span className="text-white font-semibold">Overview</span>} />
                <Route path="/admins"   element={<span className="text-white font-semibold">Admins</span>} />
                <Route path="/settings" element={<span className="text-white font-semibold">Settings</span>} />
                <Route path="/profile"  element={<span className="text-white font-semibold">Profile</span>} />
                <Route path="/help"     element={<span className="text-white font-semibold">Help</span>} />
                <Route path="*"         element={<span className="text-white font-semibold">Dashboard</span>} />
              </Routes>
              <p className="text-slate-500 text-xs mt-0.5">MyCastNow Super Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                id="user-menu-btn"
                onClick={() => setShowUserMenu((p) => !p)}
                className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-white/[0.05] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/20 shrink-0">
                  {getInitials(superAdmin?.name)}
                </div>
                <div className="text-left">
                  <p className="text-white text-xs font-semibold leading-none">{superAdmin?.name || 'Super Admin'}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5 truncate max-w-[140px]">{superAdmin?.email}</p>
                </div>
                <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 z-50 w-52 bg-[#0e1120] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/[0.07]">
                    <p className="text-white text-sm font-semibold">{superAdmin?.name || 'Super Admin'}</p>
                    <p className="text-slate-500 text-xs mt-0.5 truncate">{superAdmin?.email}</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-violet-400" /> Super Admin
                    </span>
                  </div>
                  {/* Logout */}
                  <button
                    id="logout-btn"
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    className="flex items-center gap-2.5 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/overview" element={<Overview />} />
            <Route path="/admins"   element={<Admins />} />
            <Route path="/settings" element={<ComingSoon page="Settings" />} />
            <Route path="/profile"  element={<ComingSoon page="Profile" />} />
            <Route path="/help"     element={<ComingSoon page="Help" />} />
            <Route path="*"         element={<Navigate to="/super-admin-dashboard/overview" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
