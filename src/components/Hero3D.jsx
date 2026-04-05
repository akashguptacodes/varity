"use client";

import { Suspense, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import FloatingVideoCard from "./FloatingVideoCard";
import { CARD_DATA } from "@/lib/utils";

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

// Scene content
function SceneContent({ mousePosition }) {
  return (
    <>
      <SceneSetup />

      {/* Very clean, bright lighting setup without shadows */}
      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#ffffff" />

      {/* Render all scattered floating cards */}
      {CARD_DATA.map((card, i) => (
        <FloatingVideoCard
          key={card.id}
          texture={card.texture}
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
  const containerRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePosition({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <div className="absolute inset-0 pointer-events-auto" onMouseMove={handleMouseMove}>
        <Canvas
          camera={{
            position: [0, 0, 18], // Pulled further back to survey the vast 3D field
            fov: 50,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 1.5]}
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
      </div>
    </div>
  );
}
