"use client";

import { Suspense, useRef, useCallback, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "react-intersection-observer";
import { CARD_DATA, lerp, throttle } from "@/lib/utils";

const TEXTURE_PATHS = [
  "/images/orbit-12.jpg",
  "/images/orbit-14.jpg",
  "/images/orbit-10.jpg",
  "/images/orbit-11.jpg",
  "/images/orbit-13.jpg",
  "/images/orbit-2.jpg",
];

const tempMatrix = new THREE.Matrix4();
const vec3 = new THREE.Vector3();
const quaternion = new THREE.Quaternion();
const scaleVec = new THREE.Vector3();
const reusableEuler = new THREE.Euler();

/**
 * Responsive camera rig – adjusts FOV and position based on viewport width
 * so the orbiting cards remain visible on mobile without overflow.
 */
function CameraRig({ mouseRef, isMobile }) {
  const { camera, size } = useThree();

  // Dynamically adjust camera based on viewport
  useEffect(() => {
    if (size.width < 768) {
      camera.position.z = 24; // Pull back on mobile
      camera.fov = 55;
    } else if (size.width < 1024) {
      camera.position.z = 20;
      camera.fov = 52;
    } else {
      camera.position.z = 18;
      camera.fov = 50;
    }
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  useFrame(() => {
    // Gentle parallax — reduced sensitivity for smoother feel
    const sensitivity = isMobile ? 0.1 : 0.3;
    const mx = mouseRef.current.x * sensitivity;
    const my = mouseRef.current.y * sensitivity;

    camera.position.x += (mx - camera.position.x) * 0.015;
    camera.position.y += (my - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function InstancedCards({ scrollVelocityRef, mouseRef, isMobile }) {
  const texturesArr = useTexture(TEXTURE_PATHS);

  const filteredCardData = CARD_DATA;

  // Parse card data into exact order for instances
  const groups = useMemo(() => {
    const map = TEXTURE_PATHS.map((path, i) => ({
      texture: texturesArr[i],
      cards: [],
    }));
    
    filteredCardData.forEach((card) => {
      const idx = TEXTURE_PATHS.indexOf(card.texture);
      if (idx !== -1) {
        map[idx].cards.push({
          ...card,
          currentRadius: card.radius + 15,
          currentSpeedMult: 15,
          angleRef: card.angleOffset,
          hover: 0,
          hoverTarget: 0,
        });
      }
    });
    return map;
  }, [texturesArr]);

  const refs = useRef([]);

  // Compute Geometry once – reduce segments on mobile
  const sharedGeometry = useMemo(() => {
    const w = 1.4;
    const h = 0.95;
    const r = 0.15;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    // Fewer segments on mobile for less geometry
    const segments = isMobile ? 16 : 32;
    const geo = new THREE.ShapeGeometry(shape, segments);
    const pos = geo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uvs[i * 2] = (pos.getX(i) + 0.7) / 1.4;
      uvs[i * 2 + 1] = (pos.getY(i) + 0.475) / 0.95;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  }, [isMobile]);

  useEffect(() => {
    return () => {
      if (sharedGeometry) sharedGeometry.dispose();
      texturesArr.forEach(t => t.dispose());
    };
  }, [sharedGeometry, texturesArr]);

  // Frame counter for mobile throttling (update every other frame)
  const frameCounter = useRef(0);

  useFrame((state, delta) => {
    // On mobile, update every 2nd frame for perf
    frameCounter.current++;
    if (isMobile && frameCounter.current % 2 !== 0) return;

    const currentScrollY = scrollVelocityRef.current.currentY || 0;
    const lastScrollY = scrollVelocityRef.current.lastY || 0;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    scrollVelocityRef.current.lastY = currentScrollY;
    scrollVelocityRef.current.val = lerp(scrollVelocityRef.current.val || 0, scrollDelta, 0.1);

    const sVel = scrollVelocityRef.current.val;

    groups.forEach((group, gIdx) => {
      const instMesh = refs.current[gIdx];
      if (!instMesh) return;

      group.cards.forEach((c, idx) => {
        c.currentRadius = lerp(c.currentRadius, c.radius, 0.03);
        c.currentSpeedMult = lerp(c.currentSpeedMult, 1, 0.02);

        const dynamicSpeed = (c.speed * c.currentSpeedMult) + sVel * 0.08;

        c.angleRef -= dynamicSpeed * delta;
        const angle = c.angleRef;

        const worldX = c.currentRadius * Math.cos(angle);
        const worldY = c.currentRadius * Math.sin(angle);
        const worldZ = c.zOffset;

        const parallaxStrength = isMobile ? 0.15 : 0.35 * (1 + c.zOffset * 0.02);
        const mx = mouseRef.current.x * parallaxStrength;
        const my = mouseRef.current.y * parallaxStrength;

        vec3.set(worldX + mx, worldY + my, worldZ);
        
        reusableEuler.set(0, 0, angle);
        quaternion.setFromEuler(reusableEuler);

        const baseScale = c.scale;
        const mobileScaleFactor = isMobile ? 0.75 : 1;
        const targetScale = baseScale * mobileScaleFactor;
        scaleVec.set(targetScale, targetScale, targetScale);

        tempMatrix.compose(vec3, quaternion, scaleVec);
        instMesh.setMatrixAt(idx, tempMatrix);
      });
      instMesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <>
      {groups.map((group, i) => (
        <instancedMesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          args={[sharedGeometry, null, group.cards.length]}
          raycast={() => null}
        >
          <meshBasicMaterial
            map={group.texture}
            side={THREE.DoubleSide}
            transparent={false}
          />
        </instancedMesh>
      ))}
    </>
  );
}

export default function Hero3D() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollVelocityRef = useRef({ val: 0, lastY: 0, currentY: 0 });
  
  // Track scroll passively to avoid layout thrashing in useFrame
  useEffect(() => {
    const handleScroll = () => {
      scrollVelocityRef.current.currentY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { ref: containerRef, inView } = useInView({
    triggerOnce: false,
    rootMargin: "0px",
  });

  // Device detection for canvas config (SSR-safe)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMouseMove = useCallback(throttle((e) => {
    if (!inView) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseRef.current = { x, y };
  }, 16), [inView]);

  // Handle touch for mobile parallax (lighter effect)
  const handleTouchMove = useCallback(throttle((e) => {
    if (!inView || !e.touches[0]) return;
    const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    const y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    mouseRef.current = { x: x * 0.3, y: y * 0.3 }; // Reduced intensity for touch
  }, 32), [inView]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute inset-0 pointer-events-auto"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <Canvas
          camera={{
            position: [0, 0, isMobile ? 24 : 18],
            fov: isMobile ? 55 : 50,
            near: 0.1,
            far: 100,
          }}
          /* Lower DPR on mobile: cap at 1 for perf, 1.5 on desktop */
          dpr={[1, isMobile ? 1 : Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1.5, 1.5)]}
          frameloop={inView ? "always" : "demand"}
            gl={{
              antialias: false,
              alpha: false,
              powerPreference: "high-performance",
              toneMapping: THREE.NoToneMapping,
            }}
            style={{ background: "#fbfcfb" }}
          >
            <color attach="background" args={["#fbfcfb"]} />
            <Suspense fallback={null}>
              <CameraRig mouseRef={mouseRef} isMobile={isMobile} />
              <InstancedCards scrollVelocityRef={scrollVelocityRef} mouseRef={mouseRef} isMobile={isMobile} />
            </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
