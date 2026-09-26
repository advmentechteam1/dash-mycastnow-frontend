import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

const UserLogin = () => {
  const [tab, setTab] = useState('login'); // 'login' or 'register'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English & Hindi');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser, registerUser, isUserAuthenticated } = useUserAuth();
  const navigate = useNavigate();

  if (isUserAuthenticated) {
    navigate('/user-dashboard');
    return null;
  }

  const fillDemo = () => {
    setTab('login');
    setEmail('user@mycastnow.com');
    setPassword('User@123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await loginUser(email, password);
      } else {
        await registerUser({ name, email, password, phone, preferredLanguage });
      }
      navigate('/user-dashboard');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to authenticate listener account. Please verify credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e13] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Glows (Emerald & Teal) */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-700/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.8) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md mx-4 z-10">
        {/* Branding Header */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="MyCastNow" className="h-16 mx-auto object-contain drop-shadow-2xl mb-1" />
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Listener Space & Audio Lounge</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-2xl">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/[0.04] border border-white/[0.06] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Listener Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(''); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              New Account
            </button>
          </div>

          {/* Quick Demo Fill Pill */}
          {tab === 'login' && (
            <div className="mb-4 flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span className="text-emerald-300 font-medium">Demo: user@mycastnow.com</span>
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] font-semibold text-white bg-emerald-500 hover:bg-emerald-400 px-2 py-1 rounded-md transition-colors"
              >
                Auto Fill
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-300">
              <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pooja Verma"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@mycastnow.com"
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {tab === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Language</label>
                  <input
                    type="text"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    placeholder="English & Hindi"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Connecting to Stream...</span>
                </>
              ) : (
                <span>{tab === 'login' ? 'Enter Listener Space' : 'Create Free Account'}</span>
              )}
            </button>
          </form>

          {/* Quick links to other dashboards */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <span>Switch Portal:</span>
            <div className="flex items-center gap-2">
              <Link to="/login" className="hover:text-slate-300 transition-colors">
                SuperAdmin
              </Link>
              <span>·</span>
              <Link to="/admin/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Admin
              </Link>
              <span>·</span>
              <Link to="/creator/login" className="text-rose-400 hover:text-rose-300 transition-colors">
                Creator
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2024 MyCastNow · Audio & Podcast Lounge
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
