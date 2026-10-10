import { useEffect, useRef, useState } from 'react';

/** Observe element visibility — used to pause off-screen 3D canvases on mobile. */
export function useInView<T extends HTMLElement>(threshold = 0.05) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? true), {
      threshold,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}
