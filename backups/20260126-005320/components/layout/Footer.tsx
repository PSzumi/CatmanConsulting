"use client";

import { motion } from "framer-motion";
import { Heart, ArrowUp } from "lucide-react";
import { siteConfig, navigation } from "@/lib/constants";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-16 bg-background-secondary border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="inline-block text-2xl font-bold mb-4">
              <span className="text-foreground">Catman</span>
              <span className="text-accent ml-1">Consulting</span>
            </a>
            <p className="text-foreground-secondary max-w-sm mb-6">
              {siteConfig.description}
            </p>
            <p className="text-sm text-foreground-muted">
              "{siteConfig.tagline}"
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Nawigacja</h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-foreground-secondary hover:text-accent transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Informacje</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/polityka-prywatnosci"
                  className="text-foreground-secondary hover:text-accent transition-colors"
                >
                  Polityka prywatności
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground-secondary hover:text-accent transition-colors"
                >
                  Regulamin
                </a>
              </li>
              <li>
                <a
                  href="#kontakt"
                  className="text-foreground-secondary hover:text-accent transition-colors"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm text-foreground-muted">
              © {new Date().getFullYear()} {siteConfig.name}. Wszelkie prawa zastrzeżone.
            </p>
            <span
              className="text-xs text-foreground-muted/50 hover:text-accent cursor-default transition-colors"
              title="Kliknij 3× w logo..."
            >
              Psst... 3× logo
            </span>
          </div>

          {/* Back to top button */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card hover:bg-card-hover border border-border transition-colors text-sm"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-4 h-4" />
            Na górę
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
