import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { productById } from '../data/products';
import { brand } from '../data/brand';
import { formatINR, setMeta } from '../lib/utils';
import { ProductRender } from '../components/products/ProductRender';

export function CartPage() {
  const cart = useCart();

  useEffect(() => {
    setMeta('Cart | WELTOQ', 'Review your selection before cash-on-delivery checkout.');
  }, []);

  if (cart.lines.length === 0) {
    return (
      <main className="shell max-w-xl pb-20 pt-32 text-center">
        <p className="eyebrow">Cart · empty</p>
        <h1 className="display-section mt-3">Your cart is empty.</h1>
        <p className="mt-3 text-muted">Add fasteners from the catalog — they persist in this browser until you place an order.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">Browse products</Link>
      </main>
    );
  }

  const hasQuoteOnly = cart.lines.some((line) => {
    const product = productById(line.productId);
    return !product || product.price === null;
  });

  return (
    <main className="studio-bg shell max-w-4xl pb-20 pt-28">
      <p className="eyebrow">Cart · {cart.count} items</p>
      <h1 className="display-section mt-3">Review your <span className="serif-accent brass-text">selection.</span></h1>
      <div className="mt-8 space-y-4">
        {cart.lines.map((line) => {
          const product = productById(line.productId);
          if (!product) return null;
          return (
            <article key={`${line.productId}-${line.variant}`} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="w-full overflow-hidden rounded-lg sm:w-40">
                <ProductRender renderKey={product.images[0]} name={product.name} compact />
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/products/${product.slug}`} className="font-display text-[18px] font-bold hover:underline">{product.name}</Link>
                <p className="text-[12px] text-muted">SKU {product.sku} · Variant {line.variant}</p>
                <p className="mt-1 text-[14px] font-semibold">{formatINR(line.unitPrice, brand.currency)} each</p>
                <p className="text-[12px] text-muted">MOQ {product.moq} pcs</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => cart.setQty(line.productId, line.variant, line.qty - 1)} className="min-h-[44px] min-w-[44px] rounded-md border hairline px-3 py-1.5" aria-label="Decrease quantity">−</button>
                <span className="w-12 text-center font-bold" aria-live="polite">{line.qty}</span>
                <button type="button" onClick={() => cart.setQty(line.productId, line.variant, line.qty + 1)} className="min-h-[44px] min-w-[44px] rounded-md border hairline px-3 py-1.5" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" onClick={() => cart.remove(line.productId, line.variant)} className="self-start px-3 py-2.5 text-[13px] text-red-400 hover:underline sm:self-center">Remove</button>
            </article>
          );
        })}
      </div>
      <div className="card mt-6 flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Subtotal · indicative catalog prices</p>
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
