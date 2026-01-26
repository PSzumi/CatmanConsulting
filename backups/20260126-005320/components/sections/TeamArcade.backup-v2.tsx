"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

// Team member data
const teamMembers = [
  {
    id: "tomek",
    name: "TOMEK",
    fullName: "Tomasz",
    role: "Strateg / Trener Biznesu",
    tagline: "25 lat w okopach biznesu",
    stats: {
      strategy: 95,
      leadership: 90,
      experience: 99,
      insight: 85,
    },
    color: "#6366f1",
    colorLight: "#818cf8",
    colorDark: "#4f46e5",
    milestones: [
      { year: "1990", title: "GENESIS", desc: "Start w biznesie międzynarodowym", icon: "🚀" },
      { year: "1998", title: "EVOLUTION", desc: "Pierwsze szkolenia kadry zarządzającej", icon: "📈" },
      { year: "2005", title: "MASTERY", desc: "Zarządzanie zespołami 100+ osób", icon: "👥" },
      { year: "2012", title: "CERTIFIED", desc: "Certyfikowany trener biznesu", icon: "🏆" },
      { year: "2018", title: "FOUNDER", desc: "Catman Consulting", icon: "⭐" },
    ],
    specialMove: "STRATEGIC VISION",
    quote: "Prosto o rzeczach złożonych",
    achievement: "100+ projektów transformacyjnych",
  },
  {
    id: "mariusz",
    name: "MARIUSZ",
    fullName: "Mariusz",
    role: "Psycholog / Strateg",
    tagline: "Architekt kultury organizacyjnej",
    stats: {
      strategy: 88,
      leadership: 85,
      experience: 92,
      insight: 98,
    },
    color: "#8b5cf6",
    colorLight: "#a78bfa",
    colorDark: "#7c3aed",
    milestones: [
      { year: "1995", title: "AWAKENING", desc: "Studia psychologiczne", icon: "🧠" },
      { year: "2002", title: "DEPTH", desc: "Psychologia organizacji", icon: "🔍" },
      { year: "2008", title: "SYNTHESIS", desc: "Psychologia + Biznes", icon: "🔗" },
      { year: "2014", title: "EXPERTISE", desc: "Kompetencje społeczne", icon: "💡" },
      { year: "2018", title: "FUSION", desc: "Catman Consulting", icon: "⭐" },
    ],
    specialMove: "MIND ARCHITECT",
    quote: "Zrozumieć, żeby działać",
    achievement: "Ekspert kultury organizacyjnej",
  },
];

// Animated stat bar with glow effect
function StatBar({
  label,
  value,
  color,
  delay = 0,
  isVisible
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
  isVisible: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setDisplayValue(0);
      return;
    }

    const timeout = setTimeout(() => {
      gsap.to({ val: 0 }, {
        val: value,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function() {
          setDisplayValue(Math.round(this.targets()[0].val));
        }
      });
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isVisible, value, delay]);

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-400 transition-colors">
          {label}
        </span>
        <span
          className="text-xs font-mono font-bold transition-colors"
          style={{ color }}
        >
          {displayValue}
        </span>
      </div>
      <div className="h-1.5 bg-gray-800/80 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${value}%` : 0 }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 20px ${color}60, 0 0 40px ${color}30`,
          }}
        />
      </div>
    </div>
  );
}

