import { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { HeroBolt } from '../hero/HeroBolt';
import { StudioLighting } from '../hero/HeroLighting';
import { AimCamera } from '../hero/AimCamera';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { useReveal } from '../../hooks/useScrollProgress';
import { useInView } from '../../hooks/useInView';

/** Final CTA (§24): pinned finale, brass glow, scroll-linked 3D. */
export function FinalCTA({ isMobile = false }: { isMobile?: boolean }) {
  const ref = useReveal<HTMLElement>(true);
  const { ref: viewRef, inView } = useInView<HTMLDivElement>(0.05);
  return (
    <section ref={ref} className="studio-bg relative overflow-hidden border-t hairline" aria-label="Final call to action">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/60 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass/[0.07] blur-[120px]" aria-hidden />
      <div className="shell relative grid items-center gap-10 py-24 md:grid-cols-2 md:py-32">
        <div>
          <p className="eyebrow" data-reveal>Final composition · 11</p>
          <h2 className="display-section mt-3 text-balance" data-reveal>Every great structure starts with a <span className="serif-accent brass-text">connection.</span></h2>
          <p className="mt-4 max-w-md text-[15px] text-muted" data-reveal>Discover precision fasteners for your next project — catalog, 3D, bulk quote in one flow.</p>
          <div className="mt-7 flex flex-wrap gap-3" data-reveal>
            <Link to="/products" className="btn-primary">Explore products →</Link>
            <Link to="/quote" className="btn-ghost">Request a quote</Link>
          </div>
        </div>
        <div data-reveal data-reveal-clip>
          <ErrorBoundary>
            <div ref={viewRef} className="card-premium relative h-[340px] overflow-hidden md:h-[480px]" aria-label="Assembled bolt, nut and washer">
              <Canvas
                dpr={isMobile ? [1, 1.25] : [1, 1.75]}
                camera={{ position: [3.6, 1.4, 4.6], fov: 35 }}
                gl={{ antialias: !isMobile, alpha: true }}
                frameloop={inView ? 'always' : 'never'}
              >
                <Suspense fallback={null}>
                  <AimCamera target={[0.4, -0.1, 0]} />
                  <StudioLighting rimIntensity={2.6} shadows={!isMobile} />
                  <HeroBolt finishId="zinc" assembled />
                </Suspense>
              </Canvas>
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-brass/30 bg-black/60 px-3 py-1 text-[11px] tracking-[0.18em] text-brass-light backdrop-blur">
                ASSEMBLED · M12 × 1.75 · ZINC 8.8
              </p>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
