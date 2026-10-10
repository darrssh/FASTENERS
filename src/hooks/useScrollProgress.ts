import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP ScrollTrigger-backed 0..1 progress for a tall wrapper (§10 required tech).
 * Single coordinated timeline source — bolt, nut, washer, camera all read it.
 */
export function useScrollProgress<T extends HTMLElement>(): {
  ref: React.RefObject<T>;
  progress: React.MutableRefObject<number>;
} {
  const ref = useRef<T>(null);
  const progress = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    // Fonts/layout shift can move tall-section edges — re-measure once settled.
    const t = window.setTimeout(refresh, 800);
    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(t);
      st.kill();
    };
  }, []);

  return { ref, progress };
}

/** One-shot reveal-on-enter for section text (GSAP, respects reduced motion). */
export function useReveal<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!enabled || !ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = ref.current;
    const ctx = gsap.context(() => {
      // Text fade-up
      gsap.fromTo(
        '[data-reveal]',
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: root, start: 'top 80%' },
        },
      );
      // Clip image wipe
      gsap.fromTo(
        '[data-reveal-clip]',
        { clipPath: 'inset(8% 4% 8% 4% round 16px)', scale: 1.06, opacity: 0.4 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 16px)',
          scale: 1,
          opacity: 1,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 78%' },
        },
      );
      // Parallax layers — scoped to THIS section only. A document-wide query
      // would attach duplicate scrub triggers (one per section) to every layer.
      root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '-60');
        gsap.fromTo(
          el,
          { y: -speed },
          {
            y: speed,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [enabled]);
  return ref;
}
