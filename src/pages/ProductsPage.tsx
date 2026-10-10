import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters, EMPTY_FILTERS, type FilterState } from '../components/products/ProductFilters';
import { Input } from '../components/ui/Input';
import { setMeta } from '../lib/utils';

const PAGE_SIZE = 9;

export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    ...EMPTY_FILTERS,
    query: params.get('query') ?? '',
    category: params.get('category') ?? 'all',
  });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setMeta(`Product Catalog — ${products.length} Precision Fasteners | Fasteners`, 'Search, filter, and sort the full fastener catalog from Excel: SHCS, nuts, washers, CSK, QTF, bearings, rivets.');
  }, []);

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      query: params.get('query') ?? f.query,
      category: params.get('category') ?? f.category,
    }));
  }, [params]);

  useEffect(() => setVisible(PAGE_SIZE), [filters]);

  const results = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false;
      if (filters.material !== 'all' && p.material !== filters.material) return false;
      if (filters.grade !== 'all' && p.grade !== filters.grade) return false;
      if (filters.diameter !== 'all' && p.diameter !== filters.diameter) return false;
      if (filters.finish !== 'all' && p.finish !== filters.finish) return false;
      if (filters.thread !== 'all' && p.threadType !== filters.thread) return false;
      if (filters.availability !== 'all' && p.stockStatus !== filters.availability) return false;
      if (q) {
        const hay = [p.name, p.sku, p.category, p.material, p.finish, p.grade, ...(p.keywords ?? [])].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (filters.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === 'price-asc') list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (filters.sort === 'price-desc') list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return list;
  }, [filters]);

  const onSearchInput = (v: string) => {
    setFilters({ ...filters, query: v });
    const next = new URLSearchParams(params);
    if (v) next.set('query', v);
    else next.delete('query');
    setParams(next, { replace: true });
  };

  return (
    <main className="studio-bg shell pb-20 pt-28">
      <p className="eyebrow">Catalog · {products.length} products · scroll to filter</p>
      <h1 className="display-section mt-3 text-balance">Every fastener. <span className="serif-accent brass-text">One system.</span></h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted">
        Search by name, SKU, category, or material. Filters update the grid live; sorting included.
        All 46 listings match the Excel sheet, with Excel reference photos.
      </p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <Input
            label="Search products"
            name="catalog-search"
            placeholder="M4, SHCS, QTF, rivet, SKU…"
            value={filters.query}
            onChange={(e) => onSearchInput(e.target.value)}
          />
        </div>
        <button onClick={() => setDrawer(true)} className="btn-ghost self-start lg:hidden" aria-label="Open filters">
          Filters · {results.length}
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters sidebar">
          <div className="sticky top-24">
            <ProductFilters filters={filters} onChange={setFilters} count={results.length} />
          </div>
        </aside>
        <div>
          <p className="mb-4 text-[13px] tracking-[0.12em] text-muted" role="status">
            {results.length} OF {products.length} PRODUCTS · SORT: {filters.sort.toUpperCase()}
          </p>
          <ProductGrid items={results.slice(0, visible)} />
          {visible < results.length && (
            <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-ghost mt-8 w-full">
              Load more ({results.length - visible} remaining)
            </button>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-auto rounded-t-2xl bg-ink-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display font-bold">Filters</p>
              <button onClick={() => setDrawer(false)} className="rounded-md border hairline px-3 py-1.5 text-sm" autoFocus>Done</button>
            </div>
            <ProductFilters filters={filters} onChange={setFilters} count={results.length} />
          </div>
        </div>
      )}
    </main>
  );
}
