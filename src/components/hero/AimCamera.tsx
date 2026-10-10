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
  useEffect(() => {
    camera.lookAt(new THREE.Vector3(target[0], target[1], target[2]));
  }, [camera, target]);
  return null;
}
