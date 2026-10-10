import { Link } from 'react-router-dom';
import { brand, contactHref } from '../../data/brand';
import { categories } from '../../data/categories';
import { useReveal } from '../../hooks/useScrollProgress';

export function Footer() {
  const email = contactHref('email');
  const phone = contactHref('phone');
  const ref = useReveal<HTMLElement>(true);
  return (
    <footer ref={ref} className="relative overflow-hidden border-t hairline bg-ink-900" aria-label="Footer">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/60 to-transparent" aria-hidden />
      <div className="shell grid gap-10 py-14 md:grid-cols-4">
        <div data-reveal>
          <p className="font-display text-sm font-bold tracking-[0.18em]">FASTENERS</p>
          <p className="mt-1 text-[12px] tracking-[0.2em] text-muted">ENGINEERED TO HOLD · BUILT TO LAST</p>
          <p className="mt-4 max-w-xs text-[14px] text-muted">
            Precision-engineered fasteners for industrial applications, construction, and manufacturing. Sample catalog demo.
          </p>
          <div className="mt-4 space-y-1 text-[14px] text-muted">
            <p>Email: {email ? <a className="text-paper underline decoration-brass/60 underline-offset-4 hover:text-brass-light" href={email}>{brand.supportEmail}</a> : <span className="text-muted-dim">[not provided — edit src/data/brand.ts]</span>}</p>
            <p>Phone: {phone ? <a className="text-paper underline decoration-brass/60 underline-offset-4 hover:text-brass-light" href={phone}>{brand.phone}</a> : <span className="text-muted-dim">[not provided]</span>}</p>
            <p>Address: {brand.address || <span className="text-muted-dim">[not provided]</span>}</p>
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-ghost mt-5 !px-4 !py-2.5 !text-[12px]">
            ↑ Back to top
          </button>
        </div>
        <nav aria-label="Products" data-reveal>
          <p className="eyebrow mb-4">Products</p>
          <ul className="space-y-2.5 text-[14px]">
            {categories.slice(0, 7).map((c) => (
              <li key={c.id}><Link className="text-muted transition-colors hover:text-brass-light" to={`/products?category=${c.id}`}>{c.name}</Link></li>
            ))}
            <li><Link className="text-brass-light underline underline-offset-4" to="/products">View all →</Link></li>
          </ul>
        </nav>
        <nav aria-label="Company" data-reveal>
          <p className="eyebrow mb-4">Company</p>
          <ul className="space-y-2.5 text-[14px]">
            {[['About Us', '/about'], ['Industries', '/industries'], ['Request a Quote', '/quote'], ['Contact', '/contact'], ['Cart (demo)', '/cart']].map(([l, to]) => (
              <li key={to}><Link className="text-muted transition-colors hover:text-brass-light" to={to}>{l}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legal" data-reveal>
          <p className="eyebrow mb-4">Legal · Placeholders</p>
          <ul className="space-y-2.5 text-[14px]">
            {[['Privacy Policy', '/legal/privacy'], ['Terms & Conditions', '/legal/terms'], ['Shipping Policy', '/legal/shipping'], ['Returns & Refunds', '/legal/returns']].map(([l, to]) => (
              <li key={to}><Link className="text-muted transition-colors hover:text-brass-light" to={to}>{l}</Link></li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl border border-brass/20 bg-brass/[0.06] p-3 text-[12px] leading-relaxed text-muted">
            Demo storefront: cart & quote submit locally only. No real checkout, backend, or business claims wired yet.
          </p>
        </nav>
      </div>
      <div className="shell pb-6" aria-hidden data-reveal>
        <p className="text-stroke select-none text-center font-display text-[clamp(48px,10vw,150px)] font-bold uppercase leading-none opacity-40" data-parallax="-24">
          FASTENERS
        </p>
      </div>
      <div className="border-t hairline">
        <div className="shell flex flex-col gap-2 py-5 text-[12px] text-muted-dim md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {brand.brandName} (sample). All sample content — replace before launch.</p>
          <p>Currency: {brand.currency} · Commerce mode: DEMO (see SETUP.md)</p>
        </div>
      </div>
    </footer>
  );
}
