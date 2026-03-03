"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

// ============================================================================
// DATA - Manifest content
// ============================================================================

const manifestPrinciples = [
  {
    id: "principle-01",
    number: "01",
    title: "Transparentność",
    subtitle: "zamiast domysłów",
    description:
      "Jasne zasady i rozmowy, które przesuwają sprawy do przodu. Nie zgadujemy — pytamy, słuchamy, nazywamy rzeczy po imieniu.",
    keyword: "CLARITY",
    accent: "#8b1a1a",
  },
  {
    id: "principle-02",
    number: "02",
    title: "Odpowiedzialność",
    subtitle: "zamiast kontroli",
    description:
      "Ustalamy umowy, a nie mnożymy raporty. Dorośli ludzie nie potrzebują nadzorców — potrzebują jasnych oczekiwań i przestrzeni do działania.",
    keyword: "TRUST",
    accent: "#2d5a7b",
  },
  {
    id: "principle-03",
    number: "03",
    title: "Prosto",
    subtitle: "ale nie prostacko",
    description:
      "Mówimy zrozumiale — wdrażamy rzeczy trudne. Złożoność jest w implementacji, nie w komunikacji.",
    keyword: "ESSENCE",
    accent: "#8b1a1a",
  },
];

// ============================================================================
// FLOATING SHAPE COMPONENT
// ============================================================================

interface ShapeConfig {
  x: string;
  y: string;
  size: number;
  speed: number;
  rotation: number;
  opacity: number;
}

function FloatingShape({
  shape,
  scrollProgress,
}: {
  shape: ShapeConfig;
  scrollProgress: MotionValue<number>;
}) {
  const y = useTransform(scrollProgress, [0, 1], [0, shape.speed]);
  const rotate = useTransform(scrollProgress, [0, 1], [0, shape.rotation]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.size,
        height: shape.size,
        y,
        rotate,
      }}
    >
      <div
        className="w-full h-full rounded-3xl border border-[#8b1a1a]"
        style={{ opacity: shape.opacity }}
      />
    </motion.div>
  );
}

const FLOATING_SHAPES: ShapeConfig[] = [
  { x: "10%", y: "20%", size: 300, speed: -200, rotation: 45, opacity: 0.03 },
  { x: "80%", y: "60%", size: 250, speed: -180, rotation: -30, opacity: 0.02 },
  { x: "60%", y: "10%", size: 200, speed: -150, rotation: 60, opacity: 0.025 },
  { x: "20%", y: "70%", size: 150, speed: -100, rotation: -45, opacity: 0.04 },
  { x: "85%", y: "30%", size: 180, speed: -120, rotation: 15, opacity: 0.03 },
  { x: "40%", y: "85%", size: 120, speed: -80, rotation: -60, opacity: 0.035 },
  { x: "15%", y: "45%", size: 80, speed: -50, rotation: 30, opacity: 0.05 },
  { x: "75%", y: "75%", size: 100, speed: -60, rotation: -20, opacity: 0.04 },
];

function FloatingShapes({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {FLOATING_SHAPES.map((shape, i) => (
        <FloatingShape key={i} shape={shape} scrollProgress={scrollProgress} />
      ))}
    </div>
  );
}

// ============================================================================
// INTRO SECTION
// ============================================================================

