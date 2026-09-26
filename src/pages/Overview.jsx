import { useAuth } from '../context/AuthContext';

const statCards = [
  {
    id: 'total-podcasts',
    label: 'Total Podcasts',
    value: '1,248',
    change: '+12%',
    up: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    color: 'violet',
    gradient: 'from-violet-500/20 to-violet-600/5',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/20',
    iconText: 'text-violet-400',
    badge: 'text-emerald-400 bg-emerald-400/10',
  },
  {
    id: 'total-episodes',
    label: 'Total Episodes',
    value: '18,392',
    change: '+8%',
    up: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'indigo',
    gradient: 'from-indigo-500/20 to-indigo-600/5',
    border: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/20',
    iconText: 'text-indigo-400',
    badge: 'text-emerald-400 bg-emerald-400/10',
  },
  {
    id: 'active-admins',
    label: 'Active Admins',
    value: '24',
    change: '+3',
    up: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/20',
    iconText: 'text-cyan-400',
    badge: 'text-emerald-400 bg-emerald-400/10',
  },
  {
    id: 'total-listeners',
    label: 'Total Listeners',
    value: '4.2M',
    change: '-2%',
    up: false,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'pink',
    gradient: 'from-pink-500/20 to-pink-600/5',
    border: 'border-pink-500/20',
    iconBg: 'bg-pink-500/20',
    iconText: 'text-pink-400',
    badge: 'text-red-400 bg-red-400/10',
  },
];

const recentActivity = [
  { id: 1, action: 'New podcast created', by: 'TechTalks Studio', time: '2 min ago', dot: 'bg-violet-400' },
  { id: 2, action: 'Admin account activated', by: 'admin@example.com', time: '15 min ago', dot: 'bg-emerald-400' },
  { id: 3, action: '500 new listeners joined', by: 'PodCast World', time: '1 hr ago', dot: 'bg-cyan-400' },
  { id: 4, action: 'Episode reported', by: 'Crime Stories #48', time: '3 hrs ago', dot: 'bg-orange-400' },
  { id: 5, action: 'Subscription plan updated', by: 'StartupPod India', time: '5 hrs ago', dot: 'bg-indigo-400' },
];

const topPodcasts = [
  { id: 1, name: 'TechTalks India', episodes: 248, listeners: '124K', growth: '+18%' },
  { id: 2, name: 'Crime Stories Hindi', episodes: 89, listeners: '98K', growth: '+12%' },
  { id: 3, name: 'Startup Unplugged', episodes: 156, listeners: '76K', growth: '+9%' },
  { id: 4, name: 'Daily News Wrap', episodes: 512, listeners: '65K', growth: '+5%' },
];

const Overview = () => {
  const { superAdmin } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600/30 via-indigo-600/20 to-purple-600/10 border border-violet-500/20 p-5 sm:p-6">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-4 top-4 opacity-10 pointer-events-none">
          <svg className="w-32 h-32 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div className="relative">
          <p className="text-violet-300 text-sm font-medium">{getGreeting()},</p>
          <h1 className="text-white text-xl sm:text-2xl font-bold mt-1">{superAdmin?.name || 'Super Admin'} 👋</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md">
            Welcome to MyCastNow Super Admin Dashboard. Here's what's happening today.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-medium">System Online</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
              <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-slate-300 text-xs">
                {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.id}
            id={card.id}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.border} p-5 hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconText}`}>
                {card.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${card.badge}`}>
                {card.up ? '↑' : '↓'} {card.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-slate-400 text-sm mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Recent Activity</h2>
              <p className="text-slate-500 text-xs mt-0.5">Latest events across the platform</p>
            </div>
            <button className="text-violet-400 text-xs hover:text-violet-300 transition-colors font-medium">View all →</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 group">
                <div className="mt-1.5 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-sm">{item.action}</p>
                  <p className="text-slate-600 text-xs mt-0.5 truncate">{item.by}</p>
                </div>
                <span className="text-slate-600 text-xs shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Podcasts */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Top Podcasts</h2>
              <p className="text-slate-500 text-xs mt-0.5">By listener count</p>
            </div>
          </div>
          <div className="space-y-3">
            {topPodcasts.map((podcast, idx) => (
              <div key={podcast.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                <span className="text-slate-600 text-xs font-bold w-4 shrink-0">#{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium truncate">{podcast.name}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{podcast.episodes} eps · {podcast.listeners}</p>
                </div>
                <span className="text-emerald-400 text-xs font-semibold shrink-0">{podcast.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Add Admin', icon: '👤', color: 'hover:border-violet-500/40 hover:bg-violet-500/10' },
            { label: 'View Reports', icon: '📊', color: 'hover:border-indigo-500/40 hover:bg-indigo-500/10' },
            { label: 'Manage Podcasts', icon: '🎙️', color: 'hover:border-cyan-500/40 hover:bg-cyan-500/10' },
            { label: 'Send Announcement', icon: '📢', color: 'hover:border-pink-500/40 hover:bg-pink-500/10' },
            { label: 'View Logs', icon: '📋', color: 'hover:border-orange-500/40 hover:bg-orange-500/10' },
          ].map((action) => (
            <button
              key={action.label}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-slate-300 text-sm hover:text-white transition-all duration-200 ${action.color}`}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
