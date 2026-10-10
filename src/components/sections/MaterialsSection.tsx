import { useState } from 'react';
import { materials } from '../../data/categories';
import { HeroBolt } from '../hero/HeroBolt';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls } from '@react-three/drei';
import { StudioLighting } from '../hero/HeroLighting';
import { useReveal } from '../../hooks/useScrollProgress';

/** Premium material showcase (§19): real PBR configs swap live on the bolt. Scroll-linked. */
export function MaterialsSection() {
  const [active, setActive] = useState(materials[0].id);
  const current = materials.find((m) => m.id === active)!;
  const ref = useReveal<HTMLElement>(true);

  return (
    <section ref={ref} className="relative overflow-hidden border-t hairline bg-ink-900" aria-label="Materials and finishes">
      <div className="pointer-events-none absolute -left-24 top-1/3 select-none font-display text-[20vw] font-bold leading-none text-white/[0.025]" aria-hidden data-parallax="40">
        METAL
      </div>
      <div className="shell grid gap-10 py-24 md:grid-cols-2 md:py-32">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow" data-reveal>Materials & finishes · 04</p>
          <h2 className="display-section mt-3 text-balance" data-reveal>Not a color swap. <span className="serif-accent brass-text">Real metal behavior.</span></h2>
          <p className="mt-4 max-w-lg text-[15px] text-muted" data-reveal>
            Each finish below drives actual metalness, roughness, and reflection response on a live bolt —
            stainless through polymer and rubber, matching the 46-product catalog.
          </p>
          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Material selector" data-reveal>
            {materials.map((m) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={active === m.id}
                onClick={() => setActive(m.id)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  active === m.id ? 'border-brass bg-brass/15 text-paper shadow-glow' : 'hairline text-muted hover:border-brass/40 hover:text-paper'
                }`}
              >
                <span className="inline-block h-4 w-4 rounded-full border border-white/20" style={{ background: m.swatch }} aria-hidden />
                {m.name}
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
        <div data-reveal data-reveal-clip>
          <ErrorBoundary>
            <div className="card-premium relative h-[380px] overflow-hidden md:h-[560px]" aria-label={`Live bolt in ${current.name}`}>
              <Canvas dpr={[1, 1.75]} camera={{ position: [3.2, 1.5, 4.4], fov: 35 }} gl={{ antialias: true, alpha: true }}>
                <Suspense fallback={null}>
                  <StudioLighting />
                  <HeroBolt finishId={current.id} />
                  <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1} minDistance={2.5} maxDistance={9} target={[0.4, -0.1, 0]} />
                </Suspense>
              </Canvas>
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-brass/30 bg-black/60 px-3 py-1 text-[11px] tracking-[0.18em] text-brass-light backdrop-blur">
                LIVE PBR · DRAG TO ROTATE
              </p>
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
