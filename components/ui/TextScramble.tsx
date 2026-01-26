"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleSpeed?: number;
  revealDelay?: number;
}

const chars = "!<>-_\\/[]{}—=+*^?#________";

export function TextScramble({
  text,
  className,
  scrambleSpeed = 30,
  revealDelay = 0,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const timeout = setTimeout(() => {
      setIsScrambling(true);

      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
          setIsScrambling(false);
          setDisplayText(text);
        }

        iteration += 1 / 3;
      }, scrambleSpeed);

      return () => clearInterval(interval);
    }, revealDelay);

    return () => clearTimeout(timeout);
  }, [isInView, text, scrambleSpeed, revealDelay]);

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block font-mono", className)}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  );
}
