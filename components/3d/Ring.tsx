"use client";

import { forwardRef, useEffect, useMemo } from "react";
import * as THREE from "three";

export type RingQuality = "high" | "low";

interface RingProps {
  metalColor: string;
  stoneColor: string;
  quality?: RingQuality;
}

function createDiamondMaterial(stoneColor: string, quality: RingQuality) {
  if (quality === "low") {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(stoneColor),
      metalness: 0,
      roughness: 0.06,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
      envMapIntensity: 2.2,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(stoneColor),
    metalness: 0,
    roughness: 0.02,
    transmission: 1,
    thickness: 1.4,
    ior: 2.4,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    specularIntensity: 1,
    envMapIntensity: 1.8,
  });
}

function createMetalMaterial(metalColor: string) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(metalColor),
    metalness: 1,
    roughness: 0.24,
    envMapIntensity: 1.4,
  });
}

const RING_TOP = 1.12;

const Ring = forwardRef<THREE.Group, RingProps>(function Ring(
  { metalColor, stoneColor, quality = "high" },
  ref
) {
  const metal = useMemo(() => createMetalMaterial(metalColor), [metalColor]);
  const stone = useMemo(
    () => createDiamondMaterial(stoneColor, quality),
    [stoneColor, quality]
  );

  useEffect(() => {
    return () => {
      metal.dispose();
      stone.dispose();
    };
  }, [metal, stone]);

  return (
    <group ref={ref}>
      <mesh geometry={bandGeometry} material={metal} />

      <group position={[0, RING_TOP, 0]}>
        <mesh geometry={pavilionGeometry} material={stone} />
        <mesh geometry={girdleGeometry} material={stone} />
        <mesh geometry={crownGeometry} material={stone} />

        {PRONG_ANGLES.map((angle) => (
          <mesh
            key={angle}
            geometry={prongGeometry}
            material={metal}
            position={[
              Math.cos(angle) * 0.44,
              0.12,
              Math.sin(angle) * 0.44,
            ]}
          />
        ))}
      </group>
    </group>
  );
});

const bandGeometry = new THREE.TorusGeometry(RING_TOP, 0.1, 24, 128);
const pavilionGeometry = new THREE.ConeGeometry(0.42, 0.78, 8);
const girdleGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.05, 16);
const crownGeometry = new THREE.CylinderGeometry(0.2, 0.42, 0.3, 8);
const prongGeometry = new THREE.ConeGeometry(0.024, 0.62, 6);

pavilionGeometry.rotateX(Math.PI);
pavilionGeometry.translate(0, -0.41, 0);
girdleGeometry.translate(0, 0, 0);
crownGeometry.translate(0, 0.175, 0);

const PRONG_ANGLES = [
  Math.PI / 4,
  (3 * Math.PI) / 4,
  (5 * Math.PI) / 4,
  (7 * Math.PI) / 4,
];

export default Ring;
