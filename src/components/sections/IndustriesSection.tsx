import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useScrollProgress';

const APPS = [
  { name: 'Precision electronics', desc: 'M2 / M3 micro fasteners for instruments and enclosures.', link: 'm2-fasteners', grad: 'linear-gradient(135deg,#2b2417,#101214)', icon: '⌖' },
  { name: 'Industrial machinery', desc: 'M4 / M6 / M8 SHCS, anchor nuts and washers for frames.', link: 'm4-fasteners', grad: 'linear-gradient(135deg,#2a2f26,#14171b)', icon: '⚙' },
  { name: 'Access panels & covers', desc: 'QTF quarter-turn studs, receptacles and mushroom heads.', link: 'qtf-fasteners', grad: 'linear-gradient(135deg,#1d2530,#0e1114)', icon: '◈' },
  { name: 'Motion & pneumatics', desc: 'Articulated bearings, spherical clips and Festo convertors.', link: 'bearings', grad: 'linear-gradient(135deg,#262d34,#101214)', icon: '⬢' },
  { name: 'Sheet-metal assembly', desc: 'Threaded rivets and blind pop rivets Ø2.3–Ø2.9.', link: 'pop-rivets', grad: 'linear-gradient(135deg,#2a2118,#121518)', icon: '⬣' },
  { name: 'Cable & sealing', desc: 'Ø20 rubber grommets for pass-through and edge protection.', link: 'rubber-grommets', grad: 'linear-gradient(135deg,#2b2f26,#131412)', icon: '⬔' },
];

export function IndustriesSection() {
  const ref = useReveal<HTMLElement>(true);
  return (
    <section ref={ref} className="shell relative py-24 md:py-32" aria-label="Industry applications">
      <p className="eyebrow" data-reveal>Applications · 05</p>
      <h2 className="display-section mt-3 max-w-3xl text-balance" data-reveal>Engineered for <span className="serif-accent brass-text">real-world</span> applications.</h2>
      <p className="mt-4 max-w-2xl text-[15px] text-muted" data-reveal>
        Representative scenes rendered in-brand (no unrelated stock). Each card routes to the relevant
        fastener family. Never specify safety-critical joints from marketing copy — confirm approvals.
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
