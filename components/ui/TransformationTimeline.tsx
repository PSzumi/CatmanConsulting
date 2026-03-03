"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Eye, Flame, Rocket, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelinePhase {
  id: number;
  icon: typeof Eye;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  activities: string[];
  deliverables: string[];
  color: string;
}

const phases: TimelinePhase[] = [
  {
    id: 1,
    icon: Eye,
    title: "Świadomość",
    subtitle: "Diagnoza i zrozumienie",
    duration: "2-4 tygodnie",
    description:
      "Rozpoczynamy od głębokiego zrozumienia Twojej organizacji. Wywiady, obserwacje i analiza danych ujawniają prawdziwy obraz sytuacji.",
    activities: [
      "Wywiady z kluczowymi osobami",
      "Analiza procesów i struktur",
      "Badanie kultury organizacyjnej",
      "Identyfikacja wzorców i blokerów",
    ],
    deliverables: [
      "Raport diagnostyczny",
      "Mapa interesariuszy",
      "Analiza gap",
    ],
    color: "#2d5a7b",
  },
  {
    id: 2,
    icon: Flame,
    title: "Motywacja",
    subtitle: "Cel i zaangażowanie",
    duration: "2-3 tygodnie",
    description:
      "Wspólnie definiujemy cel transformacji i budujemy zaangażowanie kluczowych osób. Bez motywacji nie ma trwałej zmiany.",
    activities: [
      "Warsztaty wizji i celów",
      "Budowanie koalicji zmiany",
      "Design rozwiązań",
      "Planowanie komunikacji",
    ],
    deliverables: [
      "Strategia transformacji",
      "Plan działania",
      "KPIs sukcesu",
    ],
    color: "#b8860b",
  },
  {
    id: 3,
    icon: Rocket,
    title: "Zmiana",
    subtitle: "Wdrożenie i utrwalenie",
    duration: "3-6 miesięcy",
    description:
      "Towarzyszymy w procesie wdrożenia. Szkolenia, coaching, wsparcie on-the-job — do momentu, gdy zmiana staje się nową normą.",
    activities: [
      "Szkolenia i warsztaty",
      "Coaching liderów",
      "Wsparcie wdrożeniowe",
      "Monitorowanie postępów",
    ],
    deliverables: [
      "Nowe kompetencje zespołu",
      "Zmienione procesy",
      "Utrwalone nawyki",
    ],
    color: "#10b981",
  },
];

interface PhaseCardProps {
  phase: TimelinePhase;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

function PhaseCard({ phase, index, isActive, isCompleted, onClick }: PhaseCardProps) {
  const Icon = phase.icon;

  return (
    <motion.div
      className={cn(
        "relative p-6 rounded-2xl cursor-pointer transition-all duration-500",
        "border-2",
        isActive
          ? "border-current bg-current/5"
          : isCompleted
          ? "border-gray-700 bg-gray-900/30"
          : "border-gray-800 bg-gray-900/20 hover:border-gray-700"
      )}
      style={{
        borderColor: isActive ? phase.color : undefined,
        backgroundColor: isActive ? `${phase.color}08` : undefined,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Phase number badge */}
      <div
        className={cn(
          "absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
          isActive || isCompleted ? "text-white" : "text-gray-500 bg-gray-800"
        )}
        style={{
          backgroundColor: isActive || isCompleted ? phase.color : undefined,
        }}
      >
        {isCompleted ? <Check className="w-4 h-4" /> : phase.id}
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
        style={{
          backgroundColor: isActive ? `${phase.color}20` : "rgba(255,255,255,0.05)",
        }}
      >
        <Icon
          className="w-7 h-7 transition-colors duration-300"
          style={{ color: isActive ? phase.color : "#6b7280" }}
        />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-1">{phase.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{phase.subtitle}</p>

      {/* Duration badge */}
      <div
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-4"
        style={{
          backgroundColor: `${phase.color}15`,
          color: phase.color,
        }}
      >
        {phase.duration}
      </div>

      {/* Description - show only when active */}
      <motion.div
        initial={false}
        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {phase.description}
        </p>

        {/* Activities */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Działania
          </p>
          <ul className="space-y-1">
            {phase.activities.map((activity) => (
              <li key={activity} className="flex items-center gap-2 text-sm text-gray-300">
                <ChevronRight className="w-3 h-3" style={{ color: phase.color }} />
                {activity}
              </li>
            ))}
          </ul>
        </div>

        {/* Deliverables */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Rezultaty
          </p>
          <div className="flex flex-wrap gap-2">
            {phase.deliverables.map((item) => (
              <span
                key={item}
                className="px-2 py-1 rounded-lg text-xs"
                style={{
                  backgroundColor: `${phase.color}15`,
                  color: phase.color,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Expand indicator */}
      {!isActive && (
        <p className="text-xs text-gray-600 mt-2">Kliknij, aby rozwinąć</p>
      )}
    </motion.div>
  );
}

export function TransformationTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activePhase, setActivePhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const progressWidth = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative">
      {/* Section header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b8860b]/10 text-[#b8860b] text-sm font-medium mb-4">
          Proces transformacji
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Jak przeprowadzamy <span className="text-[#b8860b]">zmianę</span>
        </h2>
        <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
          Sprawdzony model w trzech fazach. Każdy etap buduje na poprzednim,
          prowadząc do trwałej transformacji.
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="relative h-1 bg-gray-800 rounded-full mb-12 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#2d5a7b] via-[#b8860b] to-[#10b981]"
          style={{ width: progressWidth }}
        />
        {/* Phase markers */}
        <div className="absolute inset-0 flex justify-between items-center px-[16%]">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              className={cn(
                "w-4 h-4 rounded-full border-2 bg-background transition-all duration-300",
                index <= activePhase ? "border-current scale-125" : "border-gray-600"
              )}
              style={{
                borderColor: index <= activePhase ? phase.color : undefined,
                backgroundColor: index < activePhase ? phase.color : undefined,
              }}
              whileHover={{ scale: 1.5 }}
              onClick={() => setActivePhase(index)}
            />
          ))}
        </div>
      </div>

      {/* Phase cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <PhaseCard
              phase={phase}
              index={index}
              isActive={index === activePhase}
              isCompleted={index < activePhase}
              onClick={() => setActivePhase(index)}
            />
          </motion.div>
        ))}
      </div>

      {/* Navigation hint */}
      <motion.p
        className="text-center text-sm text-gray-600 mt-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        Kliknij w fazę, aby zobaczyć szczegóły
      </motion.p>
    </div>
  );
}
