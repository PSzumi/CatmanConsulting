"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
      { year: "1990", title: "GENESIS", desc: "Start w biznesie międzynarodowym", icon: "🚀", platform: "tower" },
      { year: "1998", title: "EVOLUTION", desc: "Pierwsze szkolenia kadry", icon: "📈", platform: "bridge" },
      { year: "2005", title: "MASTERY", desc: "Zarządzanie zespołami 100+", icon: "👥", platform: "palace" },
      { year: "2012", title: "CERTIFIED", desc: "Certyfikowany trener", icon: "🏆", platform: "tower" },
      { year: "2018", title: "FOUNDER", desc: "Catman Consulting", icon: "⭐", platform: "throne" },
    ],
    specialMove: "STRATEGIC VISION",
    quote: "Prosto o rzeczach złożonych",
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
      { year: "1995", title: "AWAKENING", desc: "Studia psychologiczne", icon: "🧠", platform: "tower" },
      { year: "2002", title: "DEPTH", desc: "Psychologia organizacji", icon: "🔍", platform: "bridge" },
      { year: "2008", title: "SYNTHESIS", desc: "Psychologia + Biznes", icon: "🔗", platform: "palace" },
      { year: "2014", title: "EXPERTISE", desc: "Kompetencje społeczne", icon: "💡", platform: "tower" },
      { year: "2018", title: "FUSION", desc: "Catman Consulting", icon: "⭐", platform: "throne" },
    ],
    specialMove: "MIND ARCHITECT",
    quote: "Zrozumieć, żeby działać",
  },
];

// Prince of Persia style character sprite
function PersianCharacter({
  color,
  isRunning,
  direction,
  isJumping
}: {
  color: string;
  isRunning: boolean;
  direction: 'left' | 'right';
  isJumping: boolean;
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      setFrame(0);
      return;
    }
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 120);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Leg positions for running animation
  const legFrames = [
    { left: 0, right: 6 },
    { left: 4, right: 2 },
    { left: 6, right: 0 },
    { left: 2, right: 4 },
  ];

  const legPos = legFrames[frame];

  return (
    <div
      className="relative w-12 h-16 transition-transform duration-100"
      style={{
        transform: `scaleX(${direction === 'left' ? -1 : 1}) ${isJumping ? 'translateY(-8px)' : ''}`,
      }}
    >
      {/* Head with turban */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full"
        style={{ backgroundColor: '#fcd34d' }}
      >
        {/* Turban */}
        <div
          className="absolute -top-1 left-0 right-0 h-4 rounded-t-full"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: '#fbbf24' }}
        />
        {/* Eyes */}
        <div className="absolute top-3 left-1 w-1 h-1 bg-gray-900 rounded-full" />
        <div className="absolute top-3 right-1 w-1 h-1 bg-gray-900 rounded-full" />
      </div>

      {/* Body - Persian vest */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-6 rounded-sm"
        style={{
          backgroundColor: color,
          boxShadow: `inset 0 0 0 1px ${color}`,
        }}
      >
        {/* Vest details */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-4 bg-yellow-400" />
      </div>

      {/* Arms */}
      <div
        className="absolute top-7 -left-1 w-2 h-4 rounded-sm"
        style={{
          backgroundColor: '#fcd34d',
          transform: isRunning ? `rotate(${-20 + frame * 10}deg)` : 'rotate(-10deg)',
        }}
      />
      <div
        className="absolute top-7 -right-1 w-2 h-4 rounded-sm"
        style={{
          backgroundColor: '#fcd34d',
          transform: isRunning ? `rotate(${20 - frame * 10}deg)` : 'rotate(10deg)',
        }}
      />

      {/* Pants */}
      <div
        className="absolute top-11 left-1/2 -translate-x-1/2 w-6 h-3 rounded-sm"
        style={{ backgroundColor: '#1e1b4b' }}
      />

      {/* Legs */}
      <div
        className="absolute top-14 left-2 w-2 h-3 rounded-sm transition-transform duration-75"
        style={{
          backgroundColor: '#fcd34d',
          transform: `translateX(${legPos.left}px)`,
        }}
      />
      <div
        className="absolute top-14 right-2 w-2 h-3 rounded-sm transition-transform duration-75"
        style={{
          backgroundColor: '#fcd34d',
          transform: `translateX(-${legPos.right}px)`,
        }}
      />
    </div>
  );
}

