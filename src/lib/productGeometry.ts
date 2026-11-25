import * as THREE from 'three';
import type { Product } from '../data/products';

/**
 * Product-specific procedural geometry. Built from the exact WELTORQUE spec
 * values (thread diameter, length, pitch, head diameter/height, Allen size,
 * across-flats and nut thickness). This is a NEW foundry for catalogue SKUs —
 * the locked scroll-driven journey and its geometry.ts constants are untouched.
 */
const MM = 0.11; // world units per catalogue millimetre

class ProductHelix extends THREE.Curve<THREE.Vector3> {
  constructor(private radius: number, private x0: number, private x1: number, private turns: number) {
    super();
  }
  override getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const a = t * this.turns * Math.PI * 2;
    return target.set(this.x0 + (this.x1 - this.x0) * t, Math.cos(a) * this.radius, Math.sin(a) * this.radius);
  }
}

const num = (value: string | undefined, fallback: number) => {
  const n = Number.parseFloat(value ?? '');
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
const specNumber = (p: Product, label: string, fallback: number) =>
  num(p.specs.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value, fallback);
const diameterMm = (p: Product) => num(p.diameter.replace(/[^\d.]/g, ''), 4);

type Dimensions = {
  diameter: number;
  length: number;
  pitch: number;
  headDiameter: number;
  headHeight: number;
  acrossFlats: number;
  nutThickness: number;
  shankR: number;
  shankLen: number;
  headR: number;
  headH: number;
};

export function productDimensions(p: Product): Dimensions {
  const diameter = diameterMm(p);
  const length = specNumber(p, 'Length', 16);
  const pitch = specNumber(p, 'Thread pitch', 0.7);
  const headDiameter = specNumber(p, 'Head diameter', diameter * 1.6);
  const headHeight = specNumber(p, 'Head height', p.fastenerType === 'Ultraflat Head Socket Screw' ? 1.2 : diameter);
  const acrossFlats = specNumber(p, 'Across flats', diameter * 1.6);
  const nutThickness = specNumber(p, 'Nut thickness', diameter * 0.8);
  return {
    diameter, length, pitch, headDiameter, headHeight, acrossFlats, nutThickness,
    shankR: diameter * MM / 2,
    shankLen: p.fastenerType === 'Standard Hex Nut' ? diameter * 0.6 : length * MM,
    headR: headDiameter * MM / 2,
    headH: headHeight * MM,
  };
}

function mesh(geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function socket(group: THREE.Group, material: THREE.Material, radius: number, depth: number, atX: number, dark: THREE.Material) {
  const recess = mesh(new THREE.CylinderGeometry(radius, radius * 0.92, depth, 6), dark);
  recess.rotation.z = Math.PI / 2;
  recess.position.x = atX;
  recess.rotation.x = Math.PI / 6;
  group.add(recess);
  const floor = mesh(new THREE.CircleGeometry(radius * 0.82, 6), material);
  floor.rotation.y = Math.PI / 2;
  floor.position.x = atX + depth * 0.5 + 0.002;
  group.add(floor);
}

function threadedShank(d: Dimensions, material: THREE.Material, detail: 'high' | 'low'): THREE.Group {
  const group = new THREE.Group();
  const core = mesh(new THREE.CylinderGeometry(d.shankR * 0.94, d.shankR * 0.94, d.shankLen, detail === 'low' ? 24 : 48), material);
  core.rotation.z = Math.PI / 2;
  group.add(core);

  const threadStart = -d.shankLen / 2 + d.shankLen * 0.3;
  const threadEnd = d.shankLen / 2 - d.headH * 0.15;
  const threadLen = Math.max(0.2, threadEnd - threadStart);
  const pitchWorld = Math.max(0.06, d.pitch * MM);
  const turns = threadLen / pitchWorld;
  const helix = new ProductHelix(d.shankR * 1.01, threadStart, threadEnd, turns);
  const radial = detail === 'low' ? 6 : 9;
  const tubular = Math.max(24, Math.min(900, Math.floor(turns * (detail === 'low' ? 12 : 24))));
  group.add(mesh(new THREE.TubeGeometry(helix, tubular, pitchWorld * 0.28, radial, false), material));

  const tip = mesh(new THREE.CylinderGeometry(d.shankR * 0.92, d.shankR * 0.62, d.shankR * 0.4, 32), material);
  tip.rotation.z = Math.PI / 2;
  tip.position.x = d.shankLen / 2 + d.shankR * 0.2;
  group.add(tip);
  return group;
}

function screw(p: Product, d: Dimensions, material: THREE.Material, dark: THREE.Material, detail: 'high' | 'low'): THREE.Group {
  const group = new THREE.Group();
  const ultra = p.fastenerType === 'Ultraflat Head Socket Screw';
  group.add(threadedShank(d, material, detail));

  const head = mesh(
    new THREE.CylinderGeometry(d.headR, ultra ? d.headR * 0.94 : d.headR * 0.86, d.headH, ultra ? 64 : 48),
    material,
  );
  head.rotation.z = Math.PI / 2;
  head.position.x = -d.shankLen / 2 - d.headH / 2;
  group.add(head);

  const allen = specNumber(p, 'Allen key size', d.diameter * 0.5) * MM * 0.62;
  socket(group, material, Math.min(allen, d.headR * 0.62), Math.max(0.04, d.headH * 0.45), head.position.x - d.headH * 0.18, dark);
  return group;
}

function nut(p: Product, d: Dimensions, material: THREE.Material, detail: 'high' | 'low'): THREE.Group {
  const group = new THREE.Group();
  const r = d.acrossFlats * MM / Math.sqrt(3);
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, d.shankR * 1.06, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d.nutThickness * MM,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: detail === 'low' ? 1 : 2,
    curveSegments: detail === 'low' ? 24 : 48,
  });
  geo.center();
  const body = mesh(geo, material);
  body.rotation.y = Math.PI / 2;
  group.add(body);
  void p;
  return group;
}

/** Build a centred fastener along the X axis, scaled from the real SKU specs. */
export function buildProductFastener(
  product: Product,
  material: THREE.Material,
  detail: 'high' | 'low' = 'high',
): THREE.Group {
  const d = productDimensions(product);
  const dark = new THREE.MeshStandardMaterial({ color: '#0d1013', metalness: 0.6, roughness: 0.62 });
  const group = product.fastenerType === 'Standard Hex Nut'
    ? nut(product, d, material, detail)
    : screw(product, d, material, dark, detail);
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.sub(center);
  group.userData.darkMaterial = dark;
  group.userData.approxSize = Math.max(d.shankLen + d.headH, d.headR * 2, d.acrossFlats * MM);
  return group;
}

/** Free only geometries/materials created by this foundry, not shared scene assets. */
export function disposeProductFastener(group: THREE.Group) {
  group.traverse((obj) => {
    const m = obj as THREE.Mesh;
    if (m.isMesh) m.geometry.dispose();
  });
  const dark = group.userData.darkMaterial as THREE.Material | undefined;
  dark?.dispose();
}
