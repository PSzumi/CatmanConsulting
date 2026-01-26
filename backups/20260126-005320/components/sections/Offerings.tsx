"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Compass,
  Users,
  RefreshCw,
  Building2,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

// Premium service packages from brief
const packages = [
  {
    id: "diagnostyka",
    name: "Diagnostyka 360°",
    subtitle: "Light",
    duration: "2 tygodnie",
    description:
      "Szybka, precyzyjna diagnoza sytuacji organizacyjnej. Fundament każdej skutecznej zmiany.",
    deliverables: [
      "5–7 pogłębionych rozmów 1:1",
      "Raport A4 z kluczowymi wnioskami",
      "Mapa działań na 90 dni",
    ],
    icon: Compass,
    featured: false,
  },
  {
    id: "lider",
    name: "Lider 2.0",
    subtitle: "Rozwój kompetencji",
    duration: "1 dzień + 2 sesje",
    description:
      "Intensywny program dla liderów. Rozmowy trudne, feedback, budowanie odpowiedzialności.",
    deliverables: [
      "Warsztat jednodniowy (8h)",
      "2 sesje follow-up online",
      "Toolkit praktycznych narzędzi",
    ],
    icon: Users,
    featured: true,
  },
  {
    id: "team-reset",
    name: "Team Reset",
    subtitle: "Interwencja zespołowa",
    duration: "2 dni",
    description:
      "Facylitacja konfliktu i odbudowa współpracy. Jasne zasady, kontrakt zespołowy, nowy start.",
    deliverables: [
      "2 dni intensywnej pracy z zespołem",
      "Facylitacja trudnych rozmów",
      "Kontrakt zespołowy na piśmie",
    ],
    icon: RefreshCw,
    featured: false,
  },
  {
    id: "kultura",
    name: "Kultura Odpowiedzialności",
    subtitle: "Transformacja",
    duration: "8–12 tygodni",
    description:
      "Kompleksowa zmiana kultury organizacyjnej. Praca z kadrą, nowe zasady, rytuały i mierniki.",
    deliverables: [
      "Diagnoza i projektowanie zmiany",
      "Praca z kadrą zarządzającą",
      "Wdrożenie zasad i rytuałów",
      "System mierników efektywności",
    ],
    icon: Building2,
    featured: false,
  },
];

function PackageCard({
  pkg,
  index,
  isInView,
}: {
  pkg: (typeof packages)[0];
  index: number;
  isInView: boolean;
}) {
  const Icon = pkg.icon;

  return (
    <motion.div
      className={`group relative ${pkg.featured ? "lg:scale-105 lg:z-10" : ""}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* Featured badge */}
      {pkg.featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase bg-[#b8860b] text-white rounded-full">
            Najpopularniejszy
          </span>
        </div>
      )}

      <div
        className={`relative h-full p-8 lg:p-10 rounded-2xl transition-all duration-500 ${
          pkg.featured
            ? "bg-gradient-to-b from-[#b8860b]/10 to-card border-2 border-[#b8860b]/30"
            : "bg-card border border-border hover:border-[#b8860b]/20"
        }`}
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#b8860b]/0 to-[#b8860b]/0 group-hover:from-[#b8860b]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

        <div className="relative">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${
              pkg.featured
                ? "bg-[#b8860b]/20 text-[#b8860b]"
                : "bg-background-tertiary text-foreground-muted group-hover:bg-[#b8860b]/10 group-hover:text-[#b8860b]"
            }`}
          >
            <Icon className="w-7 h-7" strokeWidth={1.5} />
          </div>

          {/* Title */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-foreground mb-1">{pkg.name}</h3>
            <p className="text-sm text-[#b8860b] font-medium">{pkg.subtitle}</p>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 mb-6 text-sm text-foreground-secondary">
            <Clock className="w-4 h-4" />
            <span>{pkg.duration}</span>
          </div>

          {/* Description */}
          <p className="text-foreground-secondary leading-relaxed mb-8">
            {pkg.description}
          </p>

          {/* Deliverables */}
          <div className="space-y-3 mb-8">
            {pkg.deliverables.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.15 + i * 0.05 }}
              >
                <CheckCircle2
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    pkg.featured ? "text-[#b8860b]" : "text-[#2d5a7b]"
                  }`}
                  strokeWidth={1.5}
                />
                <span className="text-sm text-foreground-secondary">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#kontakt"
            className={`inline-flex items-center gap-2 font-medium transition-all duration-300 ${
              pkg.featured
                ? "text-[#b8860b] hover:gap-3"
                : "text-foreground-secondary hover:text-[#b8860b] hover:gap-3"
            }`}
          >
            <span>Zapytaj o szczegóły</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function Offerings() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      id="pakiety"
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b8860b]/3 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground-secondary mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            W czym pomagamy
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Sprawdzone{" "}
            <span className="text-[#b8860b]">rozwiązania</span>
          </h2>

          <p className="text-lg text-foreground-secondary leading-relaxed">
            Każdy pakiet to efekt lat doświadczeń. Konkretny zakres, mierzalne rezultaty,
            pełna transparentność procesu.
          </p>
        </motion.div>

        {/* Packages grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {packages.map((pkg, index) => (
            <PackageCard key={pkg.id} pkg={pkg} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-foreground-muted mt-16 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          Każdy projekt dopasowujemy do kontekstu organizacji.{" "}
          <a href="#kontakt" className="text-[#b8860b] hover:underline">
            Porozmawiajmy
          </a>{" "}
          o Twoich wyzwaniach.
        </motion.p>
      </div>
    </section>
  );
}
