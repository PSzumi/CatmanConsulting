"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/ui/TiltCard";

const services = [
  {
    icon: Target,
    title: "Diagnoza kultury organizacyjnej",
    description: "Identyfikujemy bariery i potencjał w Twojej organizacji. Jasny obraz sytuacji to fundament zmiany.",
    features: [
      "Wywiady z kluczowymi osobami",
      "Analiza procesów decyzyjnych",
      "Mapa kompetencji zespołu",
    ],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Users,
    title: "Rozwój liderów i zespołów",
    description: "Budujemy kompetencje społeczne, które przekładają się na realne wyniki biznesowe.",
    features: [
      "Warsztaty dla menedżerów",
      "Coaching indywidualny",
      "Team building strategiczny",
    ],
    color: "from-accent/20 to-pink-500/20",
  },
  {
    icon: Lightbulb,
    title: "Wdrożenie kultury odpowiedzialności",
    description: "Transparentność i jasne umowy zamiast kontroli. Ludzie biorą odpowiedzialność, gdy rozumieją dlaczego.",
    features: [
      "System kontraktowania celów",
      "Feedback 360°",
      "Follow-up i ewaluacja",
    ],
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: TrendingUp,
    title: "Wsparcie w zmianie",
    description: "Towarzyszymy w procesie transformacji. Nie zostawiamy Was z teorią — wdrażamy w praktyce.",
    features: [
      "On-the-job coaching",
      "Wsparcie w trudnych rozmowach",
      "Monitoring postępów",
    ],
    color: "from-emerald-500/20 to-green-500/20",
  },
];

export function Services() {
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
      id="oferta"
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-foreground-secondary mb-6">
              W czym pomagamy
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Od diagnozy do{" "}
              <span className="gradient-text">rezultatów</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-foreground-secondary">
              Świadomość → Motywacja → Zmiana.
              Nasz model działa, bo łączy wiedzę z praktyką.
            </p>
          </motion.div>

          {/* Services grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <motion.div key={service.title} variants={itemVariants}>
                <TiltCard
                  className="group h-full bg-card border border-border rounded-3xl"
                  tiltStrength={8}
                  glareEnabled={true}
                >
                  <div className="relative p-8 h-full">
                    {/* Gradient background */}
                    <div
                      className={cn(
                        "absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                        `bg-gradient-to-br ${service.color}`
                      )}
                    />

                    {/* Content */}
                    <div className="relative">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                        <service.icon className="w-7 h-7 text-accent" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-foreground-secondary mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground-secondary">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Link */}
                      <motion.a
                        href="#kontakt"
                        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-light transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        Dowiedz się więcej
                        <ArrowRight className="w-4 h-4" />
                      </motion.a>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Method steps */}
          <motion.div variants={itemVariants} className="mt-20">
            <div className="relative p-8 md:p-12 rounded-3xl bg-card border border-border overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/5 via-transparent to-transparent" />

              <div className="relative">
                <h3 className="text-2xl font-bold mb-8 text-center">
                  Nasz model pracy
                </h3>

                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      step: "01",
                      title: "Świadomość",
                      desc: "Diagnoza sytuacji i identyfikacja kluczowych wyzwań",
                    },
                    {
                      step: "02",
                      title: "Motywacja",
                      desc: "Ustalenie celów, miar sukcesu i kontraktów",
                    },
                    {
                      step: "03",
                      title: "Zmiana",
                      desc: "Wdrożenie on-the-job z follow-up i wsparciem",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.step}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.8 + index * 0.15 }}
                    >
                      <div className="text-5xl font-bold gradient-text mb-4">
                        {item.step}
                      </div>
                      <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-foreground-muted">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
