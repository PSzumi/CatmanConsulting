"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import {
  Plus,
  Search,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Wallet,
  Users,
  Target,
  type LucideIcon,
} from "lucide-react";
import {
  useFaqItems,
  useFaqCategories,
  FAQ_ICONS,
  FAQ_ICON_FALLBACK,
  type FaqItem,
} from "@/lib/faq";

// Ikony filtrow kategorii - warstwa prezentacji, zostaje w komponencie sekcji.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  all: Sparkles,
  start: Clock,
  cost: Wallet,
  work: Users,
  results: Target,
};

// Single FAQ Item Component
function FAQItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const Icon = FAQ_ICONS[item.icon] ?? FAQ_ICON_FALLBACK;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative group"
    >
      {/* Active glow effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute -inset-2 rounded-3xl opacity-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(184, 134, 11, 0.15) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Main card */}
      <motion.div
        className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
          isOpen
            ? "bg-white/[0.04]"
            : "bg-white/[0.02] hover:bg-white/[0.03]"
        }`}
        onClick={onToggle}
        whileHover={{ scale: isOpen ? 1 : 1.01 }}
        transition={{ duration: 0.2 }}
        style={{
          border: isOpen
            ? "1px solid rgba(184, 134, 11, 0.3)"
            : "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Gradient border effect for active state */}
        {isOpen && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                "linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, transparent 50%, rgba(184, 134, 11, 0.05) 100%)",
            }}
          />
        )}

        {/* Question header */}
        <div className="relative p-5 md:p-6 flex items-start gap-4">
          {/* Icon */}
          <motion.div
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? "bg-[#b8860b]/20"
                : "bg-white/[0.03] group-hover:bg-white/[0.05]"
            }`}
            animate={{ scale: isOpen ? 1.05 : 1 }}
          >
            <Icon
              className={`w-5 h-5 transition-colors duration-300 ${
                isOpen ? "text-[#b8860b]" : "text-white/40 group-hover:text-white/60"
              }`}
            />
          </motion.div>

          {/* Question text */}
          <div className="flex-1 min-w-0 pt-1.5">
            <h3
              className={`text-base md:text-lg font-medium leading-tight transition-colors duration-300 ${
                isOpen ? "text-white" : "text-white/80 group-hover:text-white"
              }`}
            >
              {item.question}
            </h3>
          </div>

          {/* Toggle icon */}
          <motion.div
            className={`shrink-0 w-10 h-10 md:w-8 md:h-8 rounded-full flex items-center justify-center mt-1 transition-all duration-300 ${
              isOpen
                ? "bg-[#b8860b]/20"
                : "bg-white/[0.03] group-hover:bg-white/[0.05]"
            }`}
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <Plus
              className={`w-4 h-4 transition-colors duration-300 ${
                isOpen ? "text-[#b8860b]" : "text-white/40 group-hover:text-white/60"
              }`}
            />
          </motion.div>
        </div>

        {/* Answer section with AnimatePresence for smooth height transition */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] },
                opacity: { duration: 0.3, delay: 0.1 },
              }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-6 pb-6 pt-0">
                {/* Separator line */}
                <motion.div
                  className="h-px w-full mb-5"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(184, 134, 11, 0.3) 0%, rgba(184, 134, 11, 0.1) 50%, transparent 100%)",
                    transformOrigin: "left",
                  }}
                />

                {/* Answer text */}
                <motion.p
                  className="text-white/60 leading-relaxed text-sm md:text-base pl-14"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  {item.answer}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// Search Input Component
function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <motion.div
      className="relative max-w-md mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-white/30" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-[#b8860b]/40 focus:bg-white/[0.05] transition-all duration-300"
      />
    </motion.div>
  );
}

// Category Filter Component
function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: { id: string; label: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.id] ?? Sparkles;
        const isActive = activeCategory === category.id;

        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? "bg-[#b8860b] text-white"
                : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70 border border-white/[0.05]"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-4 h-4" />
            <span>{category.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// CTA Section
function ContactCTA({ t }: { t: (key: string) => string }) {
  return (
    <motion.div
      className="mt-20 text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative inline-block p-8 md:p-12 rounded-3xl overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(184, 134, 11, 0.12) 0%, rgba(184, 134, 11, 0.03) 50%, rgba(184, 134, 11, 0.08) 100%)",
          }}
        />

        {/* Border */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            border: "1px solid rgba(184, 134, 11, 0.2)",
          }}
        />

        {/* Glow effect */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(184, 134, 11, 0.4) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative">
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <MessageCircle className="w-5 h-5 text-[#b8860b]" />
            <span className="text-sm font-medium text-[#b8860b] uppercase tracking-widest">
              {t("contact")}
            </span>
          </motion.div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("contact")}
          </h3>

          <p className="text-white/50 max-w-md mx-auto mb-8 leading-relaxed">
            {t("description")}
          </p>

          <motion.a
            href="#kontakt"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#b8860b] text-white font-semibold hover:bg-[#d4a94d] transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{t("contactCta")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

// Main FAQ Component
export function FAQ() {
  const t = useTranslations("faq");
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const items = useFaqItems();
  const categories = useFaqCategories();

  const [openItem, setOpenItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter FAQ items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, activeCategory]);

  // Split items into two columns for desktop
  const leftColumn = filteredItems.filter((_, i) => i % 2 === 0);
  const rightColumn = filteredItems.filter((_, i) => i % 2 === 1);

  const handleToggle = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section
      ref={containerRef}
      id="faq"
      className="relative py-20 sm:py-28 md:py-32 lg:py-40 bg-[#0a0a0f] overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="hidden md:block absolute top-1/4 -left-1/4 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#b8860b]/5 rounded-full blur-[200px]" />
        <div className="hidden md:block absolute bottom-1/4 -right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#b8860b]/3 rounded-full blur-[150px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, #0a0a0f 70%)",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            className="inline-flex items-center gap-3 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
            <span className="px-5 py-2.5 rounded-full border border-[#b8860b]/30 bg-[#b8860b]/5 text-sm font-medium text-[#b8860b] uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              FAQ
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-[#b8860b] via-[#d4a94d] to-[#b8860b] bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Search input */}
        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder={t("searchPlaceholder")} />

        {/* Category filters */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* FAQ items grid */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-5">
          {/* Left column */}
          <div className="space-y-4 md:space-y-5">
            {leftColumn.map((item, index) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openItem === item.id}
                onToggle={() => handleToggle(item.id)}
                index={index}
              />
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-4 md:space-y-5">
            {rightColumn.map((item, index) => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openItem === item.id}
                onToggle={() => handleToggle(item.id)}
                index={index + leftColumn.length}
              />
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white/60 mb-2">
              {t("noResults")}
            </h3>
            <p className="text-white/40">
              {t("noResultsHint")}{" "}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="text-[#b8860b] hover:underline"
              >
                {t("clearFilters")}
              </button>
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        <ContactCTA t={t} />
      </div>
    </section>
  );
}
