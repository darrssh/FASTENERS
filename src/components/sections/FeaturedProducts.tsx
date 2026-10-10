import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { ProductCard } from '../products/ProductCard';
import { useReveal } from '../../hooks/useScrollProgress';

export function FeaturedProducts() {
  const ref = useReveal<HTMLElement>(true);
  const featured = products.filter((p) => p.featured).slice(0, 6);
  return (
    <section ref={ref} className="relative overflow-hidden border-t hairline bg-ink-900" aria-label="Featured products">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/50 to-transparent" aria-hidden />
      <div className="shell py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow" data-reveal>Featured · 07</p>
            <h2 className="display-section mt-3 text-balance" data-reveal>Stock the <span className="serif-accent brass-text">essentials.</span></h2>
          </div>
          <Link to="/products" className="btn-ghost" data-reveal>Shop all 46 →</Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3" data-reveal>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
