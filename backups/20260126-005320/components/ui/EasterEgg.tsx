"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { Konfetti } from "./Konfetti";

export function EasterEgg() {
  const [isActivated, setIsActivated] = useState(false);
  const [showKonfetti, setShowKonfetti] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activateEasterEgg = useCallback(() => {
    setIsActivated(true);
    setShowKonfetti(true);
    setTimeout(() => setShowKonfetti(false), 3000);
  }, []);

  // Listen for triple-click on logo
  useEffect(() => {
    const handleLogoClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const logo = target.closest('a[href="#"]');

      // Check if clicked on the logo in navbar
      if (logo && logo.textContent?.includes("Catman")) {
        setClickCount((prev) => {
          const newCount = prev + 1;

          // Reset count after 1 second of no clicks
          if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
          }
          clickTimeoutRef.current = setTimeout(() => setClickCount(0), 1000);

          // Trigger on 3 clicks
          if (newCount >= 3) {
            activateEasterEgg();
            return 0;
          }
          return newCount;
        });
      }
    };

    window.addEventListener("click", handleLogoClick);
    return () => {
      window.removeEventListener("click", handleLogoClick);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [activateEasterEgg]);

  const handleClose = () => {
    setIsActivated(false);
  };

  return (
    <>
      <Konfetti active={showKonfetti} particleCount={100} />

      <AnimatePresence>
        {isActivated && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-md"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              className="relative max-w-lg w-full p-8 rounded-3xl text-center"
              style={{
                background:
                  "linear-gradient(145deg, rgba(184, 134, 11, 0.2) 0%, rgba(26,26,26,0.95) 100%)",
                border: "2px solid rgba(184, 134, 11, 0.4)",
                boxShadow: "0 0 60px rgba(184, 134, 11, 0.3)",
              }}
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
              transition={{ type: "spring", damping: 20 }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-20 h-20 rounded-full bg-[#b8860b]/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-[#b8860b]" />
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Twoja czujność się opłaciła!
                </h2>

                <p className="text-foreground-secondary mb-6 leading-relaxed">
                  Ciekawość i uwaga na szczegóły — to cechy liderów,
                  z którymi najchętniej współpracujemy. Masz je obie.
                </p>

                <div className="p-5 rounded-xl bg-gradient-to-br from-[#b8860b]/20 to-[#2d5a7b]/20 border border-[#b8860b]/30 mb-6">
                  <p className="text-sm text-foreground-muted mb-2">Twój kod rabatowy:</p>
                  <p className="font-mono text-2xl text-[#b8860b] tracking-wider font-bold mb-3">
                    CZUJNY2025
                  </p>
                  <p className="text-sm text-foreground-secondary">
                    <span className="text-[#d4a843] font-semibold">-15%</span> na pierwszą usługę doradczą
                  </p>
                </div>

                <p className="text-xs text-foreground-muted">
                  Podaj kod przy pierwszym kontakcie. Ważny do końca 2025.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
