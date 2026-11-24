"""Seed the database with the existing storefront catalog.

The catalog JSON is generated from the frontend source of truth by
`scripts/export-seed.mjs`, so the DB starts with the exact same 41 products
from the WELTORQUE PDF catalogue, their 6 categories and original image paths.
"""
import argparse
import json
from pathlib import Path

from sqlalchemy.orm import Session

from .config import get_settings
from .database import Base, SessionLocal, engine
from .migrations import ensure_schema
from .models import AdminUser, Category, Product
from .security import hash_password

SEED_FILE = Path(__file__).resolve().parent.parent / "seed" / "seed_data.json"


def load_seed_payload() -> dict:
    if not SEED_FILE.exists():
        raise FileNotFoundError(
            f"Seed file not found: {SEED_FILE}. "
            "Run `node --experimental-strip-types scripts/export-seed.mjs` first."
        )
    return json.loads(SEED_FILE.read_text(encoding="utf-8"))


def ensure_admin(db: Session) -> bool:
    settings = get_settings()
    email = settings.admin_email.strip().lower()
    existing = db.query(AdminUser).filter(AdminUser.email == email).first()
    if existing:
        return False
    db.add(
        AdminUser(
            email=email,
            hashed_password=hash_password(settings.admin_password),
            is_active=True,
        )
    )
    db.commit()
    return True


def run_seed(db: Session, force: bool = False) -> dict:
    payload = load_seed_payload()
    categories = payload.get("categories", [])
    products = payload.get("products", [])

    created_categories = 0
    created_products = 0

    if force:
        db.query(Product).delete()
        db.query(Category).delete()
        db.commit()

    if db.query(Category).count() == 0:
        for c in categories:
            db.add(Category(**c))
        db.commit()
        created_categories = len(categories)

    if db.query(Product).count() == 0:
        for p in products:
            db.add(Product(**p))
        db.commit()
        created_products = len(products)

    created_admin = ensure_admin(db)

    return {
        "categories": created_categories,
        "products": created_products,
        "admin_created": created_admin,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed the WELTOQ database.")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Delete existing products/categories and re-import from seed_data.json.",
    )
    args = parser.parse_args()

    Base.metadata.create_all(bind=engine)
    added_columns = ensure_schema()
    if added_columns:
        print(f"[migrate] added product columns: {', '.join(added_columns)}")
    db = SessionLocal()
    try:
        result = run_seed(db, force=args.force)
        print(
            f"Seed complete: {result['products']} products, "
            f"{result['categories']} categories, "
            f"admin {'created' if result['admin_created'] else 'already present'}."
        )
    finally:
        db.close()


if __name__ == "__main__":
    main()
