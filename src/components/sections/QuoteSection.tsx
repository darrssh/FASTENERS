import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useScrollProgress';

export function QuoteSection() {
  const ref = useReveal<HTMLElement>(true);
  return (
    <section ref={ref} className="relative overflow-hidden border-t hairline bg-ink-900" aria-label="Bulk orders and custom fasteners">
      <div className="pointer-events-none absolute -right-16 bottom-0 select-none font-display text-[18vw] font-bold leading-none text-white/[0.025]" aria-hidden data-parallax="30">
        QUOTE
      </div>
      <div className="shell grid gap-10 py-24 md:grid-cols-2 md:py-32">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow" data-reveal>B2B · Bulk & custom · 08</p>
          <h2 className="display-section mt-3 text-balance" data-reveal>Your requirements. <span className="serif-accent brass-text">Our solutions.</span></h2>
          <p className="mt-4 max-w-lg text-[15px] text-muted" data-reveal>
            Find the right fasteners for your project or request a quotation for bulk and custom requirements.
            Drawings, quantities, materials, and delivery in one structured form — demo submission, no backend yet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3" data-reveal>
            <Link to="/quote" className="btn-primary">Request a quote</Link>
            <Link to="/products" className="btn-ghost">Browse stock first</Link>
          </div>
        </div>
        <ol className="relative space-y-3" data-reveal>
          <span className="absolute bottom-4 left-[27px] top-4 w-px bg-gradient-to-b from-brass via-brass/25 to-transparent" aria-hidden />
          {['Pick products or describe from scratch', 'Add materials, sizes, quantities', 'Attach drawings / specs (demo validation)', 'Get a structured summary to send when backend connects'].map((s, i) => (
            <li key={s} className="card card-hover-lift relative flex items-center gap-4 p-5">
              <span className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brass-light to-brass-dark font-display text-sm font-bold text-black">{i + 1}</span>
              <p className="text-[15px] font-medium">{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
