"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

interface ShatteredWordProps {
  word: string;
  className?: string;
  letterClassName?: string;
  shardsPerLetter?: number;
  duration?: number;
  staggerAmount?: number;
  autoPlayDelay?: number;
  glowColor?: string;
}

interface BlueprintSegment {
  polygon: string;
  direction: 'horizontal' | 'vertical';
  drawOrigin: string; // transform-origin for the draw effect
  order: number; // draw order (0-1)
  gridX: number;
  gridY: number;
}

// Seeded random for consistency
let seedCounter = 0;
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate blueprint-style segments
// Creates a grid of strips that "draw in" like technical drafting
function generateBlueprintSegments(count: number, seed: number): BlueprintSegment[] {
  const segments: BlueprintSegment[] = [];

  // Blueprint uses clean grid divisions
  const cols = Math.ceil(Math.sqrt(count * 1.5)); // Slightly more columns for horizontal emphasis
  const rows = Math.ceil(count / cols);
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  // Minimal overlap
  const overlap = 2;

  let randomIndex = seed;
  const random = () => seededRandom(randomIndex++);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = Math.max(0, col * cellWidth - overlap);
      const right = Math.min(100, (col + 1) * cellWidth + overlap);
      const top = Math.max(0, row * cellHeight - overlap);
      const bottom = Math.min(100, (row + 1) * cellHeight + overlap);

      // Alternate between horizontal and vertical segments
      // Creates the cross-hatch blueprint look
      const isHorizontal = (row + col) % 2 === 0;

      // Draw origin - where the "pen" starts drawing from
      let drawOrigin: string;
      if (isHorizontal) {
        // Horizontal strips draw from left or right
        drawOrigin = col % 2 === 0 ? "left center" : "right center";
      } else {
        // Vertical strips draw from top or bottom
        drawOrigin = row % 2 === 0 ? "center top" : "center bottom";
      }

      // Draw order - creates a sweep pattern like a pen plotter
      // Top-left to bottom-right diagonal sweep
      const normalizedPos = (row / rows + col / cols) / 2;
      const order = normalizedPos + random() * 0.1;

      const polygon = `polygon(${left.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${bottom.toFixed(1)}%, ${left.toFixed(1)}% ${bottom.toFixed(1)}%)`;

      segments.push({
        polygon,
        direction: isHorizontal ? 'horizontal' : 'vertical',
        drawOrigin,
        order,
        gridX: col,
        gridY: row,
      });
    }
  }

  // Sort by draw order for sequential animation
  segments.sort((a, b) => a.order - b.order);

  return segments;
}

export function ShatteredWord({
  word,
  className = "",
  letterClassName = "",
  shardsPerLetter = 6,
  duration = 2.0,
  staggerAmount = 0.3,
  autoPlayDelay = 0,
  glowColor = "rgba(99, 102, 241, 0.4)",
}: ShatteredWordProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const segmentsRef = useRef<HTMLSpanElement[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [segmentData, setSegmentData] = useState<BlueprintSegment[][]>([]);
  const [isReady, setIsReady] = useState(false);

  // Generate segment geometry on mount
  useEffect(() => {
    const baseSeed = seedCounter++;
    const letters = word.split("");
    const data = letters.map((_, i) => generateBlueprintSegments(shardsPerLetter, baseSeed + i * 100));
    setSegmentData(data);
    setIsReady(true);
  }, [word, shardsPerLetter]);

  // Blueprint draw animation
  useEffect(() => {
    if (!isReady || segmentData.length === 0 || !containerRef.current) return;

    const segments = segmentsRef.current.filter(Boolean);
    const gridElement = gridRef.current;
    const glowElement = glowRef.current;

    if (segments.length === 0) return;

    const ctx = gsap.context(() => {
      const allSegments = segmentData.flat();

      // Set initial state - segments start "undrawn" (scaled to 0)
      segments.forEach((segment, index) => {
        const data = allSegments[index];
        if (!data || !segment) return;

        gsap.set(segment, {
          scaleX: data.direction === 'horizontal' ? 0 : 1,
          scaleY: data.direction === 'vertical' ? 0 : 1,
          opacity: 0,
          transformOrigin: data.drawOrigin,
          force3D: true,
        });
      });

      // Grid lines start invisible
      if (gridElement) {
        gsap.set(gridElement, { opacity: 0 });
      }

      if (glowElement) {
        gsap.set(glowElement, { opacity: 0 });
      }

      // Create master timeline
      const tl = gsap.timeline({ delay: autoPlayDelay });

      // Phase 1: Subtle grid appears (blueprint background)
      if (gridElement) {
        tl.to(gridElement, {
          opacity: 0.15,
          duration: 0.3,
          ease: "power2.out",
        }, 0);
      }

      // Phase 2: Segments "draw in" sequentially
      // Each segment scales from 0 to 1 along its axis
      segments.forEach((segment, index) => {
        const data = allSegments[index];
        if (!data || !segment) return;

        // Stagger based on draw order
        const delay = data.order * staggerAmount;

        // First fade in
        tl.to(segment, {
          opacity: 1,
          duration: 0.1,
          ease: "power1.out",
        }, delay);

        // Then draw (scale) in
        tl.to(segment, {
          scaleX: 1,
          scaleY: 1,
          duration: duration * 0.4,
          ease: "power2.out", // Smooth pen motion
        }, delay);
      });

      // Phase 3: Grid fades out as drawing completes
      if (gridElement) {
        tl.to(gridElement, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        }, staggerAmount + duration * 0.3);
      }

      // Subtle glow pulse when complete
      if (glowElement) {
        tl.to(glowElement, {
          opacity: 0.4,
          duration: 0.4,
          ease: "power2.out",
        }, staggerAmount + duration * 0.2);

        tl.to(glowElement, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        }, staggerAmount + duration * 0.5);
      }

    }, containerRef);

    return () => ctx.revert();
  }, [isReady, segmentData, duration, staggerAmount, autoPlayDelay]);

  const letters = word.split("");
  let segmentIndex = 0;

  return (
    <span
      ref={containerRef}
      className={`inline-flex relative ${className}`}
      aria-label={word}
      style={{
        overflow: "visible",
      }}
    >
      {/* Blueprint grid overlay */}
      <span
        ref={gridRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${glowColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${glowColor} 1px, transparent 1px)
          `,
          backgroundSize: "10% 20%",
          opacity: 0,
          transform: "scale(1.1)",
          zIndex: 1,
        }}
      />

      {/* Subtle glow */}
      <span
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(20px)",
          transform: "scale(1.2) translateZ(0)",
          zIndex: 0,
          opacity: 0,
        }}
      />

      {letters.map((letter, letterIndex) => (
        <span
          key={`letter-${letterIndex}`}
          className="relative inline-block"
          style={{
            overflow: "visible",
          }}
        >
          {/* Base letter for sizing */}
          <span className={letterClassName} style={{ visibility: "hidden" }}>
            {letter}
          </span>

          {/* Blueprint segments */}
          {segmentData[letterIndex]?.map((segment, idx) => {
            const currentIndex = segmentIndex++;
            return (
              <span
                key={`segment-${letterIndex}-${idx}`}
                ref={(el) => {
                  if (el) segmentsRef.current[currentIndex] = el;
                }}
                className={`absolute inset-0 ${letterClassName}`}
                style={{
                  clipPath: segment.polygon,
                  WebkitClipPath: segment.polygon,
                  willChange: "transform, opacity",
                }}
              >
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
