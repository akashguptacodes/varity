"use client";

import { motion, useScroll, useTransform, useAnimationFrame, useMotionValue, AnimatePresence, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Neo from "./Neo/Neo";
import { getComplexColumns, getYouTubeId, getThumbnailUrl } from "../lib/videoUtils";

const CATEGORIES = [
  { id: 1, title: 'AI Videos', image: '/images/AIvideos.png' },
  { id: 2, title: 'Explainer', image: '/images/Explainer.png' },
  { id: 3, title: 'Posters', image: '/images/Poster.jpg' },
  { id: 4, title: 'Talking Head', image: '/images/TalkingHead.png' }
];

export default function CategorySection() {
  const containerRef = useRef(null);

  // Track scroll inside the 250vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Layout morphing state
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Lock body scroll when overlay is open so you don't accidentally lose your place down the page
  useEffect(() => {
    if (selectedCategory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; }
  }, [selectedCategory]);

  const scrollAngle = useTransform(scrollYProgress, [0, 0.25, 1], [0, 0, 360]);
  const introY = useTransform(scrollYProgress, [0, 0.1, 0.25], [120, 120, 0]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.1, 0.25], [0, 0, 1]);
  const textY1 = useTransform(scrollYProgress, [0, 0.06, 0.15], [0, 0, -1200]);
  const textY2 = useTransform(scrollYProgress, [0, 0.09, 0.18], [0, 0, -1200]);
  const textY3 = useTransform(scrollYProgress, [0, 0.12, 0.21], [0, 0, -1200]);
  const dragAngle = useMotionValue(0);
  const dragTiltX = useMotionValue(0);
  const dragTiltZ = useMotionValue(0);

  const autoAngle = useMotionValue(0);

  useAnimationFrame((t, delta) => {
    const baseSpeed = 0.008;
    autoAngle.set(autoAngle.get() + baseSpeed * delta * 0.5);
  });

  return (
    <>
      {/* FULLSCREEN MORPHING OVERLAY */}
      <AnimatePresence>
        {selectedCategory && (
          <ProjectOverlay
            cat={selectedCategory}
            onClose={() => setSelectedCategory(null)}
          />
        )}
      </AnimatePresence>

      <section ref={containerRef} className="relative w-full h-[250vh] bg-gradient-to-b from-[#fbfcfb] via-[#EFF8F6] to-[#fbfcfb]">
        {/* Keyframes and fonts are in globals.css */}
        <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden py-24 z-0">

          {/* Exact Replica of Typography tailored for Video Editing */}
          <div
            className="absolute inset-0 flex items-center justify-start pointer-events-none z-0 pl-[4vw]"
          >
            <div
              className="flex flex-col text-[16vw] md:text-[9.5vw] leading-[0.95] tracking-tight text-[#064e3b] opacity-[0.85] drop-shadow-md select-none -translate-y-[8vh]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <motion.span className="self-start pl-[8vw] md:pl-[6vw] transform-gpu block" style={{ y: textY1, willChange: "transform" }}>cinematic</motion.span>
              <motion.span className="self-start pl-[2vw] md:pl-[1vw] transform-gpu block" style={{ y: textY2, willChange: "transform" }}>video</motion.span>
              <motion.span className="self-start pl-[10vw] md:pl-[8vw] transform-gpu block" style={{ y: textY3, willChange: "transform" }}>editing</motion.span>
            </div>
          </div>

          <div className="relative flex items-center justify-center min-h-[600px] w-full max-w-6xl z-10" style={{ perspective: "1600px" }}>
            <div className="absolute w-[800px] h-[800px] bg-[#20C997] opacity-[0.10] blur-[150px] rounded-full pointer-events-none" />

            <motion.div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                style={{ zIndex: 15 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                  <div className="w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] md:w-[680px] md:h-[680px] relative flex justify-center items-center">
                    <Neo color="#20C997" />
                  </div>
                </div>
              </motion.div>

              {CATEGORIES.map((cat, index) => {
                const numItems = CATEGORIES.length;
                return (
                  <OrbitingCard
                    key={cat.id}
                    cat={cat}
                    index={index}
                    numItems={numItems}
                    scrollAngle={scrollAngle}
                    autoAngle={autoAngle}
                    dragAngle={dragAngle}
                    dragTiltX={dragTiltX}
                    dragTiltZ={dragTiltZ}
                    introY={introY}
                    introOpacity={introOpacity}
                    onClick={() => setSelectedCategory(cat)}
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

// Cards logic dynamically tracking LayoutId for seamless fullscreen stretch
function OrbitingCard({ cat, index, numItems, scrollAngle, autoAngle, dragAngle, dragTiltX, dragTiltZ, introY, introOpacity, onClick }) {
  const combinedAngle = useTransform(() => {
    return (index * (360 / numItems)) + autoAngle.get() + scrollAngle.get() + dragAngle.get();
  });

  const isDragging = useRef(false);

  const x = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    return Math.cos(rad) * 520;
  });

  const y = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    const baseEllipticalY = Math.sin(rad) * 120;
    const tiltOffset = Math.cos(rad) * 120;
    return baseEllipticalY + tiltOffset + introY.get();
  });

  // Tangential rotateY so cards face inward along the orbit Ã¢â‚¬â€ film reel wrapped around the blob
  const rotateY = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    // Tangent-aligned: card always faces the centre of the orbit
    return Math.cos(rad) * -65;
  });

  // Vertical tilt: front cards lean slightly back, rear cards lean slightly forward Ã¢â‚¬â€ gives 3D cylinder wrap feel
  const rotateX = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    return Math.cos(rad) * 12; // Ã‚Â±12Ã‚Â° vertical tilt following orbit
  });

  const scale = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    return 0.75 + (Math.sin(rad) * 0.25);
  });

  const zIndex = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    // Lower back cards visually hide behind the blob safely
    return Math.sin(rad) > 0 ? 30 : 5;
  });

  const darknessOverlayOpacity = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    const brightness = 0.5 + (Math.sin(rad) * 0.5);
    // Reduced max darkness to highlight images better
    return (1 - brightness) * 0.3;
  });

  const opacity = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    const brightness = 0.5 + (Math.sin(rad) * 0.5);
    // Raised base opacity so back cards remain highly visible
    return (0.7 + (brightness * 0.3)) * introOpacity.get();
  });

  // Staggered idle float wobble per card
  const wobbleDelay = `${index * -0.7}s`;

  // Use absolute pointers, hardware acceleration, and isolate to composite layer
  return (
    <motion.div
      className="absolute flex flex-col justify-center items-center transform-gpu"
      style={{ x, y, zIndex, scale, opacity, rotateY, rotateX, pointerEvents: "none" }}
    >
      <motion.div
        className="relative group cursor-pointer pointer-events-auto transform-gpu select-none"
        style={{
          touchAction: "pan-y",
          WebkitUserSelect: "none",
          userSelect: "none",
          rotateX: dragTiltX,
          rotateZ: dragTiltZ,
          transformOrigin: "center center",
        }}
        onPan={(e, info) => {
          dragAngle.set(dragAngle.get() - info.delta.x * 0.2);
          // Paper-like reactive tilt based on drag velocity
          const tiltX = Math.max(-15, Math.min(15, info.velocity.y * 0.02));
          const tiltZ = Math.max(-12, Math.min(12, -info.velocity.x * 0.015));
          dragTiltX.set(tiltX);
          dragTiltZ.set(tiltZ);
        }}
        onPanStart={() => {
          isDragging.current = true;
        }}
        onPanEnd={() => {
          setTimeout(() => { isDragging.current = false; }, 50);
          // Spring settle back to flat
          const springBack = (mv, target) => {
            const step = () => {
              const current = mv.get();
              const next = current + (target - current) * 0.15;
              mv.set(Math.abs(next - target) < 0.1 ? target : next);
              if (Math.abs(next - target) > 0.1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          };
          springBack(dragTiltX, 0);
          springBack(dragTiltZ, 0);
        }}
        onClick={(e) => {
          if (!isDragging.current) {
            onClick();
          }
        }}
        whileTap={{ scale: 0.97, rotateX: 3, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      >

        {/* Idle paper float wobble wrapper */}
        <motion.div
          className="transform-gpu"
          style={{
            animation: `paperFloat 4s ease-in-out infinite`,
            animationDelay: wobbleDelay,
          }}
        >
          {/* Core LayoutId tracking node Ã¢â‚¬â€ card body with full-bleed image */}
          <motion.div
            layoutId={`card-container-${cat.id}`}
            className="relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border border-[#0d7c66]/40 transform-gpu overflow-hidden"
          >
            {/* Full-bleed image Ã¢â‚¬â€ no strips, no black gaps */}
            <motion.img
              layoutId={`card-image-${cat.id}`}
              src={cat.image}
              alt={cat.title}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            <motion.div style={{ opacity: darknessOverlayOpacity }} className="absolute inset-0 bg-black pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-50 group-hover:opacity-30 transition-opacity z-10" />
          </motion.div>
        </motion.div>

        {/* Shared Layout Titles morph outwards beautifully */}
        <motion.p
          layoutId={`card-title-${cat.id}`}
          className="absolute -top-6 left-1 text-[#042f22] text-[20px] md:text-[24px] tracking-[0.1em] font-medium uppercase z-10 transition-transform duration-500 group-hover:-translate-y-2 whitespace-nowrap transform-gpu"
          style={{ textShadow: "0px 2px 4px rgba(255,255,255,0.8)" }}
        >
          {cat.title}
        </motion.p>

        <p
          className="absolute -bottom-6 right-2 text-[#064e3b] text-[14px] md:text-[15px] tracking-widest uppercase font-medium transition-all duration-300 group-hover:text-[#042f22] group-hover:translate-y-1 transform-gpu"
          style={{ textShadow: "0px 1px 2px rgba(255,255,255,0.5)" }}
        >
          View Project
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  VIDEO DATA – Centralised array of video objects                          */




/* ──────────────────────────────────────────────────────────────────────────── */
/*  FLOATING CARD – Renders interactive video cards                          */
/* ──────────────────────────────────────────────────────────────────────────── */
function FloatingCard({ card, enterDelay, onCardClick }) {
  const video = card;
  const isSlideshow = video.isSlideshow;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isSlideshow && video.images && video.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % video.images.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isSlideshow, video]);

  let thumbUrl = "";
  if (isSlideshow && video.images && video.images.length > 0) {
    thumbUrl = getThumbnailUrl({ thumbnail: video.images[currentIndex] });
  } else {
    thumbUrl = getThumbnailUrl(video);
  }

  return (
    <motion.div
      className="relative z-10 w-full rounded-[24px] overflow-hidden bg-black cursor-pointer shadow-lg border-[4px] md:border-[6px] lg:border-[8px] border-white transform-gpu"
      style={{ height: card.height, willChange: "transform, opacity" }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: enterDelay, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onCardClick(video)}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div layoutId={`hover-card-${video.id}`} className="w-full h-full relative group">
        <AnimatePresence>
          <motion.img
            key={thumbUrl}
            src={thumbUrl}
            loading="lazy"
            decoding="async"
            alt={video.title}
            referrerPolicy="no-referrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1113] via-transparent to-transparent opacity-60 z-10 pointer-events-none" />
        <motion.div className="absolute bottom-6 left-7 right-7 z-20 pointer-events-none">
          <h4 className="text-white text-[18px] md:text-[21px] font-bold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
            {video.title}
          </h4>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}


function ProjectOverlay({ cat, onClose }) {
  const overlayRef = useRef(null);
  const [scrollContainer, setScrollContainer] = useState(null);
  const [centerModalVideo, setCenterModalVideo] = useState(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    setScrollContainer(overlayRef.current);
    // Always start from the top when opening
    overlayRef.current.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Lock body scroll when internal detail is open
  useEffect(() => {
    if (centerModalVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [centerModalVideo]);

  // Scroll-linked parallax inside the overlay (smooth + works both directions)
  const { scrollYProgress } = useScroll({
    container: overlayRef,
    offset: ["start start", "end end"],
  });

  const columns = getComplexColumns(cat.id);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden"
      style={{ background: "#ffffff" }}
    >
      {/* Fonts loaded via globals.css */}

      {/* Ambient background glows */}
      <div
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full pointer-events-none opacity-50"
        style={{ background: "radial-gradient(ellipse, rgba(32,201,151,0.15) 0%, rgba(32,201,151,0.05) 40%, transparent 70%)" }}
      />


      {/* ── MASTER PADDING WRAPPER ── */}
      <div
        className="w-full min-h-screen pr-8"
        style={{ paddingLeft: "max(2rem, 2vw)", paddingTop: "max(1rem, 1vh)" }}
      >

        {/* ── Hero Header ── left-aligned with proper margins ── */}
        <div className="w-full pb-8 relative z-[60] flex flex-col items-start justify-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[700px] flex flex-col items-start"
            style={{ paddingLeft: "clamp(1rem, 1vw, 1rem)", paddingTop: "clamp(1rem, 1vh, 1rem)" }}
          >
            {/* Sleek Glassmorphic Back Button */}
            <button
              onClick={onClose}
              className="group cursor-pointer"
              style={{ marginBottom: "1rem" }}
            >
              <div
                className="flex items-center gap-1 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:bg-white group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-400 ease-out"
                style={{ paddingTop: "12px", paddingBottom: "12px", paddingLeft: "8px", paddingRight: "28px" }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-[#20C997] transition-all duration-400 ease-out">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 group-hover:text-white transition-colors duration-400 group-hover:-translate-x-0.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                </div>
                <span className="uppercase tracking-[0.2em] text-[11px] font-bold text-gray-500 group-hover:text-[#042f22] transition-colors duration-400 pt-[2px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  All Categories
                </span>
              </div>
            </button>

            {/* Category tag */}
            <div className="flex items-center justify-start" style={{ marginBottom: "1rem" }}>
              <div
                className="flex items-center gap-3 rounded-full border border-[#20C997]/25"
                style={{
                  background: "linear-gradient(90deg, rgba(32,201,151,0.12) 0%, rgba(32,201,151,0.02) 100%)",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  paddingLeft: "24px",
                  paddingRight: "24px"
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#20C997]" style={{ boxShadow: "0 0 8px rgba(32,201,151,0.6)" }} />
                <span
                  className="text-[#0d9488] text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-black"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {cat.title}
                </span>
              </div>
            </div>

            <motion.h1
              layoutId={`card-title-${cat.id}`}
              className="text-[#042f22] text-[28px] md:text-[42px] lg:text-[48px] tracking-tight leading-[1.05] font-bold text-left drop-shadow-sm"
              style={{ fontFamily: "'Playfair Display', serif", marginBottom: "0.75rem" }}
            >
              A Unified Platform For Cinematic Stories
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.9 }}
              className="text-[#4b5563] text-[15px] md:text-[17px] leading-[1.7] font-normal max-w-[550px] text-left"
              style={{ fontFamily: "'Inter', sans-serif", marginBottom: "1.75rem" }}
            >
              Revolutionize your production engine. We empower creators to grade, assemble, and master their visual narratives — all within a single high-performance pipeline.
            </motion.p>

            {/* Decorative accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-24 h-[3px] origin-left rounded-full"
              style={{ background: "linear-gradient(90deg, #20C997 0%, transparent 100%)" }}
            />
          </motion.div>
        </div>

        {/* ── Parallax Bento Grid ── */}
        {scrollContainer && (
          <div className="relative w-full max-w-[1800px] pb-[300px]">
            <div className="grid grid-cols-4 gap-2 md:gap-4 lg:gap-5 xl:gap-8 items-start">
              {columns.map((col, ci) => (
                <div
                  key={ci}
                  className={`flex flex-col gap-2 md:gap-4 lg:gap-5 xl:gap-8 ${ci === 0 ? "col-span-2" : "col-span-1"}`}
                  style={{ paddingTop: col.offsetTop }}
                >
                  {/* Apply parallax to the column wrapper instead of individual items for group movement */}
                  <ParallaxColumnWrapper scrollYProgress={scrollYProgress} speed={col.speed}>
                    {col.items.map((item, i) => {
                      if (item.type === 'pair') {
                        return (
                          <div key={item.id} className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-5 xl:gap-8 w-full">
                            <div className="w-full relative z-10 flex flex-col items-center">
                              <FloatingCard
                                card={item.pair[0]}
                                enterDelay={ci * 0.08 + i * 0.12}
                                onCardClick={setCenterModalVideo}
                              />
                            </div>
                            <div className="w-full relative z-10 flex flex-col items-center">
                              <FloatingCard
                                card={item.pair[1]}
                                enterDelay={ci * 0.08 + (i + 0.5) * 0.12}
                                onCardClick={setCenterModalVideo}
                              />
                            </div>
                          </div>
                        );
                      } else if (item.type === 'wide') {
                        return (
                          <div key={item.id} className="w-full relative z-10 flex flex-col items-center">
                            <FloatingCard
                              card={item.card}
                              enterDelay={ci * 0.08 + i * 0.12}
                              onCardClick={setCenterModalVideo}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div key={item.id} className="w-full relative z-10 flex flex-col items-center">
                            <FloatingCard
                              card={item.card}
                              enterDelay={ci * 0.08 + i * 0.12}
                              onCardClick={setCenterModalVideo}
                            />
                          </div>
                        );
                      }
                    })}
                  </ParallaxColumnWrapper>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Centered Hover Modal ── */}
      <AnimatePresence>
        {centerModalVideo && (
          <CenterHoverModal
            video={centerModalVideo}
            onClose={() => setCenterModalVideo(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ParallaxColumnWrapper({ children, scrollYProgress, speed }) {
  const rawShift = useTransform(scrollYProgress, (p) => {
    // Increased multiplier for more dramatic parallax
    return p * speed * 500;
  });
  
  // Smooth out the raw scroll value to eliminate jitter/lag
  const smoothShift = useSpring(rawShift, { stiffness: 200, damping: 40, mass: 0.5 });

  return (
    <motion.div
      style={{ y: smoothShift, willChange: "transform" }}
      className="flex flex-col gap-2 md:gap-4 lg:gap-5 xl:gap-8 w-full transform-gpu"
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  CENTER HOVER MODAL – Appears on click inside ProjectOverlay              */
/* ──────────────────────────────────────────────────────────────────────────── */
function CenterHoverModal({ video, onClose }) {
  const isImageOrSlideshow = video.isImage || video.isSlideshow;
  const [currentIndex, setCurrentIndex] = useState(0);
  const isExpandDown = video.expandir === 'down';

  useEffect(() => {
    if (video.isSlideshow && video.images && video.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % video.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [video]);

  let currentMediaSrc = "";
  if (video.isSlideshow && video.images && video.images.length > 0) {
    currentMediaSrc = getThumbnailUrl({ thumbnail: video.images[currentIndex] });
  } else if (video.isImage) {
    currentMediaSrc = getThumbnailUrl(video);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[160] flex items-center justify-center p-8 pointer-events-auto"
      initial={{ backgroundColor: "rgba(255,255,255,0)" }}
      animate={{ backgroundColor: "rgba(255,255,255,0.75)" }}
      exit={{ backgroundColor: "rgba(255,255,255,0)", transition: { duration: 0.15 } }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
      style={{ backdropFilter: "blur(6px)" }}
    >
      <motion.div
        layoutId={`hover-card-${video.id}`}
        className={`relative bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.2),_0_0_0_1px_rgba(0,0,0,0.03)] flex ${isExpandDown ? 'flex-col' : 'flex-row'} p-4 gap-12`}
        style={{
          width: "1150px",
          maxWidth: "90vw",
          height: isExpandDown ? "auto" : "500px",
          minHeight: isExpandDown ? "700px" : "500px"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-8 right-8 z-[170] w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all shadow-sm group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform duration-300"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {/* Video/Media Section */}
        <div className={`${isExpandDown ? 'w-full h-[400px]' : 'w-[50%] h-full'} relative bg-black shrink-0 overflow-hidden rounded-[32px] shadow-lg group`}>
          {isImageOrSlideshow ? (
            <AnimatePresence>
              <motion.img
                key={currentMediaSrc}
                src={currentMediaSrc}
                alt={video.title}
                referrerPolicy="no-referrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
          ) : (
            <iframe
              src={`${video.src}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={video.title}
            />
          )}
        </div>

        {/* Details Section */}
        <div className={`${isExpandDown ? 'w-full' : 'w-[50%]'} flex flex-col justify-center bg-white`} style={{
          fontFamily: "'Inter', sans-serif",
          padding: isExpandDown ? '32px 32px' : '32px 80px'
        }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#20C997]/10 border border-[#20C997]/20">
              <div className="w-2 h-2 rounded-full bg-[#20C997] animate-pulse" style={{ boxShadow: "0 0 10px rgba(32,201,151,0.5)" }} />
              <span className="text-[#0d9488] text-[10px] uppercase tracking-[0.25em] font-black">
                Preview
              </span>
            </div>
          </div>
          <h4 className="text-[#042f22] text-[36px] font-bold mb-6 leading-[1.1] tracking-tight">
            {video.title}
          </h4>
          <p className="text-[#6b7280] text-[16px] leading-[1.8]">
            {video.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
