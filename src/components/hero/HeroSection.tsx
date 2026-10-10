import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { products } from '../../data/products';
import { HeroScene } from './HeroScene';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { webglAvailable } from '../../lib/utils';

/**
 * Cinematic hero (§6): 4-phase opening — dark reveal → product reveal →
 * staggered headline → stable idle. Never blocks scrolling; short by design.
 *
 * True editorial split: content owns the LEFT column, the 3D product owns
 * the RIGHT zone in normal document flow — the two can never overlap at any
 * viewport width. Full-bleed studio backdrop keeps the cinematic feel.
 */
export function HeroSection({ reducedMotion, isMobile }: { reducedMotion: boolean; isMobile: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [glFailed, setGlFailed] = useState(false);
  const noGL = !webglAvailable();

  useEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('[data-hero-veil]', { opacity: 1 }, { opacity: 0, duration: 0.9 }, 0)
        .fromTo('[data-hero-canvas]', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.4 }, 0.15)
        .fromTo('[data-hero-line]', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 0.5)
        .fromTo('[data-hero-fade]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, 0.9);
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  const showFallback = glFailed || noGL;

  return (
    <section ref={root} className="studio-bg relative flex min-h-[100svh] items-center overflow-hidden" aria-label="Hero — engineered to hold, built to last">
      <div data-hero-veil className="pointer-events-none absolute inset-0 z-10 bg-ink-950" aria-hidden />

      {/* Premium scrims: nav legibility, vignette, seamless fade into next section */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-28 bg-gradient-to-b from-black/60 to-transparent" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[15]"
        aria-hidden
        style={{ background: 'radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(0,0,0,0.5) 100%)' }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] h-40 bg-gradient-to-b from-transparent to-ink-950" aria-hidden />

      <div className="shell relative z-20 grid w-full items-center gap-10 pb-20 pt-32 md:pb-28 md:pt-36 lg:grid-cols-[0.95fr_1.05fr]">
        {/* LEFT — content column, capped width so it can never reach the product */}
        <div className="order-last max-w-xl md:order-first">
          <p data-hero-fade className="inline-flex items-center gap-2.5 rounded-full border border-brass/30 bg-black/40 px-4 py-2 text-[11px] font-semibold tracking-[0.22em] text-brass-light backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brass" aria-hidden />
            SHCS · NUTS · WASHERS · {products.length} PRODUCTS
          </p>
          <h1 className="display-hero mt-5 text-balance">
            <span data-hero-line className="block">Engineered <span className="serif-accent brass-text">to hold.</span></span>
            <span
              data-hero-line
              className="block bg-gradient-to-r from-silver-light via-silver to-muted bg-clip-text text-transparent"
            >
              Built to last.
            </span>
          </h1>
          <p data-hero-fade className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted md:text-[18px]">
            Precision-engineered fasteners for industrial applications, construction, and manufacturing.
            <span className="mt-2 block text-[13px] tracking-[0.08em] text-brass/90">Cinematic 3D · PBR metals · Scroll-driven teardown below ↓</span>
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary">Explore products</Link>
            <Link to="/quote" className="btn-ghost">Request a quote</Link>
          </div>
          <dl data-hero-fade className="mt-8 flex max-w-xl items-stretch gap-5 border-t hairline pt-5 text-[12px]" aria-label="Featured specification">
            {[
              ['Thread', 'M4 × 0.7'],
              ['Head', 'Socket · CSK'],
              ['Range', `M2–M8 · ${products.length} items`],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <dt className="tracking-[0.2em] text-muted-dim">{k.toUpperCase()}</dt>
                <dd className="font-display text-[15px] font-bold tracking-wide text-paper">{v}</dd>
              </div>
            ))}
            <div className="ml-auto hidden self-center sm:block" aria-hidden>
              <p className="text-right tracking-[0.2em] text-muted-dim">SCROLL ↓<br />8-SCENE STORY</p>
            </div>
          </dl>
        </div>

        {/* RIGHT — dedicated 3D zone. Own grid cell ⇒ zero overlap, every viewport. */}
        <div data-hero-canvas className="relative order-first h-[340px] sm:h-[420px] md:order-last md:h-[560px]" aria-hidden={!showFallback}>
          {!showFallback ? (
            <ErrorBoundary>
              <div className="absolute inset-0">
                <HeroScene reducedMotion={reducedMotion} isMobile={isMobile} onError={() => setGlFailed(true)} />
              </div>
            </ErrorBoundary>
          ) : (
            <div className="flex h-full items-center justify-center" role="img" aria-label="Bolt illustration (3D unavailable)">
              <svg width="520" height="320" viewBox="0 0 520 320" className="max-w-full">
                <defs>
                  <linearGradient id="hb" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#E2E5E8" /><stop offset="0.5" stopColor="#8b939b" /><stop offset="1" stopColor="#C7CDD3" />
                  </linearGradient>
                </defs>
                <g transform="translate(70,70) rotate(-18 180 90)">
                  <polygon points="40,0 130,0 165,45 165,115 130,160 40,160 5,115 5,45" fill="url(#hb)" stroke="#5b636b" strokeWidth="3" />
                  <rect x="165" y="52" width="220" height="56" rx="6" fill="url(#hb)" stroke="#5b636b" strokeWidth="3" />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line key={i} x1={185 + i * 16} y1="52" x2={177 + i * 16} y2="108" stroke="#4a5157" strokeWidth="4" />
                  ))}
                </g>
              </svg>
            </div>
          )}
        </div>
      </div>

      <div data-hero-fade className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 md:block" aria-hidden>
        <div className="flex h-11 w-7 items-start justify-center rounded-full border border-brass/30 p-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-brass" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/5 bg-black/30 py-2.5 backdrop-blur-sm" aria-hidden>
        <div className="marquee-track gap-8 text-[11px] font-semibold tracking-[0.28em] text-muted">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center gap-8 pr-8">
              <span>SHCS</span><span className="text-brass">◆</span>
              <span>NUTS</span><span className="text-brass">◆</span>
              <span>WASHERS</span><span className="text-brass">◆</span>
              <span>QTF</span><span className="text-brass">◆</span>
              <span>BEARINGS</span><span className="text-brass">◆</span>
              <span>POP RIVETS</span><span className="text-brass">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
