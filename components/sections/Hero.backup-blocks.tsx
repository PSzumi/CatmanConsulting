"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { useRef } from "react";
import { heroContent } from "@/lib/constants";
import { GradientMesh } from "@/components/ui/GradientMesh";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextScramble } from "@/components/ui/TextScramble";
import { BeamEffect } from "@/components/ui/BeamEffect";
import { ShatteredWord } from "@/components/ui/ShatteredWord";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Enhanced parallax transforms
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center"
      style={{ overflow: "visible" }}
    >
      {/* Animated gradient mesh background */}
      <GradientMesh />

      {/* Beam effects */}
      <BeamEffect />


      {/* Content */}
      <motion.div
        style={{ scale, opacity, y: textY }}
        className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center"
      >
        <div className="space-y-8">
          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm font-medium text-foreground-secondary border border-accent/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <TextScramble text={heroContent.badge} scrambleSpeed={25} />
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight" style={{ overflow: "visible" }}>
            <span className="block">{heroContent.headline}</span>
            <span className="block mt-2">
              <ShatteredWord
                word="złożonych"
                className=""
                letterClassName="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight gradient-text"
                shardsPerLetter={12}
                scatterRange={180}
                duration={1.2}
                staggerAmount={0.5}
                autoPlayDelay={2.5}
                glowColor="rgba(99, 102, 241, 0.4)"
              />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-foreground-secondary leading-relaxed">
            {heroContent.subheadline}
          </p>

          {/* CTA Buttons - Magnetic */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Primary CTA - Magnetic */}
            <MagneticButton
              as="a"
              href="#kontakt"
              strength={0.4}
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-white font-medium text-lg overflow-hidden transition-all hover:shadow-xl hover:shadow-accent/30"
            >
              <span className="relative z-10">{heroContent.cta.primary}</span>
              <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </MagneticButton>

            {/* Secondary CTA - Magnetic */}
            <MagneticButton
              as="a"
              href="#casebook"
              strength={0.3}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full glass font-medium text-lg text-foreground transition-all hover:bg-card-hover border border-transparent hover:border-accent/20"
            >
              {heroContent.cta.secondary}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-foreground-muted">
            {[
              "25+ lat doświadczenia",
              "100+ projektów",
              "50+ firm",
            ].map((text) => (
              <span key={text} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a
          href="#o-nas"
          className="flex flex-col items-center gap-2 text-foreground-muted hover:text-accent transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium">Przewiń</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
