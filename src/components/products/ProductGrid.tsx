import type { Product } from '../../data/products';
import { products } from '../../data/products';
import { ProductCard } from './ProductCard';

export function ProductGrid({ items, onClear }: { items: Product[]; onClear: () => void }) {
  if (items.length === 0) {
    return (
      <div className="card p-10 text-center" role="status">
        <p className="eyebrow">No matches</p>
        <h3 className="mt-2 font-display text-2xl font-bold">No products match those filters.</h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] text-muted">
          Try clearing a filter or searching by SKU, material, or category. Full catalog — {products.length} Excel products.
        </p>
        {/* In-app reset, not an <a href>: no full-page reload, no lost SPA state. */}
        <button type="button" onClick={onClear} className="btn-ghost mt-5 inline-flex">Clear all filters</button>
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" role="list">
      {items.map((p) => (
        <div key={p.id} role="listitem" className="min-w-0"><ProductCard product={p} /></div>
      ))}
    </div>
  );
}
