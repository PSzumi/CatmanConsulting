"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
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
  edge: "top" | "bottom" | "left" | "right";
  edgeOffset: number;
  rotation: number;
  order: number;
}

let seedCounter = 0;
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateBlocks(count: number, seed: number): Block[] {
  const blocks: Block[] = [];
  let randomIndex = seed;
  const random = () => seededRandom(randomIndex++);

  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const rows = Math.ceil(count / cols);
  const cellWidth = 100 / cols;
  const cellHeight = 100 / rows;
  const overlap = 3;

  const edges: ("top" | "bottom" | "left" | "right")[] = ["top", "bottom", "left", "right"];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = Math.max(0, col * cellWidth - overlap);
      const right = Math.min(100, (col + 1) * cellWidth + overlap);
      const top = Math.max(0, row * cellHeight - overlap);
      const bottom = Math.min(100, (row + 1) * cellHeight + overlap);

      const edge = edges[Math.floor(random() * 4)];
      const edgeOffset = random();
      const rotation = (random() - 0.5) * 720;
      const order = random() * 0.4 + (row * cols + col) * 0.02;

      const polygon = `polygon(${left.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${bottom.toFixed(1)}%, ${left.toFixed(1)}% ${bottom.toFixed(1)}%)`;

      blocks.push({ polygon, edge, edgeOffset, rotation, order });
    }
  }

  blocks.sort((a, b) => a.order - b.order);
  return blocks;
}

