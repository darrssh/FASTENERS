import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setMeta } from '../lib/utils';

const INDUSTRIES = [
  { name: 'Electronics & Instruments', body: 'M2 / M3 socket head cap screws and hex nuts for compact assemblies.', link: 'm2-fasteners' },
  { name: 'Manufacturing', body: 'M4 / M6 / M8 SHCS and standard hex nuts for machine building and jigs.', link: 'm4-fasteners' },
  { name: 'Precision engineering', body: 'M3 / M4 SHCS with exact ISO 4762 / DIN 912 dimensions from the catalogue.', link: 'm3-fasteners' },
  { name: 'Machine frames', body: 'M6 / M8 socket head cap screws and matching nuts for structural joints.', link: 'm6-fasteners' },
  { name: 'Standard fastening', body: 'Standard hex nuts M2–M8 matched to the WELTOQ screw range.', link: 'm8-fasteners' },
  { name: 'Low-profile joints', body: 'Ultraflat head fasteners M4 × 10–25 mm where reduced head projection matters.', link: 'ultralow-sockets' },
];

export function IndustriesPage() {
  useEffect(() => {
    setMeta('Applications | WELTOQ', 'Find the right M2–M8 fastener for electronics, manufacturing, machine frames and low-profile joints.');
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
