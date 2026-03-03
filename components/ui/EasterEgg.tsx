"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Gift } from "lucide-react";
import { Konfetti } from "./Konfetti";
import { useLeadScoring } from "@/lib/useLeadScoring";

// Floating sparkle particles around the icon
function FloatingSparkles() {
  return (
    <div className="absolute inset-0">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#b32424]"
          style={{
            left: "50%",
            top: "50%",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            x: Math.cos((i * Math.PI * 2) / 8) * 50,
            y: Math.sin((i * Math.PI * 2) / 8) * 50,
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Pulsing ring effect
function PulsingRings() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-[#8b1a1a]/40"
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 2, 2.5],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

export function EasterEgg() {
  const [isActivated, setIsActivated] = useState(false);
  const [showKonfetti, setShowKonfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [shouldActivate, setShouldActivate] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { trackEasterEgg } = useLeadScoring();

  // Handle activation in a separate effect to avoid setState during render
  useEffect(() => {
    if (shouldActivate) {
      // Start konfetti immediately
      setShowKonfetti(true);
      setIsActivated(true);
      trackEasterEgg();

      // Show modal after konfetti has started (dramatic reveal)
      setTimeout(() => setShowModal(true), 400);

      // Keep konfetti running for a while
      setTimeout(() => setShowKonfetti(false), 5000);
      setShouldActivate(false);
    }
  }, [shouldActivate, trackEasterEgg]);

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

          // Trigger on 3 clicks - set flag instead of calling activation directly
          if (newCount >= 3) {
            setShouldActivate(true);
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
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => setIsActivated(false), 300);
  };

  return (
    <>
      {/* Konfetti with high z-index to appear over everything */}
      <Konfetti active={showKonfetti} particleCount={150} duration={5000} zIndex={10002} />

      <AnimatePresence>
        {isActivated && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop with golden glow */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(139, 26, 26, 0.15) 0%, rgba(10, 10, 15, 0.98) 70%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={handleClose}
            />

            {/* Modal */}
            <AnimatePresence>
              {showModal && (
                <motion.div
                  className="relative max-w-[calc(100%-2rem)] sm:max-w-lg w-full p-5 sm:p-8 rounded-2xl sm:rounded-3xl text-center overflow-visible"
                  style={{
                    background: "linear-gradient(145deg, #2a2517 0%, #1a1a1a 100%)",
                    border: "2px solid #8b1a1a",
                    boxShadow: "0 0 80px rgba(139, 26, 26, 0.5), 0 0 120px rgba(139, 26, 26, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                  initial={{ scale: 0.3, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 30 }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    duration: 0.5
                  }}
                >
                  {/* Close button */}
                  <motion.button
                    onClick={handleClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  {/* Animated icon with effects */}
                  <motion.div
                    className="relative w-24 h-24 mx-auto mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      damping: 15,
                      stiffness: 200,
                      delay: 0.2
                    }}
                  >
                    <PulsingRings />
                    <FloatingSparkles />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b32424] to-[#8b1a1a] flex items-center justify-center shadow-lg"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(139, 26, 26, 0.5)",
                          "0 0 40px rgba(139, 26, 26, 0.8)",
                          "0 0 20px rgba(139, 26, 26, 0.5)",
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Gift className="w-12 h-12 text-white" />
                    </motion.div>
                  </motion.div>

                  {/* Content with staggered animation */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.h2
                      className="text-3xl font-bold text-foreground mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Twoja czujność się opłaciła!
                    </motion.h2>

                    <motion.p
                      className="text-foreground-secondary mb-6 leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Ciekawość i uwaga na szczegóły — to cechy liderów,
                      z którymi najchętniej współpracujemy. Masz je obie.
                    </motion.p>

                    {/* Coupon card with special animation */}
                    <motion.div
                      className="relative p-6 rounded-xl overflow-hidden mb-6"
                      style={{
                        background: "linear-gradient(135deg, rgba(139, 26, 26, 0.2) 0%, rgba(45, 90, 123, 0.2) 100%)",
                        border: "1px solid rgba(139, 26, 26, 0.4)",
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                        }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />

                      <p className="text-sm text-foreground-muted mb-2 relative">Twój kod rabatowy:</p>
                      <motion.p
                        className="font-mono text-3xl text-[#b32424] tracking-wider font-bold mb-3 relative"
                        animate={{
                          textShadow: [
                            "0 0 10px rgba(212, 168, 67, 0.5)",
                            "0 0 20px rgba(212, 168, 67, 0.8)",
                            "0 0 10px rgba(212, 168, 67, 0.5)",
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        CZUJNY2026
                      </motion.p>
                      <p className="text-sm text-foreground-secondary relative">
                        <span className="text-[#b32424] font-semibold text-lg">-15%</span> na pierwszą usługę doradczą
                      </p>
                    </motion.div>

                    <motion.p
                      className="text-xs text-foreground-muted"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      Podaj kod przy pierwszym kontakcie. Ważny do końca 2026.
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
