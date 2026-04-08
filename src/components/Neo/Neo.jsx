import { Canvas } from '@react-three/fiber';
import React from 'react'
import ParticleSphere from './NeoParticle';
import { OrbitControls } from '@react-three/drei';

export default function Neo({color}) {
  return (

    <Canvas camera={{ position: [0, 0, 6] }}>
      <ambientLight intensity={0.5} />
      <ParticleSphere color={color} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

