const BENTO_COLUMNS = [
  {
    offsetTop: 0,
    cards: [
      { id: "pc1", type: "video", videoIndex: 0, height: 420, speed: -4, expandDir: "right" },
      { id: "pc2", type: "feature", height: 260, speed: 10, icon: "⚡", title: "Real-time Preview", desc: "GPU-accelerated preview rendering with zero-latency playback at any resolution." },
      { id: "pc3", type: "video", videoIndex: 3, height: 340, speed: -6, expandDir: "right" },
    ],
  },
  {
    offsetTop: 120,
    cards: [
      { id: "pc4", type: "feature", height: 230, speed: 7, icon: "🎨", title: "AI Color Match", desc: "Automatically match and grade colors across your entire timeline with a single click." },
      { id: "pc5", type: "video", videoIndex: 1, height: 460, speed: -8, expandDir: "down" },
      { id: "pc6", type: "stats", height: 280, speed: 5 },
    ],
  },
  {
    offsetTop: 60,
    cards: [
      { id: "pc7", type: "video", videoIndex: 2, height: 380, speed: -5, expandDir: "left" },
      { id: "pc8", type: "feature", height: 300, speed: 12, icon: "☁️", title: "Cloud Collaboration", desc: "Real-time team editing across the globe. Share projects, assets, and timelines seamlessly." },
      { id: "pc9", type: "video", videoIndex: 4, height: 350, speed: -3, expandDir: "left" },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────────────── */
/*  FLOATING CARD – Renders video / feature / stats cards for the bento grid */
/* ──────────────────────────────────────────────────────────────────────────── */
function FloatingCard({ card, enterDelay }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ── VIDEO CARD ── */
  if (card.type === "video") {
    const video = VIDEOS[card.videoIndex];
    const thumbUrl = `https://img.youtube.com/vi/${getYouTubeId(video.src)}/maxresdefault.jpg`;
    
    const isRight = card.expandDir === 'right';
    const isLeft = card.expandDir === 'left';
    const isDown = card.expandDir === 'down';
    const originClass = isLeft ? "right-0 top-0 origin-right" : "left-0 top-0 origin-left";

    return (
      <motion.div
        className="w-full relative z-10"
        style={{ height: card.height }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => { setIsHovered(false); setIsPlaying(false); }}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, delay: enterDelay, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className={`absolute ${originClass} rounded-[22px] overflow-hidden bg-white flex`}
          animate={{
            width: isHovered ? (isLeft || isRight ? "160%" : "100%") : "100%",
            height: isHovered ? (isDown ? "140%" : "100%") : "100%",
            scale: isHovered ? 1.05 : 1,
            zIndex: isHovered ? 50 : 1,
            boxShadow: isHovered ? "0 40px 80px rgba(0,0,0,0.15)" : "0 8px 30px rgba(0,0,0,0.06)"
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          style={{
            flexDirection: isLeft ? "row-reverse" : (isRight ? "row" : "column"),
          }}
        >
          {/* Thumbnail / Video Container */}
          <motion.div 
             className="relative shrink-0 bg-black cursor-pointer"
             animate={{
               width: isHovered ? (isLeft || isRight ? "55%" : "100%") : "100%",
               height: isHovered ? (isDown ? "65%" : "100%") : "100%",
             }}
             transition={{ type: "spring", stiffness: 350, damping: 30 }}
             onClick={() => { if(isHovered) setIsPlaying(true); }}
          >
            {isPlaying ? (
              <iframe
                src={`${video.src}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                loading="lazy"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={video.title}
              />
            ) : (
              <>
                <img src={thumbUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                
                {/* Fixed Title when NOT hovered */}
                <motion.div 
                  className="absolute bottom-6 left-6 right-6"
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                   <h4 className="text-white text-[18px] md:text-[22px] font-semibold tracking-wide leading-tight drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif" }}>
                     {video.title}
                   </h4>
                </motion.div>
                
                {/* Play button overlay when hovered but not playing */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Unfolded Info Container */}
          <div className="flex-1 bg-white p-6 md:p-8 flex flex-col justify-center overflow-hidden min-w-[200px] min-h-[200px]">
            <motion.div
               initial={{ opacity: 0, x: isLeft ? 20 : (isRight ? -20 : 0), y: isDown ? -20 : 0 }}
               animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : (isLeft ? 20 : (isRight ? -20 : 0)), y: isHovered ? 0 : (isDown ? -20 : 0) }}
               transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
               className="flex flex-col h-full"
            >
               <h4 className="text-[#0a0f0d] text-[20px] md:text-[24px] font-bold mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                 {video.title}
               </h4>
               <p className="text-[#3d5a4e] text-[13px] md:text-[14px] leading-relaxed mb-6">
                 {video.description}
               </p>
               <button
                 onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }}
                 className="mt-auto self-start flex items-center gap-3 text-[#0d7c66] text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-bold group/btn cursor-pointer"
               >
                 <div className="w-[36px] h-[36px] md:w-10 md:h-10 rounded-full bg-[#20C997]/10 flex items-center justify-center text-[#0d7c66] shadow-sm border border-[#20C997]/20 group-hover/btn:bg-[#20C997] group-hover/btn:text-white transition-colors">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M8 5v14l11-7z" /></svg>
                 </div>
                 Watch Now
               </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  /* ── FEATURE CARD ── */
  if (card.type === "feature") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay: enterDelay, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.035, y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        className="relative rounded-[22px] overflow-hidden p-7 md:p-8 flex flex-col cursor-default bg-white"
        style={{
          height: card.height,
          border: "1px solid #e1e8e5",
          boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 shrink-0"
          style={{ background: "#f0f7f4", border: "1px solid #d1e8df" }}
        >
          {card.icon}
        </div>
        <h4
          className="text-[#0a0f0d] text-[18px] md:text-[20px] font-semibold leading-snug"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {card.title}
        </h4>
        <p
          className="text-[#3d5a4e] text-[14px] mt-3 leading-[1.7] flex-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {card.desc}
        </p>
        <div
          className="mt-auto pt-5 flex items-center gap-2.5 text-[#0d7c66] text-[10px] uppercase tracking-[0.2em] font-bold hover:text-[#20C997] transition-colors cursor-pointer"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#20C997]" />
          Explore
        </div>
      </motion.div>
    );
  }

  /* ── STATS CARD ── */
  if (card.type === "stats") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.9, delay: enterDelay, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.035, y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        className="relative rounded-[22px] overflow-hidden p-7 md:p-8 flex flex-col cursor-default"
        style={{
          height: card.height,
          background: "linear-gradient(145deg, #f2f9f6 0%, #e6f3ef 100%)",
          border: "1px solid #d1e8df",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        }}
      >
        <span
          className="text-[#0d7c66]/60 text-[10px] uppercase tracking-[0.25em] font-bold mb-6"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Performance Specs
        </span>
        <div className="flex flex-col gap-5 flex-1">
          {[
            { value: "8K", label: "Max Export" },
            { value: "10-bit", label: "Color Depth" },
            { value: "120fps", label: "Preview Rate" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-3">
              <span
                className="text-[#0a0f0d] text-[26px] md:text-[30px] font-bold tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}
              >
                {stat.value}
              </span>
              <span
                className="text-[#3d5a4e] text-[11px] uppercase tracking-[0.15em]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-4 flex items-center gap-2">
          <div className="w-8 h-1 rounded-full bg-[#20C997]" />
          <div className="w-4 h-1 rounded-full bg-[#20C997]/50" />
          <div className="w-2 h-1 rounded-full bg-[#20C997]/20" />
        </div>
      </motion.div>
    );
  }

  return null;
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  PROJECT OVERLAY – Light parallax bento grid (Clyde-inspired)             */
/* ──────────────────────────────────────────────────────────────────────────── */
function ProjectOverlay({ cat, onClose }) {
  const overlayRef = useRef(null);
  const [scrollContainer, setScrollContainer] = useState(null);

  useEffect(() => {
    if (overlayRef.current) setScrollContainer(overlayRef.current);
  }, []);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #fbfcfb 0%, #f4f8f6 40%, #eef5f2 100%)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @media (max-width: 1023px) {
          .bento-col { padding-top: 0 !important; }
        }
      `}} />

      {/* Ambient background glows */}
      <div
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(32,201,151,0.08) 0%, transparent 70%)" }}
      />

      {/* ── Close button ── */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        onClick={onClose}
        className="fixed top-6 left-6 md:top-8 md:left-10 z-[150] flex items-center gap-2.5 uppercase tracking-[0.2em] text-[11px] font-bold text-[#0d7c66] hover:text-[#042f22] transition-colors cursor-pointer"
        style={{
          fontFamily: "'Inter', sans-serif",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid #d1e8df",
          borderRadius: "9999px",
          padding: "12px 22px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </motion.button>

      {/* ── Hero Header ── */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-28 md:pt-36 pb-8 md:pb-16 relative z-[60]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[580px]"
        >
          {/* Category tag */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-2 h-2 rounded-full bg-[#20C997]" style={{ boxShadow: "0 0 12px rgba(32,201,151,0.5)" }} />
            <span
              className="text-[#0d7c66] text-[11px] uppercase tracking-[0.3em] font-bold"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {cat.title}
            </span>
          </div>

          <motion.h1
            layoutId={`card-title-${cat.id}`}
            className="text-[#0a0f0d] text-[34px] md:text-[46px] lg:text-[54px] tracking-tight leading-[1.06] font-medium drop-shadow-sm"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            One platform for cinematic video editing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[#3d5a4e] text-[16px] md:text-[18px] leading-[1.8] mt-7"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Say goodbye to fragmented workflows. We enable you to color grade, edit timelines, mix audio, and render — all from a single platform built for professionals.
          </motion.p>

          {/* Decorative accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-[2px] mt-10 origin-left"
            style={{ background: "linear-gradient(to right, #20C997, transparent)" }}
          />
        </motion.div>
      </div>

      {/* ── Parallax Bento Grid ── */}
      {scrollContainer && (
        <ParallaxProvider scrollContainer={scrollContainer}>
          <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pb-[220px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start">
              {BENTO_COLUMNS.map((col, ci) => (
                <div
                  key={ci}
                  className="bento-col flex flex-col gap-6 md:gap-8"
                  style={{ paddingTop: col.offsetTop }}
                >
                  {col.cards.map((card, i) => (
                    <Parallax key={card.id} speed={card.speed}>
                      <FloatingCard card={card} enterDelay={ci * 0.06 + i * 0.1} />
                    </Parallax>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </ParallaxProvider>
      )}
    </motion.div>
  );
}
