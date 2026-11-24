"""Admin authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_admin
from ..models import AdminUser
from ..schemas import LoginIn, TokenOut
from ..security import create_access_token, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenOut)
def login(body: LoginIn, db: Session = Depends(get_db)) -> TokenOut:
    email = body.email.strip().lower()
    user = db.query(AdminUser).filter(AdminUser.email == email).first()
    if user is None or not user.is_active or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    token, expires_in = create_access_token(user.email)
    return TokenOut(accessToken=token, expiresIn=expires_in, email=user.email)


@router.get("/me")
def me(admin: AdminUser = Depends(get_current_admin)) -> dict:
    return {"email": admin.email, "isAdmin": True}
