import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Shared animation tokens: one easing language, no random motion (§40). */
export const EASE = 'power3.out';
export const EASE_PREMIUM = 'expo.out';
export const DUR = { fast: 0.35, base: 0.7, slow: 1.2 };

export function refreshScrollTriggers() {
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

/** Parallax helper: move target at different speed while section scrolls. */
export function parallaxY(target: string | Element, trigger: Element, amount = -60) {
  return gsap.fromTo(
    target,
    { y: -amount },
    {
      y: amount,
      ease: 'none',
      scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 1 },
    },
  );
}

/** Clip-path image reveal: cinematic wipe on enter. */
export function clipReveal(targets: string, trigger: Element) {
  return gsap.fromTo(
    targets,
    { clipPath: 'inset(0 0 100% 0)', scale: 1.08 },
    {
      clipPath: 'inset(0 0 0% 0)',
      scale: 1,
      duration: 1.1,
      ease: EASE_PREMIUM,
      stagger: 0.1,
      scrollTrigger: { trigger, start: 'top 80%' },
    },
  );
}
