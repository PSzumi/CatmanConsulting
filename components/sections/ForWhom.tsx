"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

const situationsPl = [
  "Konflikty między działami blokują decyzje i wdrożenia",
  "Liderzy są przeciążeni i tracą kierunek strategiczny",
  "Spadek odpowiedzialności mimo dobrych intencji",
  "Zmiany nie wchodzą — mimo szkoleń i komunikacji",
  "Chaos po fuzji, restrukturyzacji lub rotacji zarządu",
  "Nowy zarząd buduje kulturę od zera",
];

const situationsEn = [
  "Cross-department conflicts are blocking decisions and execution",
  "Leaders are overwhelmed and losing strategic direction",
  "Declining accountability despite good intentions",
  "Changes don't stick — despite training and communication",
  "Chaos after a merger, restructuring, or executive turnover",
  "New leadership is building culture from scratch",
];

export function ForWhom() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const locale = useLocale();
  const situations = locale === "pl" ? situationsPl : situationsEn;
  const heading =
    locale === "pl"
      ? "Pracujemy z zarządami, właścicielami i HR,"
      : "We work with boards, owners and HR,";
  const subheading =
    locale === "pl" ? "gdy:" : "when:";

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-20 bg-background-secondary border-y border-border/50"
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="grid md:grid-cols-2 gap-10 md:gap-16 items-start"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Left — heading */}
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent mb-4">
              {locale === "pl" ? "Dla kogo" : "Who we serve"}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
              {heading}{" "}
              <span className="text-foreground-muted font-normal">{subheading}</span>
            </h2>

            <a
              href="#kontakt"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-sm font-medium hover:shadow-lg hover:shadow-accent/25 transition-all hover:scale-[1.02]"
            >
              {locale === "pl" ? "Porozmawiajmy" : "Let's talk"}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right — situation list */}
          <ul className="space-y-3">
            {situations.map((item, i) => (
              <motion.li
                key={item}
                className="flex items-start gap-3 text-foreground-secondary"
                initial={{ opacity: 0, x: 16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-base leading-relaxed">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
