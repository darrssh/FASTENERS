"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import Ring, { type RingQuality } from "@/components/3d/Ring";
import JewelleryLighting from "@/components/3d/JewelleryLighting";
import { heroState } from "@/lib/heroState";
import { METAL_COLORS, STONE_COLORS } from "@/lib/constants";

const CAMERA_KEYFRAMES: { t: number; pos: [number, number, number] }[] = [
  { t: 0, pos: [0, 0.8, 7.2] },
  { t: 0.25, pos: [0.6, 0.9, 6.2] },
  { t: 0.5, pos: [1.3, 1.5, 4.4] },
  { t: 0.75, pos: [2.3, 2.3, 2.8] },
  { t: 1, pos: [3.8, 1.1, 3.6] },
];

function sampleKeyframes(progress: number, out: THREE.Vector3): THREE.Vector3 {
  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    const a = CAMERA_KEYFRAMES[i];
    const b = CAMERA_KEYFRAMES[i + 1];
    if (progress >= a.t && progress <= b.t) {
      const span = b.t - a.t || 1;
      const local = (progress - a.t) / span;
      out.set(
        a.pos[0] + (b.pos[0] - a.pos[0]) * local,
        a.pos[1] + (b.pos[1] - a.pos[1]) * local,
        a.pos[2] + (b.pos[2] - a.pos[2]) * local
      );
      return out;
    }
  }
  return out.set(...CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1].pos);
}

function CameraRig() {
  const sampled = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    sampleKeyframes(heroState.progress, sampled);

    const introOffset = (1 - heroState.intro) * 1.6;
    state.camera.position.lerp(
      target.set(sampled.x, sampled.y, sampled.z + introOffset),
      0.07
    );
    state.camera.lookAt(0, -0.1, 0);
  });

  return null;
}

function RingRig({
  ringRef,
  scale,
}: {
  ringRef: React.RefObject<THREE.Group | null>;
  scale: number;
}) {
  useFrame((state) => {
    const group = ringRef.current;
    if (!group) return;

    const p = heroState.progress;
    const idle = state.clock.elapsedTime;

    group.rotation.y = p * -2.6 + idle * 0.04;
    group.rotation.x = p * 0.35;
    group.position.x = THREE.MathUtils.lerp(0, 2.1, easeInOutCubic(p));
    group.position.y = THREE.MathUtils.lerp(0, 0.35, p);
    group.scale.setScalar(scale * (0.68 + 0.32 * heroState.intro));
  });

  return null;
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function useWebGL() {
  return useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof document === "undefined") return false;
      try {
        const canvas = document.createElement("canvas");
        return !!(
          canvas.getContext("webgl2") || canvas.getContext("webgl")
        );
      } catch {
        return false;
      }
    },
    () => false
  );
}

function useIsLowQuality() {
  return useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof window === "undefined") return false;
      return (
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768
      );
    },
    () => false
  );
}

class SceneBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function DiamondFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="h-40 w-40 opacity-90 md:h-64 md:w-64"
        aria-hidden="true"
      >
        <polygon
          points="100,10 185,75 150,185 50,185 15,75"
          fill="#f3efe7"
          opacity="0.08"
        />
        <polygon
          points="100,10 185,75 150,185 50,185 15,75"
          fill="none"
          stroke="#c6a66b"
          strokeWidth="0.75"
        />
        <polygon points="100,10 15,75 50,185" fill="#f3efe7" opacity="0.05" />
        <line x1="100" y1="10" x2="100" y2="185" stroke="#c6a66b" strokeWidth="0.5" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function HeroScene() {
  const ringRef = useRef<THREE.Group>(null);
  const webgl = useWebGL();
  const low = useIsLowQuality();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const onResize = () => {
      const portrait = window.innerWidth / window.innerHeight < 0.75;
      setScale(portrait ? 0.72 : 1);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!webgl) {
    return <DiamondFallback />;
  }

  const quality: RingQuality = low ? "low" : "high";

  return (
    <div className="absolute inset-0">
      <SceneBoundary fallback={<DiamondFallback />}>
        <Canvas
          dpr={[1, low ? 1.25 : 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <PerspectiveCamera makeDefault fov={35} position={[0, 0.8, 7.2]} />
          <CameraRig />
          <Suspense fallback={null}>
            <JewelleryLighting />
            <RingRig ringRef={ringRef} scale={scale} />
            <Ring
              ref={ringRef}
              metalColor={METAL_COLORS.yellow}
              stoneColor={STONE_COLORS.diamond}
              quality={quality}
            />
            <ContactShadows
              position={[0, -1.55, 0]}
              opacity={0.5}
              scale={10}
              blur={2.8}
              far={3.5}
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
