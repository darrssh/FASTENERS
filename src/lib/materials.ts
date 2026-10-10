import * as THREE from 'three';
import { materials } from '../data/categories';

/**
 * PBR material factory (§8). Real metalness/roughness/env configs per finish —
 * never a bare color swap. Calibrated for the dark studio + Lightformer env.
 */
export function steelMaterial(finishId = 'stainless'): THREE.MeshStandardMaterial {
  const found = materials.find((m) => m.id === finishId) ?? materials[0];
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(found.pbr.color),
    metalness: found.pbr.metalness,
    roughness: found.pbr.roughness,
    envMapIntensity: found.pbr.envMapIntensity,
  });
  try {
    const rough = brushedRoughnessTexture(256);
    mat.roughnessMap = rough;
  } catch {
    /* SSR / no DOM — skip procedural map */
  }
  return mat;
}

/** Subtle brushed-steel roughness variation generated procedurally (no texture files). */
export function brushedRoughnessTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#8a8a8a';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < size; i++) {
    const v = 120 + Math.floor(Math.random() * 40);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(0, i, size, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}
