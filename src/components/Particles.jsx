"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles({ count = 200, mousePosition }) {
  const meshRef = useRef();

  const { positions, sizes, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i] = Math.random() * 3 + 0.5;
      speeds[i] = Math.random() * 0.5 + 0.1;
    }

    return { positions, sizes, speeds };
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const posArray = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3 + 1] += Math.sin(time * speeds[i] + i) * 0.002;
      posArray[i3] += Math.cos(time * speeds[i] * 0.5 + i) * 0.001;

      // Slow drift
      posArray[i3 + 1] += 0.003;
      if (posArray[i3 + 1] > 10) posArray[i3 + 1] = -10;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // Subtle rotation from mouse
    const mx = (mousePosition?.x || 0) * 0.05;
    const my = (mousePosition?.y || 0) * 0.05;
    meshRef.current.rotation.y += (mx - meshRef.current.rotation.y) * 0.01;
    meshRef.current.rotation.x += (my - meshRef.current.rotation.x) * 0.01;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#0d7c66"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
