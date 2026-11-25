import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { adminListOrders, adminMarkOrderRead, adminUpdateOrder, type Order } from '../../lib/api';
import { formatINR } from '../../lib/utils';

const STATUSES: Order['status'][] = ['new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export function AdminOrdersPanel({ onChanged }: { onChanged: () => void }) {
  const auth = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setOrders(await adminListOrders());
    } catch (err) {
      if ((err as { status?: number }).status === 401) auth.logout();
      else setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (id: number, status: Order['status']) => {
    try {
      await adminUpdateOrder(id, status);
      await load();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  const markRead = async (id: number) => {
    try {
      await adminMarkOrderRead(id);
      await load();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark order as read');
    }
  };

  const unread = orders.filter((o) => !o.isRead).length;

  return (
    <section className="min-w-0" aria-label="COD orders">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">COD orders</h2>
          <p className="mt-1 text-[13px] text-muted">
            {orders.length} total · <span className={unread ? 'text-brass' : ''}>{unread} new</span>
          </p>
        </div>
        <Button variant="ghost" onClick={() => void load()} className="min-h-[44px] !px-4 !py-2 !text-[12px]">Refresh</Button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-[13px] text-red-300">{error}</p>}
      {loading && <p className="mt-6 text-[13px] text-muted">Loading orders…</p>}
      {!loading && orders.length === 0 && (
        <p className="card-premium mt-6 p-6 text-[14px] text-muted">No orders yet. New COD orders will appear here immediately.</p>
      )}

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <article key={order.id} className="card-premium overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-[17px] font-bold">{order.orderNumber}</p>
                  {!order.isRead && <span className="rounded-full border border-brass/40 bg-brass/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brass-light">New</span>}
                  <span className="rounded-full border hairline px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted">{order.status}</span>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-200">COD · {order.paymentStatus}</span>
                </div>
                <p className="mt-2 break-words text-[13px] text-muted">
                  {new Date(order.createdAt).toLocaleString()} · {order.customerName} · <span className="break-all">{order.customerEmail}</span>
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-2xl font-bold">{formatINR(order.total, order.currency)}</p>
                <p className="text-[12px] text-muted">{order.items.reduce((n, i) => n + i.qty, 0)} units</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t hairline bg-ink-900/40 px-5 py-3">
              <Select
                label="Status"
                name={`order-status-${order.id}`}
                value={order.status}
                onChange={(v) => void updateStatus(order.id, v as Order['status'])}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              {!order.isRead && (
                <Button variant="ghost" onClick={() => void markRead(order.id)} className="min-h-[44px] !px-4 !py-2 !text-[12px]">Mark as read</Button>
              )}
              <Button variant="ghost" onClick={() => setExpanded(expanded === order.id ? null : order.id)} className="min-h-[44px] !px-4 !py-2 !text-[12px]">
                {expanded === order.id ? 'Hide details' : 'View details'}
              </Button>
            </div>

            {expanded === order.id && (
              <div className="border-t hairline p-5 text-[13px]">
                <p className="eyebrow">Items</p>
                <div className="mt-2 divide-y divide-white/5">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 py-2">
                      <span className="min-w-0 break-words">{item.name} · {item.variant} × {item.qty}<span className="text-muted"> · {item.sku}</span></span>
                      <span className="shrink-0 font-semibold">{formatINR(item.lineTotal, order.currency)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="eyebrow">Deliver to</p>
                    <p className="mt-1 text-muted">
                      {order.customerName}<br />
                      {order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ''}<br />
                      {order.city}, {order.state} {order.postalCode}<br />
                      {order.country}<br />
                      {order.customerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow">Totals</p>
                    <p className="mt-1 text-muted">Subtotal {formatINR(order.subtotal, order.currency)} · Shipping not charged · Tax not charged</p>
                    <p className="mt-1 font-semibold">Payable on delivery: {formatINR(order.total, order.currency)}</p>
                    {order.notes && <p className="mt-2 text-muted">Notes: {order.notes}</p>}
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
