"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Briefcase,
  Brain,
  Award,
  TrendingUp,
  Users,
  Target,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { teamContent } from "@/lib/constants";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

// Timeline milestones for experience visualization
const tomekTimeline = [
  { year: "1989", label: "Start kariery" },
  { year: "1999", label: "Konsulting" },
  { year: "2010", label: "Partner" },
  { year: "2024", label: "Catman" },
];

const mariuszTimeline = [
  { year: "2005", label: "Psychologia" },
  { year: "2012", label: "Organizacje" },
  { year: "2018", label: "Leadership" },
  { year: "2024", label: "Catman" },
];

// Stats data
const stats = [
  {
    value: 35,
    suffix: "+",
    label: "Lat doświadczenia",
    description: "Łącznie obu partnerów",
    icon: Award
  },
  {
    value: 100,
    suffix: "+",
    label: "Zrealizowanych projektów",
    description: "Transformacje i zmiany",
    icon: Target
  },
  {
    value: 8,
    suffix: "-10",
    label: "Projektów rocznie",
    description: "Świadomy wybór jakości",
    icon: TrendingUp
  },
  {
    value: 95,
    suffix: "%",
    label: "Klientów poleca",
    description: "Rekomendacje i powroty",
    icon: Users
  },
];

// Expertise areas
const tomekExpertise = [
  "Transformacja operacyjna",
  "Kultura odpowiedzialności",
  "Zarządzanie zmianą",
  "Strategia biznesowa",
];

const mariuszExpertise = [
  "Psychologia organizacji",
  "Rozwój liderów",
  "Coaching wykonawczy",
  "Dynamika zespołów",
];

interface TeamMemberCardProps {
  member: typeof teamContent.members[0];
  index: number;
  timeline: typeof tomekTimeline;
  expertise: string[];
  isLeft: boolean;
}

