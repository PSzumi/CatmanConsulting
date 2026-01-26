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

interface ShardGeometry {
  polygon: string;
  centerX: number;
  centerY: number;
}

interface ShardState {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
}

// Seeded random for consistency
let seedCounter = 0;
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate shards with generous overlap
function generateShards(count: number, seed: number): ShardGeometry[] {
  const shards: ShardGeometry[] = [];
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;
  const overlap = 18;

  let randomIndex = seed;
  const random = () => seededRandom(randomIndex++);

  const points: { x: number; y: number }[][] = [];
  for (let row = 0; row <= rows; row++) {
    points[row] = [];
    for (let col = 0; col <= cols; col++) {
      const baseX = col * cellWidth;
      const baseY = row * cellHeight;
      const isEdge = row === 0 || row === rows || col === 0 || col === cols;
      const jitterX = isEdge ? 0 : (random() - 0.5) * cellWidth * 0.4;
      const jitterY = isEdge ? 0 : (random() - 0.5) * cellHeight * 0.4;

      points[row][col] = {
        x: Math.max(0, Math.min(100, baseX + jitterX)),
        y: Math.max(0, Math.min(100, baseY + jitterY)),
      };
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tl = points[row][col];
      const tr = points[row][col + 1];
      const br = points[row + 1][col + 1];
      const bl = points[row + 1][col];

      const expanded = {
        tl: { x: Math.max(0, tl.x - overlap), y: Math.max(0, tl.y - overlap) },
        tr: { x: Math.min(100, tr.x + overlap), y: Math.max(0, tr.y - overlap) },
        br: { x: Math.min(100, br.x + overlap), y: Math.min(100, br.y + overlap) },
        bl: { x: Math.max(0, bl.x - overlap), y: Math.min(100, bl.y + overlap) },
      };

      const centerX = (tl.x + tr.x + br.x + bl.x) / 4;
      const centerY = (tl.y + tr.y + br.y + bl.y) / 4;

      const polygon = `polygon(${expanded.tl.x.toFixed(1)}% ${expanded.tl.y.toFixed(1)}%, ${expanded.tr.x.toFixed(1)}% ${expanded.tr.y.toFixed(1)}%, ${expanded.br.x.toFixed(1)}% ${expanded.br.y.toFixed(1)}%, ${expanded.bl.x.toFixed(1)}% ${expanded.bl.y.toFixed(1)}%)`;

      shards.push({ polygon, centerX, centerY });
    }
  }

  return shards;
}

// Generate initial state - reverse glass shatter effect
// All shards fly in from different directions and arrive at the same time
function generateInitialState(
  index: number,
  total: number,
  scatterRange: number,
  seed: number,
  maxStagger: number
): ShardState {
  let randomIndex = seed + index * 7;
  const random = () => seededRandom(randomIndex++);

  // Fully random angles - true "all directions" scatter
  const angle = random() * Math.PI * 2;

  // Varied distances - some close, some far, for depth
  // Using a distribution that favors farther distances (more dramatic)
  const distanceRandom = random();
  const distance = scatterRange * (0.4 + distanceRandom * 0.6);

  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  // REVERSE GLASS SHATTER: All pieces arrive at the SAME time
  // Farther shards start earlier, closer shards start later
  // This creates the "implosion" effect
  const normalizedDistance = distance / scatterRange;

  // Tiny stagger variation for organic feel, but mostly synchronized
  const baseDelay = (1 - normalizedDistance) * maxStagger * 0.15;
  const randomDelay = random() * maxStagger * 0.08;
  const delay = baseDelay + randomDelay;

  return {
    x,
    y,
    rotation: (random() - 0.5) * 270, // More rotation for dramatic effect
    scale: 0.5 + random() * 0.4,
    delay,
  };
}

