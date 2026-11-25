import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { HeroBolt } from '../hero/HeroBolt';
import { StudioLighting } from '../hero/HeroLighting';
import { AimCamera } from '../hero/AimCamera';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { useReveal } from '../../hooks/useScrollProgress';
import { useInView } from '../../hooks/useInView';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const ORDER_STEPS = [
  ['01', 'Pick a stocked SKU', 'Browse 41 priced listings with exact specs, MOQ tiers and live stock.'],
  ['02', 'Set your quantity', 'Quantity controls enforce the minimum order for the SKU you choose.'],
  ['03', 'Confirm and receive', 'Cash on delivery for stocked lines, or a bulk quote for custom parts.'],
] as const;

/** Final CTA (§24): pinned finale, brass glow, scroll-linked 3D. */
export function FinalCTA({ isMobile = false }: { isMobile?: boolean }) {
  const ref = useReveal<HTMLElement>(true);
  const { ref: viewRef, inView } = useInView<HTMLDivElement>(0.05);
  const isPhone = useMediaQuery('(max-width: 639.98px)');

  return (
    <section ref={ref} className="studio-bg relative overflow-x-clip border-t hairline" aria-label="Final call to action">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/60 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass/[0.07] blur-[120px]" aria-hidden />

      <div className="shell relative py-20 md:py-32">
        {isPhone ? (
          /* Phone finale: no WebGL, no decorative product — just the last
             decision and the real order path, in the same visual language. */
          <div className="relative">
            <p className="eyebrow" data-reveal>Ready to order · 11</p>
            <h2 className="display-section mt-3 text-balance" data-reveal>
              Every great structure starts with a <span className="serif-accent brass-text">connection.</span>
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted" data-reveal>
              41 priced, stocked SKUs from M2 to M8. Choose your MOQ, order on cash delivery, or send a bulk
              quote — the whole path is right here.
            </p>

            <div className="mt-6 flex flex-col items-stretch gap-1" data-reveal>
              <Link to="/products" className="btn-primary w-full justify-center">Explore products →</Link>
              <Link
                to="/quote"
                className="inline-flex min-h-[44px] items-center justify-center px-2 text-[13px] font-semibold text-muted underline decoration-brass/50 underline-offset-4 transition-colors hover:text-brass-light"
              >
                Request a quote →
              </Link>
            </div>

            <div className="card-premium relative mt-8 overflow-hidden p-5" data-reveal>
              <div className="hero-blueprint pointer-events-none absolute inset-0 opacity-30" aria-hidden />
              <div className="relative">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-brass">YOUR PATH TO ORDER</p>
                <ol className="mt-4 space-y-3">
                  {ORDER_STEPS.map(([n, title, detail]) => (
                    <li key={n} className="flex gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brass/40 bg-brass/10 font-display text-[12px] font-bold text-brass-light">
                        {n}
                      </span>
                      <div>
                        <p className="font-display text-[15px] font-bold">{title}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 border-t hairline pt-3 text-[11px] tracking-[0.12em] text-muted-dim">
                  STOCKED LINES · CASH ON DELIVERY · CUSTOM PARTS · BULK QUOTE
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="eyebrow" data-reveal>Ready to order · 11</p>
              <h2 className="display-section mt-3 text-balance" data-reveal>Every great structure starts with a <span className="serif-accent brass-text">connection.</span></h2>
              <p className="mt-4 max-w-md text-[15px] text-muted" data-reveal>
                41 priced, stocked SKUs from M2 to M8. Choose your MOQ, order on cash delivery, or send a bulk
                quote — the whole path is right here.
              </p>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link to="/products" className="btn-primary">Explore products →</Link>
                <Link to="/quote" className="btn-ghost">Request a quote</Link>
              </div>
            </div>
            <div data-reveal data-reveal-clip>
              <ErrorBoundary>
                <div ref={viewRef} className="card-premium relative h-[340px] overflow-hidden sm:h-[340px] md:h-[480px]" aria-label="Assembled bolt, nut and washer">
                  <Canvas
                    dpr={isMobile ? [1, 1.25] : [1, 1.75]}
                    camera={{ position: [3.6, 1.4, 4.6], fov: 35 }}
                    gl={{ antialias: !isMobile, alpha: true }}
                    frameloop={inView ? 'always' : 'never'}
                  >
                    <Suspense fallback={null}>
                      <AimCamera target={[0.4, -0.1, 0]} />
                      <StudioLighting rimIntensity={2.6} shadows={!isMobile} />
                      <HeroBolt finishId="zinc" assembled isMobile={isMobile} />
                    </Suspense>
                  </Canvas>
                  <p className="absolute bottom-3 left-1/2 max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-full border border-brass/30 bg-black/60 px-3 py-1 text-center text-[10px] leading-tight tracking-[0.12em] text-brass-light backdrop-blur sm:text-[11px] sm:tracking-[0.18em]">
                    ASSEMBLY PREVIEW · M2–M8 RANGE · FINISH ON QUOTE
                  </p>
                </div>
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
