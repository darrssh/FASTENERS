"""Public commerce endpoints: COD order placement and quote requests.

The browser sends product IDs and quantities only. Prices, SKUs, names, MOQs and
stock states are always re-read from the database here so a tampered client
cannot change the payable amount.
"""
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Category, Order, OrderItem, Product, QuoteRequest
from ..schemas import EMAIL_RE, OrderCreate, OrderOut, QuoteOut
from ..utils import human_ref

router = APIRouter(prefix="/api", tags=["commerce"])

MAX_DRAWING_BYTES = 10 * 1024 * 1024
DRAWING_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".step", ".stp", ".dxf"}


@router.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def place_order(payload: OrderCreate, db: Session = Depends(get_db)) -> Order:
    # Merge duplicate product/variant lines so one cart line cannot be split to
    # bypass the MOQ check.
    merged: dict[tuple[str, str], int] = {}
    for line in payload.lines:
        key = (line.productId, line.variant.strip() or "Standard")
        merged[key] = merged.get(key, 0) + line.qty

    ids = [product_id for product_id, _ in merged]
    products = {p.id: p for p in db.query(Product).filter(Product.id.in_(ids)).all()}
    missing = [product_id for product_id in ids if product_id not in products]
    if missing:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            f"Unknown product(s): {', '.join(sorted(missing))}",
        )

    items: list[OrderItem] = []
    for (product_id, variant), qty in merged.items():
        product = products[product_id]
        if product.price is None or product.stockStatus == "quote-only":
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                f"'{product.name}' is quote-only and cannot be ordered with COD checkout",
            )
        if qty < product.moq:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                f"'{product.name}' has a minimum order quantity of {product.moq}",
            )
        unit_price = round(float(product.price), 2)
        items.append(
            OrderItem(
                productId=product.id,
                sku=product.sku,
                name=product.name,
                variant=variant,
                qty=qty,
                unitPrice=unit_price,
                lineTotal=round(unit_price * qty, 2),
            )
        )

    subtotal = round(sum(item.lineTotal for item in items), 2)
    order = Order(
        orderNumber=human_ref("ORD"),
        status="new",
        paymentMethod="cod",
        paymentStatus="pending",
        customerName=payload.customerName,
        customerEmail=payload.customerEmail,
        customerPhone=payload.customerPhone,
        addressLine1=payload.addressLine1,
        addressLine2=payload.addressLine2,
        city=payload.city,
        state=payload.state,
        postalCode=payload.postalCode,
        country=payload.country,
        notes=payload.notes,
        subtotal=subtotal,
        shipping=0,
        tax=0,
        total=subtotal,
        currency=payload.currency,
        isRead=False,
        items=items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    # Force the item relationship to load while the session is still open.
    _ = order.items
    return order


@router.get("/orders/{order_number}", response_model=OrderOut)
def get_order(
    order_number: str,
    email: str,
    db: Session = Depends(get_db),
) -> Order:
    order = (
        db.query(Order)
        .filter(Order.orderNumber == order_number.strip().upper())
        .filter(Order.customerEmail.ilike(email.strip()))
        .first()
    )
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    _ = order.items
    return order


@router.post("/quotes", response_model=QuoteOut, status_code=status.HTTP_201_CREATED)
async def place_quote(
    fullName: Annotated[str, Form()],
    email: Annotated[str, Form()],
    quantity: Annotated[str, Form()],
    company: Annotated[str, Form()] = "",
    phone: Annotated[str, Form()] = "",
    country: Annotated[str, Form()] = "",
    category: Annotated[str, Form()] = "",
    product: Annotated[str, Form()] = "",
    material: Annotated[str, Form()] = "",
    diameter: Annotated[str, Form()] = "",
    length: Annotated[str, Form()] = "",
    deliveryDate: Annotated[str, Form()] = "",
    deliveryLocation: Annotated[str, Form()] = "",
    requirements: Annotated[str, Form()] = "",
    drawing: Annotated[UploadFile | None, File()] = None,
    db: Session = Depends(get_db),
) -> QuoteRequest:
    full_name = fullName.strip()
    email_addr = email.strip().lower()
    qty = quantity.strip()
    if not full_name or not qty:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Full name and quantity are required")
    if not EMAIL_RE.match(email_addr):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Enter a valid email address")
    if not category and not product:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Choose a product or a category")

    category_name = ""
    if category:
        row = db.get(Category, category)
        if row is None:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Unknown category '{category}'")
        category_name = row.name

    product_name = ""
    if product:
        row = db.get(Product, product)
        if row is None:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Unknown product '{product}'")
        product_name = row.name

    attachment_data: bytes | None = None
    attachment_name: str | None = None
    attachment_type: str | None = None
    if drawing is not None and drawing.filename:
        filename = drawing.filename
        if not any(filename.lower().endswith(ext) for ext in DRAWING_EXTENSIONS):
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "Drawing must be PDF, PNG, JPG, STEP, STP or DXF",
            )
        attachment_data = await drawing.read()
        if len(attachment_data) > MAX_DRAWING_BYTES:
            raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Drawing exceeds 10 MB")
        if not attachment_data:
            attachment_data = None
        else:
            attachment_name = filename
            attachment_type = drawing.content_type or "application/octet-stream"

    quote = QuoteRequest(
        quoteNumber=human_ref("QUO"),
        status="new",
        fullName=full_name,
        company=company.strip(),
        email=email_addr,
        phone=phone.strip(),
        country=country.strip(),
        categoryId=category.strip(),
        categoryName=category_name,
        productId=product.strip(),
        productName=product_name,
        material=material.strip(),
        diameter=diameter.strip(),
        length=length.strip(),
        quantity=qty,
        deliveryDate=deliveryDate.strip(),
        deliveryLocation=deliveryLocation.strip(),
        requirements=requirements.strip(),
        attachmentName=attachment_name,
        attachmentContentType=attachment_type,
        attachmentData=attachment_data,
        isRead=False,
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)
    return quote


@router.get("/quotes/{quote_number}", response_model=QuoteOut)
def get_quote(
    quote_number: str,
    email: str,
    db: Session = Depends(get_db),
) -> QuoteRequest:
    quote = (
        db.query(QuoteRequest)
        .filter(QuoteRequest.quoteNumber == quote_number.strip().upper())
        .filter(QuoteRequest.email.ilike(email.strip()))
        .first()
    )
    if quote is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Quote request not found")
    return quote
