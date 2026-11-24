export type Category = {
  id: string;
  name: string;
  group: 'Precision Fasteners' | 'Screws';
  description: string;
  imageHint: string; // catalogue image path for category cards
};

/**
 * Category tree for the WELTORQUE technical catalogue (Weltorque cat.pdf).
 * Only the 6 families represented by the 41 PDF products remain: M2–M8
 * socket head cap screws / hex nuts and the M4 ultraflat head fasteners.
 */
export const categories: Category[] = [
  { id: 'm2-fasteners', name: 'M2 Fasteners', group: 'Precision Fasteners', description: 'M2 socket head cap screws and standard hex nuts from the WELTORQUE catalogue.', imageHint: '/products/catalog/shcs-m2x10.jpg' },
  { id: 'm3-fasteners', name: 'M3 Fasteners', group: 'Precision Fasteners', description: 'M3 socket head cap screws and standard hex nuts for compact assemblies.', imageHint: '/products/catalog/shcs-m3x10.jpg' },
  { id: 'm4-fasteners', name: 'M4 Fasteners', group: 'Precision Fasteners', description: 'M4 socket head cap screws, ultraflat head fasteners and standard hex nuts.', imageHint: '/products/catalog/shcs-m4x10.jpg' },
  { id: 'm6-fasteners', name: 'M6 Fasteners', group: 'Precision Fasteners', description: 'M6 socket head cap screws and standard hex nuts for machine frames.', imageHint: '/products/catalog/shcs-m6x10.jpg' },
  { id: 'm8-fasteners', name: 'M8 Fasteners', group: 'Precision Fasteners', description: 'M8 socket head cap screws and standard hex nuts for industrial machinery.', imageHint: '/products/catalog/shcs-m8x10.jpg' },
  { id: 'ultralow-sockets', name: 'Ultraflat Head Fasteners', group: 'Screws', description: 'Ultraflat head fasteners M4 × 10–25 mm for tight-clearance joints.', imageHint: '/products/catalog/ultraflat-m4x10.jpg' },
];

export const categoryGroups = [...new Set(categories.map((c) => c.group))];

export type MaterialInfo = {
  id: string;
  name: string;
  blurb: string;
  /** PBR calibration used by the 3D showcase (§8, §19). Real configs, not just color swaps. */
  pbr: { color: string; metalness: number; roughness: number; clearcoat?: number; envMapIntensity: number };
  swatch: string;
};

/** Finish-preview library for the 3D viewer. The PDF leaves material/finish
 * "to be specified" / "as specified", so these are preview presets only. */
export const materials: MaterialInfo[] = [
  { id: 'stainless', name: 'Stainless Steel', blurb: 'Corrosion-resistant steel preview for SHCS and nut finishes.', pbr: { color: '#d4d9de', metalness: 1.0, roughness: 0.24, envMapIntensity: 1.15 }, swatch: 'linear-gradient(135deg,#f2f4f6,#9aa3ab 60%,#dfe4e8)' },
  { id: 'carbon', name: 'Carbon Steel', blurb: 'Uncoated steel preview for dry indoor assemblies.', pbr: { color: '#b9bfc6', metalness: 1.0, roughness: 0.34, envMapIntensity: 1.0 }, swatch: 'linear-gradient(135deg,#cfd4d9,#7d868e 65%,#b9bfc6)' },
  { id: 'alloy', name: 'Alloy Steel', blurb: 'Quenched-and-tempered steel preview for high clamp load.', pbr: { color: '#aeb6bd', metalness: 1.0, roughness: 0.3, envMapIntensity: 1.05 }, swatch: 'linear-gradient(135deg,#c2c8ce,#6f777f 60%,#aeb6bd)' },
  { id: 'brass', name: 'Brass', blurb: 'Electrical-friendly and decorative finish preview.', pbr: { color: '#c9a24b', metalness: 1.0, roughness: 0.3, envMapIntensity: 1.1 }, swatch: 'linear-gradient(135deg,#f0d488,#8a6a1f 60%,#c9a24b)' },
  { id: 'zinc', name: 'Zinc-Plated Finish', blurb: 'Electro-zinc preview for light indoor corrosion protection.', pbr: { color: '#dbe4ea', metalness: 1.0, roughness: 0.2, clearcoat: 0.4, envMapIntensity: 1.2 }, swatch: 'linear-gradient(135deg,#ffffff,#9fb6c6 55%,#dbe4ea)' },
  { id: 'black-oxide', name: 'Black Oxide Finish', blurb: 'Dark conversion coating preview with a mild protective oil film.', pbr: { color: '#23272b', metalness: 0.9, roughness: 0.42, envMapIntensity: 0.9 }, swatch: 'linear-gradient(135deg,#4a5157,#0c0e10 60%,#23272b)' },
  { id: 'hdg', name: 'Hot-Dip Galvanized', blurb: 'Thick zinc preview for outdoor structures where specified.', pbr: { color: '#9aa1a8', metalness: 0.85, roughness: 0.58, envMapIntensity: 0.8 }, swatch: 'linear-gradient(135deg,#c9ced3,#6b7278 60%,#9aa1a8)' },
];
