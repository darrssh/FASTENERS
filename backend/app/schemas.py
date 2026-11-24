"""Pydantic request/response models (camelCase to match the frontend)."""
import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

STOCK_STATUSES = {"in-stock", "low-stock", "made-to-order", "quote-only"}
ORDER_STATUSES = {"new", "confirmed", "packed", "shipped", "delivered", "cancelled"}
QUOTE_STATUSES = {"new", "contacted", "quoted", "closed"}
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class Spec(BaseModel):
    label: str
    value: str


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    group: str
    description: str
    imageHint: str


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    sku: str
    name: str
    slug: str
    category: str
    shortDescription: str
    fullDescription: str
    material: str
    grade: str
    finish: str
    diameter: str
    length: str
    threadType: str
    threadPitch: str
    standard: str
    strength: str
    propertyClass: str
    fastenerType: str
    remark: str
    availableSizes: list[str]
    price: float | None
    currency: str
    moq: int
    stockStatus: str
    images: list[str]
    modelPath: str | None
    specs: list[Spec]
    related: list[str]
    catalogPage: int | None = None
    catalogIntro: str = ""
    applications: list[str] = []
    seoTitle: str
    seoDescription: str
    keywords: list[str]
    sample: bool
    featured: bool

    @field_validator(
        "availableSizes", "images", "related", "keywords", "specs", "applications", mode="before"
    )
    @classmethod
    def _none_to_list(cls, v):
        return v or []


class ProductIn(BaseModel):
    """Payload for create/update. Only sku, name and category are required."""

    id: str | None = None
    sku: str
    name: str
    slug: str | None = None
    category: str
    shortDescription: str = ""
    fullDescription: str = ""
    material: str = ""
    grade: str = ""
    finish: str = ""
    diameter: str = ""
    length: str = ""
    threadType: str = ""
    threadPitch: str = ""
    standard: str = ""
    strength: str = ""
    propertyClass: str = ""
    fastenerType: str = ""
    remark: str = ""
    availableSizes: list[str] = []
    price: float | None = None
    currency: str = "INR"
    moq: int = 1
    stockStatus: str = "in-stock"
    images: list[str] = []
    modelPath: str | None = None
    specs: list[Spec] = []
    related: list[str] = []
    catalogPage: int | None = None
    catalogIntro: str = ""
    applications: list[str] = []
    seoTitle: str = ""
    seoDescription: str = ""
    keywords: list[str] = []
    sample: bool = False
    featured: bool = False

    @field_validator("applications", mode="before")
    @classmethod
    def _none_to_list(cls, v):
        return v or []

    @field_validator("stockStatus")
    @classmethod
    def _valid_stock(cls, v: str) -> str:
        if v not in STOCK_STATUSES:
            raise ValueError(f"stockStatus must be one of {sorted(STOCK_STATUSES)}")
        return v

    @field_validator("sku", "name", "category")
    @classmethod
    def _not_blank(cls, v: str) -> str:
        if not str(v).strip():
            raise ValueError("Field must not be blank")
        return v.strip()


# ---- Cash-on-delivery orders ----
class OrderLineIn(BaseModel):
    productId: str
    variant: str = ""
    qty: int = Field(gt=0, le=9999)

    @field_validator("productId")
    @classmethod
    def _product_not_blank(cls, v: str) -> str:
        if not str(v).strip():
            raise ValueError("productId must not be blank")
        return v.strip()


class OrderCreate(BaseModel):
    customerName: str
    customerEmail: str
    customerPhone: str
    addressLine1: str
    addressLine2: str = ""
    city: str
    state: str
    postalCode: str
    country: str = "India"
    notes: str = ""
    currency: str = "INR"
    lines: list[OrderLineIn]

    @field_validator(
        "customerName", "customerEmail", "customerPhone", "addressLine1",
        "city", "state", "postalCode", mode="before",
    )
    @classmethod
    def _required(cls, v: str) -> str:
        if not str(v or "").strip():
            raise ValueError("Field must not be blank")
        return str(v).strip()

    @field_validator("customerEmail")
    @classmethod
    def _email(cls, v: str) -> str:
        if not EMAIL_RE.match(v):
            raise ValueError("Enter a valid email address")
        return v.lower()

    @field_validator("lines")
    @classmethod
    def _has_lines(cls, v: list[OrderLineIn]) -> list[OrderLineIn]:
        if not v:
            raise ValueError("At least one product is required")
        return v


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    productId: str
    sku: str
    name: str
    variant: str
    qty: int
    unitPrice: float
    lineTotal: float


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    orderNumber: str
    status: str
    paymentMethod: str
    paymentStatus: str
    customerName: str
    customerEmail: str
    customerPhone: str
    addressLine1: str
    addressLine2: str
    city: str
    state: str
    postalCode: str
    country: str
    notes: str
    subtotal: float
    shipping: float
    tax: float
    total: float
    currency: str
    isRead: bool
    createdAt: datetime
    updatedAt: datetime
    items: list[OrderItemOut]


class OrderStatusIn(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def _valid(cls, v: str) -> str:
        if v not in ORDER_STATUSES:
            raise ValueError(f"status must be one of {sorted(ORDER_STATUSES)}")
        return v


# ---- Quotation requests ----
class QuoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quoteNumber: str
    status: str
    fullName: str
    company: str
    email: str
    phone: str
    country: str
    categoryId: str
    categoryName: str
    productId: str
    productName: str
    material: str
    diameter: str
    length: str
    quantity: str
    deliveryDate: str
    deliveryLocation: str
    requirements: str
    attachmentName: str | None
    hasAttachment: bool
    isRead: bool
    createdAt: datetime
    updatedAt: datetime


class QuoteStatusIn(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def _valid(cls, v: str) -> str:
        if v not in QUOTE_STATUSES:
            raise ValueError(f"status must be one of {sorted(QUOTE_STATUSES)}")
        return v


class UnreadSummary(BaseModel):
    orders: int
    quotes: int
    total: int


class LoginIn(BaseModel):
    email: str
    password: str


class TokenOut(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    expiresIn: int
    email: str


class UploadOut(BaseModel):
    url: str
    filename: str
