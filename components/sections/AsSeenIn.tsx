"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";

// Media outlets data
const mediaOutlets = [
  {
    id: "forbes",
    name: "Forbes",
    fullName: "Forbes Polska",
    url: "https://forbes.pl",
    category: "Business",
  },
  {
    id: "puls-biznesu",
    name: "Puls Biznesu",
    fullName: "Puls Biznesu",
    url: "https://pb.pl",
    category: "Finance",
  },
  {
    id: "tvn24-bis",
    name: "TVN24 BiS",
    fullName: "TVN24 Biznes i Swiat",
    url: "https://tvn24.pl/biznes",
    category: "TV",
  },
  {
    id: "rzeczpospolita",
    name: "Rzeczpospolita",
    fullName: "Dziennik Rzeczpospolita",
    url: "https://rp.pl",
    category: "Press",
  },
  {
    id: "hbrp",
    name: "HBR Polska",
    fullName: "Harvard Business Review Polska",
    url: "https://hbrp.pl",
    category: "Business",
  },
  {
    id: "gazeta-wyborcza",
    name: "Wyborcza",
    fullName: "Gazeta Wyborcza",
    url: "https://wyborcza.pl",
    category: "Press",
  },
  {
    id: "business-insider",
    name: "Business Insider",
    fullName: "Business Insider Polska",
    url: "https://businessinsider.com.pl",
    category: "Digital",
  },
  {
    id: "money-pl",
    name: "Money.pl",
    fullName: "Portal Money.pl",
    url: "https://money.pl",
    category: "Finance",
  },
];

// Logo component with grayscale/color hover effect
function MediaLogo({
  outlet,
  index,
  isInView,
}: {
  outlet: (typeof mediaOutlets)[0];
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={outlet.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex-shrink-0 hover:z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139, 26, 26, 0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative px-8 py-6 z-10">
        {/* Logo placeholder - in production, replace with actual SVG logos */}
        <div
          className={`
            relative flex items-center justify-center min-w-[140px] h-12
            transition-all duration-500 ease-out
            ${isHovered ? "scale-105" : "scale-100"}
          `}
        >
          {/* Grayscale to color filter simulation */}
          <div
            className={`
              text-2xl font-bold tracking-tight transition-all duration-500
              ${isHovered ? "text-white" : "text-white/30"}
            `}
            style={{
              filter: isHovered ? "none" : "grayscale(100%)",
            }}
          >
            <span
              className={`
                transition-all duration-500
                ${isHovered ? "text-[#8b1a1a]" : "text-white/30"}
              `}
            >
              {outlet.name}
            </span>
          </div>

          {/* Subtle underline on hover */}
          <motion.div
            className="absolute -bottom-1 left-1/2 h-px bg-gradient-to-r from-transparent via-[#8b1a1a] to-transparent"
            initial={{ width: 0, x: "-50%" }}
            animate={{
              width: isHovered ? "80%" : "0%",
              x: "-50%",
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Category tag on hover */}
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
          initial={{ opacity: 0, y: -5 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : -5,
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-white/30">
            {outlet.category}
          </span>
        </motion.div>
      </div>
    </motion.a>
  );
}

// Gradient line separator component
function GradientSeparator({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-8 flex items-center ${className}`}>
      <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export function AsSeenIn() {
  const t = useTranslations("asSeenIn");
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <section
      ref={containerRef}
      className="relative py-16 sm:py-20 md:py-28 bg-[#0a0a0f] overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8b1a1a]/[0.02] to-transparent" />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#8b1a1a]/50" />
            <span className="flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-[0.2em]">
              <Newspaper className="w-3.5 h-3.5 text-[#8b1a1a]" />
              {t("tagline", { fallback: "Nasi eksperci w mediach" })}
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#8b1a1a]/50" />
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl font-light text-white/60 tracking-tight"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {t("title")}
          </motion.h2>
        </motion.div>

        {/* Media logos row */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

          {/* Logos container */}
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-12 md:gap-x-6">
            {mediaOutlets.map((outlet, index) => (
              <MediaLogo key={outlet.id} outlet={outlet} index={index} isInView={isInView} />
            ))}
          </div>
        </div>

        {/* Bottom accent */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#8b1a1a]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#8b1a1a]/30" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#8b1a1a]/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
