"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeamEffectProps {
  className?: string;
}

export function BeamEffect({ className }: BeamEffectProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Single subtle horizontal beam - premium restraint */}
      <motion.div
        className="absolute top-1/3 -translate-y-1/2 w-full h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,26,26,0.2), transparent)",
        }}
        animate={{
          x: ["-100%", "100%"],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatDelay: 6,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
