"use client";

import { motion } from "framer-motion";

export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient blobs - Intellectual Warmth palette */}
      {/* Primary: Dark goldenrod (#8b1a1a) */}
      <motion.div
        className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(139,26,26,0.25) 0%, rgba(139,26,26,0.08) 40%, transparent 70%)",
        }}
        animate={{
          x: [0, 40, 20, 0],
          y: [0, -20, 20, 0],
          scale: [1, 1.03, 0.98, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary: Deep teal (#2d5a7b) */}
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-12"
        style={{
          background:
            "radial-gradient(circle, rgba(45,90,123,0.25) 0%, rgba(45,90,123,0.08) 40%, transparent 70%)",
        }}
        animate={{
          x: [0, -30, 15, 0],
          y: [0, 30, -15, 0],
          scale: [1, 0.97, 1.02, 1],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
        }}
      />
    </div>
  );
}
