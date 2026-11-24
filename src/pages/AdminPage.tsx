import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ProductRender } from '../components/products/ProductRender';
import { useAuth } from '../hooks/useAuth';
import { useCatalog } from '../hooks/useCatalog';
import { setMeta } from '../lib/utils';
import {
  adminListProducts,
  adminMarkAllRead,
  adminSummary,
  createProduct,
  deleteProduct,
  resolveMedia,
  updateProduct,
  uploadImage,
  type UnreadSummary,
} from '../lib/api';
import { AdminOrdersPanel } from './admin/AdminOrdersPanel';
import { AdminQuotesPanel } from './admin/AdminQuotesPanel';

const STOCK_OPTIONS = [
  { value: 'in-stock', label: 'In stock' },
  { value: 'low-stock', label: 'Low stock' },
  { value: 'made-to-order', label: 'Made to order' },
  { value: 'quote-only', label: 'Quote only' },
];

type SpecRow = { label: string; value: string };

type FormState = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  material: string;
  grade: string;
  finish: string;
  diameter: string;
  length: string;
  threadType: string;
  threadPitch: string;
  standard: string;
  strength: string;
  propertyClass: string;
  fastenerType: string;
  remark: string;
  availableSizes: string;
  price: string;
  currency: string;
  moq: string;
  stockStatus: string;
  images: string[];
  modelPath: string;
  specs: SpecRow[];
  related: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  catalogPage: string;
  catalogIntro: string;
  applications: string; // one application per line
  sample: boolean;
  featured: boolean;
};

function emptyForm(category: string): FormState {
  return {
    id: '',
    sku: '',
    name: '',
    slug: '',
    category,
    shortDescription: '',
    fullDescription: '',
    material: '',
    grade: '',
    finish: '',
    diameter: '',
    length: '',
    threadType: '',
    threadPitch: '',
    standard: '',
    strength: '',
    propertyClass: '',
    fastenerType: '',
    remark: '',
    availableSizes: '',
    price: '',
    currency: 'INR',
    moq: '1',
    stockStatus: 'in-stock',
    images: [],
    modelPath: '',
    specs: [],
    related: '',
    seoTitle: '',
    seoDescription: '',
    keywords: '',
    catalogPage: '',
    catalogIntro: '',
    applications: '',
    sample: false,
    featured: false,
  };
}

function productToForm(p: Product): FormState {
  return {
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    category: p.category,
    shortDescription: p.shortDescription,
    fullDescription: p.fullDescription,
    material: p.material,
    grade: p.grade,
    finish: p.finish,
    diameter: p.diameter,
    length: p.length,
    threadType: p.threadType,
    threadPitch: p.threadPitch,
    standard: p.standard ?? '',
    strength: p.strength ?? '',
    propertyClass: p.propertyClass ?? '',
    fastenerType: p.fastenerType ?? '',
    remark: p.remark ?? '',
    availableSizes: p.availableSizes.join(', '),
    price: p.price === null || p.price === undefined ? '' : String(p.price),
    currency: p.currency || 'INR',
    moq: String(p.moq ?? 1),
    stockStatus: p.stockStatus,
    images: [...p.images],
    modelPath: p.modelPath ?? '',
    specs: p.specs.map((s) => ({ label: s.label, value: s.value })),
    related: (p.related ?? []).join(', '),
    seoTitle: p.seoTitle ?? '',
    seoDescription: p.seoDescription ?? '',
    keywords: (p.keywords ?? []).join(', '),
    catalogPage: p.catalogPage ? String(p.catalogPage) : '',
    catalogIntro: p.catalogIntro ?? '',
    applications: (p.applications ?? []).join('\n'),
    sample: Boolean(p.sample),
    featured: Boolean(p.featured),
  };
}

const splitList = (v: string): string[] =>
  v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

