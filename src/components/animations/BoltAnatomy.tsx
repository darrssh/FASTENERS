import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useScrollProgress';

/** Exploded anatomy companion to the 3D journey — sticky timeline, scroll-linked. */
export function BoltAnatomy() {
  const ref = useReveal<HTMLElement>(true);
  const rows = [
    { part: 'BOLT', spec: 'Hex head · beveled edges · rolled thread', note: 'Carries clamp load; thread form decides fit and fatigue behavior (sample note).' },
    { part: 'NUT', spec: 'Chamfered hex · matched pitch', note: 'Rotation × pitch = axial travel. Match grade to bolt — never mix unknown grades.' },
    { part: 'WASHER', spec: 'Flat · controlled OD/ID', note: 'Spreads bearing stress and protects the clamped surface.' },
  ];
  return (
    <section ref={ref} className="relative overflow-hidden border-t hairline" aria-label="Exploded product anatomy">
      <div className="pointer-events-none absolute -right-20 top-10 select-none font-display text-[22vw] font-bold leading-none text-white/[0.02]" aria-hidden data-parallax="-40">
        03
      </div>
      <div className="shell grid gap-10 py-24 md:grid-cols-[1fr_1.2fr] md:py-32">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="eyebrow" data-reveal>Anatomy · scroll story 01</p>
          <h2 className="display-section mt-3 text-balance" data-reveal>Precision in <span className="serif-accent brass-text">every component.</span></h2>
          <p className="mt-4 text-[15px] text-muted" data-reveal>
            The scroll scene above separates these live. Below is the same information as plain text —
            fully usable with 3D disabled, keyboards, and screen readers.
          </p>
          <Link to="/products" className="btn-primary mt-6 inline-flex" data-reveal>Shop the assembly →</Link>
          <div className="mt-8 hidden items-center gap-3 md:flex" data-reveal aria-hidden>
            <span className="h-px w-12 bg-brass/60" />
            <span className="text-[11px] tracking-[0.24em] text-muted">SCROLL TO EXPLODE</span>
          </div>
        </div>
        <ol className="space-y-4">
          {rows.map((r, i) => (
            <li key={r.part} className="card card-hover-lift group flex gap-5 p-6" data-reveal data-reveal-clip>
              <span className="font-display text-4xl font-bold text-brass/40 transition-colors group-hover:text-brass" aria-hidden>0{i + 1}</span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.24em] text-brass">{r.part}</p>
                <h3 className="mt-1 font-display text-xl font-bold">{r.spec}</h3>
                <p className="mt-2 text-[14px] text-muted">{r.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
