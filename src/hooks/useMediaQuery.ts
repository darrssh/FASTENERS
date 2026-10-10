import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const m = window.matchMedia(query);
    const fn = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(m.matches);
    // Safari <14 / old WebViews only implement addListener.
    if (typeof m.addEventListener === 'function') m.addEventListener('change', fn);
    else m.addListener(fn);
    return () => {
      if (typeof m.removeEventListener === 'function') m.removeEventListener('change', fn);
      else m.removeListener(fn);
    };
  }, [query]);
  return matches;
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
