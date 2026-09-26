import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCreatorAuth } from '../../context/CreatorAuthContext';

const API = 'http://localhost:5000/api';

const SettingToggle = ({ label, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-white/[0.06] last:border-0">
    <div className="pr-4">
      <span className="text-sm font-medium text-white block">{label}</span>
      {description && <span className="text-xs text-slate-400 block mt-0.5">{description}</span>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-rose-500' : 'bg-slate-700'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

const CreatorSettings = () => {
  const { creatorToken, creator } = useCreatorAuth();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    newCommentAlerts: true,
    weeklyAnalytics: true,
    autoPublishRss: true,
    audioMasteringFilter: 'Loudness Normalization (-14 LUFS)',
    timezone: 'UTC+05:30 (IST)',
  });
  const [monetizationEnabled, setMonetizationEnabled] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedFeed, setCopiedFeed] = useState(false);
  const [error, setError] = useState('');

  const rssFeedUrl = `https://feeds.mycastnow.com/channel/${creator?.handle?.replace('@', '') || 'channel'}.xml`;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API}/creator/settings`, {
          headers: { Authorization: `Bearer ${creatorToken}` },
        });
        if (res.data?.settings) {
          setSettings((prev) => ({ ...prev, ...res.data.settings }));
        }
        if (res.data?.monetizationEnabled !== undefined) {
          setMonetizationEnabled(res.data.monetizationEnabled);
        }
      } catch (err) {
        console.error('Failed to load creator settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [creatorToken]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      await axios.put(
        `${API}/creator/settings`,
        { settings, monetizationEnabled },
        { headers: { Authorization: `Bearer ${creatorToken}` } }
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyFeed = () => {
    navigator.clipboard.writeText(rssFeedUrl);
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 3000);
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-3" />
        <p className="text-slate-400 text-sm">Loading studio preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Creator Studio Settings</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure RSS feed distribution, monetization sharing, and audio mastering presets
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Preferences Saved!
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* RSS Feed Card */}
      <div className="bg-gradient-to-r from-rose-950/30 to-amber-950/20 border border-rose-500/20 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Public RSS Feed URL</h2>
              <p className="text-[11px] text-slate-400">Submit to Spotify for Podcasters, Apple Podcasts & Google</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Podcasting 2.0 Ready
          </span>
        </div>

        <div className="flex items-center gap-2 bg-black/40 border border-white/[0.08] rounded-xl p-2 mt-3">
          <input
            type="text"
            readOnly
            value={rssFeedUrl}
            className="flex-1 bg-transparent text-slate-300 text-xs px-2 font-mono outline-none"
          />
          <button
            onClick={handleCopyFeed}
            className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all shrink-0"
          >
            {copiedFeed ? '✓ Copied' : 'Copy Feed URL'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Monetization Settings */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Monetization & Payout Preferences</h2>
              <p className="text-[11px] text-slate-400">Manage audio ad insertion and direct listener tipping</p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            <SettingToggle
              label="Enable Channel Monetization"
              description="Allow programmatic dynamic audio ads and subscriber tips to generate monthly revenue"
              checked={monetizationEnabled}
              onChange={(val) => setMonetizationEnabled(val)}
            />
            <SettingToggle
              label="Auto-Publish to RSS Syndication"
              description="Immediately notify Apple Podcasts and Spotify directory bots when an episode is released"
              checked={settings.autoPublishRss}
              onChange={(val) => updateSetting('autoPublishRss', val)}
            />
          </div>
        </div>

        {/* Section 2: Audio Mastering */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Automated Audio Mastering</h2>
              <p className="text-[11px] text-slate-400">DSP audio processing applied during episode encoding</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Loudness Target Preset</label>
              <select
                value={settings.audioMasteringFilter}
                onChange={(e) => updateSetting('audioMasteringFilter', e.target.value)}
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="Loudness Normalization (-14 LUFS)" className="bg-[#0b101c]">-14 LUFS (Spotify / Apple Podcast Standard)</option>
                <option value="Vocal Clarity & De-Esser Boost" className="bg-[#0b101c]">Vocal Clarity & De-Esser (Best for Talk Shows)</option>
                <option value="Music Dynamic Master (-16 LUFS)" className="bg-[#0b101c]">-16 LUFS (Music / High Dynamic Range)</option>
                <option value="Transparent Neutral Bypass" className="bg-[#0b101c]">Bypass (No Normalization Applied)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Creator Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="UTC+05:30 (IST)" className="bg-[#0b101c]">UTC+05:30 (IST - India)</option>
                <option value="UTC+00:00 (GMT)" className="bg-[#0b101c]">UTC+00:00 (London, GMT)</option>
                <option value="UTC-05:00 (EST)" className="bg-[#0b101c]">UTC-05:00 (New York, EST)</option>
                <option value="UTC+08:00 (SGT)" className="bg-[#0b101c]">UTC+08:00 (Singapore, SGT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Alerts */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Listener Alerts & Analytics Digest</h2>
              <p className="text-[11px] text-slate-400">Choose when you want email notifications</p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            <SettingToggle
              label="New Listener Comments & Fan Reviews"
              description="Receive instant alerts when a listener leaves feedback on your episode"
              checked={settings.newCommentAlerts}
              onChange={(val) => updateSetting('newCommentAlerts', val)}
            />
            <SettingToggle
              label="Weekly Audience Performance Digest"
              description="Receive weekly summaries of top streamed episodes and geographic reach"
              checked={settings.weeklyAnalytics}
              onChange={(val) => updateSetting('weeklyAnalytics', val)}
            />
            <SettingToggle
              label="System & Monetization Payout Notices"
              description="Get emails when monthly earnings are transferred to your account"
              checked={settings.emailNotifications}
              onChange={(val) => updateSetting('emailNotifications', val)}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50"
          >
            {saving ? 'Saving preferences...' : 'Save Studio Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatorSettings;
