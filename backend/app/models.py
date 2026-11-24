"""ORM models.

ORM attribute names are camelCase to match the storefront's `Product` type so
that Pydantic can serialize straight from the model (`from_attributes=True`).
Physical column names are snake_case.
"""
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    # `group` is a SQL reserved word, so the column is named group_name.
    group: Mapped[str] = mapped_column("group_name", String(80), index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    imageHint: Mapped[str] = mapped_column("image_hint", String(400), default="")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    sku: Mapped[str] = mapped_column(String(120), index=True)
    name: Mapped[str] = mapped_column(String(300))
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True)
    # FK to categories.id, exposed to the API as `category` (the id string).
    category: Mapped[str] = mapped_column(
        "category_id", ForeignKey("categories.id"), index=True
    )

    shortDescription: Mapped[str] = mapped_column("short_description", Text, default="")
    fullDescription: Mapped[str] = mapped_column("full_description", Text, default="")
    material: Mapped[str] = mapped_column(String(120), default="")
    grade: Mapped[str] = mapped_column(String(120), default="")
    finish: Mapped[str] = mapped_column(String(120), default="")
    diameter: Mapped[str] = mapped_column(String(60), default="")
    length: Mapped[str] = mapped_column(String(60), default="")
    threadType: Mapped[str] = mapped_column("thread_type", String(120), default="")
    threadPitch: Mapped[str] = mapped_column("thread_pitch", String(60), default="")

    # Technical attributes carried over from the GT Excel sheet.
    standard: Mapped[str] = mapped_column(String(120), default="")
    strength: Mapped[str] = mapped_column(String(120), default="")
    propertyClass: Mapped[str] = mapped_column("property_class", String(80), default="")
    fastenerType: Mapped[str] = mapped_column("fastener_type", String(120), default="")
    remark: Mapped[str] = mapped_column(String(200), default="")

    availableSizes: Mapped[list] = mapped_column("available_sizes", JSON, default=list)
    price: Mapped[float | None] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(8), default="INR")
    moq: Mapped[int] = mapped_column(Integer, default=1)
    stockStatus: Mapped[str] = mapped_column("stock_status", String(40), default="in-stock")

    images: Mapped[list] = mapped_column(JSON, default=list)
    modelPath: Mapped[str | None] = mapped_column("model_path", String(400), nullable=True)
    specs: Mapped[list] = mapped_column(JSON, default=list)
    related: Mapped[list] = mapped_column(JSON, default=list)

    # Sourced from the WELTORQUE technical catalogue (PDF).
    catalogPage: Mapped[int | None] = mapped_column(
        "catalog_page", Integer, nullable=True
    )
    catalogIntro: Mapped[str] = mapped_column("catalog_intro", Text, default="")
    applications: Mapped[list] = mapped_column("applications", JSON, default=list)

    seoTitle: Mapped[str] = mapped_column("seo_title", String(300), default="")
    seoDescription: Mapped[str] = mapped_column("seo_description", Text, default="")
    keywords: Mapped[list] = mapped_column(JSON, default=list)

    sample: Mapped[bool] = mapped_column(Boolean, default=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)

    createdAt: Mapped[datetime] = mapped_column(
        "created_at", DateTime(timezone=True), default=datetime.utcnow
    )
    updatedAt: Mapped[datetime] = mapped_column(
        "updated_at", DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(300))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class StoredImage(Base):
    """Uploaded product images kept in the DB so they survive redeploys on
    ephemeral free hosts (no object storage / persistent disk required)."""

    __tablename__ = "stored_images"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    filename: Mapped[str] = mapped_column(String(300))
    content_type: Mapped[str] = mapped_column(String(120))
    data: Mapped[bytes] = mapped_column(LargeBinary)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class Order(Base):
    """Cash-on-delivery order placed from the storefront.

    Prices are always re-read from the catalog on the server: the browser can
    suggest a cart, but it cannot set the amount payable. `isRead` powers the
    in-app admin notification badge.
    """

    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    orderNumber: Mapped[str] = mapped_column(
        "order_number", String(40), unique=True, index=True
    )
    status: Mapped[str] = mapped_column(String(30), default="new", index=True)
    paymentMethod: Mapped[str] = mapped_column("payment_method", String(30), default="cod")
    paymentStatus: Mapped[str] = mapped_column("payment_status", String(30), default="pending")

    customerName: Mapped[str] = mapped_column("customer_name", String(200))
    customerEmail: Mapped[str] = mapped_column("customer_email", String(200), index=True)
    customerPhone: Mapped[str] = mapped_column("customer_phone", String(40))
    addressLine1: Mapped[str] = mapped_column("address_line1", String(300))
    addressLine2: Mapped[str] = mapped_column("address_line2", String(300), default="")
    city: Mapped[str] = mapped_column(String(120))
    state: Mapped[str] = mapped_column(String(120))
    postalCode: Mapped[str] = mapped_column("postal_code", String(20))
    country: Mapped[str] = mapped_column(String(80), default="India")
    notes: Mapped[str] = mapped_column(Text, default="")

    subtotal: Mapped[float] = mapped_column(Float, default=0)
    shipping: Mapped[float] = mapped_column(Float, default=0)
    tax: Mapped[float] = mapped_column(Float, default=0)
    total: Mapped[float] = mapped_column(Float, default=0)
    currency: Mapped[str] = mapped_column(String(8), default="INR")

    isRead: Mapped[bool] = mapped_column("is_read", Boolean, default=False)
    createdAt: Mapped[datetime] = mapped_column(
        "created_at", DateTime(timezone=True), default=datetime.utcnow, index=True
    )
    updatedAt: Mapped[datetime] = mapped_column(
        "updated_at", DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan", lazy="selectin"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    orderId: Mapped[int] = mapped_column(
        "order_id", ForeignKey("orders.id", ondelete="CASCADE"), index=True
    )
    productId: Mapped[str] = mapped_column("product_id", String(64), index=True)
    sku: Mapped[str] = mapped_column(String(120))
    name: Mapped[str] = mapped_column(String(300))
    variant: Mapped[str] = mapped_column(String(120), default="")
    qty: Mapped[int] = mapped_column(Integer)
    unitPrice: Mapped[float] = mapped_column("unit_price", Float)
    lineTotal: Mapped[float] = mapped_column("line_total", Float)

    order: Mapped["Order"] = relationship(back_populates="items")


