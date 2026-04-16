"use client";

import { Suspense, useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useInView } from "react-intersection-observer";
import FloatingVideoCard from "./FloatingVideoCard";
import { CARD_DATA, lerp } from "@/lib/utils";

// The 6 base textures used by the cards
const TEXTURE_PATHS = [
  "/timeline.png",
  "/color-grading.png",
  "/subtitles.png",
  "/transitions.png",
  "/ai-tools.png",
  "/social-export.png",
];

// Set scene background to light color (matching Cosmos)
function SceneSetup() {
  useFrame(({ scene }) => {
    if (!scene.background || scene.background.getHexString() !== "fbfcfb") {
      scene.background = new THREE.Color("#fbfcfb");
      scene.fog = null; // Completely remove any fog
    }
  });
  return null;
}

// Subtle camera parallax to give the entire scene some depth when moving the mouse
function CameraRig({ mousePosition }) {
  useFrame((state) => {
    const { camera } = state;
    const mx = (mousePosition?.x || 0) * 0.5;
    const my = (mousePosition?.y || 0) * 0.5;

    camera.position.x += (mx - camera.position.x) * 0.02;
    camera.position.y += (my - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Global Scroll Tracker Component
// Computes velocity once per frame and writes to a shared mutable ref
function ScrollTracker({ scrollVelocityRef }) {
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  useFrame(() => {
    if (typeof window === "undefined") return;
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
    lastScrollY.current = currentScrollY;
    
    // Smooth the scroll velocity heavily
    scrollVelocityRef.current = lerp(scrollVelocityRef.current, scrollDelta, 0.1);
  });

  return null;
}

// Scene content
function SceneContent({ mousePosition }) {
  const scrollVelocityRef = useRef(0);

  // Preload textures once
  const texturesArr = useTexture(TEXTURE_PATHS);
  const textureMap = useMemo(() => {
    const map = {};
    TEXTURE_PATHS.forEach((path, i) => {
      texturesArr[i].colorSpace = THREE.SRGBColorSpace;
      map[path] = texturesArr[i];
    });
    return map;
  }, [texturesArr]);

  // Compute Geometry once for all 44 cards
  const sharedGeometry = useMemo(() => {
    const w = 1.4;
    const h = 0.95;
    const r = 0.15; // smoother corners
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

    const geo = new THREE.ShapeGeometry(shape, 32);
    const pos = geo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uvs[i * 2] = (pos.getX(i) + 0.7) / 1.4;
      uvs[i * 2 + 1] = (pos.getY(i) + 0.475) / 0.95;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <>
      <SceneSetup />
      <ScrollTracker scrollVelocityRef={scrollVelocityRef} />

      {/* Very clean, bright lighting setup without shadows */}
      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#ffffff" />

      {/* Render all scattered floating cards */}
      {CARD_DATA.map((card, i) => (
        <FloatingVideoCard
          key={card.id}
          texture={textureMap[card.texture]}
          geometry={sharedGeometry}
          scrollVelocityRef={scrollVelocityRef}
          radius={card.radius}
          speed={card.speed}
          angleOffset={card.angleOffset}
          zOffset={card.zOffset}
          tilt={card.tilt}
          scale={card.scale}
          index={i}
          mousePosition={mousePosition}
        />
      ))}

      <Environment preset="city" />
      <CameraRig mousePosition={mousePosition} />
    </>
  );
}

export default function Hero3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { ref: containerRef, inView } = useInView({
    triggerOnce: false, // track consistently
    rootMargin: "0px",
  });

  const handleMouseMove = useCallback((e) => {
    // Only track mouse if in view
    if (!inView) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePosition({ x, y });
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div className="absolute inset-0 pointer-events-auto" onMouseMove={handleMouseMove}>
        {inView && (
          <Canvas
            camera={{
              position: [0, 0, 18], // Pulled further back to survey the vast 3D field
              fov: 50,
              near: 0.1,
              far: 100,
            }}
            dpr={[1, 1.5]}
            frameloop="always"
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: "high-performance",
              toneMapping: THREE.NoToneMapping,
            }}
            style={{ background: "#fbfcfb" }}
          >
            <Suspense fallback={null}>
              <SceneContent mousePosition={mousePosition} />
            </Suspense>
          </Canvas>
        )}
      </div>
    </div>
  );
}
