import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
};

export function Button({ variant = 'primary', type, children, className, ...rest }: Props) {
  return (
    <button
      type={type ?? 'button'}
      className={cx(
        variant === 'primary' ? 'btn-primary' : 'btn-ghost',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
