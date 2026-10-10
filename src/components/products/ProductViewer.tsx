import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { HeroBolt } from '../hero/HeroBolt';
import { StudioLighting } from '../hero/HeroLighting';
import { useInView } from '../../hooks/useInView';

type Props = {
  finishId?: string;
  reducedMotion?: boolean;
  isMobile?: boolean;
};

/** Compact interactive 3D viewer for product detail pages (§15 P3). Orbit + zoom, no scroll hijack. */
export function ProductViewer({ finishId = 'stainless', reducedMotion = false, isMobile = false }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(0.05);
  return (
    <div ref={ref} className="card-premium relative h-[320px] overflow-hidden md:h-[420px]" aria-label="Interactive 3D product viewer">
      <Canvas
        dpr={isMobile ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [3.2, 1.6, 4.2], fov: 35 }}
        gl={{ antialias: !isMobile, alpha: true }}
        frameloop={inView ? 'always' : 'never'}
      >
        <Suspense fallback={null}>
          <StudioLighting rimIntensity={2.4} shadows={!isMobile} />
          <HeroBolt finishId={finishId} />
          <OrbitControls
            enablePan={false}
            autoRotate={!reducedMotion}
            autoRotateSpeed={0.9}
            minDistance={2.5}
            maxDistance={9}
            target={[0.4, -0.1, 0]}
          />
        </Suspense>
      </Canvas>
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-brass/30 bg-black/60 px-3 py-1 text-[11px] tracking-[0.18em] text-brass-light backdrop-blur">
        DRAG TO ROTATE · LIVE PBR
      </p>
    </div>
  );
}
