'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function LoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ඕනෑම පේජ් එකක් හෝ ටැබ් එකක් වෙනස් වන විට ලෝඩින් පෙන්වයි
    setLoading(true);
    
    // ටික වෙලාවකින් (උදා: තත්පර 0.7 කින්) ලෝඩින් එක අයින් වී අලුත් පේජ් එක පෙන්වයි
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05060a]/95 backdrop-blur-2xl flex flex-col justify-center items-center p-6 transition-all duration-300">
      {/* Background Premium Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800/80 p-10 rounded-3xl shadow-2xl relative z-10 flex flex-col items-center justify-center space-y-6">
        {/* Premium Ring Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-1.5">
          <h3 className="text-xs font-black tracking-[0.25em] uppercase bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
            Sahasra 2026
          </h3>
          <p className="text-xs text-slate-400 font-medium tracking-wide animate-pulse">
            Switching page, please wait...
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
