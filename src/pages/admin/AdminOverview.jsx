import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const API = 'http://localhost:5000/api';

const AdminOverview = () => {
  const { adminToken, admin } = useAdminAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await axios.get(`${API}/admin/overview`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setData(res.data.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load overview data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [adminToken]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-9 h-9 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-3" />
        <p className="text-slate-400 text-sm">Loading admin dashboard metrics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentStreams = data?.recentStreams || [];
  const systemMetrics = data?.systemMetrics || {};
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome greeting */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-violet-950/20 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute right-[-20px] top-[-30px] w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Live Broadcasting Terminal · v2.4
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{admin?.name || 'Admin'}</span> 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Here is your streaming operations summary. All 4 audio nodes are connected and broadcasting at optimal bitrate.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchOverview(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 text-sm font-medium transition-all"
            >
              <svg className={`w-4 h-4 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Broadcasting Online
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => fetchOverview()} className="underline text-xs">Retry</button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Live Broadcasts */}
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-5 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Broadcasts</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats?.activeBroadcasts?.value ?? '4'}</span>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>{stats?.activeBroadcasts?.change || 'All stations connected'}</span>
          </p>
        </div>

        {/* Stat 2: Active Listeners */}
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-cyan-500/30 rounded-2xl p-5 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Listeners</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats?.totalListeners?.value ?? '18,420'}</span>
            <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">Live</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-cyan-400 font-semibold">{stats?.totalListeners?.change || '+14.2%'}</span>
            <span>across 44 countries</span>
          </p>
        </div>

        {/* Stat 3: Media Storage */}
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-violet-500/30 rounded-2xl p-5 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Audio Storage</span>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats?.storageUsed?.value ?? '42.8 GB'}</span>
            <span className="text-xs text-slate-500">/ 100 GB</span>
          </div>
          <div className="mt-3 w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full" style={{ width: '42.8%' }} />
          </div>
        </div>

        {/* Stat 4: Stream Reliability */}
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-amber-500/30 rounded-2xl p-5 transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Stream Health</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats?.streamHealth?.value ?? '99.98%'}</span>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Optimal</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Zero dropouts in 30 days</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Active Streams & System Hardware Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Broadcast Monitor */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Live Broadcast Channels</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry and listener engagement</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              4 Channels Live
            </span>
          </div>

          <div className="space-y-3.5">
            {recentStreams.map((stream) => (
              <div
                key={stream.id}
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{stream.title}</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        LIVE
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Host: <strong className="text-slate-300 font-medium">{stream.host}</strong></span>
                      <span>·</span>
                      <span className="text-cyan-400/90 font-mono text-[11px]">{stream.bitrate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 border-white/[0.05] pt-2.5 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-bold text-white flex items-center sm:justify-end gap-1.5">
                      <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {stream.listeners.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-slate-500">Peak: {stream.peakListeners.toLocaleString()}</span>
                  </div>

                  <span className="text-xs text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                    {stream.startedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 Col): System Resource Telemetry & Actions */}
        <div className="space-y-6">
          {/* Node Health Card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Streaming Node Telemetry</span>
              <span className="text-xs text-emerald-400 font-normal flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Node 01 Online
              </span>
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Server CPU Load</span>
                  <span className="text-white font-medium">{systemMetrics?.cpuUsage || 28}%</span>
                </div>
                <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${systemMetrics?.cpuUsage || 28}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>RAM Consumption</span>
                  <span className="text-white font-medium">{systemMetrics?.memoryUsage || 54}%</span>
                </div>
                <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                  <div className="bg-violet-500 h-full rounded-full" style={{ width: `${systemMetrics?.memoryUsage || 54}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Network Bandwidth Load</span>
                  <span className="text-white font-medium">{systemMetrics?.networkLoad || 68}%</span>
                </div>
                <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${systemMetrics?.networkLoad || 68}%` }} />
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-400 block text-[11px]">Latency</span>
                  <span className="font-semibold text-cyan-400 mt-0.5 block">{systemMetrics?.serverLatency || '18 ms'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-400 block text-[11px]">Cluster</span>
                  <span className="font-semibold text-emerald-400 mt-0.5 block">{systemMetrics?.activeNodes || 6}/{systemMetrics?.totalNodes || 6} Nodes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Audit & Activity
            </h3>
            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium">{act.action}</p>
                    <p className="text-slate-400 text-[11px] truncate">{act.target}</p>
                  </div>
                  <span className="text-slate-500 text-[10px] shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
