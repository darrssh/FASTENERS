import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Aim the Canvas camera at the product. R3F positions the camera but leaves
 * it staring straight down -Z — without this, an offset product sits at the
 * frame edge, half-cropped and looming (the "giant head" defect).
 */
export function AimCamera({ target }: { target: [number, number, number] }) {
  const camera = useThree((s) => s.camera);
  // Callers pass inline literals ([0,0,0]) that change identity every render —
  // depend on the joined value so lookAt re-fires only on real changes.
  const key = target.join(',');
  useEffect(() => {
    const [x, y, z] = key.split(',').map(Number);
    camera.lookAt(new THREE.Vector3(x, y, z));
  }, [camera, key]);
  return null;
}
