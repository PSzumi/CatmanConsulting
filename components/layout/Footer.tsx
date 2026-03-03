"use client";

import { useState, useRef, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowUp,
  Mail,
  Linkedin,
  Twitter,
  Send,
  CheckCircle,
  Shield,
  Award,
  Users,
  Clock,
  Globe,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/constants";

// Footer navigation structure - keys for translation
const footerNavigationKeys = {
  uslugi: {
    titleKey: "servicesLinks.title",
    links: [
      { nameKey: "servicesLinks.transformation", href: "#oferta" },
      { nameKey: "servicesLinks.coaching", href: "#oferta" },
      { nameKey: "servicesLinks.teams", href: "#oferta" },
      { nameKey: "servicesLinks.training", href: "#oferta" },
    ],
  },
  firma: {
    titleKey: "navigation.title",
    links: [
      { nameKey: "navigation.about", href: "#o-nas" },
      { nameKey: "navigation.process", href: "#oferta" },
      { nameKey: "navigation.services", href: "#uslugi" },
      { nameKey: "navigation.contact", href: "#kontakt" },
    ],
  },
  zasoby: {
    titleKey: "legalLinks.title",
    links: [
      { nameKey: "legalLinks.privacy", href: "/polityka-prywatnosci" },
      { nameKey: "legalLinks.terms", href: "/regulamin" },
      { nameKey: "legalLinks.cookies", href: "/cookies" },
    ],
  },
};

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "Email", icon: Mail, href: "mailto:kontakt@catman.consulting" },
];

