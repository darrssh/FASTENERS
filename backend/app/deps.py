"""Shared FastAPI dependencies."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from .database import get_db
from .models import AdminUser
from .security import decode_token

_bearer = HTTPBearer(auto_error=False)


def get_current_admin(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> AdminUser:
    if creds is None or not creds.credentials:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    try:
        payload = decode_token(creds.credentials)
    except Exception:  # noqa: BLE001 - any decode failure = unauthenticated
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    email = payload.get("sub")
    user = db.query(AdminUser).filter(AdminUser.email == email).first()
    if user is None or not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not an active admin")
    return user
