import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input, Textarea, Select } from '../components/ui/Input';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { setMeta } from '../lib/utils';

type Errors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function QuotePage() {
  const [params] = useSearchParams();
  const preselect = params.get('product') ?? '';
  const [form, setForm] = useState({
    fullName: '', company: '', email: '', phone: '', country: '',
    category: '', product: preselect, material: '', diameter: '', length: '',
    quantity: '', deliveryDate: '', deliveryLocation: '', requirements: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    setMeta('Request a Quote (Demo) | Fasteners', 'Bulk and custom fastener quotation form. Demo submission.');
  }, []);

  // Keep preselected product in sync if the URL changes while mounted
  // (e.g. "Request a quote" from different product pages).
  useEffect(() => {
    const next = params.get('product') ?? '';
    if (next) setForm((f) => (f.product === next ? f : { ...f, product: next }));
  }, [params]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const summary = useMemo(() => {
    const p = products.find((x) => x.id === form.product);
    return p ? `${p.name} (${p.sku})` : form.product || '—';
  }, [form.product]);

  function validate(): Errors {
    const e: Errors = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address.';
    if (!form.quantity.trim()) e.quantity = 'Quantity is required.';
    else if (!/^\d+/.test(form.quantity.trim())) e.quantity = 'Quantity should start with a number (e.g. “500 pcs”).';
    if (!form.product && !form.category) e.product = 'Choose a product or a category.';
    if (file) {
      const ok = ['application/pdf', 'image/png', 'image/jpeg', 'application/step', 'model/step'].some((t) => file.type === t) || /\.(pdf|png|jpe?g|step|stp|dxf)$/i.test(file.name);
      if (!ok) e.file = 'Allowed: PDF, PNG, JPG, STEP, DXF.';
      if (file.size > 10 * 1024 * 1024) e.file = 'Max file size is 10 MB (demo limit).';
    }
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    // DEMO submission: simulated latency + local persistence. No backend wired.
    await new Promise((r) => setTimeout(r, 1200));
    try {
      const log = JSON.parse(localStorage.getItem('fasteners-quotes-v1') ?? localStorage.getItem('tbe-quotes-v1') ?? '[]');
      log.push({ ...form, fileName: file?.name ?? null, at: new Date().toISOString() });
      localStorage.setItem('fasteners-quotes-v1', JSON.stringify(log));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <main className="shell max-w-2xl pb-20 pt-32 text-center">
        <p className="eyebrow">Quote received · demo</p>
        <h1 className="display-section mt-3">Thanks — summary saved locally.</h1>
        <div className="card mt-6 p-6 text-left text-[14px]">
          <p><strong>Product:</strong> {summary}</p>
          <p><strong>Quantity:</strong> {form.quantity}</p>
          <p><strong>Delivery:</strong> {form.deliveryLocation || '—'} {form.deliveryDate ? `· by ${form.deliveryDate}` : ''}</p>
          <p className="mt-2 text-muted">Demo mode: nothing was emailed. Connect an email provider / CRM per SETUP.md, then this screen confirms a real ticket ID.</p>
        </div>
        <button className="btn-ghost mt-6" onClick={() => setStatus('idle')}>Start another request</button>
      </main>
    );
  }

  return (
    <main className="studio-bg shell max-w-3xl pb-20 pt-28">
      <p className="eyebrow">Bulk & custom · demo submission</p>
      <h1 className="display-section mt-3 text-balance">Your requirements. <span className="serif-accent brass-text">Our solutions.</span></h1>
      <p className="mt-3 text-[15px] text-muted">Structured quote intake. Required fields marked *. Demo: validates, shows loading/success/error, stores locally — no email sent.</p>

      <form onSubmit={submit} className="card-premium mt-8 grid gap-5 p-6 md:p-8" noValidate>
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Full name" name="fullName" required value={form.fullName} onChange={(e) => set('fullName')(e.target.value)} error={errors.fullName} autoComplete="name" />
          <Input label="Company name" name="company" value={form.company} onChange={(e) => set('company')(e.target.value)} autoComplete="organization" />
          <Input label="Email" name="email" type="email" required value={form.email} onChange={(e) => set('email')(e.target.value)} error={errors.email} autoComplete="email" />
          <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={(e) => set('phone')(e.target.value)} autoComplete="tel" />
          <Input label="Country" name="country" value={form.country} onChange={(e) => set('country')(e.target.value)} autoComplete="country-name" />
          <Select label="Product category" name="category" value={form.category} onChange={set('category')}>
            <option value="">Select…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.group} — {c.name}</option>)}
          </Select>
          <Select label="Product name" name="product" value={form.product} onChange={set('product')}>
            <option value="">Select…</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          {errors.product && <p role="alert" className="text-[13px] text-red-400 md:col-span-2">{errors.product}</p>}
          <Input label="Material or grade" name="material" placeholder="e.g. A2 stainless / 8.8 zinc" value={form.material} onChange={(e) => set('material')(e.target.value)} />
          <Input label="Diameter" name="diameter" placeholder="e.g. M12" value={form.diameter} onChange={(e) => set('diameter')(e.target.value)} />
          <Input label="Length" name="length" placeholder="e.g. 60 mm" value={form.length} onChange={(e) => set('length')(e.target.value)} />
          <Input label="Quantity" name="quantity" required placeholder="e.g. 2000 pcs" value={form.quantity} onChange={(e) => set('quantity')(e.target.value)} error={errors.quantity} />
          <Input label="Required delivery date" name="deliveryDate" type="date" value={form.deliveryDate} onChange={(e) => set('deliveryDate')(e.target.value)} />
          <Input label="Delivery location" name="deliveryLocation" placeholder="City, State / PIN" value={form.deliveryLocation} onChange={(e) => set('deliveryLocation')(e.target.value)} />
        </div>
        <Textarea label="Additional requirements" name="requirements" placeholder="Finish, standards, packaging, inspection needs…" value={form.requirements} onChange={(e) => set('requirements')(e.target.value)} />
        <div>
          <label htmlFor="drawing" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Technical drawing / spec (PDF, PNG, JPG, STEP, DXF · ≤10 MB)</label>
          <input
            id="drawing"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.step,.stp,.dxf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-[14px] text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2.5 file:font-semibold file:text-white"
          />
          {file && <p className="mt-1 text-[13px] text-muted">Selected: {file.name} ({(file.size / 1024).toFixed(0)} KB) — demo only, not uploaded.</p>}
          {errors.file && <p role="alert" className="mt-1 text-[13px] text-red-400">{errors.file}</p>}
        </div>
        {status === 'error' && Object.keys(errors).length > 0 && (
          <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-[14px] text-red-300">Please fix the highlighted fields and resubmit.</p>
        )}
        <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-60">
          {status === 'sending' ? 'Sending (demo)…' : 'Submit quote request — demo'}
        </button>
        <p className="text-[12px] leading-relaxed text-muted-dim">Privacy notice (placeholder): demo submissions stay in this browser’s localStorage. When a backend connects, state retention, recipients, and lawful basis here.</p>
      </form>
    </main>
  );
}
