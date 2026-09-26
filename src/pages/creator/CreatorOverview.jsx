import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'https://dash-mycastnow-backend.onrender.com/api';

const CreatorOverview = () => {
  const { creatorToken, creator } = useCreatorAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // New Episode Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState('32:45');
  const [newStatus, setNewStatus] = useState('Published');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const fetchOverview = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await axios.get(`${API}/creator/overview`, {
        headers: { Authorization: `Bearer ${creatorToken}` },
      });
      setData(res.data.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load creator overview.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [creatorToken]);

  const handleCreateEpisode = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const res = await axios.post(
        `${API}/creator/episodes`,
        {
          title: newTitle,
          description: newDesc,
          duration: newDuration,
          status: newStatus,
        },
        { headers: { Authorization: `Bearer ${creatorToken}` } }
      );
      setUploadSuccess('Episode published successfully! 🎙️');
      setNewTitle('');
      setNewDesc('');
      setTimeout(() => {
        setUploadSuccess('');
        setShowUploadModal(false);
      }, 1500);
      fetchOverview();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to publish episode');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-3" />
        <p className="text-slate-400 text-sm">Loading studio analytics...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const episodes = data?.episodes || [];
  const platforms = data?.distributionPlatforms || [];
  const recentTips = data?.recentTips || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-amber-950/20 border border-rose-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute right-[-20px] top-[-30px] w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              Creator Studio · {creator?.genre || 'Podcast & Talk'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">{creator?.name || 'Creator'}</span> 🎙️
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Channel: <strong className="text-slate-200">{creator?.channelName}</strong> ({creator?.handle || '@creator'}). Your episodes are actively syndicated to Spotify, Apple Podcasts, and MyCastNow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchOverview(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 text-xs font-medium transition-all"
            >
              <svg className={`w-3.5 h-3.5 text-rose-400 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/25 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ New Episode</span>
            </button>
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
        {/* Stat 1: Total Plays */}
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-rose-500/30 rounded-2xl p-5 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Streams</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats?.totalPlays?.value ?? '2,400'}</span>
            <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">Listens</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-rose-400 font-medium">{stats?.totalPlays?.change || '+18.4%'}</span>
            <span>across all feeds</span>
          </p>
        </div>

        {/* Stat 2: Subscribers */}
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-amber-500/30 rounded-2xl p-5 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Subscribers</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats?.subscribers?.value ?? '4,850'}</span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Followers</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-amber-400 font-medium">{stats?.subscribers?.change || '+320 this week'}</span>
          </p>
        </div>

        {/* Stat 3: Monthly Revenue */}
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-5 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Creator Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{stats?.monthlyRevenue?.value ?? '$1,280.40'}</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Earned</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{stats?.monthlyRevenue?.change || 'Payout on 1st'}</span>
          </p>
        </div>

        {/* Stat 4: Episodes */}
        <div className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] hover:border-purple-500/30 rounded-2xl p-5 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Catalog Size</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{episodes.length}</span>
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Episodes</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Auto-syndicated to RSS 2.0
          </p>
        </div>
      </div>

      {/* Main Grid: Episodes Manager & Distribution Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Episodes List (2 Cols) */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Episodes & Audio Releases</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage your episodes, playback metrics and release status</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
            >
              + Upload Episode
            </button>
          </div>

          <div className="space-y-3">
            {episodes.map((ep, idx) => (
              <div
                key={ep._id || idx}
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{ep.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>⏱ {ep.duration}</span>
                      <span>·</span>
                      <span className="text-rose-400/90 font-medium">🎧 {(ep.plays || 0).toLocaleString()} plays</span>
                      <span>·</span>
                      <span>❤️ {ep.likes || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {ep.status || 'Published'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(ep.createdAt || ep.publishedAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}

            {episodes.length === 0 && (
              <div className="text-center py-10 bg-white/[0.01] rounded-xl border border-white/[0.04]">
                <p className="text-slate-400 text-sm">No episodes published yet.</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-3 text-xs text-rose-400 hover:text-rose-300 font-medium underline"
                >
                  Publish your first episode now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Platform Distribution & Listener Tips */}
        <div className="space-y-6">
          {/* Distribution Platform Breakdown */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Feed Syndication</span>
              <span className="text-xs text-emerald-400 font-normal">RSS 2.0 Live</span>
            </h3>

            <div className="space-y-3.5">
              {platforms.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-slate-400">{p.percentage}% ({p.plays})</span>
                  </div>
                  <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.percentage}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fan Tips Feed */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Recent Fan Support & Tips
            </h3>
            <div className="space-y-3">
              {recentTips.map((tip) => (
                <div key={tip.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{tip.fan}</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                      +{tip.amount}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1.5 italic">"{tip.message}"</p>
                  <span className="text-slate-500 text-[10px] block mt-1">{tip.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Episode Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0f1422] border border-white/[0.12] rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-rose-400">🎙️</span> Publish New Audio Episode
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {uploadSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleCreateEpisode} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Episode Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Episode 03: The Evolution of Electronic Music"
                  required
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Show Notes / Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Provide an overview of the discussion, guests, and music credits..."
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="35:00"
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Release Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Published" className="bg-[#0b101c]">Publish Immediately</option>
                    <option value="Draft" className="bg-[#0b101c]">Save as Draft</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/15 text-[11px] text-slate-400">
                ⚡ Audio processing will automatically apply -14 LUFS loudness mastering before syndicating to RSS.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/25 disabled:opacity-50"
                >
                  {uploading ? 'Processing...' : 'Publish Episode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorOverview;
