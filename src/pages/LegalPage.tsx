import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { setMeta } from '../lib/utils';

const DOCS: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy (Editable Placeholder)',
    body: [
      '[EDITABLE PLACEHOLDER — have counsel review before launch.] This demo collects form inputs locally in the visitor’s browser (cart, quote drafts). No analytics, tracking, or server storage is wired in this build.',
      'When you connect a backend, document here: data controller, purposes, lawful basis, retention, recipients (email/CRM/logistics), international transfers, and data-subject rights with a contact route.',
      'Contact placeholder for privacy requests: [not provided — edit src/data/brand.ts].',
    ],
  },
  terms: {
    title: 'Terms & Conditions (Editable Placeholder)',
    body: [
      '[EDITABLE PLACEHOLDER — have counsel review.] All products, prices, and availability shown are sample data for demonstration. No offer, acceptance, or contract is formed by using the demo cart or quote form.',
      'Add your real terms here: ordering, quotations validity, pricing, taxes, delivery, inspection/returns, liability limits, governing law, and dispute resolution.',
    ],
  },
  shipping: {
    title: 'Shipping Policy (Editable Placeholder)',
    body: [
      '[EDITABLE PLACEHOLDER.] No shipping is configured in this demo build. State here when you go live: zones served, carriers, lead times, freight vs courier thresholds, packing, and who bears transit risk.',
    ],
  },
  returns: {
    title: 'Return & Refund Policy (Editable Placeholder)',
    body: [
      '[EDITABLE PLACEHOLDER.] Demo only — no orders exist to return. Publish real policy before launch: eligibility window, condition requirements, restocking, refund method/timeline, and who pays return freight.',
    ],
  },
};

export function LegalPage() {
  const { doc = 'privacy' } = useParams();
  const entry = DOCS[doc];

  useEffect(() => {
    // Unknown slugs render NotFound below; keep the tab honest in that case.
    // Placeholder qualifiers stay in-body only — never leak into SERP titles.
    const title = entry ? entry.title.replace(' (Editable Placeholder)', '') : 'Page not found';
    setMeta(`${title} | Fasteners`, 'Editable legal placeholder.');
  }, [entry]);

  // Unknown /legal/:doc is a 404, not a silent Privacy page.
  if (!entry) return <NotFoundPage />;

  return (
    <main className="shell max-w-3xl pb-20 pt-28">
      <p className="eyebrow">Legal · placeholder — replace before launch</p>
      <h1 className="display-section mt-3 text-balance">{entry.title}</h1>
      <div className="card mt-8 space-y-4 p-6 md:p-8">
        {entry.body.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-muted">{p}</p>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {Object.keys(DOCS).map((k) => (
          <Link key={k} to={`/legal/${k}`} className="inline-flex min-h-[44px] items-center rounded-full border hairline px-4 py-2 text-[13px] text-muted hover:text-paper">
            {DOCS[k].title.split(' (')[0]}
          </Link>
        ))}
      </div>
    </main>
  );
}

export function NotFoundPage() {
  useEffect(() => {
    setMeta('404 — Page not found | Fasteners', 'Invalid route.');
  }, []);
  return (
    <main className="shell pb-20 pt-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display-section mt-3">That connection doesn’t exist.</h1>
      <p className="mt-3 text-muted">The page moved or was never torqued down.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/" className="btn-primary">Home</Link>
        <Link to="/products" className="btn-ghost">Catalog</Link>
      </div>
    </main>
  );
}
