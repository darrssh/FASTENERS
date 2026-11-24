# TESTING SUMMARY

## Implemented
- Cinematic hero (4-phase GSAP open, procedural bolt, studio lighting, fallback SVG) + 8-scene GSAP-ScrollTrigger bolt journey (pitch-locked nut, washer split, exploded view, reassembly, industrial wash, final CTA) with persistent scene + reversible progress.
- Full site: Home (hero, journey, anatomy, categories, showcase, materials PBR lab, industries, why, featured, bulk, testimonials-placeholders, FAQ, final CTA, footer) + Catalog (search, 8 filters, 4 sorts, count, load-more, drawer, empty state) + Detail (specs, variants, qty, real cart/quote CTAs, related, mini 3D viewer, PDF-sourced catalogue intro and common applications) + About/Industries (editable) + Quote (14 fields + drawing upload + validation/loading/success/error, backend-backed) + Contact (local draft) + Cart (qty/remove/subtotal/persist/clear/COD checkout) + Checkout (backend COD order placement, order confirmation) + Admin (Orders, Quotes, Products tabs with unread badge) + 4 legal placeholders + 404.
- Catalogue fidelity: 41 PDF pages → 41 products, each with its original page image, exact technical description, exact specification rows and 5 application bullets. Verify a few detail pages against `Weltorque cat.pdf` (e.g. page 1 → `/products/m2-shcs-10`, page 26 → `/products/m8-shcs-10`, page 41 → `/products/rh-thread-nuts-m8`).
- Design system: exact palette/typography/spacing from §5, responsive (desktop/tablet/mobile), reduced-motion + WebGL fallbacks, a11y (skip link, semantics, labels, focus, live regions), SEO meta per page.
- Commerce: custom FastAPI backend with COD-only orders, server-side price/MOQ validation, backend quote requests with optional drawing storage, and in-app admin notifications (`isRead` + unread summary). No online payment, email, SMTP, or WhatsApp integration is configured.

## QA gates (run before delivery)
```powershell
npm run typecheck   # tsc --noEmit
npm run build       # typecheck + vite build
```
Manual checklist (§43): logo→home; mega-menu + category links (6 categories only); search opens + finds “M4”; cart badge/add/qty/remove/persist/empty; quote CTA; mobile drawer; hero model + headline + CTAs; journey forward/reverse/fast/slow/resize; nut rotates while traveling; washer splits; exploded labels; reassembly; catalog search/filter/sort/empty-state (41 products only); detail variants/quote actions; forms reject bad email + oversize files; desktop/tablet/mobile, no horizontal overflow, 3D never covers CTAs.

Commerce checklist:
1. Start the backend and confirm `GET /api/health` returns OK; `/api/products` returns 41 products and `/api/categories` returns 6.
2. Add a product to the cart → `/cart` → `/checkout` → place a COD order. Confirm the success screen shows an `ORD-…` reference and server-computed total, and that no payment fields are present.
3. Sign in at `/admin`. Confirm the order appears under **Orders** with the unread badge, customer/delivery details, line items, and COD total. Change its status and mark it read.
4. Submit `/quote` with and without a drawing. Confirm a `QUO-…` reference appears and each request appears under **Admin → Quotes**; download an attached drawing.
5. Attempt to tamper with a cart price in browser storage and place an order — the backend invoice must use the DB price, not the browser value.
6. Attempt an order below MOQ or with a quote-only product — the API must reject it with a clear message.

## Known limitations (honest, per brief)
- Payment is COD only. No online payment, email/CRM notification, or stock decrement exists; admin notification is the in-app Orders/Quotes panel and unread badge on `/admin`.
- Technical descriptions, specification tables, applications and images are exact WELTORQUE PDF content. Prices, MOQ and stock are the current acting catalogue values because the PDF contains no commercial data; testimonials and company info remain placeholders — replace before launch; never use sample torque/safety notes for real joints.
- No remote HDRIs or stock photography: 3D visuals are procedural and product photos are the original PDF page images (see ASSETS.md).
- External integrations requiring credentials are intentionally absent (Shopify, email provider, analytics).
