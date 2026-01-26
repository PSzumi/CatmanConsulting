"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  X,
  TrendingUp,
  Clock,
  MousePointer,
  Eye,
  RotateCcw,
  Zap,
  Target,
  MessageSquare,
  Calculator,
  Calendar,
  Video,
  Sparkles,
} from "lucide-react";
import { useLeadScoring } from "@/lib/useLeadScoring";

export function LeadScoreIndicator() {
  const { leadData, isLoaded, resetData } = useLeadScoring();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  const isDev = process.env.NODE_ENV === "development";
  if (!isDev || !isLoaded || !leadData) return null;

  const gradeConfig = {
    hot: { bg: "#ef4444", text: "text-red-400", label: "Gorący", icon: Zap },
    warm: { bg: "#f59e0b", text: "text-amber-400", label: "Ciepły", icon: TrendingUp },
    cold: { bg: "#3b82f6", text: "text-blue-400", label: "Zimny", icon: Target },
    new: { bg: "#6b7280", text: "text-gray-400", label: "Nowy", icon: Eye },
  };

  const grade = gradeConfig[leadData.grade];
  const GradeIcon = grade.icon;

  const handleReset = () => {
    if (confirm("Czy na pewno chcesz zresetować dane lead scoring?")) {
      resetData();
    }
  };

  return (
    <>
      {/* Floating indicator */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-gray-900/95 backdrop-blur border border-gray-700 shadow-lg hover:border-gray-500 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: grade.bg }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs font-medium text-gray-300">
          Score: <span className={grade.text}>{leadData.score}</span>
        </span>
      </motion.button>

      {/* Detail panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 left-6 z-50 w-80 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-gray-700 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#b8860b]" />
                <span className="font-semibold text-white">Lead Analytics</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">DEV</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-white"
                  title="Reset data"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Engagement Score</span>
                <span
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${grade.text}`}
                  style={{ backgroundColor: `${grade.bg}20` }}
                >
                  <GradeIcon className="w-3 h-3" />
                  {grade.label}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-white">{leadData.score}</span>
                <span className="text-gray-500 mb-1">/100</span>
              </div>
              <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #3b82f6 0%, #f59e0b 50%, #ef4444 100%)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${leadData.score}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="p-4 grid grid-cols-2 gap-3 border-b border-gray-800">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Views</span>
                <span className="ml-auto text-white font-medium">{leadData.pageViews}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Time</span>
                <span className="ml-auto text-white font-medium">
                  {Math.floor(leadData.totalTimeOnSite / 60)}:{String(leadData.totalTimeOnSite % 60).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MousePointer className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Scroll</span>
                <span className="ml-auto text-white font-medium">{leadData.scrollDepth}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">Visits</span>
                <span className="ml-auto text-white font-medium">{leadData.visitCount}</span>
              </div>
            </div>

            {/* Engagement Signals */}
            <div className="p-4 border-b border-gray-800">
              <p className="text-xs text-gray-500 mb-3">Engagement Signals</p>
              <div className="grid grid-cols-2 gap-2">
                <SignalBadge
                  icon={MessageSquare}
                  label="Quiz"
                  active={leadData.quizCompleted}
                  pending={leadData.quizStarted && !leadData.quizCompleted}
                />
                <SignalBadge
                  icon={Calculator}
                  label="Calculator"
                  active={leadData.calculatorUsed}
                />
                <SignalBadge
                  icon={Calendar}
                  label="Calendly"
                  active={leadData.calendlyClicked}
                />
                <SignalBadge
                  icon={Video}
                  label="Video"
                  active={leadData.videoRecorded}
                />
                <SignalBadge
                  icon={Target}
                  label={`Form (${leadData.contactFormStep}/3)`}
                  active={leadData.contactFormStep >= 3}
                  pending={leadData.contactFormStarted && leadData.contactFormStep < 3}
                />
                <SignalBadge
                  icon={Sparkles}
                  label="Easter Egg"
                  active={leadData.easterEggFound}
                />
              </div>
            </div>

            {/* Alerts */}
            {leadData.alerts.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-[#b8860b]/10 to-transparent border-b border-gray-800">
                <p className="text-xs text-[#b8860b] mb-2 font-medium">Alerts</p>
                <ul className="space-y-1">
                  {leadData.alerts.slice(0, 4).map((alert, i) => (
                    <li key={i} className="text-sm text-white/80">
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-800/30 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">
                {leadData.visitorId.slice(0, 16)}
              </span>
              <span className="text-xs text-gray-600">
                {leadData.returnVisit ? "Returning" : "New"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SignalBadge({
  icon: Icon,
  label,
  active,
  pending = false,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  pending?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
        active
          ? "bg-emerald-500/20 text-emerald-400"
          : pending
          ? "bg-amber-500/20 text-amber-400"
          : "bg-gray-800/50 text-gray-500"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
      {active && <span className="ml-auto">✓</span>}
      {pending && <span className="ml-auto">...</span>}
    </div>
  );
}
