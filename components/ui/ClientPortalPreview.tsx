"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Lock,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientPortalPreviewProps {
  className?: string;
}

const portalTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "documents", label: "Dokumenty", icon: FileText },
  { id: "messages", label: "Wiadomości", icon: MessageSquare },
  { id: "calendar", label: "Kalendarz", icon: Calendar },
];

const mockTasks = [
  { id: 1, title: "Wywiad z CEO", status: "completed", date: "15 sty" },
  { id: 2, title: "Analiza procesów HR", status: "completed", date: "18 sty" },
  { id: 3, title: "Warsztaty z liderami", status: "in_progress", date: "22 sty" },
  { id: 4, title: "Raport diagnostyczny", status: "pending", date: "28 sty" },
];

const mockMetrics = [
  { label: "Postęp projektu", value: "45%", change: "+12%", positive: true },
  { label: "Zaangażowanie", value: "87%", change: "+5%", positive: true },
  { label: "Zadania ukończone", value: "12/26", change: "", positive: true },
];

function MockDashboard() {
  return (
    <div className="p-4 space-y-4">
      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3">
        {mockMetrics.map((metric) => (
          <div
            key={metric.label}
            className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
          >
            <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-lg font-bold text-white">{metric.value}</span>
              {metric.change && (
                <span className={cn(
                  "text-xs",
                  metric.positive ? "text-emerald-400" : "text-red-400"
                )}>
                  {metric.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Faza 1: Świadomość</span>
          <span className="text-xs text-[#b8860b]">45%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#2d5a7b] to-[#b8860b] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "45%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Tasks list */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-400 px-1">Zadania</p>
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center",
                task.status === "completed"
                  ? "bg-emerald-500/20"
                  : task.status === "in_progress"
                  ? "bg-[#b8860b]/20"
                  : "bg-gray-700/50"
              )}
            >
              {task.status === "completed" ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : task.status === "in_progress" ? (
                <Clock className="w-3 h-3 text-[#b8860b]" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-600" />
              )}
            </div>
            <span
              className={cn(
                "flex-1 text-xs",
                task.status === "completed" ? "text-gray-500 line-through" : "text-gray-300"
              )}
            >
              {task.title}
            </span>
            <span className="text-xs text-gray-600">{task.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockDocuments() {
  return (
    <div className="p-4 space-y-3">
      {[
        { name: "Raport_wstępny.pdf", size: "2.4 MB", date: "15 sty" },
        { name: "Harmonogram_projektu.xlsx", size: "156 KB", date: "16 sty" },
        { name: "Wywiady_notatki.docx", size: "890 KB", date: "18 sty" },
      ].map((doc) => (
        <div
          key={doc.name}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
        >
          <FileText className="w-5 h-5 text-[#b8860b]" />
          <div className="flex-1">
            <p className="text-sm text-white">{doc.name}</p>
            <p className="text-xs text-gray-500">{doc.size}</p>
          </div>
          <span className="text-xs text-gray-600">{doc.date}</span>
        </div>
      ))}
    </div>
  );
}

function MockMessages() {
  return (
    <div className="p-4 space-y-3">
      {[
        { from: "Tomek", message: "Przesyłam podsumowanie ze spotkania...", time: "10:30", unread: true },
        { from: "Mariusz", message: "Materiały do warsztatu są gotowe", time: "wczoraj", unread: false },
      ].map((msg, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg transition-colors",
            msg.unread ? "bg-[#b8860b]/10 border border-[#b8860b]/20" : "bg-gray-800/30"
          )}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: msg.from === "Tomek" ? "#2d5a7b30" : "#b8860b30" }}
          >
            {msg.from[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{msg.from}</span>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{msg.message}</p>
          </div>
          {msg.unread && <div className="w-2 h-2 rounded-full bg-[#b8860b]" />}
        </div>
      ))}
    </div>
  );
}

function MockCalendar() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
          const hasEvent = [15, 18, 22, 28].includes(day);
          const isToday = day === 20;
          return (
            <div
              key={day}
              className={cn(
                "aspect-square flex items-center justify-center text-xs rounded-lg",
                isToday
                  ? "bg-[#b8860b] text-white font-bold"
                  : hasEvent
                  ? "bg-[#b8860b]/20 text-[#b8860b]"
                  : "text-gray-500 hover:bg-gray-800"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ClientPortalPreview({ className }: ClientPortalPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <MockDashboard />;
      case "documents":
        return <MockDocuments />;
      case "messages":
        return <MockMessages />;
      case "calendar":
        return <MockCalendar />;
      default:
        return <MockDashboard />;
    }
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "group flex items-center gap-3 p-4 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-[#b8860b]/30 hover:bg-gray-900/80 transition-all",
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-12 h-12 rounded-xl bg-[#b8860b]/10 flex items-center justify-center group-hover:bg-[#b8860b]/20 transition-colors">
          <Eye className="w-6 h-6 text-[#b8860b]" />
        </div>
        <div className="text-left">
          <p className="font-medium text-white">Zobacz portal klienta</p>
          <p className="text-sm text-gray-500">Podgląd panelu współpracy</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#b8860b] group-hover:translate-x-1 transition-all ml-auto" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Portal preview */}
            <motion.div
              className="relative w-full max-w-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Browser frame */}
              <div className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 shadow-2xl">
                {/* Browser header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/50">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-gray-400">portal.catman.consulting</span>
                  </div>
                </div>

                {/* Portal header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">
                      <span className="text-white">Catman</span>
                      <span className="text-[#b8860b] ml-1">Portal</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#b8860b]/20 flex items-center justify-center text-xs font-bold text-[#b8860b]">
                      JK
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                  {portalTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all",
                          isActive
                            ? "text-[#b8860b] border-b-2 border-[#b8860b] bg-[#b8860b]/5"
                            : "text-gray-500 hover:text-gray-300"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="h-[300px] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderTabContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Caption */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Każdy klient otrzymuje dostęp do dedykowanego portalu współpracy
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
