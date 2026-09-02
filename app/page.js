'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05060a] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
        <div>
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
            Inter-University Competition
          </span>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-b from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent tracking-tighter mt-6">
            SAHASRA <span className="text-slate-100 font-light">CHAMPIONSHIP</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-4 max-w-xl mx-auto">
            Welcome to the official portal. View the live leaderboard, register your team, or access the management portal.
          </p>
        </div>

        {/* Navigation Cards (Leaderboard & Register) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
          <Link
            href="/leaderboard"
            className="group bg-slate-900/80 hover:bg-amber-500 border border-slate-800 hover:border-amber-400 p-6 rounded-2xl transition-all duration-300 text-center shadow-xl hover:shadow-amber-500/20"
          >
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-slate-950">Leaderboard</h3>
            <p className="text-xs text-slate-400 group-hover:text-slate-900 mt-1">Check live votes & rankings</p>
          </Link>

          <Link
            href="/register"
            className="group bg-slate-900/80 hover:bg-amber-500 border border-slate-800 hover:border-amber-400 p-6 rounded-2xl transition-all duration-300 text-center shadow-xl hover:shadow-amber-500/20"
          >
            <div className="text-3xl mb-2">📝</div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-slate-950">Register Team</h3>
            <p className="text-xs text-slate-400 group-hover:text-slate-900 mt-1">Submit your project details</p>
          </Link>
        </div>

        {/* Admin Panel Link */}
        <div className="pt-8 border-t border-slate-800/60">
          <Link
            href="/admin"
            className="text-xs text-slate-600 hover:text-amber-400 transition-colors uppercase tracking-widest font-semibold"
          >
            🔒 Admin Panel Login
          </Link>
        </div>
      </div>
    </main>
  );
}