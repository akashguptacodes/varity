"use client";

import { motion, useScroll, useTransform, useAnimationFrame, useMotionValue, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

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
        `}} />
        <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden py-24 z-0">
          
          {/* Exact Replica of Typography tailored for Video Editing */}
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none z-0 pl-[4vw]">
            <div 
              className="flex flex-col text-[16vw] md:text-[9.5vw] leading-[0.95] tracking-tight text-[#064e3b] opacity-[0.85] drop-shadow-md select-none -translate-y-[8vh]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="self-start pl-[8vw] md:pl-[6vw]">cinematic</span>
              <span className="self-start pl-[2vw] md:pl-[1vw]">video</span>
              <span className="self-start pl-[10vw] md:pl-[8vw]">editing</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center min-h-[600px] w-full max-w-6xl z-10" style={{ perspective: "1600px" }}>
            <div className="absolute w-[800px] h-[800px] bg-[#20C997] opacity-[0.10] blur-[150px] rounded-full pointer-events-none" />
            
            <motion.div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                style={{ rotate: scrollAngle, zIndex: 15 }} 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                {/* SVG Displacement for smooth, continuous ripples without any hairy fractal noise */}
                <svg width="0" height="0" className="absolute pointer-events-none invisible">
                  <filter id="smooth-wobble">
                    {/* numOctaves="1" combined with low baseFrequency mathematically guarantees absolute smoothness */}
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="1" result="noise">
                      <animate attributeName="baseFrequency" values="0.015;0.025;0.015" dur="15s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="45" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                </svg>

                <div 
                  className="absolute inset-0 flex items-center justify-center p-10" 
                  style={{ filter: "url(#smooth-wobble)" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, ease: "linear", repeat: Infinity }}
                    className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] rounded-full absolute overflow-hidden shadow-[0_20px_50px_rgba(4,47,34,0.5)]"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #ffffff 0%, #20C997 25%, #0d7c66 55%, #042f22 85%, #000000 100%)",
                      boxShadow: "inset 10px 10px 30px rgba(255, 255, 255, 0.4), inset -40px -40px 60px rgba(0, 0, 0, 0.9)",
                    }}
                  >
                    {/* Floating dark shadow patch to simulate deep 3D surface bumps */}
                    <motion.div
                      animate={{ x: ['-20%', '30%', '-20%'], y: ['-20%', '30%', '-20%'] }}
                      transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
                      className="absolute w-[80%] h-[80%] bg-[#000000] opacity-50 rounded-full blur-[40px] mix-blend-multiply"
                      style={{ top: "10%", left: "10%" }}
                    />
                    {/* Floating bright spotlight patch to simulate moving specular surface light */}
                    <motion.div
                      animate={{ x: ['30%', '-20%', '30%'], y: ['-20%', '30%', '-20%'] }}
                      transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
                      className="absolute w-[70%] h-[70%] bg-[#20C997] opacity-60 rounded-full blur-[30px] mix-blend-overlay"
                      style={{ top: "20%", left: "20%" }}
                    />
                  </motion.div>
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
function OrbitingCard({ cat, index, numItems, scrollAngle, autoAngle, introY, introOpacity, onClick }) {
  const combinedAngle = useTransform(() => {
    return (index * (360 / numItems)) + autoAngle.get() + scrollAngle.get();
  });

  const x = useTransform(() => {
    const rad = (combinedAngle.get() * Math.PI) / 180;
    return Math.cos(rad) * 450; 
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

  // Use absolute pointers, hardware acceleration, and isolate to composite layer
  return (
    <motion.div
      className="absolute flex flex-col justify-center items-center transform-gpu"
      style={{ x, y, zIndex, scale, opacity, rotateY, pointerEvents: "none", willChange: "transform, opacity" }}
    >
      <div className="relative group cursor-pointer pointer-events-auto transform-gpu" onClick={onClick}>
        
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
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
          />
          <motion.div style={{ opacity: darknessOverlayOpacity }} className="absolute inset-0 bg-black pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-50 group-hover:opacity-30 transition-opacity" />
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
      </div>
    </motion.div>
  );
}

// The expansive "Page" rendered via pure morphological animation framework
function ProjectOverlay({ cat, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-[#fbfcfb] overflow-y-auto overflow-x-hidden"
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

      {/* Primary Parallax Frame targeting the specific LayoutId map limits */}
      <div className="relative w-full h-[65vh] md:h-[80vh] flex items-end justify-center">
        
        {/* Core structure that automatically links sizes */}
        <motion.div 
          layoutId={`card-container-${cat.id}`}
          className="absolute inset-0 w-full h-full bg-[#042f22] overflow-hidden rounded-b-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
        >
          <motion.img 
            layoutId={`card-image-${cat.id}`}
            src={cat.image} 
            alt={cat.title} 
            className="w-full h-full object-cover opacity-70 mix-blend-luminosity brightness-75 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        </motion.div>

        {/* Hero Meta Info */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center pb-16 md:pb-24">
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
                        border border-[#20C997]/30 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md"
           >
             Featured Interactive Editing Case
           </motion.p>
        </div>
      </div>

      {/* Elaborate Body Copy strictly mimicking high-end portfolios */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 py-24 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 items-start">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4 flex flex-col gap-12"
          >
            <div>
              <p className="text-[#0d7c66] text-[11px] uppercase tracking-[0.2em] font-extrabold mb-3">Role</p>
              <p className="text-[#064e3b]/80 font-bold leading-relaxed text-[15px]">Cinematic Direction<br/>Immersive Video Flow<br/>Post-Production Math</p>
            </div>
            <div>
              <p className="text-[#0d7c66] text-[11px] uppercase tracking-[0.2em] font-extrabold mb-3">Client Focus</p>
              <p className="text-[#064e3b]/80 font-bold leading-relaxed text-[15px]">Varity Global Agency</p>
            </div>
            <div>
              <p className="text-[#0d7c66] text-[11px] uppercase tracking-[0.2em] font-extrabold mb-3">Awards</p>
              <p className="text-[#064e3b]/80 font-bold leading-relaxed text-[15px]">Best Spatial Film 2026<br/>Awwwards Studio</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-8"
          >
            <h3 className="text-[#042f22] text-[36px] md:text-[54px] leading-[1.05] tracking-tight mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
              Breaking the boundaries of linear video interaction sequences.
            </h3>
            <p className="text-[#064e3b]/80 text-[18px] md:text-[22px] leading-[1.7] font-semibold">
              We partnered with the team to completely reinvent the digital editing experience. The primary goal was to remove traditional timeline cuts and replace them with physics-bound motion mechanics that react dynamically to the narrative tension on screen.
              <br/><br/>
              By utilizing advanced rendering pathways and heavily computed transition logic, the final video plays sequence operates out-of-bounds, blurring the line between passive viewing and a native desktop VR experience that runs flawlessly on standard browsers.
            </p>
            
            <div className="mt-20 w-full h-[400px] md:h-[600px] rounded-[30px] bg-[#eef7f4] overflow-hidden border border-[#0d7c66]/20 place-items-center flex text-[#0a5c4c] font-black text-2xl uppercase tracking-[0.2em] shadow-inner">
               Secondary Asset Reel
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
