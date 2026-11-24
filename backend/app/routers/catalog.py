"""Public catalog endpoints: categories, products, and stored images."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Category, Product, StoredImage
from ..schemas import CategoryOut, ProductOut

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)) -> list[Category]:
    return db.query(Category).order_by(Category.group, Category.name).all()


@router.get("/products", response_model=list[ProductOut])
def list_products(
    category: str | None = Query(default=None),
    q: str | None = Query(default=None),
    featured: bool | None = Query(default=None),
    limit: int | None = Query(default=None, ge=1, le=1000),
    db: Session = Depends(get_db),
) -> list[Product]:
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    if featured is not None:
        query = query.filter(Product.featured.is_(featured))
    if q:
        like = f"%{q.strip()}%"
        query = query.filter(
            Product.name.ilike(like)
            | Product.sku.ilike(like)
            | Product.material.ilike(like)
            | Product.category.ilike(like)
        )
    query = query.order_by(Product.name)
    if limit:
        query = query.limit(limit)
    return query.all()


@router.get("/products/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)) -> Product:
    product = db.query(Product).filter(Product.slug == slug).first()
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    return product


@router.get("/stored-images/{image_id}")
def get_stored_image(image_id: str, db: Session = Depends(get_db)) -> Response:
    img = db.get(StoredImage, image_id)
    if img is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Image not found")
    return Response(
        content=img.data,
        media_type=img.content_type,
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )
