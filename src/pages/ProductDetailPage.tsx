import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productBySlug, products } from '../data/products';
import { formatINR, setMeta } from '../lib/utils';
import { ProductRender } from '../components/products/ProductRender';
import { ProductViewer } from '../components/products/ProductViewer';
import { ProductCard } from '../components/products/ProductCard';
import { useCart } from '../hooks/useCart';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { brand } from '../data/brand';

const FINISH_TO_MATERIAL: Record<string, string> = {
  'Zinc-Plated': 'zinc',
  'Black Oxide': 'black-oxide',
  Brass: 'brass',
  Plain: 'stainless',
  'Hot-Dip Galvanized': 'hdg',
};

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = slug ? productBySlug(slug) : undefined;
  const cart = useCart();
  const [variant, setVariant] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setVariant(product.availableSizes[0]);
      setQty(product.moq);
      setAdded(false);
      setMeta(`${product.name} — ${product.sku} | Fasteners`, product.seoDescription);
      window.scrollTo(0, 0);
    }
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) {
    return (
      <main className="shell pb-20 pt-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-section mt-3">Product not found.</h1>
        <p className="mt-3 text-muted">That slug does not match any of the {products.length} catalog products.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">Back to catalog</Link>
      </main>
    );
  }

  const related = product.related.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  const finishId = FINISH_TO_MATERIAL[product.finish] ?? (product.material === 'Brass' ? 'brass' : product.material === 'Stainless Steel' ? 'stainless' : 'zinc');

  return (
    <main className="studio-bg shell pb-20 pt-28">
      <nav className="text-[13px] text-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brass-light">Home</Link> / <Link to="/products" className="hover:text-brass-light">Products</Link> / <span className="text-paper">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-premium overflow-hidden">
            <ProductRender renderKey={product.images[0]} name={product.name} />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {product.images.slice(1).map((src) => (
                <div key={src} className="card-premium overflow-hidden">
                  <ProductRender renderKey={src} name={product.name} />
                </div>
              ))}
            </div>
          )}
          <ErrorBoundary>
            <ProductViewer finishId={finishId} />
          </ErrorBoundary>
          <p className="text-[12px] text-muted-dim">Photos are the Excel reference images. 3D viewer shows finish preview only.</p>
        </div>

        <div>
          <p className="eyebrow">{product.material} · {product.grade}</p>
          <h1 className="mt-2 font-display text-[clamp(28px,3.5vw,44px)] font-bold leading-tight">{product.name}</h1>
          <p className="mt-2 text-[13px] tracking-[0.14em] text-brass">SKU {product.sku} · EXCEL CATALOG</p>
          <p className="mt-4 text-[15px] text-muted">{product.fullDescription}</p>

          <dl className="card-premium mt-6 grid grid-cols-2 gap-x-6 gap-y-3 p-5 text-[14px]">
            {[['Material', product.material], ['Grade', product.grade], ['Diameter', product.diameter], ['Length', product.length], ['Thread', product.threadType], ['Pitch', product.threadPitch], ['Finish', product.finish], ['MOQ', `${product.moq} pcs`]].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Size variant</span>
              <select value={variant} onChange={(e) => setVariant(e.target.value)} className="rounded-lg border hairline bg-ink-900 px-4 py-3 text-[15px]">
                {product.availableSizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Quantity (MOQ {product.moq})</span>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="rounded-lg border hairline bg-ink-900 px-4 py-3 text-[15px]"
              />
            </label>
            <p className="font-display text-3xl font-bold" aria-live="polite">{formatINR(product.price, product.currency)}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {product.price !== null ? (
                <button
                  className="btn-primary flex-1"
                  onClick={() => {
                    cart.add(product.id, variant, qty);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 2500);
                  }}
                >
                  {added ? '✓ Added to cart (demo)' : 'Add to cart — demo'}
                </button>
              ) : (
                <Link to={`/quote?product=${product.id}`} className="btn-primary flex-1">Request a quote</Link>
              )}
              <Link to="/quote" className="btn-ghost flex-1">Bulk quote →</Link>
            </div>
            <p className="rounded-lg border hairline bg-ink-900 p-3 text-[12px] text-muted">
              Demo commerce ({brand.commerceMode}): cart persists in this browser only. No payment, no backend — see SETUP.md to connect Shopify/custom.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-xl font-bold">Technical specifications</h2>
            <table className="mt-3 w-full text-[14px]">
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.label} className="border-b hairline">
                    <th className="py-2.5 pr-4 text-left font-medium text-muted">{s.label}</th>
                    <td className="py-2.5 text-right font-semibold">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16" aria-label="Related products">
          <h2 className="font-display text-2xl font-bold uppercase">Related fasteners</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((p) => p && <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
