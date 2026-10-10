import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '../../lib/utils';

type IProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
export function Input({ label, error, id, className, ...rest }: IProps) {
  const fieldId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label} {rest.required && <span className="text-accent">*</span>}
      </label>
      <input
        id={fieldId}
        {...rest}
        className={cx(
          'rounded-lg border bg-ink-900 px-4 py-3 text-[15px] text-paper placeholder:text-muted-dim focus:border-accent focus:outline-none',
          error ? 'border-red-500' : 'hairline',
          className,
        )}
      />
      {error && <p role="alert" className="text-[13px] text-red-400">{error}</p>}
    </div>
  );
}

type TProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string };
export function Textarea({ label, error, id, className, ...rest }: TProps) {
  const fieldId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label} {rest.required && <span className="text-accent">*</span>}
      </label>
      <textarea
        id={fieldId}
        {...rest}
        rows={rest.rows ?? 4}
        className={cx(
          'rounded-lg border bg-ink-900 px-4 py-3 text-[15px] text-paper placeholder:text-muted-dim focus:border-accent focus:outline-none',
          error ? 'border-red-500' : 'hairline',
          className,
        )}
      />
      {error && <p role="alert" className="text-[13px] text-red-400">{error}</p>}
    </div>
  );
}

type SProps = { label: string; error?: string; children: React.ReactNode; name: string; required?: boolean; value: string; onChange: (v: string) => void };
export function Select({ label, error, children, name, required, value, onChange }: SProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border hairline bg-ink-900 px-4 py-3 text-[15px] text-paper focus:border-accent focus:outline-none"
      >
        {children}
      </select>
      {error && <p role="alert" className="text-[13px] text-red-400">{error}</p>}
    </div>
  );
}
