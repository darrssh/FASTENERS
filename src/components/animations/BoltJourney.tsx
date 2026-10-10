import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { buildBolt, buildNut, buildWasher, nutRotationForTravel, NUT_ASSEMBLED_X, NUT_LOOSENED_X, NUT_EXPLODED_X, WASHER_ASSEMBLED_X, WASHER_EXPLODED_X } from '../../lib/geometry';
import { keyframeLerp, keyframeLerpExpo, damp } from '../../lib/utils';
import { useFastenerMaterial } from '../hero/useFastenerMaterial';

type Props = {
  progress: React.MutableRefObject<number>;
  finishId?: string;
  reducedMotion?: boolean;
  isMobile?: boolean;
};

/**
 * THE SIGNATURE ANIMATION — one persistent scene; scroll progress
 * drives bolt / nut / washer / camera. Mechanically honest nut kinematics:
 * rotation locked to axial travel by thread pitch. Fully reversible.
 * Assembly positions shared with hero + CTA via geometry.ts constants.
 *
 * Premium pass: expo-eased camera, damped FOV kick, scroll-linked dust,
 * exploded-only axis guide, per-scene fog grade, mobile LOD + blob shadow.
 */
export function BoltJourney({ progress, finishId = 'stainless', reducedMotion = false, isMobile = false }: Props) {
  const material = useFastenerMaterial(finishId);
  const assembly = useRef<THREE.Group>(null);
  const boltRef = useRef<THREE.Group>(null);
  const nutRef = useRef<THREE.Group>(null);
  const washerRef = useRef<THREE.Group>(null);
  const axisMat = useRef<THREE.MeshBasicMaterial>(null);
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);

  const built = useMemo(() => {
    const b = buildBolt(material, isMobile ? 'low' : 'high');
    const n = buildNut(material);
    const w = buildWasher(material);
    return { bolt: b.group, nut: n, washer: w };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dispose procedural geometries on unmount — generator code owns its buffers.
  useEffect(() => {
    const roots = [built.bolt, built.nut, built.washer];
    return () => {
      for (const root of roots) {
        root.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) mesh.geometry.dispose();
        });
      }
    };
  }, [built]);

  // Cinematic fog grade: base studio -> cool industrial (scene 7) -> dark finale.
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0b0d', 9, 18);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  const tmpTarget = useMemo(() => new THREE.Vector3(), []);
  const fogColor = useMemo(() => new THREE.Color('#0a0b0d'), []);
  const fogTarget = useMemo(() => new THREE.Color(), []);
  const prevT = useRef(0);
  const smoothVel = useRef(0);
  const dust = useMemo(() => {
    const n = isMobile ? 70 : 140;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, [isMobile]);
  const dustMat = useRef<THREE.PointsMaterial>(null);

  useFrame(({ clock, camera: cam }, delta) => {
    const rawT = progress.current;
    // Damp the read so trackpad jitter never reaches the camera.
    const t = reducedMotion ? rawT : damp(prevT.current, rawT, 18, Math.min(delta, 0.05));
    const time = clock.getElapsedTime();
    const instVel = Math.min(1, Math.abs(rawT - prevT.current) * 14);
    smoothVel.current = damp(smoothVel.current, instVel, 6, Math.min(delta, 0.05));
    prevT.current = t;
    const velocity = reducedMotion ? 0 : smoothVel.current;
    const asm = assembly.current;
    if (!asm || !boltRef.current || !nutRef.current || !washerRef.current) return;

    // ---- Bolt pose ----
    const boltX = keyframeLerp(
      [
        { at: 0, value: 0 },
        { at: 0.5, value: 0 },
        { at: 0.64, value: 0 },
        { at: 0.78, value: -1.6 },
        { at: 0.9, value: -1.2 },
        { at: 1, value: -0.9 },
      ],
      t,
    );
    const boltY = keyframeLerp(
      [
        { at: 0, value: 0 },
        { at: 0.36, value: 0 },
        { at: 0.5, value: 0.15 },
        { at: 0.64, value: 0.15 },
        { at: 0.78, value: 0 },
        { at: 1, value: 0 },
      ],
      t,
    );
    // Idle bob rides on the whole assembly (keeps seating perfect). Fades fast once scrolling.
    const bobAmp = !reducedMotion ? Math.max(0, 1 - t / 0.12) : 0;
    const bobY = Math.sin(time * 0.8) * 0.05 * bobAmp;
    asm.position.set(isMobile ? boltX * 0.6 : boltX, boltY + bobY, 0);

    // Rigid turntable: the WHOLE fastener yaws as one rigid body, so seated
    // parts can never detach or shear. Sway decays with scroll depth.
    const swayAmp = !reducedMotion ? Math.max(0.15, 1 - t / 0.5) : 0;
    const sway = Math.sin(time * 0.5) * 0.07 * swayAmp;
    asm.rotation.y =
      keyframeLerpExpo(
        [
          { at: 0, value: 0.35 },
          { at: 0.22, value: -0.3 },
          { at: 0.5, value: 0.1 },
          { at: 1, value: 0.35 },
        ],
        t,
      ) + sway;

    // ---- Nut: rotate AND translate, pitch-locked ----
    const nutX = keyframeLerp(
      [
        { at: 0, value: NUT_ASSEMBLED_X },
        { at: 0.22, value: NUT_ASSEMBLED_X },
        { at: 0.36, value: NUT_LOOSENED_X },
        { at: 0.5, value: NUT_LOOSENED_X },
        { at: 0.64, value: NUT_EXPLODED_X },
        { at: 0.78, value: NUT_ASSEMBLED_X },
        { at: 1, value: NUT_ASSEMBLED_X },
      ],
      t,
    );
    nutRef.current.position.set(nutX, 0, 0);
    nutRef.current.rotation.x = nutRotationForTravel(nutX - NUT_ASSEMBLED_X);

    // ---- Washer: colinear slide, gentle settle wobble on reseat ----
    const washerX = keyframeLerp(
      [
        { at: 0, value: WASHER_ASSEMBLED_X },
        { at: 0.36, value: WASHER_ASSEMBLED_X },
        { at: 0.5, value: -0.55 },
        { at: 0.64, value: WASHER_EXPLODED_X },
        { at: 0.78, value: WASHER_ASSEMBLED_X },
        { at: 1, value: WASHER_ASSEMBLED_X },
      ],
      t,
    );
    washerRef.current.position.set(washerX, 0, 0);
    const reseat = Math.exp(-Math.pow((t - 0.8) / 0.04, 2));
    washerRef.current.rotation.x =
      keyframeLerp([{ at: 0, value: 0 }, { at: 0.64, value: 0.35 }, { at: 1, value: 0 }], t) +
      (reducedMotion ? 0 : Math.sin(time * 22) * 0.03 * reseat);

    // ---- Exploded-only axis guide + dust response ----
    const axisOn = t > 0.5 && t < 0.72 ? 1 : 0;
    if (axisMat.current) {
      const target = axisOn ? 0.32 : 0;
      axisMat.current.opacity = damp(axisMat.current.opacity, target, 8, Math.min(delta, 0.05));
    }
    if (dustMat.current) {
      dustMat.current.opacity = 0.28 + velocity * 0.3 + (t > 0.5 && t < 0.72 ? 0.08 : 0);
      dustMat.current.size = 0.025 + velocity * 0.012;
    }

    // ---- Fog grade: studio -> industrial blue -> finale charcoal ----
    const fogHex = t < 0.64 ? '#0a0b0d' : t < 0.78 ? '#0d1626' : '#070809';
    fogTarget.set(fogHex);
    fogColor.lerp(fogTarget, 1 - Math.exp(-3 * Math.min(delta, 0.05)));
    const fog = scene.fog as THREE.Fog | null;
    if (fog) {
      fog.color.copy(fogColor);
      fog.near = 9 - velocity * 1.5;
      fog.far = 18 - velocity * 2;
    }

    // ---- Camera: deliberate states, expo interpolation, no clipping ----
    const dist = isMobile ? 1.55 : 1;
    const cx = keyframeLerpExpo(
      [
        { at: 0, value: 3.4 },
        { at: 0.1, value: 3.0 },
        { at: 0.22, value: 2.1 },
        { at: 0.36, value: 2.6 },
        { at: 0.5, value: 3.4 },
        { at: 0.64, value: 4.6 },
        { at: 0.78, value: 5.2 },
        { at: 1, value: 4.4 },
      ],
      t,
    ) * dist;
    const cy = keyframeLerpExpo(
      [
        { at: 0, value: 1.5 },
        { at: 0.22, value: 0.9 },
        { at: 0.5, value: 1.2 },
        { at: 0.78, value: 1.4 },
        { at: 1, value: 1.3 },
      ],
      t,
    );
    const cz = keyframeLerpExpo(
      [
        { at: 0, value: 4.6 },
        { at: 0.22, value: 3.0 },
        { at: 0.64, value: 5.4 },
        { at: 1, value: 4.8 },
      ],
      t,
    ) * dist;
    const tx = keyframeLerp(
      [
        { at: 0, value: 0 },
        { at: 0.36, value: 0.5 },
        { at: 0.64, value: 0 },
        { at: 0.78, value: -0.8 },
        { at: 1, value: -0.4 },
      ],
      t,
    );
    camera.position.set(cx, cy, cz);
    tmpTarget.set(tx, 0.1, 0);
    camera.lookAt(tmpTarget);
    // Scroll-velocity FOV kick: subtle cinematic zoom when scrubbing fast (damped).
    const persp = cam as THREE.PerspectiveCamera;
    if (persp.fov !== undefined) {
      const targetFov = 35 + velocity * 5;
      persp.fov = damp(persp.fov, targetFov, 6, Math.min(delta, 0.05));
      persp.updateProjectionMatrix();
    }
  });

  return (
    <>
      <points geometry={dust}>
        <pointsMaterial ref={dustMat} size={0.025} color="#c9a86a" transparent opacity={0.3} sizeAttenuation depthWrite={false} />
      </points>
      {/* axis guide for exploded view — fades in only around the exploded beat */}
      <mesh position={[0.4, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 6.5, 8]} />
        <meshBasicMaterial ref={axisMat} color="#c9a86a" transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* mobile grounding: cheap blob shadow (ContactShadows is desktop-only) */}
      {isMobile && (
        <mesh position={[0, -1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.6, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.42} depthWrite={false} />
        </mesh>
      )}
      <group ref={assembly}>
        <group ref={boltRef}>
          <primitive object={built.bolt} />
        </group>
        <group ref={nutRef}>
          <primitive object={built.nut} />
        </group>
        <group ref={washerRef}>
          <primitive object={built.washer} />
        </group>
      </group>
    </>
  );
}
