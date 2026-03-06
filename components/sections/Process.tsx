"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Target,
  Compass,
  Rocket,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  ArrowRight,
  Zap,
  Shield,
} from "lucide-react";

// Process phases
const phases = [
  {
    id: 1,
    name: "Diagnoza",
    subtitle: "Zrozumienie sytuacji",
    duration: "2-3 tygodnie",
    icon: Search,
    color: "#6366F1",
    description:
      "Dogłębna analiza organizacji, kultury, wyzwań i celów. Wywiady z kluczowymi stakeholderami, przegląd danych, obserwacja.",
    activities: [
      "Wywiady 1:1 z liderami",
      "Analiza dokumentacji i danych",
      "Obserwacja spotkań i procesów",
      "Assessment narzędziami diagnostycznymi",
    ],
    deliverables: [
      "Raport diagnostyczny",
      "Mapa wyzwań i szans",
      "Rekomendacje wstępne",
    ],
    quote: "Nie da się rozwiązać problemu, którego się nie rozumie.",
  },
  {
    id: 2,
    name: "Strategia",
    subtitle: "Projektowanie rozwiązania",
    duration: "1-2 tygodnie",
    icon: Target,
    color: "#b8860b",
    description:
      "Wspólne wypracowanie planu działania. Definiowanie celów, KPI, kamieni milowych i zasobów potrzebnych do transformacji.",
    activities: [
      "Warsztat strategiczny z zarządem",
      "Definiowanie celów i KPI",
      "Mapowanie interesariuszy",
      "Projektowanie interwencji",
    ],
    deliverables: [
      "Plan transformacji",
      "Roadmapa z milestone'ami",
      "Business case i ROI",
    ],
    quote: "Dobry plan to połowa sukcesu.",
  },
  {
    id: 3,
    name: "Wdrożenie",
    subtitle: "Realizacja zmian",
    duration: "3-6 miesięcy",
    icon: Rocket,
    color: "#10B981",
    description:
      "Aktywne wsparcie w implementacji. Coaching liderów, facilitacja warsztatów, budowanie kompetencji zespołu, zarządzanie zmianą.",
    activities: [
      "Coaching indywidualny liderów",
      "Warsztaty zespołowe",
      "Shadowing i feedback",
      "Wsparcie w trudnych sytuacjach",
    ],
    deliverables: [
      "Raporty postępów",
      "Narzędzia i materiały",
      "Przeszkoleni liderzy",
    ],
    quote: "Zmiana dzieje się w działaniu, nie w teorii.",
  },
  {
    id: 4,
    name: "Utrwalenie",
    subtitle: "Zabezpieczenie rezultatów",
    duration: "2-4 tygodnie",
    icon: Shield,
    color: "#8B5CF6",
    description:
      "Transfer wiedzy do organizacji. Budowanie wewnętrznych kompetencji, dokumentacja procesów, przygotowanie do samodzielności.",
    activities: [
      "Szkolenie wewnętrznych championów",
      "Dokumentacja procesów",
      "Sesje follow-up",
      "Ewaluacja i wnioski",
    ],
    deliverables: [
      "Playbook dla organizacji",
      "Raport końcowy",
      "Plan kontynuacji",
    ],
    quote: "Sukces to zmiana, która przetrwa nasz wyjazd.",
  },
];

// Why this process works
const processAdvantages = [
  {
    icon: Zap,
    title: "Oparte na badaniach",
    description: "Każdy krok oparty na badaniach i sprawdzonych metodologiach",
  },
  {
    icon: Users,
    title: "Partnerskie",
    description: "Pracujemy Z organizacją, nie NAD organizacją",
  },
  {
    icon: Target,
    title: "Mierzalne",
    description: "Jasne KPI i mierzalne rezultaty na każdym etapie",
  },
  {
    icon: TrendingUp,
    title: "Trwałe",
    description: "Zmiany, które przetrwają długo po zakończeniu projektu",
  },
];

