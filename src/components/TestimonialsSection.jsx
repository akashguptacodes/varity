"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  wrap,
  animate,
} from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "UX Architect",
    headline: "The Best Solar Company We’ve Ever Worked With",
    text: "Verity completely transformed the way our team approaches conceptual design. The fluid interfaces and smooth animations are a game-changer.",
    company: "Studio Alpha",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Frontend Lead",
    headline: "A Stunning, Seamless Product Experience",
    text: "I've never seen such seamless integration of 3D and DOM elements. It feels like magic. Truly the next generation of web experience.",
    company: "Beta Tech",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Creative Director",
    headline: "The Best Solar Company We’ve Ever Worked With",
    text: "The level of polish here is unbelievable. From the wobbly organic blobs to the crisp typography, every detail screams premium.",
    company: "Gamma Corp",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Product Designer",
    headline: "The Best Solar Company We’ve Ever Worked With",
    text: "Implementing this into our workflow was intuitive. The results speak for themselves—user engagement is literally off the charts.",
    company: "Delta Design",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "David Kim",
    role: "CEO",
    headline: "The Best Solar Company We’ve Ever Worked With",
    text: "This framework isn't just about making things look pretty; it's about building an interactive narrative that captivates you instantly.",
    company: "Epsilon Ventures",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
  },
];

const items = [...testimonials, ...testimonials];

