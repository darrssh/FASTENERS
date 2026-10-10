import * as THREE from 'three';

/**
 * Procedural fastener geometry foundry (§7, §29).
 * Real thread geometry (helical TubeGeometry), beveled hex heads, separate
 * bolt / nut / washer objects ready for scroll animation. No external GLBs,
 * no license risk, zero broken model paths. Generator code IS the deliverable.
 */

export const THREAD_PITCH = 0.16; // world units per revolution (drives nut kinematics §11)

// Nominal M12-style family: bolt shank Ø1.0, thread major Ø~1.07, head + nut
// share one wrench size (AF 1.7). Bores clear the thread major with a close,
// believable running fit — no clipping, no floating.
export const HEAD_AF = 1.7;
export const NUT_AF = 1.7;
export const NUT_BORE_R = 0.56;
export const WASHER_OD_R = 1.0;
export const WASHER_BORE_R = 0.56;

// Seating positions on the bolt axis (X): head face ≈ -1.64, thread spans
// [-0.4, +1.7], tip ≈ +1.79. Single source of truth for hero, journey, CTA.
export const NUT_ASSEMBLED_X = 0.15;
export const WASHER_ASSEMBLED_X = -1.52;
export const NUT_LOOSENED_X = 1.15;
export const NUT_EXPLODED_X = 2.5;
export const WASHER_EXPLODED_X = 0.95;

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private radius: number,
    private y0: number,
    private y1: number,
    private turns: number,
  ) {
    super();
  }
  override getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const a = t * this.turns * Math.PI * 2;
    return target.set(
      Math.cos(a) * this.radius,
      this.y0 + (this.y1 - this.y0) * t,
      Math.sin(a) * this.radius,
    );
  }
}

function chamferedHexHead(af: number, height: number, material: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  const r = af / Math.sqrt(3); // flat-to-flat -> corner radius
  const head = new THREE.Mesh(new THREE.CylinderGeometry(r, r, height, 6, 1, false), material);
  head.castShadow = true;
  head.receiveShadow = true;
  // Top + bottom chamfer rings (beveled edges, no hard math edges §7)
  const chamfer = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.88, r, height * 0.22, 6, 1, false), material);
  chamfer.position.y = height * 0.5 - height * 0.11;
  const chamfer2 = chamfer.clone();
  chamfer2.position.y = -height * 0.5 + height * 0.11;
  chamfer2.rotation.y = Math.PI / 6;
  // Washer face under head
  const washerFace = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.82, r * 0.86, height * 0.16, 48), material);
  washerFace.position.y = -height * 0.5 - height * 0.06;
  g.add(head, chamfer, chamfer2, washerFace);
  return g;
}

export function buildBolt(material: THREE.Material, detail: 'high' | 'low' = 'high'): { group: THREE.Group; length: number; shaftR: number } {
  const group = new THREE.Group();
  const shaftR = 0.5;
  const headAF = HEAD_AF;
  const headH = 0.62;
  const shaftLen = 3.4;
  const threadLen = 2.1;

  const head = chamferedHexHead(headAF, headH, material);
  head.position.y = shaftLen / 2 + headH / 2;
  head.rotation.y = Math.PI / 6;
  group.add(head);

  // Smooth shank (upper) + threaded core (lower)
  const shankLen = shaftLen - threadLen;
  const shank = new THREE.Mesh(new THREE.CylinderGeometry(shaftR, shaftR, shankLen, 48), material);
  shank.position.y = shaftLen / 2 - shankLen / 2;
  shank.castShadow = true;
  const core = new THREE.Mesh(new THREE.CylinderGeometry(shaftR * 0.94, shaftR * 0.94, threadLen, 48), material);
  core.position.y = -shaftLen / 2 + threadLen / 2;
  core.castShadow = true;
  group.add(shank, core);

  // Real helical thread ridge — tubular segments scale with detail (mobile LOD).
  const turns = threadLen / THREAD_PITCH;
  const helix = new HelixCurve(shaftR * 0.97, -shaftLen / 2, -shaftLen / 2 + threadLen, turns);
  const radialSegs = detail === 'low' ? 7 : 10;
  const tubularSegs = Math.floor(turns * (detail === 'low' ? 14 : 28));
  const thread = new THREE.Mesh(new THREE.TubeGeometry(helix, tubularSegs, THREAD_PITCH * 0.32, radialSegs, false), material);
  thread.castShadow = true;
  group.add(thread);

  // Chamfered tip
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(shaftR * 0.94, shaftR * 0.7, 0.18, 48), material);
  tip.position.y = -shaftLen / 2 - 0.09;
  group.add(tip);

  // Lay along X so the shaft extends diagonally in hero composition
  const wrapper = new THREE.Group();
  wrapper.add(group);
  group.rotation.z = Math.PI / 2;
  return { group: wrapper, length: shaftLen, shaftR };
}

export function buildNut(material: THREE.Material): THREE.Group {
  const af = NUT_AF;
  const r = af / Math.sqrt(3);
  const thickness = 0.72;
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, NUT_BORE_R, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.06,
    bevelSegments: 2,
    curveSegments: 48,
  });
  geo.center();
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  const g = new THREE.Group();
  // Extrude is along Z; rotate so bore aligns with bolt axis (X after wrapper)
  const inner = new THREE.Group();
  inner.add(mesh);
  inner.rotation.y = Math.PI / 2;
  g.add(inner);
  g.userData.inner = inner;
  return g;
}

export function buildWasher(material: THREE.Material): THREE.Group {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, WASHER_OD_R, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, WASHER_BORE_R, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 1,
    curveSegments: 64,
  });
  geo.center();
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const g = new THREE.Group();
  const inner = new THREE.Group();
  inner.add(mesh);
  inner.rotation.y = Math.PI / 2; // face normal along X
  g.add(inner);
  return g;
}

/** Nut kinematics: axial travel <-> rotation locked by thread pitch (§11 Scene 3). */
export function nutRotationForTravel(axialDistance: number): number {
  return (axialDistance / THREAD_PITCH) * Math.PI * 2;
}
