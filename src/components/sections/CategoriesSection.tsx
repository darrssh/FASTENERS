import { Link } from 'react-router-dom';
import { categories, categoryGroups } from '../../data/categories';
import { ProductRender } from '../products/ProductRender';
import { useReveal } from '../../hooks/useScrollProgress';

const GROUPS = categoryGroups as unknown as string[];

export function CategoriesSection() {
  const ref = useReveal<HTMLElement>(true);
  return (
    <section ref={ref} className="shell relative py-24 md:py-32" aria-label="Product categories">
      <p className="eyebrow" data-reveal>Product categories · 02</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
        <h2 className="display-section max-w-2xl text-balance" data-reveal>One system. <span className="serif-accent brass-text">Every connection</span> covered.</h2>
        <Link to="/products" className="btn-ghost" data-reveal>Browse full catalog →</Link>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {GROUPS.map((g, idx) => {
          const first = categories.find((c) => c.group === g)!;
          return (
            <Link
              key={g}
              to={`/products?category=${first.id}`}
              className="card card-hover-lift img-zoom group relative overflow-hidden"
              data-reveal
              data-reveal-clip
              aria-label={`${g} category`}
            >
              <span className="absolute left-5 top-4 z-10 font-display text-[12px] font-bold tracking-[0.24em] text-brass/80" aria-hidden>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="overflow-hidden" data-parallax={idx % 2 === 0 ? '-14' : '14'}>
                <div className="transition-transform duration-500 group-hover:scale-[1.05]">
                  <ProductRender renderKey={first.imageHint} name={g} compact />
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-display text-[22px] font-bold uppercase group-hover:text-brass-light">{g}</h3>
                  <p className="mt-1 text-[13px] text-muted">
                    {categories.filter((c) => c.group === g).map((c) => c.name).slice(0, 3).join(' · ')}
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-brass/30 text-lg text-brass transition-all group-hover:translate-x-1 group-hover:bg-brass group-hover:text-black" aria-hidden>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
