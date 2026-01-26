"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Quote, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";

// Client data with placeholder logos
const clients = [
  { name: "Enterprise Corp", industry: "Produkcja" },
  { name: "TechVentures", industry: "IT" },
  { name: "Retail Group", industry: "Handel" },
  { name: "Finance Partners", industry: "Finanse" },
  { name: "Healthcare Plus", industry: "Medycyna" },
  { name: "Global Industries", industry: "Logistyka" },
  { name: "Innovation Labs", industry: "R&D" },
  { name: "Prime Solutions", industry: "Consulting" },
];

// Testimonials
const testimonials = [
  {
    quote:
      "Tomek i Mariusz pomogli nam zbudować kulturę, w której ludzie naprawdę ze sobą rozmawiają. Efekty widać w wynikach — wzrost efektywności o 40% w ciągu pół roku.",
    author: "Anna Kowalska",
    role: "CEO",
    company: "Firma produkcyjna, 120 osób",
    metric: "+40%",
    metricLabel: "efektywność",
  },
  {
    quote:
      "Konkretne narzędzia, które działają. Żadnego lania wody — same konkrety. Rotacja kadry zarządzającej spadła o 60%.",
    author: "Marek Wiśniewski",
    role: "HR Director",
    company: "Sieć retail, 45 lokalizacji",
    metric: "-60%",
    metricLabel: "rotacja",
  },
  {
    quote:
      "Myślałem, że znam swój zespół. Diagnoza pokazała rzeczy, których nie widziałem przez lata. To był punkt zwrotny.",
    author: "Piotr Nowak",
    role: "Managing Director",
    company: "Firma technologiczna, 80 osób",
    metric: "100%",
    metricLabel: "clarity",
  },
];

// Stats data
const stats = [
  { value: 150, suffix: "+", label: "Liderów przeszkolonych", duration: 2 },
  { value: 45, suffix: "+", label: "Organizacji transformowanych", duration: 1.8 },
  { value: 98, suffix: "%", label: "Satysfakcji klientów", duration: 2.2 },
  { value: 12, suffix: "", label: "Lat doświadczenia", duration: 1.5 },
];

// Animated counter hook
function useCounter(end: number, duration: number, startAnimation: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function (easeOutExpo)
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOutExpo * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startAnimation]);

  return count;
}

