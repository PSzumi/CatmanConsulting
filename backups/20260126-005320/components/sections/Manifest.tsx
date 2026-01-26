"use client";

import { motion, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";

// ============================================================================
// DATA - Manifest content
// ============================================================================

const manifestScenes = [
  {
    id: "intro",
    type: "intro" as const,
    tagline: "Na czym stoimy",
    headline: "Trzy zasady",
    subheadline: "które definiują naszą pracę",
  },
  {
    id: "principle-01",
    type: "principle" as const,
    number: "01",
    title: "Transparentność",
    subtitle: "zamiast domysłów",
    description:
      "Jasne zasady i rozmowy, które przesuwają sprawy do przodu. Nie zgadujemy — pytamy, słuchamy, nazywamy rzeczy po imieniu.",
    keyword: "CLARITY",
  },
  {
    id: "principle-02",
    type: "principle" as const,
    number: "02",
    title: "Odpowiedzialność",
    subtitle: "zamiast kontroli",
    description:
      "Ustalamy umowy, a nie mnożymy raporty. Dorośli ludzie nie potrzebują nadzorców — potrzebują jasnych oczekiwań i przestrzeni do działania.",
    keyword: "TRUST",
  },
  {
    id: "principle-03",
    type: "principle" as const,
    number: "03",
    title: "Prosto",
    subtitle: "ale nie prostacko",
    description:
      "Mówimy zrozumiale — wdrażamy rzeczy trudne. Złożoność jest w implementacji, nie w komunikacji.",
    keyword: "ESSENCE",
  },
  {
    id: "closing",
    type: "closing" as const,
    quote:
      "Nie obiecujemy cudów. Obiecujemy metodę, zaangażowanie i szczerość — nawet gdy prawda jest niewygodna.",
    authors: "Tomek & Mariusz",
  },
];

// ============================================================================
// UTILITY HOOKS
// ============================================================================

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

// ============================================================================
// ANIMATED TEXT COMPONENTS
// ============================================================================

function AnimatedWord({
  children,
  delay = 0,
  className = ""
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 100, rotateX: -90 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.span>
  );
}

function RevealLine({
  children,
  delay = 0,
  className = ""
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{
          duration: 1,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ============================================================================
// SCENE COMPONENTS
// ============================================================================

function IntroScene({ scene }: { scene: typeof manifestScenes[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useParallax(scrollYProgress, 100);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9]);

  if (scene.type !== "intro") return null;

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center justify-center relative"
      style={{ opacity }}
    >
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-50" />

      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b8860b]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#b8860b]/3 rounded-full blur-[80px]" />
      </motion.div>

      {/* Decorative lines */}
      <motion.div
        className="absolute left-0 top-1/2 w-1/4 h-px bg-gradient-to-r from-transparent via-[#b8860b]/30 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div
        className="absolute right-0 top-1/2 w-1/4 h-px bg-gradient-to-l from-transparent via-[#b8860b]/30 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <motion.div
        className="relative z-10 text-center px-6"
        style={{ scale }}
      >
        {/* Tagline */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-sm md:text-base font-medium tracking-[0.3em] uppercase text-[#b8860b]">
            {scene.tagline}
          </span>
        </motion.div>

        {/* Main headline */}
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none mb-4">
          <AnimatedWord delay={0.3}>{scene.headline}</AnimatedWord>
        </h2>

        {/* Subheadline */}
        <div className="text-3xl md:text-5xl lg:text-6xl text-white/60 font-light">
          <AnimatedWord delay={0.5}>{scene.subheadline}</AnimatedWord>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div className="w-1 h-2 bg-[#b8860b] rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PrincipleScene({ scene, index }: { scene: typeof manifestScenes[1]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useParallax(scrollYProgress, 50);
  const numberY = useParallax(scrollYProgress, -100);
  const keywordX = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  if (scene.type !== "principle") return null;

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Large background number */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ y: numberY }}
      >
        <span className="text-[40vw] font-bold text-white/[0.02] leading-none">
          {scene.number}
        </span>
      </motion.div>

      {/* Floating keyword */}
      <motion.div
        className="absolute top-1/4 right-0 pointer-events-none select-none hidden lg:block"
        style={{ x: keywordX }}
      >
        <span className="text-[15vw] font-bold text-[#b8860b]/5 leading-none tracking-tighter">
          {scene.keyword}
        </span>
      </motion.div>

      {/* Accent light */}
      <motion.div
        className={`absolute w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none ${
          isEven ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
        }`}
        style={{
          y,
          background: "radial-gradient(circle, rgba(184,134,11,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 py-20 ${
        isEven ? "lg:text-left" : "lg:text-right"
      }`}>
        <div className={`flex flex-col ${isEven ? "lg:items-start" : "lg:items-end"}`}>
          {/* Number badge */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-4">
              <div className="w-16 h-px bg-[#b8860b]" />
              <span className="text-[#b8860b] font-mono text-lg tracking-wider">
                {scene.number}
              </span>
              <div className="w-16 h-px bg-[#b8860b]" />
            </div>
          </motion.div>

          {/* Title */}
          <div className="mb-4">
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none">
              <AnimatedWord delay={0.3}>{scene.title}</AnimatedWord>
            </h3>
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <span className="text-3xl md:text-5xl lg:text-6xl font-light text-white/50">
              <AnimatedWord delay={0.5}>{scene.subtitle}</AnimatedWord>
            </span>
          </div>

          {/* Accent line */}
          <motion.div
            className={`h-1 bg-gradient-to-r from-[#b8860b] to-[#b8860b]/30 mb-12 ${
              isEven ? "" : "bg-gradient-to-l"
            }`}
            initial={{ width: 0 }}
            animate={isInView ? { width: "200px" } : {}}
            transition={{ duration: 1, delay: 0.7 }}
          />

          {/* Description */}
          <RevealLine delay={0.8}>
            <p className={`text-xl md:text-2xl text-white/60 leading-relaxed max-w-2xl ${
              isEven ? "" : "lg:ml-auto"
            }`}>
              {scene.description}
            </p>
          </RevealLine>
        </div>
      </div>

      {/* Decorative corner elements */}
      <motion.div
        className="absolute top-12 left-12 w-24 h-24 border-l-2 border-t-2 border-white/10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.div
        className="absolute bottom-12 right-12 w-24 h-24 border-r-2 border-b-2 border-white/10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
    </motion.div>
  );
}

function ClosingScene({ scene }: { scene: typeof manifestScenes[4] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useParallax(scrollYProgress, 30);
  const quoteScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);

  if (scene.type !== "closing") return null;

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_50%,black_100%)] pointer-events-none" />

      {/* Animated quote marks */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-[30vw] font-serif text-[#b8860b]/5 leading-none select-none"
        style={{ y }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        &ldquo;
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        style={{ scale: quoteScale }}
      >
        {/* Quote */}
        <motion.blockquote
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
        >
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-light leading-relaxed italic">
            &ldquo;{scene.quote}&rdquo;
          </p>
        </motion.blockquote>

        {/* Decorative line */}
        <motion.div
          className="w-32 h-px bg-gradient-to-r from-transparent via-[#b8860b] to-transparent mx-auto mb-8"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
        />

        {/* Authors */}
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <span className="text-lg text-[#b8860b] font-medium tracking-wider">
            {scene.authors}
          </span>
        </motion.div>
      </motion.div>

      {/* Corner accents */}
      <motion.div
        className="absolute bottom-12 left-12"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b8860b] rounded-full" />
          <div className="w-8 h-px bg-[#b8860b]/50" />
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-12 right-12"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-[#b8860b]/50" />
          <div className="w-2 h-2 bg-[#b8860b] rounded-full" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Manifest() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Progress bar at top
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={containerRef}
      id="manifest"
      className="relative bg-black"
    >
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#b8860b] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Scenes */}
      {manifestScenes.map((scene, index) => {
        switch (scene.type) {
          case "intro":
            return <IntroScene key={scene.id} scene={scene} />;
          case "principle":
            return <PrincipleScene key={scene.id} scene={scene as typeof manifestScenes[1]} index={index} />;
          case "closing":
            return <ClosingScene key={scene.id} scene={scene as typeof manifestScenes[4]} />;
          default:
            return null;
        }
      })}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
