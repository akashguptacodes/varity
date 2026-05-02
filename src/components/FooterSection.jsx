"use client";

import { Suspense, useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

// ---------- Card textures for the footer orbit ----------
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

// Generate cards — multi-ring scattered layout matching Cosmos hero style
// Accept a mobile flag to reduce card count
const getFooterCardData = (isMobile) => {
  const total = isMobile ? 20 : 36;
  return Array.from({ length: total }).map((_, i) => {
    let radius, scale, angleOffset, speed, zOffset;

    if (i < 4) {
      radius = 2.5;
      scale = 0.85;
      angleOffset = (i / 4) * Math.PI * 2;
      speed = 0.24;
      zOffset = 0.2;
    } else if (i < 10) {
      radius = 4.5;
      scale = 1.0;
      angleOffset = ((i - 4) / 6) * Math.PI * 2;
      speed = 0.18;
      zOffset = 0;
    } else if (i < 20) {
      radius = 8.0;
      scale = 1.25;
      angleOffset = ((i - 10) / 10) * Math.PI * 2;
      speed = 0.12;
      zOffset = -0.5;
    } else if (i < 30) {
      radius = 12.5;
      scale = 1.55;
      angleOffset = ((i - 20) / 10) * Math.PI * 2;
      speed = 0.08;
      zOffset = -1.0;
    } else {
      radius = 17.0;
      scale = 1.85;
      angleOffset = ((i - 30) / 6) * Math.PI * 2;
      speed = 0.05;
      zOffset = -1.5;
    }

    const texture = TEXTURE_PATHS[i % TEXTURE_PATHS.length];

    return { id: i + 1, texture, radius, angleOffset, speed, scale, zOffset };
  });
};

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
function FooterOrbitingCards({ mouseRef, isMobile }) {
  const texturesArr = useTexture(TEXTURE_PATHS);
  const cardData = useMemo(() => getFooterCardData(isMobile), [isMobile]);

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

  // Map each card to a randomly selected texture for variety
  const cards = useMemo(() => {
    // Shuffled array of texture indices
    const shuffledIndices = [];
    for (let i = 0; i < cardData.length; i++) {
      shuffledIndices.push(Math.floor(Math.random() * texturesArr.length));
    }

    return cardData.map((card, i) => {
      const baseOpacity = card.radius <= 5 ? 0.65 : card.radius <= 9 ? 0.8 : card.radius <= 13 ? 0.9 : 1.0;
      return {
        ...card,
        resolvedTexture: texturesArr[shuffledIndices[i]],
        baseOpacity,
        currentRadius: card.radius + 15,
        currentSpeedMult: 15,
        angleRef: card.angleOffset,
      };
    });
  }, [texturesArr, cardData]);

  const refs = useRef([]);
  const scrollRef = useRef({ val: 0, lastY: typeof window !== "undefined" ? window.scrollY : 0, currentY: 0 });

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current.currentY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state, delta) => {
    const currentScrollY = scrollRef.current.currentY || 0;
    const scrollDelta = Math.abs(currentScrollY - scrollRef.current.lastY);
    scrollRef.current.lastY = currentScrollY;
    scrollRef.current.val = lerp(scrollRef.current.val || 0, scrollDelta, 0.1);

    const sVel = scrollRef.current.val;

    cards.forEach((c, idx) => {
      const mesh = refs.current[idx];
      if (!mesh) return;

      c.currentRadius = lerp(c.currentRadius, c.radius, 0.03);
      c.currentSpeedMult = lerp(c.currentSpeedMult, 1, 0.02);

      const dynamicSpeed = (c.speed * c.currentSpeedMult) + sVel * 0.04;

      c.angleRef -= dynamicSpeed * delta;
      const angle = c.angleRef;

      const worldX = c.currentRadius * Math.cos(angle);
      const worldY = c.currentRadius * Math.sin(angle);
      const worldZ = c.zOffset;

      const parallaxStrength = 0.3 * (1 + c.zOffset * 0.02);
      const mx = mouseRef.current.x * parallaxStrength;
      const my = mouseRef.current.y * parallaxStrength;

      mesh.position.set(worldX + mx, worldY + my, worldZ);
      mesh.rotation.z = angle;

      const targetScale = c.scale;
      mesh.scale.set(targetScale, targetScale, targetScale);
    });
  });

  return (
    <group>
      {cards.map((card, idx) => (
        <mesh
          key={idx}
          ref={(el) => { refs.current[idx] = el; }}
          geometry={sharedGeometry}
        >
          <meshBasicMaterial
            map={card.resolvedTexture}
            side={THREE.DoubleSide}
            transparent
            opacity={card.baseOpacity}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---------- Subtle Camera Rig ----------
function CameraRig({ mouseRef, isMobile }) {
  const { camera, size } = useThree();

  // Responsive camera position
  useEffect(() => {
    if (size.width < 768) {
      camera.position.z = 24;
      camera.fov = 55;
    } else {
      camera.position.z = 18;
      camera.fov = 50;
    }
    camera.updateProjectionMatrix();
  }, [camera, size.width]);

  useFrame(() => {
    const sensitivity = isMobile ? 0.2 : 0.5;
    const mx = mouseRef.current.x * sensitivity;
    const my = mouseRef.current.y * sensitivity;
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

  // Device detection (SSR-safe)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!inView) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseRef.current = { x, y };
  }, [inView]);

  return (
    <footer className="relative w-full bg-[#fbfcfb] overflow-hidden mt-16 sm:mt-24 md:mt-32 shadow-[0_-20px_60px_rgba(13,124,102,0.08)] rounded-t-[40px] sm:rounded-t-[60px] z-30">

      {/* ======== TOP: Full viewport 3D orbiting cards with CTA ======== */}
      <div
        ref={inViewRef}
        className="relative w-full h-[70vh] sm:h-screen min-h-[500px] sm:min-h-[600px]"
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
            dpr={[1, isMobile ? 1 : 1.5]}
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
              <FooterOrbitingCards mouseRef={mouseRef} isMobile={isMobile} />
              <CameraRig mouseRef={mouseRef} isMobile={isMobile} />
            </Suspense>
          </Canvas>
        </div>

        {/* Heavy Radial Blur & White Fade from center — mirrors hero section */}
        <div 
          className="absolute inset-0 pointer-events-none z-[1]" 
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'radial-gradient(circle at center, rgba(251,252,251,0.8) 0%, rgba(251,252,251,0.7) 25%, rgba(251,252,251,0.4) 50%, transparent 85%)',
            maskImage: 'radial-gradient(circle at center, black 0%, black 25%, rgba(0,0,0,0.7) 50%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 25%, rgba(0,0,0,0.7) 50%, transparent 85%)',
          }}
        />

        {/* Center CTA — hero-style content over radial blur */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4 sm:px-6 md:px-8 text-center">
          <div className="flex flex-col items-center pointer-events-auto max-w-2xl w-full">

            {/* Button-like pill with the headline */}
            <div
              className="group relative inline-flex items-center justify-center rounded-full overflow-hidden mb-6 sm:mb-8 md:mb-10 active:scale-95 transition-all cursor-default"
              style={{
                padding: 'clamp(16px, 2vw, 22px) clamp(32px, 5vw, 64px)',
                background: 'linear-gradient(135deg, #0d7c66, #20C997)',
                boxShadow: '0 8px 32px rgba(13,124,102,0.3), 0 0 0 3px rgba(32,201,151,0.15)',
              }}
            >
              {/* Glass sheen */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
              <span
                className="relative z-10 text-white font-bold tracking-tight"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(20px, 4vw, 48px)',
                  lineHeight: 1.1,
                }}
              >
                Let&apos;s Work Together 🎥
              </span>
            </div>

            {/* Subtitle */}
            <p
              className="text-[#4b5563] font-medium leading-relaxed"
              style={{
                fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: 'clamp(14px, 1.6vw, 20px)',
              }}
            >
              Book a free consultation call to discuss your video project
            </p>
          </div>
        </div>
      </div>

      {/* ======== BOTTOM: Seamless footer bar + brand text ======== */}
      <div className="relative z-20 w-full bg-[#fbfcfb]">
        {/* Footer links bar — merged seamlessly, no border separator */}
        <div
          className="w-full flex flex-col md:flex-row items-center justify-between py-8 pt-16 sm:pt-20 md:pt-24"
          style={{ paddingLeft: 'clamp(16px, 7vw, 7vw)', paddingRight: 'clamp(16px, 7vw, 7vw)' }}
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
            <div className="w-[48px] h-[48px] rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform shadow-md relative border border-white/60">
              <Image
                src="/images/logo.jpeg"
                alt="Verity Logo"
                fill
                className="object-cover"
                sizes="48px"
              />
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
        <div className="w-full overflow-hidden pb-6 sm:pb-10 md:pb-14" style={{ paddingLeft: '4vw', paddingRight: '4vw' }}>
          <h1
            className="text-[#042f22] text-[16vw] md:text-[14vw] font-black leading-[0.85] tracking-tighter text-center select-none uppercase"
            style={{ fontFamily: 'var(--font-logo)' }}
          >
            VERITY
          </h1>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
