import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { categories } from '../../data/categories';
import { overviewImage } from '../../data/productMedia';
import { products } from '../../data/products';
import { HeroScene } from './HeroScene';
import { ProductRender } from '../products/ProductRender';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { webglAvailable } from '../../lib/utils';
import { useMediaQuery } from '../../hooks/useMediaQuery';

/** Real catalogue-image fallback for desktop browsers without WebGL. */
function CatalogFallback() {
  const product = products[0];
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-brass/20 bg-black/25 p-3"
      role="img"
      aria-label={`${product.name} catalogue preview`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ background: 'radial-gradient(75% 65% at 50% 42%, rgba(201,168,106,0.16), transparent 70%)' }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-white">
        <ProductRender renderKey={overviewImage(product)} name={product.name} fit />
      </div>
      <span className="pointer-events-none absolute bottom-2 right-3 rounded bg-black/65 px-2 py-1 text-[9px] font-semibold tracking-[0.18em] text-brass-light">
        CATALOGUE IMAGE
      </span>
    </div>
  );
}

const quickLinks = categories.map((category) => ({
  label: category.id === 'ultralow-sockets' ? 'Ultraflat' : category.id.replace('-fasteners', '').toUpperCase(),
  to: `/products?category=${encodeURIComponent(category.id)}`,
}));

/**
 * Device-specific hero choreography (§6):
 * - Phone: no product illustration at all. A real, message-led catalogue hero:
 *   live status → headline → value line → one primary action → real size links
 *   → a compact spec rail. This is honest, fast and genuinely useful on a phone.
 * - Tablet: editorial split-lite — copy left, smaller 3D visual right.
 * - Desktop: cinematic split — full 3D visual in its own grid cell.
 *
 * Content and visual always own separate grid cells, so overlap is impossible.
 */
