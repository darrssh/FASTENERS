import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useScrollProgress';

const POINTS = [
  { t: 'Wide, data-driven range', d: 'M2–M8 SHCS, nuts, washers, CSK, QTF, bearings, rivets and grommets in one filterable catalog — all 46 Excel items.' },
  { t: 'Application-led navigation', d: 'Electronics, machinery, panels, motion and sheet-metal routes each land on the right family.' },
  { t: 'Bulk & custom workflow', d: 'Quantity, drawings, delivery location and requirements flow into one structured quote request (demo).' },
  { t: 'Honest commerce states', d: 'Indicative INR prices, MOQs and stock clearly shown; quote-only items flagged, demo checkout never pretends to charge.' },
];

export function WhyChooseUs() {
  const ref = useReveal<HTMLElement>(true);
  return (
    <section ref={ref} className="shell relative py-24 md:py-32" aria-label="Why choose us">
      <p className="eyebrow" data-reveal>Why this catalog · 06</p>
      <h2 className="display-section mt-3 max-w-3xl text-balance" data-reveal>Built for buyers, <span className="serif-accent brass-text">not browsers.</span></h2>
      <p className="mt-4 max-w-2xl text-[15px] text-muted" data-reveal>
        Capability statements only — no invented certifications, customer counts, or delivery guarantees.
        Replace these placeholders with verified business strengths before launch.
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
        <Link to="/about" className="btn-ghost">Our approach →</Link>
        <Link to="/quote" className="btn-primary">Start a bulk quote</Link>
      </div>
    </section>
  );
}