// Persian architectural platform
function Platform({
  type,
  color,
  isActive,
  milestone,
  onClick,
}: {
  type: 'tower' | 'bridge' | 'palace' | 'throne';
  color: string;
  isActive: boolean;
  milestone: typeof teamMembers[0]['milestones'][0];
  onClick: () => void;
}) {
  const baseStyles = "relative cursor-pointer transition-all duration-300";

  return (
    <motion.div
      className={baseStyles}
      onClick={onClick}
      whileHover={{ y: -4 }}
      animate={{
        filter: isActive ? 'brightness(1.2)' : 'brightness(0.8)',
      }}
    >
      {/* Platform base */}
      <div className="relative">
        {/* Arched platform top */}
        <div
          className="relative w-24 h-20"
          style={{
            background: `linear-gradient(180deg, ${color}40 0%, ${color}20 100%)`,
          }}
        >
          {/* Persian arch */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 96 80" preserveAspectRatio="none">
            <path
              d="M0 80 L0 30 Q48 0 96 30 L96 80 Z"
              fill={`${color}30`}
              stroke={color}
              strokeWidth="2"
            />
            {/* Inner arch decoration */}
            <path
              d="M16 80 L16 40 Q48 16 80 40 L80 80"
              fill="transparent"
              stroke={`${color}60`}
              strokeWidth="1"
            />
            {/* Keystone */}
            <circle cx="48" cy="24" r="6" fill={color} />
          </svg>

          {/* Columns */}
          <div
            className="absolute bottom-0 left-2 w-3 h-12"
            style={{
              background: `linear-gradient(90deg, ${color}60, ${color}40, ${color}60)`,
              borderTop: `3px solid ${color}`,
            }}
          />
          <div
            className="absolute bottom-0 right-2 w-3 h-12"
            style={{
              background: `linear-gradient(90deg, ${color}60, ${color}40, ${color}60)`,
              borderTop: `3px solid ${color}`,
            }}
          />

          {/* Active glow */}
          {isActive && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `radial-gradient(ellipse at center bottom, ${color}40 0%, transparent 70%)`,
              }}
            />
          )}
        </div>

        {/* Floor tiles */}
        <div
          className="h-4 flex justify-center gap-0.5"
          style={{ backgroundColor: `${color}40` }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-full"
              style={{
                backgroundColor: i % 2 === 0 ? `${color}60` : `${color}40`,
                borderTop: `1px solid ${color}`,
              }}
            />
          ))}
        </div>

        {/* Year marker */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs font-bold"
          style={{ color }}
        >
          {milestone.year}
        </div>

        {/* Icon above arch */}
        <motion.div
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl"
          animate={{ y: isActive ? [0, -4, 0] : 0 }}
          transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
        >
          {milestone.icon}
        </motion.div>
      </div>

      {/* Info tooltip on hover */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div
          className="p-2 rounded text-center text-xs"
          style={{
            backgroundColor: `${color}20`,
            border: `1px solid ${color}40`,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div className="font-bold text-white">{milestone.title}</div>
          <div className="text-gray-400 mt-1">{milestone.desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Persian decorative border
function PersianBorder({ color }: { color: string }) {
  return (
    <div className="absolute inset-x-0 top-0 h-8 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 400 32" preserveAspectRatio="none">
        <defs>
          <pattern id="persian-pattern" x="0" y="0" width="40" height="32" patternUnits="userSpaceOnUse">
            {/* Repeating arabesque pattern */}
            <path
              d="M20 0 Q25 8 20 16 Q15 8 20 0"
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M0 16 Q5 24 0 32"
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M40 16 Q35 24 40 32"
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity="0.4"
            />
            <circle cx="20" cy="16" r="2" fill={color} opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#persian-pattern)`} />
        <line x1="0" y1="31" x2="400" y2="31" stroke={color} strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  );
}

// Stat bar in Persian style
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
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 w-16">
        {label}
      </span>
      <div className="flex-1 h-3 bg-gray-900/50 rounded overflow-hidden border border-gray-800">
        <motion.div
          className="h-full rounded"
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${value}%` : 0 }}
          transition={{ duration: 1.5, delay, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 10px ${color}60`,
          }}
        />
      </div>
      <span className="text-xs font-mono font-bold w-8 text-right" style={{ color }}>
        {displayValue}
      </span>
    </div>
  );
}

// Persian journey level component
function PersianJourney({
  member,
  side,
  isVisible,
}: {
  member: typeof teamMembers[0];
  side: 'left' | 'right';
  isVisible: boolean;
}) {
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isJumping, setIsJumping] = useState(false);
  const characterRef = useRef<HTMLDivElement>(null);

  const moveTo = useCallback((index: number) => {
    if (index === currentMilestone || isRunning) return;

    setDirection(index > currentMilestone ? 'right' : 'left');
    setIsRunning(true);
    setIsJumping(true);

    setTimeout(() => setIsJumping(false), 200);
    setTimeout(() => {
      setCurrentMilestone(index);
      setIsRunning(false);
    }, 600);
  }, [currentMilestone, isRunning]);

  // Auto-play on mount
  useEffect(() => {
    if (!isVisible) return;

    const playSequence = async () => {
      for (let i = 0; i < member.milestones.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (i > 0) {
          setDirection('right');
          setIsRunning(true);
          setIsJumping(true);
          setTimeout(() => setIsJumping(false), 200);
          await new Promise(resolve => setTimeout(resolve, 500));
          setCurrentMilestone(i);
          setIsRunning(false);
        }
      }
    };

    const timeout = setTimeout(playSequence, 1000);
    return () => clearTimeout(timeout);
  }, [isVisible, member.milestones.length]);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      transition={{ duration: 0.8, delay: side === 'left' ? 0 : 0.2 }}
    >
      {/* Card container */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${member.color}10 0%, transparent 50%, ${member.color}05 100%)`,
          border: `1px solid ${member.color}30`,
        }}
      >
        <PersianBorder color={member.color} />

        {/* Header */}
        <div className="relative z-10 px-6 pt-12 pb-4">
          <div className="flex items-center gap-4">
            {/* Character preview */}
            <div
              className="w-16 h-20 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${member.color}20, ${member.colorDark}30)`,
                border: `2px solid ${member.color}40`,
              }}
            >
              <PersianCharacter
                color={member.color}
                isRunning={false}
                direction="right"
                isJumping={false}
              />
            </div>

            <div>
              <h3
                className="font-mono text-2xl font-black tracking-tight"
                style={{ color: member.color }}
              >
                {member.name}
              </h3>
              <p className="text-gray-400 text-sm">{member.role}</p>
              <p className="text-gray-600 text-xs mt-1 italic">"{member.tagline}"</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 space-y-2">
          <StatBar label="STR" value={member.stats.strategy} color={member.color} delay={0.2} isVisible={isVisible} />
          <StatBar label="LDR" value={member.stats.leadership} color={member.color} delay={0.3} isVisible={isVisible} />
          <StatBar label="EXP" value={member.stats.experience} color={member.color} delay={0.4} isVisible={isVisible} />
          <StatBar label="INS" value={member.stats.insight} color={member.color} delay={0.5} isVisible={isVisible} />
        </div>

        {/* Level section - the journey */}
        <div className="relative px-4 py-6">
          <div className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.3em] px-2 mb-4">
            Career Journey — Click to Travel
          </div>

          {/* Persian floor background */}
          <div
            className="absolute inset-x-4 bottom-4 h-6"
            style={{
              background: `repeating-linear-gradient(90deg, ${member.color}20 0px, ${member.color}20 20px, ${member.color}10 20px, ${member.color}10 40px)`,
              borderTop: `2px solid ${member.color}40`,
            }}
          />

          {/* Platforms container */}
          <div className="relative flex items-end justify-between px-2" style={{ height: '180px' }}>
            {member.milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className="relative"
                style={{
                  marginBottom: index % 2 === 0 ? '0' : '20px',
                }}
              >
                <Platform
                  type={milestone.platform as any}
                  color={member.color}
                  isActive={index === currentMilestone}
                  milestone={milestone}
                  onClick={() => moveTo(index)}
                />

                {/* Character on current platform */}
                {index === currentMilestone && (
                  <motion.div
                    ref={characterRef}
                    className="absolute -top-16 left-1/2 -translate-x-1/2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{
                      y: isJumping ? -8 : 0,
                      opacity: 1,
                      x: isRunning ? (direction === 'right' ? 20 : -20) : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <PersianCharacter
                      color={member.color}
                      isRunning={isRunning}
                      direction={direction}
                      isJumping={isJumping}
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Current milestone info */}
          <motion.div
            className="mt-6 p-3 rounded-lg text-center"
            style={{
              background: `linear-gradient(135deg, ${member.color}15, transparent)`,
              border: `1px solid ${member.color}20`,
            }}
            key={currentMilestone}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xl mb-1">{member.milestones[currentMilestone].icon}</div>
            <div className="font-mono text-sm font-bold" style={{ color: member.color }}>
              {member.milestones[currentMilestone].title}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {member.milestones[currentMilestone].desc}
            </div>
            <div className="font-mono text-[10px] text-gray-600 mt-2">
              LEVEL {currentMilestone + 1} / {member.milestones.length}
            </div>
          </motion.div>
        </div>

        {/* Quote */}
        <div
          className="px-6 py-4 mt-2"
          style={{
            background: `linear-gradient(90deg, transparent, ${member.color}10, transparent)`,
            borderTop: `1px solid ${member.color}20`,
          }}
        >
          <p className="text-gray-400 text-sm italic text-center">"{member.quote}"</p>
          <p className="text-xs mt-1 font-mono text-center" style={{ color: member.color }}>
            — {member.fullName}
          </p>
        </div>

        {/* Decorative corners */}
        <div
          className="absolute top-8 left-0 w-12 h-12"
          style={{
            background: `linear-gradient(135deg, ${member.color}20 0%, transparent 50%)`,
          }}
        />
        <div
          className="absolute top-8 right-0 w-12 h-12"
          style={{
            background: `linear-gradient(-135deg, ${member.color}20 0%, transparent 50%)`,
          }}
        />
      </div>
    </motion.div>
  );
}

// Scanlines overlay
function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
      }}
    />
  );
}

export function TeamArcade() {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
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

      {/* Persian pattern background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L45 15 L30 30 L15 15 Z' fill='none' stroke='%236366f1' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%236366f1' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: teamMembers[0].color }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: teamMembers[1].color }}
      />

      <ScanlineOverlay />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-xl">🏛️</span>
            <span className="font-mono text-xs text-gray-400 tracking-widest uppercase">
              The Journey Begins
            </span>
            <span className="text-amber-400 animate-pulse">⚔️</span>
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

        {/* Player cards - Side by side */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <PersianJourney
            member={teamMembers[0]}
            side="left"
            isVisible={isVisible}
          />
          <PersianJourney
            member={teamMembers[1]}
            side="right"
            isVisible={isVisible}
          />
        </div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <span className="text-xl">🏆</span>
            <span className="font-mono text-xs text-gray-500">COMBINED</span>
            <span className="font-mono text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              50+ YEARS
            </span>
            <span className="font-mono text-xs text-gray-500">OF QUESTS</span>
            <span className="text-xl">🏆</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
