import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../data/products';
import { formatINR } from '../../lib/utils';
import { ProductRender } from './ProductRender';
import { useCart } from '../../hooks/useCart';

const STOCK_LABEL: Record<Product['stockStatus'], string> = {
  'in-stock': 'In stock',
  'low-stock': 'Low stock',
  'made-to-order': 'Made to order',
  'quote-only': 'Quote only',
};

const STOCK_STYLE: Record<Product['stockStatus'], string> = {
  'in-stock': 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  'low-stock': 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  'made-to-order': 'border-brass/30 bg-brass/10 text-brass-light',
  'quote-only': 'border-white/15 bg-white/5 text-muted',
};

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const [wish, setWish] = useState(false);
  return (
    <article className="card card-hover-lift group flex flex-col overflow-hidden" aria-label={product.name}>
      <Link to={`/products/${product.slug}`} className="img-zoom relative block overflow-hidden" aria-label={`View ${product.name}`}>
        <ProductRender renderKey={product.images[0]} name={product.name} />
        <button
          aria-label="Toggle wishlist"
          onClick={(e) => { e.preventDefault(); setWish((w) => !w); }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/50 text-[16px] backdrop-blur transition-all hover:scale-110 hover:border-brass/60"
        >
          <span className={wish ? 'text-brass' : 'text-silver'}>{wish ? '★' : '☆'}</span>
        </button>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brass/90">{product.material} · {product.diameter}</p>
        <Link to={`/products/${product.slug}`} className="font-display text-[19px] font-semibold leading-snug hover:text-brass-light hover:underline hover:decoration-brass/60 hover:underline-offset-4">
          {product.name}
        </Link>
        <p className="text-[12px] tracking-[0.14em] text-muted-dim">SKU {product.sku}</p>
        <p className="text-[13px] text-muted">Sizes: {product.availableSizes.slice(0, 3).join(' · ')}{product.availableSizes.length > 3 ? ' +' : ''}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="font-display text-[17px] font-bold">{formatINR(product.price, product.currency)}</p>
          <span className={`rounded-full border px-2.5 py-1 text-[11px] ${STOCK_STYLE[product.stockStatus]}`}>{STOCK_LABEL[product.stockStatus]}</span>
        </div>
        <div className="mt-2 flex gap-2">
          {product.price !== null ? (
            <button
              className="btn-primary flex-1 !px-3 !py-2.5 !text-[12px]"
              onClick={() => {
                cart.add(product.id, product.availableSizes[0], 1);
                setAdded(true);
                setTimeout(() => setAdded(false), 1800);
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? '✓ Added' : 'Add to cart'}
            </button>
          ) : (
            <Link to={`/quote?product=${product.id}`} className="btn-primary flex-1 !px-3 !py-2.5 !text-[12px]">Get quote</Link>
          )}
          <Link to={`/products/${product.slug}`} className="btn-ghost !px-3 !py-2.5 !text-[12px]" aria-label={`Details for ${product.name}`}>→</Link>
        </div>
      </div>
    </article>
  );
}
