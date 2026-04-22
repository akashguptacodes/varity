"use client";

import { Suspense, useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useInView } from "react-intersection-observer";
import CalendlyButton from "./CalendlyButton";

// ---------- Card textures for the footer orbit ----------
const TEXTURE_PATHS = [
  "/images/orbit-12.jpg",
  "/images/orbit-14.jpg",
  "/images/orbit-10.jpg",
  "/images/orbit-11.jpg",
  "/images/orbit-13.jpg",
  "/images/orbit-2.jpg",
];

// Generate cards — multi-ring scattered layout matching Cosmos hero style
const FOOTER_CARD_DATA = Array.from({ length: 32 }).map((_, i) => {
  let radius, scale, angleOffset, speed, zOffset;

  if (i < 6) {
    radius = 4.5;
    scale = 1.0;
    angleOffset = (i / 6) * Math.PI * 2;
    speed = 0.18;
    zOffset = 0;
  } else if (i < 16) {
    radius = 8.0;
    scale = 1.25;
    angleOffset = ((i - 6) / 10) * Math.PI * 2;
    speed = 0.12;
    zOffset = -0.5;
  } else if (i < 26) {
    radius = 12.5;
    scale = 1.55;
    angleOffset = ((i - 16) / 10) * Math.PI * 2;
    speed = 0.08;
    zOffset = -1.0;
  } else {
    radius = 17.0;
    scale = 1.85;
    angleOffset = ((i - 26) / 6) * Math.PI * 2;
    speed = 0.05;
    zOffset = -1.5;
  }

  const texture = TEXTURE_PATHS[i % TEXTURE_PATHS.length];

  return { id: i + 1, texture, radius, angleOffset, speed, scale, zOffset };
});

// ---------- Helpers ----------
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ---------- Pre-allocated temp objects (OUTSIDE component — zero GC) ----------
const tempMatrix = new THREE.Matrix4();
const tempVec3 = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();
const tempScale = new THREE.Vector3();
const tempEuler = new THREE.Euler();

