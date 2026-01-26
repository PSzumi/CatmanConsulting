"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Users,
  Target,
  Sparkles,
  GraduationCap,
  ArrowRight,
  X,
  Zap,
  TrendingUp,
  Building2,
  UserCheck,
  Layers,
} from "lucide-react";

// Golden ratio constant
const PHI = 1.618;

// Responsive Golden Ratio Grid component
function GoldenRatioGrid({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const gridStyle: React.CSSProperties = isDesktop
    ? {
        display: "grid",
        gridTemplateColumns: `${PHI}fr 1fr ${PHI}fr`,
        gridTemplateRows: `${PHI}fr 1fr`,
        gridTemplateAreas: `"a a b" "c d e"`,
        gap: "1.5rem",
        minHeight: "85vh",
      }
    : {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateAreas: `"a" "b" "c" "d" "e"`,
        gap: "1rem",
      };

  return <div style={gridStyle}>{children}</div>;
}

// Service data with comprehensive details
const services = [
  {
    id: "diagnoza",
    title: "Diagnoza organizacji",
    subtitle: "Odkryj prawdziwy potencjał",
    icon: Search,
    color: "#b8860b",
    secondaryColor: "#d4a84b",
    description:
      "Kompleksowa analiza kultury organizacyjnej, procesów i kompetencji. Identyfikujemy ukryte bariery i niewykorzystane możliwości rozwoju.",
    details: [
      "Wywiady diagnostyczne z kluczowymi interesariuszami",
      "Analiza procesów decyzyjnych i komunikacyjnych",
      "Mapowanie kultury organizacyjnej",
      "Identyfikacja luk kompetencyjnych",
      "Raport z rekomendacjami strategicznymi",
    ],
    idealFor: ["Zarząd", "HR", "Firmy w transformacji"],
    duration: "2-4 tygodnie",
    impact: 95,
    relatedServices: ["transformacja", "warsztaty"],
  },
  {
    id: "coaching",
    title: "Executive Coaching",
    subtitle: "Rozwój liderów",
    icon: Target,
    color: "#6366f1",
    secondaryColor: "#818cf8",
    description:
      "Indywidualny coaching dla kadry zarządzającej. Rozwijamy kompetencje przywódcze, wspieramy w podejmowaniu trudnych decyzji i budowaniu autorytetu.",
    details: [
      "Sesje 1:1 z certyfikowanym coachem ICF",
      "Diagnoza stylu przywódczego",
      "Praca nad kluczowymi wyzwaniami",
      "Feedback 360° i plan rozwoju",
      "Wsparcie między sesjami",
    ],
    idealFor: ["CEO", "Dyrektorzy", "Menedżerowie"],
    duration: "3-12 miesięcy",
    impact: 92,
    relatedServices: ["diagnoza", "zespoly"],
  },
  {
    id: "zespoly",
    title: "Team Coaching",
    subtitle: "Budowanie zespołów",
    icon: Users,
    color: "#10b981",
    secondaryColor: "#34d399",
    description:
      "Przekształcamy grupy ludzi w zintegrowane, wysokowydajne zespoły. Pracujemy nad komunikacją, zaufaniem i wspólnymi celami.",
    details: [
      "Warsztaty team buildingowe",
      "Coaching zespołowy i facylitacja",
      "Rozwiązywanie konfliktów",
      "Budowanie kultury feedbacku",
      "Wzmacnianie współpracy międzydziałowej",
    ],
    idealFor: ["Zespoły projektowe", "Zarządy", "Działy"],
    duration: "1-6 miesięcy",
    impact: 88,
    relatedServices: ["coaching", "warsztaty"],
  },
  {
    id: "transformacja",
    title: "Change Management",
    subtitle: "Wsparcie w transformacji",
    icon: Sparkles,
    color: "#f59e0b",
    secondaryColor: "#fbbf24",
    description:
      "Towarzyszymy organizacjom w procesie głębokich zmian. Od strategii, przez wdrożenie, po utrwalenie nowych nawyków.",
    details: [
      "Projektowanie strategii zmiany",
      "Budowanie koalicji na rzecz zmiany",
      "Komunikacja i angażowanie pracowników",
      "Monitoring postępów i adaptacja",
      "Coaching liderów zmiany",
    ],
    idealFor: ["Organizacje w transformacji", "M&A", "Restrukturyzacje"],
    duration: "6-18 miesięcy",
    impact: 90,
    relatedServices: ["diagnoza", "coaching"],
  },
  {
    id: "warsztaty",
    title: "Warsztaty i szkolenia",
    subtitle: "Rozwój kompetencji",
    icon: GraduationCap,
    color: "#ec4899",
    secondaryColor: "#f472b6",
    description:
      "Praktyczne warsztaty rozwijające kluczowe umiejętności miękkie. Od komunikacji, przez zarządzanie czasem, po trudne rozmowy.",
    details: [
      "Szkolenia szyte na miarę",
      "Warsztaty z komunikacji i prezentacji",
      "Zarządzanie konfliktem i stresem",
      "Feedback i trudne rozmowy",
      "Train the trainer",
    ],
    idealFor: ["Zespoły", "Menedżerowie", "Talenty"],
    duration: "1-5 dni",
    impact: 85,
    relatedServices: ["zespoly", "coaching"],
  },
];

// Floating particles background
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
    xOffset: number;
  }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        opacity: 0.1 + Math.random() * 0.2,
        xOffset: Math.random() * 20 - 10,
      }))
    );
  }, []);

  if (particles.length === 0) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `rgba(184, 134, 11, ${particle.opacity})`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated icon component
