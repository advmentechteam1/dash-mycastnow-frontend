import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreatorAuth } from '../../context/CreatorAuthContext';

const CreatorLogin = () => {
  const [tab, setTab] = useState('login'); // 'login' or 'register'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [channelName, setChannelName] = useState('');
  const [genre, setGenre] = useState('Podcast & Talk Show');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginCreator, registerCreator, isCreatorAuthenticated } = useCreatorAuth();
  const navigate = useNavigate();

  if (isCreatorAuthenticated) {
    navigate('/creator-dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await loginCreator(email, password);
      } else {
        await registerCreator({ name, email, password, channelName, genre });
      }
      navigate('/creator-dashboard');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to authenticate creator account. Please verify details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Glows (Rose & Amber) */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-rose-700/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(244,63,94,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.8) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md mx-4 z-10">
        {/* Branding Header */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="MyCastNow" className="h-16 mx-auto object-contain drop-shadow-2xl mb-1" />
          <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Creator Studio Portal
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-7 sm:p-8 shadow-2xl">
          {/* Tab Switcher */}
          <div className="flex bg-black/40 border border-white/[0.06] rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Creator Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Join as Creator
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Creator / Host Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. RJ Aryan Sharma"
                    required
                    className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Channel Title</label>
                    <input
                      type="text"
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="My Podcast Show"
                      className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Genre</label>
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-2 py-2.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="Podcast & Talk Show" className="bg-[#0b101c]">Podcast & Talk</option>
                      <option value="Music & DJ Sets" className="bg-[#0b101c]">Music & DJ</option>
                      <option value="Tech & Cloud" className="bg-[#0b101c]">Tech & Cloud</option>
                      <option value="Comedy & Culture" className="bg-[#0b101c]">Comedy</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Creator Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@mycastnow.com"
                required
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl pl-3.5 pr-11 py-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 disabled:opacity-50 mt-2 text-xs"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{tab === 'login' ? 'Sign In to Creator Studio' : 'Create My Creator Studio'}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Info */}
          {tab === 'login' && (
            <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] text-slate-400 text-center">
              🎙️ Demo Creator: <strong className="text-slate-300">creator@mycastnow.com</strong> · <strong className="text-slate-300">Creator@123</strong>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/[0.06] pt-3">
            <Link to="/login" className="hover:text-violet-400 transition-colors">
              ← Super Admin
            </Link>
            <Link to="/admin/login" className="hover:text-cyan-400 transition-colors">
              Admin Portal →
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2024 MyCastNow · Creator Studio & Podcast Syndication
        </p>
      </div>
    </div>
  );
};

export default CreatorLogin;
