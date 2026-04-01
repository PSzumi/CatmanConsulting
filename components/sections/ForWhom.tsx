"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLocale } from "next-intl";
import {
  ArrowRight,
  Swords,
  BrainCog,
  ShieldOff,
  RefreshCcw,
  Flame,
  Sprout,
} from "lucide-react";

const situationsPl = [
  {
    text: "Konflikty między działami blokują decyzje i wdrożenia",
    icon: Swords,
    accent: "#b8860b",
  },
  {
    text: "Liderzy są przeciążeni i tracą kierunek strategiczny",
    icon: BrainCog,
    accent: "#d4a843",
  },
  {
    text: "Spadek odpowiedzialności mimo dobrych intencji",
    icon: ShieldOff,
    accent: "#8b6508",
  },
  {
    text: "Zmiany nie wchodzą — mimo szkoleń i komunikacji",
    icon: RefreshCcw,
    accent: "#b8860b",
  },
  {
    text: "Chaos po fuzji, restrukturyzacji lub rotacji zarządu",
    icon: Flame,
    accent: "#d4a843",
  },
  {
    text: "Nowy zarząd buduje kulturę od zera",
    icon: Sprout,
    accent: "#8b6508",
  },
];

const situationsEn = [
  {
    text: "Cross-department conflicts are blocking decisions and execution",
    icon: Swords,
    accent: "#b8860b",
  },
  {
    text: "Leaders are overwhelmed and losing strategic direction",
    icon: BrainCog,
    accent: "#d4a843",
  },
  {
    text: "Declining accountability despite good intentions",
    icon: ShieldOff,
    accent: "#8b6508",
  },
  {
    text: "Changes don't stick — despite training and communication",
    icon: RefreshCcw,
    accent: "#b8860b",
  },
  {
    text: "Chaos after a merger, restructuring, or executive turnover",
    icon: Flame,
    accent: "#d4a843",
  },
  {
    text: "New leadership is building culture from scratch",
    icon: Sprout,
    accent: "#8b6508",
  },
];

function SituationCard({
  item,
  index,
  isInView,
}: {
  item: (typeof situationsPl)[0];
  index: number;
  isInView: boolean;
}) {
  const Icon = item.icon;

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.15 + index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {/* Card */}
      <div className="relative h-full rounded-2xl border border-[#3a3a3a] bg-[#242424]/80 p-6 sm:p-8 transition-all duration-500 hover:border-[#b8860b]/40 hover:bg-[#242424] overflow-hidden">
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${item.accent}15 0%, transparent 60%)`,
          }}
        />

        {/* Number */}
        <span
          className="absolute top-5 right-6 text-[4rem] sm:text-[5rem] font-bold leading-none select-none pointer-events-none transition-colors duration-500 text-white/[0.03] group-hover:text-white/[0.06]"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Icon */}
        <div className="relative z-10 mb-5">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-500"
            style={{
              borderColor: `${item.accent}30`,
              background: `${item.accent}10`,
            }}
          >
            <Icon
              className="w-5 h-5 transition-transform duration-500 group-hover:scale-110"
              style={{ color: item.accent }}
            />
          </div>
        </div>

        {/* Text */}
        <p className="relative z-10 text-lg sm:text-xl font-medium leading-relaxed text-[#fafaf9]/80 group-hover:text-[#fafaf9] transition-colors duration-500">
          {item.text}
        </p>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
          <div
            className="h-full w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
            style={{
              background: `linear-gradient(90deg, ${item.accent}, transparent)`,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function ForWhom() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const locale = useLocale();
  const situations = locale === "pl" ? situationsPl : situationsEn;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const heading =
    locale === "pl"
      ? "Pracujemy z zarządami, managementem i HR"
      : "We work with boards, owners and HR";
  const subheading = locale === "pl" ? "gdy:" : "when:";
  const tagline = locale === "pl" ? "Dla kogo" : "Who we serve";
  const ctaText = locale === "pl" ? "Porozmawiajmy" : "Let\u2019s talk";

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 md:py-40 bg-[#1a1a1a] overflow-hidden"
    >
      {/* Background orb */}
      <motion.div
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(184,134,11,0.06) 0%, transparent 70%)",
          y: orbY,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%)",
          y: useTransform(scrollYProgress, [0, 1], [-40, 40]),
        }}
      />

      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b8860b]/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 md:mb-24">
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-px bg-[#b8860b]" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8860b]">
              {tagline}
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#fafaf9] leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {heading}
            <span className="block mt-2 bg-gradient-to-r from-[#d4a843] via-[#b8860b] to-[#8b6508] bg-clip-text text-transparent">
              {subheading}
            </span>
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-16 sm:mb-20">
          {situations.map((item, i) => (
            <SituationCard
              key={item.text}
              item={item}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <a
            href="#kontakt"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#b8860b] text-white text-base font-medium hover:shadow-lg hover:shadow-[#b8860b]/25 transition-all duration-300 hover:scale-[1.02] btn-shine"
          >
            {ctaText}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>

      {/* Bottom border line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#b8860b]/20 to-transparent" />
    </section>
  );
}
