import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '../../lib/utils';
import { useDialogFocus } from '../../hooks/useDialogFocus';

export function Modal({ onClose, children, title }: { onClose: () => void; children: ReactNode; title: string }) {
  const dialogRef = useDialogFocus<HTMLDivElement>(true);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', fn);
    lockBodyScroll();
    return () => {
      window.removeEventListener('keydown', fn);
      unlockBodyScroll();
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 cursor-default bg-black/70" />
      <div className="card relative max-h-[85svh] w-full max-w-lg overflow-auto overscroll-contain bg-ink-900 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="min-w-0 break-words text-xl font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="grid min-h-[44px] min-w-[44px] shrink-0 place-items-center rounded-md border hairline px-3 text-sm text-muted hover:text-paper"
            autoFocus
          >
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
