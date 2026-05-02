"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import CalendlyButton from "@/components/CalendlyButton";
import Tilt from "react-parallax-tilt";

const Neo = dynamic(() => import("@/components/Neo/Neo"), { ssr: false });
const StoryVisualOrb = dynamic(() => import("@/components/StoryVisualOrb"), { ssr: false });

const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } };

// Categories data for Bento Grid
const CATEGORIES_DATA = [
  {
    id: 1,
    title: "AI Videos",
    description: "Intelligent scene generation & cinematic storytelling. Professional results with minimal effort.",
    icon: "🤖",
  },
  {
    id: 2,
    title: "Explainer Videos",
    description: "Transform complex ideas into engaging visual stories with stunning custom animations.",
    icon: "🎬",
  },
  {
    id: 3,
    title: "Posters & Graphics",
    description: "Eye-catching visual designs that capture attention and directly convey your brand message.",
    icon: "🎨",
  },
  {
    id: 4,
    title: "Talking Head Videos",
    description: "Professional talking head videos that build incredible trust and connection with your audience.",
    icon: "🎤",
  }
];

const FEATURES_DATA = [
  {
    title: "AI-Powered Editing",
    description: "Leverage cutting-edge artificial intelligence to automate tedious tasks and focus on the creative vision.",
    icon: "⚡",
    benefits: ["50% faster editing", "Smart scene detection", "Auto color correction"]
  },
  {
    title: "Premium Quality",
    description: "Industry-standard video production with cinematic color science and broadcast-ready output.",
    icon: "🎯",
    benefits: ["4K resolution", "Pro audio mixing", "Broadcast standards"]
  },
  {
    title: "Cloud Collaboration",
    description: "Work seamlessly with your team anywhere via instant feedback loops and real-time preview.",
    icon: "☁️",
    benefits: ["Real-time rendering", "Browser-based", "Version history"]
  }
];

