import { useState } from 'react';
import { useReveal } from '../../hooks/useScrollProgress';
import { cx } from '../../lib/utils';

const FAQS = [
  { q: 'Can I order from this site today?', a: 'Yes. Stocked lines are ordered with cash on delivery only. Your order is stored in our backend and the team is notified — no online payment is taken here.' },
  { q: 'Are the prices, MOQs and stock real?', a: 'Yes. The INR prices, MOQ tiers and stock states are the current acting catalogue values. Technical details and images are sourced from the WELTORQUE technical reference — each product shows both a cropped overview and the original catalogue page.' },
  { q: 'How do material, grade and finish get specified?', a: 'We do not assume them from a catalogue image. Tell us what your application needs in the quote form or order notes, and we confirm the exact material, grade and finish with you before supply.' },
  { q: 'Can I order below the MOQ?', a: 'MOQs are set per SKU (100, 200 or 500 pcs) and the quantity controls enforce them. For smaller volumes or custom requirements, send a quote request and we will review it.' },
  { q: 'Can I request bulk or custom fasteners?', a: 'Yes. The quote form collects the product or category, sizes, quantities, drawings, delivery location and dates. The request goes straight to our team.' },
  { q: 'What if my device cannot render 3D?', a: 'The site detects missing WebGL or load failures and swaps in static product views while keeping the catalogue, prices, CTAs and navigation fully usable.' },
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
          <p className="mt-4 max-w-sm text-[14px] text-muted" data-reveal>Pricing, MOQ, specification and delivery — stated plainly.</p>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className={cx('overflow-hidden rounded-2xl border transition-colors duration-300', open === i ? 'card-premium' : 'card')} data-reveal>
              <button
                type="button"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                id={`faq-button-${i}`}
                className="flex min-h-[44px] w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-display text-[17px] font-semibold"><span className="mr-3 text-[12px] tracking-[0.2em] text-brass">0{i + 1}</span>{f.q}</span>
                <span aria-hidden="true" className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brass/30 text-xl text-brass transition-transform duration-300', open === i && 'rotate-45 bg-brass text-black')}>+</span>
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                className={cx('grid transition-all duration-500', open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
              >
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