// Timeline milestone
function TimelineMilestone({
  milestone,
  index,
  total,
  color,
  isVisible,
}: {
  milestone: typeof teamMembers[0]['milestones'][0];
  index: number;
  total: number;
  color: string;
  isVisible: boolean;
}) {
  return (
    <motion.div
      className="relative flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Year */}
      <div
        className="w-12 text-right font-mono text-xs font-bold"
        style={{ color }}
      >
        {milestone.year}
      </div>

      {/* Dot and line */}
      <div className="relative flex flex-col items-center">
        <motion.div
          className="w-3 h-3 rounded-full border-2 z-10"
          style={{
            borderColor: color,
            backgroundColor: index === total - 1 ? color : 'transparent',
            boxShadow: `0 0 10px ${color}60`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: isVisible ? 1 : 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        />
        {index < total - 1 && (
          <motion.div
            className="w-0.5 h-8 -mt-0.5"
            style={{ backgroundColor: `${color}40` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isVisible ? 1 : 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{milestone.icon}</span>
          <span className="font-mono text-xs font-bold text-white">
            {milestone.title}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
          {milestone.desc}
        </p>
      </div>
    </motion.div>
  );
}

// Character card component
function CharacterCard({
  member,
  side,
  isVisible,
}: {
  member: typeof teamMembers[0];
  side: 'left' | 'right';
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative h-full"
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : (side === 'left' ? -50 : 50) }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card */}
      <div
        className="relative h-full rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${member.colorDark}15 0%, transparent 50%, ${member.color}10 100%)`,
          border: `1px solid ${member.color}30`,
          boxShadow: isHovered
            ? `0 0 60px ${member.color}30, inset 0 0 60px ${member.color}10`
            : `0 0 30px ${member.color}15`,
        }}
      >
        {/* Animated background gradient */}
        <div
          className="absolute inset-0 opacity-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${side === 'left' ? '20%' : '80%'} 30%, ${member.color}40 0%, transparent 50%)`,
            opacity: isHovered ? 0.5 : 0.3,
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(${member.color}40 1px, transparent 1px),
              linear-gradient(90deg, ${member.color}40 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-6 lg:p-8">

          {/* Header */}
          <div className={`flex items-start gap-4 ${side === 'right' ? 'flex-row-reverse text-right' : ''}`}>
            {/* Avatar placeholder */}
            <motion.div
              className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${member.color}30, ${member.colorDark}50)`,
                border: `2px solid ${member.color}50`,
                boxShadow: `0 0 30px ${member.color}30`,
              }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Pixel art style avatar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-16 h-16 lg:w-20 lg:h-20">
                  {/* Head */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-lg"
                    style={{
                      backgroundColor: '#fcd34d',
                      boxShadow: 'inset -3px -3px 0 #b45309, inset 3px 3px 0 #fef3c7',
                    }}
                  >
                    {/* Face features */}
                    <div className="absolute top-3 left-2 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-900 rounded-sm" />
                    <div className="absolute top-3 right-2 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-900 rounded-sm" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1 bg-gray-900 rounded-sm" />
                  </div>
                  {/* Body */}
                  <div
                    className="absolute top-10 lg:top-12 left-1/2 -translate-x-1/2 w-12 h-6 lg:w-14 lg:h-7 rounded-lg"
                    style={{
                      backgroundColor: member.color,
                      boxShadow: `inset -3px -3px 0 ${member.colorDark}, inset 3px 3px 0 ${member.colorLight}`,
                    }}
                  />
                </div>
              </div>

              {/* Scanlines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                }}
              />
            </motion.div>

            {/* Name & Role */}
            <div className="flex-1">
              <motion.h3
                className="font-mono text-2xl lg:text-3xl font-black tracking-tight"
                style={{ color: member.color }}
                animate={{
                  textShadow: isHovered
                    ? `0 0 30px ${member.color}80, 0 0 60px ${member.color}40`
                    : `0 0 20px ${member.color}40`
                }}
              >
                {member.name}
              </motion.h3>
              <p className="text-gray-400 text-sm mt-1 font-medium">
                {member.role}
              </p>
              <p className="text-gray-600 text-xs mt-2 italic">
                "{member.tagline}"
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 space-y-3">
            <div className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.3em] mb-3">
              Player Stats
            </div>
            <StatBar label="Strategy" value={member.stats.strategy} color={member.color} delay={0.2} isVisible={isVisible} />
            <StatBar label="Leadership" value={member.stats.leadership} color={member.color} delay={0.3} isVisible={isVisible} />
            <StatBar label="Experience" value={member.stats.experience} color={member.color} delay={0.4} isVisible={isVisible} />
            <StatBar label="Insight" value={member.stats.insight} color={member.color} delay={0.5} isVisible={isVisible} />
          </div>

          {/* Special Move */}
          <div className="mt-6 pt-4 border-t border-gray-800/50">
            <div className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.3em] mb-2">
              Special Ability
            </div>
            <motion.div
              className="font-mono text-sm font-bold flex items-center gap-2"
              style={{ color: member.color }}
              animate={{
                textShadow: isHovered
                  ? `0 0 20px ${member.color}`
                  : 'none'
              }}
            >
              <span className="text-yellow-400">★</span>
              {member.specialMove}
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="mt-6 pt-4 border-t border-gray-800/50 flex-1">
            <div className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.3em] mb-4">
              Career Path
            </div>
            <div className="space-y-1">
              {member.milestones.map((milestone, index) => (
                <TimelineMilestone
                  key={milestone.year}
                  milestone={milestone}
                  index={index}
                  total={member.milestones.length}
                  color={member.color}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="mt-auto pt-6">
            <div
              className="p-4 rounded-lg text-center"
              style={{
                background: `linear-gradient(135deg, ${member.color}10, transparent)`,
                border: `1px solid ${member.color}20`,
              }}
            >
              <p className="text-gray-300 text-sm italic">
                "{member.quote}"
              </p>
              <p
                className="text-xs mt-2 font-mono font-bold"
                style={{ color: member.color }}
              >
                — {member.fullName}
              </p>
            </div>
          </div>
        </div>

        {/* Corner decorations */}
        <div
          className="absolute top-0 left-0 w-16 h-16"
          style={{
            background: `linear-gradient(135deg, ${member.color}20 0%, transparent 50%)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-16 h-16"
          style={{
            background: `linear-gradient(-45deg, ${member.color}20 0%, transparent 50%)`,
          }}
        />
      </div>
    </motion.div>
  );
}

// CRT/Retro overlay effect
function RetroOverlay() {
  return (
    <>
      {/* Subtle scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)',
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </>
  );
}

export function TeamArcade() {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="o-nas"
      className="relative py-20 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gray-950" />

      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: teamMembers[0].color }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: teamMembers[1].color }}
      />

      <RetroOverlay />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="font-mono text-xs text-gray-400 tracking-widest uppercase">
              Select Your Mentor
            </span>
            <span className="text-yellow-400 animate-pulse">▸</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-white">Doświadczenie, które </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
              działa
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Łączymy strategię biznesową z psychologią. Pomagamy liderom budować zespoły, które naprawdę współpracują.
          </p>
        </motion.div>

        {/* VS Divider - Desktop */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)',
              }}
            >
              <span className="text-white">&</span>
            </div>
            {/* Connecting lines */}
            <div className="absolute top-1/2 -left-20 w-20 h-0.5 bg-gradient-to-r from-transparent to-indigo-500/50" />
            <div className="absolute top-1/2 -right-20 w-20 h-0.5 bg-gradient-to-l from-transparent to-violet-500/50" />
          </motion.div>
        </div>

        {/* Character Cards - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          <CharacterCard
            member={teamMembers[0]}
            side="left"
            isVisible={isVisible}
          />
          <CharacterCard
            member={teamMembers[1]}
            side="right"
            isVisible={isVisible}
          />
        </div>

        {/* Footer badge */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <span className="font-mono text-xs text-gray-500">COMBINED EXPERIENCE</span>
            <span className="font-mono text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              50+ YEARS
            </span>
            <span className="font-mono text-xs text-gray-500">IN THE GAME</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
