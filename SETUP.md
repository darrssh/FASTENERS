# SETUP — Fasteners

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
2. **Catalog** — `src/data/products.ts` (24 sample products, all flagged `sample: true`).
   - Replace with real SKUs, grades, finishes, MOQs, prices, stock. Set `price: null` for quote-only items.
   - Categories live in `src/data/categories.ts` — add/remove without touching UI.
3. **Materials** — `src/data/categories.ts` → `materials[]` drives both the showcase copy and the 3D PBR configs in `src/lib/materials.ts`.
4. **Legal** — copy in `src/pages/LegalPage.tsx` (`DOCS` map). Placeholders must be reviewed by counsel.

## Connect commerce (currently DEMO)

- `commerceMode: 'demo'` — cart persists to `localStorage` (`fasteners-cart-v1`); checkout is simulated; quote form validates and stores to `fasteners-quotes-v1` locally. Nothing is emailed or charged — UI says so everywhere.
- **Shopify**: add Storefront API client, replace `useCart` persistence with cart API, map `products.ts` to Shopify handles. Keep `price: null` → “Request quote” logic.
- **Custom backend**: expose `POST /api/quotes` (multipart for drawings) and `POST /api/cart/checkout`; swap the simulated `setTimeout` blocks in `QuotePage.tsx` / `CartPage.tsx` for `fetch`, surface ticket IDs on success.

## 3D & assets

- Bolt/nut/washer are **procedural** (`src/lib/geometry.ts`) — no GLB downloads, no licenses, no broken paths. Tune `THREAD_PITCH` to change nut kinematics globally.
- Environment uses local `Lightformer` rigs (no remote HDRI fetch). Product/industry imagery is generated in-code (`ProductRender`, section SVGs). Swap any render key for real photography by replacing the component output per product.
