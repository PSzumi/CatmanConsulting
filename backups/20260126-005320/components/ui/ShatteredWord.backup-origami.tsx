"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

interface ShatteredWordProps {
  word: string;
  className?: string;
  letterClassName?: string;
  shardsPerLetter?: number;
  scatterRange?: number;
  duration?: number;
  staggerAmount?: number;
  autoPlayDelay?: number;
  glowColor?: string;
}

interface FoldPanel {
  polygon: string;
  centerX: number;
  centerY: number;
  foldAxis: 'horizontal' | 'vertical' | 'diagonal';
  foldDirection: number;
  foldOrder: number;
}

// Seeded random for consistency
let seedCounter = 0;
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate origami-style fold panels
// Creates geometric sections that unfold like paper
function generateFoldPanels(count: number, seed: number): FoldPanel[] {
  const panels: FoldPanel[] = [];

  // Origami uses clean geometric divisions
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  // Small overlap for seamless appearance when unfolded
  const overlap = 3;

  let randomIndex = seed;
  const random = () => seededRandom(randomIndex++);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = Math.max(0, col * cellWidth - overlap);
      const right = Math.min(100, (col + 1) * cellWidth + overlap);
      const top = Math.max(0, row * cellHeight - overlap);
      const bottom = Math.min(100, (row + 1) * cellHeight + overlap);

      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      // Determine fold axis based on position - creates natural origami pattern
      let foldAxis: 'horizontal' | 'vertical' | 'diagonal';
      const pattern = (row + col) % 3;
      if (pattern === 0) foldAxis = 'horizontal';
      else if (pattern === 1) foldAxis = 'vertical';
      else foldAxis = 'diagonal';

      // Fold direction alternates for realistic paper behavior
      const foldDirection = ((row + col) % 2 === 0) ? 1 : -1;

      // Fold order - outer panels unfold first, center last (like opening a paper crane)
      const distFromCenter = Math.abs(row - rows / 2 + 0.5) + Math.abs(col - cols / 2 + 0.5);
      const maxDist = rows / 2 + cols / 2;
      const foldOrder = 1 - (distFromCenter / maxDist); // 0 = outer, 1 = center

      // Clean rectangular panels - origami aesthetic
      const polygon = `polygon(${left.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${bottom.toFixed(1)}%, ${left.toFixed(1)}% ${bottom.toFixed(1)}%)`;

      panels.push({
        polygon,
        centerX,
        centerY,
        foldAxis,
        foldDirection,
        foldOrder,
      });
    }
  }

  return panels;
}

