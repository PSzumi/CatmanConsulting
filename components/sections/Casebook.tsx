"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Factory,
  ShoppingBag,
  Laptop,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Case studies data
const caseStudies = [
  {
    id: 1,
    company: "Firma produkcyjna",
    industry: "Produkcja",
    employeeCount: "120 pracowników",
    icon: Factory,
    challenge: "Konflikty między działami",
    challengeFull:
      "Produkcja, sprzedaż i logistyka działały jak osobne królestwa. Komunikacja przez służbowe notatki, wzajemne obwinianie za problemy.",
    duration: "6 miesięcy",
    metric: "+40%",
    metricLabel: "efektywności współpracy",
    resultDescription:
      "Zespoły zaczęły rozmawiać. Wspólne cele, regularne spotkania, jasne kontrakty między działami.",
    outcomes: ["Wspólne KPI", "Kultura feedbacku", "Szybsze decyzje"],
    testimonial: {
      quote:
        "Tomek i Mariusz pomogli nam zbudować kulturę, w której ludzie naprawdę ze sobą rozmawiają. Efekty widać w wynikach.",
      author: "Anna K.",
      role: "CEO",
    },
    accentColor: "#2d5a7b",
    image: "/images/case-production.jpg",
  },
  {
    id: 2,
    company: "Sieć retail",
    industry: "Handel",
    employeeCount: "45 managerów",
    icon: ShoppingBag,
    challenge: "Rotacja managerów 35% rocznie",
    challengeFull:
      "Co trzeci manager odchodził w ciągu roku. Brak spójnego przywództwa, każdy sklep działał inaczej, chaos w standardach.",
    duration: "12 miesięcy",
    metric: "-60%",
    metricLabel: "rotacji kadry",
    resultDescription:
      "Stworzony system rozwoju liderów, jasne ścieżki kariery, wspólny język przywództwa w całej sieci.",
    outcomes: ["Program mentoringowy", "Ścieżki kariery", "Spójne przywództwo"],
    testimonial: {
      quote:
        "Konkretne narzędzia, które działają. Żadnego lania wody – same konkrety.",
      author: "Marek W.",
      role: "HR Director",
    },
    accentColor: "#b8860b",
    image: "/images/case-retail.jpg",
  },
  {
    id: 3,
    company: "Firma technologiczna",
    industry: "IT",
    employeeCount: "80 osób",
    icon: Laptop,
    challenge: "Zespoły zdalne nie współpracują",
    challengeFull:
      "Po pandemii – izolacja, brak spontanicznych rozmów, decyzje podejmowane w silosach, spadająca innowacyjność.",
    duration: "4 miesiące",
    metric: "+35%",
    metricLabel: "produktywności",
    resultDescription:
      "Wdrożona kultura transparentności, nowe rytuały zespołowe, narzędzia do asynchronicznej współpracy.",
    outcomes: ["Kultura transparentności", "Rytuały zespołowe", "Nowe narzędzia"],
    testimonial: null,
    accentColor: "#1e3d52",
    image: "/images/case-tech.jpg",
  },
];

// Summary stats
const summaryStats = [
  { value: "100+", label: "Projektów" },
  { value: "50+", label: "Firm" },
  { value: "35+", label: "Lat doświadczenia" },
  { value: "95%", label: "Poleca nas" },
];

