"use client";

import { motion } from "framer-motion";

export default function UIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between" style={{ zIndex: 10 }}>

      {/* Bottom Gradient Fade – shorter on mobile to reveal more of the 3D scene */}
      <div className="absolute bottom-0 left-0 w-full h-32 sm:h-56 md:h-80 bg-gradient-to-t from-[#fbfcfb] via-[#fbfcfb]/80 to-transparent pointer-events-none z-[1]" />

      {/* Top Navigation – glassmorphism pill on mobile, clean on desktop */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between pointer-events-auto w-full z-10 px-4 py-3 sm:px-6 sm:py-5 md:px-10 md:py-6"
      >
        <div className="flex items-center gap-4">
          {/* Logo with subtle glass background on mobile */}
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
      <div className="flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-8 z-10 relative pointer-events-none">

        {/* Glassmorphism backdrop – visible frosted panel behind hero text */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1] rounded-[40px] glass-modal transform-gpu"
          style={{
            width: 'min(92vw, 900px)',
            height: 'min(55vh, 500px)',
            background: 'radial-gradient(ellipse at center, rgba(239,248,246,0.7) 0%, rgba(220,242,235,0.4) 40%, rgba(251,252,251,0.15) 70%, transparent 100%)',
            border: '1px solid rgba(32,201,151,0.08)',
            boxShadow: '0 8px 60px rgba(13,124,102,0.04), inset 0 0 80px rgba(239,248,246,0.3)',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center pointer-events-auto max-w-2xl w-full"
        >
          {/* Brand label – refined tracking on mobile */}
          <h2
            className="font-bold tracking-[0.18em] sm:tracking-[0.2em] text-[#0d7c66] uppercase"
            style={{ fontSize: 'clamp(10px, 1.5vw, 14px)', marginBottom: 'clamp(10px, 2vw, 24px)' }}
          >
            VERITY
          </h2>

          {/* Hero headline – better mobile scaling for premium first impression */}
          <h1
            className="font-medium tracking-tight text-[#064e3b]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(2rem, 5vw + 0.5rem, 5.5rem)",
              lineHeight: 1.08,
              marginBottom: 'clamp(16px, 3vw, 40px)',
            }}
          >
            Your space<br /> for creation
          </h1>

          {/* CTA button row */}
          <div className="flex items-center justify-center gap-4">
            {/* CTA button – glassmorphism hover, touch-friendly sizing */}
            <a
              href="/about"
              className="group relative inline-flex items-center justify-center text-white rounded-full font-medium active:scale-95 transition-all tracking-[0.05em] overflow-hidden"
              style={{
                fontSize: 'clamp(13px, 1.2vw, 15px)',
                padding: 'clamp(14px, 1.8vw, 16px) clamp(28px, 3.5vw, 42px)',
                background: 'linear-gradient(135deg, #0d7c66, #20C997)',
                boxShadow: '0 8px 32px rgba(13,124,102,0.3), 0 0 0 3px rgba(32,201,151,0.15)',
              }}
            >
              {/* Glass sheen on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 pointer-events-none" />
              <span className="relative z-10">About us</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Content – "Watch our film" with subtle glassmorphism background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="pb-4 sm:pb-8 md:pb-10 pt-2 flex justify-center pointer-events-auto relative z-10"
      >
        <button className="flex items-center gap-2 text-[#0d7c66] text-[12px] sm:text-[14px] font-medium hover:text-[#0a5c4c] active:text-[#084c3e] cursor-pointer group rounded-full px-5 py-2.5 transition-all duration-300 glass-nav">
          <svg className="text-[#0d7c66] group-hover:text-[#0a5c4c] transition-colors" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          <span>Watch our new film (ft. Creators)</span>
        </button>
      </motion.div>
    </div>
  );
}
