import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { BoltJourney } from './BoltJourney';
import { StudioLighting } from '../hero/HeroLighting';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { sceneIndexForProgress, webglAvailable, cx } from '../../lib/utils';
import { categories, materials } from '../../data/categories';
import { products } from '../../data/products';
import { useCart } from '../../hooks/useCart';
import { resolveMedia } from '../../lib/api';

const FEATURED_CATEGORY_ORDER = [
  'm2-fasteners',
  'm3-fasteners',
  'm4-fasteners',
  'm6-fasteners',
  'm8-fasteners',
  'ultralow-sockets',
];

const JOURNEY_PRODUCTS = FEATURED_CATEGORY_ORDER.map((categoryId) =>
  products.find((p) => p.category === categoryId),
).filter((p): p is (typeof products)[number] => Boolean(p));

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
  const cart = useCart();
  const journeyProducts = useMemo(() => JOURNEY_PRODUCTS, []);
  const totalScenes = Math.max(1, journeyProducts.length);
  const [scene, setScene] = useState(0);
  const [failed, setFailed] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const [ready, setReady] = useState(false);
  const [finish, setFinish] = useState(finishId);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const barRef = useRef<HTMLDivElement>(null);
  const lastScene = useRef(0);

  useEffect(() => setFinish(finishId), [finishId]);
  useEffect(() => {
    setNoGL(!webglAvailable());
  }, []);

  // Pause scene bookkeeping and WebGL while the story is off-screen or hidden.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  useEffect(() => {
    const fn = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', fn);
    return () => document.removeEventListener('visibilitychange', fn);
  }, []);

  useEffect(() => {
    if (reducedMotion || !visible) return;
    let raf = 0;
    const tick = () => {
      if (!document.hidden) {
        const p = progress.current;
        // Compare OUTSIDE the setter: no 60fps setState churn when idle.
        const n = sceneIndexForProgress(p, totalScenes);
        if (n !== lastScene.current) {
          lastScene.current = n;
          setScene(n);
        }
        if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [visible, progress, totalScenes, reducedMotion]);

  const scrollToFraction = (f: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    // Programmatic smooth-scroll fights the scrub damping on low-end phones.
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, top + travel * f);
    root.style.scrollBehavior = previous;
  };

  const fallback = failed || noGL;
  const product = journeyProducts[scene] ?? journeyProducts[0];
  const sceneCountLabel = String(totalScenes).padStart(2, '0');
  const backdrop = BACKDROPS[scene % BACKDROPS.length];
  const categoryName = categories.find((c) => c.id === product?.category)?.name ?? 'Catalogue product';
  const productImage = product?.images?.[0] ? resolveMedia(product.images[0]) : null;
  const productPrice = product?.price != null ? `INR ${product.price.toLocaleString('en-IN')}` : 'Request quote';
  const productSpec = [product?.diameter, product?.standard].filter(Boolean).join(' · ') || product?.sku || 'Product';

  const handleAddToCart = (id: string, variant?: string) => {
    cart.add(id, variant || 'Standard', 1);
    setAddedId(id);
    window.setTimeout(() => setAddedId((current) => (current === id ? null : current)), 1400);
  };

  // Reduced motion: a calm, fully readable static story — no sticky, no WebGL.
  if (reducedMotion) {
    return (
      <section ref={ref} className="studio-bg relative py-24" aria-label="Bolt journey products — static view">
        <div className="shell max-w-4xl">
          <p className="eyebrow">The bolt journey · {totalScenes} products</p>
          <h2 className="display-section mt-3">Scroll the journey. <span className="serif-accent brass-text">Pick your product.</span></h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            Explore selected WELTORQUE catalogue products one by one, with the same 3D bolt journey experience.
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {journeyProducts.map((p, i) => {
              const img = p.images?.[0] ? resolveMedia(p.images[0]) : null;
              const cat = categories.find((c) => c.id === p.category)?.name ?? 'Product';
              return (
                <li key={p.id} className="card overflow-hidden p-5">
                  <p className="text-[11px] font-bold tracking-[0.2em] text-brass">{String(i + 1).padStart(2, '0')} · {cat}</p>
                  <div className="mt-3 flex items-center gap-4">
                    {img && <img src={img} alt={p.name} className="h-20 w-20 rounded-xl border hairline bg-white object-contain p-2" loading="lazy" />}
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold">{p.name}</h3>
                      <p className="mt-1 text-[13px] text-muted">{p.shortDescription}</p>
                      <p className="mt-2 text-[12px] tracking-[0.14em] text-muted-dim">{p.diameter} · {p.standard ?? p.sku}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`/products/${p.slug}`} className="btn-primary min-h-[44px] !px-4 !py-2 !text-[12px]">View product</Link>
                    <button type="button" onClick={() => handleAddToCart(p.id, 'Standard')} className="btn-ghost min-h-[44px] !px-4 !py-2 !text-[12px]">
                      {addedId === p.id ? 'Added' : 'Add to cart'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: isMobile ? `${totalScenes * 70}svh` : `${totalScenes * 95}svh` }} aria-label="Scroll-driven 3D bolt journey with products">
      <div className="sticky top-0 h-[100svh] overflow-hidden transition-[background] duration-700" style={{ background: backdrop }}>
        {/* Mobile progress hairline */}
        <div className="absolute inset-x-0 top-0 z-30 h-[3px] bg-white/10 md:hidden" aria-hidden>
          <div ref={barRef} className="h-full w-full origin-left bg-gradient-to-r from-brass-light to-brass-dark" style={{ transform: 'scaleX(0)' }} />
        </div>

        {!fallback ? (
          <div className={cx('absolute inset-0 transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0')}>
            <Canvas
              dpr={isMobile ? [1, 1.25] : [1, 1.75]}
              camera={{ position: [3.4, 1.5, 4.6], fov: 35 }}
              frameloop={visible && pageVisible ? 'always' : 'never'}
              gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
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

        {/* Subtle end-of-journey washes, preserving scroll/visual behavior */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: scene === totalScenes - 2 ? 0.35 : 0,
            background: 'linear-gradient(100deg, rgba(59,130,246,0.12), transparent 45%, rgba(199,205,211,0.06))',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{ opacity: scene === totalScenes - 1 ? 0.4 : 0, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.45))' }}
          aria-hidden
        />

        {/* Product content — choreographed swap, one product per scroll step */}
        <div className="pointer-events-none absolute inset-0 flex items-end pt-[72px] md:items-center md:pt-0">
          <div className="shell w-full pb-36 md:pb-0">
            <div className="max-w-xl">
              <AnimatePresence mode="wait">
                {product && (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -18, filter: 'blur(6px)' }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="eyebrow">{categoryName} · {String(scene + 1).padStart(2, '0')}/{sceneCountLabel}</p>
                    <h2 className="journey-title display-section mt-3 break-words text-balance">{product.name}</h2>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-silver-light/90 [text-shadow:0_2px_18px_rgba(0,0,0,0.65)]">
                      {product.shortDescription}
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                      {productImage && (
                        <img
                          src={productImage}
                          alt={product.name}
                          className="journey-thumb h-20 w-20 shrink-0 rounded-xl border border-white/10 bg-white object-contain p-2 shadow-premium"
                          loading="lazy"
                        />
                      )}
                      <div>
                        <p className="font-display text-[12px] font-bold tracking-[0.22em] text-brass-light/90">{productSpec}</p>
                        <p className="mt-1 text-[14px] font-semibold text-paper">{productPrice}</p>
                        <p className="mt-1 break-words text-[12px] tracking-[0.1em] text-muted-dim">{product.sku}</p>
                      </div>
                    </div>

                    <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
                      <Link to={`/products/${product.slug}`} className="btn-primary">View product</Link>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product.id, 'Standard')}
                        className="btn-ghost"
                      >
                        {addedId === product.id ? 'Added to cart' : 'Add to cart'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Finish picker — makes the finishId prop interactive */}
        <div className="absolute right-4 top-[80px] z-30 sm:right-5 md:bottom-8 md:right-8 md:top-auto">
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md sm:gap-2 sm:p-1.5" role="group" aria-label="Preview finish">
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
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                >
                  <span
                    aria-hidden
                    className={cx(
                      'h-8 w-8 rounded-full border transition-all duration-300',
                      active ? 'scale-110 border-brass-light shadow-glow' : 'border-white/20',
                    )}
                    style={{ background: meta.swatch }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Scroll hint + skip (scene 0 only) */}
        {scene === 0 && (
          <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center text-center md:bottom-8">
            <button
              type="button"
              aria-label="Scroll to next product"
              onClick={() => scrollToFraction(totalScenes > 1 ? 1 / (totalScenes - 1) : 1)}
              className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:text-brass-light"
            >
              <span className="flex h-11 w-7 items-start justify-center rounded-full border border-brass/30 p-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brass" aria-hidden />
              </span>
            </button>
            <button type="button" onClick={() => scrollToFraction(1)} className="pointer-events-auto min-h-[44px] px-3 text-[11px] tracking-[0.2em] text-muted-dim underline-offset-4 hover:text-paper hover:underline">
              Skip products
            </button>
          </div>
        )}

        {/* Progress rail — clickable dots on desktop */}
        <div className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex" role="group" aria-label="Journey products">
          <span className="mb-1 font-display text-[11px] font-bold tracking-[0.2em] text-brass">{String(scene + 1).padStart(2, '0')}</span>
          {journeyProducts.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => scrollToFraction(totalScenes > 1 ? i / (totalScenes - 1) : 0)}
              aria-label={`Go to ${p.name}`}
              className="grid h-11 w-11 place-items-center"
            >
              <span
                aria-hidden
                className={cx(
                  'w-[3px] rounded-full transition-all duration-500',
                  i === scene ? 'h-10 bg-gradient-to-b from-brass-light to-brass-dark' : i < scene ? 'h-8 bg-brass/60' : 'h-8 bg-white/15',
                )}
              />
            </button>
          ))}
          <span className="mt-1 text-[11px] tracking-[0.2em] text-muted-dim">{sceneCountLabel}</span>
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
