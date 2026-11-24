"""Application settings, loaded from environment variables / .env."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database. Render/Neon hand out `postgres://` URLs; we normalize in database.py.
    # Falls back to a local SQLite file so the API can run with zero setup in dev.
    database_url: str = "sqlite:///./fasteners.db"

    # Auth
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 12

    # Seeded admin account (created on first boot if missing).
    admin_email: str = "admin@fasteners.local"
    admin_password: str = "ChangeMe123!"

    # Comma-separated list of allowed browser origins for the storefront.
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,https://darrssh.github.io"

    # Absolute public base URL of this API (used only for docs / optional links).
    # e.g. https://fasteners-api.onrender.com
    public_base_url: str = ""

    # Re-seed the catalog on boot when true (only fills empty tables by default).
    seed_on_startup: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
