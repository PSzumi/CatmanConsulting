"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KonfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  zIndex?: number;
}

const colors = ["#b8860b", "#d4a843", "#2d5a7b", "#3d7a9e", "#ffffff", "#fafaf9", "#FFD700", "#FFA500"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type ParticleShape = "circle" | "square" | "star" | "ribbon";

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
  shape: ParticleShape;
  swayAmount: number;
  fallSpeed: number;
}

export function Konfetti({ active, duration = 4000, particleCount = 50, zIndex = 10001 }: KonfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const shapes: ParticleShape[] = ["circle", "square", "star", "ribbon"];
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: randomBetween(0, 100),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: randomBetween(8, 16),
        rotation: randomBetween(0, 360),
        delay: randomBetween(0, 0.8),
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        swayAmount: randomBetween(20, 60),
        fallSpeed: randomBetween(2.5, 5),
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, particleCount]);

  const getShapeStyle = (shape: ParticleShape, size: number): React.CSSProperties => {
    switch (shape) {
      case "circle":
        return { borderRadius: "50%" };
      case "square":
        return { borderRadius: "2px" };
      case "star":
        return {
          borderRadius: "2px",
          transform: "rotate(45deg)",
        };
      case "ribbon":
        return {
          width: size * 0.4,
          height: size * 2,
          borderRadius: "2px",
        };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none"
          style={{
            zIndex,
            left: `${particle.x}%`,
            top: -30,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size / 2}px ${particle.color}40`,
            ...getShapeStyle(particle.shape, particle.size),
          }}
          initial={{
            y: -30,
            x: 0,
            rotate: 0,
            opacity: 1,
            scale: 0,
          }}
          animate={{
            y: "110vh",
            x: [0, particle.swayAmount, -particle.swayAmount, particle.swayAmount / 2, 0],
            rotate: particle.rotation + 1080,
            opacity: [0, 1, 1, 1, 0],
            scale: [0, 1.2, 1, 1, 0.5],
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: particle.fallSpeed,
            delay: particle.delay,
            ease: "easeOut",
            x: {
              duration: particle.fallSpeed,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </AnimatePresence>
  );
}
