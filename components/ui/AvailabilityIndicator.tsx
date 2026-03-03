"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
  consultant: "tomek" | "mariusz" | "both";
}

interface AvailabilityIndicatorProps {
  className?: string;
  compact?: boolean;
  onSlotSelect?: (slot: TimeSlot) => void;
}

// Mock availability data - in production, this would come from Calendly API
function generateMockAvailability(): TimeSlot[] {
  const now = new Date();
  const slots: TimeSlot[] = [];

  // Generate slots for today and tomorrow
  for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() + dayOffset);

    const startHour = dayOffset === 0 ? Math.max(9, now.getHours() + 1) : 9;

    for (let hour = startHour; hour <= 17; hour += 2) {
      if (hour <= 17) {
        const isAvailable = Math.random() > 0.4; // 60% chance of availability
        const consultant = Math.random() > 0.5 ? "tomek" : Math.random() > 0.5 ? "mariusz" : "both";

        const dayName = dayOffset === 0 ? "Dziś" : "Jutro";
        slots.push({
          time: `${dayName}, ${hour}:00`,
          available: isAvailable,
          consultant: isAvailable ? consultant : "tomek",
        });
      }
    }
  }

  return slots.filter((s) => s.available).slice(0, 4);
}

const consultantNames = {
  tomek: "Tomek",
  mariusz: "Mariusz",
  both: "Tomek lub Mariusz",
};

const consultantColors = {
  tomek: "#2d5a7b",
  mariusz: "#8b1a1a",
  both: "#8b1a1a",
};

export function AvailabilityIndicator({
  className,
  compact = false,
  onSlotSelect,
}: AvailabilityIndicatorProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setSlots(generateMockAvailability());
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const nextAvailable = slots[0];
  const isAvailableNow = nextAvailable?.time.includes("Dziś") &&
    parseInt(nextAvailable.time.split(", ")[1]) === new Date().getHours();

  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    onSlotSelect?.(slot);
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div
          className={cn(
            "w-2.5 h-2.5 rounded-full",
            isAvailableNow ? "bg-emerald-500 animate-pulse" : "bg-[#8b1a1a]"
          )}
        />
        <span className="text-sm text-gray-400">
          {!isLoaded ? (
            "Sprawdzanie..."
          ) : isAvailableNow ? (
            <span className="text-emerald-400">Dostępny teraz</span>
          ) : nextAvailable ? (
            <>
              Najbliższy termin:{" "}
              <span className="text-white font-medium">{nextAvailable.time}</span>
            </>
          ) : (
            "Brak wolnych terminów"
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#8b1a1a]" />
          <span className="text-sm font-medium text-white">Dostępność</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              isAvailableNow ? "bg-emerald-500 animate-pulse" : "bg-[#8b1a1a]"
            )}
          />
          <span className="text-xs text-gray-400">
            {isAvailableNow ? "Online teraz" : "Sprawdź terminy"}
          </span>
        </div>
      </div>

      {/* Loading state */}
      {!isLoaded && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 rounded-lg bg-gray-800/50 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Slots */}
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {slots.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Brak wolnych terminów w najbliższych dniach.
                <br />
                Napisz do nas, a znajdziemy rozwiązanie.
              </p>
            ) : (
              slots.map((slot, index) => (
                <motion.button
                  key={slot.time}
                  onClick={() => handleSlotClick(slot)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                    "border",
                    selectedSlot?.time === slot.time
                      ? "border-[#8b1a1a] bg-[#8b1a1a]/10"
                      : "border-gray-800 bg-gray-900/30 hover:border-gray-700 hover:bg-gray-900/50"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${consultantColors[slot.consultant]}20` }}
                    >
                      <Clock
                        className="w-4 h-4"
                        style={{ color: consultantColors[slot.consultant] }}
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{slot.time}</p>
                      <p className="text-xs text-gray-500">
                        {consultantNames[slot.consultant]}
                      </p>
                    </div>
                  </div>
                  {selectedSlot?.time === slot.time ? (
                    <Check className="w-4 h-4 text-[#8b1a1a]" />
                  ) : (
                    <span className="text-xs text-gray-500">Wybierz</span>
                  )}
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected slot CTA */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <a
              href={`https://calendly.com/catman-consulting/20min?date=${encodeURIComponent(selectedSlot.time)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#8b1a1a] hover:bg-[#b32424] text-white font-medium transition-colors"
            >
              Zarezerwuj {selectedSlot.time.split(", ")[1]}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
