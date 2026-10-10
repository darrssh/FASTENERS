import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { HeroBolt } from './HeroBolt';
import { StudioLighting } from './HeroLighting';
import { AimCamera } from './AimCamera';

type Props = {
  finishId?: string;
  reducedMotion?: boolean;
  isMobile?: boolean;
  onError?: () => void;
};

/**
 * Hero 3D visual — lives in its own right-hand zone (no text overlay, so
 * overlap is structurally impossible). Camera aims at the bolt center;
 * distance ≈ 7.2 → bolt fills the zone without cropping or looming.
 */
export function HeroScene({ finishId = 'stainless', reducedMotion = false, isMobile = false, onError }: Props) {
  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: isMobile ? [4.4, 1.9, 5.9] : [4.2, 1.8, 5.6], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        try {
          gl.shadowMap.enabled = !isMobile;
          gl.shadowMap.type = 2;
        } catch {
          onError?.();
        }
      }}
      onError={onError}
      aria-hidden
    >
      <Suspense fallback={null}>
        <AimCamera target={[0, 0, 0]} />
        <StudioLighting />
        {reducedMotion ? (
          <HeroBolt finishId={finishId} shift={[0, 0, 0]} />
        ) : (
          <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35} floatingRange={[-0.08, 0.08]}>
            <HeroBolt finishId={finishId} shift={[0, 0, 0]} />
          </Float>
        )}
        {!isMobile && <ContactShadows position={[0, -1.6, 0]} opacity={0.55} scale={10} blur={2.4} far={4} color="#000000" />}
      </Suspense>
    </Canvas>
  );
}
