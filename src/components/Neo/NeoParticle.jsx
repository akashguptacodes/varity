import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { generateSpherePositions } from './NeoUtils/sphere';
import * as THREE from 'three';

const ParticleSphere = ({ color, inView, isMobile = false, particleCount, particleSize }) => {
  const points = useRef();
  const resolvedCount = particleCount ?? (isMobile ? 1500 : 10000);
  const resolvedSize = particleSize ?? 0.03;
  const { positions, particlesCount } = useMemo(() => generateSpherePositions(resolvedCount), [resolvedCount]);

  // Store original positions for stable displacement calculations
  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);

  // Frame counter for throttling
  const frameCounter = useRef(0);

  const occluderMaterial = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#EFF8F6") }
    },
    vertexShader: `
      varying vec2 vUv;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        float r = length(pos);
        float theta = atan(pos.y, pos.x);
        float phi = acos(pos.z / r);
        
        float ripple = sin(theta * 6.0 + uTime * 1.2) * sin(phi * 5.0 - uTime * 0.8) * 0.08;
        float wobble = sin(uTime * 1.5) * 0.02;
        float displacement = 1.0 + ripple + wobble;
        
        vec3 newPos = pos * displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        gl_FragColor = vec4(uColor, 1.0);
      }
    `
  }), []);

  const occluderRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (occluderRef.current) {
      occluderRef.current.material.uniforms.uTime.value = time;
    }

    if (!points.current) return;

    // Throttle: update every 4th frame on mobile, every 3rd on desktop
    frameCounter.current++;
    const skipFrames = isMobile ? 4 : 3;
    if (frameCounter.current % skipFrames !== 0) {
      // Still do rotation for visual smoothness
      points.current.rotation.x += 0.001;
      points.current.rotation.y += 0.001;
      if (occluderRef.current) {
        occluderRef.current.rotation.x += 0.001;
        occluderRef.current.rotation.y += 0.001;
      }
      return;
    }

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const x = originalPositions[i3];
      const y = originalPositions[i3 + 1];
      const z = originalPositions[i3 + 2];

      const r = Math.sqrt(x * x + y * y + z * z);
      if (r === 0) continue;
      const theta = Math.atan2(y, x);
      const phi = Math.acos(z / r);

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
    if (occluderRef.current) {
      occluderRef.current.rotation.x += 0.001;
      occluderRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Dynamic wobbling core */}
      <mesh ref={occluderRef}>
        <sphereGeometry args={[2.25, 64, 64]} />
        <shaderMaterial {...occluderMaterial} />
      </mesh>

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
    </group>
  );
};

export default ParticleSphere;