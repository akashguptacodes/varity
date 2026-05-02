"use client";

import { useRef, useState } from "react";
import Tilt from "react-parallax-tilt";
import {
  motion,
  useMotionValue,
  useTransform,
  wrap,
  useAnimationFrame,
  animate,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import useDeviceDetect from "@/hooks/useDeviceDetect";

const testimonials = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "UX Architect",
    headline: "An Absolute Paradigm Shift in Web Design",
    text: "Verity completely transformed the way our team approaches conceptual design. The fluid interfaces and smooth animations are a game-changer. We've seen a 40% increase in user retention since we integrated their cohesive design system into our core platform. The attention to micro-interactions is unparalleled.",
    company: "Studio Alpha",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Frontend Lead",
    headline: "A Stunning, Seamless Product Experience",
    text: "I've never seen such seamless integration of 3D and DOM elements. It feels like magic. Truly the next generation of web experience. The way they handle complex transitions without compromising on frame rates or performance is nothing short of exceptional. Our developers love working with this architecture.",
    company: "Beta Tech",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Creative Director",
    headline: "A Premium Feel That Commands Attention",
    text: "The level of polish here is unbelievable. From the organic blobs to the crisp typography, every detail screams premium. It gave our brand an entirely new identity that resonates with our high-end clientele. Launching our new site built on Verity's principles was our most successful campaign yet.",
    company: "Gamma Corp",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Product Designer",
    headline: "Intuitive Workflows with Remarkable Results",
    text: "Implementing this into our workflow was intuitive. The results speak for themselves—user engagement is literally off the charts. We finally have a unified visual language that translates perfectly across all devices and screen sizes. It's rare to find a solution that balances aesthetics with robust accessibility.",
    company: "Delta Design",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "David Kim",
    role: "CEO",
    headline: "Elevating Digital Narratives to Art",
    text: "This framework isn't just about making things look pretty; it's about building an interactive narrative that captivates you instantly. It bridges the gap between functional software and digital art. The investment in this level of design maturity has positioned our startup as a serious competitor in the industry.",
    company: "Epsilon Ventures",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
  },
];

const items = [...testimonials, ...testimonials];

