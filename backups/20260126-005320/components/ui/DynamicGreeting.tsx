"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function DynamicGreeting({ className = "" }: { className?: string }) {
  const [greeting, setGreeting] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting("Dzień dobry");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Dzień dobry");
    } else if (hour >= 18 && hour < 22) {
      setGreeting("Dobry wieczór");
    } else {
      setGreeting("Dobry wieczór");
    }
  }, []);

  if (!mounted) return <span className={className}>Dzień dobry</span>;

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {greeting}
    </motion.span>
  );
}