class QuoteRequest(Base):
    """Backend-backed quotation request. The optional drawing is stored in the
    database beside the request so admin can download it later."""

    __tablename__ = "quote_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    quoteNumber: Mapped[str] = mapped_column(
        "quote_number", String(40), unique=True, index=True
    )
    status: Mapped[str] = mapped_column(String(30), default="new", index=True)

    fullName: Mapped[str] = mapped_column("full_name", String(200))
    company: Mapped[str] = mapped_column(String(200), default="")
    email: Mapped[str] = mapped_column(String(200), index=True)
    phone: Mapped[str] = mapped_column(String(40), default="")
    country: Mapped[str] = mapped_column(String(80), default="")

    categoryId: Mapped[str] = mapped_column("category_id", String(64), default="")
    categoryName: Mapped[str] = mapped_column("category_name", String(200), default="")
    productId: Mapped[str] = mapped_column("product_id", String(64), default="")
    productName: Mapped[str] = mapped_column("product_name", String(300), default="")
    material: Mapped[str] = mapped_column(String(200), default="")
    diameter: Mapped[str] = mapped_column(String(60), default="")
    length: Mapped[str] = mapped_column(String(60), default="")
    quantity: Mapped[str] = mapped_column(String(120))
    deliveryDate: Mapped[str] = mapped_column("delivery_date", String(20), default="")
    deliveryLocation: Mapped[str] = mapped_column("delivery_location", String(300), default="")
    requirements: Mapped[str] = mapped_column(Text, default="")

    attachmentName: Mapped[str | None] = mapped_column("attachment_name", String(300), nullable=True)
    attachmentContentType: Mapped[str | None] = mapped_column(
        "attachment_content_type", String(120), nullable=True
    )
    attachmentData: Mapped[bytes | None] = mapped_column("attachment_data", LargeBinary, nullable=True)

    isRead: Mapped[bool] = mapped_column("is_read", Boolean, default=False)
    createdAt: Mapped[datetime] = mapped_column(
        "created_at", DateTime(timezone=True), default=datetime.utcnow, index=True
    )
    updatedAt: Mapped[datetime] = mapped_column(
        "updated_at", DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )

    @property
    def hasAttachment(self) -> bool:
        return bool(self.attachmentData)
