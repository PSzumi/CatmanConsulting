"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import { useVisitorPersonalization } from "@/lib/useVisitorPersonalization";

export function ReturningVisitorBanner() {
  const {
    isLoaded,
    isReturningVisitor,
    visitorData,
    getPersonalizedGreeting,
    getRecommendedAction,
  } = useVisitorPersonalization();

  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isLoaded && isReturningVisitor && !isDismissed) {
      // Delay showing banner for smooth experience
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isReturningVisitor, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setIsDismissed(true), 300);
  };

  const greeting = getPersonalizedGreeting();
  const recommendation = getRecommendedAction();

  if (!isLoaded || !isReturningVisitor || isDismissed || !greeting) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-24 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-40"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div
            className="relative p-5 rounded-2xl backdrop-blur-xl border border-[#8b1a1a]/30 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(45,90,123,0.2) 100%)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(139,26,26,0.1)",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Zamknij"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#8b1a1a]/20 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-[#8b1a1a]" />
              </div>
              <div>
                <p className="text-sm text-[#8b1a1a] font-medium">Witaj ponownie!</p>
                <p className="text-xs text-gray-500">
                  Wizyta #{visitorData.visitCount}
                </p>
              </div>
            </div>

            {/* Personalized message */}
            <p className="text-white font-medium mb-4">{greeting}</p>

            {/* Recommendation */}
            {recommendation && (
              <a
                href={recommendation.href}
                onClick={handleDismiss}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-[#8b1a1a] transition-colors">
                    {recommendation.action}
                  </p>
                  <p className="text-xs text-gray-500">{recommendation.reason}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-[#8b1a1a] group-hover:translate-x-1 transition-all" />
              </a>
            )}

            {/* Previous results indicator */}
            {(visitorData.quizCompleted || visitorData.calculatorUsed) && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-4 text-xs text-gray-500">
                {visitorData.quizCompleted && (
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#8b1a1a]" />
                    Diagnoza: {visitorData.quizScore}/30 pkt
                  </span>
                )}
                {visitorData.calculatorUsed && visitorData.calculatorData && (
                  <span>
                    Oszczędności: {visitorData.calculatorData.potentialSavings.toLocaleString("pl-PL")} PLN
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
