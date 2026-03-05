"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="relative">
            {/* Logo animation */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                className="text-3xl font-bold text-foreground"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Catman
              </motion.span>
              <motion.span
                className="text-3xl font-bold text-accent"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Consulting
              </motion.span>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="mt-6 h-1 bg-border rounded-full overflow-hidden"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-accent via-accent-light to-brand-red rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mt-4 text-sm text-foreground-muted text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Prosto o rzeczach złożonych
            </motion.p>
          </div>

          {/* Background gradient */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
