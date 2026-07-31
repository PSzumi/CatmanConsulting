"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useFaqItems,
  getRelated,
  FAQ_ICONS,
  FAQ_ICON_FALLBACK,
  type FaqItem,
} from "@/lib/faq";
import { BOOK_CONSULTATION_EVENT } from "@/lib/constants";

// ============================================
// SOUND ENGINE - Web Audio API
// ============================================
class SoundEngine {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Gentle "ding" for receiving message
  playReceive() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  // Soft "whoosh" for opening chat
  playOpen() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Click sound
  playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  }

  // Notification sound
  playNotification() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Two-tone notification
    [0, 0.15].forEach((delay, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(i === 0 ? 523.25 : 659.25, ctx.currentTime + delay);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.12);

      oscillator.start(ctx.currentTime + delay);
      oscillator.stop(ctx.currentTime + delay + 0.12);
    });
  }
}

// Global sound engine instance
const soundEngine = typeof window !== "undefined" ? new SoundEngine() : null;

// Aurora Floating Orb - The main button
function AuroraOrb({
  onClick,
  hasNotification,
}: {
  onClick: () => void;
  hasNotification: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="relative w-16 h-16 rounded-full cursor-pointer outline-none"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      {/* Outer aurora glow */}
      <motion.div
        className="absolute -inset-2 rounded-full opacity-60 blur-xl"
        style={{
          background:
            "conic-gradient(from 0deg, #b8860b, #6366f1, #ec4899, #b8860b)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner glow pulse */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md"
        style={{
          background: "linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main orb */}
      <motion.div
        className="absolute inset-1 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #b8860b 0%, #8b6914 100%)",
          boxShadow: `
            inset 0 2px 20px rgba(255,255,255,0.3),
            0 4px 30px rgba(184, 134, 11, 0.5)
          `,
        }}
        animate={{
          boxShadow: isHovered
            ? `inset 0 2px 20px rgba(255,255,255,0.4), 0 8px 50px rgba(184, 134, 11, 0.7)`
            : `inset 0 2px 20px rgba(255,255,255,0.3), 0 4px 30px rgba(184, 134, 11, 0.5)`,
        }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
          }}
        />

        {/* Icon */}
        <motion.div animate={{ rotate: isHovered ? 15 : 0 }}>
          <Sparkles className="w-7 h-7 text-white drop-shadow-lg" />
        </motion.div>
      </motion.div>

      {/* Notification badge */}
      {hasNotification && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border-2 border-[#0a0a0f]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
        >
          <span className="text-[10px] font-bold text-white">1</span>
        </motion.div>
      )}

      {/* Pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#b8860b]"
        animate={{
          scale: [1, 1.8],
          opacity: [0.6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#b8860b]"
        animate={{
          scale: [1, 1.8],
          opacity: [0.6, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
      />
    </motion.button>
  );
}

// Single question row - used both in the list and under an answer
function QuestionRow({
  item,
  onSelect,
}: {
  item: FaqItem;
  onSelect: (id: string) => void;
}) {
  const Icon = FAQ_ICONS[item.icon] ?? FAQ_ICON_FALLBACK;

  return (
    <motion.button
      className="w-full flex items-center gap-3 p-3 rounded-xl text-left bg-white/[0.03] border border-white/[0.06] hover:bg-[#b8860b]/10 hover:border-[#b8860b]/30 transition-colors"
      onClick={() => {
        soundEngine?.playClick();
        onSelect(item.id);
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <span className="shrink-0 w-9 h-9 rounded-lg bg-[#b8860b]/15 flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#d4a84b]" />
      </span>
      <span className="text-sm text-white/80 leading-snug">{item.question}</span>
    </motion.button>
  );
}

// Booking CTA - hands off to the contact form via a window event
function BookCta({ label, onBook }: { label: string; onBook: () => void }) {
  return (
    <button
      type="button"
      onClick={onBook}
      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-transform hover:scale-[1.02]"
      style={{
        background: "linear-gradient(135deg, #b8860b 0%, #d4a84b 100%)",
        color: "#0a0a0f",
        boxShadow: "0 8px 30px rgba(184, 134, 11, 0.4)",
      }}
    >
      <Calendar className="w-4 h-4" />
      {label}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}

// Main AIConcierge Component
export function AIConcierge() {
  const t = useTranslations("aiConcierge");
  const items = useFaqItems();

  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasNotification, setHasNotification] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activeItem = activeId
    ? items.find((item) => item.id === activeId) ?? null
    : null;
  const related = activeId ? getRelated(items, activeId) : [];

  // Sync sound enabled state
  useEffect(() => {
    soundEngine?.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Show notification after delay if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && activeId === null) {
        setHasNotification(true);
        soundEngine?.playNotification();
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [isOpen, activeId]);

  const handleOpen = useCallback(() => {
    soundEngine?.playOpen();
    setIsOpen(true);
    setHasNotification(false);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    soundEngine?.playReceive();
  }, []);

  const handleBack = useCallback(() => {
    soundEngine?.playClick();
    setActiveId(null);
  }, []);

  // Close first, then ask the contact form to open - otherwise the panel exit
  // animation fights the scroll.
  const handleBook = useCallback(() => {
    soundEngine?.playClick();
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent(BOOK_CONSULTATION_EVENT));
  }, []);

  return (
    <>
      {/* Floating Orb Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {!isOpen && (
            <AuroraOrb onClick={handleOpen} hasNotification={hasNotification} />
          )}
        </AnimatePresence>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-[60] flex flex-col w-[420px] max-w-[calc(100vw-48px)] max-h-[calc(100dvh-7rem)] rounded-3xl overflow-hidden"
            style={{
              background: "rgba(10, 10, 15, 0.97)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `
                0 25px 100px rgba(0,0,0,0.6),
                0 0 80px rgba(184, 134, 11, 0.1),
                inset 0 1px 0 rgba(255,255,255,0.05)
              `,
            }}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header with Aurora Effect */}
            <div
              className="relative shrink-0 px-5 py-4 border-b border-white/[0.06] overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(10, 10, 15, 0.95) 100%)",
              }}
            >
              {/* Animated aurora gradient */}
              <motion.div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.2), rgba(99, 102, 241, 0.15), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "200% 0%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #b8860b 0%, #8b6914 100%)",
                        boxShadow: "0 4px 20px rgba(184, 134, 11, 0.4)",
                      }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0a0a0f]">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-emerald-400"
                        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t("title")}</h3>
                    <p className="text-xs text-white/40 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      {t("subtitle")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const newState = !soundEnabled;
                      setSoundEnabled(newState);
                      // Play click sound before disabling (or after enabling)
                      if (newState) {
                        setTimeout(() => soundEngine?.playClick(), 50);
                      }
                    }}
                    className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-white/40" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-white/40" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      soundEngine?.playClick();
                      setIsOpen(false);
                    }}
                    aria-label={t("closeButton")}
                    className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content: question list or a single answer */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 sm:flex-none sm:h-[420px] overflow-y-auto overscroll-contain p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <AnimatePresence mode="wait">
                {activeItem ? (
                  <motion.div
                    key="answer"
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {t("back")}
                    </button>

                    <h4 className="text-base font-semibold text-white leading-snug">
                      {activeItem.question}
                    </h4>

                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                      {activeItem.answer}
                    </p>

                    {related.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <p className="text-[11px] uppercase tracking-wider text-white/30">
                          {t("related")}
                        </p>
                        {related.map((item) => (
                          <QuestionRow
                            key={item.id}
                            item={item}
                            onSelect={handleSelect}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm text-white/50 pb-1">{t("greeting")}</p>
                    {items.map((item) => (
                      <QuestionRow
                        key={item.id}
                        item={item}
                        onSelect={handleSelect}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer CTA */}
            <div className="shrink-0 p-4 border-t border-white/[0.06] bg-white/[0.02] space-y-2">
              <p className="text-center text-xs text-white/40">{t("noAnswer")}</p>
              <BookCta label={t("bookCta")} onBook={handleBook} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
