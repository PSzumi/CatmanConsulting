"use client";

import { ReactLenis } from "lenis/react";
import { type ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.8,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
