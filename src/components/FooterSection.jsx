"use client";

import { Suspense, useRef, useState, useCallback, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// ---------- Card textures for the footer orbit ----------
const baseTextures = [
  "/timeline.png",
  "/color-grading.png",
  "/subtitles.png",
  "/transitions.png",
  "/ai-tools.png",
  "/social-export.png",
];

// Generate cards — multi-ring scattered layout matching Cosmos hero style
const FOOTER_CARD_DATA = Array.from({ length: 32 }).map((_, i) => {
  let radius, scale, angleOffset, speed, zOffset;

  if (i < 6) {
    // Ring 1 (Inner)
    radius = 4.5;
    scale = 1.0;
    angleOffset = (i / 6) * Math.PI * 2;
    speed = 0.18;
    zOffset = 0;
  } else if (i < 16) {
    // Ring 2
    radius = 8.0;
    scale = 1.25;
    angleOffset = ((i - 6) / 10) * Math.PI * 2;
    speed = 0.12;
    zOffset = -0.5;
  } else if (i < 26) {
    // Ring 3
    radius = 12.5;
    scale = 1.55;
    angleOffset = ((i - 16) / 10) * Math.PI * 2;
    speed = 0.08;
    zOffset = -1.0;
  } else {
    // Ring 4 (Outer)
    radius = 17.0;
    scale = 1.85;
    angleOffset = ((i - 26) / 6) * Math.PI * 2;
    speed = 0.05;
    zOffset = -1.5;
  }

  const tilt = Math.sin(angleOffset) * 0.12;
  const texture = baseTextures[i % baseTextures.length];

  return { id: i + 1, texture, radius, angleOffset, speed, scale, tilt, zOffset };
});

// ---------- Helpers ----------
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ---------- 3D Scene Background ----------
function SceneSetup() {
  useFrame(({ scene }) => {
    if (!scene.background || scene.background.getHexString() !== "fbfcfb") {
      scene.background = new THREE.Color("#fbfcfb");
      scene.fog = null;
    }
  });
  return null;
}

// ---------- Subtle Camera Rig ----------
function CameraRig({ mousePosition }) {
  useFrame(({ camera }) => {
    const mx = (mousePosition?.x || 0) * 0.5;
    const my = (mousePosition?.y || 0) * 0.5;
    camera.position.x = lerp(camera.position.x, mx, 0.02);
    camera.position.y = lerp(camera.position.y, my, 0.02);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ---------- Floating Card in R3F (identical to Hero cards) ----------
function FooterFloatingCard({
  texture: texturePath,
  radius,
  speed,
  angleOffset,
  zOffset = 0,
  scale: baseScale,
  mousePosition,
}) {
  const meshRef = useRef();
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(0);
  const angleRef = useRef(angleOffset);
  
  // Cards closer to center are more translucent so CTA text is readable
  const baseOpacity = radius <= 5 ? 0.35 : radius <= 9 ? 0.55 : radius <= 13 ? 0.75 : 1.0;
  const scrollVelocityRef = useRef(0);

  // Intro state — spiral inward from far away
  const currentRadius = useRef(radius + 15);
  const currentSpeedMult = useRef(15);

  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  const tex = useLoader(THREE.TextureLoader, texturePath);
  tex.colorSpace = THREE.SRGBColorSpace;

  const roundedRectShape = useMemo(() => {
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
    return shape;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.ShapeGeometry(roundedRectShape, 32);
    const pos = geo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uvs[i * 2] = (pos.getX(i) + 0.7) / 1.4;
      uvs[i * 2 + 1] = (pos.getY(i) + 0.475) / 0.95;
    }
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  }, [roundedRectShape]);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    currentRadius.current = lerp(currentRadius.current, radius, 0.04);
    currentSpeedMult.current = lerp(currentSpeedMult.current, 1, 0.03);

    // Scroll velocity acceleration
    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
    lastScrollY.current = currentScrollY;
    scrollVelocityRef.current = lerp(scrollVelocityRef.current, scrollDelta, 0.1);

    const dynamicSpeed = (speed * currentSpeedMult.current) + scrollVelocityRef.current * 0.05;
    angleRef.current -= dynamicSpeed * delta;
    const angle = angleRef.current;

    const worldX = currentRadius.current * Math.cos(angle);
    const worldY = currentRadius.current * Math.sin(angle);
    const worldZ = zOffset;

    const parallaxStrength = 0.5 * (1 + zOffset * 0.03);
    const mx = (mousePosition?.x || 0) * parallaxStrength;
    const my = (mousePosition?.y || 0) * parallaxStrength;

    hoverRef.current = lerp(hoverRef.current, hovered ? 1 : 0, 0.1);

    meshRef.current.position.x = lerp(meshRef.current.position.x, worldX + mx, 0.1);
    meshRef.current.position.y = lerp(meshRef.current.position.y, worldY + my, 0.1);
    meshRef.current.position.z = lerp(meshRef.current.position.z, worldZ + hoverRef.current * 4.0, 0.1);

    // Radial alignment: short edge faces center
    meshRef.current.rotation.x = 0;
    meshRef.current.rotation.y = 0;
    meshRef.current.rotation.z = angle;

    const targetScale = baseScale * (1 + hoverRef.current * 0.35);
    meshRef.current.scale.setScalar(lerp(meshRef.current.scale.x, targetScale, 0.1));

    // Inner rings translucent, outer rings opaque
    materialRef.current.opacity = baseOpacity;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerOver={() => {
        setHovered(true);
        if (typeof document !== "undefined") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        if (typeof document !== "undefined") document.body.style.cursor = "auto";
      }}
    >
      <meshStandardMaterial
        ref={materialRef}
        map={tex}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

// ---------- Scene Content ----------
function FooterSceneContent({ mousePosition }) {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={2.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -10]} intensity={1.0} color="#ffffff" />

      {FOOTER_CARD_DATA.map((card) => (
        <FooterFloatingCard
          key={card.id}
          texture={card.texture}
          radius={card.radius}
          speed={card.speed}
          angleOffset={card.angleOffset}
          zOffset={card.zOffset}
          tilt={card.tilt}
          scale={card.scale}
          mousePosition={mousePosition}
        />
      ))}

      <Environment preset="city" />
      <CameraRig mousePosition={mousePosition} />
    </>
  );
}

// ---------- Main Footer Component (Cosmos-style layout) ----------
const FooterSection = () => {
  const currentYear = new Date().getFullYear();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePosition({ x, y });
  }, []);

  return (
    <footer className="relative w-full bg-[#fbfcfb] overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
      `}} />

      {/* ======== TOP: Full viewport 3D orbiting cards with CTA ======== */}
      <div
        className="relative w-full h-screen min-h-[600px]"
        onMouseMove={handleMouseMove}
      >
        {/* 3D Canvas — fills the entire viewport area */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{
              position: [0, 0, 18],
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
              <FooterSceneContent mousePosition={mousePosition} />
            </Suspense>
          </Canvas>
        </div>

        {/* Center CTA — large black pill + outline button, exactly like Cosmos */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-2">
          {/* Large black pill CTA */}
          <div 
            className="pointer-events-auto bg-[#042f22] text-white rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)] hover:scale-[1.03] transition-all duration-300 cursor-pointer"
            style={{ padding: '28px 72px' }}
          >
            <h2 
              className="text-[22px] md:text-[32px] lg:text-[38px] font-bold tracking-tight text-center whitespace-nowrap"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Start editing with Varity
            </h2>
          </div>

          {/* Outline button below */}
          <button 
            className="pointer-events-auto bg-white border-2 border-[#042f22]/15 rounded-full text-[14px] md:text-[16px] text-[#042f22] font-semibold hover:border-[#042f22]/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
            style={{ marginTop: '24px', padding: '16px 40px' }}
          >
            Try it free
          </button>
        </div>
      </div>

      {/* ======== BOTTOM: Footer bar with links + massive brand text ======== */}
      <div className="relative z-20 w-full bg-[#fbfcfb]">
        {/* Footer links bar - single row with proper padding like Cosmos */}
        <div 
          className="w-full flex flex-col md:flex-row items-center justify-between py-8 border-t border-[#042f22]/10"
          style={{ paddingLeft: '7vw', paddingRight: '7vw' }}
        >
          {/* Left: Social links */}
          <div className="flex items-center gap-7 md:gap-10">
            {["Instagram", "YouTube", "X", "LinkedIn"].map((name) => (
              <a 
                key={name} 
                href="#" 
                className="text-[13px] md:text-[14px] text-[#042f22]/70 font-medium hover:text-[#042f22] transition-colors duration-300"
              >
                {name}
              </a>
            ))}
          </div>

          {/* Center: Logo */}
          <div className="my-5 md:my-0">
            <div className="w-[44px] h-[44px] bg-[#042f22] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-md">
              <span 
                className="text-white text-[22px] italic font-bold pr-0.5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                V
              </span>
            </div>
          </div>

          {/* Right: Legal links */}
          <div className="flex items-center gap-7 md:gap-10">
            {["Careers", "Terms", "Privacy"].map((name) => (
              <a 
                key={name} 
                href="#" 
                className="text-[13px] md:text-[14px] text-[#042f22]/70 font-medium hover:text-[#042f22] transition-colors duration-300"
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        {/* Brand text spanning full width — like Cosmos */}
        <div className="w-full overflow-hidden pb-10 md:pb-14" style={{ paddingLeft: '4vw', paddingRight: '4vw' }}>
          <h1 
            className="text-[#042f22] text-[16vw] md:text-[14vw] font-black leading-[0.85] tracking-tighter text-center select-none uppercase"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            VARITY
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
