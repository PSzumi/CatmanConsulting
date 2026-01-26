"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackCalendlyOpen } from "@/components/Analytics";

// Extend Window interface for Calendly
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface CalendlyButtonProps {
  url: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
}

export function CalendlyButton({
  url,
  className,
  children,
  variant = "primary",
}: CalendlyButtonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if Calendly script is already loaded
    if (window.Calendly) {
      setIsLoaded(true);
      return;
    }

    // Load Calendly CSS
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Load Calendly JS
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup is optional since we want to keep Calendly loaded
    };
  }, []);

  const handleClick = () => {
    // Track the Calendly open event
    trackCalendlyOpen("contact_section");

    if (!isLoaded) {
      setIsLoading(true);
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.Calendly) {
          clearInterval(checkInterval);
          setIsLoading(false);
          window.Calendly.initPopupWidget({ url });
        }
      }, 100);
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        setIsLoading(false);
      }, 5000);
      return;
    }

    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url });
    }
  };

  const baseStyles =
    "group flex items-center gap-4 p-6 rounded-2xl transition-all cursor-pointer";
  const variantStyles = {
    primary:
      "bg-accent/10 border border-accent/20 hover:bg-accent/20 hover:border-accent/30",
    secondary:
      "bg-card border border-border hover:border-accent/30",
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(baseStyles, variantStyles[variant], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
          variant === "primary"
            ? "bg-accent"
            : "bg-accent/10 group-hover:bg-accent/20"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Calendar
            className={cn(
              "w-6 h-6",
              variant === "primary" ? "text-white" : "text-accent"
            )}
          />
        )}
      </div>
      <div className="text-left">
        {children || (
          <>
            <div className="font-bold text-lg">Umów 20 min</div>
            <div className="text-sm text-foreground-secondary">
              Bezpłatna konsultacja online
            </div>
          </>
        )}
      </div>
    </motion.button>
  );
}
