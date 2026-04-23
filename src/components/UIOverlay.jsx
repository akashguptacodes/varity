"use client";

import { motion } from "framer-motion";

export default function UIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between" style={{ zIndex: 10 }}>

      {/* Bottom Gradient Fade – shorter on mobile to reveal more of the 3D scene */}
      <div className="absolute bottom-0 left-0 w-full h-32 sm:h-56 md:h-80 bg-gradient-to-t from-[#fbfcfb] via-[#fbfcfb]/80 to-transparent pointer-events-none z-[1]" />

      {/* Top Navigation – responsive padding */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between pointer-events-auto w-full z-10 px-4 py-3 sm:px-6 sm:py-5 md:px-10 md:py-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-[44px] sm:h-[44px] bg-[#0d7c66] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform shadow-md">
            <span 
              className="text-white text-lg sm:text-[22px] italic font-bold pr-0.5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              V
            </span>
          </div>
        </div>
      </motion.nav>

      {/* Center Content – the heart of the hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 sm:px-8 z-10 relative pointer-events-none">

        {/* Radial Center Mask – ensures text is readable over 3D cards */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1] rounded-full"
          style={{
            width: 'min(95vw, 1100px)',
            height: 'min(70vh, 700px)',
            background: 'radial-gradient(ellipse at center, rgba(251,252,251,1) 0%, rgba(251,252,251,0.85) 25%, rgba(251,252,251,0) 65%)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 65%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center pointer-events-auto max-w-2xl"
        >
          {/* Brand label */}
          <h2
            className="font-bold tracking-[0.2em] text-[#0d7c66] uppercase"
            style={{ fontSize: 'clamp(10px, 1.5vw, 14px)', marginBottom: 'clamp(12px, 2vw, 24px)' }}
          >
            VERITY
          </h2>

          {/* Hero headline – responsive with clamp, always single-line on small phones */}
          <h1
            className="font-medium tracking-tight text-[#064e3b]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1.75rem, 5vw + 0.5rem, 5.5rem)",
              lineHeight: 1.08,
              marginBottom: 'clamp(20px, 3vw, 40px)',
            }}
          >
            Your space<br /> for creation
          </h1>

          <div className="flex items-center justify-center gap-4">
            {/* CTA button – touch-friendly with proper min-height */}
            <a
              href="/about"
              className="inline-flex items-center justify-center bg-[#0d7c66] text-white rounded-full font-medium hover:bg-[#0a5c4c] active:scale-95 transition-all tracking-[0.05em]"
              style={{
                fontSize: 'clamp(13px, 1.2vw, 15px)',
                padding: 'clamp(12px, 1.8vw, 16px) clamp(24px, 3.5vw, 42px)',
              }}
            >
              About us
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Content – "Watch our film" */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="pb-4 sm:pb-8 md:pb-10 pt-2 flex justify-center pointer-events-auto relative z-10"
      >
        <button className="flex items-center gap-2 text-[#0d7c66] text-[12px] sm:text-[14px] font-medium hover:text-[#0a5c4c] active:text-[#084c3e] transition-colors cursor-pointer group">
          <svg className="text-[#0d7c66] group-hover:text-[#0a5c4c] transition-colors" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          <span>Watch our new film (ft. Creators)</span>
        </button>
      </motion.div>
    </div>
  );
}
