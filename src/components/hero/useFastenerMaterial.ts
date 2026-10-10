import { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { steelMaterial } from '../../lib/materials';

/** Shared PBR material instance that updates in place when the finish changes. */
export function useFastenerMaterial(finishId: string): THREE.MeshStandardMaterial {
  const mat = useMemo(() => steelMaterial(finishId), []);
  useEffect(() => {
    const next = steelMaterial(finishId);
    mat.color.copy(next.color);
    mat.metalness = next.metalness;
    mat.roughness = next.roughness;
    mat.envMapIntensity = next.envMapIntensity;
    // Material.dispose() does NOT free textures — the throwaway's canvas
    // roughnessMap must go explicitly or every finish switch leaks GPU memory.
    next.roughnessMap?.dispose();
    next.dispose();
  }, [finishId, mat]);
  useEffect(
    () => () => {
      mat.roughnessMap?.dispose();
      mat.dispose();
    },
    [mat],
  );
  return mat;
}