export function HeroSection({ reducedMotion, isMobile }: { reducedMotion: boolean; isMobile: boolean }) {
  const root = useRef<HTMLElement>(null);
  const isPhone = useMediaQuery('(max-width: 639.98px)');
  const [glFailed, setGlFailed] = useState(false);
  // Probe once, only where 3D is actually used. Phones render no canvas at all.
  const [noGL] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 639.98px)').matches) return false;
    return !webglAvailable();
  });

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

      {isPhone ? (
        /* Phone hero: complete, honest and image-free. No fake bolt, no WebGL,
           no half-screen product block — just a fast path into the catalogue. */
        <div className="shell relative z-20 flex min-h-[100svh] flex-col justify-center pb-14 pt-24">
          <div className="hero-blueprint pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div className="pointer-events-none absolute -left-20 top-20 h-56 w-56 rounded-full bg-brass/10 blur-3xl" aria-hidden />

          <div className="relative">
            <p data-hero-fade className="inline-flex items-center gap-2.5 rounded-full border border-brass/30 bg-black/40 px-4 py-2 text-[10px] font-semibold tracking-[0.16em] text-brass-light backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-brass" aria-hidden />
              LIVE CATALOG · {products.length} SKUS
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

            <p data-hero-fade className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-muted">
              M2–M8 SHCS, hex nuts and ultraflat heads. Exact specs, INR prices, MOQ tiers and live stock.
            </p>

            <div data-hero-fade className="mt-6 flex flex-col items-stretch gap-1">
              <Link to="/products" className="btn-primary w-full justify-center">Explore products</Link>
              <Link
                to="/quote"
                className="inline-flex min-h-[44px] items-center justify-center px-2 text-[13px] font-semibold text-muted underline decoration-brass/50 underline-offset-4 transition-colors hover:text-brass-light"
              >
                Request a quote →
              </Link>
            </div>

            <nav data-hero-fade className="mt-7" aria-label="Browse fasteners by size">
              <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-muted-dim">BROWSE BY SIZE</p>
              <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full border hairline bg-white/[0.03] px-4 text-[12px] font-semibold tracking-[0.1em] text-silver transition-colors hover:border-brass/50 hover:text-brass-light"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <dl data-hero-fade className="mt-7 grid grid-cols-3 divide-x divide-white/10 border-t hairline pt-4 text-[10px]" aria-label="Catalogue summary">
              {[
                ['RANGE', 'M2–M8'],
                ['PRICING', 'INR'],
                ['MOQ', '100–500'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 px-3 first:pl-0">
                  <dt className="tracking-[0.18em] text-muted-dim">{k}</dt>
                  <dd className="font-display text-[13px] font-bold tracking-wide text-paper">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ) : (
        <div className="shell relative z-20 grid w-full items-center gap-8 pb-16 pt-28 sm:grid-cols-[1.05fr_0.95fr] sm:gap-6 sm:pb-20 md:gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:pb-24 lg:pt-28">
          {/* Content always comes first in source and in paint order. */}
          <div className="max-w-xl">
            <p data-hero-fade className="inline-flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-brass/30 bg-black/40 px-4 py-2 text-[11px] font-semibold tracking-[0.12em] text-brass-light backdrop-blur-sm sm:tracking-[0.22em]">
              <span className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-brass" aria-hidden />
              <span>M2–M8 · SHCS · HEX NUTS · ULTRAFLAT</span>
              <span className="hidden sm:inline">· {products.length} PRODUCTS</span>
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
            <p data-hero-fade className="mt-4 max-w-xl text-[14px] leading-relaxed text-muted sm:mt-5 sm:text-[16px] md:text-[18px]">
              {products.length} precision fasteners in one catalogue — socket head cap screws, hex nuts and
              ultraflat heads from M2 to M8. Exact technical specs, INR pricing, MOQ tiers and live stock on every listing.
            </p>
            <div data-hero-fade className="mt-6 flex flex-col items-stretch gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link to="/products" className="btn-primary w-full justify-center sm:w-auto">Explore products</Link>
              <Link
                to="/quote"
                className="inline-flex min-h-[44px] items-center justify-center px-2 text-[13px] font-semibold text-muted underline decoration-brass/50 underline-offset-4 transition-colors hover:text-brass-light sm:px-3"
              >
                Request a quote →
              </Link>
            </div>
            <dl data-hero-fade className="hidden max-w-xl flex-wrap items-stretch gap-x-5 gap-y-3 border-t hairline pt-5 text-[12px] sm:flex" aria-label="Featured specification">
              {[
                ['Range', `M2–M8 · ${products.length} SKUs`],
                ['Ordering', 'INR · MOQ 100–500'],
                ['Sourcing', 'WELTORQUE reference'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <dt className="tracking-[0.2em] text-muted-dim">{k.toUpperCase()}</dt>
                  <dd className="font-display text-[15px] font-bold tracking-wide text-paper">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual owns the second grid cell. 3D from tablet up, real catalogue image if WebGL fails. */}
          <div
            data-hero-canvas
            className="relative h-[340px] w-full sm:h-[340px] md:h-[420px] lg:h-[500px]"
            aria-hidden={!showFallback}
          >
            {showFallback ? (
              <CatalogFallback />
            ) : (
              <ErrorBoundary>
                <div className="absolute inset-0">
                  <HeroScene reducedMotion={reducedMotion} isMobile={isMobile} onError={() => setGlFailed(true)} />
                </div>
              </ErrorBoundary>
            )}
          </div>
        </div>
      )}

      <div data-hero-fade className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 md:block" aria-hidden>
        <div className="flex h-11 w-7 items-start justify-center rounded-full border border-brass/30 p-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-brass" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/5 bg-black/30 py-2.5 backdrop-blur-sm" aria-hidden>
        <div className="marquee-track text-[11px] font-semibold tracking-[0.28em] text-muted">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center gap-8 pr-8">
              <span>{products.length} PRODUCTS</span><span className="text-brass">◆</span>
              <span>M2–M8</span><span className="text-brass">◆</span>
              <span>SHCS · HEX NUTS · ULTRAFLAT</span><span className="text-brass">◆</span>
              <span>INR PRICES</span><span className="text-brass">◆</span>
              <span>MOQ TIERS</span><span className="text-brass">◆</span>
              <span>LIVE STOCK</span><span className="text-brass">◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