const TestimonialsSection = () => {
  const containerRef = useRef(null);
  const baseX = useMotionValue(0);
  const itemWidth = 300;
  const [isHovered, setIsHovered] = useState(false);
  const slideTargetRef = useRef(null);

  const slide = (direction) => {
    // Resolve intended destination cleanly to allow rapid stacking
    const currentAnchor = slideTargetRef.current !== null 
      ? slideTargetRef.current 
      : Math.round(baseX.get() / itemWidth) * itemWidth;

    const targetX = currentAnchor + direction * itemWidth;
    slideTargetRef.current = targetX;

    animate(baseX, targetX, {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1], 
      onComplete: () => {
        slideTargetRef.current = null;
      }
    });
  };

  return (
    <section
      className="relative w-full h-screen mt-32 lg:mt-48 bg-gradient-to-br from-[#fbfcfb] via-[#EFF8F6] to-[#f0f9f6] overflow-hidden flex flex-col items-center justify-center border-t border-[#0d7c66]/15"
    >
      {/* Keyframes and fonts are in globals.css */}

      {/* Enhanced Decorative Lights */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-gradient-radial from-[#20C997]/20 via-[#EFF8F6]/30 to-transparent blur-[180px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-gradient-radial from-[#0d7c66]/15 via-[#20C997]/10 to-transparent blur-[160px] rounded-full pointer-events-none" style={{ animation: 'gentleGlow 8s ease-in-out infinite' }} />
      
      {/* Additional ambient lights */}
      <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-[#20C997]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[25%] left-[5%] w-[30%] h-[30%] bg-[#0d7c66]/8 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <motion.div 
        className="text-center mb-16 z-20 relative flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d7c66] via-[#20C997] to-[#0d7c66] text-[45px] md:text-[65px] leading-[1.02] tracking-tight mb-6 uppercase font-black"
          style={{ fontFamily: "'Playfair Display', serif" }}
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Client Feedback
        </motion.h2>
        <motion.p 
          className="text-[#0d7c66] text-[17px] md:text-[20px] uppercase tracking-[0.25em] font-bold max-w-3xl px-6 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Industry Leaders Trust Verity
        </motion.p>
        
        {/* Decorative line */}
        <motion.div 
          className="w-24 h-1 bg-gradient-to-r from-[#20C997] to-[#0d7c66] rounded-full mt-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        />
      </motion.div>

      {/* Enhanced carousel container with better spacing */}
      <div className="relative flex items-center justify-center w-full max-w-[980px] mx-auto h-[620px] z-10 px-8">
        
        {/* Left Arrow */}
        <motion.button
          onClick={() => slide(1)}
          className="absolute left-0 lg:-left-20 z-50 w-16 h-16 bg-gradient-to-br from-white to-[#EFF8F6] border-2 border-[#20C997]/40 rounded-full flex items-center justify-center text-[#042f22] shadow-[0_15px_40px_rgba(4,47,34,0.2)] hover:shadow-[0_20px_50px_rgba(4,47,34,0.3)] transition-all focus:outline-none group"
          whileHover={{ 
            scale: 1.1,
            background: "linear-gradient(135deg, #EFF8F6 0%, #20C997 100%)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-7 h-7 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        <div className="relative w-full h-full flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,3%,black_97%,transparent)] rounded-[40px]" ref={containerRef}>
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {items.map((item, index) => (
            <Card
              key={`${item.id}-${index}`}
              item={item}
              index={index}
              baseX={baseX}
              totalItems={items.length}
              itemWidth={itemWidth}
              setIsHovered={setIsHovered}
            />
          ))}
          </div>
        </div>

        {/* Right Arrow */}
        <motion.button
          onClick={() => slide(-1)}
          className="absolute right-0 lg:-right-20 z-50 w-16 h-16 bg-gradient-to-br from-white to-[#EFF8F6] border-2 border-[#20C997]/40 rounded-full flex items-center justify-center text-[#042f22] shadow-[0_15px_40px_rgba(4,47,34,0.2)] hover:shadow-[0_20px_50px_rgba(4,47,34,0.3)] transition-all focus:outline-none group"
          whileHover={{ 
            scale: 1.1,
            background: "linear-gradient(135deg, #EFF8F6 0%, #20C997 100%)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-7 h-7 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </section>
  );
};

const Card = ({ item, index, baseX, totalItems, itemWidth, setIsHovered }) => {
  const totalWidth = itemWidth * totalItems;

  const xTransform = useTransform(baseX, (v) => {
    const rawPos = v + index * itemWidth;
    return wrap(-itemWidth * 2, totalWidth - itemWidth * 2, rawPos);
  });

  // Restrict the visible range strictly to the 3 main cards
  const distanceRange = [-itemWidth * 1.35, -itemWidth, 0, itemWidth, itemWidth * 1.35];

  const scale = useTransform(xTransform, distanceRange, [0.7, 0.85, 1, 0.85, 0.7]);
  const opacity = useTransform(xTransform, distanceRange, [0, 0.9, 1, 0.9, 0]);
  const zIndex = useTransform(xTransform, distanceRange, [0, 10, 50, 10, 0]);
  // Cards are flat — no rotateY tilt for behind cards, they stay straight on screen
  
  // Subtle floating animation delay per card
  const floatDelay = `${(index % 5) * -0.8}s`;
  // Subtle static tilt per card — just a tiny lean for visual variety
  const staticTilt = ((index % 5) - 2) * 0.8; // range: -1.6 to 1.6 degrees

  return (
    <motion.div
      onMouseEnter={() => setIsHovered?.(true)}
      onMouseLeave={() => setIsHovered?.(false)}
      style={{
        width: 380,
        x: xTransform,
        scale,
        opacity,
        zIndex,
        height: 480, 
        willChange: "transform, opacity", 
      }}
      className="absolute top-10 transform-gpu"
    >
      {/* Enhanced card with gradient background and improved shadows */}
      <motion.div
        className="w-full h-full p-4 relative overflow-hidden"
        style={{
          animation: `testimonialFloat 6s ease-in-out infinite`,
          animationDelay: floatDelay,
          transform: `rotate(${staticTilt}deg)`,
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 40px 100px -30px rgba(4,47,34,0.25), 0 0 0 1px rgba(32,201,151,0.16)"
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white to-[#F4FCF8] shadow-[inset_0_0_0_1px_rgba(32,201,151,0.08)]" />

        <div className="relative z-10 h-full rounded-[28px] border border-[#20C997]/15 bg-white p-7 lg:p-8 shadow-[0_18px_50px_-25px_rgba(4,47,34,0.2)] flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#20C997]/15 shadow-[0_10px_25px_rgba(32,201,151,0.14)]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[#042f22] font-bold text-[20px] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {item.name}
                </h4>
                <p className="text-[#0d7c66] text-[14px] font-semibold">
                  {item.role}
                </p>
              </div>
            </div>
            <button className="w-11 h-11 rounded-full bg-[#F8FAF8] border border-[#20C997]/20 flex items-center justify-center text-[#0d7c66] hover:bg-[#EFF8F6] transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6L18 18" />
              </svg>
            </button>
          </div>

          <div className="rounded-[26px] border border-[#20C997]/15 bg-[#F8FBF9] p-6">
            <p className="text-[#042f22] font-semibold text-[22px] md:text-[24px] leading-tight tracking-tight">
              {item.headline}
            </p>
          </div>

          <div className="flex-1 rounded-[22px] bg-[#F7FDF7] p-5">
            <p className="text-[#334E3A] text-[15px] md:text-[16px] leading-[1.9]">
              {item.text}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#20C997]/15 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-[#F59E0B]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[#0d7c66] text-[14px] font-semibold">
              4.9 Star Ratings on Google
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestimonialsSection;
