import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useScrollProgress';

const APPS = [
  { name: 'Precision electronics', desc: 'M2 / M3 SHCS and hex nuts for instruments and enclosures.', link: 'm2-fasteners', grad: 'linear-gradient(135deg,#2b2417,#101214)', icon: '⌖' },
  { name: 'Industrial machinery', desc: 'M4 / M6 / M8 SHCS and hex nuts for frames and fixtures.', link: 'm4-fasteners', grad: 'linear-gradient(135deg,#2a2f26,#14171b)', icon: '⚙' },
  { name: 'Compact assemblies', desc: 'M2–M4 socket head cap screws where space is limited.', link: 'm3-fasteners', grad: 'linear-gradient(135deg,#1d2530,#0e1114)', icon: '◈' },
  { name: 'Machine frames', desc: 'M6 / M8 socket head cap screws and matching hex nuts.', link: 'm8-fasteners', grad: 'linear-gradient(135deg,#262d34,#101214)', icon: '⬢' },
  { name: 'Standard fastening', desc: 'Standard hex nuts M2–M8 matched to the catalogue screws.', link: 'm6-fasteners', grad: 'linear-gradient(135deg,#2a2118,#121518)', icon: '⬣' },
  { name: 'Low-profile joints', desc: 'Ultraflat head fasteners M4 × 10–25 mm for tight clearances.', link: 'ultralow-sockets', grad: 'linear-gradient(135deg,#2b2f26,#131412)', icon: '⬔' },
];

export function IndustriesSection() {
  const ref = useReveal<HTMLElement>(true);
  return (
    <section ref={ref} className="shell relative py-24 md:py-32" aria-label="Industry applications">
      <p className="eyebrow" data-reveal>Applications · 05</p>
      <h2 className="display-section mt-3 max-w-3xl text-balance" data-reveal>Pick the joint. <span className="serif-accent brass-text">We'll show the fastener.</span></h2>
      <p className="mt-4 max-w-2xl text-[15px] text-muted" data-reveal>
        Six everyday assembly situations, each mapped to the exact M2–M8 family that fits it. Every card
        opens priced, stocked listings with MOQ tiers. Confirm material, grade and finish on your quote —
        never specify safety-critical joints from marketing copy.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {APPS.map((a, i) => (
          <Link key={a.name} to={`/products?category=${a.link}`} className="card card-hover-lift group overflow-hidden" data-reveal data-reveal-clip aria-label={`${a.name} products`}>
            <div className="relative flex h-44 items-end overflow-hidden p-5" style={{ background: a.grad }} aria-hidden>
              <span className="absolute right-4 top-3 font-display text-5xl text-brass/25 transition-all duration-500 group-hover:scale-110 group-hover:text-brass/50" data-parallax={i % 2 ? '10' : '-10'}>{a.icon}</span>
              <svg width="100%" height="90" viewBox="0 0 300 90" aria-hidden className="transition-transform duration-500 group-hover:scale-[1.04]">
                <g stroke="#3d454e" strokeWidth="3">
                  <line x1="10" y1="70" x2="290" y2="70" />
                  <line x1="40" y1="70" x2="70" y2="20" />
                  <line x1="260" y1="70" x2="230" y2="20" />
                  <line x1="70" y1="20" x2="230" y2="20" />
                </g>
                <circle cx="150" cy="45" r="10" fill="none" stroke="#C9A86A" strokeWidth="4" />
              </svg>
              <span className="absolute bottom-3 left-5 rounded-full border border-brass/30 bg-black/50 px-2.5 py-1 text-[10px] tracking-[0.2em] text-brass-light">0{i + 1}</span>
            </div>
            <div className="flex items-center justify-between p-5">
              <div>
                <h3 className="font-display text-[19px] font-bold group-hover:text-brass-light">{a.name}</h3>
                <p className="mt-1 text-[13px] text-muted">{a.desc}</p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brass/30 text-brass transition-all group-hover:translate-x-1 group-hover:bg-brass group-hover:text-black" aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
