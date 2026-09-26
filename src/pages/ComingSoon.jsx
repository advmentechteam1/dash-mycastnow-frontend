const ComingSoon = ({ page }) => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-72px)] p-8">
      <div className="text-center max-w-md">
        {/* Glow */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-2xl" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/30 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h2 className="text-white text-2xl font-bold mb-2">{page}</h2>
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-300 text-sm font-medium">Coming Soon</span>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">
          We're working hard on the <span className="text-slate-300 font-medium">{page}</span> section.
          It will be available in the next update. Stay tuned!
        </p>

        {/* Progress bar */}
        <div className="mt-6 bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full w-[60%]" />
        </div>
        <p className="text-slate-600 text-xs mt-2">60% complete</p>
      </div>
    </div>
  );
};

export default ComingSoon;
