"use client";

import { motion, useMotionValue, useAnimationFrame, useTransform, animate, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Neo from "./Neo/Neo";
import { useRouter } from "next/navigation";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

const CATEGORIES = [
  { id: 1, title: 'AI Videos', image: '/images/AIVideoEditing.jpeg' },
  { id: 2, title: 'Explainer', image: '/images/RawVideoEditing.jpeg' },
  { id: 3, title: 'Posters', image: '/images/GraphicDesign.jpeg' },
  { id: 4, title: 'AI Videos', image: '/images/AIVideoEditing.jpeg' },
  { id: 5, title: 'Explainer', image: '/images/RawVideoEditing.jpeg' },
  { id: 6, title: 'Posters', image: '/images/GraphicDesign.jpeg' },
];

// Scroll-threshold triggers (within 500vh sticky section)
// Phase 1 @ 0.02 — heading auto-appears
// Phase 2 @ 0.18 — heading fades, blob auto-rises
// Phase 3 @ 0.38 — cards auto-appear at bottom
// Phase 4 @ 0.55 — cards auto-orbit
// Phase 5 @ 0.72 — auto-revolution
// Reset  @ <0.01 — everything resets

export default function CategorySection() {
  const containerRef = useRef(null);
  const router = useRouter();
  const isMobile = useIsMobile();
  const { ref: visibilityRef, inView: isVisible } = useInView({ threshold: 0 });
  const smoothEase = [0.22, 1, 0.36, 1];

  // Scroll progress through the tall section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Phase tracking (refs to avoid re-renders)
  const phaseRef = useRef(0);
  const animsRef = useRef([]);
  const [cardsReady, setCardsReady] = useState(false);

  // Helper: track animation for cleanup
  const track = (anim) => { animsRef.current.push(anim); return anim; };
  const stopAll = () => { animsRef.current.forEach(a => a.stop()); animsRef.current = []; };

  // Motion values
  const word1Opacity = useMotionValue(0), word1Y = useMotionValue(60);
  const word2Opacity = useMotionValue(0), word2Y = useMotionValue(60);
  const word3Opacity = useMotionValue(0), word3Y = useMotionValue(60);

  const blobScale = useMotionValue(1);
  const blobY = useMotionValue(isMobile ? 300 : 500);
  const blobOpacity = useMotionValue(0);
  const glowScale = useMotionValue(0.3), glowOpacity = useMotionValue(0);

  const entranceOpacity = useMotionValue(0);
  const entranceY = useMotionValue(isMobile ? 500 : 800);
  const entranceSpin = useMotionValue(0);
  const entranceRadiusScale = useMotionValue(0.3);
  const revolutionAngle = useTransform(scrollYProgress, [0.55, 1], [0, 360]);

  const autoAngle = useMotionValue(0);
  const dragAngle = useMotionValue(0);
  const dragTiltX = useMotionValue(0), dragTiltZ = useMotionValue(0);

  // Auto-rotation
  useAnimationFrame((_, delta) => {
    if (!isVisible) return;
    autoAngle.set(autoAngle.get() + 0.004 * delta);
  });

  // Phase animation functions
  const playPhase1 = () => {
    track(animate(word1Opacity, 1, { duration: 0.5, ease: "easeOut" }));
    track(animate(word1Y, 0, { duration: 0.5, ease: smoothEase }));
    setTimeout(() => {
      track(animate(word2Opacity, 1, { duration: 0.5, ease: "easeOut" }));
      track(animate(word2Y, 0, { duration: 0.5, ease: smoothEase }));
    }, 150);
    setTimeout(() => {
      track(animate(word3Opacity, 1, { duration: 0.5, ease: "easeOut" }));
      track(animate(word3Y, 0, { duration: 0.5, ease: smoothEase }));
    }, 300);
  };

  const playPhase2 = () => {
    track(animate(word1Opacity, 0, { duration: 0.6, ease: "easeIn" }));
    track(animate(word1Y, -80, { duration: 0.7, ease: smoothEase }));
    setTimeout(() => {
      track(animate(word2Opacity, 0, { duration: 0.6, ease: "easeIn" }));
      track(animate(word2Y, -80, { duration: 0.7, ease: smoothEase }));
    }, 100);
    setTimeout(() => {
      track(animate(word3Opacity, 0, { duration: 0.6, ease: "easeIn" }));
      track(animate(word3Y, -80, { duration: 0.7, ease: smoothEase }));
    }, 200);
    setTimeout(() => {
      blobY.set(isMobile ? 300 : 500);
      blobOpacity.set(0);
      track(animate(blobY, 0, { duration: 1.2, ease: smoothEase }));
      track(animate(blobOpacity, 1, { duration: 0.8, ease: "easeOut" }));
      track(animate(glowScale, 1, { duration: 1.5, ease: smoothEase }));
      track(animate(glowOpacity, isMobile ? 0.18 : 0.1, { duration: 1.2, ease: "easeOut" }));
    }, 400);
  };

  const playPhase3 = () => {
    setCardsReady(true);
    const startY = isMobile ? 500 : 800;
    entranceY.set(startY);
    entranceOpacity.set(0);
    entranceRadiusScale.set(0.55);
    entranceSpin.set(-360);
    
    track(animate(entranceOpacity, 1, { duration: 0.5, ease: "linear" }));
    track(animate(entranceY, 0, { duration: 2.0, ease: smoothEase }));
    track(animate(entranceSpin, 0, { duration: 2.5, ease: smoothEase }));
    track(animate(entranceRadiusScale, 0.8, { duration: 2.0, ease: smoothEase }));
  };

  const playPhase3Reverse = () => {
    const startY = isMobile ? 500 : 800;
    track(animate(entranceOpacity, 0, { duration: 0.5, ease: "linear" }));
    track(animate(entranceY, startY, { duration: 1.5, ease: smoothEase }));
    track(animate(entranceRadiusScale, 0.55, { duration: 1.5, ease: smoothEase }));
    setTimeout(() => { if (phaseRef.current < 3) setCardsReady(false); }, 1500);
  };

  const playPhase2Reverse = () => {
    track(animate(blobY, isMobile ? 300 : 500, { duration: 1.2, ease: smoothEase }));
    track(animate(blobOpacity, 0, { duration: 0.8, ease: "easeIn" }));
    track(animate(glowScale, 0.3, { duration: 1.2, ease: smoothEase }));
    track(animate(glowOpacity, 0, { duration: 1.2, ease: "easeIn" }));
    setTimeout(() => {
      if (phaseRef.current >= 2) return;
      track(animate(word1Opacity, 1, { duration: 0.6, ease: "easeOut" }));
      track(animate(word1Y, 0, { duration: 0.7, ease: smoothEase }));
      track(animate(word2Opacity, 1, { duration: 0.6, ease: "easeOut" }));
      track(animate(word2Y, 0, { duration: 0.7, ease: smoothEase }));
      track(animate(word3Opacity, 1, { duration: 0.6, ease: "easeOut" }));
      track(animate(word3Y, 0, { duration: 0.7, ease: smoothEase }));
    }, 400);
  };

  const resetAll = () => {
    stopAll();
    phaseRef.current = 0;
    setCardsReady(false);
    word1Opacity.set(0); word1Y.set(60);
    word2Opacity.set(0); word2Y.set(60);
    word3Opacity.set(0); word3Y.set(60);
    blobScale.set(1); blobY.set(isMobile ? 300 : 500);
    blobOpacity.set(0); glowScale.set(0.3); glowOpacity.set(0);
    entranceOpacity.set(0); entranceY.set(isMobile ? 500 : 800);
    entranceSpin.set(0); entranceRadiusScale.set(0.3);
  };

  // Scroll-threshold listener — triggers phases, NO overflow lock
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const p = phaseRef.current;
      if (v > 0 && p === 0) { phaseRef.current = 1; playPhase1(); }
      if (v >= 0.25 && p === 1) { phaseRef.current = 2; playPhase2(); }
      if (v >= 0.50 && p === 2) { phaseRef.current = 3; playPhase3(); }
      
      // Reverse triggers (when scrolling up) with hysteresis
      if (v < 0.48 && p === 3) { phaseRef.current = 2; playPhase3Reverse(); }
      if (v < 0.23 && p === 2) { phaseRef.current = 1; playPhase2Reverse(); }
      
      // Reset if safely above
      if (v === 0 && p > 0) resetAll();
    });
    return () => { unsub(); stopAll(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drag interaction for cards
  const wheelTimeout = useRef(null);
  const touchDragRef = useRef({ startX: 0, lastX: 0, startY: 0, active: false });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const springBack = (mv, target) => {
      const step = () => {
        const c = mv.get(), n = c + (target - c) * 0.15;
        mv.set(Math.abs(n - target) < 0.1 ? target : n);
        if (Math.abs(n - target) > 0.1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        dragAngle.set(dragAngle.get() + e.deltaX * 0.2);
        dragTiltZ.set(Math.max(-12, Math.min(12, e.deltaX * 0.15)));
        dragTiltX.set(Math.max(-10, Math.min(10, Math.abs(e.deltaX) * 0.05)));
        clearTimeout(wheelTimeout.current);
        wheelTimeout.current = setTimeout(() => { springBack(dragTiltX, 0); springBack(dragTiltZ, 0); }, 150);
      }
    };
    const onTS = (e) => {
      if (!e.touches[0]) return;
      touchDragRef.current = { startX: e.touches[0].clientX, lastX: e.touches[0].clientX, startY: e.touches[0].clientY, active: true };
    };
    const onTM = (e) => {
      const t = touchDragRef.current;
      if (!t.active || !e.touches[0]) return;
      const cx = e.touches[0].clientX, dx = cx - t.lastX;
      if (Math.abs(cx - t.startX) > Math.abs(e.touches[0].clientY - t.startY) && Math.abs(cx - t.startX) > 5 && e.cancelable) e.preventDefault();
      t.lastX = cx;
      dragAngle.set(dragAngle.get() - dx * 0.6);
      dragTiltZ.set(Math.max(-8, Math.min(8, -dx * 0.3)));
    };
    const onTE = () => { touchDragRef.current.active = false; springBack(dragTiltZ, 0); springBack(dragTiltX, 0); };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTS, { passive: true });
    el.addEventListener("touchmove", onTM, { passive: false });
    el.addEventListener("touchend", onTE, { passive: true });
    return () => { el.removeEventListener("wheel", onWheel); el.removeEventListener("touchstart", onTS); el.removeEventListener("touchmove", onTM); el.removeEventListener("touchend", onTE); };
  }, [dragAngle, dragTiltX, dragTiltZ]);

  // Responsive blob size
  const [blobSize, setBlobSize] = useState(680);
  useEffect(() => {
    const update = () => { const w = window.innerWidth; setBlobSize(w < 768 ? 420 : w < 1200 ? 560 : 680); };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const setRefs = (node) => { containerRef.current = node; visibilityRef(node); };

  return (
    <section id="categories" ref={setRefs} className="relative w-full h-[500vh] bg-gradient-to-b from-[#fbfcfb] via-[#EFF8F6] to-[#fbfcfb] z-10">
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden z-0 relative">

        {/* Heading */}
        <div className="absolute inset-0 flex items-center justify-start pointer-events-none z-[5]">
          <div className="w-full flex flex-col items-start text-left text-[18vw] sm:text-[14vw] md:text-[10vw] lg:text-[10vw] leading-[0.9] tracking-tighter text-[#032218] opacity-70 sm:opacity-70 md:opacity-[0.85] select-none -translate-y-[1vh] sm:-translate-y-[4vh] md:-translate-y-[8vh]" style={{ fontFamily: 'var(--font-heading)' }}>
            <motion.span className="block" style={{ marginLeft: 'clamp(14vw, 20vw, 26vw)', opacity: word1Opacity, y: word1Y }}>cinematic</motion.span>
            <motion.span className="block" style={{ marginLeft: 'clamp(6vw, 10vw, 14vw)', opacity: word2Opacity, y: word2Y }}>video</motion.span>
            <motion.span className="block" style={{ marginLeft: 'clamp(10vw, 15vw, 20vw)', opacity: word3Opacity, y: word3Y }}>editing</motion.span>
          </div>
        </div>

        {/* Blob + Cards */}
        <div className="relative flex items-center justify-center min-h-[350px] sm:min-h-[450px] md:min-h-[600px] w-full max-w-6xl z-10" style={{ perspective: "1600px" }}>
          <motion.div className="absolute inset-0 m-auto w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] md:w-[800px] md:h-[800px] bg-[#20C997] blur-[110px] sm:blur-[120px] md:blur-[150px] rounded-full pointer-events-none transform-gpu" style={{ transformOrigin: "center center", scale: glowScale, opacity: glowOpacity }} />

          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div className="pointer-events-auto absolute" style={{ top: "50%", left: "50%", marginLeft: -blobSize / 2, marginTop: -blobSize / 2, width: blobSize, height: blobSize, zIndex: 15, scale: blobScale, y: blobY, opacity: blobOpacity }}>
              <Neo key={blobSize} color="#20C997" isPlaying={isVisible} particleCount={0} />
            </motion.div>

            {cardsReady && CATEGORIES.map((cat, index) => (
              <OrbitingCard key={cat.id} cat={cat} index={index} numItems={CATEGORIES.length} autoAngle={autoAngle} dragAngle={dragAngle} dragTiltX={dragTiltX} dragTiltZ={dragTiltZ} entranceSpin={entranceSpin} entranceRadiusScale={entranceRadiusScale} entranceY={entranceY} entranceOpacity={entranceOpacity} revolutionAngle={revolutionAngle} onClick={() => router.push(`/categories/${cat.id}`)} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OrbitingCard({ cat, index, numItems, autoAngle, dragAngle, dragTiltX, dragTiltZ, entranceSpin, entranceRadiusScale, entranceY, entranceOpacity, revolutionAngle, onClick }) {
  const combinedAngle = useTransform(() => (index * (360 / numItems)) + autoAngle.get() + dragAngle.get() + entranceSpin.get() + revolutionAngle.get());

  const [orbitRadius, setOrbitRadius] = useState(520);
  const [orbitYDepth, setOrbitYDepth] = useState(120);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) { setOrbitRadius(160); setOrbitYDepth(55); }
      else if (w < 768) { setOrbitRadius(200); setOrbitYDepth(70); }
      else if (w < 1200) { setOrbitRadius(350); setOrbitYDepth(100); }
      else { setOrbitRadius(500); setOrbitYDepth(120); }
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const x = useTransform(() => Math.cos((combinedAngle.get() * Math.PI) / 180) * (orbitRadius * entranceRadiusScale.get()));
  const y = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    return Math.sin(rad) * (orbitYDepth * entranceRadiusScale.get()) + Math.cos(rad) * (orbitYDepth * entranceRadiusScale.get()) + entranceY.get();
  });
  const rotateY = useTransform(() => 90 - combinedAngle.get());
  const rotateX = useTransform(() => 4 + Math.sin((combinedAngle.get() * Math.PI) / 180) * 8);
  const scale = useTransform(() => 0.7 + Math.sin((combinedAngle.get() * Math.PI) / 180) * 0.3);
  const zIndex = useTransform(() => Math.sin((combinedAngle.get() * Math.PI) / 180) > 0 ? 30 : 5);
  const opacity = useTransform(() => (0.7 + (0.5 + Math.sin((combinedAngle.get() * Math.PI) / 180) * 0.5) * 0.3) * entranceOpacity.get());
  const darknessOverlayOpacity = useTransform(() => (1 - (0.5 + Math.sin((combinedAngle.get() * Math.PI) / 180) * 0.5)) * 0.3);
  const wobbleDelay = `${index * -0.7}s`;

  return (
    <motion.div className="absolute flex flex-col justify-center items-center transform-gpu" style={{ x, y, zIndex, scale, opacity, rotateY, rotateX, pointerEvents: "none" }}>
      <motion.div className="relative group cursor-pointer pointer-events-auto transform-gpu select-none" style={{ touchAction: "pan-y", WebkitUserSelect: "none", userSelect: "none", rotateX: dragTiltX, rotateZ: dragTiltZ, transformOrigin: "center center" }} onClick={onClick} whileTap={{ scale: 0.97, rotateX: 3, transition: { type: "spring", stiffness: 400, damping: 15 } }}>
        <motion.div className="transform-gpu" style={{ animation: `paperFloat 4s ease-in-out infinite`, animationDelay: wobbleDelay }}>
          <motion.div layoutId={`card-container-${cat.id}`} className="relative w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[300px] md:h-[300px] lg:w-[360px] lg:h-[360px] rounded-[12px] sm:rounded-[16px] transform-gpu overflow-hidden" style={{ border: '2px solid rgba(32,201,151,0.35)', boxShadow: '0 12px 30px -6px rgba(13,124,102,0.25), 0 0 0 4px rgba(32,201,151,0.08), inset 0 1px 0 rgba(255,255,255,0.3)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <motion.img layoutId={`card-image-${cat.id}`} src={cat.image} alt={cat.title} draggable={false} className="absolute inset-0 w-full h-full pointer-events-none object-fill" style={{ objectFit: "fill" }} />
            <motion.div style={{ opacity: darknessOverlayOpacity }} className="absolute inset-0 bg-black pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-50 group-hover:opacity-30 transition-opacity z-10" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
