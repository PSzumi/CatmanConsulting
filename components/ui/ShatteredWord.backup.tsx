"use client";

import { useRef, useEffect, useState, useCallback } from "react";
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

interface Block {
  polygon: string;
  centerX: number;
  centerY: number;
  startX: number;
  startY: number;
  rotation: number;
  order: number;
}

// Seeded random for consistency
let seedCounter = 0;
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate rectangular blocks that assemble perfectly
function generateBlocks(count: number, seed: number, scatterRange: number): Block[] {
  const blocks: Block[] = [];

  let randomIndex = seed;
  const random = () => seededRandom(randomIndex++);

  // Create a grid of rectangular blocks
  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const rows = Math.ceil(count / cols);
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  // Overlap for seamless assembly
  const overlap = 3;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = Math.max(0, col * cellWidth - overlap);
      const right = Math.min(100, (col + 1) * cellWidth + overlap);
      const top = Math.max(0, row * cellHeight - overlap);
      const bottom = Math.min(100, (row + 1) * cellHeight + overlap);

      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      // Generate random angle for this block (full 360 degrees)
      const angle = random() * Math.PI * 2;

      // Distance - blocks come from far outside the viewport
      const baseDistance = scatterRange * (1.2 + random() * 0.8);

      // Calculate start position based on angle
      const startX = Math.cos(angle) * baseDistance;
      const startY = Math.sin(angle) * baseDistance;

      // Random rotation for tumbling effect
      const rotation = (random() - 0.5) * 540; // -270 to +270 degrees

      // Staggered order - pieces arrive in waves
      const order = random() * 0.6 + (row * cols + col) * 0.015;

      // Clean rectangular polygon - ensures perfect assembly
      const polygon = `polygon(${left.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${bottom.toFixed(1)}%, ${left.toFixed(1)}% ${bottom.toFixed(1)}%)`;

      blocks.push({
        polygon,
        centerX,
        centerY,
        startX,
        startY,
        rotation,
        order,
      });
    }
  }

  // Sort by order for staggered animation
  blocks.sort((a, b) => a.order - b.order);

  return blocks;
}

export function ShatteredWord({
  word,
  className = "",
  letterClassName = "",
  shardsPerLetter = 8,
  scatterRange = 150,
  duration = 1.5,
  staggerAmount = 0.4,
  autoPlayDelay = 0,
  glowColor = "rgba(99, 102, 241, 0.5)",
}: ShatteredWordProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLSpanElement[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [blockData, setBlockData] = useState<Block[][]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasPlayedOnce = useRef(false);

  // Generate blocks on mount
  useEffect(() => {
    const baseSeed = seedCounter++;
    const letters = word.split("");
    const data = letters.map((_, i) => generateBlocks(shardsPerLetter, baseSeed + i * 100, scatterRange));
    setBlockData(data);
    setIsReady(true);
  }, [word, shardsPerLetter, scatterRange]);

  // Play animation function
  const playAnimation = useCallback(() => {
    if (!isReady || blockData.length === 0 || !containerRef.current) return;

    const blocks = blocksRef.current.filter(Boolean);
    const glowElement = glowRef.current;
    const allBlocks = blockData.flat();

    if (blocks.length === 0) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Reset blocks to scattered positions
    blocks.forEach((block, index) => {
      const data = allBlocks[index];
      if (!data || !block) return;

      gsap.set(block, {
        x: data.startX,
        y: data.startY,
        rotation: data.rotation,
        opacity: 0,
        force3D: true,
      });
    });

    if (glowElement) {
      gsap.set(glowElement, { opacity: 0, scale: 0.8 });
    }

    // Create new timeline
    const delay = hasPlayedOnce.current ? 0.3 : autoPlayDelay;
    const tl = gsap.timeline({ delay });
    timelineRef.current = tl;

    // Blocks fly in from all directions and assemble
    blocks.forEach((block, index) => {
      const data = allBlocks[index];
      if (!data || !block) return;

      const staggerDelay = data.order * staggerAmount;

      // Fade in as block approaches
      tl.to(block, {
        opacity: 1,
        duration: duration * 0.25,
        ease: "power2.out",
      }, staggerDelay);

      // Main flight animation - block flies to final position
      tl.to(block, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: duration,
        ease: "expo.out",
        force3D: true,
      }, staggerDelay);
    });

    // Glow pulse when blocks lock into place
    if (glowElement) {
      tl.to(glowElement, {
        opacity: 0.6,
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      }, staggerAmount + duration * 0.4);

      tl.to(glowElement, {
        opacity: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.inOut",
      }, staggerAmount + duration * 0.6);
    }

    hasPlayedOnce.current = true;
  }, [isReady, blockData, duration, staggerAmount, autoPlayDelay]);

  // Intersection Observer - detect when element enters/leaves viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Play animation when becoming visible
  useEffect(() => {
    if (isVisible && isReady) {
      playAnimation();
    }
  }, [isVisible, isReady, playAnimation]);

  const letters = word.split("");
  let blockIndex = 0;

  return (
    <span
      ref={containerRef}
      className={`inline-flex relative ${className}`}
      aria-label={word}
      style={{
        overflow: "visible",
      }}
    >
      {/* Glow effect */}
      <span
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
          filter: "blur(25px)",
          transform: "scale(1.3) translateZ(0)",
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

          {/* Blocks */}
          {blockData[letterIndex]?.map((block, bIdx) => {
            const currentIndex = blockIndex++;
            return (
              <span
                key={`block-${letterIndex}-${bIdx}`}
                ref={(el) => {
                  if (el) blocksRef.current[currentIndex] = el;
                }}
                className={`absolute inset-0 ${letterClassName}`}
                style={{
                  clipPath: block.polygon,
                  WebkitClipPath: block.polygon,
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
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
