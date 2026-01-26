"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, TrendingUp, Users, Clock, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfiniteMarquee } from "@/components/ui/InfiniteMarquee";

const caseStudies = [
  {
    id: 1,
    company: "Firma produkcyjna",
    industry: "Produkcja",
    challenge: "Konflikty między działami, niska efektywność zespołów",
    result: "40% wzrost efektywności współpracy międzydziałowej",
    metrics: [
      { icon: TrendingUp, value: "+40%", label: "Efektywność" },
      { icon: Users, value: "120", label: "Pracowników" },
      { icon: Clock, value: "6 mies.", label: "Czas projektu" },
    ],
    tags: ["Kultura organizacyjna", "Zespoły"],
  },
  {
    id: 2,
    company: "Sieć retail",
    industry: "Handel",
    challenge: "Wysoka rotacja managerów, brak spójnego przywództwa",
    result: "Redukcja rotacji o 60%, wzrost zaangażowania zespołów",
    metrics: [
      { icon: TrendingUp, value: "-60%", label: "Rotacja" },
      { icon: Users, value: "45", label: "Liderów" },
      { icon: Clock, value: "12 mies.", label: "Program" },
    ],
    tags: ["Przywództwo", "Rozwój liderów"],
  },
  {
    id: 3,
    company: "Firma technologiczna",
    industry: "IT",
    challenge: "Problemy komunikacyjne w zespołach zdalnych",
    result: "Wdrożenie kultury transparentności, 35% wzrost produktywności",
    metrics: [
      { icon: TrendingUp, value: "+35%", label: "Produktywność" },
      { icon: Users, value: "80", label: "Osób" },
      { icon: Clock, value: "4 mies.", label: "Wdrożenie" },
    ],
    tags: ["Komunikacja", "Praca zdalna"],
  },
];

const testimonials = [
  {
    quote: "Tomek i Mariusz pomogli nam zbudować kulturę, w której ludzie naprawdę ze sobą rozmawiają. Efekty widać w wynikach.",
    author: "Anna K.",
    role: "CEO",
    company: "Firma produkcyjna",
  },
  {
    quote: "Konkretne narzędzia, które działają. Żadnego lania wody – same konkrety.",
    author: "Marek W.",
    role: "HR Director",
    company: "Sieć retail",
  },
];

export function Casebook() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      id="casebook"
      className="relative py-32 bg-background-secondary overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-foreground-secondary mb-6">
              Casebook
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Rezultaty mówią{" "}
              <span className="gradient-text">same za siebie</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-foreground-secondary">
              Konkretne liczby i efekty z naszych projektów.
              Każdy case to historia transformacji.
            </p>
          </motion.div>

          {/* Case studies grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-20">
            {caseStudies.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.id}
                variants={itemVariants}
                className="group"
              >
                <div className="relative h-full p-6 rounded-3xl bg-card border border-border hover:border-accent/30 transition-all duration-500 spotlight-card">
                  {/* Industry badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-4 h-4 text-accent" />
                    <span className="text-sm text-foreground-muted">
                      {caseStudy.industry}
                    </span>
                  </div>

                  {/* Company */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {caseStudy.company}
                  </h3>

                  {/* Challenge */}
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-wider text-foreground-muted">
                      Wyzwanie
                    </span>
                    <p className="text-sm text-foreground-secondary mt-1">
                      {caseStudy.challenge}
                    </p>
                  </div>

                  {/* Result highlight */}
                  <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
                    <span className="text-xs uppercase tracking-wider text-accent">
                      Rezultat
                    </span>
                    <p className="text-sm font-medium mt-1">
                      {caseStudy.result}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {caseStudy.metrics.map((metric) => (
                      <div key={metric.label} className="text-center p-2">
                        <div className="text-lg font-bold gradient-text">
                          {metric.value}
                        </div>
                        <div className="text-xs text-foreground-muted">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs bg-background-tertiary text-foreground-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonials */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-center mb-10">
              Co mówią klienci
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  className="relative p-8 rounded-3xl glass"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.15 }}
                >
                  {/* Quote mark */}
                  <div className="absolute top-4 left-6 text-6xl text-accent/20 font-serif">
                    "
                  </div>

                  <blockquote className="relative">
                    <p className="text-lg text-foreground mb-6 leading-relaxed">
                      {testimonial.quote}
                    </p>
                    <footer className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-accent font-bold">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-foreground-muted">
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </footer>
                  </blockquote>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Client logos with infinite marquee */}
          <motion.div
            variants={itemVariants}
            className="mt-20"
          >
            <p className="text-sm text-foreground-muted mb-8 text-center">
              Zaufali nam między innymi
            </p>
            <InfiniteMarquee speed={25} pauseOnHover>
              {[
                "Firma Produkcyjna",
                "Sieć Retail",
                "Tech Company",
                "Grupa Finansowa",
                "Media House",
                "Logistyka Plus",
              ].map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-center px-8 py-4 rounded-xl bg-card/50 border border-border/50 hover:border-accent/30 transition-colors min-w-[180px]"
                >
                  <span className="text-sm font-medium text-foreground-secondary whitespace-nowrap">
                    {name}
                  </span>
                </div>
              ))}
            </InfiniteMarquee>
            {/* Second row - opposite direction */}
            <div className="mt-4">
              <InfiniteMarquee speed={30} pauseOnHover direction="right">
                {[
                  "Global Corp",
                  "Pharma Solutions",
                  "E-commerce Giant",
                  "Banking Group",
                  "Manufacturing Co",
                  "Service Provider",
                ].map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-center px-8 py-4 rounded-xl bg-card/50 border border-border/50 hover:border-accent/30 transition-colors min-w-[180px]"
                  >
                    <span className="text-sm font-medium text-foreground-secondary whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                ))}
              </InfiniteMarquee>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
