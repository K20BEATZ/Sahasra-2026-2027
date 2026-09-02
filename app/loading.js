export default function Loading() {
  return (
    <main className="min-h-screen bg-[#05060a] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-slate-900/80 border border-slate-800 p-12 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl flex flex-col items-center justify-center space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        
        {/* Loading Text */}
        <p className="text-sm font-semibold text-slate-300 tracking-wider animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </main>
  );
}