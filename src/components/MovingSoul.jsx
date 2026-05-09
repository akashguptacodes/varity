"use client";
import { motion } from "framer-motion";

export default function MovingSoul() {
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
