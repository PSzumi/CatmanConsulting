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

interface Block {
  polygon: string;
  centerX: number;
  centerY: number;
  direction: 'top' | 'bottom' | 'left' | 'right';
  distance: number;
  row: number;
  col: number;
  order: number;
}

// Seeded random for consistency
let seedCounter = 0;
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate building block pieces
// Blocks slide in from edges and stack together
function generateBlocks(count: number, seed: number, scatterRange: number): Block[] {
  const blocks: Block[] = [];

  let randomIndex = seed;
  const random = () => seededRandom(randomIndex++);

  // Create a brick-like grid
  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const rows = Math.ceil(count / cols);
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;

  // Slight overlap for seamless look
  const overlap = 3;

  // Directions for blocks to come from
  const directions: Block['direction'][] = ['top', 'bottom', 'left', 'right'];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = Math.max(0, col * cellWidth - overlap);
      const right = Math.min(100, (col + 1) * cellWidth + overlap);
      const top = Math.max(0, row * cellHeight - overlap);
      const bottom = Math.min(100, (row + 1) * cellHeight + overlap);

      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      // Blocks come from the edge they're closest to
      let direction: Block['direction'];
      const distToTop = top;
      const distToBottom = 100 - bottom;
      const distToLeft = left;
      const distToRight = 100 - right;

      const minDist = Math.min(distToTop, distToBottom, distToLeft, distToRight);
      if (minDist === distToTop) direction = 'top';
      else if (minDist === distToBottom) direction = 'bottom';
      else if (minDist === distToLeft) direction = 'left';
      else direction = 'right';

      // Add some randomness to direction
      if (random() > 0.7) {
        direction = directions[Math.floor(random() * 4)];
      }

      // Distance to travel
      const distance = scatterRange * (0.8 + random() * 0.4);

      // Build order - row by row, creates stacking effect
      // Bottom rows build first (like real construction)
      const buildOrder = ((rows - 1 - row) / rows) + (col / cols) * 0.3 + random() * 0.1;

      // Clean rectangular blocks
      const polygon = `polygon(${left.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${bottom.toFixed(1)}%, ${left.toFixed(1)}% ${bottom.toFixed(1)}%)`;

      blocks.push({
        polygon,
        centerX,
        centerY,
        direction,
        distance,
        row,
        col,
        order: buildOrder,
      });
    }
  }

  // Sort by build order
  blocks.sort((a, b) => a.order - b.order);

  return blocks;
}

// Calculate initial position based on direction
function getInitialPosition(direction: Block['direction'], distance: number) {
  switch (direction) {
    case 'top': return { x: 0, y: -distance };
    case 'bottom': return { x: 0, y: distance };
    case 'left': return { x: -distance, y: 0 };
    case 'right': return { x: distance, y: 0 };
  }
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
  const [blockData, setBlockData] = useState<Block[][]>([]);
  const [isReady, setIsReady] = useState(false);

  // Generate blocks on mount
  useEffect(() => {
    const baseSeed = seedCounter++;
    const letters = word.split("");
    const data = letters.map((_, i) => generateBlocks(shardsPerLetter, baseSeed + i * 100, scatterRange));
    setBlockData(data);
    setIsReady(true);
  }, [word, shardsPerLetter, scatterRange]);

  // Building animation
  useEffect(() => {
    if (!isReady || blockData.length === 0 || !containerRef.current) return;

    const blocks = blocksRef.current.filter(Boolean);
    const glowElement = glowRef.current;

    if (blocks.length === 0) return;

    const ctx = gsap.context(() => {
      const allBlocks = blockData.flat();

      // Set initial positions - blocks start off-screen in their direction
      blocks.forEach((block, index) => {
        const data = allBlocks[index];
        if (!data || !block) return;

        const initialPos = getInitialPosition(data.direction, data.distance);

        gsap.set(block, {
          x: initialPos.x,
          y: initialPos.y,
          opacity: 0,
          force3D: true,
        });
      });

      if (glowElement) {
        gsap.set(glowElement, { opacity: 0 });
      }

      // Master timeline
      const tl = gsap.timeline({ delay: autoPlayDelay });

      // Blocks slide in and stack
      // Row by row from bottom, creating a building effect
      blocks.forEach((block, index) => {
        const data = allBlocks[index];
        if (!data || !block) return;

        // Stagger based on build order
        const delay = data.order * staggerAmount;

        // Fade in quickly
        tl.to(block, {
          opacity: 1,
          duration: 0.15,
          ease: "power1.out",
        }, delay);

        // Slide into place with a slight bounce (like block clicking in)
        tl.to(block, {
          x: 0,
          y: 0,
          duration: duration * 0.5,
          ease: "back.out(1.2)", // Subtle bounce for "click into place" feel
          force3D: true,
        }, delay);
      });

      // Glow pulse when construction completes
      if (glowElement) {
        tl.to(glowElement, {
          opacity: 0.5,
          duration: 0.3,
          ease: "power2.out",
        }, staggerAmount * 0.7);

        tl.to(glowElement, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        }, staggerAmount + duration * 0.3);
      }

    }, containerRef);

    return () => ctx.revert();
  }, [isReady, blockData, duration, staggerAmount, autoPlayDelay]);

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
      {/* Glow */}
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

          {/* Building blocks */}
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