function formToPayload(f: FormState): Partial<Product> {
  return {
    sku: f.sku.trim(),
    name: f.name.trim(),
    slug: f.slug.trim() || undefined,
    category: f.category,
    shortDescription: f.shortDescription.trim(),
    fullDescription: f.fullDescription.trim(),
    material: f.material.trim(),
    grade: f.grade.trim(),
    finish: f.finish.trim(),
    diameter: f.diameter.trim(),
    length: f.length.trim(),
    threadType: f.threadType.trim(),
    threadPitch: f.threadPitch.trim(),
    standard: f.standard.trim(),
    strength: f.strength.trim(),
    propertyClass: f.propertyClass.trim(),
    fastenerType: f.fastenerType.trim(),
    remark: f.remark.trim(),
    availableSizes: splitList(f.availableSizes),
    price: f.price.trim() === '' ? null : Number(f.price),
    currency: f.currency.trim() || 'INR',
    moq: Math.max(1, Math.floor(Number(f.moq) || 1)),
    stockStatus: f.stockStatus as 'in-stock' | 'low-stock' | 'made-to-order' | 'quote-only',
    images: f.images,
    modelPath: f.modelPath.trim() || null,
    specs: f.specs.filter((s) => s.label.trim() || s.value.trim()),
    related: splitList(f.related),
    seoTitle: f.seoTitle.trim(),
    seoDescription: f.seoDescription.trim(),
    keywords: splitList(f.keywords),
    catalogPage: f.catalogPage.trim() === '' ? undefined : Number(f.catalogPage),
    catalogIntro: f.catalogIntro.trim(),
    applications: f.applications
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean),
    sample: false,
    featured: f.featured,
  };
}

function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="studio-bg shell flex min-h-[80vh] items-center justify-center pb-20 pt-32">
      <div className="card-premium w-full max-w-md p-7">
        <p className="eyebrow">Admin access</p>
        <h1 className="display-section mt-3 text-[clamp(28px,4vw,40px)]">Sign in.</h1>
        <p className="mt-2 text-[14px] text-muted">
          Only administrators can manage the catalog. Credentials are configured on the backend
          (<code className="text-paper">ADMIN_EMAIL</code> / <code className="text-paper">ADMIN_PASSWORD</code>).
        </p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
          <Input
            label="Email"
            name="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            name="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-[13px] text-red-300">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  );
}

function SpecsEditor({ rows, onChange }: { rows: SpecRow[]; onChange: (rows: SpecRow[]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Technical specifications</span>
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="w-2/5 rounded-lg border hairline bg-ink-900 px-3 py-2.5 text-base text-paper"
            placeholder="Label (e.g. Thread)"
            value={row.label}
            onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))}
          />
          <input
            className="flex-1 rounded-lg border hairline bg-ink-900 px-3 py-2.5 text-base text-paper"
            placeholder="Value (e.g. M10 × 1.5)"
            value={row.value}
            onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))}
          />
          <button
            type="button"
            className="btn-ghost !px-3 !py-2"
            aria-label="Remove specification"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn-ghost self-start !px-4 !py-2 !text-[12px]" onClick={() => onChange([...rows, { label: '', value: '' }])}>
        + Add specification
      </button>
    </div>
  );
}

function ImageManager({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const res = await uploadImage(file);
        uploaded.push(res.url);
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Product images</span>
      <div className="flex flex-wrap gap-3">
        {images.length === 0 && <p className="text-[13px] text-muted-dim">No images yet. Upload one or leave for the procedural fallback.</p>}
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="relative h-24 w-24 overflow-hidden rounded-lg border hairline bg-white">
            <img src={resolveMedia(src)} alt={`Product image ${i + 1}`} className="h-full w-full object-contain p-1" />
            <button
              type="button"
              aria-label={`Remove image ${i + 1}`}
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-[12px] text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          multiple
          onChange={(e) => void onFiles(e.target.files)}
          className="text-[13px] text-muted file:mr-3 file:rounded-md file:border file:border-white/15 file:bg-white/5 file:px-3 file:py-1.5 file:text-paper"
        />
        {busy && <span className="text-[13px] text-brass-light">Uploading…</span>}
      </div>
      <Input
        label="Or paste an image path / URL"
        name="image-path"
        placeholder="/products/example.png or https://…"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const value = (e.target as HTMLInputElement).value.trim();
            if (value) {
              onChange([...images, value]);
              (e.target as HTMLInputElement).value = '';
            }
          }
        }}
      />
      {error && <p className="text-[13px] text-red-300">{error}</p>}
    </div>
  );
}

