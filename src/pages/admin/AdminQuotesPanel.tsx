import { useCallback, useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import {
  adminListQuotes,
  adminMarkQuoteRead,
  adminUpdateQuote,
  quoteAttachmentUrl,
  type QuoteRequestRecord,
} from '../../lib/api';

const STATUSES: QuoteRequestRecord['status'][] = ['new', 'contacted', 'quoted', 'closed'];

export function AdminQuotesPanel({ onChanged }: { onChanged: () => void }) {
  const auth = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setQuotes(await adminListQuotes());
    } catch (err) {
      if ((err as { status?: number }).status === 401) auth.logout();
      else setError(err instanceof Error ? err.message : 'Failed to load quote requests');
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (id: number, status: QuoteRequestRecord['status']) => {
    try {
      await adminUpdateQuote(id, status);
      await load();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quote request');
    }
  };

  const markRead = async (id: number) => {
    try {
      await adminMarkQuoteRead(id);
      await load();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark quote as read');
    }
  };

  const unread = quotes.filter((q) => !q.isRead).length;
  const attachmentToken = typeof localStorage !== 'undefined' ? localStorage.getItem('fasteners-admin-token') : null;

  return (
    <section className="min-w-0" aria-label="Quote requests">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">Quote requests</h2>
          <p className="mt-1 text-[13px] text-muted">
            {quotes.length} total · <span className={unread ? 'text-brass' : ''}>{unread} new</span>
          </p>
        </div>
        <Button variant="ghost" onClick={() => void load()} className="min-h-[44px] !px-4 !py-2 !text-[12px]">Refresh</Button>
      </div>
      {error && <p role="alert" className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-[13px] text-red-300">{error}</p>}
      {loading && <p className="mt-6 text-[13px] text-muted">Loading quote requests…</p>}
      {!loading && quotes.length === 0 && (
        <p className="card-premium mt-6 p-6 text-[14px] text-muted">No quote requests yet. New requests will appear here immediately.</p>
      )}

      <div className="mt-6 space-y-4">
        {quotes.map((quote) => (
          <article key={quote.id} className="card-premium overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-[17px] font-bold">{quote.quoteNumber}</p>
                  {!quote.isRead && <span className="rounded-full border border-brass/40 bg-brass/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brass-light">New</span>}
                  <span className="rounded-full border hairline px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted">{quote.status}</span>
                  {quote.hasAttachment && <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-sky-200">Drawing attached</span>}
                </div>
                <p className="mt-2 break-words text-[13px] text-muted">
                  {new Date(quote.createdAt).toLocaleString()} · {quote.fullName}{quote.company ? ` · ${quote.company}` : ''} · <span className="break-all">{quote.email}</span>
                </p>
              </div>
              <div className="min-w-0 shrink-0 text-right text-[13px]">
                <p className="font-semibold">{quote.quantity}</p>
                <p className="break-words text-muted">{quote.productName || quote.categoryName || 'Custom requirement'}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t hairline bg-ink-900/40 px-5 py-3">
              <Select
                label="Status"
                name={`quote-status-${quote.id}`}
                value={quote.status}
                onChange={(v) => void updateStatus(quote.id, v as QuoteRequestRecord['status'])}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              {!quote.isRead && (
                <Button variant="ghost" onClick={() => void markRead(quote.id)} className="min-h-[44px] !px-4 !py-2 !text-[12px]">Mark as read</Button>
              )}
              <Button variant="ghost" onClick={() => setExpanded(expanded === quote.id ? null : quote.id)} className="min-h-[44px] !px-4 !py-2 !text-[12px]">
                {expanded === quote.id ? 'Hide details' : 'View details'}
              </Button>
            </div>

            {expanded === quote.id && (
              <div className="border-t hairline p-5 text-[13px]">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="eyebrow">Contact</dt>
                    <dd className="mt-1 text-muted">
                      {quote.fullName}<br />
                      {quote.company && <>{quote.company}<br /></>}
                      {quote.email}<br />
                      {quote.phone && <>{quote.phone}<br /></>}
                      {quote.country}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Requirement</dt>
                    <dd className="mt-1 text-muted">
                      {quote.productName || '—'}<br />
                      {quote.categoryName && <>Category: {quote.categoryName}<br /></>}
                      {quote.material && <>Material: {quote.material}<br /></>}
                      {quote.diameter && <>Diameter: {quote.diameter}<br /></>}
                      {quote.length && <>Length: {quote.length}<br /></>}
                      Quantity: {quote.quantity}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Delivery</dt>
                    <dd className="mt-1 text-muted">
                      {quote.deliveryLocation || '—'}<br />
                      {quote.deliveryDate ? `Required by ${quote.deliveryDate}` : 'No date specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Brief</dt>
                    <dd className="mt-1 text-muted">{quote.requirements || '—'}</dd>
                  </div>
                </dl>
                {quote.hasAttachment && (
                  <p className="mt-4">
                    <a
                      className="btn-ghost inline-flex min-h-[44px] break-all !px-4 !py-2 !text-[12px]"
                      href={quoteAttachmentUrl(quote.id)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(ev) => {
                        // The browser cannot send an Authorization header on a plain link.
                        // Fetch the protected attachment with the JWT, then open it locally.
                        ev.preventDefault();
                        void fetch(quoteAttachmentUrl(quote.id), {
                          headers: attachmentToken ? { Authorization: `Bearer ${attachmentToken}` } : {},
                        })
                          .then(async (res) => {
                            if (!res.ok) throw new Error(`Download failed (${res.status})`);
                            return res.blob();
                          })
                          .then((blob) => {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = quote.attachmentName || 'drawing';
                            a.click();
                            URL.revokeObjectURL(url);
                          })
                          .catch((err) => setError(err instanceof Error ? err.message : 'Download failed'));
                      }}
                    >
                      Download {quote.attachmentName}
                    </a>
                  </p>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
