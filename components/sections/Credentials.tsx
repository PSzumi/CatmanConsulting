"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Award,
  Brain,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// Certification tiers
const certifications = [
  {
    id: "icf",
    name: "ICF",
    fullName: "International Coaching Federation",
    level: "PCC - Professional Certified Coach",
    description:
      "Międzynarodowy złoty standard w coachingu. Ponad 500 godzin praktyki coachingowej.",
    logo: "/logos/icf.svg",
    color: "#0077B5",
    url: "https://coachingfederation.org",
  },
  {
    id: "emcc",
    name: "EMCC",
    fullName: "European Mentoring and Coaching Council",
    level: "Senior Practitioner",
    description:
      "Europejska akredytacja potwierdzająca najwyższe standardy etyczne i metodologiczne.",
    logo: "/logos/emcc.svg",
    color: "#1E3A5F",
    url: "https://emccglobal.org",
  },
  {
    id: "prosci",
    name: "Prosci",
    fullName: "Prosci Change Management",
    level: "Certified Practitioner",
    description:
      "Metodologia ADKAR - światowy lider w zarządzaniu zmianą organizacyjną.",
    logo: "/logos/prosci.svg",
    color: "#E85D04",
    url: "https://prosci.com",
  },
];

// Assessment tools
const assessmentTools = [
  {
    id: "hogan",
    name: "Hogan Assessments",
    description: "Gold standard w ocenie potencjału przywódczego",
    tools: ["HPI", "HDS", "MVPI"],
    icon: Brain,
    color: "#8B0000",
  },
  {
    id: "gallup",
    name: "Gallup CliftonStrengths",
    description: "Identyfikacja i rozwój talentów",
    tools: ["StrengthsFinder", "Q12"],
    icon: TrendingUp,
    color: "#00A98F",
  },
  {
    id: "disc",
    name: "DiSC & MBTI",
    description: "Style komunikacji i preferencje osobowościowe",
    tools: ["DiSC", "MBTI", "Insights Discovery"],
    icon: Users,
    color: "#6366F1",
  },
  {
    id: "eq",
    name: "EQ-i 2.0",
    description: "Ocena i rozwój inteligencji emocjonalnej",
    tools: ["EQ-i 2.0", "EQ 360"],
    icon: Shield,
    color: "#EC4899",
  },
];

// Methodologies
const methodologies = [
  {
    name: "Leadership Circle Profile",
    category: "Leadership Assessment",
    description: "360° ocena kompetencji przywódczych łącząca behawioralne i wewnętrzne założenia lidera.",
  },
  {
    name: "Five Dysfunctions of a Team",
    category: "Team Development",
    description: "Model Patricka Lencioniego do diagnozowania i budowania efektywnych zespołów.",
  },
  {
    name: "Kotter's 8-Step Change",
    category: "Change Management",
    description: "Sprawdzony framework do prowadzenia transformacji organizacyjnych.",
  },
  {
    name: "OKR Framework",
    category: "Goal Setting",
    description: "System celów i kluczowych rezultatów stosowany przez Google, Intel, LinkedIn.",
  },
  {
    name: "Stakeholder Centered Coaching",
    category: "Executive Coaching",
    description: "Metodologia Marshalla Goldsmitha z mierzalnym ROI dla organizacji.",
  },
  {
    name: "Systemic Team Coaching",
    category: "Team Coaching",
    description: "Holistyczne podejście do rozwoju zespołów w kontekście całej organizacji.",
  },
];

// Stats
const credentialStats = [
  { value: "500+", label: "Godzin coachingu", subtext: "udokumentowanych" },
  { value: "15+", label: "Certyfikacji", subtext: "aktywnych" },
  { value: "100%", label: "Etyka ICF", subtext: "zgodność" },
];

// Certification Card Component
function CertificationCard({
  cert,
  index,
  isInView,
}: {
  cert: typeof certifications[0];
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${cert.color}30 0%, transparent 50%, ${cert.color}20 100%)`,
        }}
      />

      <div className="relative h-full p-8 rounded-3xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] group-hover:border-white/[0.1] transition-all duration-500">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          {/* Logo placeholder */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
            style={{
              backgroundColor: `${cert.color}20`,
              color: cert.color,
            }}
          >
            {cert.name.charAt(0)}
          </div>

          {/* External link */}
          <motion.div
            className="p-2 rounded-full bg-white/5"
            animate={{ rotate: isHovered ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{cert.name}</h3>
            <p className="text-sm text-white/40">{cert.fullName}</p>
          </div>

          {/* Level badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${cert.color}15`,
              color: cert.color,
            }}
          >
            <Award className="w-3 h-3" />
            {cert.level}
          </div>

          {/* Description */}
          <p className="text-sm text-white/50 leading-relaxed">
            {cert.description}
          </p>
        </div>

        {/* Decorative corner */}
        <div
          className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] rounded-tr-3xl"
          style={{
            background: `radial-gradient(circle at top right, ${cert.color} 0%, transparent 70%)`,
          }}
        />
      </div>
    </motion.a>
  );
}

