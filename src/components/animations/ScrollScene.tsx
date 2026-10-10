import { Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { BoltJourney } from './BoltJourney';
import { StudioLighting } from '../hero/HeroLighting';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { sceneIndexForProgress, webglAvailable, cx } from '../../lib/utils';
import { materials } from '../../data/categories';
import { products } from '../../data/products';

const SCENES = [
  {
    tag: 'Scene 01 — Hero reveal',
    title: 'Engineered to hold. Built to last.',
    accent: true,
    body: 'A fully assembled M12 hex bolt floats in the studio — 19 mm across flats, Class 8.8 steel. Scroll to begin the teardown.',
    spec: 'M12 × 1.75 · ISO metric',
    label: null as string | null,
  },
  {
    tag: 'Scene 02 — Macro precision',
    title: 'A 60° thread, cut to hold.',
    accent: false,
    body: 'Dolly-in on the profile: 1.75 mm pitch, true helical ridge — not a texture. This is where clamp load is born.',
    spec: 'Pitch 1.75 mm · 6g tolerance',
    label: null,
  },
  {
    tag: 'Scene 03 — Nut loosening',
    title: 'Rotation locked to pitch.',
    accent: false,
    body: 'The nut backs off exactly as steel would — one revolution per 1.75 mm of travel. No fakes, no slides.',
    spec: 'M12 nut · 19 mm A/F',
    label: 'HEX NUTS',
  },
  {
    tag: 'Scene 04 — Washer reveal',
    title: 'Load, spread evenly.',
    accent: false,
    body: 'The washer separates — doubling the bearing area, protecting the joint face from galling under torque.',
    spec: 'Ø24 × 2.5 mm · 200 HV',
    label: 'WASHERS & SPACERS',
  },
  {
    tag: 'Scene 05 — Exploded view',
    title: 'Three parts. One axis.',
    accent: false,
    body: 'Bolt · Nut · Washer held colinear on a brass guide — the full joint, laid bare for inspection.',
    spec: 'Bolt · Nut · Washer',
    label: 'BOLT · NUT · WASHER',
  },
  {
    tag: 'Scene 06 — Reassembly',
    title: 'Seats like it means it.',
    accent: false,
    body: 'Washer drops home, nut runs back down the helix with a soft settle. Reversible — scrub back up to replay.',
    spec: 'Seating torque ≈ 86 N·m',
    label: null,
  },
  {
    tag: 'Scene 07 — Site transition',
    title: 'From studio to structure.',
    accent: false,
    body: 'The assembly slides aside as the grade cools blue — the same fastener, now in bridges, plants and frames.',
    spec: 'Structural · Plant · Site',
    label: null,
  },
  {
    tag: 'Scene 08 — Final composition',
    title: 'Start with a connection.',
    accent: false,
    body: `${products.length} Excel products, nine finishes, one quote in minutes. Take the assembly with you.`,
    spec: `${products.length} products · 9 finishes`,
    label: null,
  },
];

/** Per-scene backdrop grade — studio warmth → industrial cool → finale charcoal. */
const BACKDROPS = [
  'radial-gradient(1100px 600px at 50% 34%, rgba(201,168,106,0.12), transparent 60%), linear-gradient(180deg, #14161a 0%, #0a0b0d 55%, #070809 100%)',
  'radial-gradient(1100px 600px at 50% 34%, rgba(201,168,106,0.13), transparent 60%), linear-gradient(180deg, #14161a 0%, #0a0b0d 55%, #070809 100%)',
  'radial-gradient(1100px 600px at 46% 34%, rgba(201,168,106,0.11), transparent 60%), linear-gradient(180deg, #131519 0%, #0a0b0d 55%, #070809 100%)',
  'radial-gradient(1000px 560px at 46% 36%, rgba(201,168,106,0.10), transparent 60%), linear-gradient(180deg, #12141a 0%, #0a0c10 55%, #070809 100%)',
  'radial-gradient(1000px 560px at 50% 38%, rgba(201,168,106,0.10), transparent 60%), linear-gradient(180deg, #12141c 0%, #0a0c11 55%, #07080a 100%)',
  'radial-gradient(1000px 560px at 50% 38%, rgba(201,168,106,0.11), transparent 60%), linear-gradient(180deg, #13151b 0%, #0a0b0d 55%, #070809 100%)',
  'radial-gradient(900px 550px at 72% 72%, rgba(59,130,246,0.10), transparent 60%), radial-gradient(1000px 560px at 40% 36%, rgba(201,168,106,0.06), transparent 60%), linear-gradient(180deg, #10141d 0%, #0a0e16 55%, #06080d 100%)',
  'radial-gradient(900px 550px at 50% 40%, rgba(201,168,106,0.05), transparent 60%), linear-gradient(180deg, #0c0d10 0%, #070809 60%, #050607 100%)',
];

const FINISH_OPTIONS = ['stainless', 'zinc', 'black-oxide', 'brass'] as const;

type Props = { finishId?: string; reducedMotion?: boolean; isMobile?: boolean };

export function ScrollScene({ finishId = 'stainless', reducedMotion = false, isMobile = false }: Props) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const [scene, setScene] = useState(0);
  const [failed, setFailed] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const [ready, setReady] = useState(false);
  const [finish, setFinish] = useState(finishId);
  const barRef = useRef<HTMLDivElement>(null);
  const lastScene = useRef(0);
  const visibleRef = useRef(true);

  useEffect(() => setFinish(finishId), [finishId]);
  useEffect(() => {
    setNoGL(!webglAvailable());
  }, []);

  // Pause scene bookkeeping while the story is off-screen or the tab hidden.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (!document.hidden && visibleRef.current) {
        const p = progress.current;
        // Compare OUTSIDE the setter: no 60fps setState churn when idle.
        const n = sceneIndexForProgress(p);
        if (n !== lastScene.current) {
          lastScene.current = n;
          setScene(n);
        }
        if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  const scrollToFraction = (f: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    // Programmatic smooth-scroll fights the scrub damping on low-end phones.
    window.scrollTo({ top: top + travel * f, behavior: reducedMotion || isMobile ? 'auto' : 'smooth' });
  };

  const fallback = failed || noGL;
  const copy = SCENES[scene];

  // Reduced motion: a calm, fully readable static story — no sticky, no WebGL.
  if (reducedMotion) {
    return (
      <section ref={ref} className="studio-bg relative py-24" aria-label="Bolt journey — static story">
        <div className="shell max-w-3xl">
          <p className="eyebrow">The bolt journey · 8 scenes</p>
          <h2 className="display-section mt-3">Engineered <span className="serif-accent brass-text">to hold.</span> Built to last.</h2>
          <ol className="mt-10 space-y-4">
            {SCENES.map((s) => (
              <li key={s.tag} className="card p-6">
                <p className="text-[11px] font-bold tracking-[0.2em] text-brass">{s.tag}</p>
                <h3 className="mt-2 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
                <p className="mt-2 text-[12px] tracking-[0.14em] text-muted-dim">{s.spec}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary">Explore products</Link>
            <Link to="/quote" className="btn-ghost">Request a quote</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: isMobile ? '560vh' : '760vh' }} aria-label="Scroll-driven 3D bolt journey">
      <div className="sticky top-0 h-screen overflow-hidden transition-[background] duration-700" style={{ background: BACKDROPS[scene] }}>
        {/* Mobile progress hairline */}
        <div className="absolute inset-x-0 top-0 z-30 h-[3px] bg-white/10 md:hidden" aria-hidden>
          <div ref={barRef} className="h-full w-full origin-left bg-gradient-to-r from-brass-light to-brass-dark" style={{ transform: 'scaleX(0)' }} />
        </div>

        {!fallback ? (
          <div className={cx('absolute inset-0 transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0')}>
            <Canvas
              dpr={isMobile ? [1, 1.25] : [1, 1.75]}
              camera={{ position: [3.4, 1.5, 4.6], fov: 35 }}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              onCreated={({ gl }) => {
                gl.shadowMap.enabled = !isMobile;
                setReady(true);
              }}
              onError={() => setFailed(true)}
              aria-hidden
            >
              <Suspense fallback={null}>
                <StudioLighting shadows={!isMobile} />
                <BoltJourney progress={progress} finishId={finish} reducedMotion={reducedMotion} isMobile={isMobile} />
                {!isMobile && <ContactShadows position={[0, -1.7, 0]} opacity={0.5} scale={12} blur={2.6} far={4} color="#000000" />}
              </Suspense>
            </Canvas>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center" role="img" aria-label="Bolt product illustration fallback">
            <FallbackBolt />
          </div>
        )}

        {/* Cinematic vignette + top/bottom scrims (legibility on mobile) */}
        <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: 'radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(0,0,0,0.5) 100%)' }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 via-black/25 to-transparent md:h-40 md:from-black/40" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent" aria-hidden />

        {/* Scene-7 industrial wash + Scene-8 finale darken, driven by scene state */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: scene === 6 ? 0.5 : 0,
            background: 'linear-gradient(100deg, rgba(59,130,246,0.16), transparent 45%, rgba(199,205,211,0.08))',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{ opacity: scene === 7 ? 0.55 : 0, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.6))' }}
          aria-hidden
        />

        {/* Scene copy — choreographed swap */}
        <div className="pointer-events-none absolute inset-0 flex items-end md:items-center">
          <div className="shell w-full pb-28 md:pb-0">
            <div className="max-w-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene}
                  initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="eyebrow">{copy.tag} · {String(scene + 1).padStart(2, '0')}/08</p>
                  <h2 className="display-section mt-3 text-balance">
                    {copy.accent ? (
                      <>Engineered <span className="serif-accent brass-text">to hold.</span> Built to last.</>
                    ) : (
                      copy.title
                    )}
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-silver-light/90 [text-shadow:0_2px_18px_rgba(0,0,0,0.65)]">{copy.body}</p>
                  <p className="mt-3 font-display text-[12px] font-bold tracking-[0.22em] text-brass-light/90">{copy.spec}</p>
                  {copy.label && (
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-brass/30 bg-black/45 px-4 py-2 text-[11px] font-semibold tracking-[0.2em] text-brass-light backdrop-blur-sm">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brass" />
                      {copy.label}
                    </p>
                  )}
                  {scene === 7 && (
                    <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
                      <Link to="/products" className="btn-primary">Explore products</Link>
                      <Link to="/quote" className="btn-ghost">Request a quote</Link>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Finish picker — makes the finishId prop interactive */}
        <div className="absolute bottom-6 right-5 z-30 md:bottom-8 md:right-8">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/50 p-1.5 backdrop-blur-md" role="group" aria-label="Preview finish">
            {FINISH_OPTIONS.map((id) => {
              const meta = materials.find((m) => m.id === id);
              if (!meta) return null;
              const active = finish === id;
              return (
                <button
                  key={id}
                  type="button"
                  title={meta.name}
                  aria-label={`Preview ${meta.name}`}
                  aria-pressed={active}
                  onClick={() => setFinish(id)}
                  className={cx(
                    'h-8 w-8 rounded-full border transition-all duration-300',
                    active ? 'scale-110 border-brass-light shadow-glow' : 'border-white/20 hover:scale-105 hover:border-white/40',
                  )}
                  style={{ background: meta.swatch }}
                />
              );
            })}
          </div>
        </div>

        {/* Scroll hint + skip (scene 0 only) */}
        {scene === 0 && (
          <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-center">
            <button
              type="button"
              onClick={() => scrollToFraction(0.14)}
              className="pointer-events-auto flex flex-col items-center gap-2 text-[11px] font-semibold tracking-[0.28em] text-muted transition-colors hover:text-brass-light"
            >
              <span className="flex h-11 w-7 items-start justify-center rounded-full border border-brass/30 p-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brass" aria-hidden />
              </span>
              SCROLL
            </button>
            <button type="button" onClick={() => scrollToFraction(1)} className="pointer-events-auto mt-2 min-h-[44px] px-3 text-[11px] tracking-[0.2em] text-muted-dim underline-offset-4 hover:text-paper hover:underline">
              Skip story
            </button>
          </div>
        )}

        {/* Progress rail — clickable dots on desktop */}
        <div className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex" role="group" aria-label="Story scenes">
          <span className="mb-1 font-display text-[11px] font-bold tracking-[0.2em] text-brass">{String(scene + 1).padStart(2, '0')}</span>
          {SCENES.map((s, i) => (
            <button
              key={s.tag}
              type="button"
              onClick={() => scrollToFraction(i / (SCENES.length - 1))}
              aria-label={`Go to ${s.tag}`}
              className={cx(
                'w-[3px] rounded-full transition-all duration-500 hover:bg-brass-light',
                i === scene ? 'h-10 bg-gradient-to-b from-brass-light to-brass-dark' : i < scene ? 'h-8 bg-brass/60' : 'h-8 bg-white/15',
              )}
            />
          ))}
          <span className="mt-1 text-[11px] tracking-[0.2em] text-muted-dim">08</span>
        </div>
      </div>
    </div>
  );
}

function FallbackBolt() {
  return (
    <div className="flex flex-col items-center gap-4">
      <svg width="420" height="220" viewBox="0 0 420 260" role="presentation" className="max-w-full">
        <defs>
          <linearGradient id="fb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E2E5E8" />
            <stop offset="0.5" stopColor="#8b939b" />
            <stop offset="1" stopColor="#C7CDD3" />
          </linearGradient>
          <radialGradient id="fb-glow" cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#c9a86a" stopOpacity="0.28" />
            <stop offset="1" stopColor="#c9a86a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="210" cy="130" rx="190" ry="110" fill="url(#fb-glow)" />
        <g transform="translate(60,60)">
          <polygon points="40,0 110,0 140,35 140,85 110,120 40,120 10,85 10,35" fill="url(#fb)" stroke="#5b636b" strokeWidth="2" />
          <rect x="140" y="42" width="150" height="56" rx="6" fill="url(#fb)" stroke="#5b636b" strokeWidth="2" />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={155 + i * 15} y1="42" x2={148 + i * 15} y2="98" stroke="#4a5157" strokeWidth="3" />
          ))}
        </g>
        <text x="210" y="245" textAnchor="middle" fill="#A5ABB3" fontSize="11" letterSpacing="3">M12 HEX ASSEMBLY · STATIC PREVIEW</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/products" className="btn-primary">Explore products</Link>
        <Link to="/quote" className="btn-ghost">Request a quote</Link>
      </div>
    </div>
  );
}
