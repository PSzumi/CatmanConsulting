"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook to integrate Lenis with GSAP ScrollTrigger
function useLenisScrollTrigger() {
  useEffect(() => {
    // Lenis stores instance on window.__lenis when using ReactLenis with root prop
    const checkLenis = () => {
      const lenis = (window as unknown as { lenis?: { on: (event: string, callback: () => void) => void } }).lenis;
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          (lenis as unknown as { raf: (t: number) => void }).raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    };

    // Check immediately and after a short delay (for async initialization)
    checkLenis();
    const timeout = setTimeout(checkLenis, 100);

    return () => clearTimeout(timeout);
  }, []);
}

interface ScrambleWordProps {
  word: string;
  className?: string;
  letterClassName?: string;
  triggerStart?: string;
  triggerEnd?: string;
  staggerAmount?: number;
  duration?: number;
  ease?: string;
  scatterRange?: number;
  /** If true, plays animation on mount instead of using ScrollTrigger */
  autoPlay?: boolean;
  /** Delay before autoPlay animation starts (in seconds) */
  autoPlayDelay?: number;
}

export function ScrambleWord({
  word,
  className = "",
  letterClassName = "",
  triggerStart = "top 80%",
  triggerEnd = "top 20%",
  staggerAmount = 0.08,
  duration = 1.2,
  ease = "back.out(1.7)",
  scatterRange = 500,
  autoPlay = false,
  autoPlayDelay = 0.5,
}: ScrambleWordProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Integrate Lenis with ScrollTrigger (only if not autoPlay)
  useLenisScrollTrigger();

  // Handle client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current || lettersRef.current.length === 0) return;

    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

    // Small delay to ensure DOM is ready and parent elements are visible
    const initTimeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Set initial chaotic state for each letter
        letters.forEach((letter) => {
          const randomX = (Math.random() - 0.5) * scatterRange * 2;
          const randomY = (Math.random() - 0.5) * scatterRange * 2;
          const randomRotation = (Math.random() - 0.5) * 720;
          const randomScale = 0.3 + Math.random() * 1.5;

          gsap.set(letter, {
            x: randomX,
            y: randomY,
            rotation: randomRotation,
            scale: randomScale,
            opacity: 0.15 + Math.random() * 0.25,
            visibility: "visible",
          });
        });

        // Create animation timeline
        let tl: gsap.core.Timeline;

        if (autoPlay) {
          // AutoPlay mode: play immediately with delay (for Hero/above-the-fold content)
          tl = gsap.timeline({ delay: autoPlayDelay });
        } else {
          // ScrollTrigger mode: play when element enters viewport
          tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: triggerStart,
              end: triggerEnd,
              toggleActions: "play none none reverse",
              // markers: true, // Uncomment for debugging
            },
          });
        }

        // Animate letters to their final positions
        tl.to(letters, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: duration,
          ease: ease,
          stagger: {
            amount: staggerAmount * letters.length,
            from: "random",
          },
        });
      }, containerRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(initTimeout);
  }, [isClient, word, triggerStart, triggerEnd, staggerAmount, duration, ease, scatterRange, autoPlay, autoPlayDelay]);

  const letters = word.split("");

  return (
    <div
      ref={containerRef}
      className={`inline-flex flex-wrap justify-center relative ${className}`}
      aria-label={word}
      style={{
        overflow: "visible",
        zIndex: 50,
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          ref={(el) => {
            lettersRef.current[index] = el;
          }}
          className={`inline-block ${letterClassName}`}
          style={{
            willChange: "transform, opacity",
            position: "relative",
            zIndex: 50,
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </div>
  );
}
