"""Admin-only endpoints: product CRUD and image upload. Every route here is
protected by `get_current_admin`, so only an authenticated admin can mutate
the catalog."""
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_admin
from ..models import AdminUser, Category, Product, StoredImage
from ..schemas import ProductIn, ProductOut, UploadOut
from ..utils import gen_id, slugify

router = APIRouter(prefix="/api/admin", tags=["admin"])

ALLOWED_IMAGE_TYPES = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
}
MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB


def _unique_slug(db: Session, base: str, exclude_id: str | None = None) -> str:
    slug = slugify(base)
    candidate = slug
    n = 2
    while True:
        exists = db.query(Product).filter(Product.slug == candidate).first()
        if exists is None or exists.id == exclude_id:
            return candidate
        candidate = f"{slug}-{n}"
        n += 1


@router.get("/products", response_model=list[ProductOut])
def admin_list_products(
    db: Session = Depends(get_db), _admin: AdminUser = Depends(get_current_admin)
) -> list[Product]:
    return db.query(Product).order_by(Product.createdAt.desc()).all()


@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Product:
    if db.get(Category, payload.category) is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Unknown category '{payload.category}'")

    data = payload.model_dump()
    pid = (data.pop("id") or "").strip() or gen_id("p")
    slug = (data.pop("slug") or "").strip() or slugify(payload.name)
    slug = _unique_slug(db, slug)

    if db.get(Product, pid) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "A product with that id already exists")

    product = Product(id=pid, slug=slug, **data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: str,
    payload: ProductIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Product:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    if db.get(Category, payload.category) is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Unknown category '{payload.category}'")

    data = payload.model_dump()
    data.pop("id", None)
    slug = (data.pop("slug") or "").strip() or product.slug
    if slug != product.slug:
        slug = _unique_slug(db, slug, exclude_id=product.id)
    product.slug = slug

    for key, value in data.items():
        setattr(product, key, value)
    product.updatedAt = datetime.utcnow()

    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> None:
    product = db.get(Product, product_id)
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    db.delete(product)
    db.commit()


@router.post("/uploads", response_model=UploadOut, status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> UploadOut:
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Unsupported file type '{content_type}'. Allowed: PNG, JPEG, WEBP, GIF, SVG.",
        )

    data = await file.read()
    if not data:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Empty file")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "File exceeds 8 MB limit")

    image_id = gen_id("img")
    db.add(
        StoredImage(
            id=image_id,
            filename=file.filename or f"{image_id}.{ALLOWED_IMAGE_TYPES[content_type]}",
            content_type=content_type,
            data=data,
        )
    )
    db.commit()

    return UploadOut(url=f"/api/stored-images/{image_id}", filename=file.filename or image_id)
