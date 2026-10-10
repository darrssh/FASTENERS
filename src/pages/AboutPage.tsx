import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setMeta } from '../lib/utils';

export function AboutPage() {
  useEffect(() => {
    setMeta('About Us (Editable) | Fasteners', 'Brand story placeholders — replace with verified company information.');
  }, []);
  const blocks: Array<[string, string]> = [
    ['Brand introduction', '[EDITABLE PLACEHOLDER] Introduce the business in 2–3 sentences. Do not invent founding years, certifications, or customer names until verified.'],
    ['Company story', '[EDITABLE PLACEHOLDER] How the fastener range was assembled, which supply partners are confirmed, and what “quality approach” concretely means (incoming inspection, batch traceability, test reports — only if true).'],
    ['Product quality approach', '[EDITABLE PLACEHOLDER] Describe only checks you actually perform. Example structure: dimensional sampling, finish verification, paperwork per lot — delete what does not apply.'],
    ['Supply capabilities', '[EDITABLE PLACEHOLDER] Stock range, cut-to-length, kitting, bulk breaks, lead-time policy — only confirmed capabilities.'],
    ['Industries served', '[EDITABLE PLACEHOLDER] List only industries you actually serve today. Each links to Industries page.'],
    ['Company values', '[EDITABLE PLACEHOLDER] Precision, reliability, honest lead times — keep claims provable.'],
  ];
  return (
    <main className="studio-bg shell pb-20 pt-28">
      <p className="eyebrow">About · editable placeholders</p>
      <h1 className="display-section mt-3 max-w-3xl text-balance">An industrial brand, <span className="serif-accent brass-text">told honestly.</span></h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {blocks.map(([t, d]) => (
          <article key={t} className="card p-6">
            <h2 className="font-display text-[22px] font-bold">{t}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{d}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/contact" className="btn-primary">Contact us</Link>
        <Link to="/quote" className="btn-ghost">Request a quote</Link>
      </div>
    </main>
  );
}
