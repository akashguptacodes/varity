"use client";

import { motion, useScroll, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { getComplexColumns, getThumbnailUrl } from "@/lib/videoUtils";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const CATEGORIES = [
  { id: 1, title: 'AI Videos', image: '/images/AIVideoEditing.jpeg' },
  { id: 2, title: 'Explainer', image: '/images/Explainer.png' },
  { id: 3, title: 'Posters', image: '/images/GraphicDesign.jpeg' },
  { id: 4, title: 'Talking Head', image: '/images/RawVideoEditing.jpeg' }
];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = parseInt(params.categoryId, 10);
  const cat = CATEGORIES.find(c => c.id === categoryId);

  const overlayRef = useRef(null);
  const [scrollContainer, setScrollContainer] = useState(null);
  const [centerModalVideo, setCenterModalVideo] = useState(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    setScrollContainer(overlayRef.current);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Lock body scroll when internal detail is open
  useEffect(() => {
    if (centerModalVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [centerModalVideo]);

  // Scroll-linked parallax inside the overlay (smooth + works both directions)
  const { scrollYProgress } = useScroll();

  if (!cat) return <div className="min-h-screen bg-white flex items-center justify-center">Category not found</div>;

  const columns = getComplexColumns(cat.id);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#fbfcfb] relative overflow-hidden"
    >
      <MovingSoul />


      {/* ── MASTER PADDING WRAPPER ── */}
      <div
        className="w-full min-h-screen relative z-10"
        style={{ paddingLeft: "clamp(1rem, 3vw, 2rem)", paddingRight: "clamp(1rem, 3vw, 2rem)", paddingTop: "max(120px, 12vh)" }}
      >
        {/* ── Hero Header ── left-aligned with proper margins ── */}
        <div className="w-full pb-2 relative z-[60] flex flex-col items-start justify-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[700px] flex flex-col items-start"
            style={{ paddingLeft: "clamp(1rem, 1vw, 1rem)", paddingTop: "0" }}
          >
            <motion.h1
              layoutId={`card-title-${cat.id}`}
              className="text-[#042f22] text-[22px] sm:text-[28px] md:text-[42px] lg:text-[48px] tracking-tight leading-[1.05] font-bold text-left drop-shadow-sm"
              style={{ fontFamily: 'var(--font-heading)', marginBottom: "0.75rem" }}
            >
              A Unified Platform For Cinematic Stories
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.9 }}
              className="text-[#4b5563] text-[15px] md:text-[17px] leading-[1.7] font-normal max-w-[550px] text-left"
              style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif", marginBottom: "1.75rem" }}
            >
              Revolutionize your production engine. We empower creators to grade, assemble, and master their visual narratives — all within a single high-performance pipeline.
            </motion.p>

            {/* Decorative accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-24 h-[3px] origin-left rounded-full"
              style={{ background: "linear-gradient(90deg, #20C997 0%, transparent 100%)" }}
            />
          </motion.div>
        </div>

        {/* ── Parallax Bento Grid ── */}
        <div className="relative w-full max-w-[1800px] pb-[100px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-2 md:gap-4 lg:gap-5 xl:gap-8 items-start">
            {columns.map((col, ci) => (
              <div
                key={ci}
                className={`flex flex-col gap-3 sm:gap-2 md:gap-4 lg:gap-5 xl:gap-8 ${ci === 0 ? "sm:col-span-2 md:col-span-2" : "col-span-1"}`}
                style={{ paddingTop: col.offsetTop }}
              >
                <ParallaxColumnWrapper scrollYProgress={scrollYProgress} speed={col.speed}>
                  {col.items.map((item, i) => {
                    if (item.type === 'pair') {
                      return (
                        <div key={item.id} className="grid grid-cols-2 gap-2 md:gap-4 lg:gap-5 xl:gap-8 w-full">
                          <div className="w-full relative z-10 flex flex-col items-center">
                            <FloatingCard
                              card={item.pair[0]}
                              enterDelay={ci * 0.08 + i * 0.12}
                              onCardClick={setCenterModalVideo}
                            />
                          </div>
                          <div className="w-full relative z-10 flex flex-col items-center">
                            <FloatingCard
                              card={item.pair[1]}
                              enterDelay={ci * 0.08 + (i + 0.5) * 0.12}
                              onCardClick={setCenterModalVideo}
                            />
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={item.id} className="w-full relative z-10 flex flex-col items-center">
                          <FloatingCard
                            card={item.card}
                            enterDelay={ci * 0.08 + i * 0.12}
                            onCardClick={setCenterModalVideo}
                          />
                        </div>
                      );
                    }
                  })}
                </ParallaxColumnWrapper>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* ── Centered Hover Modal ── */}
      <AnimatePresence>
        {centerModalVideo && (
          <CenterHoverModal
            video={centerModalVideo}
            onClose={() => setCenterModalVideo(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FloatingCard({ card, enterDelay, onCardClick }) {
  const video = card;
  const isSlideshow = video.isSlideshow;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isSlideshow && video.images && video.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % video.images.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isSlideshow, video]);

  let thumbUrl = "";
  if (isSlideshow && video.images && video.images.length > 0) {
    thumbUrl = getThumbnailUrl({ thumbnail: video.images[currentIndex] });
  } else {
    thumbUrl = getThumbnailUrl(video);
  }

  return (
    <motion.div
      className="relative z-10 w-full rounded-[16px] sm:rounded-[20px] overflow-hidden bg-black cursor-pointer transform-gpu"
      style={{ height: card.height, willChange: "transform, opacity", border: '2.5px solid rgba(32,201,151,0.3)', boxShadow: '0 8px 32px -6px rgba(13,124,102,0.15), 0 0 0 4px rgba(32,201,151,0.06)' }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: enterDelay, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onCardClick(video)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03, boxShadow: '0 20px 60px -10px rgba(13,124,102,0.25), 0 0 0 4px rgba(32,201,151,0.12)' }}
    >
      <motion.div layoutId={`hover-card-${video.id}`} className="w-full h-full relative group">
        <AnimatePresence>
          <motion.img
            key={thumbUrl}
            src={thumbUrl}
            loading="lazy"
            decoding="async"
            alt={video.title}
            referrerPolicy="no-referrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-fill group-hover:scale-105 transition-transform duration-700"
            style={{ objectFit: "fill" }}
          />
        </AnimatePresence>

        {/* Video Autoplay on Hover */}
        {isHovered && !isSlideshow && !video.isImage && (
          <div className="absolute inset-0 z-15 bg-black pointer-events-none">
            <iframe
              src={`${video.src}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
              className="absolute inset-0 w-full h-full object-fill"
              style={{ border: 'none', objectFit: 'fill' }}
              allow="autoplay; encrypted-media"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#042f22]/60 via-[#042f22]/10 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500 z-10 pointer-events-none" />
        <motion.div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none" style={{ padding: 'clamp(10px, 1.8vw, 20px) clamp(12px, 2.2vw, 24px)', background: 'linear-gradient(to top, rgba(4,47,34,0.55) 0%, rgba(4,47,34,0.2) 50%, transparent 100%)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <h4 className="text-white text-[14px] sm:text-[17px] md:text-[20px] font-bold tracking-tight drop-shadow-md" style={{ fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            {video.title}
          </h4>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ParallaxColumnWrapper({ children, scrollYProgress, speed }) {
  const rawShift = useTransform(scrollYProgress, (p) => {
    return p * speed * 500;
  });

  const smoothShift = useSpring(rawShift, { stiffness: 200, damping: 40, mass: 0.5 });

  return (
    <motion.div
      style={{ y: smoothShift, willChange: "transform" }}
      className="flex flex-col gap-2 md:gap-4 lg:gap-5 xl:gap-8 w-full transform-gpu"
    >
      {children}
    </motion.div>
  );
}

function CenterHoverModal({ video, onClose }) {
  const isImageOrSlideshow = video.isImage || video.isSlideshow;
  const [currentIndex, setCurrentIndex] = useState(0);
  const isExpandDown = video.expandir === 'down';

  useEffect(() => {
    if (video.isSlideshow && video.images && video.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % video.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [video]);

  let currentMediaSrc = "";
  if (video.isSlideshow && video.images && video.images.length > 0) {
    currentMediaSrc = getThumbnailUrl({ thumbnail: video.images[currentIndex] });
  } else if (video.isImage) {
    currentMediaSrc = getThumbnailUrl(video);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 md:p-8 pointer-events-auto glass-strong"
      initial={{ backgroundColor: "rgba(4,47,34,0)" }}
      animate={{ backgroundColor: "rgba(4,47,34,0.35)" }}
      exit={{ backgroundColor: "rgba(4,47,34,0)", transition: { duration: 0.15 } }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`hover-card-${video.id}`}
        className={`relative rounded-[20px] sm:rounded-[32px] md:rounded-[40px] flex flex-col ${!isExpandDown ? 'md:flex-row' : ''} p-4 sm:p-6 gap-4 sm:gap-8 md:gap-12 glass-modal`}
        style={{
          width: "1150px",
          maxWidth: "95vw",
          maxHeight: "90vh",
          height: isExpandDown ? "auto" : undefined,
          minHeight: isExpandDown ? "auto" : "min(75vh, 600px)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-[170] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[#042f22] hover:text-white active:text-white transition-all group glass-card hover:bg-gradient-to-br hover:from-[#0d7c66] hover:to-[#20C997]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-90 transition-transform duration-300"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className={`${isExpandDown ? 'w-full h-[200px] sm:h-[300px] md:h-[400px]' : 'w-full md:w-[50%] min-h-[250px] sm:min-h-[350px] md:min-h-[400px]'} relative bg-black shrink-0 overflow-hidden rounded-[16px] sm:rounded-[24px] md:rounded-[32px] shadow-lg group`} style={{ flex: isExpandDown ? undefined : '1 1 auto' }}>
          {isImageOrSlideshow ? (
            <AnimatePresence>
              <motion.img
                key={currentMediaSrc}
                src={currentMediaSrc}
                alt={video.title}
                referrerPolicy="no-referrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-fill"
                style={{ objectFit: "fill" }}
              />
            </AnimatePresence>
          ) : (
            <iframe
              src={`${video.src}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
              className="absolute inset-0 w-full h-full object-fill"
              style={{ objectFit: 'fill' }}
              loading="lazy"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={video.title}
            />
          )}
        </div>

        <div className={`${isExpandDown ? 'w-full' : 'w-full md:w-[50%]'} flex flex-col justify-center`} style={{
          fontFamily: "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif",
          padding: isExpandDown ? 'clamp(16px, 3vw, 32px)' : 'clamp(16px, 3vw, 32px) clamp(16px, 5vw, 80px)',
        }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-subtle">
              <div className="w-2.5 h-2.5 rounded-full bg-[#20C997] animate-pulse" style={{ boxShadow: "0 0 12px rgba(32,201,151,0.6)" }} />
              <span className="text-[#0d7c66] text-[10px] uppercase tracking-[0.25em] font-black">
                Preview
              </span>
            </div>
          </div>
          <h4 className="text-[#042f22] text-[20px] sm:text-[28px] md:text-[36px] font-bold mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            {video.title}
          </h4>
          <p className="text-[#6b7280] text-[14px] sm:text-[16px] leading-[1.7] sm:leading-[1.8]">
            {video.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MovingSoul() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[0]">
      {/* Green soul */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] rounded-full opacity-80 blur-[60px]"
        style={{ background: "radial-gradient(circle, rgba(32,201,151,0.85) 0%, transparent 75%)" }}
        animate={{
          x: ["0vw", "30vw", "10vw", "-10vw", "0vw"],
          y: ["0vh", "20vh", "50vh", "10vh", "0vh"],
          scale: [1, 1.3, 0.8, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Dark Green soul */}
      <motion.div
        className="absolute top-[20%] -right-[20%] w-[35vw] h-[35vw] min-w-[500px] min-h-[500px] rounded-full opacity-70 blur-[70px]"
        style={{ background: "radial-gradient(circle, rgba(13,124,102,0.9) 0%, transparent 75%)" }}
        animate={{
          x: ["0vw", "-40vw", "-20vw", "10vw", "0vw"],
          y: ["0vh", "-30vh", "10vh", "40vh", "0vh"],
          scale: [0.8, 1.4, 1, 1.3, 0.8],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Mint Green soul */}
      <motion.div
        className="absolute -bottom-[20%] left-[10%] w-[45vw] h-[45vw] min-w-[600px] min-h-[600px] rounded-full opacity-70 blur-[80px]"
        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.7) 0%, transparent 75%)" }}
        animate={{
          x: ["0vw", "20vw", "40vw", "-20vw", "0vw"],
          y: ["0vh", "-40vh", "-10vh", "10vh", "0vh"],
          scale: [1.1, 0.9, 1.2, 0.8, 1.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}