const trustBadgesConfig = [
  {
    icon: Award,
    labelKey: "trustBadges.icf.label",
    sublabelKey: "trustBadges.icf.sublabel",
    labelFallback: "ICF Certified",
    sublabelFallback: "International Coach Federation",
  },
  {
    icon: Users,
    labelKey: "trustBadges.recommend.label",
    sublabelKey: "trustBadges.recommend.sublabel",
    labelFallback: "95% poleca",
    sublabelFallback: "Klienci nas rekomenduja",
  },
  {
    icon: Clock,
    labelKey: "trustBadges.experience.label",
    sublabelKey: "trustBadges.experience.sublabel",
    labelFallback: "35+ lat",
    sublabelFallback: "Doswiadczenia w branzy",
  },
  {
    icon: Shield,
    labelKey: "trustBadges.gdpr.label",
    sublabelKey: "trustBadges.gdpr.sublabel",
    labelFallback: "GDPR Compliant",
    sublabelFallback: "Bezpieczenstwo danych",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const linkHoverVariants = {
  rest: { x: 0 },
  hover: { x: 6 },
};

export function Footer() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a0a0f 0%, #111118 100%)",
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 26, 26, 0.5) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8b1a1a]/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Main footer content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pt-20 pb-16"
        >
          {/* Column 1: Brand & Social */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <a href="#" className="inline-block mb-6 group">
              <span className="text-2xl font-bold text-white group-hover:text-[#8b1a1a] transition-colors duration-300">
                Catman
              </span>
              <span className="text-2xl font-bold text-[#8b1a1a] ml-1">
                Consulting
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {t("description")}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-[#8b1a1a] hover:border-[#8b1a1a]/50 hover:bg-[#8b1a1a]/10 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Uslugi */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              {t(footerNavigationKeys.uslugi.titleKey)}
            </h4>
            <ul className="space-y-3">
              {footerNavigationKeys.uslugi.links.map((link) => (
                <li key={link.nameKey}>
                  <motion.a
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-[#8b1a1a] transition-colors duration-300 text-sm"
                    initial="rest"
                    whileHover="hover"
                  >
                    <motion.span
                      variants={linkHoverVariants}
                      transition={{ duration: 0.2 }}
                    >
                      {t(link.nameKey)}
                    </motion.span>
                    <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Firma */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              {t(footerNavigationKeys.firma.titleKey)}
            </h4>
            <ul className="space-y-3">
              {footerNavigationKeys.firma.links.map((link) => (
                <li key={link.nameKey}>
                  <motion.a
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-[#8b1a1a] transition-colors duration-300 text-sm"
                    initial="rest"
                    whileHover="hover"
                  >
                    <motion.span
                      variants={linkHoverVariants}
                      transition={{ duration: 0.2 }}
                    >
                      {t(link.nameKey)}
                    </motion.span>
                    <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Zasoby */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              {t(footerNavigationKeys.zasoby.titleKey)}
            </h4>
            <ul className="space-y-3">
              {footerNavigationKeys.zasoby.links.map((link) => (
                <li key={link.nameKey}>
                  <motion.a
                    href={link.href}
                    className="group flex items-center text-gray-400 hover:text-[#8b1a1a] transition-colors duration-300 text-sm"
                    initial="rest"
                    whileHover="hover"
                  >
                    <motion.span
                      variants={linkHoverVariants}
                      transition={{ duration: 0.2 }}
                    >
                      {t(link.nameKey)}
                    </motion.span>
                    <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 5: Newsletter */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              {t("newsletter.title")}
            </h4>

            {!isSubscribed ? (
              <>
                <p className="text-gray-400 text-sm mb-4">
                  {t("newsletter.description")}
                </p>

                <form onSubmit={handleNewsletterSubmit} className="relative">
                  <div
                    className={`relative rounded-xl overflow-hidden transition-all duration-500 ${
                      isFocused
                        ? "shadow-[0_0_20px_rgba(139,26,26,0.3)]"
                        : ""
                    }`}
                  >
                    {/* Animated border */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        backgroundImage: isFocused
                          ? "linear-gradient(90deg, #8b1a1a, #b32424, #8b1a1a)"
                          : "none",
                        backgroundColor: isFocused ? "transparent" : "transparent",
                        backgroundSize: "200% 100%",
                        padding: "1px",
                      }}
                      animate={
                        isFocused
                          ? { backgroundPosition: ["0% 0%", "100% 0%"] }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <div className="w-full h-full bg-[#0a0a0f] rounded-xl" />
                    </motion.div>

                    <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={t("newsletter.placeholder")}
                        className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                        required
                      />
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-3 bg-[#8b1a1a] text-white hover:bg-[#b32424] transition-colors duration-300 disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isSubmitting ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </form>

                {/* Social proof */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8b1a1a] to-[#b32424] border-2 border-[#0a0a0f] flex items-center justify-center"
                      >
                        <span className="text-[8px] text-white font-bold">
                          {i}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {t("newsletter.socialProof", { fallback: "Dolacz do 500+ liderow" })}
                  </span>
                </div>

                {/* Privacy note */}
                <p className="text-[10px] text-gray-600 mt-3 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {t("newsletter.privacy", { fallback: "Szanujemy Twoja prywatnosc. Mozesz zrezygnowac w kazdej chwili." })}
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl bg-[#8b1a1a]/10 border border-[#8b1a1a]/30 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-12 h-12 text-[#8b1a1a] mx-auto mb-3" />
                </motion.div>
                <p className="text-white font-medium mb-1">{t("newsletter.success")}</p>
                <p className="text-gray-400 text-sm">
                  {t("newsletter.checkEmail", { fallback: "Sprawdz swoja skrzynke email." })}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Trust badges row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="py-10 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadgesConfig.map((badge, index) => (
              <motion.div
                key={badge.labelKey}
                variants={itemVariants}
                custom={index}
                className="group"
              >
                <motion.div
                  className="relative p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#8b1a1a]/30 hover:bg-[#8b1a1a]/5 transition-all duration-500 cursor-default"
                  whileHover={{ y: -4 }}
                >
                  {/* Glassmorphism effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#8b1a1a]/10 flex items-center justify-center flex-shrink-0">
                      <badge.icon className="w-5 h-5 text-[#8b1a1a]" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {badge.labelFallback}
                      </p>
                      <p className="text-gray-500 text-xs">{badge.sublabelFallback}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col md:flex-row items-center justify-between py-8 border-t border-white/10 gap-6"
        >
          {/* Copyright & Legal */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {siteConfig.name}. {t("copyright")}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/polityka-prywatnosci"
                className="text-xs text-gray-500 hover:text-[#8b1a1a] transition-colors duration-300"
              >
                {t("links.privacy")}
              </a>
              <span className="text-gray-700">|</span>
              <a
                href="/regulamin"
                className="text-xs text-gray-500 hover:text-[#8b1a1a] transition-colors duration-300"
              >
                {t("links.terms")}
              </a>
            </div>
          </div>

          {/* Language & Back to top */}
          <div className="flex items-center gap-4">
            {/* Language switcher placeholder */}
            <motion.button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe className="w-4 h-4" />
              <span>PL</span>
              <ChevronRight className="w-3 h-3 rotate-90" />
            </motion.button>

            {/* Back to top */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8b1a1a]/10 border border-[#8b1a1a]/30 text-[#8b1a1a] hover:bg-[#8b1a1a] hover:text-white transition-all duration-300 text-sm font-medium"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp className="w-4 h-4" />
              {t("backToTop", { fallback: "Na gore" })}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8b1a1a]/30 to-transparent" />
    </footer>
  );
}
