/**
 * Brand settings — SINGLE SOURCE OF TRUTH for business identity.
 * All values here are EDITABLE placeholders until the business owner provides real data.
 * IMPORTANT: Do not treat placeholder contact info as real. Empty strings = "not provided".
 */
export const brand = {
  // Displayed in nav logo + footer. Single source of truth for the site name.
  brandName: 'WELTOQ',
  projectName: 'WELTOQ',
  tagline: 'Engineered to Hold. Built to Last.',
  // Contact placeholders — all empty = not provided by business yet.
  supportEmail: '',
  phone: '',
  address: '',
  whatsapp: '',
  businessHours: '',
  social: {
    instagram: '',
    facebook: '',
    x: '',
    youtube: '',
    linkedin: '',
  },
  currency: 'INR',
  // Commerce mode: 'custom' = backend-backed COD orders and quote requests.
  // The backend API URL is configured via VITE_API_BASE_URL.
  commerceMode: 'custom' as 'shopify' | 'custom',
};

export function contactHref(kind: 'email' | 'phone' | 'whatsapp'): string | null {
  if (kind === 'email' && brand.supportEmail) return `mailto:${brand.supportEmail}`;
  if (kind === 'phone' && brand.phone) return `tel:${brand.phone.replace(/\s/g, '')}`;
  if (kind === 'whatsapp' && brand.whatsapp) return `https://wa.me/${brand.whatsapp.replace(/\D/g, '')}`;
  return null;
}
