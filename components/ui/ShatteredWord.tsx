"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
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

interface ShardData {
  polygon: string;
  letter: string;
  letterIndex: number;
  shardIndex: number;
  // Start position (screen edge)
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

export function ShatteredWord({
  word,
  className = "",
  letterClassName = "",
  shardsPerLetter = 8,
  duration = 1.5,
  staggerAmount = 0.4,
  autoPlayDelay = 0,
  glowColor = "rgba(184, 134, 11, 0.5)",
}: ShatteredWordProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shardsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const glowRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [shardData, setShardData] = useState<ShardData[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRenderPortal, setShouldRenderPortal] = useState(false);
  const hasPlayedOnce = useRef(false);
  const seedRef = useRef<number | null>(null);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate shard data
  useEffect(() => {
    if (seedRef.current === null) {
      seedRef.current = seedCounter++;
    }

    const letters = word.split("");
    const shards: ShardData[] = [];

    // Grid configuration for each letter
    const cols = Math.ceil(Math.sqrt(shardsPerLetter * 1.5));
    const rows = Math.ceil(shardsPerLetter / cols);
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;
    const overlap = 3;

    let randomIndex = seedRef.current;
    const random = () => seededRandom(randomIndex++);

    letters.forEach((letter, letterIndex) => {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const left = Math.max(0, col * cellWidth - overlap);
          const right = Math.min(100, (col + 1) * cellWidth + overlap);
          const top = Math.max(0, row * cellHeight - overlap);
          const bottom = Math.min(100, (row + 1) * cellHeight + overlap);

          const polygon = `polygon(${left.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${top.toFixed(1)}%, ${right.toFixed(1)}% ${bottom.toFixed(1)}%, ${left.toFixed(1)}% ${bottom.toFixed(1)}%)`;

          // Random angle for start position
          const angle = random() * Math.PI * 2;

          // Random rotation
          const rotation = (random() - 0.5) * 540;

          // Staggered order
          const order = random() * 0.6 + (letterIndex * rows * cols + row * cols + col) * 0.01;

          shards.push({
            polygon,
            letter,
            letterIndex,
            shardIndex: shards.length,
            startX: Math.cos(angle), // Normalized direction
            startY: Math.sin(angle),
            rotation,
            order,
          });
        }
      }
    });

    // Sort by order
    shards.sort((a, b) => a.order - b.order);
    setShardData(shards);
    setIsReady(true);
  }, [word, shardsPerLetter]);

  // Play animation
  const playAnimation = useCallback(() => {
    if (!isReady || shardData.length === 0 || !containerRef.current) return;
    if (!letterRefs.current.length) return;

    const shardElements = shardsRef.current.filter(Boolean) as HTMLSpanElement[];
    if (shardElements.length === 0) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Get viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxDist = Math.max(vw, vh) * 1.2; // Distance from screen edge

    // Calculate target positions for each shard (letter positions)
    const letterPositions: DOMRect[] = [];
    letterRefs.current.forEach((el) => {
      if (el) {
        letterPositions.push(el.getBoundingClientRect());
      }
    });

    if (letterPositions.length === 0) return;

    setAnimationComplete(false);
    setIsAnimating(true);

    // Position shards at screen edges
    shardElements.forEach((shard, index) => {
      const data = shardData[index];
      if (!data || !shard) return;

      const letterRect = letterPositions[data.letterIndex];
      if (!letterRect) return;

      // Calculate start position (screen edge in that direction)
      const centerX = letterRect.left + letterRect.width / 2;
      const centerY = letterRect.top + letterRect.height / 2;

      const startX = centerX + data.startX * maxDist;
      const startY = centerY + data.startY * maxDist;

      gsap.set(shard, {
        position: "fixed",
        left: startX,
        top: startY,
        width: letterRect.width,
        height: letterRect.height,
        rotation: data.rotation,
        opacity: 1,
        visibility: "visible",
        zIndex: 9999,
        force3D: true,
      });
    });

    // Animate glow
    const glowElement = glowRef.current;
    if (glowElement) {
      gsap.set(glowElement, { opacity: 0, scale: 0.8 });
    }

    // Create timeline
    const tl = gsap.timeline({
      delay: autoPlayDelay,
      onComplete: () => {
        setIsAnimating(false);
        setAnimationComplete(true);
      }
    });
    timelineRef.current = tl;

    // Animate each shard to its letter position
    shardElements.forEach((shard, index) => {
      const data = shardData[index];
      if (!data || !shard) return;

      const letterRect = letterPositions[data.letterIndex];
      if (!letterRect) return;

      const staggerDelay = data.order * staggerAmount;

      tl.to(shard, {
        left: letterRect.left,
        top: letterRect.top,
        rotation: 0,
        duration: duration,
        ease: "expo.out",
        force3D: true,
      }, staggerDelay);
    });

    // Glow effect
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
  }, [isReady, shardData, duration, staggerAmount, autoPlayDelay]);

  // Hide shards when Hero section is not visible
  useEffect(() => {
    if (animationComplete) return;

    const shardElements = shardsRef.current.filter(Boolean) as HTMLSpanElement[];

    if (!isVisible && isAnimating) {
      // Hero scrolled out of view - hide all shards immediately
      shardElements.forEach((shard) => {
        gsap.set(shard, { visibility: "hidden" });
      });
    } else if (isVisible && isAnimating) {
      // Hero back in view - show shards
      shardElements.forEach((shard) => {
        gsap.set(shard, { visibility: "visible" });
      });
    }
  }, [isVisible, isAnimating, animationComplete]);

  // Intersection Observer
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

  // Step 1: Decide if we should render portal (only when Hero is truly visible)
  useEffect(() => {
    if (!isReady || hasPlayedOnce.current || !mounted || shouldRenderPortal) return;

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const checkVisibility = () => {
      if (cancelled || hasPlayedOnce.current || shouldRenderPortal) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Element must be actually visible in viewport
      const isInViewport = rect.top < viewportHeight && rect.bottom > 0 && rect.top > -rect.height;

      if (isInViewport) {
        setShouldRenderPortal(true);
      }
    };

    // Wait for page to fully load and scroll to settle
    if (document.readyState === 'complete') {
      // Page already loaded - wait a bit for scroll restoration
      const timer = setTimeout(checkVisibility, 500);
      return () => { cancelled = true; clearTimeout(timer); };
    } else {
      // Wait for load event
      const handleLoad = () => {
        // After load, wait for scroll restoration
        setTimeout(checkVisibility, 500);
      };
      window.addEventListener('load', handleLoad);
      return () => { cancelled = true; window.removeEventListener('load', handleLoad); };
    }
  }, [isReady, mounted, shouldRenderPortal]);

  // Step 2: Once portal is rendered, wait for DOM and start animation
  useEffect(() => {
    if (!shouldRenderPortal || hasPlayedOnce.current || animationComplete) return;

    // Wait for portal to be in DOM
    const timer = setTimeout(() => {
      const shardElements = shardsRef.current.filter(Boolean);
      if (shardElements.length > 0 && !hasPlayedOnce.current) {
        playAnimation();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [shouldRenderPortal, animationComplete, playAnimation]);

  const letters = word.split("");

  // Portal shards (rendered ONLY when shouldRenderPortal and not complete)
  const portalShards = mounted && shouldRenderPortal && !animationComplete ? createPortal(
    <>
      {shardData.map((data, index) => (
        <span
          key={`shard-${index}`}
          ref={(el) => { shardsRef.current[index] = el; }}
          className={letterClassName}
          style={{
            position: "fixed",
            clipPath: data.polygon,
            WebkitClipPath: data.polygon,
            visibility: "hidden", // Hidden until animation starts
            pointerEvents: "none",
            willChange: "transform, left, top",
          }}
        >
          {data.letter}
        </span>
      ))}
    </>,
    document.body
  ) : null;

  return (
    <>
      {portalShards}
      <span
        ref={containerRef}
        className={`inline-flex relative ${className}`}
        aria-label={word}
        style={{ overflow: "visible", zIndex: 50 }}
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
            ref={(el) => { letterRefs.current[letterIndex] = el; }}
            className="relative inline-block"
            style={{
              overflow: "visible",
              paddingBottom: "0.25em",
              // Show original letters only after animation completes
              visibility: animationComplete ? "visible" : "hidden",
            }}
          >
            <span className={letterClassName} style={{ display: "inline-block" }}>
              {letter}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
