import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { productById } from '../data/products';
import { formatINR, setMeta } from '../lib/utils';
import { ProductRender } from '../components/products/ProductRender';

export function CartPage() {
  const cart = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMeta('Cart (Demo) | Fasteners', 'Demo cart — local only, no checkout integration.');
  }, []);

  if (done) {
    return (
      <main className="shell max-w-xl pb-20 pt-32 text-center">
        <p className="eyebrow">Demo checkout complete</p>
        <h1 className="display-section mt-3">Nothing was charged.</h1>
        <p className="mt-3 text-muted">Demo flow: cart cleared locally to prove the state machine. Connect Shopify/custom per SETUP.md for real checkout.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/products" className="btn-primary">Keep browsing</Link>
          <Link to="/quote" className="btn-ghost">Bulk quote instead</Link>
        </div>
      </main>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <main className="shell max-w-xl pb-20 pt-32 text-center">
        <p className="eyebrow">Cart · demo · empty</p>
        <h1 className="display-section mt-3">Your cart is empty.</h1>
        <p className="mt-3 text-muted">Add fasteners from the catalog — they persist in this browser only.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="studio-bg shell max-w-4xl pb-20 pt-28">
      <p className="eyebrow">Cart · demo · {cart.count} items</p>
      <h1 className="display-section mt-3">Review your <span className="serif-accent brass-text">selection.</span></h1>
      <div className="mt-8 space-y-4">
        {cart.lines.map((l) => {
          const p = productById(l.productId);
          if (!p) return null;
          return (
            <article key={`${l.productId}-${l.variant}`} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="w-full overflow-hidden rounded-lg sm:w-40">
                <ProductRender renderKey={p.images[0]} name={p.name} compact />
              </div>
              <div className="flex-1">
                <Link to={`/products/${p.slug}`} className="font-display text-[18px] font-bold hover:underline">{p.name}</Link>
                <p className="text-[12px] text-muted">SKU {p.sku} · Variant {l.variant}</p>
                <p className="mt-1 text-[14px] font-semibold">{formatINR(l.unitPrice, 'INR')} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => cart.setQty(l.productId, l.variant, l.qty - 1)} className="rounded-md border hairline px-3 py-1.5" aria-label="Decrease quantity">−</button>
                <span className="w-10 text-center font-bold" aria-live="polite">{l.qty}</span>
                <button onClick={() => cart.setQty(l.productId, l.variant, l.qty + 1)} className="rounded-md border hairline px-3 py-1.5" aria-label="Increase quantity">+</button>
              </div>
              <button onClick={() => cart.remove(l.productId, l.variant)} className="text-[13px] text-red-400 hover:underline">Remove</button>
            </article>
          );
        })}
      </div>
      <div className="card mt-6 flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Subtotal · indicative prices</p>
          <p className="font-display text-3xl font-bold">{formatINR(cart.subtotal, 'INR')}</p>
          <p className="mt-1 text-[12px] text-muted">Shipping/tax shown only when configured — currently none. Quote-only lines excluded from pricing.</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="btn-primary"
            disabled={checkingOut}
            onClick={async () => {
              setCheckingOut(true);
              await new Promise((r) => setTimeout(r, 1100));
              cart.clear();
              setCheckingOut(false);
              setDone(true);
            }}
          >
            {checkingOut ? 'Processing (demo)…' : 'Checkout — demo only'}
          </button>
          <button className="btn-ghost" onClick={cart.clear}>Clear cart</button>
        </div>
      </div>
    </main>
  );
}
