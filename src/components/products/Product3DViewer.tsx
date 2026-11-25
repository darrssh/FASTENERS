import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Product } from '../../data/products';
import { buildProductFastener, disposeProductFastener, productDimensions } from '../../lib/productGeometry';
import { steelMaterial } from '../../lib/materials';
import { StudioLighting } from '../hero/HeroLighting';
import { useInView } from '../../hooks/useInView';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { RENDER_VIEWS, type RenderView } from '../../data/productMedia';

const CAMERA_POSITIONS: Record<RenderView, [number, number, number]> = {
  threequarter: [3.1, 1.8, 3.6],
  head: [4.4, 0.08, 0.08],
  side: [0.05, 0.35, 4.2],
};

function CameraRig({ view }: { view: RenderView }) {
  const camera = useThree((s) => s.camera);
  const target = useMemo(() => new THREE.Vector3(...CAMERA_POSITIONS[view]), [view]);
  useFrame((_, delta) => {
    const k = 1 - Math.exp(-7 * Math.min(delta, 0.05));
    camera.position.lerp(target, k);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function ProductObject({ product, isMobile }: { product: Product; isMobile: boolean }) {
  const material = useMemo(() => steelMaterial('stainless'), []);
  const group = useMemo(
    () => buildProductFastener(product, material, isMobile ? 'low' : 'high'),
    [product, material, isMobile],
  );
  useEffect(() => () => {
    disposeProductFastener(group);
    material.dispose();
  }, [group, material]);
  return <primitive object={group} />;
}

/** On touch screens, one finger must still scroll the page; rotate uses two. */
function ViewerControls() {
  const coarse = useMediaQuery('(pointer: coarse)');
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    // OrbitControls sets `touch-action: none` when it connects. Restore pan-y
    // so a vertical swipe over the canvas scrolls the page instead of sticking.
    if (coarse) gl.domElement.style.touchAction = 'pan-y';
    return () => { gl.domElement.style.touchAction = ''; };
  }, [coarse, gl]);

  return (
    <OrbitControls
      enablePan={false}
      enableZoom
      autoRotate={false}
      minDistance={2.2}
      maxDistance={8}
      target={[0, 0, 0]}
      touches={coarse ? { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE } : undefined}
    />
  );
}

/**
 * Catalogue-specific interactive viewer. Uses a fresh parametric model per SKU
 * and a neutral illustrative finish. Existing 3D scenes are not modified.
 */
export function Product3DViewer({ product, reducedMotion = false, isMobile = false }: {
  product: Product;
  reducedMotion?: boolean;
  isMobile?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.05);
  const [view, setView] = useState<RenderView>('threequarter');
  const [failed, setFailed] = useState(false);
  const dims = useMemo(() => productDimensions(product), [product]);

  useEffect(() => setView('threequarter'), [product.id]);

  return (
    <div ref={ref} className="card-premium relative overflow-hidden">
      <div className="flex flex-col gap-3 border-b hairline px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow !text-[10px]">Product-specific 3D</p>
          <p className="mt-1 text-[12px] text-muted">
            Built from {dims.diameter} mm · {dims.length} mm · {dims.pitch} mm pitch
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-wrap gap-1 rounded-full border hairline bg-ink-900 p-1 sm:w-auto" role="group" aria-label="3D view angle">
          {RENDER_VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              aria-pressed={view === v.id}
              className={`min-h-[44px] min-w-[44px] flex-1 rounded-full px-3 py-2 text-[12px] transition sm:flex-none sm:text-[11px] ${view === v.id ? 'bg-brass text-ink-950' : 'text-muted hover:text-paper'}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-[300px] md:h-[400px]">
        {failed ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-[13px] text-muted">
            3D preview unavailable. Use the catalogue images and technical renders below.
          </div>
        ) : (
          <Canvas
            dpr={isMobile ? [1, 1.2] : [1, 1.6]}
            camera={{ position: CAMERA_POSITIONS.threequarter, fov: 35 }}
            gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
            frameloop={inView ? 'always' : 'never'}
            onCreated={({ gl }) => { gl.shadowMap.enabled = !isMobile; }}
            onError={() => setFailed(true)}
            aria-hidden
          >
            <Suspense fallback={null}>
              <StudioLighting rimIntensity={2.1} shadows={!isMobile} />
              <CameraRig view={view} />
              <ProductObject product={product} isMobile={isMobile} />
              <ViewerControls />
            </Suspense>
          </Canvas>
        )}
        <p className="pointer-events-none absolute bottom-3 left-1/2 max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-full border border-brass/30 bg-black/60 px-3 py-1 text-center text-[9px] leading-tight tracking-[0.12em] text-brass-light backdrop-blur sm:text-[10px] sm:tracking-[0.16em]">
          ILLUSTRATIVE FINISH · DRAG TO ROTATE
        </p>
      </div>
      {reducedMotion && (
        <p className="border-t hairline px-4 py-2 text-[11px] text-muted-dim">Animation reduced; drag to inspect the model manually.</p>
      )}
    </div>
  );
}
