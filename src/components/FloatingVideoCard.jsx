"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { lerp, clamp } from "@/lib/utils";

export default function FloatingVideoCard({
  texture: texturePath,
  radius,
  speed,
  angleOffset,
  zOffset = 0,
  tilt = 0,
  scale: baseScale,
  mousePosition,
}) {
  const meshRef = useRef();
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(0);
  
  const angleRef = useRef(angleOffset);
  const scrollVelocityRef = useRef(0);

  // Intro Animation State
  // Start the card outside of its normal orbit (radius + 20) and spin 15x faster initially
  const currentRadius = useRef(radius + 15);
  const currentSpeedMult = useRef(15);

  // Track global scroll for acceleration effect
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  // Load texture
  const texture = useLoader(THREE.TextureLoader, texturePath);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Rounded rectangle shape matching Cosmos icons
  const roundedRectShape = useMemo(() => {
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

  // Calculate depth-based opacity
  // Cards deep in bg (-25) have low opacity, foreground (0) are fully opaque
  const depthOpacity = useMemo(() => {
    return clamp((zOffset + 25) / 25, 0.05, 1.0); 
  }, [zOffset]);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    // --- Intro Animations ---
    // Smoothly interpolate radius inward to its target `radius`
    currentRadius.current = lerp(currentRadius.current, radius, 0.04);
    // Smoothly drag the speed multiplier down from 15x to 1x over ~1.5 seconds
    currentSpeedMult.current = lerp(currentSpeedMult.current, 1, 0.03);

    // Calculate scroll velocity
    const currentScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
    lastScrollY.current = currentScrollY;

    // Smooth the scroll velocity heavily so the cards spin smoothly after a scroll
    // Significantly increased scrolling sensitivity requested by user
    scrollVelocityRef.current = lerp(scrollVelocityRef.current, scrollDelta, 0.1);

    // Dynamic speed: base speed * Intro multiplier + heavy multiplier for scroll velocity
    const dynamicSpeed = (speed * currentSpeedMult.current) + scrollVelocityRef.current * 0.1;

    // CLOCKWISE circle: subtracting from angle
    angleRef.current -= dynamicSpeed * delta;

    const angle = angleRef.current;

    // Position on a circular path in X-Y plane using dynamic intro radius
    const worldX = currentRadius.current * Math.cos(angle);
    const worldY = currentRadius.current * Math.sin(angle);
    const worldZ = zOffset;

    // Enhanced Mouse Parallax taking depth (zOffset) into account
    // Farther objects move slower
    const parallaxStrength = 0.5 * (1 + zOffset * 0.03);
    const mx = (mousePosition?.x || 0) * parallaxStrength;
    const my = (mousePosition?.y || 0) * parallaxStrength;

    // Smooth hover interpolation
    hoverRef.current = lerp(hoverRef.current, hovered ? 1 : 0, 0.1);

    // Apply Position and push heavily forward on Z axis on hover
    meshRef.current.position.x = lerp(meshRef.current.position.x, worldX + mx, 0.1);
    meshRef.current.position.y = lerp(meshRef.current.position.y, worldY + my, 0.1);
    meshRef.current.position.z = lerp(meshRef.current.position.z, worldZ + hoverRef.current * 4.0, 0.1);

    // Radial alignment: short edge of the card always faces toward/away from centre.
    // rotation.z = angle locks the card's orientation to its orbit (synchronous rotation)
    // so it never appears to spin on its own axis.
    meshRef.current.rotation.x = 0;
    meshRef.current.rotation.y = 0;
    meshRef.current.rotation.z = angle;

    // Scale up noticeably on hover to make it "come forward"
    const targetScale = baseScale * (1 + hoverRef.current * 0.35);
    meshRef.current.scale.setScalar(lerp(meshRef.current.scale.x, targetScale, 0.1));

    // Opacity is solid 1.0 (no translucency, as requested)
    materialRef.current.opacity = 1.0;
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
        map={texture}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}
