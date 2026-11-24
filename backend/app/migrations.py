"""Small additive migrations for databases created before the WELTORQUE
catalogue fields were introduced.

`Base.metadata.create_all()` only creates missing *tables*; it never changes an
existing table. SQLite (used for local development) has no ALTER COLUMN support,
so we add the new nullable/defaulted columns explicitly and let SQLAlchemy's
model defaults handle new rows.
"""
from sqlalchemy import inspect, text

from .database import engine

# column name -> (SQLite DDL, PostgreSQL DDL)
PRODUCT_COLUMNS = {
    "catalog_page": ("INTEGER", "INTEGER"),
    "catalog_intro": ("TEXT NOT NULL DEFAULT ''", "TEXT NOT NULL DEFAULT ''"),
    "applications": ("JSON NOT NULL DEFAULT '[]'", "JSON NOT NULL DEFAULT '[]'::json"),
}


def ensure_schema() -> list[str]:
    """Add missing product columns. Returns the names that were added."""
    inspector = inspect(engine)
    if "products" not in inspector.get_table_names():
        return []

    existing = {column["name"] for column in inspector.get_columns("products")}
    dialect = engine.dialect.name
    added: list[str] = []

    with engine.begin() as conn:
        for name, ddl in PRODUCT_COLUMNS.items():
            if name in existing:
                continue
            definition = ddl[1] if dialect == "postgresql" else ddl[0]
            conn.execute(text(f"ALTER TABLE products ADD COLUMN {name} {definition}"))
            added.append(name)

    return added