function IntroSection({ scrollProgress, t }: { scrollProgress: MotionValue<number>; t: ReturnType<typeof useTranslations> }) {
  const titleY = useTransform(scrollProgress, [0, 0.2], [0, -150]);
  const subtitleY = useTransform(scrollProgress, [0, 0.2], [0, -80]);
  const bgY = useTransform(scrollProgress, [0, 0.3], [0, 200]);
  const opacity = useTransform(scrollProgress, [0, 0.15, 0.2], [1, 1, 0]);
  const scale = useTransform(scrollProgress, [0, 0.2], [1, 0.85]);

  const smoothTitleY = useSpring(titleY, { stiffness: 100, damping: 30 });
  const smoothSubtitleY = useSpring(subtitleY, { stiffness: 100, damping: 30 });
  const smoothBgY = useSpring(bgY, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: smoothBgY }}
      >
        <div className="hidden md:block absolute top-1/4 left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#8b1a1a]/5 rounded-full blur-[150px]" />
        <div className="hidden md:block absolute bottom-1/4 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#2d5a7b]/5 rounded-full blur-[120px]" />
      </motion.div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,26,26,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,26,26,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6"
        style={{ scale }}
      >
        <motion.div className="mb-8" style={{ y: smoothTitleY }}>
          <motion.span
            className="inline-flex items-center gap-4 text-sm md:text-base font-medium tracking-[0.4em] uppercase text-[#8b1a1a]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="w-12 h-px bg-[#8b1a1a]" />
            {t("tagline")}
            <span className="w-12 h-px bg-[#8b1a1a]" />
          </motion.span>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[10rem] font-bold text-white leading-none mb-4 sm:mb-6"
          style={{ y: smoothTitleY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          {t("title")} {t("titleHighlight")}
        </motion.h2>

        <motion.p
          className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl text-white/40 font-light"
          style={{ y: smoothSubtitleY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {t("description")}
        </motion.p>

        <motion.div
          className="mt-8 sm:mt-12 md:mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xs tracking-widest text-white/30 uppercase">Przewin</span>
            <div className="w-px h-12 bg-gradient-to-b from-[#8b1a1a] to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Corners */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l border-t border-white/5" />
      <div className="absolute top-8 right-8 w-24 h-24 border-r border-t border-white/5" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l border-b border-white/5" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r border-b border-white/5" />
    </motion.div>
  );
}

// ============================================================================
// PRINCIPLE CARD
// ============================================================================

function PrincipleCard({
  principle,
  index,
  scrollProgress,
}: {
  principle: typeof manifestPrinciples[0];
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  // Each principle takes ~25% of scroll, starting at 15%
  const start = 0.15 + index * 0.25;
  const peak = start + 0.1;
  const end = start + 0.25;

  const opacity = useTransform(
    scrollProgress,
    [start, peak, end - 0.05, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollProgress,
    [start, peak, end - 0.05, end],
    [80, 0, 0, -80]
  );

  const scale = useTransform(
    scrollProgress,
    [start, peak, end - 0.05, end],
    [0.95, 1, 1, 0.95]
  );

  // Internal parallax
  const numberY = useTransform(scrollProgress, [start, end], [100, -150]);
  const keywordX = useTransform(scrollProgress, [start, end], [200, -200]);
  const contentY = useTransform(scrollProgress, [start, end], [50, -50]);
  const glowY = useTransform(scrollProgress, [start, end], [0, -100]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothNumberY = useSpring(numberY, { stiffness: 60, damping: 20 });
  const smoothKeywordX = useSpring(keywordX, { stiffness: 40, damping: 15 });
  const smoothContentY = useSpring(contentY, { stiffness: 80, damping: 25 });
  const smoothGlowY = useSpring(glowY, { stiffness: 30, damping: 15 });

  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      style={{ opacity, y: smoothY, scale }}
    >
      {/* Giant background number */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ y: smoothNumberY }}
      >
        <span className="text-[50vw] font-bold text-white/[0.02] leading-none">
          {principle.number}
        </span>
      </motion.div>

      {/* Floating keyword */}
      <motion.div
        className={`absolute ${isEven ? "right-0" : "left-0"} top-1/3 pointer-events-none select-none hidden lg:block`}
        style={{ x: smoothKeywordX }}
      >
        <span
          className="text-[15vw] font-bold leading-none tracking-tighter"
          style={{ color: `${principle.accent}10` }}
        >
          {principle.keyword}
        </span>
      </motion.div>

      {/* Accent glow */}
      <motion.div
        className={`absolute ${isEven ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"} top-1/2 -translate-y-1/2 pointer-events-none`}
        style={{ y: smoothGlowY }}
      >
        <div
          className="w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: `radial-gradient(circle, ${principle.accent}20 0%, transparent 70%)` }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className={`relative z-10 max-w-6xl mx-auto px-6 w-full ${isEven ? "lg:text-left" : "lg:text-right"}`}
        style={{ y: smoothContentY }}
      >
        <div className={`flex flex-col ${isEven ? "lg:items-start" : "lg:items-end"}`}>
          {/* Number line */}
          <div className="mb-10 flex items-center gap-6">
            <div className="w-16 h-px" style={{ backgroundColor: principle.accent }} />
            <span
              className="font-mono text-xl tracking-wider"
              style={{ color: principle.accent }}
            >
              {principle.number}
            </span>
            <div className="w-16 h-px" style={{ backgroundColor: principle.accent }} />
          </div>

          {/* Title */}
          <h3 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-none mb-3 sm:mb-4">
            {principle.title}
          </h3>

          {/* Subtitle */}
          <span className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white/30 mb-6 sm:mb-10 md:mb-12">
            {principle.subtitle}
          </span>

          {/* Accent line */}
          <div
            className={`h-1 w-40 rounded-full mb-10 ${isEven ? "" : "ml-auto"}`}
            style={{ backgroundColor: principle.accent }}
          />

          {/* Description */}
          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-white/50 leading-relaxed max-w-xl ${isEven ? "" : "lg:ml-auto"}`}>
            {principle.description}
          </p>
        </div>
      </motion.div>

      {/* Decorative corners */}
      <div className="absolute top-12 left-12 w-20 h-20 border-l-2 border-t-2 border-white/5" />
      <div className="absolute bottom-12 right-12 w-20 h-20 border-r-2 border-b-2 border-white/5" />
    </motion.div>
  );
}

// ============================================================================
// CLOSING SECTION
// ============================================================================

function ClosingSection({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const start = 0.85;

  const opacity = useTransform(scrollProgress, [start, start + 0.08, 1], [0, 1, 1]);
  const y = useTransform(scrollProgress, [start, start + 0.1], [60, 0]);
  const quoteMarkY = useTransform(scrollProgress, [start, 1], [80, -30]);
  const scale = useTransform(scrollProgress, [start, start + 0.1], [0.95, 1]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothQuoteMarkY = useSpring(quoteMarkY, { stiffness: 40, damping: 15 });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
    >
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_80%,black_100%)] pointer-events-none" />

      {/* Quote mark */}
      <motion.div
        className="absolute top-1/4 left-1/4 pointer-events-none select-none"
        style={{ y: smoothQuoteMarkY }}
      >
        <span className="text-[30vw] font-serif text-[#8b1a1a]/[0.04] leading-none">
          &ldquo;
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ y: smoothY, scale }}
      >
        <blockquote>
          <p className="text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed italic mb-12">
            &ldquo;Nie obiecujemy cudów. Obiecujemy metodę, zaangażowanie i szczerość — nawet gdy prawda jest niewygodna.&rdquo;
          </p>
        </blockquote>

        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#8b1a1a] to-transparent mx-auto mb-6" />

        <p className="text-base text-[#8b1a1a] font-medium tracking-wider">
          Tomek & Mariusz
        </p>
      </motion.div>

      {/* Bottom accents */}
      <div className="absolute bottom-10 left-10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#8b1a1a]/50" />
        <div className="w-10 h-px bg-[#8b1a1a]/30" />
      </div>
      <div className="absolute bottom-10 right-10 flex items-center gap-2">
        <div className="w-10 h-px bg-[#8b1a1a]/30" />
        <div className="w-2 h-2 rounded-full bg-[#8b1a1a]/50" />
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Manifest() {
  const t = useTranslations("manifest");
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="manifest"
      className="relative bg-black"
      style={{ height: "400vh" }}
    >
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#8b1a1a] to-[#b32424] z-50 origin-left"
        style={{ width: progressWidth }}
      />

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Floating shapes */}
        <FloatingShapes scrollProgress={smoothProgress} />

        {/* All sections are absolutely positioned and fade in/out */}
        <IntroSection scrollProgress={smoothProgress} t={t} />

        {manifestPrinciples.map((principle, index) => (
          <PrincipleCard
            key={principle.id}
            principle={principle}
            index={index}
            scrollProgress={smoothProgress}
          />
        ))}

        <ClosingSection scrollProgress={smoothProgress} />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-10" />
    </section>
  );
}
