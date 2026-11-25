import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCatalog } from '../hooks/useCatalog';
import { brand } from '../data/brand';
import { formatINR, setMeta } from '../lib/utils';
import { ProductRender } from '../components/products/ProductRender';
import { overviewImage } from '../data/productMedia';

const MATCHING_NUT: Record<string, string> = {
  'm2-fasteners': 'e04',
  'm3-fasteners': 'e21',
  'm4-fasteners': 'e39',
  'm6-fasteners': 'e53',
  'm8-fasteners': 'e72',
  'ultralow-sockets': 'e39',
};

export function CartPage() {
  const cart = useCart();
  const { getProductById } = useCatalog();

  useEffect(() => {
    setMeta('Cart | WELTOQ', 'Review your selection before cash-on-delivery checkout.');
  }, []);

  if (cart.lines.length === 0) {
    return (
      <main className="shell max-w-xl pb-20 pt-32 text-center">
        <p className="eyebrow">Cart · empty</p>
        <h1 className="display-section mt-3">Your cart is empty.</h1>
        <p className="mt-3 text-muted">Add fasteners from the catalog — they persist in this browser until you place an order. Every line starts at its SKU minimum.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">Browse products</Link>
      </main>
    );
  }

  const hasQuoteOnly = cart.lines.some((line) => {
    const product = getProductById(line.productId);
    return !product || product.price === null;
  });

  const screwLine = cart.lines.find((line) => {
    const product = getProductById(line.productId);
    return product?.category && MATCHING_NUT[product.category];
  });
  const screwProduct = screwLine ? getProductById(screwLine.productId) : undefined;
  const nutId = screwProduct ? MATCHING_NUT[screwProduct.category] : '';
  const nut = getProductById(nutId);
  const nutInCart = nut ? cart.lines.some((l) => l.productId === nut.id) : false;

  return (
    <main className="studio-bg shell max-w-4xl pb-20 pt-28">
      <p className="eyebrow">Cart · {cart.count} pcs · MOQ enforced</p>
      <h1 className="display-section mt-3">Review your <span className="serif-accent brass-text">selection.</span></h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted">
        Quantities snap to each product's MOQ. Material, grade and finish are confirmed on your order
        follow-up or quote.
      </p>
      <div className="mt-8 space-y-4">
        {cart.lines.map((line) => {
          const product = getProductById(line.productId);
          if (!product) return null;
          const step = product.moq;
          return (
            <article key={`${line.productId}-${line.variant}`} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="w-full overflow-hidden rounded-lg sm:w-40">
                <ProductRender renderKey={overviewImage(product)} name={product.name} compact />
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/products/${product.slug}`} className="block break-words font-display text-[18px] font-bold hover:underline">{product.name}</Link>
                <p className="break-words text-[12px] text-muted">SKU {product.sku} · {line.variant}</p>
                <p className="mt-1 text-[14px] font-semibold">{formatINR(line.unitPrice, brand.currency)} each</p>
                <p className="text-[12px] text-muted">MOQ {step} pcs · line total <strong className="text-paper">{formatINR((line.unitPrice ?? 0) * line.qty, brand.currency)}</strong></p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cart.setQty(line.productId, line.variant, line.qty - step)}
                  disabled={line.qty <= step}
                  className="min-h-[44px] min-w-[44px] rounded-md border hairline px-3 py-1.5 disabled:opacity-40"
                  aria-label={`Decrease by ${step}`}
                >
                  −
                </button>
                <span className="w-14 text-center font-bold" aria-live="polite">{line.qty}</span>
                <button type="button" onClick={() => cart.setQty(line.productId, line.variant, line.qty + step)} className="min-h-[44px] min-w-[44px] rounded-md border hairline px-3 py-1.5" aria-label={`Increase by ${step}`}>+</button>
              </div>
              <button type="button" onClick={() => cart.remove(line.productId, line.variant)} className="grid min-h-[44px] place-items-center self-start px-3 py-2 text-[13px] text-red-400 hover:underline sm:self-center">Remove</button>
            </article>
          );
        })}
      </div>

      {nut && !nutInCart && (
        <div className="card-premium mt-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border hairline bg-white">
            <ProductRender renderKey={overviewImage(nut)} name={nut.name} compact fit />
          </div>
          <div className="min-w-0 flex-1">
            <p className="eyebrow !text-[10px]">Complete the joint</p>
            <p className="mt-1 font-display text-lg font-bold">{nut.name}</p>
            <p className="mt-1 text-[13px] text-muted">{formatINR(nut.price, nut.currency)} each · MOQ {nut.moq} pcs</p>
          </div>
          <button
            type="button"
            onClick={() => cart.add(nut.id, nut.availableSizes[0] ?? 'Standard', nut.moq)}
            className="btn-ghost min-h-[44px] !px-4 !py-2 !text-[12px]"
          >
            Add matching nut
          </button>
        </div>
      )}

      <div className="card mt-6 flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Subtotal · {cart.count} pcs</p>
          <p className="font-display text-3xl font-bold">{formatINR(cart.subtotal, brand.currency)}</p>
          <p className="mt-1 text-[12px] text-muted">Shipping and tax are not charged. Final amount is payable in cash on delivery.</p>
        </div>
        <div className="flex flex-col gap-2">
          {hasQuoteOnly ? (
            <Link to="/quote" className="btn-primary text-center">Some items are quote-only — request a quote →</Link>
          ) : (
            <Link to="/checkout" className="btn-primary text-center">Continue to checkout · COD →</Link>
          )}
          <button type="button" className="btn-ghost" onClick={cart.clear}>Clear cart</button>
        </div>
      </div>
    </main>
  );
}
