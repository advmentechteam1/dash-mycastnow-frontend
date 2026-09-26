import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserAuth } from '../../context/UserAuthContext';

const API_BASE = 'http://localhost:5000/api';

const UserSettings = () => {
  const { userToken } = useUserAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const [settings, setSettings] = useState({
    streamingQuality: 'High Fidelity (320 kbps)',
    autoplayNext: true,
    downloadOverWifiOnly: true,
    creatorNewEpisodeAlerts: true,
    weeklyRecommendations: true,
    emailNotifications: false,
    privateListeningSession: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user/settings`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error('Fetch settings error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userToken) fetchSettings();
  }, [userToken]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg(false);
    try {
      await axios.put(`${API_BASE}/user/settings`, settings, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3500);
    } catch (err) {
      console.error('Save settings error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading playback settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audio & Account Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure your audio bitrates, playback behaviors, and alert rules</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shrink-0"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2.5 animate-fadeIn">
          <span>✓</span>
          <span>Your playback and notification settings were updated successfully!</span>
        </div>
      )}

      {/* 1. Audio Streaming Quality */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">Audio Streaming Bitrate</h3>
          <p className="text-xs text-slate-400">Select audio resolution for your podcast and music streams</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            {
              title: 'High Fidelity (320 kbps)',
              desc: 'Lossless clarity, best for headphones and Hi-Fi speakers.',
              badge: 'Pro Quality',
            },
            {
              title: 'Balanced (192 kbps)',
              desc: 'Optimal balance of fast load time and clear acoustic stereo.',
              badge: 'Standard',
            },
            {
              title: 'Data Saver (128 kbps)',
              desc: 'Minimal mobile data usage, fast buffering in low-signal areas.',
              badge: 'Saver',
            },
          ].map((option) => {
            const isSelected = settings.streamingQuality === option.title;
            return (
              <div
                key={option.title}
                onClick={() => setSettings({ ...settings, streamingQuality: option.title })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-white/[0.05] text-slate-400'
                    }`}
                  >
                    {option.badge}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-emerald-400 bg-emerald-500' : 'border-slate-500'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{option.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{option.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Playback Behaviors */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-white">Playback & Offline Caching</h3>
          <p className="text-xs text-slate-400">Control queue progression and offline downloads</p>
        </div>

        <div className="space-y-4 divide-y divide-white/[0.05]">
          {/* Autoplay Next */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium text-white">Autoplay Next Episode</p>
              <p className="text-xs text-slate-400">Automatically play the next queued podcast or similar show when current finishes</p>
            </div>
            <button
              onClick={() => handleToggle('autoplayNext')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ml-4 ${
                settings.autoplayNext ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.autoplayNext ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Download over Wi-Fi only */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm font-medium text-white">Download Over Wi-Fi Only</p>
              <p className="text-xs text-slate-400">Prevent episode caching while using cellular mobile data plans</p>
            </div>
            <button
              onClick={() => handleToggle('downloadOverWifiOnly')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ml-4 ${
                settings.downloadOverWifiOnly ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.downloadOverWifiOnly ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notifications & Social Privacy */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-5">
        <div>
          <h3 className="text-base font-semibold text-white">Notifications & Privacy</h3>
          <p className="text-xs text-slate-400">Control updates and visibility of your listening activity</p>
        </div>

        <div className="space-y-4 divide-y divide-white/[0.05]">
          {/* Creator New Episode Alerts */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-sm font-medium text-white">New Episode Alerts from Followed Channels</p>
              <p className="text-xs text-slate-400">Get instant notifications when subscribed podcasts release a fresh drop</p>
            </div>
            <button
              onClick={() => handleToggle('creatorNewEpisodeAlerts')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ml-4 ${
                settings.creatorNewEpisodeAlerts ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.creatorNewEpisodeAlerts ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Weekly Recommendations */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-sm font-medium text-white">Weekly Recommendations</p>
              <p className="text-xs text-slate-400">Curated digests of newly trending audio shows matching your genres</p>
            </div>
            <button
              onClick={() => handleToggle('weeklyRecommendations')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ml-4 ${
                settings.weeklyRecommendations ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.weeklyRecommendations ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Private Listening Session */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">Private Listening Session</p>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20">
                  Incognito Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">Hide played episodes from your public history and recommendation algorithm</p>
            </div>
            <button
              onClick={() => handleToggle('privateListeningSession')}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ml-4 ${
                settings.privateListeningSession ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.privateListeningSession ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
