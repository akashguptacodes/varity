"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import CalendlyButton from "@/components/CalendlyButton";
import Tilt from "react-parallax-tilt";

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

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pointer-events-auto"
        style={{ padding: "24px clamp(28px, 6vw, 80px)" }}
      >
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-[44px] h-[44px] bg-[#0d7c66] rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform shadow-md">
            <span
              className="text-white text-[22px] italic font-bold pr-0.5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              V
            </span>
          </div>
        </a>
        <a
          href="/"
          className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[#042f22]/60 hover:text-[#042f22] transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          ← Back to Home
        </a>
      </motion.nav>


      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#20C997]/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#042f22]/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[30%] left-[15%] w-[200px] h-[200px] bg-[#20C997]/[0.04] rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          style={{ y: heroY, margin: "0 auto", padding: "0 clamp(28px, 6vw, 80px)" }}
          className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 rounded-full bg-white border border-[#20C997]/15 shadow-[0_2px_16px_rgba(32,201,151,0.08)]"
            style={{ padding: "10px 22px", marginBottom: "48px" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#20C997] animate-pulse" />
            <span className="text-[#0d9488] font-semibold tracking-[0.15em] text-[11px] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
              Elevating Visual Storytelling
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[3.2rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] font-black tracking-[-0.03em] text-[#042f22] leading-[0.95]"
            style={{ fontFamily: "'Playfair Display', serif", marginBottom: "36px" }}
          >
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20C997] to-[#065f46]">
              Verity
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#64748b] leading-[1.85] max-w-2xl mx-auto font-light"
            style={{ fontFamily: "'Inter', sans-serif", marginBottom: "20px" }}
          >
            Revolutionizing video creation through AI-powered tools and cinematic expertise. We empower creators to tell compelling stories with professional-grade polish.
          </motion.p>

          {/* Decorative accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-[3px] bg-gradient-to-r from-[#20C997] to-transparent rounded-full origin-center"
            style={{ marginBottom: "48px" }}
          />

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-[#042f22]/15 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-[#20C997]"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>


      {/* ═══════════════ OUR STORY ═══════════════ */}
      <section className="relative bg-white border-t border-[#042f22]/[0.04]">
        <div className="w-full max-w-7xl" style={{ margin: "0 auto", padding: "clamp(80px, 10vw, 140px) clamp(28px, 6vw, 80px)" }}>
          <div className="grid lg:grid-cols-2 items-center" style={{ gap: "clamp(48px, 6vw, 100px)" }}>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[#20C997] font-semibold tracking-[0.2em] text-[11px] uppercase" style={{ fontFamily: "'Inter', sans-serif", marginBottom: "16px" }}>
                Our Story
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-[3.25rem] font-bold text-[#042f22] leading-[1.12] tracking-[-0.02em]"
                style={{ fontFamily: "'Playfair Display', serif", marginBottom: "28px" }}
              >
                Born from a Passion<br className="hidden lg:block" /> for Cinema
              </h2>

              <div className="w-14 h-[3px] bg-gradient-to-r from-[#20C997] to-transparent rounded-full" style={{ marginBottom: "32px" }} />

              <div className="text-[#64748b] text-base lg:text-[17px] leading-[1.9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <p style={{ marginBottom: "20px" }}>
                  Verity was founded with a singular mission: to democratize Hollywood-tier video creation. Every story deserves to be heard with cinematic authority.
                </p>
                <p>
                  Combining heavily curated AI rendering with aggressive performance engineering, we've bridged the gap between rapid creative visions and final, flawless exports.
                </p>
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-[4/3] max-w-[520px] mx-auto lg:mx-0 lg:ml-auto rounded-[2.5rem] bg-gradient-to-br from-[#f1f5f9] to-[#e8ede9] border border-[#e2e8f0]/60 shadow-[0_12px_40px_rgba(0,0,0,0.04)] flex justify-center items-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(32,201,151,0.1)_0%,transparent_70%)] pointer-events-none" />
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #042f22 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="text-[100px] md:text-[140px] drop-shadow-lg opacity-80 select-none">🎬</div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ═══════════════ STATS ═══════════════ */}
      <section className="relative bg-[#042f22] overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#20C997]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#20C997]/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-7xl" style={{ margin: "0 auto", padding: "clamp(72px, 8vw, 120px) clamp(28px, 6vw, 80px)" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center"
            style={{ marginBottom: "clamp(48px, 5vw, 72px)" }}
          >
            <p className="text-[#20C997] font-semibold tracking-[0.2em] text-[11px] uppercase" style={{ fontFamily: "'Inter', sans-serif", marginBottom: "16px" }}>
              Our Impact
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.02em] text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Numbers That Speak
            </h2>
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
                  className="flex flex-col items-center justify-center h-full rounded-[2rem] bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.1] transition-all duration-500 group"
                  style={{ padding: "clamp(32px, 5vw, 48px) clamp(24px, 3vw, 40px)" }}
                >
                  <div
                    className="font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-[#20C997] to-[#6ee7b7] group-hover:scale-110 transition-transform duration-500"
                    style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.04em", fontSize: "clamp(3rem, 5vw, 4.5rem)", marginBottom: "12px" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-white/50 font-semibold tracking-[0.2em] uppercase text-[11px]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
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
      <section className="relative bg-[#fbfcfb]">
        <div className="w-full max-w-7xl" style={{ margin: "0 auto", padding: "clamp(80px, 10vw, 140px) clamp(28px, 6vw, 80px)" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center text-center"
            style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}
          >
            <p className="text-[#20C997] font-semibold tracking-[0.2em] text-[11px] uppercase" style={{ fontFamily: "'Inter', sans-serif", marginBottom: "16px" }}>
              What We Do
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.02em] text-[#042f22]"
              style={{ fontFamily: "'Playfair Display', serif", marginBottom: "16px" }}
            >
              Our Capabilities
            </h2>
            <p className="text-base md:text-lg text-[#94a3b8] max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Purpose-built modules designed for massive creative leverage.
            </p>
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
                  className="bg-white rounded-[1.75rem] border border-[#042f22]/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group transition-all duration-500 overflow-hidden relative h-full flex flex-col justify-between aspect-square"
                  style={{ padding: "clamp(24px, 3vw, 32px)" }}
                >
                  {/* Large watermark icon */}
                  <div className="absolute -bottom-4 -right-4 text-[100px] opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none select-none">
                    {cat.icon}
                  </div>

                  <div
                    className="w-12 h-12 rounded-xl bg-[#f8fafc] border border-[#042f22]/[0.05] flex items-center justify-center text-xl group-hover:-translate-y-1 transition-transform duration-400"
                    style={{ marginBottom: "auto" }}
                  >
                    {cat.icon}
                  </div>

                  <div className="mt-6">
                    <h3
                      className="text-lg md:text-xl font-bold text-[#042f22] tracking-[-0.01em]"
                      style={{ fontFamily: "'Inter', sans-serif", marginBottom: "8px" }}
                    >
                      {cat.title}
                    </h3>

                    <p className="text-[#94a3b8] text-[13px] md:text-sm leading-[1.6]" style={{ fontFamily: "'Inter', sans-serif" }}>
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
      <section className="relative bg-white border-t border-[#042f22]/[0.04]">
        <div className="w-full max-w-7xl" style={{ margin: "0 auto", padding: "clamp(80px, 10vw, 140px) clamp(28px, 6vw, 80px)" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center"
            style={{ marginBottom: "clamp(48px, 5vw, 72px)" }}
          >
            <p className="text-[#20C997] font-semibold tracking-[0.2em] text-[11px] uppercase" style={{ fontFamily: "'Inter', sans-serif", marginBottom: "16px" }}>
              Why Verity
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-[3.25rem] font-bold tracking-[-0.02em] text-[#042f22]"
              style={{ fontFamily: "'Playfair Display', serif", marginBottom: "16px" }}
            >
              Built for Scale
            </h2>
            <div className="w-12 h-[3px] bg-gradient-to-r from-[#20C997] to-transparent mx-auto rounded-full" />
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
                  className="bg-[#fbfcfb] rounded-[1.75rem] border border-[#042f22]/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] h-full transition-all duration-500"
                  style={{ padding: "clamp(28px, 3vw, 40px)" }}
                >
                  <div className="text-3xl" style={{ marginBottom: "20px" }}>{feature.icon}</div>
                  <h3
                    className="text-lg md:text-xl font-bold text-[#042f22] tracking-[-0.01em]"
                    style={{ fontFamily: "'Inter', sans-serif", marginBottom: "10px" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-[#94a3b8] text-sm md:text-[15px] leading-[1.75]"
                    style={{ fontFamily: "'Inter', sans-serif", marginBottom: "28px" }}
                  >
                    {feature.description}
                  </p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-[#475569] font-medium text-[13px] md:text-[14px]" style={{ fontFamily: "'Inter', sans-serif", gap: "12px" }}>
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative bg-[#042f22] overflow-hidden"
            style={{ borderRadius: "2.5rem" }}
          >
            {/* Decorative */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#20C997]/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-[#20C997]/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

            <div
              className="relative z-10 flex flex-col md:flex-row items-center justify-between"
              style={{ padding: "clamp(48px, 6vw, 80px) clamp(32px, 5vw, 72px)", gap: "clamp(32px, 4vw, 48px)" }}
            >
              {/* Copy */}
              <div className="flex-1 text-center md:text-left">
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.15] tracking-[-0.02em]"
                  style={{ fontFamily: "'Playfair Display', serif", marginBottom: "16px" }}
                >
                  Ready to roll?
                </h2>
                <p className="text-[#94a3b8] text-sm md:text-base lg:text-lg font-light max-w-md mx-auto md:mx-0 leading-[1.8]" style={{ fontFamily: "'Inter', sans-serif" }}>
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


      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="relative bg-white border-t border-[#042f22]/[0.04]">
        <div
          className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between"
          style={{ margin: "0 auto", padding: "clamp(24px, 3vw, 40px) clamp(28px, 6vw, 80px)" }}
        >
          <p className="text-[#94a3b8] text-[13px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            © {new Date().getFullYear()} Verity. All rights reserved.
          </p>
          <div className="flex items-center" style={{ gap: "clamp(20px, 3vw, 36px)", marginTop: "12px" }}>
            {["Instagram", "YouTube", "LinkedIn"].map((name) => (
              <a
                key={name}
                href="#"
                className="text-[13px] text-[#042f22]/50 font-medium hover:text-[#042f22] transition-colors duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </main>
  );
}