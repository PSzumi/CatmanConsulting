"use client";

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Menu, X, Sun, Moon, Command, Search } from "lucide-react";
import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/constants";

// Navigation items
const navigation = [
  { name: "O nas", href: "#o-nas", sectionId: "o-nas" },
  { name: "Usługi", href: "#oferta", sectionId: "oferta" },
  { name: "Proces", href: "#proces", sectionId: "proces" },
  { name: "Case'y", href: "#casebook", sectionId: "casebook" },
  { name: "Kontakt", href: "#kontakt", sectionId: "kontakt" },
];

// Command palette items
const commandItems = [
  { name: "Przejdź do: O nas", href: "#o-nas", keywords: ["about", "o nas", "kim"] },
  { name: "Przejdź do: Usługi", href: "#oferta", keywords: ["usługi", "oferta", "services"] },
  { name: "Przejdź do: Proces", href: "#proces", keywords: ["proces", "jak", "how"] },
  { name: "Przejdź do: Case Studies", href: "#casebook", keywords: ["case", "projekty", "portfolio"] },
  { name: "Przejdź do: Kontakt", href: "#kontakt", keywords: ["kontakt", "contact", "email"] },
  { name: "Umów rozmowę", href: "#kontakt", keywords: ["rozmowa", "call", "book", "umów"] },
  { name: "Kalkulator ROI", href: "#kalkulator", keywords: ["roi", "kalkulator", "calculator"] },
];

// Magnetic link component
const MagneticNavLink = forwardRef<
  HTMLAnchorElement,
  {
    children: React.ReactNode;
    href: string;
    isActive: boolean;
    onClick?: () => void;
  }
>(function MagneticNavLink({ children, href, isActive, onClick }, forwardedRef) {
  const internalRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = internalRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Magnetic pull - stronger when closer
    x.set(distanceX * 0.3);
    y.set(distanceY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Combine refs
  const setRefs = (el: HTMLAnchorElement | null) => {
    (internalRef as React.MutableRefObject<HTMLAnchorElement | null>).current = el;
    if (typeof forwardedRef === "function") {
      forwardedRef(el);
    } else if (forwardedRef) {
      forwardedRef.current = el;
    }
  };

  return (
    <motion.a
      ref={setRefs}
      href={href}
      onClick={onClick}
      className={`relative px-4 py-2 text-sm font-medium transition-colors ${
        isActive ? "text-foreground" : "text-foreground-secondary hover:text-foreground"
      }`}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,26,26,0.15) 0%, transparent 70%)",
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.a>
  );
});

// Animated section indicator pill
function SectionIndicator({
  activeIndex,
  navRefs,
}: {
  activeIndex: number;
  navRefs: React.RefObject<(HTMLAnchorElement | null)[]>;
}) {
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (activeIndex === -1 || !navRefs.current) return;

    const activeLink = navRefs.current[activeIndex];
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setPillStyle({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    }
  }, [activeIndex, navRefs]);

  if (activeIndex === -1) return null;

  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full bg-accent/10 border border-accent/20"
      initial={false}
      animate={{
        left: pillStyle.left,
        width: pillStyle.width,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    />
  );
}

// Command Palette
function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = commandItems.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.keywords.some((k) => k.includes(searchLower))
    );
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleSelect = (href: string) => {
    onClose();
    setSearch("");
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-[15%] sm:top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[calc(100%-2rem)] sm:max-w-md md:max-w-lg z-[101]"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="mx-4 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Szukaj lub wpisz komendę..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-base"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-white/40 text-xs">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-y-auto py-2">
                {filteredItems.length === 0 ? (
                  <div className="px-4 py-8 text-center text-white/40">
                    Brak wyników
                  </div>
                ) : (
                  filteredItems.map((item, index) => (
                    <motion.button
                      key={item.href + index}
                      onClick={() => handleSelect(item.href)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Command className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-white/80">{item.name}</span>
                    </motion.button>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/30">
                <span>Nawiguj strzałkami</span>
                <span>Enter aby wybrać</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(-1);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Background blur and border on scroll
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map((n) => document.getElementById(n.sectionId));
      const scrollPos = window.scrollY + 200;

      let currentIndex = -1;
      sections.forEach((section, index) => {
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentIndex = index;
          }
        }
      });
      setActiveSection(currentIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const setNavRef = useCallback((el: HTMLAnchorElement | null, index: number) => {
    navRefs.current[index] = el;
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {/* Background with blur */}
        <motion.div
          className="absolute inset-0 backdrop-blur-xl bg-background/80 border-b border-border"
          style={{ opacity: backgroundOpacity }}
        />

        <nav className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with hover animation */}
            <motion.a
              href="#"
              className="relative z-10 text-xl font-bold tracking-tight group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-foreground group-hover:text-accent transition-colors duration-300">
                {siteConfig.name.split(" ")[0]}
              </span>
              <span className="text-accent ml-1">
                {siteConfig.name.split(" ")[1]}
              </span>

              {/* Animated dot */}
              <motion.span
                className="absolute -right-2 -top-1 w-1.5 h-1.5 rounded-full bg-accent"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.a>

            {/* Desktop Navigation with section indicator */}
            <div className="hidden md:flex items-center relative">
              <SectionIndicator activeIndex={activeSection} navRefs={navRefs} />

              {navigation.map((item, index) => (
                <MagneticNavLink
                  key={item.name}
                  href={item.href}
                  isActive={activeSection === index}
                  ref={(el) => setNavRef(el, index)}
                >
                  {item.name}
                </MagneticNavLink>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Command Palette Trigger */}
              {mounted && (
                <motion.button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-foreground-secondary hover:text-foreground hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Szukaj</span>
                  <kbd className="ml-2 px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">
                    ⌘K
                  </kbd>
                </motion.button>
              )}

              {/* Theme toggle */}
              {mounted && (
                <motion.button
                  onClick={toggleTheme}
                  className="relative z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-card-hover transition-colors"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    {theme === "dark" ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}

              {/* CTA Button - Desktop */}
              <motion.a
                href="#kontakt"
                className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium overflow-hidden relative group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Kontakt</span>

                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </motion.a>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-10 md:hidden p-2 rounded-full hover:bg-card-hover transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu content */}
            <motion.nav
              className="relative h-full flex flex-col items-center justify-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              {navigation.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`text-3xl font-bold transition-colors ${
                    activeSection === index ? "text-accent" : "text-foreground hover:text-accent"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}

              <motion.a
                href="#kontakt"
                className="mt-4 px-8 py-4 rounded-full bg-accent text-white text-lg font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setIsOpen(false)}
              >
                Umów rozmowę
              </motion.a>

              {/* Mobile command hint */}
              <motion.p
                className="absolute bottom-8 text-sm text-foreground-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Naciśnij <kbd className="px-2 py-1 rounded bg-white/10 mx-1">⌘K</kbd> aby szukać
              </motion.p>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
