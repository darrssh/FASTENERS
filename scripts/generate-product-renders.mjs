/**
 * Generates three consistent technical 3D-style SVG renders per catalogue SKU.
 * Source: src/data/products.ts (diameter, length, pitch, head/nut dimensions).
 * Output: public/products/renders/<id>-threequarter.svg | -head.svg | -side.svg
 * These are additive assets — the scroll-driven bolt journey is untouched.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const src = fs.readFileSync(path.join(root, 'src/data/products.ts'), 'utf8');
let body = src.slice(src.indexOf('export const products'));
body = body.slice(body.indexOf('['));
body = body.slice(0, body.lastIndexOf('];') + 1);
const products = eval(body);

const outDir = path.join(root, 'public/products/renders');
fs.mkdirSync(outDir, { recursive: true });

const spec = (p, label, fallback = '0') => {
  const hit = p.specs.find((s) => s.label.toLowerCase() === label.toLowerCase());
  const n = Number.parseFloat(hit?.value ?? fallback);
  return Number.isFinite(n) ? n : Number.parseFloat(fallback) || 0;
};
const fmt = (n) => String(Math.round(n * 10) / 10);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function defs() {
  return `<defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="72%">
      <stop offset="0" stop-color="#20252b"/><stop offset="0.55" stop-color="#12151a"/><stop offset="1" stop-color="#08090b"/>
    </radialGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f2f5f7"/><stop offset="0.18" stop-color="#aeb7bf"/><stop offset="0.42" stop-color="#e3e8ec"/><stop offset="0.7" stop-color="#79838c"/><stop offset="1" stop-color="#c6ced5"/>
    </linearGradient>
    <linearGradient id="steelDark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7b858e"/><stop offset="0.45" stop-color="#3d444b"/><stop offset="1" stop-color="#16191d"/>
    </linearGradient>
    <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e8d5a3"/><stop offset="0.5" stop-color="#c9a86a"/><stop offset="1" stop-color="#8a6a1f"/>
    </linearGradient>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="b"/><feOffset in="b" dx="6" dy="14" result="o"/><feFlood flood-color="#000" flood-opacity="0.55" result="c"/><feComposite in="c" in2="o" operator="in" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
}

function frame(p, view) {
  const label = view === 'threequarter' ? 'THREE-QUARTER' : view === 'head' ? 'HEAD / TOP' : 'SIDE PROFILE';
  return `<rect width="640" height="420" fill="url(#bg)"/>
    <g opacity="0.07" stroke="#c7cdd3" stroke-width="1">
      ${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 38 + 10}H640"/>`).join('')}
      ${Array.from({ length: 17 }, (_, i) => `<path d="M${i * 40 + 10} 0V420"/>`).join('')}
    </g>
    <text x="34" y="48" fill="#c9a86a" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="3">WELTOQ · TECHNICAL 3D RENDER · ${label}</text>
    <text x="34" y="386" fill="#a5abb3" font-family="Space Grotesk, sans-serif" font-size="21" font-weight="700">${esc(p.name)}</text>
    <text x="34" y="406" fill="#747c86" font-family="Inter, sans-serif" font-size="11" letter-spacing="1.5">${esc(p.sku)} · ${esc(p.diameter)} · ${esc(p.threadPitch)} PITCH · MOQ ${p.moq}</text>
    <path d="M34 60 H606" stroke="#c9a86a" stroke-opacity="0.35"/>`;
}

function threads(x, y, len, h, pitchMm, color = '#4a5157') {
  const step = Math.max(10, Math.min(26, 170 / Math.max(2, len / 20) / Math.max(0.4, pitchMm)));
  const n = Math.max(4, Math.floor(len / step));
  return Array.from({ length: n }, (_, i) => {
    const xx = x + 12 + i * ((len - 20) / n);
    return `<path d="M${fmt(xx)} ${fmt(y)} L${fmt(xx - 12)} ${fmt(y + h)}" stroke="${color}" stroke-width="3" stroke-linecap="round" opacity="0.85"/>`;
  }).join('');
}

function screwThreeQuarter(p, ultraflat) {
  const d = spec(p, 'Thread diameter', p.diameter.replace(/[^\d.]/g, '')) || 4;
  const len = spec(p, 'Length', 16);
  const headD = spec(p, 'Head diameter', d * 1.6);
  const headH = spec(p, 'Head height', ultraflat ? 1.2 : d);
  const pitch = spec(p, 'Thread pitch', 0.7);
  const shankLen = Math.min(280, Math.max(130, len * 9));
  const shankH = Math.max(16, Math.min(46, d * 6));
  const headW = Math.max(38, Math.min(96, headD * 8));
  const headHpx = Math.max(16, Math.min(58, headH * 13));
  const y = 226;
  const x = 176;
  return `<g filter="url(#softShadow)">
    <ellipse cx="330" cy="330" rx="220" ry="18" fill="#000" opacity="0.32"/>
    <g transform="rotate(-12 360 230)">
      <rect x="${x}" y="${y - shankH / 2}" width="${shankLen}" height="${shankH}" rx="8" fill="url(#steel)" stroke="#4f5860" stroke-width="2"/>
      ${threads(x, y - shankH / 2 + 3, shankLen, shankH - 6, pitch)}
      <path d="M${x + shankLen - 18} ${y - shankH / 2} L${x + shankLen} ${y} L${x + shankLen - 18} ${y + shankH / 2} Z" fill="url(#steelDark)" stroke="#4f5860" stroke-width="2"/>
      ${ultraflat ? `
        <ellipse cx="${x - 8}" cy="${y}" rx="${headW / 2 + 16}" ry="${headHpx / 2 + 14}" fill="url(#steel)" stroke="#4f5860" stroke-width="2"/>
        <ellipse cx="${x - 8}" cy="${y - 3}" rx="${headW / 2 + 4}" ry="${headHpx / 2 + 5}" fill="#59616a" stroke="#4f5860"/>
        <polygon points="${x - 22},${y - 12} ${x + 6},${y - 12} ${x + 18},${y - 3} ${x + 6},${y + 6} ${x - 22},${y + 6} ${x - 34},${y - 3}" fill="#111417"/>
      ` : `
        <rect x="${x - headW}" y="${y - headHpx / 2}" width="${headW}" height="${headHpx}" rx="10" fill="url(#steel)" stroke="#4f5860" stroke-width="2"/>
        <ellipse cx="${x - headW + 6}" cy="${y}" rx="${headHpx / 2 - 2}" ry="${headHpx / 2 - 2}" fill="#5e6871" stroke="#4f5860"/>
        <polygon points="${x - headW - 4},${y - 10} ${x - headW + 18},${y - 10} ${x - headW + 28},${y} ${x - headW + 18},${y + 10} ${x - headW - 4},${y + 10} ${x - headW - 14},${y}" fill="#101317"/>
      `}
    </g>
  </g>`;
}

function nutThreeQuarter(p) {
  const af = spec(p, 'Across flats', 13);
  const th = spec(p, 'Nut thickness', 6.5);
  const r = Math.min(94, Math.max(48, af * 6));
  const h = Math.max(28, Math.min(58, th * 7));
  const cx = 340, cy = 232;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    return `${fmt(cx + Math.cos(a) * r)},${fmt(cy + Math.sin(a) * r * 0.82)}`;
  }).join(' ');
  return `<g filter="url(#softShadow)">
    <ellipse cx="340" cy="320" rx="150" ry="17" fill="#000" opacity="0.3"/>
    <polygon points="${pts}" fill="url(#steel)" stroke="#4f5860" stroke-width="3"/>
    <polygon points="${pts}" transform="translate(0 ${h})" fill="url(#steelDark)" stroke="#4f5860" stroke-width="2" opacity="0.95"/>
    <ellipse cx="${cx}" cy="${cy - 4}" rx="${r * 0.52}" ry="${r * 0.42}" fill="#6f7982" stroke="#454d55" stroke-width="3"/>
    <ellipse cx="${cx}" cy="${cy - 4}" rx="${r * 0.35}" ry="${r * 0.27}" fill="#0d1013"/>
    <path d="M${cx - r * 0.7} ${cy - r * 0.45} L${cx + r * 0.7} ${cy + r * 0.45}" stroke="#fff" stroke-opacity="0.16" stroke-width="8"/>
  </g>`;
}

function screwHead(p, ultraflat) {
  const d = spec(p, 'Thread diameter', p.diameter.replace(/[^\d.]/g, '')) || 4;
  const headD = spec(p, 'Head diameter', d * 1.6);
  const r = Math.min(150, Math.max(58, headD * 13));
  const cx = 320, cy = 214;
  const hexR = r * (ultraflat ? 0.34 : 0.38);
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return `${fmt(cx + Math.cos(a) * hexR)},${fmt(cy + Math.sin(a) * hexR)}`;
  }).join(' ');
  return `<g filter="url(#softShadow)">
    <ellipse cx="${cx}" cy="${cy + 16}" rx="${r + 12}" ry="${r * 0.92}" fill="#000" opacity="0.28"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#steel)" stroke="#4f5860" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.86}" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="3"/>
    <polygon points="${hex}" fill="#111417" stroke="#59616a" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${hexR * 0.42}" fill="#050708"/>
    <path d="M${cx - r * 0.72} ${cy - r * 0.5} A${r} ${r} 0 0 1 ${cx + r * 0.3} ${cy - r * 0.78}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="6" stroke-linecap="round"/>
  </g>`;
}

function nutHead(p) {
  const af = spec(p, 'Across flats', 13);
  const r = Math.min(152, Math.max(64, af * 12));
  const cx = 320, cy = 214;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    return `${fmt(cx + Math.cos(a) * r)},${fmt(cy + Math.sin(a) * r)}`;
  }).join(' ');
  return `<g filter="url(#softShadow)">
    <ellipse cx="${cx}" cy="${cy + 14}" rx="${r + 8}" ry="${r * 0.9}" fill="#000" opacity="0.28"/>
    <polygon points="${hex}" fill="url(#steel)" stroke="#4f5860" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.56}" fill="#68727b" stroke="#454d55" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="#0d1013"/>
    <path d="M${cx - r * 0.7} ${cy - r * 0.45} L${cx + r * 0.7} ${cy + r * 0.45}" stroke="#fff" stroke-opacity="0.16" stroke-width="8"/>
  </g>`;
}

function screwSide(p, ultraflat) {
  const d = spec(p, 'Thread diameter', p.diameter.replace(/[^\d.]/g, '')) || 4;
  const len = spec(p, 'Length', 16);
  const headD = spec(p, 'Head diameter', d * 1.6);
  const headH = spec(p, 'Head height', ultraflat ? 1.2 : d);
  const pitch = spec(p, 'Thread pitch', 0.7);
  const L = Math.min(380, Math.max(180, len * 11));
  const H = Math.max(18, Math.min(48, d * 6));
  const x = 140, y = 214;
  const hw = Math.max(34, Math.min(90, headD * 8));
  const hh = Math.max(16, Math.min(60, headH * 14));
  return `<g filter="url(#softShadow)">
    <ellipse cx="330" cy="310" rx="230" ry="16" fill="#000" opacity="0.3"/>
    <g transform="translate(0 ${ultraflat ? -8 : 0})">
      <rect x="${x}" y="${y - H / 2}" width="${L}" height="${H}" rx="7" fill="url(#steel)" stroke="#4f5860" stroke-width="2"/>
      ${threads(x, y - H / 2 + 3, L, H - 6, pitch)}
      <rect x="${x - hw}" y="${y - hh / 2}" width="${hw}" height="${hh}" rx="${ultraflat ? 6 : 9}" fill="url(#steel)" stroke="#4f5860" stroke-width="2"/>
      <rect x="${x - hw + 8}" y="${y - hh / 2 + 5}" width="${Math.max(8, hw - 16)}" height="${Math.max(5, hh - 10)}" rx="4" fill="#0f1215" opacity="0.88"/>
      <path d="M${x} ${y - 60} H${x + L}" stroke="url(#brass)" stroke-width="1.5"/>
      <path d="M${x} ${y - 66} V${y - 54} M${x + L} ${y - 66} V${y - 54}" stroke="url(#brass)" stroke-width="1.5"/>
      <rect x="${x + 62}" y="${y - 72}" width="100" height="24" fill="#0a0b0d" opacity="0.85"/>
      <text x="${x + 70}" y="${y - 55}" fill="#e8d5a3" font-family="Inter, sans-serif" font-size="12">L ${fmt(len)} mm</text>
    </g>
  </g>`;
}

function nutSide(p) {
  const af = spec(p, 'Across flats', 13);
  const th = spec(p, 'Nut thickness', 6.5);
  const w = Math.min(210, Math.max(110, af * 15));
  const h = Math.max(44, Math.min(86, th * 11));
  const x = 218, y = 214;
  return `<g filter="url(#softShadow)">
    <ellipse cx="320" cy="306" rx="150" ry="15" fill="#000" opacity="0.3"/>
    <polygon points="${x},${y - h / 2} ${x + 34},${y - h / 2 - 12} ${x + w - 34},${y - h / 2 - 12} ${x + w},${y - h / 2} ${x + w},${y + h / 2} ${x + w - 34},${y + h / 2 + 12} ${x + 34},${y + h / 2 + 12} ${x},${y + h / 2}" fill="url(#steel)" stroke="#4f5860" stroke-width="3"/>
    <rect x="${x + 14}" y="${y - h / 2 + 12}" width="${w - 28}" height="${h - 24}" rx="4" fill="url(#steelDark)" opacity="0.55"/>
    <path d="M${x} ${y - h / 2 - 34} H${x + w}" stroke="url(#brass)" stroke-width="1.5"/>
    <path d="M${x} ${y - h / 2 - 40} V${y - h / 2 - 28} M${x + w} ${y - h / 2 - 40} V${y - h / 2 - 28}" stroke="url(#brass)" stroke-width="1.5"/>
    <rect x="${x + 40}" y="${y - h / 2 - 62}" width="${Math.max(92, w - 80)}" height="24" fill="#0a0b0d" opacity="0.85"/>
    <text x="${x + 48}" y="${y - h / 2 - 45}" fill="#e8d5a3" font-family="Inter, sans-serif" font-size="12">AF ${fmt(af)} · T ${fmt(th)} mm</text>
  </g>`;
}

let count = 0;
for (const p of products) {
  const isNut = p.fastenerType === 'Standard Hex Nut';
  const isUltra = p.fastenerType === 'Ultraflat Head Socket Screw';
  const views = {
    threequarter: isNut ? nutThreeQuarter(p) : screwThreeQuarter(p, isUltra),
    head: isNut ? nutHead(p) : screwHead(p, isUltra),
    side: isNut ? nutSide(p) : screwSide(p, isUltra),
  };
  for (const [view, art] of Object.entries(views)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" role="img" aria-label="${esc(p.name)} ${view} technical 3D render">
  ${defs()}
  ${frame(p, view)}
  ${art}
</svg>`;
    fs.writeFileSync(path.join(outDir, `${p.id}-${view}.svg`), svg);
    count += 1;
  }
}
console.log(`Generated ${count} renders for ${products.length} products in public/products/renders`);
