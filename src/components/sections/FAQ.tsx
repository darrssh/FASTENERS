import { useState } from 'react';
import { useReveal } from '../../hooks/useScrollProgress';
import { cx } from '../../lib/utils';

const FAQS = [
  { q: 'Is this a live store I can buy from today?', a: 'No — this build is a demo storefront. Cart and quote submissions run locally in your browser. Connect a backend (Shopify / custom API) per SETUP.md before accepting orders.' },
  { q: 'Are the listed prices and stock real?', a: 'Prices are indicative real-world INR unit prices for the 46 Excel items — confirm with us before ordering. Photos are the exact Excel reference images.' },
  { q: 'Can I request bulk or custom fasteners?', a: 'Yes — the Quote page collects category, sizes, materials, quantities, delivery, and drawings. Submission is currently simulated; wire it to email/CRM when ready.' },
  { q: 'What if my device cannot render 3D?', a: 'The site detects missing WebGL or load failures and swaps in a static render while keeping headlines, CTAs, catalog, and navigation fully usable.' },
  { q: 'How do I replace the brand, contact, and legal text?', a: 'Edit src/data/brand.ts for identity/contact, src/data/products.ts for catalog, and the legal pages under src/pages/LegalPage. All placeholders are labeled.' },
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  const ref = useReveal<HTMLElement>(true);
  return (
    <section ref={ref} className="border-t hairline bg-ink-900" aria-label="Frequently asked questions">
      <div className="shell grid gap-10 py-24 md:grid-cols-[1fr_1.4fr] md:py-32">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow" data-reveal>FAQ · 10</p>
          <h2 className="display-section mt-3 text-balance" data-reveal>Straight <span className="serif-accent brass-text">answers.</span></h2>
          <p className="mt-4 max-w-sm text-[14px] text-muted" data-reveal>No sales talk. Demo limits stated plainly.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className={cx('overflow-hidden rounded-2xl border transition-colors duration-300', open === i ? 'card-premium' : 'card')} data-reveal>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-display text-[17px] font-semibold"><span className="mr-3 text-[12px] tracking-[0.2em] text-brass">0{i + 1}</span>{f.q}</span>
                <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brass/30 text-xl text-brass transition-transform duration-300', open === i && 'rotate-45 bg-brass text-black')}>+</span>
              </button>
              <div className={cx('grid transition-all duration-500', open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-[14px] leading-relaxed text-muted">{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
