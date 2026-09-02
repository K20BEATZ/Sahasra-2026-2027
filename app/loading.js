'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function LoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Page එක වෙනස් වන විට ලෝඩින් පෙන්වයි
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // අවශ්‍ය නම් කාලය වෙනස් කරගත හැක (උදා: තත්පර 0.8ක් හෝ 1ක්)

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05060a]/90 backdrop-blur-xl flex flex-col justify-center items-center p-6 transition-all duration-300">
      {/* Background Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 p-10 rounded-3xl shadow-2xl relative z-10 flex flex-col items-center justify-center space-y-5">
        {/* Premium Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            Sahasra 2026
          </h3>
          <p className="text-xs text-slate-400 font-medium animate-pulse">
            Loading your experience...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PageLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderContent />
    </Suspense>
  );
}
}