// Single case study slide component
function CaseStudySlide({
  study,
  isActive,
  t,
}: {
  study: (typeof caseStudies)[0];
  isActive: boolean;
  t: (key: string) => string;
}) {
  const Icon = study.icon;

  return (
    <motion.div
      className="relative min-w-[85vw] md:min-w-[70vw] lg:min-w-[60vw] h-[600px] md:h-[650px] mx-4 first:ml-[10vw] last:mr-[10vw]"
      animate={{
        scale: isActive ? 1 : 0.95,
        opacity: isActive ? 1 : 0.5,
      }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="relative h-full rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${study.accentColor}15 0%, rgba(20,20,20,0.98) 50%, rgba(15,15,15,1) 100%)`,
          border: `1px solid ${study.accentColor}25`,
        }}
      >
        {/* Decorative gradient orb */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            background: `radial-gradient(circle, ${study.accentColor}40 0%, transparent 70%)`,
          }}
        />

        {/* Content grid */}
        <div className="relative h-full grid lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
          {/* Left column - Info */}
          <div className="flex flex-col justify-between">
            {/* Header */}
            <div>
              {/* Industry badge */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${study.accentColor}20`,
                    color: study.accentColor,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {study.industry}
                </span>
                <span className="text-sm text-foreground-muted">
                  {study.employeeCount}
                </span>
              </div>

              {/* Company name */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                {study.company}
              </h3>

              {/* Challenge */}
              <div className="mb-8">
                <p className="text-sm uppercase tracking-widest text-foreground-muted mb-2">
                  {t("challenge")}
                </p>
                <p className="text-xl md:text-2xl font-semibold text-foreground mb-3">
                  {study.challenge}
                </p>
                <p className="text-foreground-secondary leading-relaxed">
                  {study.challengeFull}
                </p>
              </div>
            </div>

            {/* Outcomes */}
            <div className="flex flex-wrap gap-2">
              {study.outcomes.map((outcome) => (
                <span
                  key={outcome}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-foreground-secondary border border-white/10"
                >
                  {outcome}
                </span>
              ))}
            </div>
          </div>

          {/* Right column - Result & Testimonial */}
          <div className="flex flex-col justify-between">
            {/* Big metric */}
            <div
              className="p-8 rounded-2xl"
              style={{ backgroundColor: `${study.accentColor}12` }}
            >
              <p className="text-sm uppercase tracking-widest text-foreground-muted mb-4">
                {t("results")} {study.duration}
              </p>
              <div className="flex items-end gap-4">
                <span
                  className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none"
                  style={{ color: study.accentColor }}
                >
                  {study.metric}
                </span>
                <span className="text-xl md:text-2xl text-foreground-secondary pb-2">
                  {study.metricLabel}
                </span>
              </div>
              <p className="mt-6 text-foreground-secondary leading-relaxed">
                {study.resultDescription}
              </p>
            </div>

            {/* Testimonial */}
            {study.testimonial && (
              <div className="mt-8">
                <div className="flex items-start gap-4">
                  <Quote
                    className="w-8 h-8 shrink-0 mt-1"
                    style={{ color: `${study.accentColor}50` }}
                  />
                  <div>
                    <blockquote className="text-lg text-foreground italic leading-relaxed mb-4">
                      „{study.testimonial.quote}"
                    </blockquote>
                    <footer className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: `${study.accentColor}30`,
                          color: study.accentColor,
                        }}
                      >
                        {study.testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {study.testimonial.author}
                        </p>
                        <p className="text-sm text-foreground-muted">
                          {study.testimonial.role}
                        </p>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Casebook() {
  const t = useTranslations("casebook");
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll navigation
  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const slides = scrollRef.current.children;
    if (slides[index]) {
      const slide = slides[index] as HTMLElement;
      const scrollLeft = slide.offsetLeft - window.innerWidth * 0.1;
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const slideWidth = window.innerWidth * 0.7;
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < caseStudies.length) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <section
      ref={containerRef}
      id="casebook"
      className="relative py-24 md:py-32 bg-background"
    >
      {/* Background subtle gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>

      {/* Header */}
      <div ref={headerRef} className="max-w-6xl mx-auto px-6 mb-16 md:mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <motion.span
              className="inline-block text-sm font-medium tracking-[0.2em] uppercase text-accent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {t("tagline")}
            </motion.span>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t("title")}
              <br />
              <span className="text-foreground-secondary font-normal">
                {t("titleHighlight")}
              </span>
            </motion.h2>
          </div>

          {/* Navigation arrows */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => scrollToSlide(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                scrollToSlide(Math.min(caseStudies.length - 1, activeIndex + 1))
              }
              disabled={activeIndex === caseStudies.length - 1}
              className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <span className="ml-4 text-sm text-foreground-muted font-mono">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(caseStudies.length).padStart(2, "0")}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {caseStudies.map((study, index) => (
          <div key={study.id} className="snap-center">
            <CaseStudySlide study={study} isActive={index === activeIndex} t={t} />
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {caseStudies.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-8 bg-accent"
                : "w-2 bg-foreground-muted/30 hover:bg-foreground-muted/50"
            }`}
          />
        ))}
      </div>

      {/* Summary stats */}
      <div className="max-w-6xl mx-auto px-6 mt-24 md:mt-32">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {summaryStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="text-4xl md:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-foreground-muted">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xl text-foreground-secondary mb-8">
            {t("subtitle")}
          </p>
          <a
            href="#kontakt"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-white font-semibold text-lg hover:shadow-2xl hover:shadow-accent/30 transition-all hover:scale-[1.02]"
          >
            {t("cta")}
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