// ---------- Instanced Footer Cards (replaces 32 individual meshes) ----------
function FooterInstancedCards({ mouseRef }) {
  const texturesArr = useTexture(TEXTURE_PATHS);

  // Parse card data into groups by texture for instanced rendering
  const groups = useMemo(() => {
    const map = TEXTURE_PATHS.map((path, i) => ({
      texture: texturesArr[i],
      cards: [],
    }));

    FOOTER_CARD_DATA.forEach((card) => {
      const idx = TEXTURE_PATHS.indexOf(card.texture);
      if (idx !== -1) {
        // Cards closer to center are more translucent so CTA text is readable
        const baseOpacity = card.radius <= 5 ? 0.35 : card.radius <= 9 ? 0.55 : card.radius <= 13 ? 0.75 : 1.0;
        map[idx].cards.push({
          ...card,
          baseOpacity,
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

  // Shared geometry (created once, reused for all instances)
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

  // Scroll velocity tracking
  const scrollRef = useRef({ val: 0, lastY: typeof window !== "undefined" ? window.scrollY : 0 });

  // Cleanup
  useEffect(() => {
    return () => {
      if (sharedGeometry) sharedGeometry.dispose();
      texturesArr.forEach(t => t.dispose());
    };
  }, [sharedGeometry, texturesArr]);

  // Single useFrame for ALL 32 cards (was 32 separate useFrame loops)
  useFrame((state, delta) => {
    let currentScrollY = 0;
    if (typeof window !== "undefined") {
      currentScrollY = window.scrollY;
    }
    const scrollDelta = Math.abs(currentScrollY - scrollRef.current.lastY);
    scrollRef.current.lastY = currentScrollY;
    scrollRef.current.val = lerp(scrollRef.current.val || 0, scrollDelta, 0.1);

    const sVel = scrollRef.current.val;

    groups.forEach((group, gIdx) => {
      const instMesh = refs.current[gIdx];
      if (!instMesh) return;

      group.cards.forEach((c, idx) => {
        c.currentRadius = lerp(c.currentRadius, c.radius, 0.04);
        c.currentSpeedMult = lerp(c.currentSpeedMult, 1, 0.03);

        const dynamicSpeed = (c.speed * c.currentSpeedMult) + sVel * 0.05;

        c.angleRef -= dynamicSpeed * delta;
        const angle = c.angleRef;

        const worldX = c.currentRadius * Math.cos(angle);
        const worldY = c.currentRadius * Math.sin(angle);
        const worldZ = c.zOffset;

        const parallaxStrength = 0.5 * (1 + c.zOffset * 0.03);
        const mx = mouseRef.current.x * parallaxStrength;
        const my = mouseRef.current.y * parallaxStrength;

        c.hover = lerp(c.hover, c.hoverTarget, 0.1);

        const tx = worldX + mx;
        const ty = worldY + my;
        const tz = worldZ + c.hover * 4.0;

        tempVec3.set(tx, ty, tz);

        tempEuler.set(0, 0, angle);
        tempQuat.setFromEuler(tempEuler);

        const targetScale = c.scale * (1 + c.hover * 0.35);
        tempScale.set(targetScale, targetScale, targetScale);

        tempMatrix.compose(tempVec3, tempQuat, tempScale);
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
          ref={(el) => (refs.current[i] = el)}
          args={[sharedGeometry, null, group.cards.length]}
          onPointerOver={(e) => {
            if (e.instanceId !== undefined) {
              group.cards[e.instanceId].hoverTarget = 1;
              document.body.style.cursor = "pointer";
            }
          }}
          onPointerOut={(e) => {
            if (e.instanceId !== undefined) {
              group.cards[e.instanceId].hoverTarget = 0;
              document.body.style.cursor = "auto";
            }
          }}
        >
          <meshBasicMaterial
            map={group.texture}
            side={THREE.DoubleSide}
            transparent
            opacity={group.cards[0]?.baseOpacity ?? 1}
          />
        </instancedMesh>
      ))}
    </>
  );
}

// ---------- Subtle Camera Rig ----------
function CameraRig({ mouseRef }) {
  useFrame(({ camera }) => {
    const mx = mouseRef.current.x * 0.5;
    const my = mouseRef.current.y * 0.5;
    camera.position.x = lerp(camera.position.x, mx, 0.02);
    camera.position.y = lerp(camera.position.y, my, 0.02);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ---------- Main Footer Component (Cosmos-style layout) ----------
const FooterSection = () => {
  const currentYear = new Date().getFullYear();
  // useRef instead of useState — zero re-renders on mousemove
  const mouseRef = useRef({ x: 0, y: 0 });

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: false,
    rootMargin: "200px 0px",
  });

  const handleMouseMove = useCallback((e) => {
    if (!inView) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseRef.current = { x, y };
  }, [inView]);

  return (
    <footer className="relative w-full bg-[#fbfcfb] overflow-hidden">

      {/* ======== TOP: Full viewport 3D orbiting cards with CTA ======== */}
      <div
        ref={inViewRef}
        className="relative w-full h-screen min-h-[600px]"
        onMouseMove={handleMouseMove}
      >
        {/* 3D Canvas — fills the entire viewport area */}
        <div className="absolute inset-0 z-0">
          {inView && (
            <Canvas
              camera={{
                position: [0, 0, 18],
                fov: 50,
                near: 0.1,
                far: 100,
              }}
              dpr={[1, 1.5]}
              frameloop="always"
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
                <FooterInstancedCards mouseRef={mouseRef} />
                <CameraRig mouseRef={mouseRef} />
              </Suspense>
            </Canvas>
          )}
        </div>

        {/* Center CTA — text + Calendly button over 3D orbit */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-2 text-center">
          <h2 
            className="pointer-events-auto text-[32px] md:text-[46px] lg:text-[56px] font-bold tracking-tight text-[#042f22] mb-3"
            style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 4px 20px rgba(255,255,255,0.8)" }}
          >
            Let's Work Together 🎥
          </h2>
          <p 
            className="pointer-events-auto text-[#4b5563] text-[16px] md:text-[20px] font-medium max-w-xl mx-auto mb-8"
            style={{ fontFamily: "'Inter', sans-serif", textShadow: "0 2px 10px rgba(255,255,255,0.8)" }}
          >
            Book a free consultation call to discuss your video project
          </p>
          
          <div className="pointer-events-auto shadow-[0_15px_40px_rgba(32,201,151,0.25)] rounded-full hover:scale-105 transition-transform duration-300">
            <CalendlyButton url="https://calendly.com/akashgupta7484/30min" inline={true} />
          </div>
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
            VERITY
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
