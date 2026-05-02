"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CinematicOrb() {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const coreRef = useRef();

  const particleCount = 800;
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.6 + Math.random() * 0.8;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.2;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.15;
    if (ring3Ref.current) ring3Ref.current.rotation.x = t * 0.12;
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.06);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glowing core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#20C997" transparent opacity={0.12} />
      </mesh>

      {/* Orbital rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.2, 0.008, 16, 100]} />
        <meshBasicMaterial color="#20C997" transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
        <torusGeometry args={[1.5, 0.006, 16, 100]} />
        <meshBasicMaterial color="#20C997" transparent opacity={0.15} />
      </mesh>
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[1.8, 0.004, 16, 100]} />
        <meshBasicMaterial color="#0d7c66" transparent opacity={0.1} />
      </mesh>

      {/* Ambient particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.012} color="#20C997" transparent opacity={0.4} sizeAttenuation />
      </points>
    </group>
  );
}

export default function StoryVisualOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.NoToneMapping,
      }}
      style={{ background: "transparent" }}
    >
      <CinematicOrb />
    </Canvas>
  );
}
