import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useCatalog } from './useCatalog';

export type CartLine = {
  productId: string;
  variant: string;
  qty: number;
  unitPrice: number | null;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (productId: string, variant: string, qty: number) => void;
  setQty: (productId: string, variant: string, qty: number) => void;
  remove: (productId: string, variant: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = 'fasteners-cart-v2';
const LEGACY_KEY = 'tbe-cart-v1';

type Lookup = (id: string) => { price: number | null } | undefined;

function load(getProduct: Lookup): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    // Normalize stored lines: drop unknown products, clamp qty, coerce variant,
    // refresh unit price from catalog so stale prices can't linger.
    return parsed.flatMap((l) => {
      if (!l || typeof l !== 'object') return [];
      const p = getProduct(l.productId);
      if (!p) return [];
      return [
        {
          productId: l.productId,
          variant: String(l.variant ?? 'Standard'),
          qty: Math.min(9999, Math.max(1, Math.floor(Number(l.qty) || 1))),
          unitPrice: p.price,
        },
      ];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { getProductById } = useCatalog();
  const [lines, setLines] = useState<CartLine[]>(() =>
    typeof window === 'undefined' ? [] : load(getProductById),
  );

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage full/blocked — cart still works in memory */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + (l.unitPrice ?? 0) * l.qty, 0);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      add: (productId, variant, qty) => {
        const p = getProductById(productId);
        if (!p) return;
        setLines((prev) => {
          const i = prev.findIndex((l) => l.productId === productId && l.variant === variant);
          if (i >= 0) {
            const next = [...prev];
            next[i] = { ...next[i], qty: Math.min(9999, next[i].qty + qty) };
            return next;
          }
          return [...prev, { productId, variant, qty: Math.max(1, qty), unitPrice: p.price }];
        });
      },
      setQty: (productId, variant, qty) =>
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => !(l.productId === productId && l.variant === variant))
            : prev.map((l) => (l.productId === productId && l.variant === variant ? { ...l, qty: Math.min(9999, qty) } : l)),
        ),
      remove: (productId, variant) =>
        setLines((prev) => prev.filter((l) => !(l.productId === productId && l.variant === variant))),
      clear: () => setLines([]),
    };
  }, [lines, getProductById]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
