"use client";

import { useEffect, useState } from "react";

interface NoiseOverlayProps {
  animated?: boolean;
  opacity?: number;
}

export function NoiseOverlay({ animated = true, opacity = 0.025 }: NoiseOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={animated ? "noise-overlay-animated" : "noise-overlay"}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
