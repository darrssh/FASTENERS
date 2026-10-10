import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open ]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    return products
      .filter((p) =>
        [p.name, p.sku, p.category, p.material, p.finish, ...(p.keywords ?? [])].join(' ').toLowerCase().includes(needle),
      )
      .slice(0, 8);
  }, [q]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Product search">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="shell relative pt-24">
        <div className="card-premium mx-auto max-w-2xl bg-ink-900/95 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Search the catalog</p>
            <button onClick={onClose} className="rounded-md border hairline px-3 py-1 text-sm" autoFocus>Close</button>
          </div>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try “M4”, “SHCS”, “QTF”, “rivet”, SKU…"
            aria-label="Search products by name, SKU, category, or material"
            className="mt-4 w-full rounded-lg border hairline bg-ink-950 px-4 py-3.5 text-[16px] text-paper placeholder:text-muted-dim focus:border-accent focus:outline-none"
          />
          <div className="mt-4 max-h-[40vh] overflow-auto">
            {q.trim().length >= 2 && results.length === 0 && (
              <p className="py-4 text-center text-[14px] text-muted">No matches for “{q}”. Try a SKU or material.</p>
            )}
            {results.map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} onClick={onClose} className="flex items-center justify-between gap-4 border-b hairline py-3 hover:bg-white/[0.02]">
                <span>
                  <span className="block text-[15px] font-semibold">{p.name}</span>
                  <span className="block text-[12px] text-muted">{p.sku} · {p.material}</span>
                </span>
                <span className="text-accent">→</span>
              </Link>
            ))}
          </div>
          <Link to={`/products?query=${encodeURIComponent(q)}`} onClick={onClose} className="btn-ghost mt-4 w-full">
            See all results in catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
