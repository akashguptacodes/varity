"use client";

import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="relative z-20 bg-white overflow-hidden" style={{ paddingTop: 'clamp(80px, 15vw, 128px)', paddingBottom: 'clamp(80px, 15vw, 128px)' }}>
      {/* Background glow — soft green */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#0d7c66]/6 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-[#10b981]/5 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="font-bold tracking-tight mb-6 text-[#1a1a2e]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.1 }}
          >
            Ready to create{" "}
            <span className="text-gradient">something amazing</span>?
          </h2>
          <p className="text-lg text-[#1a1a2e]/40 mb-10 max-w-2xl mx-auto">
            Join thousands of creators using Verity to produce stunning videos in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary text-lg px-10 py-4" id="cta-start-btn">
              <span className="relative z-10 flex items-center gap-2">
                Start Editing — It&apos;s Free
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          <p className="text-xs text-[#1a1a2e]/20 mt-6">
            No credit card required • Free plan available
          </p>
        </motion.div>
      </div>
    </section>
  );
}
