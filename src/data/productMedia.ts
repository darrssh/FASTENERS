import type { Product } from './products';

/**
 * Product media derived from the supplied WELTORQUE catalogue.
 * - `overview`: product illustration stored in `public/products/catalog/overview/Images`.
 * - `fullPage`: original unmodified catalogue page (secondary detail gallery view).
 * - `renders`: three technical 3D-style WebP views captured from the parametric model.
 *
 * Kept in a separate module so `products.ts`, the backend seed and the locked
 * scroll-driven bolt journey remain unchanged.
 */
const fileName = (product: Product) => product.images[0]?.split('/').pop()?.replace(/\.[^.]+$/, '') ?? product.id;

/** Hex-nut overviews are PNG; every screw overview in the folder is JPG. */
export const overviewImage = (product: Product) => {
  const base = fileName(product);
  const extension = base.startsWith('hex-nut-') ? 'png' : 'jpg';
  return `/products/catalog/overview/Images/${base}.${extension}`;
};

export const fullPageImage = (product: Product) => product.images[0] ?? '/favicon.svg';

export type RenderView = 'threequarter' | 'head' | 'side';
export const RENDER_VIEWS: { id: RenderView; label: string }[] = [
  { id: 'threequarter', label: '3/4 view' },
  { id: 'head', label: 'Head view' },
  { id: 'side', label: 'Side profile' },
];

export const productRender = (product: Product, view: RenderView) => `/products/renders/${product.id}-${view}.webp`;
export const productRenders = (product: Product) => RENDER_VIEWS.map((v) => ({ ...v, src: productRender(product, v.id) }));
