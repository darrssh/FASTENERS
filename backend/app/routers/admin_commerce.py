"""Admin-only endpoints for COD orders and quote requests.

New records arrive with `isRead = False`; the `/admin` dashboard uses the
summary endpoint as the in-app notification badge.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_admin
from ..models import AdminUser, Order, QuoteRequest
from ..schemas import OrderOut, OrderStatusIn, QuoteOut, QuoteStatusIn, UnreadSummary

router = APIRouter(prefix="/api/admin", tags=["admin-commerce"])


@router.get("/summary", response_model=UnreadSummary)
def commerce_summary(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> UnreadSummary:
    orders = db.query(Order).filter(Order.isRead.is_(False)).count()
    quotes = db.query(QuoteRequest).filter(QuoteRequest.isRead.is_(False)).count()
    return UnreadSummary(orders=orders, quotes=quotes, total=orders + quotes)


@router.post("/notifications/read-all", response_model=UnreadSummary)
def mark_all_read(
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> UnreadSummary:
    db.query(Order).filter(Order.isRead.is_(False)).update({Order.isRead: True})
    db.query(QuoteRequest).filter(QuoteRequest.isRead.is_(False)).update({QuoteRequest.isRead: True})
    db.commit()
    return UnreadSummary(orders=0, quotes=0, total=0)


@router.get("/orders", response_model=list[OrderOut])
def list_orders(
    status_filter: str | None = Query(default=None, alias="status"),
    unread: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> list[Order]:
    query = db.query(Order)
    if status_filter:
        query = query.filter(Order.status == status_filter)
    if unread is not None:
        query = query.filter(Order.isRead.is_(not unread))
    return query.order_by(Order.createdAt.desc()).all()


@router.patch("/orders/{order_id}", response_model=OrderOut)
def update_order(
    order_id: int,
    payload: OrderStatusIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Order:
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    order.status = payload.status
    order.isRead = True
    if payload.status == "delivered":
        order.paymentStatus = "collected"
    db.commit()
    db.refresh(order)
    return order


@router.post("/orders/{order_id}/read", response_model=OrderOut)
def mark_order_read(
    order_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Order:
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")
    order.isRead = True
    db.commit()
    db.refresh(order)
    return order


@router.get("/quotes", response_model=list[QuoteOut])
def list_quotes(
    status_filter: str | None = Query(default=None, alias="status"),
    unread: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> list[QuoteRequest]:
    query = db.query(QuoteRequest)
    if status_filter:
        query = query.filter(QuoteRequest.status == status_filter)
    if unread is not None:
        query = query.filter(QuoteRequest.isRead.is_(not unread))
    return query.order_by(QuoteRequest.createdAt.desc()).all()


@router.patch("/quotes/{quote_id}", response_model=QuoteOut)
def update_quote(
    quote_id: int,
    payload: QuoteStatusIn,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> QuoteRequest:
    quote = db.get(QuoteRequest, quote_id)
    if quote is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Quote request not found")
    quote.status = payload.status
    quote.isRead = True
    db.commit()
    db.refresh(quote)
    return quote


@router.post("/quotes/{quote_id}/read", response_model=QuoteOut)
def mark_quote_read(
    quote_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> QuoteRequest:
    quote = db.get(QuoteRequest, quote_id)
    if quote is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Quote request not found")
    quote.isRead = True
    db.commit()
    db.refresh(quote)
    return quote


@router.get("/quotes/{quote_id}/attachment")
def quote_attachment(
    quote_id: int,
    db: Session = Depends(get_db),
    _admin: AdminUser = Depends(get_current_admin),
) -> Response:
    quote = db.get(QuoteRequest, quote_id)
    if quote is None or not quote.attachmentData:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Attachment not found")
    filename = (quote.attachmentName or "attachment").replace('"', "")
    return Response(
        content=quote.attachmentData,
        media_type=quote.attachmentContentType or "application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
