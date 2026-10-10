import { useReveal } from '../../hooks/useScrollProgress';

const STATS = [
  { v: '24', l: 'Fastener families', d: 'Hex through custom in one filterable system.' },
  { v: '07', l: 'Live PBR finishes', d: 'Stainless to HDG with real metal response.' },
  { v: '08', l: 'Scroll scenes', d: 'Teardown → exploded → reassembly story.' },
  { v: '3D', l: 'Everywhere it matters', d: 'Hero, journey, materials, detail viewer.' },
];

/** Proof band — replaces invented testimonials with honest capability stats. */
export function Testimonials() {
  const ref = useReveal<HTMLElement>(true);
  return (
    <section ref={ref} className="shell py-24 md:py-32" aria-label="Capability proof">
      <p className="eyebrow" data-reveal>Proof · not promises · 09</p>
      <h2 className="display-section mt-3 max-w-3xl text-balance" data-reveal>Numbers you can <span className="serif-accent brass-text">verify.</span></h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.l} className="card-premium card-hover-lift p-6 text-center" data-reveal data-reveal-clip>
            <p className="brass-text font-display text-5xl font-bold">{s.v}</p>
            <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.18em]">{s.l}</p>
            <p className="mt-2 text-[13px] text-muted">{s.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-[12px] tracking-[0.14em] text-muted-dim" data-reveal>
        CUSTOMER QUOTES APPEAR HERE ONLY AFTER VERIFIED REVIEWS — NO INVENTED TESTIMONIALS.
      </p>
    </section>
  );
}
