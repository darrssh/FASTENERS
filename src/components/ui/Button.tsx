import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/utils';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
};

export function Button({ variant = 'primary', children, className, ...rest }: Props) {
  return (
    <button className={cx(variant === 'primary' ? 'btn-primary' : 'btn-ghost', className)} {...rest}>
      {children}
    </button>
  );
}
