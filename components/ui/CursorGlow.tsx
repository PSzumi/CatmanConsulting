"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    // Check for touch device only on client
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  useEffect(() => {
    if (!isMounted || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible, isMounted, isTouchDevice]);

  // Don't render until mounted or on touch devices
  if (!isMounted || isTouchDevice) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          background:
            "radial-gradient(circle, rgba(139,26,26,0.10) 0%, rgba(139,26,26,0.03) 40%, transparent 70%)",
        }}
      />

      {/* Inner bright spot */}
      <motion.div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full blur-sm"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          backgroundColor: "rgba(139, 26, 26, 0.25)",
        }}
      />
    </motion.div>
  );
}
