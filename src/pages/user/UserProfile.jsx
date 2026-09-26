import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserAuth } from '../../context/UserAuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://dash-mycastnow-backend.onrender.com/api';

const AVAILABLE_GENRES = [
  'Podcasts',
  'EDM & House',
  'Acoustic & Indie',
  'Tech Talk',
  'True Crime & Mystery',
  'Classical & Ambient',
  'Rock & Alternative',
  'Business & Startup',
  'Self Improvement',
  'Comedy & Satire',
];

const UserProfile = () => {
  const { userToken, updateUserState } = useUserAuth();

  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });
  const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

  // Profile fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredLanguage: '',
    favoriteGenres: [],
  });

  // Password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/user/profile`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const u = res.data.user;
        setFormData({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          preferredLanguage: u.preferredLanguage || 'English & Hindi',
          favoriteGenres: u.favoriteGenres || [],
        });
      } catch (err) {
        console.error('Fetch profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userToken) fetchProfile();
  }, [userToken]);

  const toggleGenre = (genre) => {
    setFormData((prev) => {
      const exists = prev.favoriteGenres.includes(genre);
      return {
        ...prev,
        favoriteGenres: exists
          ? prev.favoriteGenres.filter((g) => g !== genre)
          : [...prev.favoriteGenres, genre],
      };
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ text: '', type: '' });

    try {
      const res = await axios.put(`${API_BASE}/user/profile`, formData, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      updateUserState(res.data.user);
      setProfileMsg({ text: 'Profile details saved successfully ✨', type: 'success' });
      setTimeout(() => setProfileMsg({ text: '', type: '' }), 4000);
    } catch (err) {
      setProfileMsg({
        text: err?.response?.data?.message || 'Failed to save profile.',
        type: 'error',
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', type: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ text: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await axios.put(
        `${API_BASE}/user/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      setPasswordMsg({ text: res.data.message || 'Password updated successfully 🔒', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMsg({ text: '', type: '' }), 4000);
    } catch (err) {
      setPasswordMsg({
        text: err?.response?.data?.message || 'Failed to change password.',
        type: 'error',
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading your profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Listener Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your identity, audio preferences, and security settings</p>
      </div>

      {/* Top Identity Card */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/20">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{formData.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                Listener Pro
              </span>
            </div>
            <p className="text-sm text-slate-400">{formData.email}</p>
            <p className="text-xs text-slate-500 mt-0.5">Stream Quality: High Fidelity (320kbps)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 block">Favorite Genres</span>
            <span className="text-sm font-semibold text-emerald-400">{formData.favoriteGenres.length} Selected</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Personal Information</h3>
              <p className="text-xs text-slate-400">Update your public display name and audio languages</p>
            </div>
            <span className="text-xs text-slate-500">Auto-saved to cloud</span>
          </div>

          {profileMsg.text && (
            <div
              className={`p-3.5 rounded-xl border text-sm flex items-center gap-2.5 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/20 text-red-300'
              }`}
            >
              <span>{profileMsg.type === 'success' ? '✓' : '⚠'}</span>
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Email address cannot be changed</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Preferred Languages</label>
                <input
                  type="text"
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  placeholder="e.g. English, Hindi, Spanish"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>

            {/* Favorite Genres Selector */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Favorite Categories & Genres (Click to toggle)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_GENRES.map((genre) => {
                  const selected = formData.favoriteGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selected
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-60"
              >
                {profileSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card (1 col) */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6 space-y-5">
          <div className="border-b border-white/[0.06] pb-4">
            <h3 className="text-base font-semibold text-white">Security & Password</h3>
            <p className="text-xs text-slate-400">Keep your listener credentials safe</p>
          </div>

          {passwordMsg.text && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/20 text-red-300'
              }`}
            >
              <span>{passwordMsg.type === 'success' ? '✓' : '⚠'}</span>
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Min 6 characters"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="w-full mt-2 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white text-sm font-semibold transition-all disabled:opacity-60"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
