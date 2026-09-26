import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'https://dash-mycastnow-backend.onrender.com/api';

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
        checked ? 'bg-cyan-500' : 'bg-slate-700'
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

const AdminSettings = () => {
  const { adminToken } = useAdminAuth();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    desktopAlerts: true,
    weeklyDigest: false,
    twoFactorAuth: false,
    theme: 'dark',
    timezone: 'UTC+05:30 (IST)',
    audioBitrate: '256kbps',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API}/admin/settings`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (res.data?.settings) {
          setSettings((prev) => ({ ...prev, ...res.data.settings }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [adminToken]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      await axios.put(`${API}/admin/settings`, settings, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-3" />
        <p className="text-slate-400 text-sm">Loading admin preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin System Settings</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure broadcasting alerts, operational preferences, and security standards
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-fade-in">
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Notification Preferences */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Broadcast Alerts & Notifications</h2>
              <p className="text-[11px] text-slate-400">Manage how you receive critical streaming event alerts</p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            <SettingToggle
              label="Email Notifications"
              description="Get emails when a stream disconnects or when storage hits 85%"
              checked={settings.emailNotifications}
              onChange={(val) => updateSetting('emailNotifications', val)}
            />
            <SettingToggle
              label="Real-time Desktop Alerts"
              description="Push browser notifications when listeners spike or server restarts"
              checked={settings.desktopAlerts}
              onChange={(val) => updateSetting('desktopAlerts', val)}
            />
            <SettingToggle
              label="Weekly Operations Digest"
              description="Receive weekly analytics on audience reach, peak hours and bitrate performance"
              checked={settings.weeklyDigest}
              onChange={(val) => updateSetting('weeklyDigest', val)}
            />
          </div>
        </div>

        {/* Section 2: Security & Session */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Security & Access Safeguards</h2>
              <p className="text-[11px] text-slate-400">Two-factor protection and session access limits</p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            <SettingToggle
              label="Two-Factor Authentication (2FA)"
              description="Require an authenticator code when logging into this admin portal"
              checked={settings.twoFactorAuth}
              onChange={(val) => updateSetting('twoFactorAuth', val)}
            />

            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-sm font-medium text-white block">Session Auto-Timeout</span>
                <span className="text-xs text-slate-400 block mt-0.5">Automatically log out inactive sessions</span>
              </div>
              <select
                value={settings.sessionTimeout || '7d'}
                onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                className="bg-white/[0.06] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="1h" className="bg-[#0b101c]">1 Hour of Inactivity</option>
                <option value="12h" className="bg-[#0b101c]">12 Hours</option>
                <option value="24h" className="bg-[#0b101c]">24 Hours</option>
                <option value="7d" className="bg-[#0b101c]">7 Days (Recommended)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Streaming & UI Preferences */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Streaming & Interface Preferences</h2>
              <p className="text-[11px] text-slate-400">Localization and audio encoder default presets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Default Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSetting('timezone', e.target.value)}
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="UTC+05:30 (IST)" className="bg-[#0b101c]">UTC+05:30 (India Standard Time - IST)</option>
                <option value="UTC+00:00 (GMT)" className="bg-[#0b101c]">UTC+00:00 (London, GMT)</option>
                <option value="UTC-05:00 (EST)" className="bg-[#0b101c]">UTC-05:00 (New York, EST)</option>
                <option value="UTC+08:00 (SGT)" className="bg-[#0b101c]">UTC+08:00 (Singapore / Dubai, SGT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Default Audio Bitrate Preset</label>
              <select
                value={settings.audioBitrate || '256kbps'}
                onChange={(e) => updateSetting('audioBitrate', e.target.value)}
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="128kbps" className="bg-[#0b101c]">128 kbps (Standard Voice / Speech)</option>
                <option value="192kbps" className="bg-[#0b101c]">192 kbps (High Fidelity Radio)</option>
                <option value="256kbps" className="bg-[#0b101c]">256 kbps (Lossless Streaming)</option>
                <option value="320kbps" className="bg-[#0b101c]">320 kbps (Studio Master Quality)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Saving preferences...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