const STATS_DATA = [
  { value: "500+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "99%", label: "Satisfaction Rate" },
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);

  return (
    <main ref={containerRef} className="relative bg-[#fbfcfb] min-h-screen text-[#042f22] overflow-x-hidden selection:bg-[#20C997]/30">

      {/* Fonts loaded via globals.css */}



      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative w-full min-h-[100vh] flex flex-col justify-center items-center overflow-hidden z-10">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#20C997]/[0.04] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#042f22]/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[30%] left-[15%] w-[200px] h-[200px] bg-[#20C997]/[0.05] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-[#065f46]/[0.03] rounded-full blur-[100px] pointer-events-none" />

        {/* Neo Blob Background — click & drag to rotate */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing">
          <div className="w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] lg:w-[720px] lg:h-[720px]" style={{ opacity: 0.55 }}>
            <Neo
              color="#20C997"
              isPlaying={true}
              particleCount={15000}
              particleSize={0.025}
              cameraZ={5}
              enableRotate={false}
            />
          </div>
        </div>

        {/* Floating geometric accents */}
        <motion.div
          className="absolute top-[18%] right-[12%] w-3 h-3 rounded-full border border-[#20C997]/30 pointer-events-none hidden md:block"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[25%] left-[8%] w-2 h-2 rounded-full bg-[#20C997]/20 pointer-events-none hidden md:block"
          animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] right-[25%] w-16 h-[1px] bg-gradient-to-r from-transparent via-[#20C997]/20 to-transparent pointer-events-none hidden lg:block"
          animate={{ opacity: [0, 0.5, 0], scaleX: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={{ y: heroY, margin: "0 auto", padding: "0 clamp(28px, 6vw, 80px)" }}
          className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 rounded-full hover:scale-105 transition-transform duration-500 cursor-default"
            style={{ padding: "10px 24px", marginBottom: "48px", background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.3))', backdropFilter: 'blur(20px) saturate(1.5)', WebkitBackdropFilter: 'blur(20px) saturate(1.5)', border: '1px solid rgba(32,201,151,0.3)', boxShadow: '0 8px 32px rgba(13,124,102,0.1), inset 0 2px 0 rgba(255,255,255,0.6)' }}
          >
            <span className="w-2 h-2 rounded-full bg-[#20C997] animate-pulse" style={{ boxShadow: '0 0 10px rgba(32,201,151,0.8)' }} />
            <span className="text-[#0d7c66] font-bold tracking-[0.15em] text-[11px] uppercase" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              Elevating Visual Storytelling
            </span>
          </motion.div>

          {/* Title — staggered word reveal */}
          <motion.h1
            variants={fadeUp}
            className="text-[3.2rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] font-black tracking-[-0.03em] text-[#042f22] leading-[0.95]"
            style={{ fontFamily: 'var(--font-heading)', marginBottom: "36px" }}
          >
            <motion.span className="inline-block" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
              About{" "}
            </motion.span>
            <motion.span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#20C997] via-[#0d7c66] to-[#065f46] animate-gradient" style={{ backgroundSize: '200% 200%' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              Verity
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl text-[#64748b] leading-[1.85] max-w-2xl mx-auto font-light"
            style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", marginBottom: "20px" }}
          >
            Revolutionizing video creation through AI-powered tools and cinematic expertise. We empower creators to tell compelling stories with professional-grade polish.
          </motion.p>

          {/* Decorative accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#20C997] to-transparent rounded-full origin-center"
            style={{ marginBottom: "48px" }}
          />

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <div className="w-8 h-14 rounded-full flex justify-center pt-2.5" style={{ border: '1px solid rgba(32,201,151,0.3)', background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.2))', backdropFilter: 'blur(16px) saturate(1.5)', WebkitBackdropFilter: 'blur(16px) saturate(1.5)', boxShadow: '0 8px 24px rgba(13,124,102,0.08), inset 0 1px 0 rgba(255,255,255,0.5)' }}>
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-[#0d7c66]"
                style={{ boxShadow: '0 0 8px rgba(13,124,102,0.6)' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>



      {/* ═══════════════ OUR STORY (PREMIUM) ═══════════════ */}
      <section className="relative bg-white rounded-[40px] sm:rounded-[60px] z-20 mt-4 sm:mt-8 overflow-hidden group/section border border-[#042f22]/[0.02]" style={{ boxShadow: '0 -10px 40px rgba(13,124,102,0.03), 0 20px 60px rgba(13,124,102,0.04)' }}>
        {/* Cinematic Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#fbfcfb] to-[#f4f9f7] pointer-events-none" />
        <motion.div 
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#20C997]/[0.015] rounded-full blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-[#065f46]/[0.015] rounded-full blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative z-10 w-full max-w-[88rem] mx-auto" style={{ padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)" }}>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-[clamp(48px,8vw,120px)]">

            {/* ── LEFT: PREMIUM TYPOGRAPHY ── */}
            <div className="relative">
              {/* Subtle accent line behind text */}
              <div className="absolute left-[-24px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#20C997]/0 via-[#20C997]/20 to-[#20C997]/0 hidden md:block" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
                }}
              >
                {/* Eyebrow */}
                <div className="overflow-hidden mb-6">
                  <motion.div
                    variants={{
                      hidden: { y: "100%" },
                      visible: { y: "0%", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-[1px] bg-[#20C997]" />
                    <span className="text-[#20C997] font-semibold tracking-[0.25em] text-[11px] uppercase" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                      Our Story
                    </span>
                  </motion.div>
                </div>

                {/* Main Heading with Masking Reveal */}
                <div className="mb-10">
                  <h2 
                    className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-[#042f22] leading-[1.05] tracking-[-0.03em] pb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    <div className="overflow-hidden">
                      <motion.div
                        variants={{
                          hidden: { y: "105%", rotate: 2 },
                          visible: { y: "0%", rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                        }}
                        style={{ transformOrigin: "left bottom" }}
                      >
                        Born from a Passion
                      </motion.div>
                    </div>
                    <div className="overflow-hidden">
                      <motion.div
                        variants={{
                          hidden: { y: "105%", rotate: 2 },
                          visible: { y: "0%", rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                        }}
                        style={{ transformOrigin: "left bottom" }}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-[#042f22] to-[#0d7c66]"
                      >
                        for Cinema
                      </motion.div>
                    </div>
                  </h2>
                </div>

                {/* Animated Expanding Divider */}
                <motion.div 
                  variants={{
                    hidden: { scaleX: 0, opacity: 0 },
                    visible: { scaleX: 1, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  style={{ transformOrigin: "left center", marginBottom: "40px" }}
                  className="w-20 h-[2px] bg-gradient-to-r from-[#20C997] to-transparent rounded-full" 
                />

                {/* Paragraphs */}
                <div className="space-y-6 text-[#64748b] text-[17px] md:text-[19px] leading-[1.8] font-light" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                  >
                    Verity was founded with a singular mission: to democratize Hollywood-tier video creation. We believe every story deserves to be heard with absolute cinematic authority.
                  </motion.p>
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                    }}
                  >
                    By combining heavily curated AI rendering with aggressive performance engineering, we've successfully bridged the gap between rapid creative visions and final, flawless exports.
                  </motion.p>
                </div>
              </motion.div>
            </div>


            {/* ── RIGHT: CINEMATIC VISUAL BLOCK ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/4] sm:aspect-[4/3] lg:aspect-square max-w-[600px] mx-auto lg:ml-auto group cursor-default perspective-1000"
            >
              <Tilt 
                tiltMaxAngleX={4} 
                tiltMaxAngleY={4} 
                glareEnable={true} 
                glareMaxOpacity={0.15} 
                glarePosition="all"
                scale={1.02} 
                transitionSpeed={2500} 
                className="w-full h-full relative z-10"
              >
                {/* Glassmorphism Card Base */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ 
                    borderRadius: '2.5rem', 
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.7), rgba(239,248,246,0.4))', 
                    backdropFilter: 'blur(30px) saturate(2)', 
                    WebkitBackdropFilter: 'blur(30px) saturate(2)', 
                    border: '1px solid rgba(255,255,255,0.8)', 
                    boxShadow: '0 30px 80px rgba(4,47,34,0.08), inset 0 2px 0 rgba(255,255,255,1), inset 0 0 40px rgba(32,201,151,0.05)' 
                  }}
                >
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#042f22 1px, transparent 1px), linear-gradient(90deg, #042f22 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
                  
                  {/* Internal Glow Blob */}
                  <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(32,201,151,0.2)_0%,transparent_70%)] pointer-events-none group-hover:scale-110 group-hover:opacity-80 transition-all duration-1000 ease-out" />
                </div>

                {/* 3D Cinematic Orb Container */}
                <div className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                  <StoryVisualOrb />
                </div>

                {/* Floating Elements / Iconography */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <motion.div 
                    className="relative"
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-[#20C997] blur-[40px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-700" />
                    <span className="text-[90px] sm:text-[110px] md:text-[140px] drop-shadow-[0_20px_40px_rgba(4,47,34,0.15)] select-none block transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6">
                      🎬
                    </span>
                  </motion.div>
                </div>

                {/* Premium Border Highlight Reveal */}
                <div className="absolute inset-0 rounded-[2.5rem] border border-transparent bg-gradient-to-b from-[#20C997]/0 via-[#20C997]/0 to-[#20C997]/0 group-hover:from-[#20C997]/20 group-hover:via-transparent transition-all duration-700 pointer-events-none mix-blend-overlay" />
              </Tilt>

              {/* External Soft Shadow Base */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/5 blur-[30px] rounded-full pointer-events-none group-hover:w-[90%] group-hover:bg-black/10 transition-all duration-700" />
            </motion.div>

          </div>
        </div>
      </section>


      {/* ═══════════════ STATS ═══════════════ */}
      <section className="relative bg-[#042f22] overflow-hidden rounded-[40px] sm:rounded-[60px] z-30 mt-4 sm:mt-8" style={{ boxShadow: '0 -20px 60px rgba(13,124,102,0.12)' }}>
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#20C997]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#20C997]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#20C997]/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-7xl" style={{ margin: "0 auto", padding: "clamp(72px, 8vw, 120px) clamp(28px, 6vw, 80px)" }}>
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center"
            style={{ marginBottom: "clamp(48px, 5vw, 72px)" }}
          >
            <motion.p variants={fadeUp} className="text-[#20C997] font-semibold tracking-[0.2em] text-[11px] uppercase" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", marginBottom: "16px" }}>
              Our Impact
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.02em] text-white"
              style={{ fontFamily: 'var(--font-heading)', marginBottom: "16px" }}
            >
              Numbers That Speak
            </motion.h2>
            <motion.div variants={fadeUp} className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#20C997] to-transparent mx-auto rounded-full" />
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "clamp(16px, 2vw, 28px)" }}>
            {STATS_DATA.map((stat, idx) => (
              <Tilt key={idx} tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable={true} glareMaxOpacity={0.15} scale={1.05} transitionSpeed={1500} className="h-full rounded-[2rem]">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center h-full rounded-[2rem] border hover:bg-white/[0.1] transition-all duration-500 group"
                  style={{ padding: "clamp(32px, 5vw, 48px) clamp(24px, 3vw, 40px)", background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', backdropFilter: 'blur(20px) saturate(1.5)', WebkitBackdropFilter: 'blur(20px) saturate(1.5)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 12px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)' }}
                >
                  <div
                    className="font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-[#20C997] to-[#6ee7b7] group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(32,201,151,0.3)]"
                    style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", letterSpacing: "-0.04em", fontSize: "clamp(3rem, 5vw, 4.5rem)", marginBottom: "12px" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-white/60 font-bold tracking-[0.2em] uppercase text-[11px]"
                    style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════ EXPERTISE BENTO GRID ═══════════════ */}
      <section className="relative bg-[#fbfcfb] overflow-hidden">
        {/* Ambient */}
        <div className="absolute top-[20%] left-[5%] w-[350px] h-[350px] bg-[#20C997]/[0.03] rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-[#065f46]/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-7xl" style={{ margin: "0 auto", padding: "clamp(80px, 10vw, 140px) clamp(28px, 6vw, 80px)" }}>
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="flex flex-col items-center text-center"
            style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}
          >
            <motion.p variants={fadeUp} className="text-[#20C997] font-semibold tracking-[0.2em] text-[11px] uppercase" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", marginBottom: "16px" }}>
              What We Do
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.02em] text-[#042f22]"
              style={{ fontFamily: 'var(--font-heading)', marginBottom: "16px" }}
            >
              Our Capabilities
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-[#94a3b8] max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
              Purpose-built modules designed for massive creative leverage.
            </motion.p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "clamp(16px, 2vw, 24px)" }}>
            {CATEGORIES_DATA.map((cat, i) => (
              <Tilt key={cat.id} tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable={true} glareMaxOpacity={0.08} scale={1.05} transitionSpeed={1500} className="h-full rounded-[1.75rem]">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[1.75rem] glass-card group transition-all duration-500 overflow-hidden relative h-full flex flex-col justify-between aspect-square"
                  style={{ padding: "clamp(24px, 3vw, 32px)" }}
                >
                  {/* Large watermark icon */}
                  <div className="absolute -bottom-4 -right-4 text-[100px] opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none select-none">
                    {cat.icon}
                  </div>

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover:-translate-y-1 transition-transform duration-400"
                    style={{ marginBottom: "auto", background: 'linear-gradient(135deg, rgba(32,201,151,0.08), rgba(13,124,102,0.04))', border: '1px solid rgba(32,201,151,0.15)' }}
                  >
                    {cat.icon}
                  </div>

                  <div className="mt-6">
                    <h3
                      className="text-lg md:text-xl font-bold text-[#042f22] tracking-[-0.01em]"
                      style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", marginBottom: "8px" }}
                    >
                      {cat.title}
                    </h3>

                    <p className="text-[#94a3b8] text-[13px] md:text-sm leading-[1.6]" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                      {cat.description}
                    </p>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="relative bg-white overflow-hidden">
        <div className="w-full max-w-7xl" style={{ margin: "0 auto", padding: "clamp(80px, 10vw, 140px) clamp(28px, 6vw, 80px)" }}>
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="text-center"
            style={{ marginBottom: "clamp(48px, 5vw, 72px)" }}
          >
            <motion.p variants={fadeUp} className="text-[#20C997] font-semibold tracking-[0.2em] text-[11px] uppercase" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", marginBottom: "16px" }}>
              Why Verity
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.02em] text-[#042f22]"
              style={{ fontFamily: 'var(--font-heading)', marginBottom: "16px" }}
            >
              Built for Scale
            </motion.h2>
            <motion.div variants={fadeUp} className="w-12 h-[2px] bg-gradient-to-r from-transparent via-[#20C997] to-transparent mx-auto rounded-full" />
          </motion.div>

          {/* Grid */}
          <div className="grid md:grid-cols-3" style={{ gap: "clamp(16px, 2vw, 28px)" }}>
            {FEATURES_DATA.map((feature, idx) => (
              <Tilt key={idx} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true} glareMaxOpacity={0.06} scale={1.03} transitionSpeed={1500} className="h-full rounded-[1.75rem]">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[1.75rem] glass-card h-full transition-all duration-500"
                  style={{ padding: "clamp(28px, 3vw, 40px)" }}
                >
                  <div className="text-3xl" style={{ marginBottom: "20px" }}>{feature.icon}</div>
                  <h3
                    className="text-lg md:text-xl font-bold text-[#042f22] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", marginBottom: "10px" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-[#94a3b8] text-sm md:text-[15px] leading-[1.75]"
                    style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", marginBottom: "28px" }}
                  >
                    {feature.description}
                  </p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-[#475569] font-medium text-[13px] md:text-[14px]" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", gap: "12px" }}>
                        <div className="w-[6px] h-[6px] rounded-full bg-[#20C997] flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative bg-[#fbfcfb]">
        <div className="w-full max-w-7xl" style={{ margin: "0 auto", padding: "clamp(60px, 8vw, 100px) clamp(28px, 6vw, 80px) clamp(80px, 10vw, 140px)" }}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#042f22] overflow-hidden group"
            style={{ borderRadius: "2.5rem" }}
          >
            {/* Decorative */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#20C997]/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-[#20C997]/10 rounded-full blur-[80px] pointer-events-none" />
            {/* Animated sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />

            <div
              className="relative z-10 flex flex-col md:flex-row items-center justify-between"
              style={{ padding: "clamp(48px, 6vw, 80px) clamp(32px, 5vw, 72px)", gap: "clamp(32px, 4vw, 48px)" }}
            >
              {/* Copy */}
              <div className="flex-1 text-center md:text-left">
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-heading)', marginBottom: "16px" }}
                >
                  Ready to roll?
                </h2>
                <p className="text-[#94a3b8] text-sm md:text-base lg:text-lg font-light max-w-md mx-auto md:mx-0 leading-[1.8]" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                  Connect directly with our cinematic engineers. Completely free 30-minute scoping call.
                </p>
              </div>

              {/* Button */}
              <div className="flex-shrink-0">
                <CalendlyButton url="https://calendly.com/akashgupta7484/30min" inline={true} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════ FOOTER (matching main page, without revolving cards) ═══════════════ */}
      <footer className="relative w-full bg-[#fbfcfb] overflow-hidden mt-16 sm:mt-24 md:mt-32 shadow-[0_-20px_60px_rgba(13,124,102,0.08)] rounded-t-[40px] sm:rounded-t-[60px] z-30">
        <div className="relative z-20 w-full bg-[#fbfcfb]">
          {/* Footer links bar */}
          <div
            className="w-full flex flex-col md:flex-row items-center justify-between py-8 pt-16 sm:pt-20 md:pt-24"
            style={{ paddingLeft: 'clamp(16px, 7vw, 7vw)', paddingRight: 'clamp(16px, 7vw, 7vw)' }}
          >
            {/* Left: Social links */}
            <div className="flex items-center gap-7 md:gap-10">
              {["Instagram", "YouTube", "X", "LinkedIn"].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="text-[13px] md:text-[14px] text-[#042f22]/70 font-medium hover:text-[#042f22] transition-colors duration-300"
                >
                  {name}
                </a>
              ))}
            </div>

            {/* Center: Logo */}
            <div className="my-5 md:my-0">
              <div className="w-[48px] h-[48px] rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform shadow-md relative border border-white/60">
                <Image
                  src="/images/logo.jpeg"
                  alt="Verity Logo"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            </div>

            {/* Right: Legal links */}
            <div className="flex items-center gap-7 md:gap-10">
              {["Careers", "Terms", "Privacy"].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="text-[13px] md:text-[14px] text-[#042f22]/70 font-medium hover:text-[#042f22] transition-colors duration-300"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* Brand text spanning full width — like Cosmos */}
          <div className="w-full overflow-hidden pb-6 sm:pb-10 md:pb-14" style={{ paddingLeft: '4vw', paddingRight: '4vw' }}>
            <h1
              className="text-[#042f22] text-[16vw] md:text-[14vw] font-black leading-[0.85] tracking-tighter text-center select-none uppercase"
              style={{ fontFamily: 'var(--font-logo)' }}
            >
              VERITY
            </h1>
          </div>
        </div>
      </footer>

    </main>
  );
}