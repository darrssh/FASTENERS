import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchOverlay } from './components/products/ProductSearch';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { QuotePage } from './pages/QuotePage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LegalPage, NotFoundPage } from './pages/LegalPage';
import { AdminPage } from './pages/AdminPage';
import { RenderHarnessPage } from './pages/RenderHarnessPage';
import { useReducedMotion, useIsMobile } from './hooks/useMediaQuery';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Temporarily disable CSS smooth-scroll: behavior:'auto' still inherits it.
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      // Pathname-only: query-param changes (catalog typing) must NOT yank scroll.
      window.scrollTo(0, 0);
    }
    root.style.scrollBehavior = previous;
  }, [pathname, hash]);
  return null;
}

function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const isRenderHarness = pathname.includes('/__render');

  if (isRenderHarness) {
    return (
      <Routes>
        <Route path="/__render/:id/:view" element={<RenderHarnessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }

  return (
    <>
      <ScrollToTop />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <Header onSearch={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <div id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage reducedMotion={reducedMotion} isMobile={isMobile} />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/legal/:doc" element={<LegalPage />} />
          {import.meta.env.DEV && <Route path="/__render/:id/:view" element={<RenderHarnessPage />} />}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export function App() {
  // '/FASTENERS' on GitHub Pages project hosting, '' in local dev.
  const basename = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

  return (
    <BrowserRouter basename={basename || undefined}>
      <AppShell />
    </BrowserRouter>
  );
}