import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { generateSpherePositions } from './NeoUtils/sphere';

const ParticleSphere = ({ color }) => {
  const points = useRef();
  const { positions, particlesCount } = useMemo(() => generateSpherePositions(), []);
  
  // Store original positions for stable displacement calculations
  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);
  
  useFrame(({ clock }) => {
    if (!points.current) return;
    
    const time = clock.getElapsedTime();
    
    for (let i = 0; i < particlesCount; i++) {
       const i3 = i * 3;
       const x = originalPositions[i3];
       const y = originalPositions[i3 + 1];
       const z = originalPositions[i3 + 2];
       
       // Calculate spherical coordinates to map noise properly around the surface
       const r = Math.sqrt(x*x + y*y + z*z);
       if (r === 0) continue;
       const theta = Math.atan2(y, x);
       const phi = Math.acos(z / r);
       
       // Spherically wrapped ripples prevent Cartesian flat planes (the diamond effect)
       // Integer multipliers for theta (8.0, 4.0) ensure seamless equatorial wrapping
       const ripple1 = Math.sin(theta * 8.0 + time * 1.5) * Math.sin(phi * 6.0 - time) * 0.08;
       const ripple2 = Math.cos(theta * 4.0 - time * 2.0) * Math.cos(phi * 5.0 + time * 1.2) * 0.05;
       
       // Pure subtle breathing wobble
       const wobble = Math.sin(time * 2.0) * 0.02;
       
       const displacement = 1.0 + ripple1 + ripple2 + wobble;
       
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
        size={0.03}
        color={color}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default ParticleSphere;