"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Eye, Heart, Zap, ArrowRight, ChevronRight } from "lucide-react";

// The transformation journey - three phases
const phases = [
  {
    id: "swiadomosc",
    number: "01",
    title: "Świadomość",
    verb: "WIDZĘ",
    question: "Co tak naprawdę się dzieje?",
    insight:
      "Bez świadomości nie ma zmiany. Diagnozujemy sytuację bez filtrów — nazywamy problemy, pokazujemy ich źródła, odsłaniamy to, co ukryte.",
    outcomes: [
      "Jasny obraz kultury organizacyjnej",
      "Zidentyfikowane bariery i potencjał",
      "Mapa kompetencji i luk",
    ],
    tools: ["Wywiady diagnostyczne", "Analiza procesów", "Obserwacja zespołów"],
    icon: Eye,
    accentColor: "#2d5a7b",
  },
  {
    id: "motywacja",
    number: "02",
    title: "Motywacja",
    verb: "CHCĘ",
    question: "Dlaczego warto się zmienić?",
    insight:
      "Motywacja rodzi się z rozumienia 'dlaczego'. Budujemy zaangażowanie przez transparentność, jasne umowy i współodpowiedzialność.",
    outcomes: [
      "Kontrakty na cele i miary sukcesu",
      "Zaangażowanie kluczowych osób",
      "Energia do działania",
    ],
    tools: ["Kontraktowanie celów", "Warsztaty strategiczne", "Budowanie koalicji"],
    icon: Heart,
    accentColor: "#b8860b",
  },
  {
    id: "zmiana",
    number: "03",
    title: "Zmiana",
    verb: "DZIAŁAM",
    question: "Jak to wdrożyć w praktyce?",
    insight:
      "Teoria zamienia się w nawyki. Towarzyszymy w procesie, wspieramy w trudnych momentach, mierzymy postępy — aż zmiana stanie się nową normą.",
    outcomes: [
      "Nowe zachowania w codziennej pracy",
      "Trwałe zmiany w kulturze",
      "Mierzalne rezultaty biznesowe",
    ],
    tools: ["Coaching on-the-job", "Feedback 360°", "Monitoring i ewaluacja"],
    icon: Zap,
    accentColor: "#1e3d52",
  },
];

