import { Canvas } from '@react-three/fiber';
import React from 'react'
import ParticleSphere from './NeoParticle';
import { OrbitControls } from '@react-three/drei';
import { useInView } from 'react-intersection-observer';

export default function Neo({color}) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: '200px 0px',
  });

  return (
    <div ref={ref} className="w-full h-full">
      {inView && (
        <Canvas camera={{ position: [0, 0, 6] }} frameloop="always">
          <ambientLight intensity={0.5} />
          <ParticleSphere color={color} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      )}
    </div>
  );
}

