"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

// Placeholder client logos - replace with real ones
const clients = [
  { name: "Enterprise Corp", industry: "Produkcja" },
  { name: "TechVentures", industry: "IT" },
  { name: "Retail Group", industry: "Handel" },
  { name: "Finance Partners", industry: "Finanse" },
  { name: "Healthcare Plus", industry: "Medycyna" },
];

// Testimonials
const testimonials = [
  {
    quote:
      "Tomek i Mariusz pomogli nam zbudować kulturę, w której ludzie naprawdę ze sobą rozmawiają. Efekty widać w wynikach — wzrost efektywności o 40% w ciągu pół roku.",
    author: "Anna Kowalska",
    role: "CEO",
    company: "Firma produkcyjna, 120 osób",
  },
  {
    quote:
      "Konkretne narzędzia, które działają. Żadnego lania wody — same konkrety. Rotacja kadry zarządzającej spadła o 60%.",
    author: "Marek Wiśniewski",
    role: "HR Director",
    company: "Sieć retail, 45 lokalizacji",
  },
  {
    quote:
      "Myślałem, że znam swój zespół. Diagnoza pokazała rzeczy, których nie widziałem przez lata. To był punkt zwrotny.",
    author: "Piotr Nowak",
    role: "Managing Director",
    company: "Firma technologiczna, 80 osób",
  },
];

function ClientLogo({ client, index, isInView }: {
  client: typeof clients[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Placeholder logo - replace with actual client logos */}
      <div className="group px-8 py-6 rounded-xl border border-transparent hover:border-border hover:bg-card/50 transition-all duration-300">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground-muted group-hover:text-foreground transition-colors">
            {client.name}
          </div>
          <div className="text-xs text-foreground-muted/60 mt-1">
            {client.industry}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCard({
  testimonial,
  isActive,
}: {
  testimonial: typeof testimonials[0];
  isActive: boolean;
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      style={{ display: isActive ? "block" : "none" }}
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Large quote mark */}
        <div className="absolute -top-6 -left-4 md:-left-8">
          <Quote
            className="w-16 h-16 md:w-24 md:h-24 text-[#b8860b]/10"
            strokeWidth={1}
          />
        </div>

        {/* Quote */}
        <blockquote className="relative">
          <p className="text-xl md:text-2xl lg:text-3xl font-light text-foreground leading-relaxed md:leading-relaxed lg:leading-relaxed">
            "{testimonial.quote}"
          </p>
        </blockquote>

        {/* Author */}
        <div className="mt-10 flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#b8860b]/20 to-[#2d5a7b]/20 flex items-center justify-center">
            <span className="text-lg font-semibold text-[#b8860b]">
              {testimonial.author.charAt(0)}
            </span>
          </div>

          <div>
            <div className="font-semibold text-foreground">
              {testimonial.author}
            </div>
            <div className="text-sm text-foreground-secondary">
              {testimonial.role}, {testimonial.company}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TrustedBy() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      ref={containerRef}
      id="zaufali"
      className="relative py-32 bg-background-secondary overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2d5a7b]/5 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#b8860b]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground-secondary mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Zaufali nam
          </motion.span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Liderzy, którzy{" "}
            <span className="text-[#b8860b]">działają</span>
          </h2>

          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            Pracujemy z organizacjami, które traktują rozwój poważnie.
            Oto co mówią o współpracy z nami.
          </p>
        </motion.div>

        {/* Client logos */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-24"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {clients.map((client, index) => (
            <ClientLogo
              key={client.name}
              client={client}
              index={index}
              isInView={isInView}
            />
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          className="w-24 h-px bg-border mx-auto mb-24"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        />

        {/* Testimonials */}
        <div className="relative">
          {/* Testimonial cards */}
          <div className="min-h-[300px] flex items-center">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                isActive={activeTestimonial === index}
              />
            ))}
          </div>

          {/* Navigation */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full border border-border hover:border-[#b8860b]/50 hover:bg-[#b8860b]/5 transition-all"
              aria-label="Poprzednia opinia"
            >
              <ChevronLeft className="w-5 h-5 text-foreground-secondary" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeTestimonial === index
                      ? "w-8 bg-[#b8860b]"
                      : "bg-border hover:bg-foreground-muted"
                  }`}
                  aria-label={`Opinia ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full border border-border hover:border-[#b8860b]/50 hover:bg-[#b8860b]/5 transition-all"
              aria-label="Następna opinia"
            >
              <ChevronRight className="w-5 h-5 text-foreground-secondary" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
