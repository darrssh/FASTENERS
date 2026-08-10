"use client";

import { Environment, Lightformer } from "@react-three/drei";

export default function JewelleryLighting() {
  return (
    <>
      <ambientLight intensity={0.18} />
      <spotLight
        position={[4, 6, 5]}
        angle={0.5}
        penumbra={1}
        intensity={70}
        color="#fff2da"
        distance={30}
      />
      <directionalLight
        position={[-6, 2, -4]}
        intensity={1.4}
        color="#ece4d6"
      />
      <pointLight position={[-3, -2, 3]} intensity={10} color="#5b7fa6" />

      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 0]}>
          <Lightformer
            form="rect"
            intensity={3}
            color="#fff6e8"
            position={[0, 5, -9]}
            scale={[10, 10, 1]}
          />
          <Lightformer
            form="rect"
            intensity={4}
            color="#fff3da"
            position={[-5, 1, -1]}
            rotation-y={Math.PI / 2}
            scale={[20, 0.6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={4}
            color="#ffe6c0"
            position={[5, 1, 1]}
            rotation-y={-Math.PI / 2}
            scale={[20, 0.6, 1]}
          />
          <Lightformer
            form="ring"
            intensity={2}
            color="#ffffff"
            position={[0, 4, 2]}
            scale={[4, 4, 1]}
          />
        </group>
      </Environment>
    </>
  );
}
