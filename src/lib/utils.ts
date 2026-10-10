export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Prefix a root-absolute public asset path (e.g. `/products/x.png`) with the
 * Vite base so images work under GitHub Pages project-site hosting
 * (`/FASTENERS/...`) as well as local dev (`/`).
 */
export function assetUrl(p: string): string {
  if (/^(https?:|data:|blob:)/.test(p)) return p;
  const base: string = import.meta.env.BASE_URL || '/';
  if (p.startsWith('/')) return base + p.slice(1);
  return base + p;
}

export function formatINR(value: number | null, currency = 'INR'): string {
  if (value === null || value === undefined) return 'Request quote';
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/** Smoothstep interpolation between keyframed stops. */
export function keyframeLerp(stops: { at: number; value: number }[], t: number): number {
  if (stops.length === 0) return 0;
  if (t <= stops[0].at) return stops[0].value;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a.at && t <= b.at) {
      const k = (t - a.at) / Math.max(1e-6, b.at - a.at);
      const s = k * k * (3 - 2 * k);
      return a.value + (b.value - a.value) * s;
    }
  }
  return stops[stops.length - 1].value;
}

/** Exponential ease-out keyframe lerp — cinematic camera language (fast-in, soft settle). */
export function keyframeLerpExpo(stops: { at: number; value: number }[], t: number): number {
  if (stops.length === 0) return 0;
  if (t <= stops[0].at) return stops[0].value;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (t >= a.at && t <= b.at) {
      const k = (t - a.at) / Math.max(1e-6, b.at - a.at);
      const e = k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
      return a.value + (b.value - a.value) * e;
    }
  }
  return stops[stops.length - 1].value;
}

export function lerp(a: number, b: number, k: number): number {
  return a + (b - a) * k;
}

/** Frame-rate independent damping (mirrors THREE.MathUtils.damp). */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function sceneIndexForProgress(t: number): number {
  const edges = [0, 0.1, 0.22, 0.36, 0.5, 0.64, 0.78, 0.9, 1.01];
  for (let i = 0; i < edges.length - 1; i++) {
    if (t >= edges[i] && t < edges[i + 1]) return i;
  }
  return 7;
}

export function setMeta(title: string, description: string) {
  document.title = title;
  let el = document.querySelector('meta[name="description"]');
  if (el) el.setAttribute('content', description);
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
