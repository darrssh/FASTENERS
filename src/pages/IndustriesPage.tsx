import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setMeta } from '../lib/utils';

const INDUSTRIES = [
  { name: 'Electronics & Instruments', body: 'M2 / M3 micro fasteners, precision washers and threaded inserts.', link: 'm2-fasteners' },
  { name: 'Manufacturing', body: 'M4 / M6 / M8 SHCS, anchor nuts and washers for machine building and jigs.', link: 'm4-fasteners' },
  { name: 'Panels & Enclosures', body: 'QTF quarter-turn studs, mushroom heads and CSK flush screws for covers.', link: 'qtf-fasteners' },
  { name: 'Motion & Pneumatics', body: 'Articulated bearings, spherical clips and Festo tube convertors.', link: 'bearings' },
  { name: 'Sheet-metal work', body: 'Threaded rivets and blind pop rivets Ø2.3–Ø2.9 for thin sheet.', link: 'pop-rivets' },
  { name: 'Cable & Sealing', body: 'Ø20 rubber grommets for pass-through and edge protection.', link: 'rubber-grommets' },
];

export function IndustriesPage() {
  useEffect(() => {
    setMeta('Industries Served (Editable) | Fasteners', 'Industry routes with honest placeholder copy.');
  }, []);
  return (
    <main className="studio-bg shell pb-20 pt-28">
      <p className="eyebrow">Industries · only claim what you serve</p>
      <h1 className="display-section mt-3 max-w-3xl text-balance">Right fastener. Right joint. <span className="serif-accent brass-text">Right industry.</span></h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {INDUSTRIES.map((i) => (
          <article key={i.name} className="card flex flex-col p-6">
            <h2 className="font-display text-[24px] font-bold">{i.name}</h2>
            <p className="mt-2 flex-1 text-[14px] text-muted">{i.body}</p>
            <Link to={`/products?category=${i.link}`} className="btn-ghost mt-5">Shop relevant fasteners →</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
