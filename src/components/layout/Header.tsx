import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { brand } from '../../data/brand';
import { categories, categoryGroups } from '../../data/categories';
import { products } from '../../data/products';
import { useCart } from '../../hooks/useCart';
import { cx } from '../../lib/utils';

export function Header({ onSearch }: { onSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const location = useLocation();
  const cart = useCart();
  const navigate = useNavigate();

  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMega(true);
  };
  const scheduleCloseMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(false), 120);
  };

  // Never let the dropdown stick around: close on route change or Escape.
  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false);
        setMobile(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
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
          <Link to="/" className="group flex items-center gap-3" aria-label="Fasteners — home">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-brass/30 bg-gradient-to-br from-white/10 to-transparent shadow-premium transition-transform duration-300 group-hover:rotate-6">
              <svg width="24" height="24" viewBox="0 0 34 34" aria-hidden>
                <polygon points="9,3 23,3 29,9 29,23 23,29 9,29 3,23 3,9" fill="none" stroke="#E8D5A3" strokeWidth={2.5} />
                <circle cx="17" cy="17" r="5.5" fill="none" stroke="#C9A86A" strokeWidth={2.5} />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[13px] font-bold tracking-[0.18em]">FASTENERS</span>
              <span className="block text-[10px] tracking-[0.24em] text-muted">{brand.tagline.toUpperCase()} · {products.length} PRODUCTS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            <div className="relative" onMouseEnter={openMega} onMouseLeave={scheduleCloseMega}>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-silver hover:text-paper"
                aria-expanded={mega}
                aria-haspopup="true"
                onClick={() => setMega((v) => !v)}
                onFocus={openMega}
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
            <button onClick={onSearch} className="rounded-lg border hairline bg-white/[0.02] p-2.5 text-silver backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brass/50 hover:text-brass-light" aria-label="Search products">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.8" /><line x1="12.5" y1="12.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth="1.8" /></svg>
            </button>
            <button onClick={() => navigate('/cart')} className="relative rounded-lg border hairline bg-white/[0.02] p-2.5 text-silver backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brass/50 hover:text-brass-light" aria-label={`Cart, ${cart.count} items`}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden><path d="M2 3h2.5l2 9h8l2-6H6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="7.5" cy="15" r="1.4" fill="currentColor" /><circle cx="13.5" cy="15" r="1.4" fill="currentColor" /></svg>
              {cart.count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 rounded-full bg-gradient-to-br from-brass-light to-brass-dark px-1.5 text-[11px] font-bold text-black">{cart.count}</span>
              )}
            </button>
            <Link to="/quote" className="btn-primary hidden !px-5 !py-2.5 md:inline-flex">Request a quote</Link>
            <button onClick={() => setMobile(true)} className="rounded-lg border hairline p-2.5 text-silver lg:hidden" aria-label="Open menu">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden><line x1="2" y1="4.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="1.8" /><line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth={1.8} /><line x1="2" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth={1.8} /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Products mega panel: viewport-centered (never anchored to the small
          trigger, so it can't overflow one side), height-capped with its own
          scroll, dismissible via backdrop / Escape / route change. */}
      {mega && (
        <div className="fixed inset-0 z-[59] hidden lg:block" role="presentation">
          <div className="absolute bottom-0 left-0 right-0 top-[70px] bg-black/55" onClick={() => setMega(false)} aria-hidden />
          <div
            className="absolute left-1/2 top-[74px] w-[min(880px,calc(100vw-2rem))] -translate-x-1/2"
            onMouseEnter={openMega}
            onMouseLeave={scheduleCloseMega}
            role="menu"
            aria-label="Product categories"
          >
            <div className="card-premium max-h-[calc(100vh-110px)] overflow-auto bg-ink-900/95 p-6 backdrop-blur-xl">
              <div className="grid grid-cols-3 gap-6">
                {categoryGroups.map((g) => (
                  <div key={g}>
                    <p className="eyebrow mb-3">{g}</p>
                    <ul className="space-y-2">
                      {categories.filter((c) => c.group === g).slice(0, 5).map((c) => (
                        <li key={c.id}>
                          <Link
                            to={`/products?category=${c.id}`}
                            onClick={() => setMega(false)}
                            className="group/link flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-brass-light"
                          >
                            <span className="h-px w-0 bg-brass transition-all duration-300 group-hover/link:w-3" aria-hidden />
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t hairline pt-4">
                <p className="text-[13px] text-muted">Full catalog — {products.length} Excel products. <span className="text-brass">PBR + scroll-story inside.</span></p>
                <Link to="/products" onClick={() => setMega(false)} className="btn-primary !py-2.5 !px-5">
                  View all products
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {mobile && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobile(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-ink-900 p-6">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-bold tracking-[0.18em]">MENU</p>
              <button onClick={() => setMobile(false)} className="rounded-md border hairline px-3 py-1.5 text-sm" autoFocus>Close</button>
            </div>
            <nav className="mt-6 flex flex-col gap-4" aria-label="Mobile">
              {[
                ['Home', '/'],
                ['Products', '/products'],
                ['Industries', '/industries'],
                ['About Us', '/about'],
                ['Contact', '/contact'],
                ['Cart (demo)', '/cart'],
              ].map(([label, to]) => (
                <Link key={to} to={to} onClick={() => setMobile(false)} className="border-b hairline pb-3 text-lg font-semibold">
                  {label}
                </Link>
              ))}
            </nav>
            <p className="eyebrow mb-2 mt-6">Categories</p>
            <div className="flex flex-wrap gap-2 overflow-auto">
              {categories.slice(0, 12).map((c) => (
                <Link key={c.id} to={`/products?category=${c.id}`} onClick={() => setMobile(false)} className="rounded-full border hairline px-3 py-1.5 text-[13px] text-muted">
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <button onClick={() => { setMobile(false); onSearch(); }} className="btn-ghost">Search</button>
              <Link to="/quote" onClick={() => setMobile(false)} className="btn-primary">Request a quote</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
