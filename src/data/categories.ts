export type Category = {
  id: string;
  name: string;
  group: 'Precision Fasteners' | 'Screws' | 'Special Fasteners' | 'Bearings' | 'Pneumatics' | 'Rivets' | 'Sealing';
  description: string;
  imageHint: string; // resolved by ProductRender — real Excel photo path for category cards
};

/**
 * Category tree rebuilt from Fasteners_With_Images.xlsx (46 products).
 * Groups follow the Excel sheet: M2 / M3 / M4 / M6 / M8, Mushroom Head Screws,
 * QTF quarter-turn, UltraLow Head, Bearings, Festo, Pop Rivets, Rubber Grommet.
 */
export const categories: Category[] = [
  { id: 'm2-fasteners', name: 'M2 Fasteners', group: 'Precision Fasteners', description: 'M2 nuts, SHCS M2x12 and precision washers for electronics and instruments.', imageHint: '/products/m2-nut.png' },
  { id: 'm3-fasteners', name: 'M3 Fasteners', group: 'Precision Fasteners', description: 'SHCS M3x35 / M3x16, M3 nuts, washers and threaded rivets.', imageHint: '/products/shcs-m3x35.png' },
  { id: 'm4-fasteners', name: 'M4 Fasteners', group: 'Precision Fasteners', description: 'Floating anchor nuts, SHCS M4 series, RH/LH nuts, Nyloc, washers and rivets.', imageHint: '/products/m4-floating-anchor-nut.png' },
  { id: 'm6-fasteners', name: 'M6 Fasteners', group: 'Precision Fasteners', description: 'SHCS M6x16 / M6x25, washers, CSK M6x10 / M6x15 / M6x30 and fixed anchor nuts.', imageHint: '/products/shcs-m6x16.png' },
  { id: 'm8-fasteners', name: 'M8 Fasteners', group: 'Precision Fasteners', description: 'SHCS M8x16 / M8x20 / M8x25 and M8 washers for machine frames.', imageHint: '/products/shcs-m8x16.png' },
  { id: 'mushroom-screws', name: 'Mushroom Head Screws', group: 'Screws', description: 'Low-profile mushroom head screws — M3x16, M4x10, M4x16.', imageHint: '/products/mushroom-m3x16.png' },
  { id: 'qtf-fasteners', name: 'QTF Quarter-Turn Fasteners', group: 'Special Fasteners', description: 'D4 series studs (D4-AJ3-30), receptacles (D4-S3-150) and retainers (D4-GP3).', imageHint: '/products/qtf-stud.png' },
  { id: 'ultralow-sockets', name: 'UltraLow Head Sockets', group: 'Screws', description: 'Ultra-low head hex sockets — M4-12 and M4-16 for tight-clearance joints.', imageHint: '/products/ultralow-m4-12.png' },
  { id: 'bearings', name: 'Bearings', group: 'Bearings', description: 'Articulated heads EBLM / EBRM and spherical clip bearings.', imageHint: '/products/bearing-eb.png' },
  { id: 'festo', name: 'Festo Pneumatics', group: 'Pneumatics', description: 'Festo convertor QS-06 to QS-08 push-in fitting adapter.', imageHint: '/products/festo-qs06-08.png' },
  { id: 'pop-rivets', name: 'Pop Rivets', group: 'Rivets', description: 'Blind pop rivets — Ø2.3 x 12 / 16 mm and Ø2.9 x 12 / 16 mm.', imageHint: '/products/pop-rivet.png' },
  { id: 'rubber-grommets', name: 'Rubber Grommets', group: 'Sealing', description: 'Ø20 rubber grommets for cable pass-through and edge protection.', imageHint: '/products/rubber-grommet-20.png' },
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

export const materials: MaterialInfo[] = [
  { id: 'stainless', name: 'Stainless Steel', blurb: 'Corrosion-resistant A2 grades used across SHCS, nuts and washers in this catalog.', pbr: { color: '#d4d9de', metalness: 1.0, roughness: 0.24, envMapIntensity: 1.15 }, swatch: 'linear-gradient(135deg,#f2f4f6,#9aa3ab 60%,#dfe4e8)' },
  { id: 'carbon', name: 'Carbon Steel', blurb: 'High-strength grades, usually zinc-plated, for dry indoor assemblies.', pbr: { color: '#b9bfc6', metalness: 1.0, roughness: 0.34, envMapIntensity: 1.0 }, swatch: 'linear-gradient(135deg,#cfd4d9,#7d868e 65%,#b9bfc6)' },
  { id: 'alloy', name: 'Alloy Steel', blurb: 'Quenched-and-tempered 12.9 class for SHCS high clamp load.', pbr: { color: '#aeb6bd', metalness: 1.0, roughness: 0.3, envMapIntensity: 1.05 }, swatch: 'linear-gradient(135deg,#c2c8ce,#6f777f 60%,#aeb6bd)' },
  { id: 'brass', name: 'Brass', blurb: 'Used selectively for electrical-friendly and decorative positions.', pbr: { color: '#c9a24b', metalness: 1.0, roughness: 0.3, envMapIntensity: 1.1 }, swatch: 'linear-gradient(135deg,#f0d488,#8a6a1f 60%,#c9a24b)' },
  { id: 'zinc', name: 'Zinc-Plated Finish', blurb: 'Electro-zinc over carbon steel for light indoor corrosion protection.', pbr: { color: '#dbe4ea', metalness: 1.0, roughness: 0.2, clearcoat: 0.4, envMapIntensity: 1.2 }, swatch: 'linear-gradient(135deg,#ffffff,#9fb6c6 55%,#dbe4ea)' },
  { id: 'black-oxide', name: 'Black Oxide Finish', blurb: 'Dark conversion coating with oil on CSK M6x30 series. Mild protection, premium look.', pbr: { color: '#23272b', metalness: 0.9, roughness: 0.42, envMapIntensity: 0.9 }, swatch: 'linear-gradient(135deg,#4a5157,#0c0e10 60%,#23272b)' },
  { id: 'hdg', name: 'Hot-Dip Galvanized', blurb: 'Thick zinc for outdoor structures where specified.', pbr: { color: '#9aa1a8', metalness: 0.85, roughness: 0.58, envMapIntensity: 0.8 }, swatch: 'linear-gradient(135deg,#c9ced3,#6b7278 60%,#9aa1a8)' },
  { id: 'polymer', name: 'Engineering Polymer', blurb: 'Glass-filled nylon / POM used in bearings, QTF retainers and grommets.', pbr: { color: '#2b2e33', metalness: 0.05, roughness: 0.62, envMapIntensity: 0.6 }, swatch: 'linear-gradient(135deg,#4a5157,#14171b 60%,#2b2e33)' },
  { id: 'rubber', name: 'Rubber', blurb: 'EPDM/NBR grommets for cable sealing and vibration isolation.', pbr: { color: '#17191c', metalness: 0.0, roughness: 0.85, envMapIntensity: 0.4 }, swatch: 'linear-gradient(135deg,#33373c,#0c0e10 60%,#17191c)' },
];
