"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Calendar, Clock, Users, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface AvailabilityBannerProps {
  variant?: "sticky" | "inline" | "floating";
  className?: string;
  showCountdown?: boolean;
  dismissible?: boolean;
}

// Availability configuration
const availabilityConfig = {
  totalSlotsPerYear: 10,
  availableSlots: 2,
  currentQuarter: "Q2 2026",
  nextAvailableDate: "Marzec 2026",
  bookedPercentage: 80,
};

// Pulsing dot component
function PulsingDot({ color = "#b8860b" }: { color?: string }) {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-3 w-3"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

// Countdown component
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-3">
      <div className="text-center">
        <div className="text-lg font-bold text-[#b8860b]">{timeLeft.days}</div>
        <div className="text-[10px] uppercase tracking-wider text-white/40">
          dni
        </div>
      </div>
      <span className="text-white/20">:</span>
      <div className="text-center">
        <div className="text-lg font-bold text-[#b8860b]">{timeLeft.hours}</div>
        <div className="text-[10px] uppercase tracking-wider text-white/40">
          godz
        </div>
      </div>
      <span className="text-white/20">:</span>
      <div className="text-center">
        <div className="text-lg font-bold text-[#b8860b]">
          {timeLeft.minutes}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-white/40">
          min
        </div>
      </div>
    </div>
  );
}

// Progress bar component
function AvailabilityProgress({
  percentage,
  className,
  t,
}: {
  percentage: number;
  className?: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#b8860b] to-[#d4a94d]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between mt-2 text-[10px] uppercase tracking-wider text-white/30">
        <span>{t("progress.availability", { fallback: "Dostepnosc" })}</span>
        <span>{percentage}% {t("progress.booked", { fallback: "zarezerwowane" })}</span>
      </div>
    </div>
  );
}