function AdminDashboard() {
  const auth = useAuth();
  const catalog = useCatalog();
  const [items, setItems] = useState<Product[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState<FormState>(() => emptyForm(catalog.categories[0]?.id ?? 'm2-fasteners'));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<'orders' | 'quotes' | 'products'>('orders');
  const [summary, setSummary] = useState<UnreadSummary>({ orders: 0, quotes: 0, total: 0 });
  const [summaryError, setSummaryError] = useState('');

  const refreshSummary = useCallback(async () => {
    try {
      setSummary(await adminSummary());
      setSummaryError('');
    } catch (err) {
      if ((err as { status?: number }).status === 401) auth.logout();
      else setSummaryError(err instanceof Error ? err.message : 'Failed to load notification summary');
    }
  }, [auth]);

  const markAll = async () => {
    try {
      await adminMarkAllRead();
      await refreshSummary();
    } catch (err) {
      if ((err as { status?: number }).status === 401) auth.logout();
      else setSummaryError(err instanceof Error ? err.message : 'Failed to mark notifications as read');
    }
  };

  const load = useCallback(async () => {
    setListLoading(true);
    try {
      const list = await adminListProducts();
      setItems(list);
    } catch (err) {
      if ((err as { status?: number }).status === 401) auth.logout();
      else setMessage({ kind: 'err', text: err instanceof Error ? err.message : 'Failed to load products' });
    } finally {
      setListLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    setMeta('Admin · Orders, quotes & products | WELTOQ', 'Admin console for COD orders, quote requests, and catalog management.');
    void load();
    void refreshSummary();
  }, [load, refreshSummary]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm(catalog.categories[0]?.id ?? 'm2-fasteners'));
    setErrors({});
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm(productToForm(p));
    setErrors({});
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.sku.trim()) e.sku = 'SKU is required';
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.category) e.category = 'Category is required';
    if (form.price.trim() !== '' && Number.isNaN(Number(form.price))) e.price = 'Price must be a number (or empty for quote-only)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setMessage(null);
    try {
      const payload = formToPayload(form);
      const saved = editingId ? await updateProduct(editingId, payload) : await createProduct(payload);
      setMessage({ kind: 'ok', text: `Saved “${saved.name}”. The storefront catalog has been refreshed.` });
      setEditingId(saved.id);
      setForm(productToForm(saved));
      await Promise.all([load(), catalog.refresh()]);
    } catch (err) {
      if ((err as { status?: number }).status === 401) {
        auth.logout();
      } else {
        setMessage({ kind: 'err', text: err instanceof Error ? err.message : 'Save failed' });
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete “${p.name}”? This cannot be undone.`)) return;
    setMessage(null);
    try {
      await deleteProduct(p.id);
      if (editingId === p.id) startNew();
      await Promise.all([load(), catalog.refresh()]);
      setMessage({ kind: 'ok', text: `Deleted “${p.name}”.` });
    } catch (err) {
      setMessage({ kind: 'err', text: err instanceof Error ? err.message : 'Delete failed' });
    }
  };

  const filtered = items.filter((p) => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.sku, p.category, p.material].join(' ').toLowerCase().includes(q);
  });

  return (
    <main className="studio-bg shell pb-24 pt-28">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Admin · {catalog.source === 'api' ? 'Live backend' : 'Static fallback'}</p>
          <h1 className="display-section mt-3 text-[clamp(28px,4vw,48px)]">Admin console.</h1>
          <p className="mt-2 text-[14px] text-muted">
            Signed in as <strong className="text-paper">{auth.email}</strong>. Review COD orders, quote requests, and manage the catalog.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/products" className="btn-ghost">View storefront</Link>
          <Button variant="ghost" onClick={auth.logout}>Sign out</Button>
        </div>
      </div>

      {message && (
        <p
          role="status"
          className={`mt-5 rounded-lg border p-3 text-[13px] ${
            message.kind === 'ok'
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
              : 'border-red-500/40 bg-red-500/10 text-red-300'
          }`}
        >
          {message.text}
        </p>
      )}

      <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label="Admin sections">
        {([
          ['orders', `Orders${summary.orders ? ` · ${summary.orders}` : ''}`],
          ['quotes', `Quotes${summary.quotes ? ` · ${summary.quotes}` : ''}`],
          ['products', 'Products'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-current={tab === key ? 'page' : undefined}
            className={`rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              tab === key ? 'border-brass/60 bg-brass/10 text-brass-light' : 'hairline text-muted hover:border-brass/40 hover:text-paper'
            }`}
          >
            {label}
          </button>
        ))}
        {summary.total > 0 && (
          <Button variant="ghost" onClick={() => void markAll()} className="!px-4 !py-2 !text-[12px]">
            Mark all {summary.total} as read
          </Button>
        )}
      </nav>
      {summaryError && <p role="alert" className="mt-3 text-[13px] text-red-300">{summaryError}</p>}

      {tab === 'orders' && (
        <div className="mt-8">
          <AdminOrdersPanel onChanged={() => void refreshSummary()} />
        </div>
      )}
      {tab === 'quotes' && (
        <div className="mt-8">
          <AdminQuotesPanel onChanged={() => void refreshSummary()} />
        </div>
      )}
      {tab === 'products' && (
      <div className="mt-8 grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* Product list */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-premium p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">{filtered.length} products</p>
              <Button onClick={startNew} className="!px-4 !py-2 !text-[12px]">+ New</Button>
            </div>
            <div className="mt-4">
              <Input label="Search" name="admin-search" placeholder="Name, SKU, category…" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <div className="mt-4 max-h-[60vh] space-y-2 overflow-auto pr-1">
              {listLoading && <p className="text-[13px] text-muted">Loading…</p>}
              {!listLoading && filtered.length === 0 && <p className="text-[13px] text-muted">No products match.</p>}
              {filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => startEdit(p)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-colors ${
                    editingId === p.id ? 'border-brass/60 bg-brass/10' : 'hairline hover:border-brass/40'
                  }`}
                >
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-md border hairline bg-white">
                    <ProductRender renderKey={p.images[0] ?? 'hex-bolt'} name={p.name} compact />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-paper">{p.name}</span>
                    <span className="block truncate text-[11px] text-muted">{p.sku} · {p.category}</span>
                  </span>
                  {p.featured && <span className="ml-auto text-[11px] text-brass">★</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Form */}
        <section className="min-w-0">
          <form className="card-premium p-6" onSubmit={save}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-bold">
                {editingId ? 'Edit product' : 'Add product'}
                {editingId && <span className="ml-2 text-[12px] font-normal text-muted">id: {editingId}</span>}
              </h2>
              {editingId && (
                <Button variant="ghost" onClick={startNew} className="!px-4 !py-2 !text-[12px]">Cancel edit</Button>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input label="SKU" name="sku" required value={form.sku} error={errors.sku} onChange={(e) => set('sku', e.target.value)} />
              <Input label="Name" name="name" required value={form.name} error={errors.name} onChange={(e) => set('name', e.target.value)} />
              <Input label="Slug (optional — auto from name)" name="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
              <Select label="Category" name="category" required value={form.category} error={errors.category} onChange={(v) => set('category', v)}>
                {catalog.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.group} — {c.name}</option>
                ))}
              </Select>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Textarea label="Short description" name="shortDescription" rows={2} value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />
              <Textarea label="Full description" name="fullDescription" rows={2} value={form.fullDescription} onChange={(e) => set('fullDescription', e.target.value)} />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="WELTORQUE catalogue page (PDF)" name="catalogPage" inputMode="numeric" value={form.catalogPage} onChange={(e) => set('catalogPage', e.target.value)} />
              <Textarea label="Catalogue intro (PDF preamble)" name="catalogIntro" rows={2} value={form.catalogIntro} onChange={(e) => set('catalogIntro', e.target.value)} />
            </div>
            <div className="mt-4">
              <Textarea label="Common applications (one per line)" name="applications" rows={5} value={form.applications} onChange={(e) => set('applications', e.target.value)} />
            </div>

            <div className="mt-6">
              <p className="eyebrow mb-3">Attributes</p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Input label="Material" name="material" value={form.material} onChange={(e) => set('material', e.target.value)} />
                <Input label="Grade" name="grade" value={form.grade} onChange={(e) => set('grade', e.target.value)} />
                <Input label="Finish" name="finish" value={form.finish} onChange={(e) => set('finish', e.target.value)} />
                <Input label="Diameter" name="diameter" value={form.diameter} onChange={(e) => set('diameter', e.target.value)} />
                <Input label="Length" name="length" value={form.length} onChange={(e) => set('length', e.target.value)} />
                <Input label="Thread type" name="threadType" value={form.threadType} onChange={(e) => set('threadType', e.target.value)} />
                <Input label="Thread pitch" name="threadPitch" value={form.threadPitch} onChange={(e) => set('threadPitch', e.target.value)} />
                <Input label="Standard (e.g. DIN-912)" name="standard" value={form.standard} onChange={(e) => set('standard', e.target.value)} />
                <Input label="Strength (e.g. 700 N/mm²)" name="strength" value={form.strength} onChange={(e) => set('strength', e.target.value)} />
                <Input label="Class (e.g. 80)" name="propertyClass" value={form.propertyClass} onChange={(e) => set('propertyClass', e.target.value)} />
                <Input label="Fastener type (e.g. SOCKET HEAD)" name="fastenerType" value={form.fastenerType} onChange={(e) => set('fastenerType', e.target.value)} />
                <Input label="Remark (e.g. ALLEN HEAD)" name="remark" value={form.remark} onChange={(e) => set('remark', e.target.value)} />
                <Input label="Available sizes (comma separated)" name="availableSizes" value={form.availableSizes} onChange={(e) => set('availableSizes', e.target.value)} />
                <Input label="Keywords (comma separated)" name="keywords" value={form.keywords} onChange={(e) => set('keywords', e.target.value)} />
                <Input label="Related product ids (comma separated)" name="related" value={form.related} onChange={(e) => set('related', e.target.value)} />
                <Input label="3D model path (optional)" name="modelPath" value={form.modelPath} onChange={(e) => set('modelPath', e.target.value)} />
              </div>
            </div>

            <div className="mt-6">
              <p className="eyebrow mb-3">Commerce</p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Input
                  label="Unit price (blank = quote only)"
                  name="price"
                  inputMode="decimal"
                  value={form.price}
                  error={errors.price}
                  placeholder="e.g. 4.50"
                  onChange={(e) => set('price', e.target.value)}
                />
                <Input label="Currency" name="currency" value={form.currency} onChange={(e) => set('currency', e.target.value)} />
                <Input label="MOQ" name="moq" inputMode="numeric" value={form.moq} onChange={(e) => set('moq', e.target.value)} />
                <Select label="Stock status" name="stockStatus" value={form.stockStatus} onChange={(v) => set('stockStatus', v)}>
                  {STOCK_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </div>
              <div className="mt-4 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-[14px] text-muted">
                  <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
                  Featured on homepage
                </label>
                <label className="flex items-center gap-2 text-[14px] text-muted">
                  <input type="checkbox" checked={form.sample} onChange={(e) => set('sample', e.target.checked)} />
                  Mark as sample data
                </label>
              </div>
            </div>

            <div className="mt-6">
              <ImageManager images={form.images} onChange={(imgs) => set('images', imgs)} />
            </div>

            <div className="mt-6">
              <SpecsEditor rows={form.specs} onChange={(rows) => set('specs', rows)} />
            </div>

            <div className="mt-6">
              <p className="eyebrow mb-3">SEO</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="SEO title" name="seoTitle" value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
                <Input label="SEO description" name="seoDescription" value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create product'}</Button>
              {editingId && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    const p = items.find((x) => x.id === editingId);
                    if (p) void remove(p);
                  }}
                >
                  Delete product
                </Button>
              )}
            </div>
          </form>
        </section>
      </div>
      )}
    </main>
  );
}

export function AdminPage() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <main className="shell pb-20 pt-32 text-center">
        <p className="text-muted">Checking session…</p>
      </main>
    );
  }
  return isAdmin ? <AdminDashboard /> : <AdminLogin />;
}
