import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../hooks/useCatalog';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters, EMPTY_FILTERS, type FilterState } from '../components/products/ProductFilters';
import { Input } from '../components/ui/Input';
import { lockBodyScroll, setMeta, unlockBodyScroll } from '../lib/utils';
import { useDialogFocus } from '../hooks/useDialogFocus';

const PAGE_SIZE = 9;

export function ProductsPage() {
  const { products } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    ...EMPTY_FILTERS,
    query: params.get('query') ?? '',
    category: params.get('category') ?? 'all',
  });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawer, setDrawer] = useState(false);
  const urlTimer = useRef<number | null>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useDialogFocus<HTMLDivElement>(drawer);
  const wasOpen = useRef(false);

  useEffect(() => {
    setMeta(`Product Catalog — ${products.length} Precision Fasteners | WELTOQ`, `Search, filter and sort ${products.length} WELTOQ fasteners — M2–M8 SHCS, hex nuts and ultraflat heads — with INR prices, MOQ tiers and live stock.`);
  }, []);

  // URL → filters: reset to defaults when a param is REMOVED (Back button,
  // cleared search), and skip no-op updates to avoid render loops.
  useEffect(() => {
    setFilters((f) => {
      const query = params.get('query') ?? '';
      const category = params.get('category') ?? 'all';
      if (f.query === query && f.category === category) return f;
      return { ...f, query, category };
    });
  }, [params]);

  useEffect(() => setVisible(PAGE_SIZE), [filters]);

  // Filter sheet dialog: scroll-lock, Escape, focus trap + return focus.
  useEffect(() => {
    if (!drawer) return;
    lockBodyScroll();
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawer(false);
    };
    window.addEventListener('keydown', fn);
    return () => {
      window.removeEventListener('keydown', fn);
      unlockBodyScroll();
    };
  }, [drawer]);

  useEffect(() => {
    if (wasOpen.current && !drawer) filterBtnRef.current?.focus();
    wasOpen.current = drawer;
  }, [drawer]);

  useEffect(() => () => {
    if (urlTimer.current) window.clearTimeout(urlTimer.current);
  }, []);

  const results = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().replace(/×/g, 'x');
    const q = norm(filters.query.trim());
    let list = products.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.material !== 'all' && p.material !== filters.material) return false;
      if (filters.grade !== 'all' && p.grade !== filters.grade) return false;
      if (filters.diameter !== 'all' && p.diameter !== filters.diameter) return false;
      if (filters.finish !== 'all' && p.finish !== filters.finish) return false;
      if (filters.thread !== 'all' && p.threadType !== filters.thread) return false;
      if (filters.availability !== 'all' && p.stockStatus !== filters.availability) return false;
      if (q) {
        const hay = norm([p.name, p.sku, p.category, p.material, p.finish, p.grade, ...(p.keywords ?? [])].join(' '));
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (filters.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === 'price-asc') list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (filters.sort === 'price-desc') list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return list;
  }, [filters]);

  // Filter state updates instantly; the URL follows debounced so typing
  // doesn't re-render + re-sync on every keystroke.
  const onSearchInput = (v: string) => {
    setFilters((f) => ({ ...f, query: v }));
    if (urlTimer.current) window.clearTimeout(urlTimer.current);
    urlTimer.current = window.setTimeout(() => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (v) next.set('query', v);
          else next.delete('query');
          return next;
        },
        { replace: true },
      );
    }, 250);
  };

  const clearAll = () => {
    if (urlTimer.current) window.clearTimeout(urlTimer.current);
    setFilters({ ...EMPTY_FILTERS, query: '' });
    setParams({}, { replace: true });
  };

  return (
    <main className="studio-bg shell pb-20 pt-28">
      <p className="eyebrow">Catalog · {products.length} products · INR pricing · MOQ tiers</p>
      <h1 className="display-section mt-3 text-balance">Every fastener. <span className="serif-accent brass-text">One system.</span></h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted">
        Search by name, SKU, size or category. Filters and sorting update the grid live. All {products.length}
        listings are sourced from the WELTORQUE technical reference, with cropped product overviews, the
        original catalogue page, exact specifications, prices, MOQs and stock states.
      </p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="min-w-0 flex-1">
          <Input
            label="Search products"
            name="catalog-search"
            placeholder="M4, SHCS, hex nut, ultraflat, SKU…"
            value={filters.query}
            onChange={(e) => onSearchInput(e.target.value)}
          />
        </div>
        <span className="self-start lg:hidden">
          <button ref={filterBtnRef} onClick={() => setDrawer(true)} className="btn-ghost" aria-label="Open filters" aria-expanded={drawer}>
            Filters · {results.length}
          </button>
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters sidebar">
          <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto overscroll-contain pr-1">
            <ProductFilters filters={filters} onChange={setFilters} count={results.length} />
          </div>
        </aside>
        <div className="min-w-0">
          <p className="mb-4 text-[13px] tracking-[0.12em] text-muted" role="status">
            {results.length} OF {products.length} PRODUCTS · SORT: {filters.sort.toUpperCase()}
          </p>
          <ProductGrid items={results.slice(0, visible)} onClear={clearAll} />
          {visible < results.length && (
            <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-ghost mt-8 w-full">
              Load more ({results.length - visible} remaining)
            </button>
          )}
        </div>
      </div>

      {drawer && (
        <div ref={drawerRef} className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85svh] flex-col overflow-hidden rounded-t-2xl bg-ink-900 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b hairline bg-ink-900 px-5 py-4">
              <p className="font-display font-bold">Filters</p>
              <button onClick={() => setDrawer(false)} className="grid min-h-[44px] min-w-[44px] place-items-center rounded-md border hairline px-3 text-sm" autoFocus>Done</button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <ProductFilters filters={filters} onChange={setFilters} count={results.length} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