function TeamMemberCard({ member, index, timeline, expertise, isLeft }: TeamMemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      style={{ y: isLeft ? y : undefined }}
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1], delay: index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card */}
      <div className="relative h-full">
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-[#b8860b]/30 via-[#d4a843]/20 to-[#b8860b]/30 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        <div className="relative h-full p-8 lg:p-10 rounded-[2rem] bg-gradient-to-br from-[#1a1a1a] via-[#242424] to-[#1a1a1a] border border-[#3a3a3a] hover:border-[#b8860b]/50 transition-all duration-700 overflow-hidden group">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, #b8860b 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }} />
          </div>

          {/* Top accent line */}
          <motion.div
            className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#b8860b] to-transparent"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5 + index * 0.2 }}
          />

          {/* Photo / Avatar Section */}
          <div className="relative mb-8">
            <motion.div
              className="relative w-36 h-36 mx-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Rotating border */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #b8860b, #d4a843, #8b6508, #b8860b)',
                  padding: '3px',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-[#1a1a1a]" />
              </motion.div>

              {/* Avatar content */}
              <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-[#242424] to-[#1a1a1a] flex items-center justify-center overflow-hidden">
                {index === 0 ? (
                  <Briefcase className="w-16 h-16 text-[#b8860b]/70 group-hover:text-[#b8860b] transition-colors" />
                ) : (
                  <Brain className="w-16 h-16 text-[#b8860b]/70 group-hover:text-[#b8860b] transition-colors" />
                )}

                {/* Hover overlay with gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-[#b8860b]/30 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Sparkle effect on hover */}
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="w-6 h-6 text-[#d4a843]" />
              </motion.div>
            </motion.div>
          </div>

          {/* Name & Role */}
          <div className="text-center mb-6">
            <motion.h3
              className="text-3xl lg:text-4xl font-bold mb-2 text-[#fafaf9] group-hover:text-[#b8860b] transition-colors duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
            >
              {member.name}
            </motion.h3>
            <motion.p
              className="text-lg text-[#b8860b] font-medium tracking-wide"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
            >
              {member.role}
            </motion.p>
          </div>

          {/* Experience Badge */}
          <motion.div
            className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#b8860b]/10 border border-[#b8860b]/30 mx-auto w-fit"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
          >
            <Award className="w-4 h-4 text-[#b8860b]" />
            <span className="text-sm text-[#a3a3a3]">{member.experience}</span>
          </motion.div>

          {/* Bio - visible by default */}
          <motion.p
            className="text-[#a3a3a3] text-center leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
          >
            {member.bio}
          </motion.p>

          {/* Timeline - Experience Journey */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-sm font-semibold text-[#737373] uppercase tracking-wider mb-4 text-center">
              Ścieżka kariery
            </h4>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3a3a3a] to-transparent -translate-y-1/2" />

              <div className="relative flex justify-between">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    className="relative flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.1 + index * 0.2 }}
                  >
                    {/* Dot */}
                    <motion.div
                      className="w-3 h-3 rounded-full bg-[#b8860b] border-2 border-[#1a1a1a] mb-2 relative z-10"
                      whileHover={{ scale: 1.5 }}
                    />
                    {/* Year */}
                    <span className="text-xs font-bold text-[#b8860b]">{item.year}</span>
                    {/* Label */}
                    <span className="text-[10px] text-[#737373] mt-1 whitespace-nowrap">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Expertise Areas - Revealed on hover */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              height: isHovered ? "auto" : 0
            }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
            <h4 className="text-sm font-semibold text-[#737373] uppercase tracking-wider mb-3 text-center">
              Specjalizacje
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {expertise.map((item, i) => (
                <motion.span
                  key={item}
                  className="px-3 py-1.5 text-xs font-medium text-[#fafaf9] bg-[#2e2e2e] border border-[#3a3a3a] rounded-full hover:border-[#b8860b]/50 hover:bg-[#b8860b]/10 transition-all cursor-default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* "Learn more" indicator */}
          <motion.div
            className="absolute bottom-4 right-4 flex items-center gap-1 text-[#737373] group-hover:text-[#b8860b] transition-colors"
            animate={{ x: isHovered ? 5 : 0 }}
          >
            <span className="text-xs">Więcej</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-50px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={sectionRef}
      id="o-nas"
      className="relative py-20 sm:py-28 md:py-32 lg:py-40 bg-[#1a1a1a] overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        {/* Large gradient orbs */}
        <motion.div
          className="hidden md:block absolute top-0 left-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(184, 134, 11, 0.08) 0%, transparent 70%)',
          }}
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="hidden md:block absolute bottom-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(184, 134, 11, 0.06) 0%, transparent 70%)',
          }}
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(184, 134, 11, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(184, 134, 11, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-12 sm:mb-16 md:mb-24 lg:mb-32"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b8860b]/10 border border-[#b8860b]/30 text-sm font-medium text-[#b8860b] mb-8">
              <Users className="w-4 h-4" />
              {teamContent.title}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 sm:mb-8 leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <span className="text-[#fafaf9]">Doświadczenie, które </span>
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#d4a843] via-[#b8860b] to-[#8b6508] bg-clip-text text-transparent">
                działa
              </span>
              {/* Underline decoration */}
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isHeaderInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.5 }}
              >
                <motion.path
                  d="M0 6 Q50 0 100 6 T200 6"
                  fill="none"
                  stroke="#b8860b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            className="max-w-3xl mx-auto text-xl lg:text-2xl text-[#a3a3a3] leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            Prowadzimy ograniczoną liczbę projektów rocznie, zapewniając każdemu klientowi{" "}
            <span className="text-[#b8860b] font-medium">pełne zaangażowanie</span>{" "}
            obu partnerów.
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#b8860b] to-transparent mx-auto mt-12"
            initial={{ scaleX: 0 }}
            animate={isHeaderInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          />
        </motion.div>

        {/* Team Members - Split Screen Design */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-16 sm:mb-24 md:mb-32">
          <TeamMemberCard
            member={teamContent.members[0]}
            index={0}
            timeline={tomekTimeline}
            expertise={tomekExpertise}
            isLeft={true}
          />
          <TeamMemberCard
            member={teamContent.members[1]}
            index={1}
            timeline={mariuszTimeline}
            expertise={mariuszExpertise}
            isLeft={false}
          />
        </div>

        {/* Combined expertise statement */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="text-lg text-[#737373] italic">
            &ldquo;Łączymy wieloletnie doświadczenie w zarządzaniu z głęboką wiedzą psychologiczną,
            <br className="hidden md:block" />
            dostarczając rozwiązania, które naprawdę działają.&rdquo;
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="relative"
        >
          {/* Stats background card */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#242424] to-[#1a1a1a] border border-[#3a3a3a]" />

          {/* Stats grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-4 p-5 sm:p-8 lg:p-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="relative text-center group"
                  initial={{ opacity: 0, y: 40 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1]
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#b8860b]/10 border border-[#b8860b]/30 flex items-center justify-center group-hover:bg-[#b8860b]/20 group-hover:border-[#b8860b]/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-5 h-5 text-[#b8860b]" />
                  </motion.div>

                  {/* Number */}
                  <div className="text-4xl lg:text-5xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-[#d4a843] via-[#b8860b] to-[#d4a843] bg-clip-text text-transparent">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </span>
                  </div>

                  {/* Label */}
                  <div className="text-sm font-semibold text-[#fafaf9] mb-1">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-xs text-[#737373]">
                    {stat.description}
                  </div>

                  {/* Divider (except last item) */}
                  {index < stats.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 w-[1px] h-16 bg-gradient-to-b from-transparent via-[#3a3a3a] to-transparent -translate-y-1/2" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-[#b8860b]/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={isStatsInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </motion.div>

        {/* Bottom CTA hint */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className="text-[#737373] text-sm">
            Chcesz dowiedzieć się więcej?{" "}
            <a
              href="#kontakt"
              className="text-[#b8860b] hover:text-[#d4a843] transition-colors font-medium inline-flex items-center gap-1 group"
            >
              Porozmawiajmy
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
