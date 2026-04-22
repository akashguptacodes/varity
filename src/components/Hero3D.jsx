"use client";

import { Suspense, useRef, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

// Scene background directly handled by <color> attachment

function CameraRig({ mouseRef }) {
  useFrame((state) => {
    const { camera } = state;
    const mx = mouseRef.current.x * 0.5;
    const my = mouseRef.current.y * 0.5;

    camera.position.x += (mx - camera.position.x) * 0.02;
    camera.position.y += (my - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function InstancedCards({ scrollVelocityRef, mouseRef }) {
  const texturesArr = useTexture(TEXTURE_PATHS);

  // Parse card data into exact order for instances
  const groups = useMemo(() => {
    const map = TEXTURE_PATHS.map((path, i) => ({
      texture: texturesArr[i],
      cards: [],
    }));
    
    CARD_DATA.forEach((card) => {
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

  // Compute Geometry once
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

  useEffect(() => {
    return () => {
      if (sharedGeometry) sharedGeometry.dispose();
      texturesArr.forEach(t => t.dispose());
    };
  }, [sharedGeometry, texturesArr]);

  useFrame((state, delta) => {
    let currentScrollY = 0;
    if (typeof window !== "undefined") {
      currentScrollY = window.scrollY;
    }
    const lastScrollY = scrollVelocityRef.current.lastY || 0;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    scrollVelocityRef.current.lastY = currentScrollY;
    scrollVelocityRef.current.val = lerp(scrollVelocityRef.current.val || 0, scrollDelta, 0.1);

    const sVel = scrollVelocityRef.current.val;

    groups.forEach((group, gIdx) => {
      const instMesh = refs.current[gIdx];
      if (!instMesh) return;

      group.cards.forEach((c, idx) => {
        c.currentRadius = lerp(c.currentRadius, c.radius, 0.04);
        c.currentSpeedMult = lerp(c.currentSpeedMult, 1, 0.03);

        const dynamicSpeed = (c.speed * c.currentSpeedMult) + sVel * 0.1;

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

        vec3.set(tx, ty, tz);
        
        reusableEuler.set(0, 0, angle);
        quaternion.setFromEuler(reusableEuler);

        const baseScale = c.scale;
        const targetScale = baseScale * (1 + c.hover * 0.35);
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
            transparent={false}
          />
        </instancedMesh>
      ))}
    </>
  );
}

export default function Hero3D() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollVelocityRef = useRef({ val: 0, lastY: 0 });
  
  const { ref: containerRef, inView } = useInView({
    triggerOnce: false,
    rootMargin: "0px",
  });

  const handleMouseMove = useCallback(throttle((e) => {
    if (!inView) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseRef.current = { x, y };
  }, 16), [inView]);

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
              position: [0, 0, 18],
              fov: 50,
              near: 0.1,
              far: 100,
            }}
            dpr={[1, typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1]}
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
              <CameraRig mouseRef={mouseRef} />
              <InstancedCards scrollVelocityRef={scrollVelocityRef} mouseRef={mouseRef} />
            </Suspense>
          </Canvas>
        )}
      </div>
    </div>
  );
}
