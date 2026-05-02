import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React, { useState, useEffect } from 'react'
import ParticleSphere from './NeoParticle';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';

/**
 * Neo blob component — scalable via props.
 *
 * @param {string}  color            - Particle color (hex)
 * @param {boolean} isPlaying        - Whether animation should play
 * @param {number}  [particleCount]  - Override particle count (default: 10000 desktop / 1500 mobile)
 * @param {number}  [particleSize]   - Individual particle size (default: 0.03)
 * @param {number}  [cameraZ]        - Camera distance (default: 6 desktop / 7.5 mobile)
 * @param {boolean} [enableRotate]   - Enable click-drag free rotation (default: false)
 */
export default function Neo({
  color,
  isPlaying,
  particleCount,
  particleSize,
  cameraZ,
  enableRotate = false,
}) {
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: '1000px 0px',
  });

  const shouldPlay = isPlaying || inView;

  // SSR-safe device detection for canvas perf tuning
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const resolvedCameraZ = cameraZ ?? (isMobile ? 7.5 : 6);

  return (
    <div ref={ref} className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, resolvedCameraZ] }}
        frameloop="always"
          /* Cap DPR at 1 on mobile for better perf */
          dpr={[1, isMobile ? 1 : 1.5]}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            toneMapping: THREE.NoToneMapping,
          }}
        >
          <ambientLight intensity={0.5} />
          {/* OrbitControls — only when enableRotate is true */}
          {enableRotate && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.6}
              dampingFactor={0.08}
              enableDamping
            />
          )}
          <ParticleSphere
            color={color}
            inView={shouldPlay}
            isMobile={isMobile}
            particleCount={particleCount}
            particleSize={particleSize}
          />
      </Canvas>
    </div>
  );
}
