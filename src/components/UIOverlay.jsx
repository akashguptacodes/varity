"use client";

import { motion } from "framer-motion";

export default function UIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between" style={{ zIndex: 10 }}>

      {/* Bottom Gradient Fade (Makes the lower part of the rotating cards look translucent) */}
      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-[#fbfcfb] via-[#fbfcfb]/90 to-transparent pointer-events-none z-[1]" />

      {/* Top Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between pointer-events-auto w-full z-10"
        style={{ padding: "24px 40px" }}
      >
        <div className="flex items-center gap-4">
          <div className="bg-[#0d7c66] rounded-full flex items-center justify-center text-white cursor-pointer shadow-sm hover:scale-105 transition-transform" style={{ width: "42px", height: "42px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 12L12 22L22 12L12 2Z" fill="currentColor" />
            </svg>
          </div>
          <div className="hidden md:flex bg-white/80 backdrop-blur-md rounded-full border border-[#0d7c66]/10 shadow-sm gap-5 text-[14px] font-medium text-[#0d7c66]/80 tracking-wide" style={{ padding: "10px 24px" }}>
            <a href="#" className="hover:text-[#0d7c66] transition-colors leading-none tracking-wide flex items-center">Explore</a>
            <a href="#" className="hover:text-[#0d7c66] transition-colors leading-none tracking-wide flex items-center">Careers</a>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-[280px] mx-6">
          <div className="w-full bg-white/80 backdrop-blur-md rounded-full border border-[#0d7c66]/10 shadow-sm flex items-center gap-3 text-[#0d7c66]/50 text-sm cursor-text" style={{ padding: "10px 20px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <span className="leading-none mt-[2px]">Search Varity...</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[14px] font-medium">
          <a href="#" className="hidden sm:block text-[#0d7c66] hover:opacity-70 transition-opacity">
            Login
          </a>
          <button className="bg-[#0d7c66] text-white rounded-full hover:bg-[#0a5c4c] transition-all whitespace-nowrap leading-none tracking-wide" style={{ padding: "12px 28px" }}>
            Sign up
          </button>
        </div>
      </motion.nav>

      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-[-5vh] z-10 relative pointer-events-none">

        {/* Massive Soft Radial Center Mask (Fades and blurs cards passing right behind text) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(251,252,251,1)_0%,rgba(251,252,251,0.8)_30%,rgba(251,252,251,0)_70%)] backdrop-blur-[4px] pointer-events-none z-[-1] rounded-full" style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center pointer-events-auto"
        >
          <h2 className="text-[14px] font-bold tracking-[0.2em] text-[#0d7c66] mb-6 uppercase">
            VARITY
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] font-medium tracking-tight text-[#064e3b] mb-10" style={{ fontFamily: "Inter, sans-serif" }}>
            Your space <br className="hidden sm:block" /> for creation
          </h1>

          <div className="flex items-center justify-center gap-4">
            <button className="bg-[#0d7c66] text-white rounded-full font-medium hover:bg-[#0a5c4c] transition-all text-[15px] leading-none" style={{ padding: "16px 36px" }}>
              Sign up
            </button>
            <button className="bg-white text-[#0d7c66] border border-[#0d7c66]/20 rounded-full font-medium hover:bg-[#f0f7f4] transition-all text-[15px] leading-none" style={{ padding: "16px 36px" }}>
              Get the app
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="pb-10 pt-4 flex justify-center pointer-events-auto relative z-10"
      >
        <button className="flex items-center gap-2 text-[#0d7c66] text-[14px] font-medium hover:text-[#0a5c4c] transition-colors cursor-pointer group">
          <svg className="text-[#0d7c66] group-hover:text-[#0a5c4c] transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          <span>Watch our new film (ft. Creators)</span>
        </button>
      </motion.div>
    </div>
  );
}