export function ShatteredWord({
  word,
  className = "",
  letterClassName = "",
  shardsPerLetter = 10,
  duration = 2.0,
  staggerAmount = 0.5,
  autoPlayDelay = 0,
  glowColor = "rgba(184, 134, 11, 0.5)",
}: ShatteredWordProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const blocksRef = useRef<HTMLSpanElement[]>([]);
  const glowRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [blockData, setBlockData] = useState<Block[][]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const hasPlayedOnce = useRef(false);

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    setIsMounted(true);

    // Wait for page to fully load and settle at correct scroll position
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 500);

    return () => {
      setIsMounted(false);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const baseSeed = seedCounter++;
    const letters = word.split("");
    const data = letters.map((_, i) => generateBlocks(shardsPerLetter, baseSeed + i * 100));
    setBlockData(data);
    setIsReady(true);
  }, [word, shardsPerLetter]);

  const getEdgePosition = useCallback((edge: "top" | "bottom" | "left" | "right", edgeOffset: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    switch (edge) {
      case "top":
        return { x: edgeOffset * vw, y: -100 };
      case "bottom":
        return { x: edgeOffset * vw, y: vh + 100 };
      case "left":
        return { x: -100, y: edgeOffset * vh };
      case "right":
        return { x: vw + 100, y: edgeOffset * vh };
    }
  }, []);

  const playAnimation = useCallback(() => {
    if (!isReady || blockData.length === 0 || !containerRef.current) return;

    // Get fresh letter positions right now
    const freshRects: DOMRect[] = [];
    letterRefs.current.forEach((el) => {
      if (el) {
        freshRects.push(el.getBoundingClientRect());
      }
    });

    if (freshRects.length === 0) return;

    const glowElement = glowRef.current;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const allBlocksWithLetter: { block: Block; letterIndex: number; idx: number }[] = [];
    let idx = 0;
    blockData.forEach((letterBlocks, letterIndex) => {
      letterBlocks.forEach((block) => {
        allBlocksWithLetter.push({ block, letterIndex, idx: idx++ });
      });
    });

    // Set initial positions
    allBlocksWithLetter.forEach(({ block, idx }) => {
      const blockEl = blocksRef.current[idx];
      if (!block || !blockEl) return;

      const edgePos = getEdgePosition(block.edge, block.edgeOffset);

      gsap.set(blockEl, {
        left: edgePos.x,
        top: edgePos.y,
        rotation: block.rotation,
        opacity: 1,
        scale: 0.8,
        force3D: true,
      });
    });

    if (glowElement) {
      gsap.set(glowElement, { opacity: 0, scale: 0.8 });
    }

    const delay = hasPlayedOnce.current ? 0.3 : autoPlayDelay;
    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        setAnimationComplete(true);
      }
    });
    timelineRef.current = tl;

    // Animate to final positions using fresh rects
    allBlocksWithLetter.forEach(({ block, letterIndex, idx }) => {
      const blockEl = blocksRef.current[idx];
      const rect = freshRects[letterIndex];
      if (!block || !blockEl || !rect) return;

      tl.to(blockEl, {
        left: rect.left,
        top: rect.top,
        rotation: 0,
        scale: 1,
        duration: duration,
        ease: "expo.out",
        force3D: true,
      }, block.order * staggerAmount);
    });

    if (glowElement) {
      tl.to(glowElement, {
        opacity: 0.7,
        scale: 1.2,
        duration: 0.4,
        ease: "power2.out",
      }, staggerAmount + duration * 0.5);

      tl.to(glowElement, {
        opacity: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.inOut",
      }, staggerAmount + duration * 0.7);
    }

    hasPlayedOnce.current = true;
  }, [isReady, blockData, duration, staggerAmount, autoPlayDelay, getEdgePosition]);

  const startAnimation = useCallback(() => {
    if (!isReady || !isMounted) return;

    // Verify we have letter refs
    const hasRefs = letterRefs.current.some(el => el !== null);
    if (!hasRefs) return;

    // Clear refs for fresh start
    blocksRef.current = [];

    setAnimationComplete(false);
    setIsAnimating(true);
  }, [isReady, isMounted]);

  useEffect(() => {
    if (!isAnimating || !isMounted) return;

    const timer = setTimeout(() => {
      playAnimation();
    }, 50);

    return () => clearTimeout(timer);
  }, [isAnimating, isMounted, playAnimation]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Only start animation if:
    // 1. Initial page load is complete (page has settled)
    // 2. Section is visible
    // 3. Component is ready and mounted
    // 4. Animation hasn't started or completed yet
    if (isVisible && isReady && isMounted && initialLoadComplete && !isAnimating && !animationComplete) {
      // Extra check: only animate if container is actually in a reasonable position
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        // Only animate if the container is within the viewport vertically
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          return; // Container is off-screen, don't animate
        }
      }

      const timer = setTimeout(() => {
        startAnimation();
      }, 100);
      return () => clearTimeout(timer);
    }

    // If scrolled away during animation, cancel it
    if (!isVisible && isAnimating && !animationComplete) {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      setIsAnimating(false);
    }
  }, [isVisible, isReady, isMounted, initialLoadComplete, isAnimating, animationComplete, startAnimation]);

  const letters = word.split("");

  const renderPortal = () => {
    // Don't render if animation complete, not animating, not visible, or initial load not complete
    if (!isMounted || !isAnimating || animationComplete || !isVisible || !initialLoadComplete) return null;

    // Get current rects for sizing
    const currentRects: DOMRect[] = [];
    letterRefs.current.forEach((el) => {
      if (el) {
        currentRects.push(el.getBoundingClientRect());
      }
    });

    if (currentRects.length === 0) return null;

    let blockIndex = 0;
    const blockElements: React.ReactNode[] = [];

    letters.forEach((letter, letterIndex) => {
      const rect = currentRects[letterIndex];
      if (!rect) return;

      blockData[letterIndex]?.forEach((block, bIdx) => {
        const idx = blockIndex++;
        blockElements.push(
          <span
            key={`block-${letterIndex}-${bIdx}`}
            ref={(el) => { if (el) blocksRef.current[idx] = el; }}
            className={letterClassName}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: rect.width,
              height: rect.height,
              clipPath: block.polygon,
              WebkitClipPath: block.polygon,
              willChange: "transform, left, top",
              backfaceVisibility: "hidden",
              pointerEvents: "none",
              opacity: 0,
            }}
          >
            {letter}
          </span>
        );
      });
    });

    return createPortal(
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: "none",
          zIndex: 9999,
          overflow: "visible",
        }}
      >
        {blockElements}
      </div>,
      document.body
    );
  };

  return (
    <>
      <span
        ref={containerRef}
        className={`inline-flex relative ${className}`}
        aria-label={word}
        style={{ overflow: "visible" }}
      >
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
            ref={(el) => { if (el) letterRefs.current[letterIndex] = el; }}
            className="relative inline-block"
            style={{ overflow: "visible", paddingBottom: "0.25em" }}
          >
            <span
              className={letterClassName}
              style={{
                display: "inline-block",
                visibility: (isAnimating && !animationComplete) ? "hidden" : "visible",
              }}
            >
              {letter}
            </span>
          </span>
        ))}
      </span>

      {renderPortal()}
    </>
  );
}
