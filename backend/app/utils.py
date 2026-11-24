"""Small helpers."""
import re
import secrets
import uuid
from datetime import datetime


def gen_id(prefix: str = "p") -> str:
    return f"{prefix}{uuid.uuid4().hex[:12]}"


def human_ref(prefix: str) -> str:
    """Short, human-readable reference, e.g. ORD-251120-4F9A2C."""
    return f"{prefix}-{datetime.utcnow():%y%m%d}-{secrets.token_hex(3).upper()}"


def slugify(text: str) -> str:
    text = (text or "").strip().lower()
    text = text.replace("×", "x")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-{2,}", "-", text).strip("-")
    return text or gen_id("item")