// Inline banner variant
function InlineBanner({
  isInView,
  showCountdown,
  t,
}: {
  isInView: boolean;
  showCountdown: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  // Target date for countdown (e.g., end of booking window)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 14); // 14 days from now

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* Outer glow */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-[#b8860b]/20 via-[#b8860b]/10 to-[#b8860b]/20 blur-xl" />

      <div className="relative rounded-3xl bg-gradient-to-br from-[#0d0d12] to-[#0a0a0f] border border-[#b8860b]/20 overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #b8860b 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left side - Main message */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <PulsingDot color="#22c55e" />
                <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest">
                  {t("status.available")}
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {t("inline.headline", { fallback: "Obecnie przyjmujemy" })}{" "}
                <span className="text-[#b8860b]">
                  {availabilityConfig.availableSlots} {t("inline.newClients", { fallback: "nowych klientow" })}
                </span>{" "}
                {t("inline.forQuarter", { fallback: "na" })} {availabilityConfig.currentQuarter}
              </h3>

              <p className="text-white/50 text-sm md:text-base max-w-xl">
                {t("inline.description", {
                  fallback: `Realizujemy ${availabilityConfig.totalSlotsPerYear} projektow rocznie, aby zapewnic najwyzsza jakosc wspolpracy. Zarezerwuj termin rozmowy, zanim miejsca zostana zajete.`,
                  totalSlots: availabilityConfig.totalSlotsPerYear
                })}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Users className="w-4 h-4 text-[#b8860b]" />
                  <span>
                    {availabilityConfig.totalSlotsPerYear} {t("inline.projectsPerYear", { fallback: "projektow rocznie" })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Calendar className="w-4 h-4 text-[#b8860b]" />
                  <span>
                    {availabilityConfig.availableSlots} {t("inline.slotsAvailable", { fallback: "miejsca dostepne" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Countdown or CTA */}
            <div className="flex flex-col items-center lg:items-end gap-4">
              {showCountdown && (
                <div className="text-center lg:text-right mb-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
                    {t("nextAvailable")}
                  </p>
                  <CountdownTimer targetDate={targetDate} />
                </div>
              )}

              <a
                href="#kontakt"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#b8860b] hover:bg-[#d4a94d] text-white font-medium transition-all duration-300"
              >
                {t("cta")}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <p className="text-xs text-white/30">
                {t("bookingInfo")}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <AvailabilityProgress
            percentage={availabilityConfig.bookedPercentage}
            className="mt-8"
            t={t}
          />
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-bl from-[#b8860b] to-transparent rounded-bl-full" />
        </div>
      </div>
    </motion.div>
  );
}

// Sticky banner variant
function StickyBannerContent({
  onDismiss,
  dismissible,
  t,
}: {
  onDismiss: () => void;
  dismissible: boolean;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="relative bg-gradient-to-r from-[#0d0d12] via-[#0a0a0f] to-[#0d0d12] border-b border-[#b8860b]/20">
      {/* Subtle animated gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.1), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          {/* Pulsing indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <PulsingDot />
            <span className="text-xs font-medium text-[#b8860b] uppercase tracking-wider">
              Live
            </span>
          </div>

          {/* Main message */}
          <div className="flex items-center gap-2 text-sm md:text-base">
            <span className="text-white/80">
              <span className="font-semibold text-[#b8860b]">
                {availabilityConfig.availableSlots} {t("sticky.slots", { fallback: "miejsca" })}
              </span>{" "}
              {t("sticky.availableFor", { fallback: "dostepne na" })} {availabilityConfig.currentQuarter}
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-white/50">
              {availabilityConfig.totalSlotsPerYear} {t("inline.projectsPerYear", { fallback: "projektow rocznie" })}
            </span>
          </div>

          {/* CTA */}
          <a
            href="#kontakt"
            className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#b8860b]/20 border border-[#b8860b]/40 text-[#b8860b] text-sm font-medium hover:bg-[#b8860b]/30 transition-colors"
          >
            {t("sticky.book", { fallback: "Zarezerwuj" })}
            <ChevronRight className="w-4 h-4" />
          </a>

          {/* Dismiss button */}
          {dismissible && (
            <button
              onClick={onDismiss}
              className="absolute right-4 p-1 rounded-full hover:bg-white/5 transition-colors"
              aria-label={t("close", { fallback: "Zamknij" })}
            >
              <X className="w-4 h-4 text-white/40 hover:text-white/60" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Floating variant
function FloatingBanner({ onDismiss, t }: { onDismiss: () => void; t: ReturnType<typeof useTranslations> }) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* Glow */}
      <div className="absolute -inset-2 bg-[#b8860b]/20 rounded-3xl blur-xl" />

      <div className="relative bg-gradient-to-br from-[#0d0d12] to-[#0a0a0f] rounded-2xl border border-[#b8860b]/30 p-5 shadow-2xl shadow-black/50 max-w-sm">
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/5 transition-colors"
          aria-label={t("close", { fallback: "Zamknij" })}
        >
          <X className="w-4 h-4 text-white/40" />
        </button>

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#b8860b]/10 border border-[#b8860b]/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-[#b8860b]" />
          </div>

          {/* Content */}
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <PulsingDot color="#22c55e" />
              <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">
                {t("floating.available", { fallback: "Dostepne" })}
              </span>
            </div>

            <p className="text-white font-medium mb-1">
              {availabilityConfig.availableSlots} {t("floating.slotsFor", { fallback: "miejsca na" })}{" "}
              {availabilityConfig.currentQuarter}
            </p>
            <p className="text-white/50 text-sm mb-4">
              {t("floating.nextAvailable", { fallback: "Nastepny wolny termin:" })}{" "}
              <span className="text-[#b8860b]">
                {availabilityConfig.nextAvailableDate}
              </span>
            </p>

            <a
              href="#kontakt"
              className="inline-flex items-center gap-1 text-[#b8860b] text-sm font-medium hover:text-[#d4a94d] transition-colors"
            >
              {t("floating.checkAvailability", { fallback: "Sprawdz dostepnosc" })}
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AvailabilityBanner({
  variant = "inline",
  className,
  showCountdown = false,
  dismissible = true,
}: AvailabilityBannerProps) {
  const t = useTranslations("availability");
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage for dismissed state
  useEffect(() => {
    const dismissed = localStorage.getItem("availability-banner-dismissed");
    if (dismissed) {
      const dismissedAt = new Date(dismissed);
      const hoursSinceDismissed =
        (new Date().getTime() - dismissedAt.getTime()) / (1000 * 60 * 60);
      // Show again after 24 hours
      if (hoursSinceDismissed < 24) {
        setIsDismissed(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(
      "availability-banner-dismissed",
      new Date().toISOString()
    );
  };

  if (isDismissed && variant !== "inline") {
    return null;
  }

  // Sticky variant
  if (variant === "sticky") {
    return (
      <AnimatePresence>
        {!isDismissed && (
          <motion.div
            className={cn("sticky top-0 z-50", className)}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <StickyBannerContent
              onDismiss={handleDismiss}
              dismissible={dismissible}
              t={t}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Floating variant
  if (variant === "floating") {
    return (
      <AnimatePresence>
        {!isDismissed && <FloatingBanner onDismiss={handleDismiss} t={t} />}
      </AnimatePresence>
    );
  }

  // Inline variant (default)
  return (
    <div
      ref={containerRef}
      className={cn("py-16 md:py-24 bg-[#0a0a0f]", className)}
    >
      <div className="max-w-5xl mx-auto px-6">
        <InlineBanner isInView={isInView} showCountdown={showCountdown} t={t} />
      </div>
    </div>
  );
}
