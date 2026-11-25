import { Link } from 'react-router-dom';
import { useCatalog } from '../../hooks/useCatalog';
import { ProductCard } from '../products/ProductCard';
import { useReveal } from '../../hooks/useScrollProgress';

/** Interactive product showcase — horizontal scroll rail on desktop, grid on mobile. */
export function ShowcaseSection() {
  const { products } = useCatalog();
  const ref = useReveal<HTMLElement>(true);
  const picks = ['e01', 'e48', 'e72', 'e79']
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined) as typeof products;
  return (
    <section ref={ref} className="relative overflow-hidden border-t hairline bg-ink-900/40" aria-label="Interactive product showcase">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/50 to-transparent" aria-hidden />
      <div className="shell py-24 md:py-32">
        <p className="eyebrow" data-reveal>Showcase · one from every family · 03</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-section max-w-2xl text-balance" data-reveal>Four fasteners. <span className="serif-accent brass-text">The whole system.</span></h2>
          <Link to="/products" className="btn-ghost" data-reveal>Open catalog →</Link>
        </div>
        <p className="mt-4 max-w-2xl text-[15px] text-muted" data-reveal>
          A socket screw for precision assemblies, a larger SHCS for frames, a matching hex nut and a
          low-profile ultraflat head. Every card opens the full spec table, three technical views and an
          interactive per-SKU model.
        </p>
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 no-scrollbar md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4" data-reveal>
          {picks.map((p) => (
            <div key={p.id} className="w-[82%] shrink-0 snap-center md:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12px] tracking-[0.2em] text-muted-dim md:hidden">SWIPE → TO INSPECT</p>
      </div>
    </section>
  );
}
