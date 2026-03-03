"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";

type Locale = "pl" | "en";

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "pl", label: "Polski", flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
];

const COOKIE_NAME = "NEXT_LOCALE";
const DEFAULT_LOCALE: Locale = "pl";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}

function setCookie(name: string, value: string, days: number = 365): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function LanguageSwitcher() {
  const [language, setLanguageState] = useState<Locale>(DEFAULT_LOCALE);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = getCookie(COOKIE_NAME) as Locale | undefined;
    if (savedLocale && (savedLocale === "pl" || savedLocale === "en")) {
      setLanguageState(savedLocale);
    }
  }, []);

  const currentLang = languages.find((l) => l.code === language);

  const handleLanguageChange = (newLocale: Locale) => {
    setCookie(COOKIE_NAME, newLocale);
    setLanguageState(newLocale);
    setIsOpen(false);
    // Reload the page to apply the new locale
    window.location.reload();
  };

  if (!mounted) {
    return (
      <div className="w-[100px] h-[40px] rounded-lg bg-white/5 animate-pulse" />
    );
  }

  return (
    <div className="relative">
      <motion.button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base" role="img" aria-label={currentLang?.label}>
          {currentLang?.flag}
        </span>
        <span className="text-sm font-medium text-white/80 hidden sm:block">
          {currentLang?.code.toUpperCase()}
        </span>
        <Globe className="w-4 h-4 text-white/50" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              className="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-xl overflow-hidden"
              style={{
                background: "rgba(20, 20, 25, 0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              role="listbox"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    language === lang.code
                      ? "bg-[#8b1a1a]/20 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                  whileHover={{ x: 4 }}
                  role="option"
                  aria-selected={language === lang.code}
                >
                  <span className="text-lg" role="img" aria-label={lang.label}>
                    {lang.flag}
                  </span>
                  <span className="text-sm font-medium flex-1">{lang.label}</span>
                  {language === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 text-[#8b1a1a]" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
