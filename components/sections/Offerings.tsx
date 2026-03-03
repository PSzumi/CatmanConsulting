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
import { useTranslations } from "next-intl";

// Package configuration with icons and keys
const packageConfigs = [
  {
    id: "diagnostyka",
    translationKey: "diagnostyka",
    icon: Compass,
    featured: false,
  },
  {
    id: "lider",
    translationKey: "lider",
    icon: Users,
    featured: true,
  },
  {
    id: "team-reset",
    translationKey: "teamReset",
    icon: RefreshCw,
    featured: false,
  },
  {
    id: "kultura",
    translationKey: "kultura",
    icon: Building2,
    featured: false,
  },
];

function PackageCard({
  pkg,
  index,
  isInView,
  t,
}: {
  pkg: (typeof packageConfigs)[0];
  index: number;
  isInView: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  const Icon = pkg.icon;
  const deliverables = t.raw(`packages.${pkg.translationKey}.deliverables`) as string[];

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
            {t("mostPopular")}
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
            <h3 className="text-2xl font-bold text-foreground mb-1">{t(`packages.${pkg.translationKey}.name`)}</h3>
            <p className="text-sm text-[#b8860b] font-medium">{t(`packages.${pkg.translationKey}.subtitle`)}</p>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 mb-6 text-sm text-foreground-secondary">
            <Clock className="w-4 h-4" />
            <span>{t(`packages.${pkg.translationKey}.duration`)}</span>
          </div>

          {/* Description */}
          <p className="text-foreground-secondary leading-relaxed mb-8">
            {t(`packages.${pkg.translationKey}.description`)}
          </p>

          {/* Deliverables */}
          <div className="space-y-3 mb-8">
            {deliverables.map((item, i) => (
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
            <span>{t("askDetails")}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function Offerings() {
  const t = useTranslations("offerings");
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
            {t("tagline")}
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {t("title")}{" "}
            <span className="text-[#b8860b]">{t("titleHighlight")}</span>
          </h2>

          <p className="text-lg text-foreground-secondary leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Packages grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {packageConfigs.map((pkg, index) => (
            <PackageCard key={pkg.id} pkg={pkg} index={index} isInView={isInView} t={t} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-foreground-muted mt-16 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          {t("bottomNote")}{" "}
          <a href="#kontakt" className="text-[#b8860b] hover:underline">
            {t("bottomNoteCta")}
          </a>{" "}
          {t("bottomNoteEnd")}
        </motion.p>
      </div>
    </section>
  );
}
