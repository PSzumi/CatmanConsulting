"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Linkedin, Share2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DigitalBadgeProps {
  score: number;
  maxScore: number;
  level: "excellent" | "good" | "warning" | "critical";
  levelTitle: string;
  onClose?: () => void;
  isOpen: boolean;
}

const levelColors = {
  excellent: { bg: "#10b981", border: "#34d399" },
  good: { bg: "#3b82f6", border: "#60a5fa" },
  warning: { bg: "#f59e0b", border: "#fbbf24" },
  critical: { bg: "#ef4444", border: "#f87171" },
};

const levelIcons = {
  excellent: "🏆",
  good: "🎯",
  warning: "📈",
  critical: "🚀",
};

export function DigitalBadge({
  score,
  maxScore,
  level,
  levelTitle,
  onClose,
  isOpen,
}: DigitalBadgeProps) {
  const [copied, setCopied] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const colors = levelColors[level];
  const dateStr = new Date().toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const certId = `CC-${Date.now().toString(36).toUpperCase()}`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
  const percentage = Math.round((score / maxScore) * 100);

  const handleLinkedInShare = () => {
    const text = `Ukończyłem diagnozę organizacyjną @CatmanConsulting! Wynik: ${percentage}% - ${levelTitle}. Sprawdź gotowość swojej organizacji:`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=600");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareUrl}#diagnoza`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: "#0a0a0f",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `certyfikat-catman-${certId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-[calc(100%-1rem)] sm:max-w-md md:max-w-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 sm:-top-12 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Certificate */}
            <div
              ref={certificateRef}
              className="relative p-5 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #0a0a0f 0%, #1a1a2e 100%)",
                border: `2px solid ${colors.border}40`,
              }}
            >
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20"
                style={{ background: colors.bg }}
              />

              <div className="relative text-center">
                <div className="mb-4">
                  <span className="text-lg font-bold">
                    <span className="text-white">Catman</span>
                    <span className="text-[#b8860b] ml-1">Consulting</span>
                  </span>
                </div>

                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    background: `${colors.bg}20`,
                    border: `3px solid ${colors.border}`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <span className="text-4xl">{levelIcons[level]}</span>
                </motion.div>

                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                  Certyfikat Diagnozy
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Potwierdzenie ukończenia diagnozy organizacyjnej
                </p>

                <div
                  className="inline-flex items-center gap-4 px-6 py-3 rounded-xl mb-6"
                  style={{
                    background: `${colors.bg}15`,
                    border: `1px solid ${colors.border}30`,
                  }}
                >
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Wynik</p>
                    <p className="text-2xl font-bold" style={{ color: colors.border }}>
                      {score}/{maxScore}
                    </p>
                  </div>
                  <div className="w-px h-10 bg-gray-700" />
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Poziom</p>
                    <p className="text-sm font-semibold text-white">{levelTitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span>{dateStr}</span>
                  <span>ID: {certId}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Pobierz
              </button>
              <button
                onClick={handleLinkedInShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5] hover:bg-[#006097] text-white text-sm transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
              <button
                onClick={handleCopyLink}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
                  copied ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? "Skopiowano!" : "Kopiuj link"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
