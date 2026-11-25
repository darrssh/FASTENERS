import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCatalog } from '../hooks/useCatalog';
import { formatINR, setMeta } from '../lib/utils';
import { resolveMedia } from '../lib/api';
import { ProductRender } from '../components/products/ProductRender';
import { Product3DViewer } from '../components/products/Product3DViewer';
import { ProductCard } from '../components/products/ProductCard';
import { useCart } from '../hooks/useCart';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { useIsMobile, useReducedMotion } from '../hooks/useMediaQuery';
import { fullPageImage, overviewImage, productRenders } from '../data/productMedia';

const MATCHING_NUT: Record<string, string> = {
  'm2-fasteners': 'e04',
  'm3-fasteners': 'e21',
  'm4-fasteners': 'e39',
  'm6-fasteners': 'e53',
  'm8-fasteners': 'e72',
  'ultralow-sockets': 'e39',
};

export function ProductDetailPage() {
  const { slug } = useParams();
  const { getProductBySlug, getProductById, products } = useCatalog();
  const product = slug ? getProductBySlug(slug) : undefined;
  const cart = useCart();
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [variant, setVariant] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!product) return;
    setVariant(product.availableSizes[0] ?? 'Standard');
    setQty(product.moq);
    setAdded(false);
    setMeta(`${product.name} — ${product.sku} | WELTOQ`, product.seoDescription);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    if (addedTimer.current) window.clearTimeout(addedTimer.current);
  }, []);

  if (!product) {
    return (
      <main className="shell pb-20 pt-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-section mt-3">Product not found.</h1>
        <p className="mt-3 text-muted">That code is not in the current {products.length}-SKU catalogue.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">Back to catalog</Link>
      </main>
    );
  }

  const nut = getProductById(MATCHING_NUT[product.category] ?? '');
  const related = product.related.map((id) => getProductById(id)).filter(Boolean);
  const renders = productRenders(product);
  const total = product.price !== null ? formatINR(product.price * qty, product.currency) : 'On request';
  const step = (direction: -1 | 1) => setQty((current) => Math.max(product.moq, current + direction * product.moq));

  const addToCart = () => {
    cart.add(product.id, variant || 'Standard', qty);
    setAdded(true);
    if (addedTimer.current) window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 2500);
  };

  return (
    <main className="studio-bg shell pb-20 pt-28">
      <nav className="flex flex-wrap items-center gap-x-2 text-[13px] text-muted" aria-label="Breadcrumb">
        <Link to="/" className="inline-flex min-h-[44px] min-w-[44px] items-center hover:text-brass-light">Home</Link>
        <span aria-hidden className="text-muted-dim">/</span>
        <Link to="/products" className="inline-flex min-h-[44px] min-w-[44px] items-center hover:text-brass-light">Products</Link>
        <span aria-hidden className="text-muted-dim">/</span>
        <span aria-current="page" className="min-w-0 break-words py-3 text-paper">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="min-w-0 space-y-4 lg:self-start">
          <div className="card-premium overflow-hidden">
            <ProductRender renderKey={overviewImage(product)} name={product.name} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {renders.map((render) => (
              <div key={render.id} className="card min-w-0 overflow-hidden bg-ink-950">
                <img src={resolveMedia(render.src)} alt={`${product.name} — ${render.label}`} loading="lazy" className="h-24 w-full object-cover sm:h-28 md:h-32" />
                <p className="truncate px-2 py-1.5 text-center text-[11px] uppercase tracking-normal text-muted-dim sm:text-[10px] sm:tracking-[0.16em]" title={render.label}>{render.label}</p>
              </div>
            ))}
          </div>

          <ErrorBoundary>
            <Product3DViewer product={product} reducedMotion={reducedMotion} isMobile={isMobile} />
          </ErrorBoundary>

          <div className="card overflow-hidden">
            <ProductRender renderKey={fullPageImage(product)} name={`${product.name} catalogue page`} compact />
          </div>
          <p className="text-[12px] text-muted-dim">
            Cropped product overview and original catalogue page (p.{String(product.catalogPage ?? '').padStart(2, '0')}) supplied in the
            WELTORQUE technical catalogue. Technical 3D views are generated from the listed dimensions; the interactive model is an
            illustrative finish preview.
          </p>
        </div>

        <div className="min-w-0">
          <p className="eyebrow">Material & finish confirmed on quote · {product.grade === '—' ? 'no grade stated' : product.grade}</p>
          <h1 className="mt-2 break-words font-display text-[clamp(28px,3.5vw,44px)] font-bold leading-tight">{product.name}</h1>
          <p className="mt-2 break-words text-[13px] tracking-[0.14em] text-brass">
            Code {product.sku} · {product.catalogPage ? `CATALOGUE P.${String(product.catalogPage).padStart(2, '0')}` : 'WELTOQ'}
          </p>
          {product.catalogIntro && (
            <p className="mt-4 rounded-lg border border-brass/30 bg-brass/5 p-4 text-[14px] leading-relaxed text-muted">
              {product.catalogIntro}
            </p>
          )}
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{product.fullDescription}</p>

          <dl className="card-premium mt-6 grid grid-cols-1 gap-x-6 gap-y-3 p-5 text-[14px] min-[420px]:grid-cols-2">
            {([
              ['Type', product.fastenerType],
              ['Standard', product.standard],
              ['Diameter', product.diameter],
              ['Length', product.length],
              ['Thread', `${product.threadType} · ${product.threadPitch}`],
              ['MOQ', `${product.moq} pcs`],
              ['Availability', product.stockStatus.replace('-', ' ')],
            ] as Array<[string, string]>).map(([k, v]) => (
              <div key={k} className="flex min-w-0 flex-col">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-muted">{k}</dt>
                <dd className="break-words font-semibold capitalize">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex min-w-0 flex-col gap-4">
            {product.availableSizes.length > 1 && (
              <label className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Size variant</span>
                <select value={variant} onChange={(e) => setVariant(e.target.value)} className="w-full max-w-full rounded-lg border hairline bg-ink-900 px-4 py-3 text-base">
                  {product.availableSizes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            )}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Quantity · in multiples of {product.moq}</span>
              <div className="flex items-stretch gap-2">
                <button type="button" onClick={() => step(-1)} className="btn-ghost !px-4 !py-3" aria-label={`Decrease by ${product.moq}`}>−</button>
                <input
                  type="number"
                  min={product.moq}
                  step={product.moq}
                  value={qty}
                  onChange={(e) => setQty(Math.max(product.moq, Math.round((Number(e.target.value) || product.moq) / product.moq) * product.moq))}
                  className="min-w-0 flex-1 rounded-lg border hairline bg-ink-900 px-4 py-3 text-center text-base"
                  aria-label="Quantity"
                />
                <button type="button" onClick={() => step(1)} className="btn-ghost !px-4 !py-3" aria-label={`Increase by ${product.moq}`}>+</button>
              </div>
            </div>
            <div aria-live="polite">
              <p className="font-display text-3xl font-bold">{formatINR(product.price, product.currency)} <span className="text-base font-medium text-muted">each</span></p>
              <p className="mt-1 text-[14px] text-muted">
                Minimum order: <strong className="text-paper">{product.moq} pcs</strong> · Line total: <strong className="text-paper">{total}</strong>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className="btn-primary flex-1" onClick={addToCart}>
                {added ? '✓ Added to cart' : `Add ${qty} pcs to cart`}
              </button>
              <Link to={`/quote?product=${product.id}&qty=${qty}`} className="btn-ghost flex-1">Bulk quote →</Link>
            </div>
            <p className="rounded-lg border hairline bg-ink-900 p-3 text-[12px] text-muted">
              Cash on delivery only. Your order is received and queued for our team — no online payment is taken here. Material, grade and
              finish are confirmed in the quote or order follow-up.
            </p>
          </div>

          {nut && (
            <div className="card-premium mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <img src={resolveMedia(overviewImage(nut))} alt={`${nut.name} product overview`} className="h-20 w-24 rounded-lg border hairline bg-white object-contain p-2" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="eyebrow !text-[10px]">Complete the joint</p>
                <p className="mt-1 font-display text-lg font-bold">Matching {nut.name}</p>
                <p className="mt-1 text-[13px] text-muted">{formatINR(nut.price, nut.currency)} each · MOQ {nut.moq}</p>
              </div>
              <button
                type="button"
                className="btn-ghost min-h-[44px] !px-4 !py-2 !text-[12px]"
                onClick={() => {
                  cart.add(product.id, variant || 'Standard', qty);
                  cart.add(nut.id, nut.availableSizes[0] ?? 'Standard', nut.moq);
                }}
              >
                Add both to cart
              </button>
            </div>
          )}

          <div className="mt-8 min-w-0">
            <h2 className="font-display text-xl font-bold">Technical specifications</h2>
            <div className="min-w-0 overflow-x-auto">
              <table className="w-full min-w-0 table-fixed text-[14px]">
                <tbody>
                  {product.specs.map((s) => (
                    <tr key={s.label} className="border-b hairline">
                      <th className="w-2/5 break-words py-2.5 pr-3 text-left font-medium text-muted">{s.label}</th>
                      <td className="break-words py-2.5 text-right font-semibold">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {product.applications && product.applications.length > 0 && (
            <div className="mt-8 min-w-0">
              <h2 className="font-display text-xl font-bold">Common applications</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.applications.map((application) => (
                  <li key={application} className="flex gap-2 rounded-lg border hairline bg-ink-900 p-3 text-[14px] text-muted">
                    <span aria-hidden="true" className="text-brass">◆</span>
                    <span>{application}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
