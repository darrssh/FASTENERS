/**
 * API client for the WELTOQ backend.
 *
 * The backend base URL comes from `VITE_API_BASE_URL`:
 *  - local dev: leave empty and use the Vite proxy (`/api` -> backend), or set
 *    it explicitly (e.g. http://127.0.0.1:8000).
 *  - production (GitHub Pages): set it to the deployed backend, e.g.
 *    https://fasteners-api.onrender.com
 */
import type { Product } from '../data/products';
import type { Category } from '../data/categories';
import { assetUrl } from './utils';

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
export const API_BASE = RAW_BASE.replace(/\/+$/, '');

export function apiUrl(path: string): string {
  if (/^https?:/i.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

/**
 * Resolve any product image reference:
 *  - absolute URLs pass through,
 *  - `/api/...` paths are backend-stored uploads → prefix with the API base,
 *  - anything else (`/products/x.png`) is a frontend public asset → Vite base.
 */
export function resolveMedia(src: string): string {
  if (!src) return src;
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith('/api/')) return apiUrl(src);
  return assetUrl(src);
}

const TOKEN_KEY = 'fasteners-admin-token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage blocked — session-only auth */
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  raw?: BodyInit;
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const init: RequestInit = { method: opts.method ?? 'GET', headers };

  if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(opts.body);
  } else if (opts.raw !== undefined) {
    init.body = opts.raw;
  }

  if (opts.auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl(path), init);
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.detail) detail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    } catch {
      /* non-JSON error body */
    }
    const err = new Error(detail) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export type TokenResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  email: string;
};

/* ---- Public catalog ---- */
export const fetchProducts = () => request<Product[]>('/api/products');
export const fetchCategories = () => request<Category[]>('/api/categories');
export const fetchProductBySlug = (slug: string) => request<Product>(`/api/products/${encodeURIComponent(slug)}`);

/* ---- Auth ---- */
export const login = (email: string, password: string) =>
  request<TokenResponse>('/api/auth/login', { method: 'POST', body: { email, password } });
export const fetchMe = () => request<{ email: string; isAdmin: boolean }>('/api/auth/me', { auth: true });

/* ---- Admin ---- */
export const adminListProducts = () => request<Product[]>('/api/admin/products', { auth: true });
export const createProduct = (product: Partial<Product>) =>
  request<Product>('/api/admin/products', { method: 'POST', body: product, auth: true });
export const updateProduct = (id: string, product: Partial<Product>) =>
  request<Product>(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'PUT', body: product, auth: true });
export const deleteProduct = (id: string) =>
  request<void>(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const form = new FormData();
  form.append('file', file);
  return request<{ url: string; filename: string }>('/api/admin/uploads', {
    method: 'POST',
    raw: form,
    auth: true,
  });
}

/* ---- Public commerce ---- */
export type OrderLineInput = { productId: string; variant: string; qty: number };

export type OrderCreate = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
  currency: string;
  lines: OrderLineInput[];
};

export type OrderItem = {
  id: number;
  productId: string;
  sku: string;
  name: string;
  variant: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: number;
  orderNumber: string;
  status: 'new' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod';
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export type QuotePayload = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  category: string;
  product: string;
  material: string;
  diameter: string;
  length: string;
  quantity: string;
  deliveryDate: string;
  deliveryLocation: string;
  requirements: string;
};

export type QuoteRequestRecord = QuotePayload & {
  id: number;
  quoteNumber: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  categoryName: string;
  productName: string;
  attachmentName: string | null;
  hasAttachment: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UnreadSummary = { orders: number; quotes: number; total: number };

export const placeOrder = (payload: OrderCreate) =>
  request<Order>('/api/orders', { method: 'POST', body: payload });

export const fetchOrder = (orderNumber: string, email: string) =>
  request<Order>(`/api/orders/${encodeURIComponent(orderNumber)}?email=${encodeURIComponent(email)}`);

export async function submitQuote(payload: QuotePayload, drawing?: File | null): Promise<QuoteRequestRecord> {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => form.append(key, value ?? ''));
  if (drawing) form.append('drawing', drawing);
  return request<QuoteRequestRecord>('/api/quotes', { method: 'POST', raw: form });
}

export const fetchQuote = (quoteNumber: string, email: string) =>
  request<QuoteRequestRecord>(`/api/quotes/${encodeURIComponent(quoteNumber)}?email=${encodeURIComponent(email)}`);

/* ---- Admin commerce ---- */
export const adminSummary = () => request<UnreadSummary>('/api/admin/summary', { auth: true });
export const adminMarkAllRead = () =>
  request<UnreadSummary>('/api/admin/notifications/read-all', { method: 'POST', auth: true });
export const adminListOrders = () => request<Order[]>('/api/admin/orders', { auth: true });
export const adminUpdateOrder = (id: number, status: Order['status']) =>
  request<Order>(`/api/admin/orders/${id}`, { method: 'PATCH', body: { status }, auth: true });
export const adminMarkOrderRead = (id: number) =>
  request<Order>(`/api/admin/orders/${id}/read`, { method: 'POST', auth: true });
export const adminListQuotes = () => request<QuoteRequestRecord[]>('/api/admin/quotes', { auth: true });
export const adminUpdateQuote = (id: number, status: QuoteRequestRecord['status']) =>
  request<QuoteRequestRecord>(`/api/admin/quotes/${id}`, { method: 'PATCH', body: { status }, auth: true });
export const adminMarkQuoteRead = (id: number) =>
  request<QuoteRequestRecord>(`/api/admin/quotes/${id}/read`, { method: 'POST', auth: true });
export const quoteAttachmentUrl = (id: number) => apiUrl(`/api/admin/quotes/${id}/attachment`);
