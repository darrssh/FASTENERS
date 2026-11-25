import { useCatalog } from '../../hooks/useCatalog';
import { useReveal } from '../../hooks/useScrollProgress';

/** Proof band — honest, catalogue-derived counts instead of invented testimonials. */
export function Testimonials() {
  const ref = useReveal<HTMLElement>(true);
  const { products, categories } = useCatalog();

  const STATS = [
    { v: String(products.length), l: 'Listed SKUs', d: 'M2–M8 socket screws, hex nuts and ultraflat heads.' },
    { v: String(categories.length).padStart(2, '0'), l: 'Size families', d: 'M2, M3, M4, M6, M8 and ultraflat — all in one filterable range.' },
    { v: '03', l: 'Views per SKU', d: 'Three technical renders plus an interactive per-product model.' },
    { v: 'INR', l: 'Prices up front', d: 'MOQ tiers and live stock states on every listing.' },
  ];

  return (
    <section ref={ref} className="shell py-24 md:py-32" aria-label="Capability proof">
      <p className="eyebrow" data-reveal>Proof · derived from the catalogue · 09</p>
      <h2 className="display-section mt-3 max-w-3xl text-balance" data-reveal>Numbers you can <span className="serif-accent brass-text">check yourself.</span></h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.l} className="card-premium card-hover-lift p-6 text-center" data-reveal data-reveal-clip>
            <p className="brass-text font-display text-5xl font-bold">{s.v}</p>
            <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.18em]">{s.l}</p>
            <p className="mt-2 text-[13px] text-muted">{s.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-[12px] tracking-[0.14em] text-muted-dim" data-reveal>
        NO INVENTED TESTIMONIALS — VERIFIED CUSTOMER REVIEWS APPEAR HERE AFTER LAUNCH.
      </p>
    </section>
  );
}