// Generate initial folded state
function generateFoldedState(panel: FoldPanel, intensity: number) {
  const { foldAxis, foldDirection, foldOrder } = panel;

  // Base fold angles - more dramatic for outer panels
  const foldIntensity = 90 + (1 - foldOrder) * 60; // 90-150 degrees

  let rotateX = 0;
  let rotateY = 0;
  let rotateZ = 0;

  switch (foldAxis) {
    case 'horizontal':
      rotateX = foldDirection * foldIntensity * intensity;
      break;
    case 'vertical':
      rotateY = foldDirection * foldIntensity * intensity;
      break;
    case 'diagonal':
      rotateX = foldDirection * foldIntensity * 0.5 * intensity;
      rotateY = foldDirection * foldIntensity * 0.5 * intensity;
      rotateZ = foldDirection * 15 * intensity;
      break;
  }

  // Slight displacement when folded
  const displacement = 20 * (1 - foldOrder) * intensity;

  return {
    rotateX,
    rotateY,
    rotateZ,
    z: -50 - foldOrder * 100 * intensity,
    y: foldDirection * displacement,
    x: foldAxis === 'vertical' ? foldDirection * displacement * 0.5 : 0,
    scale: 0.85 + foldOrder * 0.1,
  };
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
  const panelsRef = useRef<HTMLSpanElement[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const [panelData, setPanelData] = useState<FoldPanel[][]>([]);
  const [isReady, setIsReady] = useState(false);

  // Generate panel geometry on mount
  useEffect(() => {
    const baseSeed = seedCounter++;
    const letters = word.split("");
    const data = letters.map((_, i) => generateFoldPanels(shardsPerLetter, baseSeed + i * 100));
    setPanelData(data);
    setIsReady(true);
  }, [word, shardsPerLetter]);

  // Origami unfold animation
  useEffect(() => {
    if (!isReady || panelData.length === 0 || !containerRef.current) return;

    const panels = panelsRef.current.filter(Boolean);
    const glowElement = glowRef.current;

    if (panels.length === 0) return;

    const ctx = gsap.context(() => {
      // Flatten panel data for indexing
      const allPanels = panelData.flat();

      // Set initial folded state
      panels.forEach((panel, index) => {
        const data = allPanels[index];
        if (!data || !panel) return;

        const folded = generateFoldedState(data, 1);

        gsap.set(panel, {
          rotateX: folded.rotateX,
          rotateY: folded.rotateY,
          rotateZ: folded.rotateZ,
          z: folded.z,
          x: folded.x,
          y: folded.y,
          scale: folded.scale,
          opacity: 0,
          transformPerspective: 1200,
          transformOrigin: `${data.centerX}% ${data.centerY}%`,
          force3D: true,
        });
      });

      if (glowElement) {
        gsap.set(glowElement, { opacity: 0, scale: 1.2 });
      }

      // Create master timeline
      const tl = gsap.timeline({ delay: autoPlayDelay });

      // Phase 1: Panels fade in while still folded (quick)
      tl.to(panels, {
        opacity: 1,
        duration: 0.4,
        stagger: {
          each: 0.02,
          from: "edges",
        },
        ease: "power2.out",
      });

      // Phase 2: Elegant unfold animation
      // Each panel unfolds based on its foldOrder (outer first, center last)
      panels.forEach((panel, index) => {
        const data = allPanels[index];
        if (!data || !panel) return;

        // Delay based on fold order - creates wave-like unfold from edges to center
        const delay = (1 - data.foldOrder) * staggerAmount;

        tl.to(panel, {
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          z: 0,
          x: 0,
          y: 0,
          scale: 1,
          duration: duration,
          ease: "power3.out", // Smooth, elegant deceleration
          transformPerspective: 1200,
        }, 0.4 + delay);
      });

      // Subtle glow as paper settles
      if (glowElement) {
        tl.to(glowElement, {
          opacity: 0.5,
          scale: 1,
          duration: duration * 0.6,
          ease: "power2.out",
        }, 0.6);

        tl.to(glowElement, {
          opacity: 0,
          duration: duration * 0.4,
          ease: "power2.inOut",
        }, 0.6 + duration * 0.6);
      }

    }, containerRef);

    return () => ctx.revert();
  }, [isReady, panelData, duration, staggerAmount, autoPlayDelay]);

  const letters = word.split("");
  let panelIndex = 0;

  return (
    <span
      ref={containerRef}
      className={`inline-flex relative ${className}`}
      aria-label={word}
      style={{
        overflow: "visible",
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Subtle glow */}
      <span
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(25px)",
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
            transformStyle: "preserve-3d",
          }}
        >
          {/* Base letter for sizing */}
          <span className={letterClassName} style={{ visibility: "hidden" }}>
            {letter}
          </span>

          {/* Origami fold panels */}
          {panelData[letterIndex]?.map((panel, idx) => {
            const currentIndex = panelIndex++;
            return (
              <span
                key={`panel-${letterIndex}-${idx}`}
                ref={(el) => {
                  if (el) panelsRef.current[currentIndex] = el;
                }}
                className={`absolute inset-0 ${letterClassName}`}
                style={{
                  clipPath: panel.polygon,
                  WebkitClipPath: panel.polygon,
                  backfaceVisibility: "hidden",
                  willChange: "transform, opacity",
                  transformStyle: "preserve-3d",
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
