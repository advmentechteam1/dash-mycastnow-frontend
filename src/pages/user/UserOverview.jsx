import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserAuth } from '../../context/UserAuthContext';

const API_BASE = 'http://localhost:5000/api';

const UserOverview = () => {
  const { userToken } = useUserAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user/overview`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to load user overview:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userToken) fetchOverview();
  }, [userToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading your listening lounge...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-7">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-slate-900 border border-emerald-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Listener Pass Active · High-Res Audio (320kbps)
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, {data?.user?.name || 'Listener'} 🎧
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Explore your personalized audio stream, pick up right where you left off, and discover trending podcasts crafted for your taste.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => alert('Resuming: Episode 02: Deep Dive into Audio & Sound Design')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Resume Listening</span>
            </button>
            <button
              onClick={() => alert('All stations and podcasts are synced!')}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 text-sm font-medium transition-all"
            >
              Sync Library
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hours Listened */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">{stats?.hoursListened?.label || 'Total Time'}</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats?.hoursListened?.value || '84 hrs'}</div>
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <span>↑</span> {stats?.hoursListened?.change}
          </p>
        </div>

        {/* Episodes Finished */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">{stats?.episodesCompleted?.label || 'Episodes'}</span>
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats?.episodesCompleted?.value || '46'}</div>
          <p className="text-xs text-teal-400 font-medium">{stats?.episodesCompleted?.change}</p>
        </div>

        {/* Subscribed Channels */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">{stats?.followedCreators?.label || 'Subscribed'}</span>
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats?.followedCreators?.value || '12'}</div>
          <p className="text-xs text-cyan-400 font-medium">{stats?.followedCreators?.change}</p>
        </div>

        {/* Saved Playlists */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">{stats?.savedPlaylists?.label || 'Playlists'}</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats?.savedPlaylists?.value || '5'}</div>
          <p className="text-xs text-indigo-400 font-medium">{stats?.savedPlaylists?.change}</p>
        </div>
      </div>

      {/* Main Grid: Recently Played & Trending Shows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Played (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Continue Listening
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Jump back into your recent episodes and mixes</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Auto-Synced
            </span>
          </div>

          <div className="space-y-3">
            {data?.recentlyPlayed?.map((track) => (
              <div
                key={track.id}
                className="group p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
                    className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${
                      playingId === track.id
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-emerald-500/15 group-hover:bg-emerald-500/25 text-emerald-400'
                    }`}
                  >
                    {playingId === track.id ? (
                      <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {track.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{track.creator}</p>
                    {/* Progress Bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${track.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 font-mono">{track.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
                  <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[11px] font-medium text-slate-300">
                    {track.category}
                  </span>
                  <span className="font-mono text-slate-300">{track.duration}</span>
                  <span className="text-[11px] text-slate-500">{track.playedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Shows & Quick Recommendations (1 col) */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                Trending Shows
              </h2>
              <span className="text-xs text-slate-400">Live Ranking</span>
            </div>

            <div className="space-y-3">
              {data?.trendingShows?.map((show) => (
                <div
                  key={show.id}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-teal-500/30 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        {show.badge}
                      </span>
                      <span className="text-[11px] text-slate-400">{show.genre}</span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{show.title}</p>
                    <p className="text-xs text-slate-400 truncate">{show.creator} · {show.subscribers}</p>
                  </div>

                  <button
                    onClick={() => alert(`Subscribed to ${show.title}!`)}
                    className="shrink-0 p-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 hover:text-teal-300 transition-colors"
                    title="Subscribe"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick genres pill list */}
          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-xs font-semibold text-slate-400 mb-2">Favorite Genres</p>
            <div className="flex flex-wrap gap-1.5">
              {data?.user?.favoriteGenres?.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
