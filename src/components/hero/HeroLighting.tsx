import { Environment, Lightformer } from '@react-three/drei';

/**
 * Controlled studio lighting rig (§9): key + fill + rim + blue accent,
 * plus a LOCAL Lightformer environment so metals have something believable
 * to reflect without fetching remote HDRIs (works offline, no broken URLs).
 */
export function StudioLighting({ rimIntensity = 2.2 }: { rimIntensity?: number }) {
  return (
    <>
      {/* KEY — large soft source above-left: reveals head + thread highlights */}
      <directionalLight
        position={[4.5, 6, 3.5]}
        intensity={2.6}
        color="#fff6e3"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      {/* FILL — opposite side, softer: preserves shape, kills black pits */}
      <directionalLight position={[-5, 1.5, 2.5]} intensity={0.85} color="#dfe8f2" />
      {/* RIM — behind: separates bolt from charcoal bg with edge highlight */}
      <directionalLight position={[-1.5, 3, -5]} intensity={rimIntensity} color="#e8d5a3" />
      {/* ACCENT — subtle brand-blue depth (must not overpower metal §9) */}
      <pointLight position={[3.5, -2, -1.5]} intensity={6} color="#C9A86A" distance={14} />
      <ambientLight intensity={0.14} />
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer form="circle" intensity={5} position={[0, 5, -9]} scale={3} color="#ffffff" />
          <Lightformer form="rect" intensity={2.2} position={[-5, 1, -1]} scale={4} color="#dfe8f2" />
          <Lightformer form="rect" intensity={1.4} position={[5, -1, 0]} scale={5} color="#9db8dd" />
          <Lightformer form="rect" intensity={0.7} position={[0, -4, 4]} scale={6} color="#3B82F6" />
        </group>
      </Environment>
    </>
  );
}
