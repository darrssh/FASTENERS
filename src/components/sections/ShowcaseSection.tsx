import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { ProductCard } from '../products/ProductCard';
import { useReveal } from '../../hooks/useScrollProgress';

/** Interactive product showcase — horizontal scroll rail on desktop, grid on mobile. */
export function ShowcaseSection() {
  const ref = useReveal<HTMLElement>(true);
  const picks = [products[10], products[18], products[32], products[40]];
  return (
    <section ref={ref} className="relative overflow-hidden border-t hairline bg-ink-900/40" aria-label="Interactive product showcase">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/50 to-transparent" aria-hidden />
      <div className="shell py-24 md:py-32">
        <p className="eyebrow" data-reveal>Showcase · hover to inspect · 03</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-section max-w-2xl text-balance" data-reveal>Flagship fasteners, <span className="serif-accent brass-text">up close.</span></h2>
          <Link to="/products" className="btn-ghost" data-reveal>Open catalog →</Link>
        </div>
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
