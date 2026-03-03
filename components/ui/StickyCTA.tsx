"use client";

import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { scrollY } = useScroll();

  // Show after scrolling past hero, hide near contact section
  useEffect(() => {
    const checkVisibility = (scrollPos: number) => {
      if (isDismissed) {
        setIsVisible(false);
        return;
      }

      const contactSection = document.getElementById("kontakt");
      const nearContact = contactSection
        ? contactSection.getBoundingClientRect().top < window.innerHeight
        : false;

      if (scrollPos > 600 && !nearContact) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    return scrollY.on("change", checkVisibility);
  }, [scrollY, isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-24 right-6 z-40 flex items-center gap-2"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {/* Main CTA button */}
          <motion.a
            href="#kontakt"
            className="group relative flex items-center gap-3 px-6 py-4 rounded-full bg-[#8b1a1a] text-white font-medium shadow-lg shadow-[#8b1a1a]/20 hover:shadow-xl hover:shadow-[#8b1a1a]/30 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Subtle pulse effect */}
            <motion.span
              className="absolute inset-0 rounded-full bg-[#8b1a1a]"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <Calendar className="relative w-5 h-5" />
            <span className="relative hidden sm:inline">Umów rozmowę</span>
          </motion.a>

          {/* Dismiss button - subtle */}
          <motion.button
            onClick={handleDismiss}
            className="p-2 rounded-full bg-card border border-border text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Zamknij"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
