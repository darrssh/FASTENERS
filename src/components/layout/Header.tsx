import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { brand } from '../../data/brand';
import type { Product } from '../../data/products';
import { resolveMedia } from '../../lib/api';
import { useCatalog } from '../../hooks/useCatalog';
import { useCart } from '../../hooks/useCart';
import { cx, lockBodyScroll, unlockBodyScroll } from '../../lib/utils';
import { useDialogFocus } from '../../hooks/useDialogFocus';

type MenuCategory = {
  id: string;
  name: string;
  group: string;
  products: Product[];
};

/** Small catalogue thumbnail with a glyph fallback for products without an image. */
function MenuThumb({ product, size = 36 }: { product: Product; size?: number }) {
  const [failed, setFailed] = useState(false);
  const src = product.images?.[0];
  const box = { width: size, height: size } as const;
  if (!src || failed) {
    return (
      <span aria-hidden style={box} className="grid shrink-0 place-items-center rounded-md border hairline bg-white/[0.04] text-[13px] text-brass/70">✦</span>
    );
  }
  return (
    <img
      src={resolveMedia(src)}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      style={box}
      className="shrink-0 rounded-md border hairline bg-white object-contain p-0.5"
    />
  );
}

export function Header({ onSearch }: { onSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusPanelOnOpen = useRef(false);
  const location = useLocation();
  const cart = useCart();
  const { products, categories, categoryGroups } = useCatalog();
  const navigate = useNavigate();
  const drawerRef = useDialogFocus<HTMLDivElement>(mobile);

  // Build the menu from the live catalog (static fallback or API): every product
  // appears under its category, and products with an unknown/missing category
  // are still shown under "Other" so nothing is silently dropped.
  const { menuGroups, menuCategories } = useMemo(() => {
    const byCategory = new Map<string, Product[]>();
    for (const p of products) {
      const id = p.category || 'uncategorized';
      const list = byCategory.get(id);
      if (list) list.push(p);
      else byCategory.set(id, [p]);
    }
    const known = new Set(categories.map((c) => c.id));
    const cats: MenuCategory[] = categories.map((c) => ({
      id: c.id,
      name: c.name,
      group: c.group,
      products: byCategory.get(c.id) ?? [],
    }));
    byCategory.forEach((list, id) => {
      if (!known.has(id)) {
        cats.push({
          id,
          name: id === 'uncategorized' ? 'Other products' : id,
          group: 'Other',
          products: list,
        });
      }
    });
    const extraGroups = [...new Set(cats.filter((c) => !categoryGroups.includes(c.group)).map((c) => c.group))];
    return { menuGroups: [...categoryGroups, ...extraGroups], menuCategories: cats };
  }, [products, categories, categoryGroups]);

  const featured = products.find((p) => p.featured) ?? products[0];
  const productsActive = location.pathname.startsWith('/products');

  // Touch laptops fire mouseenter on first tap AND click — gate hover-open
  // to fine pointers so a tap doesn't open-then-instantly-close the menu.
  const hoverOpen = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) openMega();
  };

  const openMega = (moveFocus = false) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    focusPanelOnOpen.current = moveFocus;
    setMega(true);
  };
  const scheduleCloseMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 120);
  };
  const closeMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMega(false);
  };
  const closeMobile = () => {
    setMobile(false);
  };

  // Never let the dropdown stick around: close on route change or Escape.
  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [location.pathname, location.search]);

  // Keyboard users: close the mega menu once focus leaves trigger + panel.
  useEffect(() => {
    if (!mega) return;
    const onFocus = (e: FocusEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (!triggerRef.current?.contains(t) && !panelRef.current?.contains(t)) setMega(false);
    };
    document.addEventListener('focusin', onFocus);
    return () => document.removeEventListener('focusin', onFocus);
  }, [mega]);

  // ArrowDown from the trigger moves focus into the panel once it is mounted.
  useEffect(() => {
    if (!mega || !focusPanelOnOpen.current) return;
    focusPanelOnOpen.current = false;
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
  }, [mega]);

  useEffect(() => {
    if (!mega && !mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false);
        closeMobile();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mega, mobile]);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Reference-counted: opening Search on top of the drawer can't unlock early.
  useEffect(() => {
    if (!mobile) return;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [mobile]);

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-[60] transition-all duration-300',
          scrolled || mega ? 'border-b hairline bg-ink-950/85 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.7)] backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <div className="h-[2px] w-full bg-white/5" aria-hidden>
          <div className="h-full bg-gradient-to-r from-brass-dark via-brass to-brass-light transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="shell flex h-[68px] items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-3" aria-label="WELTOQ — home">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-brass/30 bg-gradient-to-br from-white/10 to-transparent shadow-premium transition-transform duration-300 group-hover:rotate-6">
              <svg width="24" height="24" viewBox="0 0 34 34" aria-hidden>
                <polygon points="9,3 23,3 29,9 29,23 23,29 9,29 3,23 3,9" fill="none" stroke="#E8D5A3" strokeWidth={2.5} />
                <circle cx="17" cy="17" r="5.5" fill="none" stroke="#C9A86A" strokeWidth={2.5} />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[13px] font-bold tracking-[0.18em]">WELTOQ</span>
              <span className="block text-[10px] tracking-[0.24em] text-muted">{brand.tagline.toUpperCase()} · {products.length} PRODUCTS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            <div ref={triggerRef} className="relative" onMouseEnter={hoverOpen} onMouseLeave={scheduleCloseMega}>
              <button
                type="button"
                className={cx(
                  'flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] hover:text-paper',
                  productsActive || mega ? 'text-paper' : 'text-silver',
                )}
                aria-expanded={mega}
                aria-controls="products-mega"
                onClick={() => setMega((v) => !v)}
                onFocus={hoverOpen}
                onKeyDown={(e) => {
                  if (e.key !== 'ArrowDown') return;
                  e.preventDefault();
                  // Hover-capable devices already open the panel on focus.
                  if (mega) panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
                  else openMega(true);
                }}
              >
                Products
                <span aria-hidden className={cx('text-[10px] transition-transform duration-200', mega && 'rotate-180')}>▾</span>
              </button>
            </div>
            {[
              ['Industries', '/industries'],
              ['About Us', '/about'],
              ['Contact', '/contact'],
            ].map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cx('text-[13px] font-semibold uppercase tracking-[0.14em] hover:text-paper', isActive ? 'text-paper' : 'text-silver')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onSearch} className="rounded-lg border hairline bg-white/[0.02] p-2.5 text-silver backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brass/50 hover:text-brass-light" aria-label="Search products">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.8" /><line x1="12.5" y1="12.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth="1.8" /></svg>
            </button>
            <button type="button" onClick={() => navigate('/cart')} className="relative rounded-lg border hairline bg-white/[0.02] p-2.5 text-silver backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brass/50 hover:text-brass-light" aria-label={`Cart, ${cart.count} items`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden><path d="M2 3h2.5l2 9h8l2-6H6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="7.5" cy="15" r="1.4" fill="currentColor" /><circle cx="13.5" cy="15" r="1.4" fill="currentColor" /></svg>
              {cart.count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 min-w-[20px] rounded-full bg-gradient-to-br from-brass-light to-brass-dark px-1.5 text-center text-[11px] font-bold leading-5 text-black">{cart.count}</span>
              )}
            </button>
            <Link to="/quote" className="btn-primary hidden !px-5 !py-2.5 md:inline-flex">Request a quote</Link>
            <button
              type="button"
              onClick={() => setMobile(true)}
              className="rounded-lg border hairline p-2.5 text-silver lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobile}
              aria-controls="mobile-nav"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden><line x1="2" y1="4.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="1.8" /><line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth={1.8} /><line x1="2" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth={1.8} /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Products dropdown: viewport-centered (never anchored to the small
          trigger, so it can't overflow one side), height-capped with its own
          scroll, dismissible via backdrop / Escape / route change. Every
          catalog product is reachable, grouped by its category. */}
      {mega && (
        <div className="fixed inset-0 z-[59] hidden lg:block">
          <div className="absolute bottom-0 left-0 right-0 top-[70px] bg-black/55" onClick={closeMega} aria-hidden />
          <div
            ref={panelRef}
            className="absolute left-1/2 top-[74px] w-[min(980px,calc(100vw-2rem))] -translate-x-1/2"
            onMouseEnter={hoverOpen}
            onMouseLeave={scheduleCloseMega}
          >
            <nav id="products-mega" className="card-premium max-h-[calc(100vh-110px)] overflow-auto bg-ink-900/95 p-5 backdrop-blur-xl" aria-label="Product categories and products">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b hairline pb-4">
                <div>
                  <p className="eyebrow">Catalogue · {products.length} products</p>
                  <p className="mt-1 font-display text-lg font-semibold">Find your fastener</p>
                </div>
                <p className="text-[12px] text-muted">Browse by category.</p>
              </div>

              {menuGroups.map((group) => {
                const groupCats = menuCategories.filter((c) => c.group === group);
                if (groupCats.length === 0) return null;
                return (
                  <section key={group} className="mt-5" aria-label={group}>
                    <p className="eyebrow mb-3">{group}</p>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {groupCats.map((c) => (
                        <Link
                          key={c.id}
                          to={`/products?category=${encodeURIComponent(c.id)}`}
                          onClick={closeMega}
                          className="group/cat flex items-center justify-between gap-2 rounded-xl border hairline bg-white/[0.02] px-4 py-3 transition-colors hover:border-brass/40 hover:bg-white/[0.04]"
                        >
                          <span className="font-display text-[13px] font-semibold text-paper transition-colors group-hover/cat:text-brass-light">
                            {c.name}
                          </span>
                          <span className="text-[11px] text-muted-dim">{c.products.length}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}

              {featured && (
                <section className="mt-5 rounded-xl border border-brass/25 bg-gradient-to-r from-brass/[0.08] to-transparent p-3" aria-label="Featured product">
                  <p className="eyebrow mb-2">Featured product</p>
                  <div className="flex items-center gap-3">
                    <MenuThumb product={featured} size={52} />
                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${featured.slug}`} onClick={closeMega} className="font-display text-[14px] font-semibold hover:text-brass-light">
                        {featured.name}
                      </Link>
                      <p className="truncate text-[12px] text-muted">{featured.shortDescription}</p>
                    </div>
                    <Link to={`/products/${featured.slug}`} onClick={closeMega} className="btn-ghost !px-3 !py-2 !text-[12px]">View</Link>
                  </div>
                </section>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-4">
                <p className="text-[13px] text-muted">Full catalog — {products.length} WELTORQUE catalogue products. <span className="text-brass">PBR + scroll-story inside.</span></p>
                <Link to="/products" onClick={closeMega} className="btn-primary !py-2.5 !px-5">
                  View all products
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {mobile && (
        <div ref={drawerRef} className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="absolute inset-0 bg-black/70" onClick={closeMobile} />
          <div id="mobile-nav" className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto overscroll-contain bg-ink-900 p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold tracking-[0.18em]">MENU</p>
              <button type="button" onClick={closeMobile} className="rounded-md border hairline px-3 py-1.5 text-sm" autoFocus>Close</button>
            </div>
            <nav className="mt-6 flex flex-col" aria-label="Mobile">
              {[
                ['Home', '/'],
                ['Products', '/products'],
                ['Industries', '/industries'],
                ['About Us', '/about'],
                ['Contact', '/contact'],
                ['Cart', '/cart'],
              ].map(([label, to]) => (
                <Link key={to} to={to} onClick={closeMobile} className="flex min-h-[44px] items-center border-b hairline text-lg font-semibold">
                  {label}
                </Link>
              ))}
            </nav>

            <p className="eyebrow mb-2 mt-6">Categories · {products.length} products</p>
            <div className="space-y-4">
              {menuGroups.map((group) => {
                const groupCats = menuCategories.filter((c) => c.group === group);
                if (groupCats.length === 0) return null;
                return (
                  <div key={group}>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-dim">{group}</p>
                    <ul className="divide-y hairline rounded-xl border hairline">
                      {groupCats.map((c) => (
                        <li key={c.id}>
                          <Link
                            to={`/products?category=${encodeURIComponent(c.id)}`}
                            onClick={closeMobile}
                            className="flex min-h-[48px] items-center justify-between gap-2 px-3 text-[14px] font-semibold transition-colors hover:text-brass-light"
                          >
                            <span className="truncate">{c.name}</span>
                            <span className="text-[11px] font-normal text-muted-dim">{c.products.length}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <Link to="/products" onClick={closeMobile} className="btn-ghost mt-4 !py-2.5">View all products</Link>

            <div className="mt-auto flex flex-col gap-2 pt-6">
              <button type="button" onClick={() => { closeMobile(); onSearch(); }} className="btn-ghost">Search</button>
              <Link to="/quote" onClick={closeMobile} className="btn-primary">Request a quote</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
