"use client";

import { useEffect, useState } from "react";

// Small screens can't afford scroll parallax, backdrop blur or looping
// background animation — they tank scroll performance. Reduced-motion goes
// further and drops one-shot entrance animation too.
export function useReducedFx() {
  const [fx, setFx] = useState({
    isSmallScreen: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const small = window.matchMedia("(max-width: 768px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () =>
      setFx({
        isSmallScreen: small.matches,
        prefersReducedMotion: motion.matches,
      });

    update();
    small.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      small.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  return fx;
}
