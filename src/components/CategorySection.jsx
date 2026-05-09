"use client";

import { motion, useMotionValue, useAnimationFrame, useTransform, animate, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Neo from "./Neo/Neo";
import { useRouter } from "next/navigation";

// Mobile detection hook (SSR-safe)
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

export default function CategorySection() {
  const containerRef = useRef(null);
  const router = useRouter();
  const isMobile = useIsMobile();

  // 1. Trigger for when the section comes into 85% view
  const { ref: fullScreenRef, inView: isFullScreen } = useInView({
    rootMargin: "0px 0px -85% 0px",
  });

  // 2. Trigger for when the section is COMPLETELY out of view (up or down)
  const { ref: visibilityRef, inView: isVisible } = useInView({
    threshold: 0,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [cardsReady, setCardsReady] = useState(false);
  const [blobReady, setBlobReady] = useState(false);

  // Motion values for cards
  const autoAngle = useMotionValue(0);
  const entranceSpin = useMotionValue(-360);
  const entranceRadiusScale = useMotionValue(0.5);
  const entranceY = useMotionValue(isMobile ? 500 : 1000);
  const entranceOpacity = useMotionValue(0);
  const dragAngle = useMotionValue(0);
  const dragTiltX = useMotionValue(0);
  const dragTiltZ = useMotionValue(0);

  // Motion values for individual word entrance/exit
  const word1Opacity = useMotionValue(0);
  const word1Y = useMotionValue(50);
  const word2Opacity = useMotionValue(0);
  const word2Y = useMotionValue(50);
  const word3Opacity = useMotionValue(0);
  const word3Y = useMotionValue(50);

  // Motion values for blob (fade in from bottom, no scale change)
  const blobScale = useMotionValue(1);
  const blobY = useMotionValue(300);
  const blobOpacity = useMotionValue(0);
  const glowScale = useMotionValue(0.3);
  const glowOpacity = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const scrollAngle = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Normal slow rotation
  useAnimationFrame((t, delta) => {
    if (!isVisible) return;
    const baseSpeed = 0.008;
    autoAngle.set(autoAngle.get() + baseSpeed * delta * 0.5);
  });

  // Mouse / Touch handlers for dragging
  const wheelTimeout = useRef(null);
  const touchRef = useRef({ startX: 0, lastX: 0, active: false });
  const timersRef = useRef({ timers: [], scrollTimeout: null });
  const animControlsRef = useRef([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        dragAngle.set(dragAngle.get() + e.deltaX * 0.2);

        const tiltZ = Math.max(-12, Math.min(12, e.deltaX * 0.15));
        const tiltX = Math.max(-10, Math.min(10, Math.abs(e.deltaX) * 0.05));
        dragTiltZ.set(tiltZ);
        dragTiltX.set(tiltX);

        const springBack = (mv, target) => {
          const step = () => {
            const current = mv.get();
            const next = current + (target - current) * 0.15;
            mv.set(Math.abs(next - target) < 0.1 ? target : next);
            if (Math.abs(next - target) > 0.1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        };

        clearTimeout(wheelTimeout.current);
        wheelTimeout.current = setTimeout(() => {
          springBack(dragTiltX, 0);
          springBack(dragTiltZ, 0);
        }, 150);
      }
    };

    const handleTouchStart = (e) => {
      if (!e.touches[0]) return;
      touchRef.current.startX = e.touches[0].clientX;
      touchRef.current.startY = e.touches[0].clientY;
      touchRef.current.lastX = e.touches[0].clientX;
      touchRef.current.active = true;
    };

    const handleTouchMove = (e) => {
      if (!touchRef.current.active || !e.touches[0]) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - touchRef.current.lastX;
      const totalDeltaX = Math.abs(currentX - touchRef.current.startX);
      const totalDeltaY = Math.abs(currentY - touchRef.current.startY);

      if (totalDeltaX > totalDeltaY && totalDeltaX > 5) {
        if (e.cancelable) e.preventDefault();
      }

      touchRef.current.lastX = currentX;
      dragAngle.set(dragAngle.get() - deltaX * 0.6);
      const tiltZ = Math.max(-8, Math.min(8, -deltaX * 0.3));
      dragTiltZ.set(tiltZ);
    };

    const handleTouchEnd = () => {
      touchRef.current.active = false;
      const springBack = (mv, target) => {
        const step = () => {
          const current = mv.get();
          const next = current + (target - current) * 0.15;
          mv.set(Math.abs(next - target) < 0.1 ? target : next);
          if (Math.abs(next - target) > 0.1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      springBack(dragTiltZ, 0);
      springBack(dragTiltX, 0);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragAngle, dragTiltX, dragTiltZ]);


  const smoothEase = [0.22, 1, 0.36, 1];

  // Helper to push a timer and track it for cleanup
  const pushTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.timers.push(id);
    return id;
  };

  // Handle scroll locking and start sequence
  useEffect(() => {
    let hasStarted = false;

    const startSequence = () => {
      if (hasStarted) return;
      hasStarted = true;
      window.removeEventListener('scroll', handleScroll);

      const top = containerRef.current?.offsetTop;
      if (top !== undefined) {
        if (Math.abs(window.scrollY - top) > 5) {
          window.scrollTo({ top, behavior: 'auto' });
        }
      }

      document.body.style.overflow = "hidden";
      setIsPlaying(true);

      // ── Phase 1: Words enter one-by-one ──
      // "cinematic" at t=0
      animControlsRef.current.push(animate(word1Opacity, 1, { duration: 0.7, ease: "easeOut" }));
      animControlsRef.current.push(animate(word1Y, 0, { duration: 0.7, ease: smoothEase }));

      // "video" at t=250ms
      pushTimer(() => {
        animControlsRef.current.push(animate(word2Opacity, 1, { duration: 0.7, ease: "easeOut" }));
        animControlsRef.current.push(animate(word2Y, 0, { duration: 0.7, ease: smoothEase }));
      }, 250);

      // "editing" at t=500ms
      pushTimer(() => {
        animControlsRef.current.push(animate(word3Opacity, 1, { duration: 0.7, ease: "easeOut" }));
        animControlsRef.current.push(animate(word3Y, 0, { duration: 0.7, ease: smoothEase }));
      }, 500);

      // ── Phase 2: Blob fades in from bottom at t=1400ms ──
      pushTimer(() => {
        setBlobReady(true);
        animControlsRef.current.push(animate(blobY, 0, { duration: 1.5, ease: smoothEase }));
        animControlsRef.current.push(animate(blobOpacity, 1, { duration: 1.5, ease: "easeOut" }));
        animControlsRef.current.push(animate(glowScale, 1, { duration: 1.8, ease: smoothEase }));
        animControlsRef.current.push(animate(glowOpacity, isMobile ? 0.18 : 0.1, { duration: 1.5, ease: "easeOut" }));
      }, 1400);

      // ── Phase 3: Cards rise from bottom at t=2800ms ──
      pushTimer(() => {
        setCardsReady(true);
        document.body.style.overflow = "";

        const holdY = isMobile ? 120 : 180;
        animControlsRef.current.push(animate(entranceY, [isMobile ? 500 : 1000, holdY], {
          duration: 1.5,
          ease: "easeOut"
        }));
        animControlsRef.current.push(animate(entranceOpacity, [0, 1], {
          duration: 1.5,
          ease: "linear"
        }));
      }, 2800);

      // ── Phase 4: Words exit one-by-one (after cards are visible) ──
      // "cinematic" exits at t=4800ms
      pushTimer(() => {
        animControlsRef.current.push(animate(word1Y, -300, { duration: 0.9, ease: smoothEase }));
        animControlsRef.current.push(animate(word1Opacity, 0, { duration: 0.9, ease: "easeIn" }));
      }, 4800);

      // "video" exits at t=5100ms
      pushTimer(() => {
        animControlsRef.current.push(animate(word2Y, -300, { duration: 0.9, ease: smoothEase }));
        animControlsRef.current.push(animate(word2Opacity, 0, { duration: 0.9, ease: "easeIn" }));
      }, 5100);

      // "editing" exits at t=5400ms
      pushTimer(() => {
        animControlsRef.current.push(animate(word3Y, -300, { duration: 0.9, ease: smoothEase }));
        animControlsRef.current.push(animate(word3Opacity, 0, { duration: 0.9, ease: "easeIn" }));
      }, 5400);

      // ── Phase 5: Cards float then revolve + rise at t=6300ms ──
      pushTimer(() => {
        animControlsRef.current.push(animate(entranceY, 0, { duration: 2.5, ease: smoothEase }));
        entranceSpin.set(-360);
        animControlsRef.current.push(animate(entranceSpin, 0, { duration: 3.5, ease: smoothEase }));
        entranceRadiusScale.set(0.5);
        animControlsRef.current.push(animate(entranceRadiusScale, 1, { duration: 2.0, ease: smoothEase }));
      }, 6300);
    };

    const handleScroll = () => {
      clearTimeout(timersRef.current.scrollTimeout);
      timersRef.current.scrollTimeout = setTimeout(startSequence, 150);
    };

    if (isFullScreen && !isPlaying) {
      timersRef.current.scrollTimeout = setTimeout(startSequence, 150);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timersRef.current.scrollTimeout);
      timersRef.current.timers.forEach(t => clearTimeout(t));
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullScreen]);

  // Handle conditional reset logic
  useEffect(() => {
    if (!isVisible) {
      const top = containerRef.current?.offsetTop;
      if (top !== undefined && window.scrollY < top) {
        timersRef.current.timers.forEach(t => clearTimeout(t));
        timersRef.current.timers = [];
        clearTimeout(timersRef.current.scrollTimeout);
        document.body.style.overflow = "";

        animControlsRef.current.forEach(anim => anim.stop());
        animControlsRef.current = [];

        setIsPlaying(false);
        setCardsReady(false);
        setBlobReady(false);
        entranceSpin.set(-360);
        entranceRadiusScale.set(0.5);
        entranceY.set(isMobile ? 500 : 1000);
        entranceOpacity.set(0);

        // Reset word motion values
        word1Opacity.set(0); word1Y.set(50);
        word2Opacity.set(0); word2Y.set(50);
        word3Opacity.set(0); word3Y.set(50);

        // Reset blob motion values
        blobScale.set(1); blobY.set(300); blobOpacity.set(0);
        glowScale.set(0.3); glowOpacity.set(0);
      }
    }
  }, [isVisible, entranceSpin, entranceRadiusScale, entranceY, entranceOpacity,
      word1Opacity, word1Y, word2Opacity, word2Y, word3Opacity, word3Y,
      blobScale, blobY, blobOpacity, glowScale, glowOpacity]);

  const setRefs = (node) => {
    containerRef.current = node;
    fullScreenRef(node);
    visibilityRef(node);
  };

  return (
    <section id="categories" ref={setRefs} className="relative w-full h-[300vh] bg-gradient-to-b from-[#fbfcfb] via-[#EFF8F6] to-[#fbfcfb] z-10">
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden py-12 sm:py-16 md:py-24 z-0 relative">

        {/* Heading — each word individually animated */}
        <div className="absolute inset-0 flex items-center justify-start pointer-events-none z-0">
          <div className="w-full flex flex-col items-start text-left text-[18vw] sm:text-[14vw] md:text-[10vw] lg:text-[10vw] leading-[0.9] tracking-tighter text-[#032218] opacity-70 sm:opacity-70 md:opacity-[0.85] select-none -translate-y-[1vh] sm:-translate-y-[4vh] md:-translate-y-[8vh]" style={{ fontFamily: 'var(--font-heading)' }}>
            <motion.span className="block" style={{ marginLeft: 'clamp(14vw, 20vw, 26vw)', opacity: word1Opacity, y: word1Y }}>cinematic</motion.span>
            <motion.span className="block" style={{ marginLeft: 'clamp(6vw, 10vw, 14vw)', opacity: word2Opacity, y: word2Y }}>video</motion.span>
            <motion.span className="block" style={{ marginLeft: 'clamp(10vw, 15vw, 20vw)', opacity: word3Opacity, y: word3Y }}>editing</motion.span>
          </div>
        </div>



        <div className="relative flex items-center justify-center min-h-[350px] sm:min-h-[450px] md:min-h-[600px] w-full max-w-6xl z-10" style={{ perspective: "1600px" }}>
          {/* Background glow — scales in place */}
          <motion.div
            className="absolute inset-0 m-auto w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] md:w-[800px] md:h-[800px] bg-[#20C997] blur-[110px] sm:blur-[120px] md:blur-[150px] rounded-full pointer-events-none transform-gpu"
            style={{ transformOrigin: "center center", scale: glowScale, opacity: glowOpacity }}
          />

          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* 3D Blob — now a sibling of cards so z-index correctly interleaves */}
            {blobReady && (
              <motion.div
                className="pointer-events-auto absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  marginLeft: isMobile ? -210 : -340,
                  marginTop: isMobile ? -210 : -340,
                  width: isMobile ? 420 : 680,
                  height: isMobile ? 420 : 680,
                  zIndex: 15,
                  scale: blobScale,
                  y: blobY,
                  opacity: blobOpacity,
                }}
              >
                <Neo color="#20C997" isPlaying={isVisible} particleCount={isMobile ? 3000 : undefined} particleSize={isMobile ? 0.04 : undefined} />
              </motion.div>
            )}

            {/* Orbiting Cards Mapped as Direct Siblings */}
            {CATEGORIES.map((cat, index) => (
              <OrbitingCard
                key={cat.id}
                cat={cat}
                index={index}
                numItems={CATEGORIES.length}
                autoAngle={autoAngle}
                dragAngle={dragAngle}
                dragTiltX={dragTiltX}
                dragTiltZ={dragTiltZ}
                entranceSpin={entranceSpin}
                entranceRadiusScale={entranceRadiusScale}
                entranceY={entranceY}
                entranceOpacity={entranceOpacity}
                scrollAngle={scrollAngle}
                onClick={() => router.push(`/categories/${cat.id}`)}
              />
            ))}
          </motion.div>
        </div>

        {/* SWIPE INDICATOR */}
        <motion.div
          className="absolute bottom-4 sm:bottom-0 inset-x-0 flex flex-col items-center justify-center z-[60] pointer-events-none px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: cardsReady ? 1 : 0 }}
          transition={{ duration: 1.0 }}
        >
        </motion.div>
      </div>
    </section>
  );
}

function OrbitingCard({ cat, index, numItems, autoAngle, dragAngle, dragTiltX, dragTiltZ, entranceSpin, entranceRadiusScale, entranceY, entranceOpacity, scrollAngle, onClick }) {
  const combinedAngle = useTransform(() => {
    return (index * (360 / numItems)) + autoAngle.get() + dragAngle.get() + entranceSpin.get() + scrollAngle.get();
  });

  const [orbitRadius, setOrbitRadius] = useState(520);
  const [orbitYDepth, setOrbitYDepth] = useState(120);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) { setOrbitRadius(165); setOrbitYDepth(55); }
      else if (w < 768) { setOrbitRadius(180); setOrbitYDepth(65); }
      else if (w < 1024) { setOrbitRadius(340); setOrbitYDepth(100); }
      else { setOrbitRadius(520); setOrbitYDepth(120); }
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const x = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    return Math.cos(rad) * (orbitRadius * entranceRadiusScale.get());
  });

  const y = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    const baseEllipticalY = Math.sin(rad) * (orbitYDepth * entranceRadiusScale.get());
    const tiltOffset = Math.cos(rad) * (orbitYDepth * entranceRadiusScale.get());
    return baseEllipticalY + tiltOffset + entranceY.get();
  });

  const rotateY = useTransform(() => Math.cos((combinedAngle.get() * Math.PI) / 180) * -65);
  const rotateX = useTransform(() => Math.cos((combinedAngle.get() * Math.PI) / 180) * 12);
  const scale = useTransform(() => 0.75 + (Math.sin((combinedAngle.get() * Math.PI) / 180) * 0.25));
  const zIndex = useTransform(() => Math.sin((combinedAngle.get() * Math.PI) / 180) > 0 ? 30 : 5);

  const opacity = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    const baseOpacity = 0.7 + ((0.5 + (Math.sin(rad) * 0.5)) * 0.3);
    return baseOpacity * entranceOpacity.get();
  });
  const darknessOverlayOpacity = useTransform(() => (1 - (0.5 + (Math.sin((combinedAngle.get() * Math.PI) / 180) * 0.5))) * 0.3);

  const wobbleDelay = `${index * -0.7}s`;

  return (
    <motion.div
      className="absolute flex flex-col justify-center items-center transform-gpu"
      style={{ x, y, zIndex, scale, opacity, rotateY, rotateX, pointerEvents: "none" }}
    >
      <motion.div
        className="relative group cursor-pointer pointer-events-auto transform-gpu select-none"
        style={{ touchAction: "pan-y", WebkitUserSelect: "none", userSelect: "none", rotateX: dragTiltX, rotateZ: dragTiltZ, transformOrigin: "center center" }}
        onClick={onClick}
        whileTap={{ scale: 0.97, rotateX: 3, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      >
        <motion.div className="transform-gpu" style={{ animation: `paperFloat 4s ease-in-out infinite`, animationDelay: wobbleDelay }}>
          <motion.div
            layoutId={`card-container-${cat.id}`}
            className="relative w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[300px] md:h-[300px] lg:w-[360px] lg:h-[360px] rounded-[12px] sm:rounded-[16px] transform-gpu overflow-hidden"
            style={{ border: '2px solid rgba(32,201,151,0.35)', boxShadow: '0 12px 30px -6px rgba(13,124,102,0.25), 0 0 0 4px rgba(32,201,151,0.08), inset 0 1px 0 rgba(255,255,255,0.3)' }}
          >
            <motion.img layoutId={`card-image-${cat.id}`} src={cat.image} alt={cat.title} draggable={false} className="absolute inset-0 w-full h-full pointer-events-none object-fill" style={{ objectFit: "fill" }} />
            <motion.div style={{ opacity: darknessOverlayOpacity }} className="absolute inset-0 bg-black pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-50 group-hover:opacity-30 transition-opacity z-10" />
          </motion.div>
        </motion.div>

        {/* Removed top tags text */}
      </motion.div>
    </motion.div>
  );
}
