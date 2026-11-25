import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCatalog } from '../hooks/useCatalog';
import { Input, Textarea } from '../components/ui/Input';
import { brand } from '../data/brand';
import { formatINR, setMeta } from '../lib/utils';
import { placeOrder, type Order } from '../lib/api';

type Errors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  notes: '',
};

export function CheckoutPage() {
  const cart = useCart();
  const { getProductById } = useCatalog();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    setMeta('Checkout — Cash on Delivery | WELTOQ', 'Place a cash-on-delivery order for WELTOQ fasteners.');
  }, []);

  const lines = useMemo(
    () =>
      cart.lines.flatMap((line) => {
        const product = getProductById(line.productId);
        if (!product) return [];
        return [{ ...line, product, lineTotal: (line.unitPrice ?? 0) * line.qty }];
      }),
    [cart.lines, getProductById],
  );

  const set = (key: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  function validate(): Errors {
    const e: Errors = {};
    if (!form.customerName.trim()) e.customerName = 'Full name is required.';
    if (!form.customerEmail.trim()) e.customerEmail = 'Email is required.';
    else if (!EMAIL_RE.test(form.customerEmail.trim())) e.customerEmail = 'Enter a valid email address.';
    if (!/^\+?\d[\d\s-]{6,14}$/.test(form.customerPhone.trim())) e.customerPhone = 'Enter a valid phone number.';
    if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required.';
    if (!form.city.trim()) e.city = 'City is required.';
    if (!form.state.trim()) e.state = 'State is required.';
    if (!/^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(form.postalCode.trim())) e.postalCode = 'Enter a valid PIN / postal code.';
    if (lines.length === 0) e.lines = 'Your cart is empty.';
    if (lines.some((l) => l.product.price === null)) e.lines = 'Some items are quote-only and cannot be ordered with COD.';
    if (lines.some((l) => l.qty < l.product.moq || l.qty % l.product.moq !== 0)) {
      e.lines = 'Quantities must meet each product’s MOQ and be in multiples of it. Please review your cart.';
    }
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    setServerError('');
    if (Object.keys(found).length > 0) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const created = await placeOrder({
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim() || 'India',
        notes: form.notes.trim(),
        currency: brand.currency,
        lines: cart.lines.map((l) => ({ productId: l.productId, variant: l.variant, qty: l.qty })),
      });
      cart.clear();
      setOrder(created);
      setStatus('idle');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Could not place the order. Please try again.');
      setStatus('error');
    }
  }

  if (order) {
    return (
      <main className="shell max-w-3xl pb-24 pt-32 text-center">
        <p className="eyebrow">Order received · Cash on delivery</p>
        <h1 className="display-section mt-3">Thanks — your order is <span className="serif-accent brass-text">with us.</span></h1>
        <p className="mt-3 text-muted">
          Order <strong className="text-paper">{order.orderNumber}</strong> has been recorded and sent to our team.
          We will confirm availability and the exact material, grade and finish with you before fulfilment.
          Pay <strong className="brass-text">{formatINR(order.total, order.currency)}</strong> in cash when it is delivered.
        </p>
        <div className="card-premium mt-8 p-6 text-left text-[14px]">
          <p className="eyebrow">Delivery to</p>
          <p className="mt-2 font-semibold">{order.customerName}</p>
          <p className="break-words text-muted">
            {order.addressLine1}
            {order.addressLine2 ? `, ${order.addressLine2}` : ''}
            <br />
            {order.city}, {order.state} {order.postalCode} · {order.country}
          </p>
          <p className="mt-2 break-all text-muted">{order.customerEmail} · {order.customerPhone}</p>
          <div className="mt-5 border-t hairline pt-4">
            <p className="eyebrow">Items</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 border-b hairline py-2">
                <span className="min-w-0 break-words">{item.name} · {item.variant} × {item.qty}</span>
                <span className="shrink-0 font-semibold">{formatINR(item.lineTotal, order.currency)}</span>
              </div>
            ))}
            <div className="mt-3 flex justify-between text-[17px] font-bold">
              <span>Total payable on delivery</span>
              <span className="brass-text">{formatINR(order.total, order.currency)}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/products" className="btn-primary">Continue browsing</Link>
          <Link to="/quote" className="btn-ghost">Request a bulk quote</Link>
        </div>
      </main>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <main className="shell max-w-xl pb-20 pt-32 text-center">
        <p className="eyebrow">Checkout · empty cart</p>
        <h1 className="display-section mt-3">Nothing to check out.</h1>
        <p className="mt-3 text-muted">Add products to your cart first.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="studio-bg shell pb-24 pt-28">
      <p className="eyebrow">Checkout · cash on delivery only</p>
      <h1 className="display-section mt-3">Confirm your <span className="serif-accent brass-text">order.</span></h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted">
        No online payment is taken. We record the order, notify the admin, and you pay in cash when the delivery arrives.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form className="card-premium min-w-0 p-5 sm:p-6" onSubmit={submit} noValidate>
          <h2 className="font-display text-xl font-bold">Delivery details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label="Full name *" name="customerName" value={form.customerName} error={errors.customerName} onChange={(e) => set('customerName')(e.target.value)} autoComplete="name" />
            <Input label="Email *" name="customerEmail" type="email" value={form.customerEmail} error={errors.customerEmail} onChange={(e) => set('customerEmail')(e.target.value)} autoComplete="email" />
            <Input label="Phone *" name="customerPhone" type="tel" value={form.customerPhone} error={errors.customerPhone} onChange={(e) => set('customerPhone')(e.target.value)} autoComplete="tel" />
            <Input label="PIN / postal code *" name="postalCode" value={form.postalCode} error={errors.postalCode} onChange={(e) => set('postalCode')(e.target.value)} autoComplete="postal-code" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input label="Address line 1 *" name="addressLine1" value={form.addressLine1} error={errors.addressLine1} onChange={(e) => set('addressLine1')(e.target.value)} autoComplete="address-line1" />
            <Input label="Address line 2" name="addressLine2" value={form.addressLine2} onChange={(e) => set('addressLine2')(e.target.value)} autoComplete="address-line2" />
            <Input label="City *" name="city" value={form.city} error={errors.city} onChange={(e) => set('city')(e.target.value)} autoComplete="address-level2" />
            <Input label="State *" name="state" value={form.state} error={errors.state} onChange={(e) => set('state')(e.target.value)} autoComplete="address-level1" />
            <Input label="Country" name="country" value={form.country} onChange={(e) => set('country')(e.target.value)} autoComplete="country-name" />
          </div>
          <div className="mt-4">
            <Textarea label="Delivery notes (optional)" name="notes" rows={3} value={form.notes} onChange={(e) => set('notes')(e.target.value)} placeholder="Landmark, preferred delivery time, packing instructions…" />
          </div>
          {errors.lines && <p role="alert" className="mt-3 text-[13px] text-red-400">{errors.lines}</p>}
          {serverError && <p role="alert" className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-[13px] text-red-300">{serverError}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-60">
              {status === 'sending' ? 'Placing order…' : `Place COD order · ${formatINR(cart.subtotal, brand.currency)}`}
            </button>
            <Link to="/cart" className="btn-ghost">Back to cart</Link>
          </div>
          <p className="mt-4 text-[12px] text-muted-dim">
            By placing this order you agree to pay the displayed amount in cash on delivery. Shipping and tax are currently not charged.
          </p>
        </form>

        <aside className="card-premium h-fit p-5 sm:p-6 lg:sticky lg:top-24">
          <p className="eyebrow">Order summary</p>
          <div className="mt-4 space-y-3">
            {lines.map((line) => (
              <div key={`${line.productId}-${line.variant}`} className="flex justify-between gap-3 border-b hairline pb-3 text-[14px]">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{line.product.name}</p>
                  <p className="text-[12px] text-muted">{line.variant} × {line.qty}</p>
                </div>
                <p className="shrink-0 font-semibold">{formatINR(line.lineTotal, brand.currency)}</p>
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-2 text-[14px]">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatINR(cart.subtotal, brand.currency)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>Not charged</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Tax</dt><dd>Not charged</dd></div>
            <div className="flex justify-between border-t hairline pt-3 text-[17px] font-bold"><dt>Total on delivery</dt><dd className="brass-text">{formatINR(cart.subtotal, brand.currency)}</dd></div>
          </dl>
          <p className="mt-4 rounded-lg border border-brass/25 bg-brass/5 p-3 text-[12px] text-muted">
            Cash on delivery only — no card, UPI, or online payment is collected on this site.
          </p>
        </aside>
      </div>
    </main>
  );
}
