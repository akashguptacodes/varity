"use client";

import { motion } from "framer-motion";

export default function UIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between" style={{ zIndex: 10 }}>

      {/* Heavy Radial Blur & White Fade from center */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]" 
        style={{
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          background: 'radial-gradient(circle at center, rgba(251,252,251,1) 0%, rgba(251,252,251,0.95) 25%, rgba(251,252,251,0.6) 50%, transparent 85%)',
          maskImage: 'radial-gradient(circle at center, black 0%, black 25%, rgba(0,0,0,0.7) 50%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 25%, rgba(0,0,0,0.7) 50%, transparent 85%)',
        }}
      />

      {/* Center Content – the heart of the hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-8 z-10 relative pointer-events-none h-full w-full">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center pointer-events-auto max-w-2xl w-full"
        >
          {/* Hero headline – better mobile scaling for premium first impression */}
          <h1
            className="font-bold tracking-tight text-[#064e3b] text-center"
            style={{
              fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(2.5rem, 6.5vw, 6.5rem)",
              lineHeight: 1.05,
              marginBottom: 'clamp(16px, 3vw, 40px)',
            }}
          >
            Edit. Elevate. <span style={{ fontFamily: 'var(--font-logo)' }} className="uppercase tracking-tighter font-black">VERITY.</span>
          </h1>

          {/* CTA button row */}
          <div className="flex items-center justify-center gap-4">
            {/* CTA button – glassmorphism hover, touch-friendly sizing */}
            <a
              href="#categories"
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
              <span className="relative z-10">Projects</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
