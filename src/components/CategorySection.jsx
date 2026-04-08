"use client";

import { motion, useScroll, useTransform, useAnimationFrame, useMotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Neo from "./Neo/Neo";
const CATEGORIES = [
  { id: 1, title: 'LEVITATE FILM', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop' },
  { id: 2, title: 'STUDIO MOAN', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop' },
  { id: 3, title: 'CREATIVE WORK', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop' },
  { id: 4, title: 'DEVELOPMENT', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop' },
  { id: 5, title: '3D EXPERIENCES', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
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
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
          @keyframes paperFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-6px) rotate(0.8deg); }
            50% { transform: translateY(2px) rotate(-0.5deg); }
            75% { transform: translateY(-4px) rotate(0.3deg); }
          }
        `}} />
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

  const rotateY = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    return Math.cos(rad) * -65;
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
      style={{ x, y, zIndex, scale, opacity, rotateY, pointerEvents: "none", willChange: "transform, opacity" }}
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
          {/* Core LayoutId tracking node allowing Framer to map this exactly up to max screen */}
          <motion.div 
            layoutId={`card-container-${cat.id}`}
            className="relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-none overflow-hidden bg-[#064e3b] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border border-[#0d7c66]/40 transform-gpu bg-black"
            style={{ willChange: "transform" }}
          >
            <motion.img 
              layoutId={`card-image-${cat.id}`}
              src={cat.image} 
              alt={cat.title} 
              draggable={false}
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 pointer-events-none" 
            />
            <motion.div style={{ opacity: darknessOverlayOpacity }} className="absolute inset-0 bg-black pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-50 group-hover:opacity-30 transition-opacity" />
          </motion.div>
        </motion.div>
        
        {/* Shared Layout Titles morph outwards beautifully - Removed expensive drop-shadow filters for fast textShadow */}
        <motion.p 
          layoutId={`card-title-${cat.id}`}
          className="absolute -top-6 left-1 text-[#042f22] text-[20px] md:text-[24px] tracking-[0.1em] font-medium uppercase z-10 transition-transform duration-500 group-hover:-translate-y-2 whitespace-nowrap transform-gpu"
          style={{ textShadow: "0px 2px 4px rgba(255,255,255,0.8)", willChange: "transform" }}
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

// The expansive "Page" rendered via pure morphological animation framework
function ProjectOverlay({ cat, onClose }) {
  const overlayRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: overlayRef });

  // Floating offsets for whole columns (parallax). 
  // BOTH start at 0 so they are perfectly aligned horizontally.
  // We use smaller negative end limits (-80, -150) so they don't scroll up so fast that they overlap the top section.
  const yParallaxCol1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yParallaxCol2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-[#fbfcfb] overflow-y-auto overflow-x-hidden font-sans"
    >
      {/* Float Header / Close */}
      <motion.button 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        transition={{ delay: 0.3 }}
        onClick={onClose}
        className="fixed top-6 left-6 md:top-10 md:left-10 z-50 text-[#0d7c66] flex items-center gap-2 uppercase tracking-[0.2em] text-[11px] font-bold hover:text-[#042f22] transition-colors bg-white/70 backdrop-blur-xl px-5 py-4 rounded-full border border-[#0d7c66]/20 shadow-2xl"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Return to Orbit
      </motion.button>

      {/* Hero Meta Info - Reduced height as requested */}
      <div className="relative w-full h-[40vh] md:h-[45vh] flex items-end justify-center">
        
        {/* Core structure that automatically links sizes */}
        <motion.div 
          layoutId={`card-container-${cat.id}`}
          className="absolute inset-0 w-full h-full bg-[#042f22] overflow-hidden rounded-b-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
        >
          <motion.img 
            layoutId={`card-image-${cat.id}`}
            src={cat.image} 
            alt={cat.title} 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity brightness-75 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        </motion.div>

        {/* Hero Meta Info */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center pb-12 md:pb-16">
           <motion.h1 
             layoutId={`card-title-${cat.id}`}
             className="text-white text-[10vw] md:text-[8vw] tracking-tighter text-center uppercase leading-[0.85] drop-shadow-2xl font-black mix-blend-normal"
             style={{ fontFamily: "'Playfair Display', serif" }}
           >
             {cat.title}
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="text-[#20C997] uppercase tracking-[0.4em] font-bold text-[11px] md:text-[13px] mt-6 
                        border border-[#20C997]/30 px-8 py-3 rounded-full bg-black/40 backdrop-blur-md shadow-lg"
           >
             Interactive Editing Session
           </motion.p>
        </div>
      </div>

      {/* Primary Section mimicking layout - Massive gap to fully clear the hero curve dynamically */}
      <div className="w-full max-w-[1500px] mx-auto px-6 md:px-16 pb-[300px] mt-32 md:mt-48 lg:mt-[220px] relative z-20">
        {/* FLIPPED LAYOUT: lg:flex-row-reverse puts text on right, cards on left */}
        <div className="flex flex-col lg:flex-row-reverse items-start justify-between gap-16 lg:gap-24 relative w-full">
          
          {/* Right Sticky Column (Text) */}
          <div className="lg:sticky lg:top-40 lg:w-5/12 flex flex-col gap-8 z-20 pt-8">
            <h2 className="text-[#042f22] text-[48px] md:text-[60px] tracking-tight leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif" }}>
              One platform for your entire video editing workflow.
            </h2>
            <p className="text-[#064e3b]/80 text-xl md:text-[22px] leading-[1.7]">
              Say goodbye to scattered assets and disconnected timelines. We enable you to manage raw footage, apply intense color grades, and execute global rendering all from a single unified workspace. Plus, we handle everything from timeline optimization to final hardware-accelerated exports flawlessly.
            </p>
          </div>

          {/* Left Parallax Grid (Cards) */}
          <div className="lg:w-7/12 relative mt-16 lg:mt-0 w-full flex flex-col sm:flex-row gap-10 items-start">
            
            {/* Column 1 */}
            <motion.div style={{ y: yParallaxCol1 }} className="flex-1 flex flex-col gap-10 w-full">
              
              {/* Card: Raw Log (Now full width of col 1) */}
              <div className="w-full bg-[#eaeceb] rounded-[40px] p-8 md:p-10 flex flex-col items-center justify-between border border-[#0d7c66]/10 shadow-sm cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-500">
                <p className="self-start text-[#042f22] font-semibold text-xl mb-8">Raw Log</p>
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl relative bg-white flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#064e3b] opacity-30 sepia contrast-50 grayscale"></div>
                  <img src={cat.image} className="w-full h-full object-cover" alt="Raw" />
                </div>
                <p className="text-[13px] uppercase tracking-[0.2em] text-[#064e3b]/60 font-bold mt-8">S-Log3 Profile</p>
              </div>

              {/* Card: Graded (Now full width of col 1) */}
              <div className="w-full bg-[#1a201e] rounded-[40px] p-8 md:p-10 flex flex-col items-center justify-between border border-white/5 shadow-2xl cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(32,201,151,0.2)] transition-all duration-500">
                <p className="self-start text-[#20C997] font-semibold text-xl mb-8">Color Graded</p>
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#20C997] shadow-[0_0_40px_rgba(32,201,151,0.3)] relative">
                  <img src={cat.image} className="w-full h-full object-cover saturate-[1.8] contrast-[1.2]" alt="Graded" />
                </div>
                <button className="w-full py-4 mt-8 rounded-full border border-white/20 text-white text-[13px] uppercase font-bold tracking-widest hover:bg-white/10 transition">
                  View Node
                </button>
              </div>

              {/* Card: Export Complete */}
              <div className="w-full bg-[#1a201e] rounded-[40px] p-10 pb-12 flex flex-col items-center text-center border border-white/5 shadow-2xl cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500">
                <div className="w-24 h-28 bg-[#20C997] rounded-[30px] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(32,201,151,0.4)]">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#042f22" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   </div>
                </div>
                <h3 className="text-white text-[32px] font-medium tracking-tight mb-4 leading-tight">Render<br/>Complete!</h3>
                <p className="text-white/50 text-base mb-8">Collect your output file below</p>
                <div className="w-full flex items-center justify-between bg-black/50 rounded-2xl p-4 px-6 border border-white/10 hover:bg-black/70 transition">
                  <span className="text-white/80 text-[13px] font-mono tracking-wider">SEQ_01_FINAL.MP4</span>
                  <span className="text-[#20C997] text-[13px] font-bold uppercase tracking-[0.2em] cursor-pointer">Open</span>
                </div>
              </div>

            </motion.div>

            {/* Column 2 - Staggered via Frame Motion yParallaxCol2 */}
            <motion.div style={{ y: yParallaxCol2 }} className="flex-1 flex flex-col gap-10 w-full">
              
              {/* Card: Program Performance (Render Times) */}
              <div className="w-full bg-[#eaeceb] rounded-[40px] p-10 border border-[#0d7c66]/10 shadow-xl cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-[#042f22] text-[26px] font-black uppercase tracking-tight mb-8">Render Speed</h3>
                <div className="flex flex-wrap gap-3 mb-10">
                  <span className="px-5 py-2 rounded-full border border-[#0d7c66]/20 text-[12px] uppercase tracking-widest font-bold text-[#064e3b]">Timeline</span>
                  <span className="px-5 py-2 rounded-full bg-[#20C997] text-[12px] uppercase tracking-widest font-bold text-[#042f22] shadow-[0_4px_15px_rgba(32,201,151,0.4)]">Exporting</span>
                </div>
                {/* Geometric Chart Abstraction */}
                <div className="w-full h-56 border border-[#0d7c66]/20 relative grid grid-cols-4 grid-rows-3 rounded-2xl overflow-hidden bg-[#e0e4e2]/60 group">
                   <div className="col-span-4 row-span-1 border-b border-[#0d7c66]/10"></div>
                   <div className="col-span-4 row-span-1 border-b border-[#0d7c66]/10"></div>
                   <div className="col-span-1 row-span-3 border-r border-[#0d7c66]/10 absolute inset-y-0 left-[25%] hidden sm:block"></div>
                   <div className="col-span-1 row-span-3 border-r border-[#0d7c66]/10 absolute inset-y-0 left-[50%] hidden sm:block"></div>
                   <div className="col-span-1 row-span-3 border-r border-[#0d7c66]/10 absolute inset-y-0 left-[75%] hidden sm:block"></div>
                   
                   <svg className="absolute inset-0 w-full h-full transform group-hover:scale-[1.03] transition-transform duration-1000" preserveAspectRatio="none" viewBox="0 0 100 100">
                     <path d="M0,80 Q20,80 30,50 T60,60 T100,20" fill="none" stroke="#20C997" strokeWidth="3" className="drop-shadow-md" />
                     <path d="M0,80 Q20,80 30,50 T60,60 T100,20 V100 H0 Z" fill="rgba(32, 201, 151, 0.2)" />
                     <circle cx="80" cy="30" r="5" fill="#042f22" stroke="#20C997" strokeWidth="2.5" />
                     <line x1="80" y1="30" x2="80" y2="100" stroke="#042f22" strokeDasharray="4 4" strokeWidth="1.5" />
                   </svg>
                   <div className="absolute right-5 top-5 bg-white/70 backdrop-blur pb-px px-3 py-1 rounded text-[11px] text-[#042f22] font-mono border border-black/10">120 fps</div>
                </div>
              </div>

              {/* Card: Add Grade Preset */}
              <div className="w-full bg-[#1a201e] rounded-[40px] p-8 md:p-10 border border-white/5 shadow-2xl pb-10 cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500">
                <div className="w-full h-56 bg-white rounded-3xl overflow-hidden mb-8 relative group">
                  <img src={cat.image} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt="Preset" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 text-white font-mono text-[13px] tracking-widest">LUT_OSIRIS_M3</div>
                </div>
                <h3 className="text-white text-2xl font-medium tracking-tight mb-6">Apply Grade Preset</h3>
                <ul className="flex flex-col gap-4 mb-8">
                  <li className="flex text-white/70 text-base items-center gap-4"><div className="w-4 h-4 rounded-full bg-[#20C997] flex items-center justify-center shrink-0"><svg className="w-2.5 h-2.5 text-[#042f22]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div> Cinematic contrast curve</li>
                  <li className="flex text-white/70 text-base items-center gap-4"><div className="w-4 h-4 rounded-full bg-[#20C997] flex items-center justify-center shrink-0"><svg className="w-2.5 h-2.5 text-[#042f22]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div> Lifted shadows</li>
                  <li className="flex text-white/70 text-base items-center gap-4"><div className="w-4 h-4 rounded-full bg-[#20C997] flex items-center justify-center shrink-0"><svg className="w-2.5 h-2.5 text-[#042f22]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></div> Halation effect</li>
                </ul>
                <div className="flex gap-4 mb-8">
                  <div className="flex-1 border border-white/20 rounded-2xl p-5 cursor-pointer hover:bg-white/5 transition group relative overflow-hidden">
                    <p className="text-white/60 text-[13px] uppercase tracking-widest mb-2 font-bold">Standard</p>
                    <p className="text-white text-2xl font-medium">$24</p>
                    <div className="absolute inset-0 border-2 border-[#20C997] rounded-2xl opacity-0 group-hover:opacity-100 transition"></div>
                  </div>
                  <div className="flex-1 border border-white/20 rounded-2xl p-5 cursor-pointer hover:bg-white/5 transition">
                    <p className="text-white/60 text-[13px] uppercase tracking-widest mb-2 font-bold">Pro Bundle</p>
                    <p className="text-white text-2xl font-medium">$49</p>
                  </div>
                </div>
                <button className="w-full py-5 bg-[#20C997] rounded-2xl text-[#042f22] font-black text-[13px] uppercase tracking-[0.2em] hover:bg-[#1ab88a] transition shadow-[0_10px_20px_rgba(32,201,151,0.3)] hover:shadow-[0_15px_30px_rgba(32,201,151,0.4)]">
                  Add to timeline
                </button>
              </div>

              {/* Card: 24 Days Left (Timeline length / Cloud Storage) */}
              <div className="w-full bg-[#1a201e] rounded-[40px] p-8 md:p-10 border border-white/5 flex flex-col items-center shadow-xl cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500">
                 <div className="flex items-center justify-center gap-6 mb-10 text-white w-full border-b border-white/10 pb-8">
                   <span className="font-extrabold tracking-[0.3em] uppercase text-lg">VARITY</span>
                   <div className="w-px h-8 bg-white/20"></div>
                   <span className="font-serif italic text-2xl">Cloud</span>
                 </div>
                 <div className="relative w-56 h-56 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90 group-hover:-rotate-[135deg] transition-transform duration-[1.5s]" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"></circle>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#20C997" strokeWidth="4" strokeDasharray="283" strokeDashoffset="80" strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(32,201,151,0.5)]"></circle>
                    </svg>
                    <div className="text-center">
                      <p className="text-white text-[40px] font-medium tracking-tight leading-none mb-2">120<br/><span className="text-2xl text-white/50">GB</span></p>
                      <p className="text-[#20C997] text-[11px] uppercase font-bold tracking-[0.2em] mt-2">Free space</p>
                    </div>
                 </div>
              </div>

            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
