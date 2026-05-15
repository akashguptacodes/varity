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
  "/images/orbit-gd-1.jpg",
  "/images/orbit-gd-2.jpg",
  "/images/orbit-gd-4.jpg",
  "/images/orbit-gd-5.jpg",
  "/images/orbit-gd-6.jpg",
  "/images/orbit-gd-7.jpg",
  "/images/orbit-gd-8.jpg",
  "/images/orbit-gd-9.jpg",
  "/images/orbit-gd-10.jpg",
  "/images/orbit-gd-11.jpg",
  "/images/orbit-gd-12.jpg",
  "/images/orbit-gd-13.jpg",
  "/images/orbit-gd-14.jpg",
  "/images/orbit-gd-15.jpg",
  "/images/orbit-gd-16.jpg",
  "/images/orbit-gd-17.jpg",
  "/images/orbit-gd-18.jpg",
  "/images/orbit-gd-19.jpg",
  "/images/orbit-gd-20.jpg",
  "/images/orbit-gd-21.jpg",
  "/images/orbit-gd-22.jpg",
  "/images/orbit-gd-23.jpg",
  "/images/orbit-gd-24.jpg",
  "/images/orbit-gd-25.jpg",
  "/images/orbit-gd-26.jpg",
  "/images/orbit-gd-27.jpg",
  "/images/orbit-gd-28.jpg",
  "/images/orbit-gd-29.jpg",
  "/images/orbit-gd-30.jpg",
  "/images/orbit-gd-31.jpg",
  "/images/orbit-gd-32.jpg",
  "/images/orbit-gd-33.jpg",
  "/images/orbit-gd-34.jpg"
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

  useFrame((state, delta) => {
    // Smoothen mouse coordinates once per frame for all components to consume
    // We use a frame-rate independent lerp for the mouse itself
    const mouseLerpFactor = 1 - Math.exp(-12 * delta);
    mouseRef.current.x = lerp(mouseRef.current.x, mouseRef.current.targetX, mouseLerpFactor);
    mouseRef.current.y = lerp(mouseRef.current.y, mouseRef.current.targetY, mouseLerpFactor);

    // Gentle parallax — reduced sensitivity for smoother feel
    const sensitivity = isMobile ? 0.1 : 0.3;
    const mx = mouseRef.current.x * sensitivity;
    const my = mouseRef.current.y * sensitivity;

    // Camera has its own slower interpolation for extra-organic feel
    camera.position.x += (mx - camera.position.x) * 0.015;
    camera.position.y += (my - camera.position.y) * 0.015;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Mobile-only card data — 3 tight orbits with larger cards.
 * Ring 1 (inner):  5 cards, radius 3.2, scale 1.05
 * Ring 2 (middle): 8 cards, radius 6.0, scale 1.25
 * Ring 3 (outer): 11 cards, radius 9.5, scale 1.50
 * Total: 24 cards (vs 44 desktop) — good density, bigger cards for small screens.
 */
function getMobileCardData() {
  const total = 24;
  return Array.from({ length: total }).map((_, i) => {
    let radius, scale, angleOffset, speed, zOffset;

    if (i < 5) {
      // Ring 1 — tight inner ring (5 cards)
      radius = 3.2;
      scale = 1.05;
      angleOffset = (i / 5) * Math.PI * 2;
      speed = 0.22;
      zOffset = 0;
    } else if (i < 13) {
      // Ring 2 — middle ring (8 cards)
      radius = 6.0;
      scale = 1.25;
      angleOffset = ((i - 5) / 8) * Math.PI * 2;
      speed = 0.15;
      zOffset = -0.3;
    } else {
      // Ring 3 — outer ring (11 cards)
      radius = 9.5;
      scale = 1.50;
      angleOffset = ((i - 13) / 11) * Math.PI * 2;
      speed = 0.10;
      zOffset = -0.6;
    }

    const tilt = Math.sin(angleOffset) * 0.15;
    const texture = TEXTURE_PATHS[i % TEXTURE_PATHS.length];

    return { id: i + 1, texture, radius, angleOffset, speed, scale, tilt, zOffset };
  });
}

function OrbitingCards({ scrollVelocityRef, mouseRef, isMobile }) {
  const texturesArr = useTexture(TEXTURE_PATHS);

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
    };
  }, [sharedGeometry]);

  // On mobile: use dedicated 3-ring layout. Desktop: full CARD_DATA untouched.
  const sourceCards = useMemo(() => isMobile ? getMobileCardData() : CARD_DATA, [isMobile]);

  // Map each card to a random texture to make it look classy and varied
  const cards = useMemo(() => {
    const shuffledIndices = [];
    for (let i = 0; i < sourceCards.length; i++) {
      shuffledIndices.push(Math.floor(Math.random() * texturesArr.length));
    }

    return sourceCards.map((card, i) => {
      return {
        ...card,
        resolvedTexture: texturesArr[shuffledIndices[i]],
        currentRadius: card.radius + 15,
        currentSpeedMult: 15,
        angleRef: card.angleOffset,
      };
    });
  }, [texturesArr, sourceCards]);

  const refs = useRef([]);
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

    // Use the smoothed mouse coordinates updated in CameraRig
    const smoothedMouseX = mouseRef.current.x;
    const smoothedMouseY = mouseRef.current.y;

    cards.forEach((c, idx) => {
      const mesh = refs.current[idx];
      if (!mesh) return;

      c.currentRadius = lerp(c.currentRadius, c.radius, 0.03);
      c.currentSpeedMult = lerp(c.currentSpeedMult, 1, 0.02);

      const dynamicSpeed = (c.speed * c.currentSpeedMult) + sVel * 0.08;

      c.angleRef -= dynamicSpeed * delta;
      const angle = c.angleRef;

      const worldX = c.currentRadius * Math.cos(angle);
      const worldY = c.currentRadius * Math.sin(angle);
      const worldZ = c.zOffset;

      const parallaxStrength = isMobile ? 0.15 : 0.35 * (1 + c.zOffset * 0.02);
      const mx = smoothedMouseX * parallaxStrength;
      const my = smoothedMouseY * parallaxStrength;

      mesh.position.set(worldX + mx, worldY + my, worldZ);
      mesh.rotation.z = angle;

      // Mobile cards use their own scale values directly (already tuned in getMobileCardData)
      // Desktop uses original CARD_DATA scales untouched
      const targetScale = isMobile ? c.scale * 0.95 : c.scale;
      mesh.scale.set(targetScale, targetScale, targetScale);
    });
  });

  return (
    <group>
      {cards.map((card, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          geometry={sharedGeometry}
        >
          <meshBasicMaterial
            map={card.resolvedTexture}
            side={THREE.DoubleSide}
            transparent={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Hero3D() {
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
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

  const handleMouseMove = useCallback((e) => {
    if (!inView) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
  }, [inView]);

  // Handle touch for mobile parallax (lighter effect)
  const handleTouchMove = useCallback((e) => {
    if (!inView || !e.touches[0]) return;
    const x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    const y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    // Reduced intensity for touch directly at source
    mouseRef.current.targetX = x * 0.3;
    mouseRef.current.targetY = y * 0.3;
  }, [inView]);

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
              <OrbitingCards scrollVelocityRef={scrollVelocityRef} mouseRef={mouseRef} isMobile={isMobile} />
            </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