export default function TestimonialsSection() {
  const { isMobile } = useDeviceDetect();
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const baseX = useMotionValue(0);
  const itemWidth = 300;
  const slideTargetRef = useRef(null);

  const { ref: inViewRef, inView } = useInView({
    rootMargin: "200px 0px",
  });

  const setRefs = (node) => {
    containerRef.current = node;
    inViewRef(node);
  };



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
      className="relative w-full min-h-[100vh] sm:min-h-[120vh] pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-24 bg-gradient-to-br from-[#fbfcfb] via-[#EFF8F6] to-[#f0f9f6] overflow-hidden flex flex-col items-center justify-start"
    >
      {/* Keyframes and fonts are in globals.css */}

      {/* Additional ambient lights */}
      <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-[#20C997]/5 blur-[100px] rounded-full pointer-events-none transform-gpu" />
      <div className="absolute bottom-[25%] left-[5%] w-[30%] h-[30%] bg-[#0d7c66]/8 blur-[120px] rounded-full pointer-events-none transform-gpu" />

      {/* Header */}
      <div
        className="text-center mb-12 sm:mb-16 md:mb-20 z-20 relative flex flex-col items-center px-4 mt-12 sm:mt-16 lg:mt-40"
      >
        <h2
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d7c66] via-[#20C997] to-[#0d7c66] text-[28px] sm:text-[36px] md:text-[50px] lg:text-[65px] leading-[1.02] tracking-tight mb-4 sm:mb-6 uppercase font-black"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Client Feedback
        </h2>
        <p
          className="text-[#0d7c66] text-[13px] sm:text-[15px] md:text-[17px] lg:text-[20px] uppercase tracking-[0.15em] sm:tracking-[0.25em] font-bold max-w-3xl px-4 sm:px-6 leading-relaxed"
        >
          Industry Leaders Trust Verity
        </p>

        {/* Decorative line */}
        <div
          className="w-24 h-1 bg-gradient-to-r from-[#20C997] to-[#0d7c66] rounded-full mt-8"
        />
      </div>

      {/* Enhanced carousel container with better spacing */}
      <div className="relative flex items-center justify-center w-full max-w-[980px] mx-auto h-[480px] sm:h-[560px] md:h-[620px] z-10 px-4 sm:px-8">

        {/* Left Arrow */}
        <motion.button
          onClick={() => slide(1)}
          className="absolute left-2 sm:left-0 lg:-left-20 z-50 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-[#042f22] transition-all focus:outline-none group"
          style={{ background: 'linear-gradient(135deg, rgba(239,248,246,0.85), rgba(220,242,235,0.7))', backdropFilter: 'blur(16px) saturate(1.5)', WebkitBackdropFilter: 'blur(16px) saturate(1.5)', border: '2px solid rgba(32,201,151,0.25)', boxShadow: '0 8px 32px rgba(13,124,102,0.1), inset 0 1px 0 rgba(255,255,255,0.5)' }}
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

        <div className="relative w-full h-full flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,3%,black_97%,transparent)] rounded-[40px]" ref={setRefs}>
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
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <motion.button
          onClick={() => slide(-1)}
          className="absolute right-2 sm:right-0 lg:-right-20 z-50 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-[#042f22] transition-all focus:outline-none group"
          style={{ background: 'linear-gradient(135deg, rgba(239,248,246,0.85), rgba(220,242,235,0.7))', backdropFilter: 'blur(16px) saturate(1.5)', WebkitBackdropFilter: 'blur(16px) saturate(1.5)', border: '2px solid rgba(32,201,151,0.25)', boxShadow: '0 8px 32px rgba(13,124,102,0.1), inset 0 1px 0 rgba(255,255,255,0.5)' }}
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

const Card = ({ item, index, baseX, totalItems, itemWidth, setIsHovered, isMobile }) => {
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

  return (
    <motion.div
      onMouseEnter={() => setIsHovered?.(true)}
      onMouseLeave={() => setIsHovered?.(false)}
      style={{
        width: typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 380,
        x: xTransform,
        scale,
        opacity,
        zIndex,
        height: typeof window !== 'undefined' && window.innerWidth < 640 ? 420 : 520,
        willChange: "transform, opacity",
      }}
      className="absolute top-4 sm:top-10 transform-gpu flex items-center justify-center"
    >
      <Tilt
        tiltEnable={!isMobile}
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        scale={1.02}
        transitionSpeed={400}
        className="w-full h-full"
      >
        <motion.div
          className="w-full h-full relative rounded-[32px]"
          whileHover={{
            scale: 1.01,
            y: -3
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="absolute inset-0 rounded-[32px]" style={{ background: 'linear-gradient(145deg, rgba(32,201,151,0.06), rgba(13,124,102,0.03))', boxShadow: 'inset 0 0 0 1px rgba(32,201,151,0.1)' }} />

          <div
            className="relative z-10 w-full h-full rounded-[24px] sm:rounded-[32px] flex flex-col justify-between"
            style={{ padding: "clamp(20px, 3vw, 32px)", background: 'linear-gradient(135deg, #ffffff 0%, #f5fbf9 100%)', boxShadow: '0 12px 40px rgba(13,124,102,0.08), inset 0 1px 1px rgba(255,255,255,0.8)', border: '1px solid rgba(32,201,151,0.12)' }}
          >
            <div>
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#20C997]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-[#042f22] font-semibold text-[15px] sm:text-[18px] md:text-[20px] leading-snug mb-3 sm:mb-4">
                "{item.headline}"
              </p>
              <p className="text-gray-600 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed mb-4 sm:mb-8 line-clamp-4 sm:line-clamp-none">
                {item.text}
              </p>
            </div>

            <div className="flex items-center gap-4 border-t border-gray-100 pt-8 mt-10">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
              <div>
                <h4 className="text-[#042f22] font-bold text-[16px] leading-tight font-sans">
                  {item.name}
                </h4>
                <p className="text-[#20C997] text-[13px] font-medium mt-0.5">
                  {item.role} @ {item.company}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Tilt>
    </motion.div>
  );
};