function AnimatedIcon({
  Icon,
  color,
  isHovered,
  size = "normal",
}: {
  Icon: React.ElementType;
  color: string;
  isHovered: boolean;
  size?: "normal" | "large";
}) {
  const iconSize = size === "large" ? "w-10 h-10" : "w-7 h-7";
  const containerSize = size === "large" ? "w-20 h-20" : "w-14 h-14";
  const glowSize = size === "large" ? "w-24 h-24" : "w-16 h-16";

  return (
    <motion.div
      className={`relative ${glowSize} flex items-center justify-center`}
      animate={{
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl"
        style={{ backgroundColor: color }}
        animate={{
          opacity: isHovered ? 0.4 : 0.1,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon container */}
      <motion.div
        className={`relative ${containerSize} rounded-2xl flex items-center justify-center`}
        style={{
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          border: `1px solid ${color}40`,
        }}
        animate={{
          borderColor: isHovered ? `${color}80` : `${color}40`,
        }}
      >
        <Icon
          className={iconSize}
          style={{ color }}
          strokeWidth={2}
        />
      </motion.div>
    </motion.div>
  );
}

// Golden ratio service card
function ServiceCard({
  service,
  index,
  onSelect,
  gridArea,
  t,
}: {
  service: (typeof services)[0];
  index: number;
  onSelect: () => void;
  gridArea: string;
  t: (key: string) => string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, []);

  const Icon = service.icon;
  const isLarge = index < 2; // First two cards are larger (golden ratio)

  return (
    <motion.div
      ref={cardRef}
      className="relative group h-full"
      style={{ gridArea }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      <motion.div
        className="relative h-full overflow-hidden rounded-3xl cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePosition({ x: 0.5, y: 0.5 });
        }}
        onMouseMove={handleMouseMove}
        onClick={onSelect}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Glassmorphism background */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${service.color}10 0%, rgba(10, 10, 15, 0.95) 100%)`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />

        {/* Gradient border */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            padding: "1px",
            background: isHovered
              ? `linear-gradient(135deg, ${service.color}60 0%, ${service.secondaryColor}40 50%, ${service.color}20 100%)`
              : "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={{
            opacity: isHovered ? 1 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Spotlight effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${service.color}20, transparent 40%)`,
            }}
          />
        )}

        {/* Card content */}
        <div className={`relative h-full flex flex-col ${isLarge ? 'p-5 sm:p-6 md:p-8 lg:p-10' : 'p-4 sm:p-5 md:p-6 lg:p-8'}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <AnimatedIcon
              Icon={Icon}
              color={service.color}
              isHovered={isHovered}
              size={isLarge ? "large" : "normal"}
            />

            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: `${service.color}15`,
                border: `1px solid ${service.color}30`,
              }}
              animate={{ scale: isHovered ? 1.05 : 1 }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: service.color }} />
              <span className="text-xs font-medium" style={{ color: service.color }}>
                {service.duration}
              </span>
            </motion.div>
          </div>

          {/* Title & Subtitle */}
          <div className="flex-1">
            <motion.p
              className="text-sm font-medium uppercase tracking-wider mb-2"
              style={{ color: service.color }}
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {service.subtitle}
            </motion.p>
            <h3 className={`font-bold text-white mb-3 ${isLarge ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
              {service.title}
            </h3>
            <p className={`text-white/60 leading-relaxed ${isLarge ? 'text-base' : 'text-sm'}`}>
              {service.description}
            </p>
          </div>

          {/* Tags - only show on large cards */}
          {isLarge && (
            <div className="flex flex-wrap gap-2 my-4">
              {service.idealFor.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 text-white/50 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors mt-auto"
            style={{
              background: isHovered ? service.color : `${service.color}15`,
              color: isHovered ? "#0a0a0f" : service.color,
            }}
            whileTap={{ scale: 0.98 }}
          >
            {t("learnMore")}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Modal popup for service details
function ServiceModal({
  service,
  onClose,
  t,
}: {
  service: (typeof services)[0];
  onClose: () => void;
  t: (key: string) => string;
}) {
  const Icon = service.icon;

  const relatedServicesData = service.relatedServices
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as typeof services;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal content */}
      <motion.div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${service.color}15 0%, rgba(10, 10, 15, 0.98) 30%, rgba(10, 10, 15, 0.98) 70%, ${service.secondaryColor}10 100%)`,
          }}
        />

        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            padding: "1px",
            background: `linear-gradient(135deg, ${service.color}60 0%, ${service.secondaryColor}40 50%, ${service.color}20 100%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Content */}
        <div className="relative p-8 md:p-12">
          {/* Close button */}
          <motion.button
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>

          {/* Header */}
          <div className="flex items-center gap-6 mb-10">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${service.color}30 0%, ${service.color}10 100%)`,
                border: `2px solid ${service.color}50`,
              }}
            >
              <Icon className="w-10 h-10" style={{ color: service.color }} />
            </div>
            <div>
              <p className="text-lg font-medium mb-1" style={{ color: service.color }}>
                {service.subtitle}
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-white">{service.title}</h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-white/70 mb-10 leading-relaxed">
            {service.description}
          </p>

          {/* Details grid */}
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            {/* What we do */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/40 mb-5">
                <Layers className="w-4 h-4" />
                {t("includes")}
              </h4>
              <ul className="space-y-4">
                {service.details.map((detail, i) => (
                  <motion.li
                    key={detail}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${service.color}20` }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: service.color }}
                      />
                    </div>
                    <span className="text-white/70">{detail}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Stats & Info */}
            <div className="space-y-8">
              {/* Ideal for */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/40 mb-4">
                  <UserCheck className="w-4 h-4" />
                  {t("idealFor")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.idealFor.map((tag, i) => (
                    <motion.span
                      key={tag}
                      className="px-4 py-2 text-sm font-medium rounded-xl"
                      style={{
                        background: `${service.color}15`,
                        color: service.color,
                        border: `1px solid ${service.color}30`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/40 mb-4">
                  <Zap className="w-4 h-4" />
                  {t("duration")}
                </h4>
                <div
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl"
                  style={{
                    background: `${service.color}10`,
                    border: `1px solid ${service.color}30`,
                  }}
                >
                  <span className="text-2xl font-bold" style={{ color: service.color }}>
                    {service.duration}
                  </span>
                </div>
              </div>

              {/* Impact */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/40 mb-4">
                  <TrendingUp className="w-4 h-4" />
                  {t("effectiveness")}
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${service.color} 0%, ${service.secondaryColor} 100%)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${service.impact}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-2xl font-bold" style={{ color: service.color }}>
                    {service.impact}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Related services */}
          <div className="mb-10">
            <h4 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/40 mb-4">
              <Building2 className="w-4 h-4" />
              {t("relatedServices")}
            </h4>
            <div className="flex flex-wrap gap-3">
              {relatedServicesData.map((related, i) => {
                const RelatedIcon = related.icon;
                return (
                  <motion.button
                    key={related.id}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{
                      background: `${related.color}15`,
                      borderColor: `${related.color}30`,
                    }}
                  >
                    <RelatedIcon className="w-5 h-5" style={{ color: related.color }} />
                    <span className="text-white/70 font-medium">{related.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#kontakt"
              className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${service.color} 0%, ${service.secondaryColor} 100%)`,
                color: "#0a0a0f",
                boxShadow: `0 10px 40px ${service.color}40`,
              }}
              onClick={onClose}
            >
              {t("askDetails")}
              <ArrowRight className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="px-8 py-4 rounded-xl font-semibold text-lg bg-white/5 text-white/70 hover:bg-white/10 transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Services component with Golden Ratio grid
export function Services() {
  const t = useTranslations("services");
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const selectedServiceData = services.find((s) => s.id === selectedService);

  // Golden ratio grid layout:
  // Row 1: 2 large cards (φ ratio width split)
  // Row 2: 3 equal cards
  // Total height ratio between rows is also φ
  const gridAreas = [
    "a", // Large left (φ portion)
    "b", // Large right (1 portion)
    "c", // Bottom left
    "d", // Bottom center
    "e", // Bottom right
  ];

  return (
    <section
      ref={containerRef}
      id="oferta"
      className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      {/* Background elements */}
      <FloatingParticles />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        {/* Large gradient orbs */}
        <div
          className="hidden md:block absolute top-0 left-1/4 w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] rounded-full blur-[120px] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(184, 134, 11, 0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="hidden md:block absolute bottom-0 right-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full blur-[100px] opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)",
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-16 md:mb-20">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(184, 134, 11, 0.1)",
              border: "1px solid rgba(184, 134, 11, 0.2)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-[#b8860b]" />
            <span className="text-sm font-medium tracking-wider uppercase text-[#b8860b]">
              {t("tagline")}
            </span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t("title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8860b] to-[#d4a84b]">
              {t("titleHighlight")}
            </span>
          </motion.h2>

          <motion.p
            className="max-w-2xl mx-auto text-lg md:text-xl text-white/60"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("description")}
          </motion.p>
        </div>

        {/* Golden Ratio Services Grid */}
        <GoldenRatioGrid>
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onSelect={() => setSelectedService(service.id)}
              gridArea={gridAreas[index]}
              t={t}
            />
          ))}
        </GoldenRatioGrid>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 md:mt-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="inline-block p-8 md:p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(10, 10, 15, 0.95) 100%)",
              border: "1px solid rgba(184, 134, 11, 0.2)",
            }}
          >
            {/* Glow effect */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] blur-[100px] opacity-30"
              style={{ background: "#b8860b" }}
            />

            <div className="relative">
              <p className="text-xl md:text-2xl text-white mb-6 max-w-xl">
                {t("cta")}{" "}
                <span className="text-[#b8860b] font-semibold">
                  {t("ctaHighlight")}
                </span>
              </p>
              <a
                href="#kontakt"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)",
                  color: "#0a0a0f",
                  boxShadow: "0 15px 50px rgba(184, 134, 11, 0.4)",
                }}
              >
                {t("ctaButton")}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Service detail modal */}
      <AnimatePresence>
        {selectedServiceData && (
          <ServiceModal
            key={selectedServiceData.id}
            service={selectedServiceData}
            onClose={() => setSelectedService(null)}
            t={t}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
