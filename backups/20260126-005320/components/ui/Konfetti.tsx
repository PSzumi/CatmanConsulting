"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KonfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

const colors = ["#b8860b", "#d4a843", "#2d5a7b", "#3d7a9e", "#ffffff", "#fafaf9"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

export function Konfetti({ active, duration = 3000, particleCount = 50 }: KonfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: randomBetween(5, 95),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: randomBetween(6, 12),
        rotation: randomBetween(0, 360),
        delay: randomBetween(0, 0.5),
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, particleCount]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: `${particle.x}%`,
            top: -20,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
          initial={{
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: "100vh",
            rotate: particle.rotation + 720,
            opacity: [1, 1, 0],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: randomBetween(2, 4),
            delay: particle.delay,
            ease: [0.23, 0.03, 0.27, 0.97],
          }}
        />
      ))}
    </AnimatePresence>
  );
}
