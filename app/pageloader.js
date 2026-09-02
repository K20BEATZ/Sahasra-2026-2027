'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function LoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // Page එක මාරු වී අවසන් වූ විට ලෝඩින් එක ඉවත් වේ
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // වෙබ් අඩවියේ ඕනෑම ලින්ක් එකක් ක්ලික් කළ වහාම ලෝඩර් එක පෙන්වයි
    const handleGlobalClick = (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        const targetUrl = new URL(link.href, window.location.origin);
        // එකම පේජ් එකේ # hash ලින්ක් හෝ වෙනත් ඩොමේන් වලට නොවන, වෙනත් internal page එකකට යන විට පමණක්
        if (
          targetUrl.origin === window.location.origin &&
          targetUrl.pathname !== window.location.pathname &&
          !link.getAttribute('target')
        ) {
          setLoading(true);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-[#05060a]/95 backdrop-blur-2xl flex flex-col justify-center items-center p-6 transition-all duration-300">
      {/* Background Glow Effects */}
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
            Switching experience...
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
