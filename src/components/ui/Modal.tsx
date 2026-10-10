import { useEffect } from 'react';
import type { ReactNode } from 'react';

export function Modal({ onClose, children, title }: { onClose: () => void; children: ReactNode; title: string }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close dialog" onClick={onClose} className="absolute inset-0 bg-black/70" />
      <div className="card relative max-h-[85vh] w-full max-w-lg overflow-auto bg-ink-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-md border hairline px-3 py-1 text-sm text-muted hover:text-paper" autoFocus>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Loader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-muted" role="status" aria-label={label}>
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
      {label}…
    </div>
  );
}