// Infinite Marquee Component
function InfiniteMarquee({ children, speed = 30, pauseOnHover = true }: {
  children: React.ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
}) {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

      <motion.div
        className={`flex gap-12 ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Client Logo Component
function ClientLogo({ client }: { client: typeof clients[0] }) {
  return (
    <div className="group relative flex-shrink-0 px-10 py-8">
      <div className="relative">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#b8860b]/0 to-[#2d5a7b]/0 group-hover:from-[#b8860b]/10 group-hover:to-[#2d5a7b]/10 rounded-2xl blur-xl transition-all duration-500" />

        <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] group-hover:border-[#b8860b]/30 rounded-2xl px-10 py-6 transition-all duration-500">
          {/* Placeholder for real logo */}
          <div className="text-center min-w-[140px]">
            <div className="text-xl font-semibold text-white/60 group-hover:text-white/90 transition-colors duration-300 tracking-tight">
              {client.name}
            </div>
            <div className="text-xs text-white/30 mt-1.5 uppercase tracking-widest font-medium">
              {client.industry}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Immersive Testimonial Component
function ImmersiveTestimonial({
  testimonial,
  isActive,
}: {
  testimonial: typeof testimonials[0];
  isActive: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={testimonial.author}
          className="absolute inset-0 w-full flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="relative max-w-6xl mx-auto w-full">
            {/* Large decorative quote */}
            <motion.div
              className="absolute -top-20 -left-10 md:-left-20 opacity-[0.03]"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Quote className="w-40 h-40 md:w-64 md:h-64 text-[#b8860b]" strokeWidth={1} />
            </motion.div>

            {/* Metric badge */}
            <motion.div
              className="absolute -top-8 right-0 md:right-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#b8860b]/20 blur-2xl rounded-full" />
                <div className="relative bg-gradient-to-br from-[#b8860b]/20 to-[#b8860b]/5 backdrop-blur-sm border border-[#b8860b]/30 rounded-2xl px-6 py-4">
                  <div className="text-3xl md:text-4xl font-bold text-[#b8860b]">
                    {testimonial.metric}
                  </div>
                  <div className="text-xs text-white/50 uppercase tracking-widest mt-1">
                    {testimonial.metricLabel}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quote text */}
            <blockquote className="relative pt-8">
              <motion.p
                className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-tight md:leading-tight lg:leading-tight tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="text-[#b8860b]">"</span>
                {testimonial.quote}
                <span className="text-[#b8860b]">"</span>
              </motion.p>
            </blockquote>

            {/* Author section */}
            <motion.div
              className="mt-12 md:mt-16 flex items-center gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {/* Avatar with gradient ring */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#b8860b] to-[#2d5a7b] rounded-full blur-md opacity-50" />
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#b8860b]/30 to-[#2d5a7b]/30 p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#0a0a0f] flex items-center justify-center">
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#b8860b] to-[#d4a94d] bg-clip-text text-transparent">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xl md:text-2xl font-semibold text-white">
                  {testimonial.author}
                </div>
                <div className="text-base md:text-lg text-white/50 mt-1">
                  <span className="text-[#b8860b]">{testimonial.role}</span>
                  <span className="mx-2 text-white/20">|</span>
                  {testimonial.company}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Stat Card Component
function StatCard({
  stat,
  index,
  isInView,
}: {
  stat: typeof stats[0];
  index: number;
  isInView: boolean;
}) {
  const count = useCounter(stat.value, stat.duration, isInView);

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#b8860b]/5 to-[#2d5a7b]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] group-hover:border-[#b8860b]/20 rounded-3xl p-8 md:p-10 text-center transition-all duration-500">
        <div className="text-5xl md:text-6xl lg:text-7xl font-bold">
          <span className="bg-gradient-to-br from-[#b8860b] via-[#d4a94d] to-[#b8860b] bg-clip-text text-transparent">
            {count}
          </span>
          <span className="text-[#b8860b]/70">{stat.suffix}</span>
        </div>
        <div className="mt-4 text-sm md:text-base text-white/50 uppercase tracking-widest font-medium">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

export function TrustedBy() {
  const t = useTranslations("trustedBy");
  const containerRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const nextTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Autoplay with pause on hover
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);

    return () => clearInterval(interval);
  }, [isPlaying, isHovered, nextTestimonial]);

  return (
    <section
      ref={containerRef}
      id="zaufali"
      className="relative bg-[#0a0a0f] overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-[#2d5a7b]/10 via-transparent to-transparent opacity-50" />

        {/* Accent glows */}
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#2d5a7b]/5 rounded-full blur-[150px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#b8860b]/5 rounded-full blur-[120px]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Header Section */}
      <div className="relative pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#b8860b]" />
              <span className="px-5 py-2.5 rounded-full border border-[#b8860b]/30 bg-[#b8860b]/5 text-sm font-medium text-[#b8860b] uppercase tracking-widest">
                {t("tagline")}
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#b8860b]" />
            </motion.div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              {t("title")}{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-[#b8860b] via-[#d4a94d] to-[#b8860b] bg-clip-text text-transparent">
                  {t("titleHighlight")}
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#b8860b] to-[#d4a94d] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h2>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Infinite Marquee Section */}
      <motion.div
        className="relative py-12"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
      >
        <InfiniteMarquee speed={40}>
          {clients.map((client, index) => (
            <ClientLogo key={`${client.name}-${index}`} client={client} />
          ))}
        </InfiniteMarquee>
      </motion.div>

      {/* Testimonials Section */}
      <div className="relative py-24 md:py-32">
        {/* Decorative line */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#b8860b]/30 to-transparent"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        />

        <div
          className="max-w-7xl mx-auto px-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Testimonial content */}
          <div className="relative min-h-[400px] md:min-h-[500px]">
            {testimonials.map((testimonial, index) => (
              <ImmersiveTestimonial
                key={testimonial.author}
                testimonial={testimonial}
                isActive={activeTestimonial === index}
              />
            ))}
          </div>

          {/* Navigation */}
          <motion.div
            className="flex items-center justify-center gap-8 mt-16"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            {/* Previous button */}
            <button
              onClick={prevTestimonial}
              className="group relative p-4 rounded-full border border-white/10 hover:border-[#b8860b]/50 transition-all duration-300"
              aria-label="Poprzednia opinia"
            >
              <div className="absolute inset-0 bg-[#b8860b]/0 group-hover:bg-[#b8860b]/10 rounded-full transition-all duration-300" />
              <ChevronLeft className="relative w-6 h-6 text-white/50 group-hover:text-[#b8860b] transition-colors" />
            </button>

            {/* Progress dots */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className="group relative"
                  aria-label={`Opinia ${index + 1}`}
                >
                  <div
                    className={`relative h-3 rounded-full transition-all duration-500 ${
                      activeTestimonial === index
                        ? "w-12 bg-gradient-to-r from-[#b8860b] to-[#d4a94d]"
                        : "w-3 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Play/Pause button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="group relative p-4 rounded-full border border-white/10 hover:border-[#b8860b]/50 transition-all duration-300"
              aria-label={isPlaying ? "Pauza" : "Odtwarzaj"}
            >
              <div className="absolute inset-0 bg-[#b8860b]/0 group-hover:bg-[#b8860b]/10 rounded-full transition-all duration-300" />
              {isPlaying ? (
                <Pause className="relative w-5 h-5 text-white/50 group-hover:text-[#b8860b] transition-colors" />
              ) : (
                <Play className="relative w-5 h-5 text-white/50 group-hover:text-[#b8860b] transition-colors" />
              )}
            </button>

            {/* Next button */}
            <button
              onClick={nextTestimonial}
              className="group relative p-4 rounded-full border border-white/10 hover:border-[#b8860b]/50 transition-all duration-300"
              aria-label="Następna opinia"
            >
              <div className="absolute inset-0 bg-[#b8860b]/0 group-hover:bg-[#b8860b]/10 rounded-full transition-all duration-300" />
              <ChevronRight className="relative w-6 h-6 text-white/50 group-hover:text-[#b8860b] transition-colors" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="relative py-24 md:py-32 border-t border-white/[0.05]">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#b8860b]/[0.02] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Liczby mówią same za siebie
            </h3>
            <p className="text-white/40 text-lg">
              Mierzalne rezultaty naszych współprac
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                stat={stat}
                index={index}
                isInView={statsInView}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="relative h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b8860b]/30 to-transparent" />
      </div>
    </section>
  );
}
