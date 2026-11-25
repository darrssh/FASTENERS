import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useCatalog } from '../../hooks/useCatalog';
import { HeroBolt } from '../hero/HeroBolt';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { StudioLighting } from '../hero/HeroLighting';
import { useReveal } from '../../hooks/useScrollProgress';
import { useInView } from '../../hooks/useInView';
import { useMediaQuery } from '../../hooks/useMediaQuery';

type Props = {
  reducedMotion?: boolean;
  isMobile?: boolean;
};

/** Keep one-finger page scroll on touch screens; rotate with two fingers. */
function MaterialControls({ reducedMotion }: { reducedMotion: boolean }) {
  const coarse = useMediaQuery('(pointer: coarse)');
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    if (coarse) gl.domElement.style.touchAction = 'pan-y';
    return () => { gl.domElement.style.touchAction = ''; };
  }, [coarse, gl]);
  return (
    <OrbitControls
      enablePan={false}
      autoRotate={!reducedMotion}
      autoRotateSpeed={1}
      minDistance={2.5}
      maxDistance={9}
      target={[0.4, -0.1, 0]}
      touches={coarse ? { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE } : undefined}
    />
  );
}

/** Premium material showcase (§19): real PBR configs swap live on the bolt. Scroll-linked. */
export function MaterialsSection({ reducedMotion = false, isMobile = false }: Props) {
  const { materials, products } = useCatalog();
  const [active, setActive] = useState(materials[0].id);
  const current = materials.find((m) => m.id === active)!;
  const ref = useReveal<HTMLElement>(true);
  const { ref: viewRef, inView } = useInView<HTMLDivElement>(0.05);

  return (
    <section ref={ref} className="relative overflow-x-clip border-t hairline bg-ink-900" aria-label="Materials and finishes">
      <div className="pointer-events-none absolute -left-24 top-1/3 select-none font-display text-[20vw] font-bold leading-none text-white/[0.025]" aria-hidden data-parallax="40">
        METAL
      </div>
      <div className="shell grid gap-10 py-24 md:grid-cols-2 md:py-32">
        <div className="min-w-0 md:sticky md:top-28 md:self-start">
          <p className="eyebrow" data-reveal>Finish visualizer · 04</p>
          <h2 className="display-section mt-3 text-balance" data-reveal>See the surface. <span className="serif-accent brass-text">Confirm it on the quote.</span></h2>
          <p className="mt-4 max-w-lg text-[15px] text-muted" data-reveal>
            These presets change the metalness, roughness and reflections on the model so you can judge the
            look of a finish. They are visual aids only — the actual material, grade and finish for all {products.length}
            listings are confirmed on your quote. Nothing shown here is a stock or specification claim.
          </p>
          {/* Toggle-button group, not tabs: no tabpanel/keyboard contract to honor.
              Phone uses an aligned 2-column grid with the long final option
              spanning both columns; sm+ keeps the natural wrapping pill row. */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" role="group" aria-label="Material selector" data-reveal>
            {materials.map((m, i) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={active === m.id}
                onClick={() => setActive(m.id)}
                className={`inline-flex min-h-[48px] w-full items-center justify-start gap-2 rounded-full border px-3 py-2.5 text-left text-[12px] font-semibold leading-tight transition-all duration-300 hover:-translate-y-0.5 sm:w-auto sm:justify-center sm:px-4 sm:text-[13px] ${
                  i === materials.length - 1 ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  active === m.id ? 'border-brass bg-brass/15 text-paper shadow-glow' : 'hairline text-muted hover:border-brass/40 hover:text-paper'
                }`}
              >
                <span className="inline-block h-4 w-4 shrink-0 rounded-full border border-white/20" style={{ background: m.swatch }} aria-hidden />
                <span className="min-w-0">{m.name}</span>
              </button>
            ))}
          </div>
          <div className="card-premium mt-6 p-5" data-reveal aria-live="polite">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-lg border border-brass/30" style={{ background: current.swatch }} aria-hidden />
              <div>
                <h3 className="font-display text-xl font-bold">{current.name}</h3>
                <p className="text-[12px] tracking-[0.14em] text-brass">
                  M {current.pbr.metalness.toFixed(2)} · R {current.pbr.roughness.toFixed(2)} · ENV {current.pbr.envMapIntensity.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2" aria-hidden>
              {[
                ['Metalness', current.pbr.metalness],
                ['Smoothness', 1 - current.pbr.roughness],
                ['Reflection', Math.min(1, current.pbr.envMapIntensity / 1.3)],
              ].map(([label, v]) => (
                <div key={label as string} className="flex items-center gap-3 text-[12px]">
                  <span className="w-24 tracking-[0.14em] text-muted">{label}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-gradient-to-r from-brass-dark via-brass to-brass-light transition-all duration-700" style={{ width: `${Number(v) * 100}%` }} />
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">{current.blurb}</p>
          </div>
        </div>
        <div data-reveal data-reveal-clip className="min-w-0">
          <ErrorBoundary>
            <div ref={viewRef} className="card-premium relative h-[320px] w-full overflow-hidden sm:h-[380px] md:h-[560px]" aria-label={`Live bolt in ${current.name}`}>
              <Canvas
                dpr={isMobile ? [1, 1.25] : [1, 1.75]}
                camera={{ position: [3.2, 1.5, 4.4], fov: 35 }}
                gl={{ antialias: !isMobile, alpha: true }}
                frameloop={inView ? 'always' : 'never'}
              >
                <Suspense fallback={null}>
                  <StudioLighting shadows={!isMobile} />
                  <HeroBolt finishId={current.id} isMobile={isMobile} />
                  <MaterialControls reducedMotion={reducedMotion} />
                </Suspense>
              </Canvas>
              <p className="absolute bottom-3 left-1/2 max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-full border border-brass/30 bg-black/60 px-3 py-1 text-center text-[10px] leading-tight tracking-[0.12em] text-brass-light backdrop-blur sm:text-[11px] sm:tracking-[0.18em]">
                LIVE PBR · TWO FINGERS TO ROTATE
              </p>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
