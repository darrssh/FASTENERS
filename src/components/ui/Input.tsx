import { useId } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '../../lib/utils';

// 16px minimum on form controls — iOS Safari auto-zooms on focus below 16px,
// which breaks fixed drawers and sticky layouts on phones.

type IProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
export function Input({ label, error, id, className, ...rest }: IProps) {
  const reactId = useId();
  const fieldId = id ?? rest.name ?? reactId;
  const errId = error ? `${fieldId}-error` : undefined;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label} {rest.required && <span aria-hidden="true" className="text-accent">*</span>}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId}
        {...rest}
        className={cx(
          'w-full max-w-full rounded-lg border bg-ink-900 px-4 py-3 text-base text-paper placeholder:text-muted-dim focus:border-accent',
          error ? 'border-red-500' : 'hairline',
          className,
        )}
      />
      {error && (
        <p id={errId} role="alert" className="text-[13px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type TProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string };
export function Textarea({ label, error, id, className, ...rest }: TProps) {
  const reactId = useId();
  const fieldId = id ?? rest.name ?? reactId;
  const errId = error ? `${fieldId}-error` : undefined;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label} {rest.required && <span aria-hidden="true" className="text-accent">*</span>}
      </label>
      <textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId}
        {...rest}
        rows={rest.rows ?? 4}
        className={cx(
          'w-full max-w-full rounded-lg border bg-ink-900 px-4 py-3 text-base text-paper placeholder:text-muted-dim focus:border-accent',
          error ? 'border-red-500' : 'hairline',
          className,
        )}
      />
      {error && (
        <p id={errId} role="alert" className="text-[13px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type SProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
  name: string;
  id?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
};
export function Select({ label, error, children, name, id, required, value, onChange }: SProps) {
  const reactId = useId();
  const fieldId = id ?? name ?? reactId;
  const errId = error ? `${fieldId}-error` : undefined;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label} {required && <span aria-hidden="true" className="text-accent">*</span>}
      </label>
      <select
        id={fieldId}
        name={name}
        required={required}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-full rounded-lg border hairline bg-ink-900 px-4 py-3 text-base text-paper focus:border-accent"
      >
        {children}
      </select>
      {error && (
        <p id={errId} role="alert" className="text-[13px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
