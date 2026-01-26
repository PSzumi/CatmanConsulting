"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
}

export function InfiniteMarquee({
  children,
  className,
  speed = 30,
  pauseOnHover = true,
  direction = "left",
}: InfiniteMarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "flex shrink-0 gap-8 py-4",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          animate={{
            x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {children}
        </motion.div>
      ))}
    </div>
  );
}