export function ShatteredWord({
  word,
  className = "",
  letterClassName = "",
  shardsPerLetter = 6,
  scatterRange = 200,
  duration = 2.0,
  staggerAmount = 0.4,
  autoPlayDelay = 0,
  glowColor = "rgba(99, 102, 241, 0.5)",
}: ShatteredWordProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shardsRef = useRef<HTMLSpanElement[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const [shardData, setShardData] = useState<ShardGeometry[][]>([]);
  const [initialStates, setInitialStates] = useState<ShardState[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Generate geometry on mount
  useEffect(() => {
    const baseSeed = seedCounter++;
    const letters = word.split("");
    const data = letters.map((_, i) => generateShards(shardsPerLetter, baseSeed + i * 100));
    setShardData(data);

    const totalShards = data.reduce((sum, letter) => sum + letter.length, 0);
    const states = Array.from({ length: totalShards }, (_, i) =>
      generateInitialState(i, totalShards, scatterRange, baseSeed + 1000 + i, staggerAmount)
    );
    setInitialStates(states);
    setIsReady(true);
  }, [word, shardsPerLetter, scatterRange, staggerAmount]);

  // Single fluid animation
  useEffect(() => {
    if (!isReady || shardData.length === 0 || !containerRef.current) return;

    const shards = shardsRef.current.filter(Boolean);
    const glowElement = glowRef.current;

    if (shards.length === 0) return;

    const ctx = gsap.context(() => {
      // Set initial scattered state
      shards.forEach((shard, index) => {
        const state = initialStates[index];
        if (!state || !shard) return;

        gsap.set(shard, {
          x: state.x,
          y: state.y,
          rotation: state.rotation,
          scale: state.scale,
          opacity: 0,
          force3D: true,
        });
      });

      if (glowElement) {
        gsap.set(glowElement, { opacity: 0, scale: 1.3 });
      }

      // ONE FLUID ANIMATION per shard
      // All properties animate together with the same timing
      // No phases, no steps - just continuous motion
      shards.forEach((shard, index) => {
        const state = initialStates[index];
        if (!state || !shard) return;

        // Single tween: scattered → formed
        // Opacity fades in during the FIRST 30% of the motion
        // Position/rotation/scale animate for the FULL duration
        // This creates the "materializing while flowing" effect

        gsap.to(shard, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: duration,
          delay: autoPlayDelay + state.delay,
          ease: "power3.out", // Smooth deceleration, not too aggressive
          force3D: true,
        });
      });

      // Glow pulses smoothly with the animation
      if (glowElement) {
        gsap.to(glowElement, {
          opacity: 0.6,
          scale: 1.1,
          duration: duration * 0.5,
          delay: autoPlayDelay + staggerAmount * 0.3,
          ease: "power2.out",
        });

        gsap.to(glowElement, {
          opacity: 0,
          scale: 1,
          duration: duration * 0.5,
          delay: autoPlayDelay + duration * 0.6,
          ease: "power2.inOut",
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, [isReady, shardData, initialStates, duration, staggerAmount, autoPlayDelay]);

  const letters = word.split("");
  let shardIndex = 0;

  return (
    <span
      ref={containerRef}
      className={`inline-flex relative ${className}`}
      aria-label={word}
      style={{
        overflow: "visible",
        perspective: "1000px",
      }}
    >
      {/* Glow layer */}
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
          style={{ overflow: "visible" }}
        >
          {/* Base letter - always visible, shards overlay and merge into it */}
          <span className={letterClassName} style={{ visibility: "hidden" }}>
            {letter}
          </span>

          {/* Shard layers - they ARE the visible letter */}
          {shardData[letterIndex]?.map((shard, shardIdx) => {
            const currentShardIndex = shardIndex++;
            return (
              <span
                key={`shard-${letterIndex}-${shardIdx}`}
                ref={(el) => {
                  if (el) shardsRef.current[currentShardIndex] = el;
                }}
                className={`absolute inset-0 ${letterClassName}`}
                style={{
                  clipPath: shard.polygon,
                  WebkitClipPath: shard.polygon,
                  backfaceVisibility: "hidden",
                  willChange: "transform, opacity",
                  transformOrigin: `${shard.centerX}% ${shard.centerY}%`,
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
