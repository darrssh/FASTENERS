# WELTOQ API (Python + FastAPI + PostgreSQL)

Backend for the WELTOQ storefront. It holds the catalog in PostgreSQL,
seeds the 41 WELTORQUE PDF products / 6 categories, exposes public read APIs
for the storefront, stores COD orders and quote requests, and exposes admin-only
APIs (JWT auth) used by the `/admin` page in the React app. Admin notification is
in-app only (unread badge + Orders/Quotes panels); no email/SMTP/WhatsApp or
online payment integration is configured.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | – | Health check |
| GET | `/api/categories` | – | List categories |
| GET | `/api/products` | – | List products (`?category=&q=&featured=&limit=`) |
| GET | `/api/products/{slug}` | – | Product detail |
| GET | `/api/stored-images/{id}` | – | Uploaded image bytes |
| POST | `/api/orders` | – | Place a COD order (server recomputes prices/MOQ) |
| GET | `/api/orders/{order_number}?email=` | – | Look up an order by reference + email |
| POST | `/api/quotes` | – | Submit a quote request (multipart, optional drawing) |
| GET | `/api/quotes/{quote_number}?email=` | – | Look up a quote by reference + email |
| POST | `/api/auth/login` | – | Admin login → JWT |
| GET | `/api/auth/me` | admin | Current admin |
| GET | `/api/admin/products` | admin | List all products |
| POST | `/api/admin/products` | admin | Create product |
| PUT | `/api/admin/products/{id}` | admin | Update product |
| DELETE | `/api/admin/products/{id}` | admin | Delete product |
| POST | `/api/admin/uploads` | admin | Upload product image (multipart) |
| GET | `/api/admin/summary` | admin | Unread order/quote counts (notification badge) |
| POST | `/api/admin/notifications/read-all` | admin | Mark all orders/quotes as read |
| GET | `/api/admin/orders` | admin | List COD orders |
| PATCH | `/api/admin/orders/{id}` | admin | Update order status (marks read) |
| POST | `/api/admin/orders/{id}/read` | admin | Mark one order as read |
| GET | `/api/admin/quotes` | admin | List quote requests |
| PATCH | `/api/admin/quotes/{id}` | admin | Update quote status (marks read) |
| POST | `/api/admin/quotes/{id}/read` | admin | Mark one quote as read |
| GET | `/api/admin/quotes/{id}/attachment` | admin | Download a stored drawing |

Interactive docs: `/docs` (Swagger UI) and `/redoc`.

## Local development

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env    # edit values
uvicorn app.main:app --reload  # http://localhost:8000/docs
```

On first boot it creates all tables (catalog, stored images, orders, order items,
quote requests), seeds the catalog from `seed/seed_data.json`, and creates the admin
user from `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Existing databases get new tables on restart
via `Base.metadata.create_all()`; no manual SQL is required.

Orders store the customer/delivery snapshot, server-computed totals, COD status, and
an `isRead` flag for the in-app admin notification. The browser sends only product IDs
and quantities — prices, SKUs, names, and MOQs are re-read from the DB. Quote drawings
(up to 10 MB; PDF/PNG/JPG/STEP/STP/DXF) are stored in the database beside the request.

Re-seed from scratch:

```powershell
python -m app.seed --force
```

Existing SQLite databases are migrated automatically on startup: the
`catalog_page`, `catalog_intro` and `applications` columns are added once, and
the first boot after the migration re-seeds from `seed/seed_data.json`. You do
not need to delete `fasteners.db` manually.

The seed file is generated from the frontend source of truth with:

```powershell
node --experimental-strip-types scripts/export-seed.mjs   # run from repo root
```

## PostgreSQL

Set `DATABASE_URL` to your PostgreSQL instance. Any of these work:
`postgresql://user:pass@host:5432/dbname`, or a managed URL from Neon / Supabase /
Render (`postgres://` is normalized automatically).

## Deploy

See `render.yaml` at the repo root and the deployment section in the top-level
README. Uploaded images are stored in the database, so they survive redeploys on
ephemeral free hosts.