// Assessment Tool Card
function AssessmentCard({
  tool,
  index,
  isInView,
}: {
  tool: typeof assessmentTools[0];
  index: number;
  isInView: boolean;
}) {
  const Icon = tool.icon;

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
    >
      <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] group-hover:border-white/[0.1] transition-all duration-300">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${tool.color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: tool.color }} />
        </div>

        {/* Content */}
        <h4 className="text-lg font-semibold text-white mb-2">{tool.name}</h4>
        <p className="text-sm text-white/40 mb-4">{tool.description}</p>

        {/* Tools tags */}
        <div className="flex flex-wrap gap-2">
          {tool.tools.map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Methodology Item
function MethodologyItem({
  method,
  index,
  isInView,
}: {
  method: typeof methodologies[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="group relative flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.08 }}
    >
      {/* Connector dot */}
      <div className="relative mt-2">
        <div className="w-2 h-2 rounded-full bg-[#b8860b]" />
        {index < methodologies.length - 1 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#b8860b]/30 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="font-semibold text-white group-hover:text-[#b8860b] transition-colors">
            {method.name}
          </h4>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-[#b8860b]/10 text-[#b8860b]">
            {method.category}
          </span>
        </div>
        <p className="text-sm text-white/40 leading-relaxed">
          {method.description}
        </p>
      </div>

      {/* Arrow on hover */}
      <ChevronRight className="w-4 h-4 text-white/0 group-hover:text-white/30 transition-all mt-1" />
    </motion.div>
  );
}

export function Credentials() {
  const t = useTranslations("credentials");
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      id="credentials"
      className="relative py-20 sm:py-28 md:py-32 lg:py-40 bg-[#0a0a0f] overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="hidden md:block absolute top-1/4 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#b8860b]/5 rounded-full blur-[150px]" />
        <div className="hidden md:block absolute bottom-1/4 right-0 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-[#2d5a7b]/5 rounded-full blur-[120px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
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
              <Sparkles className="w-4 h-4" />
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

        {/* Credential Stats */}
        <motion.div
          className="grid grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {credentialStats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#b8860b] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/60 font-medium">{stat.label}</div>
              <div className="text-xs text-white/30">{stat.subtext}</div>
            </div>
          ))}
        </motion.div>

        {/* Main Certifications */}
        <div className="mb-24">
          <motion.h3
            className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Award className="w-4 h-4 text-[#b8860b]" />
            {t("certifications")}
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <CertificationCard
                key={cert.id}
                cert={cert}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>

        {/* Assessment Tools */}
        <div className="mb-24">
          <motion.h3
            className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Brain className="w-4 h-4 text-[#b8860b]" />
            {t("tools")}
          </motion.h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessmentTools.map((tool, index) => (
              <AssessmentCard
                key={tool.id}
                tool={tool}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>

        {/* Methodologies */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Methodologies list */}
          <div>
            <motion.h3
              className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <TrendingUp className="w-4 h-4 text-[#b8860b]" />
              {t("methodologies")}
            </motion.h3>

            <div className="space-y-2">
              {methodologies.map((method, index) => (
                <MethodologyItem
                  key={method.name}
                  method={method}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>
          </div>

          {/* Right: Trust message */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-[#b8860b]/10 to-transparent border border-[#b8860b]/20">
              {/* Decorative */}
              <div className="absolute top-6 right-6">
                <Shield className="w-8 h-8 text-[#b8860b]/20" />
              </div>

              <blockquote className="relative">
                <p className="text-2xl md:text-3xl font-light text-white leading-relaxed mb-8">
                  "Każde narzędzie, którego używamy, jest{" "}
                  <span className="text-[#b8860b] font-medium">
                    naukowo zwalidowane
                  </span>{" "}
                  i sprawdzone w tysiącach organizacji na całym świecie."
                </p>

                <footer className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b8860b]/30 to-[#2d5a7b]/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#b8860b]">CC</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      Catman Consulting
                    </div>
                    <div className="text-sm text-white/40">
                      Evidence-based approach
                    </div>
                  </div>
                </footer>
              </blockquote>

              {/* Bottom badges */}
              <div className="flex flex-wrap gap-3 mt-8 pt-8 border-t border-white/[0.05]">
                {["ICF Code of Ethics", "GDPR Compliant", "NDA Standard"].map(
                  (badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white/50 border border-white/[0.05]"
                    >
                      {badge}
                    </span>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white/40 mb-6">
            Chcesz poznać szczegóły naszego podejścia?
          </p>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#b8860b] text-white font-medium hover:bg-[#d4a94d] transition-colors"
          >
            Porozmawiajmy o Twoich potrzebach
            <ChevronRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
