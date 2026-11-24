"""FastAPI application entrypoint."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from .config import get_settings
from .database import Base, SessionLocal, engine
from .migrations import ensure_schema
from .routers import admin, admin_commerce, auth, catalog, orders
from .seed import run_seed

settings = get_settings()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Create tables, apply additive migrations, then seed on first boot.
    Base.metadata.create_all(bind=engine)
    added_columns = ensure_schema()
    if settings.seed_on_startup:
        db = SessionLocal()
        try:
            # A fresh column means the rows predate the WELTORQUE catalogue
            # data, so replace them once with the regenerated seed payload.
            result = run_seed(db, force=bool(added_columns))
            print(f"[seed] {result}")
            if added_columns:
                print(f"[migrate] added product columns: {', '.join(added_columns)}")
        finally:
            db.close()
    yield


app = FastAPI(
    title="WELTOQ API",
    description="Backend for the WELTOQ storefront — catalog, COD orders, quotes, and admin management.",
    version="1.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(catalog.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(admin_commerce.router)


@app.get("/api/health", tags=["meta"])
def health() -> dict:
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def root() -> RedirectResponse:
    return RedirectResponse(url="/docs")