// Phase Card Component
function PhaseCard({
  phase,
  index,
  isActive,
  onClick,
}: {
  phase: typeof phases[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = phase.icon;

  return (
    <motion.div
      className={`relative cursor-pointer group ${
        isActive ? "z-10" : "z-0"
      }`}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Connector line */}
      {index < phases.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 left-full w-full h-px z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-white/20 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      )}

      {/* Card */}
      <motion.div
        className={`relative p-6 rounded-2xl border transition-all duration-500 ${
          isActive
            ? "bg-white/[0.05] border-white/20"
            : "bg-white/[0.02] border-white/[0.05] hover:border-white/10"
        }`}
        whileHover={{ y: -4 }}
      >
        {/* Phase number */}
        <div
          className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            isActive
              ? "bg-[#b8860b] text-white"
              : "bg-white/10 text-white/50"
          }`}
        >
          {phase.id}
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
            style={{ color: isActive ? phase.color : "rgba(255,255,255,0.4)" }}
          />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-1">{phase.name}</h3>
        <p className="text-sm text-white/40 mb-3">{phase.subtitle}</p>

        {/* Duration badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-xs text-white/50">
          <Clock className="w-3 h-3" />
          {phase.duration}
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-px h-8 bg-gradient-to-b from-[#b8860b] to-transparent mx-auto" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Phase Detail Component
function PhaseDetail({ phase, t }: { phase: typeof phases[0]; t: (key: string) => string }) {
  const Icon = phase.icon;

  return (
    <motion.div
      key={phase.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${phase.color}20` }}
            >
              <Icon className="w-8 h-8" style={{ color: phase.color }} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {phase.name}: {phase.subtitle}
              </h3>
              <p className="text-lg text-white/60 leading-relaxed">
                {phase.description}
              </p>
            </div>
          </div>

          {/* Activities */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <h4 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("activities")}
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {phase.activities.map((activity, i) => (
                <motion.div
                  key={activity}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <CheckCircle2
                    className="w-5 h-5 shrink-0"
                    style={{ color: phase.color }}
                  />
                  <span className="text-sm text-white/70">{activity}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="relative pl-6 border-l-2" style={{ borderColor: phase.color }}>
            <p className="text-xl italic text-white/50">"{phase.quote}"</p>
          </div>
        </div>

        {/* Deliverables sidebar */}
        <div className="space-y-6">
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: `${phase.color}10` }}
          >
            <h4 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t("deliverables")}
            </h4>
            <ul className="space-y-3">
              {phase.deliverables.map((deliverable, i) => (
                <motion.li
                  key={deliverable}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <ArrowRight
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: phase.color }}
                  />
                  <span className="text-sm text-white/70">{deliverable}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Duration highlight */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {phase.duration}
            </div>
            <div className="text-sm text-white/40">{t("subtitle")}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Timeline visualization for mobile
function MobileTimeline({ activePhase, setActivePhase }: {
  activePhase: number;
  setActivePhase: (id: number) => void;
}) {
  return (
    <div className="lg:hidden mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2" />
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#b8860b] to-[#d4a94d] -translate-y-1/2"
          initial={{ width: "0%" }}
          animate={{ width: `${((activePhase - 1) / (phases.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />

        {/* Phase dots */}
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            className="relative z-10"
          >
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                activePhase >= phase.id
                  ? "bg-[#b8860b] text-white"
                  : "bg-[#1a1a1f] border-2 border-white/20 text-white/50"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {phase.id}
            </motion.div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className={`text-xs font-medium ${
                activePhase === phase.id ? "text-[#b8860b]" : "text-white/40"
              }`}>
                {phase.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Process() {
  const t = useTranslations("process");
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activePhase, setActivePhase] = useState(1);

  return (
    <section
      ref={containerRef}
      id="proces"
      className="relative py-20 sm:py-28 md:py-32 lg:py-40 bg-[#0a0a0f] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="hidden md:block absolute top-0 left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#b8860b]/5 rounded-full blur-[200px]" />
        <div className="hidden md:block absolute bottom-0 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#6366F1]/5 rounded-full blur-[150px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
            <span className="px-5 py-2.5 rounded-full border border-[#b8860b]/30 bg-[#b8860b]/5 text-sm font-medium text-[#b8860b] uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-4 h-4" />
              {t("tagline")}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-[#b8860b] via-[#d4a94d] to-[#b8860b] bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Mobile Timeline */}
        <MobileTimeline activePhase={activePhase} setActivePhase={setActivePhase} />

        {/* Phase Cards - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 mb-16">
          {phases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              index={index}
              isActive={activePhase === phase.id}
              onClick={() => setActivePhase(phase.id)}
            />
          ))}
        </div>

        {/* Active Phase Detail */}
        <motion.div
          className="mt-16 lg:mt-8 p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.05]"
          layout
        >
          <PhaseDetail phase={phases.find((p) => p.id === activePhase)!} t={t} />
        </motion.div>

        {/* Process Advantages */}
        <motion.div
          className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {processAdvantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={advantage.title}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#b8860b]/20 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#b8860b]/10 flex items-center justify-center mb-4 group-hover:bg-[#b8860b]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#b8860b]" />
                </div>
                <h4 className="font-semibold text-white mb-2">{advantage.title}</h4>
                <p className="text-sm text-white/40">{advantage.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Total Duration Banner */}
        <motion.div
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#b8860b]/10 via-[#b8860b]/5 to-[#b8860b]/10 border border-[#b8860b]/20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#b8860b] mb-2">
                4-8 miesięcy
              </div>
              <div className="text-white/50">Typowy czas pełnej transformacji</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10" />
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                ROI 300%+
              </div>
              <div className="text-white/50">Średni zwrot z inwestycji</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-white/10" />
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                95%
              </div>
              <div className="text-white/50">Projektów zakończonych sukcesem</div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-white/40 mb-6">
            Chcesz zobaczyć, jak ten proces zadziała w Twojej organizacji?
          </p>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#b8860b] text-white font-semibold hover:bg-[#d4a94d] transition-all hover:scale-[1.02]"
          >
            Umów bezpłatną konsultację
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
