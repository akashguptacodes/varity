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
    text: "Varity completely transformed the way our team approaches conceptual design. The fluid interfaces and smooth animations are a game-changer.",
    company: "Studio Alpha",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Frontend Lead",
    text: "I've never seen such seamless integration of 3D and DOM elements. It feels like magic. Truly the next generation of web experience.",
    company: "Beta Tech",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Creative Director",
    text: "The level of polish here is unbelievable. From the wobbly organic blobs to the crisp typography, every detail screams premium.",
    company: "Gamma Corp",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Product Designer",
    text: "Implementing this into our workflow was intuitive. The results speak for themselves—user engagement is literally off the charts.",
    company: "Delta Design",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "David Kim",
    role: "CEO",
    text: "This framework isn't just about making things look pretty; it's about building an interactive narrative that captivates you instantly.",
    company: "Epsilon Ventures",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
  },
];

const items = [...testimonials, ...testimonials];

const TestimonialsSection = () => {
  const containerRef = useRef(null);
  const baseX = useMotionValue(0);
  const itemWidth = 220;
  const [setIsHovered] = useState(false);
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
      className="relative w-full h-screen bg-[#fbfcfb] overflow-hidden flex flex-col items-center justify-center border-t border-[#0d7c66]/10"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        @keyframes testimonialFloat {
          0%, 100% { transform: translateY(0px); }
          33% { transform: translateY(-5px); }
          66% { transform: translateY(3px); }
        }
      `}} />

      {/* Decorative Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#EFF8F6] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#20C997]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10 z-20 relative flex flex-col items-center">
        <h2 
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d7c66] to-[#20C997] text-[40px] md:text-[60px] leading-[1.05] tracking-tight mb-4 uppercase"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Client Feedback
        </h2>
        <p className="text-[#0d7c66] text-[16px] md:text-[18px] uppercase tracking-[0.2em] font-extrabold max-w-2xl px-4">
          Industry Leaders Trust Varity
        </p>
      </div>

      {/* Reduced width container to properly frame the 3 cards and keep arrows outside */}
      <div className="relative flex items-center justify-center w-full max-w-[850px] mx-auto h-[550px] z-10 px-4">
        
        {/* Left Arrow */}
        <button
          onClick={() => slide(1)}
          className="absolute left-0 lg:-left-12 z-50 w-14 h-14 bg-white border border-[#20C997]/30 rounded-full flex items-center justify-center text-[#042f22] shadow-[0_10px_40px_rgba(4,47,34,0.15)] hover:scale-110 hover:bg-[#EFF8F6] hover:border-[#0d7c66]/50 transition-all focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative w-full h-full flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,2%,black_98%,transparent)]" ref={containerRef}>
          <div className="relative w-full h-full flex items-center justify-center">
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
        <button
          onClick={() => slide(-1)}
          className="absolute right-0 lg:-right-12 z-50 w-14 h-14 bg-white border border-[#20C997]/30 rounded-full flex items-center justify-center text-[#042f22] shadow-[0_10px_40px_rgba(4,47,34,0.15)] hover:scale-110 hover:bg-[#EFF8F6] hover:border-[#0d7c66]/50 transition-all focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
      {/* Floating + tilt wrapper */}
      <div
        className="w-full h-full flex flex-col justify-between bg-white border border-[#20C997]/20 rounded-[30px] shadow-[0_30px_60px_-15px_rgba(4,47,34,0.2)] p-8 md:p-10"
        style={{
          animation: `testimonialFloat 5s ease-in-out infinite`,
          animationDelay: floatDelay,
          transform: `rotate(${staticTilt}deg)`,
        }}
      >
        {/* Decorative Quote Mark */}
        <span 
          className="absolute top-6 right-8 text-[#20C997] opacity-[0.15] text-[120px] leading-none font-serif select-none pointer-events-none"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          &rdquo;
        </span>

        {/* Top Section: Stars & Quote */}
        <div className="relative z-10 flex flex-col gap-6">
          {/* Star Rating */}
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-[#20C997]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <p className="text-[#042f22] font-semibold leading-[1.7] text-[16px] md:text-[18px]">
            "{item.text}"
          </p>
        </div>

        {/* Bottom Section: Profile */}
        <div className="relative z-10 flex items-center gap-4 mt-6 pt-6 border-t border-[#0d7c66]/10">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#20C997] shadow-lg shrink-0">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h4 
              className="text-[#042f22] font-bold text-[18px] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.name}
            </h4>
            <p className="text-[#0d7c66] font-semibold text-[13px] mt-0.5">
              {item.role} <span className="opacity-60 text-xs px-1">•</span> {item.company}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
