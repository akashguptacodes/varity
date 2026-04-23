import { Canvas } from '@react-three/fiber';
import React, { useState, useEffect } from 'react'
import ParticleSphere from './NeoParticle';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';

export default function Neo({color}) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: '200px 0px',
  });

  // SSR-safe device detection for canvas perf tuning
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div ref={ref} className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 7.5 : 6] }}
        frameloop={inView ? "always" : "demand"}
          /* Cap DPR at 1 on mobile for better perf */
          dpr={[1, isMobile ? 1 : 1.5]}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            toneMapping: THREE.NoToneMapping,
          }}
        >
          <ambientLight intensity={0.5} />
          {/* Pass isMobile to reduce particle count */}
          <ParticleSphere color={color} inView={inView} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
