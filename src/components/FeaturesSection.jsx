"use client";

import { motion } from "framer-motion";
import { FEATURES } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function FeaturesSection() {
  return (
    <section className="relative z-20 bg-gradient-to-b from-transparent via-white/95 to-white" style={{ paddingTop: 'clamp(60px, 10vw, 128px)', paddingBottom: 'clamp(60px, 10vw, 96px)' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-medium text-[#0d7c66] tracking-widest uppercase mb-4">
            Features
          </span>
          <h2
            className="font-bold tracking-tight mb-5 text-[#1a1a2e]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)' }}
          >
            Everything you need to{" "}
            <span className="text-gradient">create</span>
          </h2>
          <p className="text-lg text-[#1a1a2e]/40 max-w-2xl mx-auto">
            Professional video editing tools powered by AI, designed for creators who demand speed and quality.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="feature-card group relative overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0d7c66]/0 to-[#10b981]/0 group-hover:from-[#0d7c66]/3 group-hover:to-[#10b981]/3 transition-all duration-500 rounded-[20px]" />

              <div className="relative z-10">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3
                  className="text-xl font-semibold mb-2 text-[#1a1a2e]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-[#1a1a2e]/45 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#0d7c66]/8 to-transparent rounded-tr-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