// Single transformation phase card - expanded editorial style
function TransformationPhase({
  phase,
  index,
  isExpanded,
  onToggle,
}: {
  phase: (typeof phases)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const Icon = phase.icon;

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* The main card */}
      <motion.div
        className="relative overflow-hidden rounded-2xl cursor-pointer group"
        style={{
          background: isExpanded
            ? `linear-gradient(135deg, ${phase.accentColor}15 0%, rgba(26,26,26,0.98) 100%)`
            : "rgba(26,26,26,0.6)",
          border: `1px solid ${isExpanded ? phase.accentColor + "40" : "rgba(255,255,255,0.06)"}`,
        }}
        onClick={onToggle}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        {/* Accent line at top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: phase.accentColor }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
        />

        {/* Header section - always visible */}
        <div className="relative p-8 md:p-10">
          <div className="flex items-start justify-between gap-6">
            {/* Left: Number and title */}
            <div className="flex items-start gap-6">
              {/* Large number */}
              <div className="relative">
                <span
                  className="text-[80px] md:text-[100px] font-bold leading-none select-none"
                  style={{ color: `${phase.accentColor}15` }}
                >
                  {phase.number}
                </span>
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={isExpanded ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                >
                  <Icon
                    className="w-10 h-10 md:w-12 md:h-12"
                    style={{ color: phase.accentColor }}
                  />
                </motion.div>
              </div>

              {/* Title block */}
              <div className="pt-4">
                <motion.span
                  className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-3"
                  style={{
                    backgroundColor: `${phase.accentColor}20`,
                    color: phase.accentColor,
                  }}
                >
                  {phase.verb}
                </motion.span>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {phase.title}
                </h3>
                <p className="text-lg text-foreground-secondary italic">
                  „{phase.question}"
                </p>
              </div>
            </div>

            {/* Right: Expand indicator */}
            <motion.div
              className="mt-6 p-3 rounded-full"
              style={{ backgroundColor: `${phase.accentColor}10` }}
              animate={{ rotate: isExpanded ? 90 : 0 }}
            >
              <ChevronRight
                className="w-6 h-6"
                style={{ color: phase.accentColor }}
              />
            </motion.div>
          </div>

          {/* Insight - always visible but truncated when collapsed */}
          <motion.p
            className="mt-6 text-lg text-foreground-secondary leading-relaxed max-w-3xl"
            animate={{ opacity: isExpanded ? 1 : 0.7 }}
          >
            {phase.insight}
          </motion.p>
        </div>

        {/* Expanded content */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="overflow-hidden"
        >
          <div className="px-8 md:px-10 pb-10">
            {/* Divider */}
            <div
              className="w-full h-px mb-8"
              style={{
                background: `linear-gradient(90deg, ${phase.accentColor}40 0%, transparent 100%)`,
              }}
            />

            {/* Two columns */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Outcomes */}
              <div>
                <h4 className="text-sm font-mono text-foreground-muted uppercase tracking-widest mb-5">
                  Co zyskujesz
                </h4>
                <ul className="space-y-4">
                  {phase.outcomes.map((outcome, i) => (
                    <motion.li
                      key={outcome}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isExpanded ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${phase.accentColor}20` }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: phase.accentColor }}
                        />
                      </div>
                      <span className="text-foreground-secondary text-lg">
                        {outcome}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Tools */}
              <div>
                <h4 className="text-sm font-mono text-foreground-muted uppercase tracking-widest mb-5">
                  Nasze narzędzia
                </h4>
                <div className="space-y-3">
                  {phase.tools.map((tool, i) => (
                    <motion.div
                      key={tool}
                      className="px-5 py-4 rounded-xl"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.03)",
                        borderLeft: `3px solid ${phase.accentColor}`,
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isExpanded ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.15 + i * 0.05 }}
                    >
                      <span className="text-foreground text-lg">{tool}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Connecting line to next phase */}
      {index < phases.length - 1 && (
        <div className="flex justify-center py-6">
          <motion.div
            className="w-px h-16 relative"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
            style={{ originY: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${phase.accentColor}60 0%, ${phases[index + 1].accentColor}60 100%)`,
              }}
            />
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: phases[index + 1].accentColor }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// Progress DNA helix - visual connector
function TransformationHelix() {
  const helixRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(helixRef, { once: true });

  return (
    <div ref={helixRef} className="absolute left-8 md:left-16 top-0 bottom-0 hidden lg:block">
      <svg
        className="h-full w-8"
        viewBox="0 0 32 800"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Main vertical line */}
        <motion.path
          d="M16 0 L16 800"
          stroke="url(#helixGradient)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Phase markers */}
        {[160, 400, 640].map((y, i) => (
          <motion.circle
            key={i}
            cx="16"
            cy={y}
            r="6"
            fill={phases[i].accentColor}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.3, duration: 0.4 }}
          />
        ))}

        <defs>
          <linearGradient id="helixGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d5a7b" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#b8860b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e3d52" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const togglePhase = (index: number) => {
    setExpandedPhase(expandedPhase === index ? null : index);
  };

  return (
    <section
      ref={containerRef}
      id="oferta"
      className="relative py-32 md:py-40 bg-background overflow-hidden"
    >
      {/* Subtle background elements */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: backgroundY }}>
        {/* Large gradient orb */}
        <div
          className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-3xl opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(184, 134, 11, 0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(45, 90, 123, 0.1) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-20 md:mb-28">
          <motion.span
            className="inline-block text-sm font-medium tracking-widest uppercase text-[#b8860b] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Model transformacji
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Trzy fazy.{" "}
            <span className="text-foreground-secondary font-normal">
              Jeden cel.
            </span>
          </motion.h2>

          <motion.p
            className="max-w-2xl mx-auto text-lg md:text-xl text-foreground-secondary"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Każda trwała zmiana przechodzi przez świadomość, motywację i działanie.
            Nie ma drogi na skróty — ale jest metoda, która działa.
          </motion.p>
        </div>

        {/* Transformation phases */}
        <div className="relative">
          {/* Visual connector */}
          <TransformationHelix />

          {/* Phase cards */}
          <div className="space-y-0 lg:pl-16">
            {phases.map((phase, index) => (
              <TransformationPhase
                key={phase.id}
                phase={phase}
                index={index}
                isExpanded={expandedPhase === index}
                onToggle={() => togglePhase(index)}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 md:mt-28 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#b8860b]/10 to-transparent border border-[#b8860b]/20">
            <p className="text-xl md:text-2xl text-foreground mb-6 max-w-xl">
              Gotowy, by zobaczyć jak to działa w{" "}
              <span className="text-[#b8860b] font-semibold">Twojej organizacji?</span>
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#b8860b] text-white font-semibold text-lg hover:shadow-2xl hover:shadow-[#b8860b]/30 transition-all hover:scale-[1.02]"
            >
              Porozmawiajmy
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
