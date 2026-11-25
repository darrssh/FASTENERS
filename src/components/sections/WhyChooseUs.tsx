import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useScrollProgress';
import { useCatalog } from '../../hooks/useCatalog';

export function WhyChooseUs() {
  const ref = useReveal<HTMLElement>(true);
  const { products } = useCatalog();

  const POINTS = [
    { t: 'One indexed catalogue', d: `All ${products.length} products — socket head cap screws, hex nuts and ultraflat heads — with the exact technical spec table on every page.` },
    { t: 'Commercial data up front', d: 'INR prices, MOQ tiers and live stock states sit next to the specs. Pick a quantity that works and see the line total before you commit.' },
    { t: 'Specification on your terms', d: 'Material, grade and finish are confirmed on the quote, against your application — never assumed from a catalogue image.' },
    { t: 'Two ways to buy', d: 'Cash-on-delivery for stocked lines, or a drawing-led bulk quote for custom requirements. Both go straight to our team.' },
  ];

  return (
    <section ref={ref} className="shell relative py-24 md:py-32" aria-label="Why choose us">
      <p className="eyebrow" data-reveal>Why buy from WELTOQ · 06</p>
      <h2 className="display-section mt-3 max-w-3xl text-balance" data-reveal>Everything you need to <span className="serif-accent brass-text">place the order.</span></h2>
      <p className="mt-4 max-w-2xl text-[15px] text-muted" data-reveal>
        No hidden pricing, no invented credentials. Just a focused fastener range, the data to specify it,
        and a clear path from product page to purchase order.
      </p>
      <div className="relative mt-10 grid gap-5 md:grid-cols-2">
        <span className="absolute bottom-0 left-4 top-0 hidden w-px bg-gradient-to-b from-brass via-brass/30 to-transparent md:block" aria-hidden />
        {POINTS.map((p, i) => (
          <div key={p.t} className="card card-hover-lift relative p-6 md:ml-8" data-reveal>
            <span className="absolute -left-8 top-6 hidden h-3 w-3 rounded-full border-2 border-brass bg-ink-950 md:block" aria-hidden />
            <p className="text-[12px] font-bold tracking-[0.22em] text-brass">0{i + 1}</p>
            <h3 className="mt-2 font-display text-[22px] font-bold">{p.t}</h3>
            <p className="mt-2 text-[14px] text-muted">{p.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3" data-reveal>
        <Link to="/products" className="btn-ghost">Browse the catalogue →</Link>
        <Link to="/quote" className="btn-primary">Start a bulk quote</Link>
      </div>
    </section>
  );
}
