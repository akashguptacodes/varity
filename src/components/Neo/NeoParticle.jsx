import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { generateSpherePositions } from './NeoUtils/sphere';

const ParticleSphere = ({ color, inView, isMobile = false, particleCount, particleSize }) => {
  const points = useRef();
  const resolvedCount = particleCount ?? (isMobile ? 1500 : 10000);
  const resolvedSize = particleSize ?? 0.03;
  const { positions, particlesCount } = useMemo(() => generateSpherePositions(resolvedCount), [resolvedCount]);
  
  // Store original positions for stable displacement calculations
  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);
  
  // Frame counter for throttling
  const frameCounter = useRef(0);
  
  useFrame(({ clock }) => {
    if (!inView) return;
    if (!points.current) return;
    
    // Throttle: update every 4th frame on mobile, every 3rd on desktop
    frameCounter.current++;
    const skipFrames = isMobile ? 4 : 3;
    if (frameCounter.current % skipFrames !== 0) {
      // Still do rotation for visual smoothness
      points.current.rotation.x += 0.001;
      points.current.rotation.y += 0.001;
      return;
    }
    
    const time = clock.getElapsedTime();
    
    for (let i = 0; i < particlesCount; i++) {
       const i3 = i * 3;
       const x = originalPositions[i3];
       const y = originalPositions[i3 + 1];
       const z = originalPositions[i3 + 2];
       
       const r = Math.sqrt(x*x + y*y + z*z);
       if (r === 0) continue;
       const theta = Math.atan2(y, x);
       const phi = Math.acos(z / r);
       
       // Single simplified ripple + breathing wobble (was 2 ripples + wobble)
       const ripple = Math.sin(theta * 6.0 + time * 1.2) * Math.sin(phi * 5.0 - time * 0.8) * 0.08;
       const wobble = Math.sin(time * 1.5) * 0.02;
       
       const displacement = 1.0 + ripple + wobble;
       
       positions[i3] = x * displacement;
       positions[i3 + 1] = y * displacement;
       positions[i3 + 2] = z * displacement;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    
    // Add slow rotation
    points.current.rotation.x += 0.001;
    points.current.rotation.y += 0.001;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={resolvedSize}
        color={color}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default ParticleSphere;