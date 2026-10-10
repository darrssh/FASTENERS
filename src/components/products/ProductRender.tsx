import { useId, useState } from 'react';
import { assetUrl } from '../../lib/utils';

/**
 * Product renders — real Excel photography first, procedural SVG fallback.
 * If `renderKey` is a photo path (starts with `/`), render it on a clean
 * studio background. Otherwise fall back to the procedural SVG (used by
 * category/hero 3D sections only).
 */
function Defs({ metal, dark, glow }: { metal: string; dark: string; glow: string }) {
  return (
    <defs>
      <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#EDEFF1" />
        <stop offset="0.45" stopColor="#9AA3AB" />
        <stop offset="0.62" stopColor="#D7DCE0" />
        <stop offset="1" stopColor="#7C848C" />
      </linearGradient>
      <linearGradient id={dark} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A4046" />
        <stop offset="0.5" stopColor="#14171B" />
        <stop offset="1" stopColor="#262C32" />
      </linearGradient>
      <radialGradient id={glow} cx="0.5" cy="0.42" r="0.65">
        <stop offset="0" stopColor="#5b6b82" stopOpacity="0.55" />
        <stop offset="1" stopColor="#101214" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function ThreadedShaft({ x, y, w, h, metal }: { x: number; y: number; w: number; h: number; metal: string }) {
  const lines = Math.max(4, Math.floor(w / 14));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={metal} stroke="#59616a" strokeWidth={2} />
      {Array.from({ length: lines }).map((_, i) => (
        <line
          key={i}
          x1={x + 12 + i * 14}
          y1={y}
          x2={x + 5 + i * 14}
          y2={y + h}
          stroke="#4A5157"
          strokeWidth={3}
        />
      ))}
      <rect x={x} y={y} width={w} height={h * 0.28} fill="#ffffff" opacity={0.22} />
    </g>
  );
}

function Art({ kind, metal, dark }: { kind: string; metal: string; dark: string }) {
  switch (kind) {
    case 'hex-nut':
    case 'lock-nut':
    case 'flange-nut':
      return (
        <g transform="translate(70,55)">
          <polygon points="60,0 150,0 190,45 190,115 150,160 60,160 20,115 20,45" fill={metal} stroke="#59616a" strokeWidth={3} />
          <circle cx="105" cy="80" r="38" fill={dark} stroke="#59616a" strokeWidth={3} />
          <circle cx="105" cy="80" r="26" fill="#0B0D0F" />
        </g>
      );
    case 'flat-washer':
    case 'spring-washer':
      return (
        <g transform="translate(105,95)">
          <ellipse cx="0" cy="0" rx="85" ry="60" fill={metal} stroke="#59616a" strokeWidth={3} />
          <ellipse cx="0" cy="0" rx="38" ry="26" fill="#0B0D0F" stroke="#59616a" strokeWidth={3} />
          <ellipse cx="-25" cy="-16" rx="30" ry="12" fill="#ffffff" opacity={0.25} />
        </g>
      );
    case 'socket-bolt':
    case 'machine-screw':
      return (
        <g transform="translate(40,80)">
          <rect x="0" y="10" width="70" height="70" rx="8" fill={metal} stroke="#59616a" strokeWidth={3} />
          <circle cx="35" cy="45" r="20" fill="#0B0D0F" stroke="#59616a" strokeWidth={2} />
          <ThreadedShaft x={70} y={22} w={160} h={46} metal={metal} />
        </g>
      );
    case 'threaded-rod':
    case 'stud-bolt':
      return (
        <g transform="translate(20,95)">
          <ThreadedShaft x={0} y={0} w={270} h={50} metal={metal} />
        </g>
      );
    case 'anchor-bolt':
      return (
        <g transform="translate(60,40)">
          <rect x="30" y="0" width="34" height="150" fill={metal} stroke="#59616a" strokeWidth={2} />
          <polygon points="30,150 64,150 47,185" fill={metal} stroke="#59616a" strokeWidth={2} />
          <polygon points="20,10 74,10 84,30 84,52 74,60 20,60 10,52 10,30" fill={metal} stroke="#59616a" strokeWidth={2} />
        </g>
      );
    case 'u-bolt':
      return (
        <g transform="translate(70,30)" fill="none" strokeWidth={22} strokeLinecap="round">
          <path d="M20 10 V130 M140 10 V130 M20 130 Q80 175 140 130" stroke="#B9BFC6" />
        </g>
      );
    case 'eye-bolt':
      return (
        <g transform="translate(105,30)">
          <circle cx="0" cy="25" r="38" fill="none" stroke="#C7CDD3" strokeWidth={20} />
          <rect x="-14" y="60" width="28" height="110" fill={metal} stroke="#59616a" strokeWidth={2} />
        </g>
      );
    default:
      return (
        <g transform="translate(30,60)">
          <polygon points="30,0 100,0 125,30 125,75 100,105 30,105 5,75 5,30" fill={metal} stroke="#59616a" strokeWidth={3} />
          <ThreadedShaft x={125} y={28} w={150} h={50} metal={metal} />
        </g>
      );
  }
}

export function ProductRender({
  renderKey,
  name,
  className = '',
  compact = false,
}: {
  renderKey: string;
  name: string;
  className?: string;
  compact?: boolean;
}) {
  // Unique gradient ids per instance: a catalog grid mounts dozens of these,
  // and duplicate ids resolve to the first card's (possibly unmounted) defs.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const metal = `url(#tbe-metal-${uid})`;
  const dark = `url(#tbe-metal-dark-${uid})`;
  const glow = `url(#tbe-glow-${uid})`;
  const [imgOk, setImgOk] = useState(true);

  if (renderKey.startsWith('/') && imgOk) {
    return (
      <div className="relative overflow-hidden bg-white">
        <img
          src={assetUrl(renderKey)}
          alt={`${name} — product photo`}
          loading="lazy"
          width={320}
          height={220}
          onError={() => setImgOk(false)}
          className={className}
          style={{ display: 'block', width: '100%', height: compact ? 150 : 220, objectFit: 'contain', background: '#fff', padding: 12, aspectRatio: '320 / 220' }}
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" aria-hidden />
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden">
      <svg
        viewBox="0 0 320 220"
        className={className}
        role="img"
        aria-label={`${name} — procedurally rendered sample product image`}
        style={{ background: 'radial-gradient(120% 100% at 50% 20%, #232a32 0%, #14171B 55%, #0c0e10 100%)', display: 'block', width: '100%', height: compact ? 150 : 'auto' }}
      >
        <Defs metal={`tbe-metal-${uid}`} dark={`tbe-metal-dark-${uid}`} glow={`tbe-glow-${uid}`} />
        <rect x="0" y="0" width="320" height="220" fill={glow} />
        <Art kind={renderKey} metal={metal} dark={dark} />
        <text x="16" y="204" fill="#8a6a1f" fontSize="9" letterSpacing="2.5" fontWeight="700">★ PREMIUM SAMPLE</text>
      </svg>
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[0.04]" aria-hidden />
    </div>
  );
}
