# SETUP — WELTOQ

## Install & run

```powershell
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build -> dist/
npm run preview  # serve dist/ locally
```

Node 20+ recommended (tested on Node 24, Windows PowerShell 5.1).

## Configure the business

1. **Identity & contact** — `src/data/brand.ts`
   - `brandName`, `supportEmail`, `phone`, `address`, `businessHours`, `whatsapp`, social links, `currency`.
   - Empty strings render as honest “[not provided]” placeholders — fill before launch.
2. **Catalog** — `src/data/products.ts` (exactly 41 products).
   - All 41 products are sourced from `Weltorque cat.pdf` — one per PDF page (SHCS, Ultraflat Head Fastener, Hex Nuts): exact technical description, 9–11 row specification table, "Common applications" list and the original page image. They carry `catalogPage`, `catalogIntro`/`applications` and images under `/products/catalog/`.
   - No demo/Excel products remain. Prices, MOQ and stock are the acting catalogue values used by COD checkout; the PDF contains no commercial data, so replace them if a real price list is supplied. Set `price: null` for quote-only items.
   - Technical attributes (`standard`, `strength`, `propertyClass`, `fastenerType`, `remark`) are first-class fields, editable in `/admin`, along with the PDF fields (catalogue page, intro, applications).
   - After editing the catalog, regenerate the backend seed: `node --experimental-strip-types scripts/export-seed.mjs`, then `cd backend` and `python -m app.seed --force`.
   - Categories live in `src/data/categories.ts` — add/remove without touching UI.
3. **Materials** — `src/data/categories.ts` → `materials[]` drives both the showcase copy and the 3D PBR configs in `src/lib/materials.ts`.
4. **Legal** — copy in `src/pages/LegalPage.tsx` (`DOCS` map). Placeholders must be reviewed by counsel.

## Commerce (custom backend, COD only)

Real ordering is enabled through the custom FastAPI backend in `backend/`. There is no
online payment and no card/UPI/Shopify checkout.

1. **Start the backend**
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   Copy-Item .env.example .env   # edit secrets/admin credentials
   uvicorn app.main:app --reload --port 8001 # http://127.0.0.1:8001/docs
   ```
   Tables for orders, order items and quote requests are created on startup.
2. **Point the storefront at the API**
   - Local dev: leave `VITE_API_BASE_URL` empty; Vite proxies `/api` to `http://127.0.0.1:8001` (port 8001 avoids conflicts with other local servers).
   - Production/GitHub Pages: set `VITE_API_BASE_URL=https://your-api-host` at build time.
   - `brand.commerceMode` is `'custom'`.
3. **Order flow**
   - Cart drafts still persist in `localStorage` (`fasteners-cart-v2`), but submission is real.
   - `/checkout` collects delivery details and calls `POST /api/orders`.
   - The server recomputes every line price from the DB, rejects quote-only products and
     quantities below MOQ, and returns an order number. The browser cannot set the total.
   - New orders are stored with `isRead = false` and appear in `/admin → Orders`.
   - Payment is cash on delivery only; shipping and tax are currently not charged.
4. **Quote flow**
   - `/quote` calls `POST /api/quotes` (multipart, optional drawing up to 10 MB).
   - New quote requests are stored with `isRead = false` and appear in `/admin → Quotes`.
   - Admin can update status, mark as read, and download attached drawings.
5. **Admin notifications**
   - The in-app badge on `/admin` uses `GET /api/admin/summary`; `POST /api/admin/notifications/read-all`
     clears it. No email, SMTP, or WhatsApp integration is configured.

## 3D & assets

- Bolt/nut/washer are **procedural** (`src/lib/geometry.ts`) — no GLB downloads, no licenses, no broken paths. Tune `THREAD_PITCH` to change nut kinematics globally.
- Environment uses local `Lightformer` rigs (no remote HDRI fetch). All 41 products use the original images from `Weltorque cat.pdf` (`public/products/catalog/`). The procedural `ProductRender` is only an SVG fallback if an image fails to load. Swap any `images[]` path to change a product visual.


Default local admin credentials are in `backend/.env.example`; change them before deployment.