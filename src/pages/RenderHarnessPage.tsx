import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { products as staticProducts } from '../data/products';
import { buildProductFastener, disposeProductFastener } from '../lib/productGeometry';
import { steelMaterial } from '../lib/materials';
import type { RenderView } from '../data/productMedia';

const CAMERA_POSITIONS: Record<RenderView, [number, number, number]> = {
  threequarter: [2.2, 1.2, 2.5],
  head: [3.0, 0.05, 0.05],
  side: [0.05, 0.25, 3.0],
};

function CameraSetter({ view }: { view: RenderView }) {
  const { camera } = useThree();
  useEffect(() => {
    const [x, y, z] = CAMERA_POSITIONS[view];
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, view]);
  return null;
}

function ProductModel({ id, onReady }: { id: string; onReady: () => void }) {
  const product = staticProducts.find((p) => p.id === id);
  const material = useMemo(() => steelMaterial('stainless'), []);
  const group = useMemo(() => {
    if (!product) return null;
    return buildProductFastener(product, material, 'high');
  }, [product, material]);

  useEffect(() => () => {
    if (group) disposeProductFastener(group);
    material.dispose();
  }, [group, material]);

  useEffect(() => {
    if (!group) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        window.setTimeout(onReady, 200);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [group, onReady]);

  if (!group) return null;
  return <primitive object={group} />;
}

export function RenderHarnessPage() {
  const { id = '', view: viewParam = 'threequarter' } = useParams();
  const view = (['threequarter', 'head', 'side'].includes(viewParam) ? viewParam : 'threequarter') as RenderView;
  const [ready, setReady] = useState(false);
  const product = staticProducts.find((p) => p.id === id);

  useEffect(() => { setReady(false); }, [id, view]);

  const pos = CAMERA_POSITIONS[view];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        margin: 0,
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 38%, #20252b 0%, #12151a 55%, #08090b 100%)',
      }}
    >
      <div
        id="render-target"
        data-render-ready={ready ? 'true' : 'false'}
        data-product-id={id}
        data-view={view}
        style={{ width: 'min(960px, 100vw)', aspectRatio: '3 / 2', maxHeight: '100vh', position: 'relative' }}
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: pos, fov: 35 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <CameraSetter view={view} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[4.5, 6, 3.5]} intensity={2.4} color="#fff6e3" />
            <directionalLight position={[-5, 1.5, 2.5]} intensity={0.8} color="#dfe8f2" />
            <directionalLight position={[-1.5, 3, -5]} intensity={1.8} color="#e8d5a3" />
            {product ? <ProductModel id={id} onReady={() => setReady(true)} /> : null}
          </Suspense>
        </Canvas>
        {!product && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff' }}>
            Product not found: {id}
          </div>
        )}
      </div>
    </div>
  );
}