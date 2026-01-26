"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { contactContent } from "@/lib/constants";
import { CalendlyButton } from "@/components/ui/CalendlyButton";
import { trackFormSubmission } from "@/components/Analytics";

export function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    consent: false,
    website: "", // Honeypot field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        trackFormSubmission("contact_form", false);
        throw new Error(data.error || "Wystąpił błąd podczas wysyłania");
      }

      trackFormSubmission("contact_form", true);
      setIsSubmitted(true);
    } catch (err) {
      trackFormSubmission("contact_form", false);
      setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

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
      id="kontakt"
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium text-foreground-secondary mb-6">
              Kontakt
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {contactContent.title}
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-foreground-secondary">
              {contactContent.subtitle}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-8"
            >
              {/* Quick contact cards */}
              <div className="space-y-4">
                <a
                  href={`mailto:${contactContent.email}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground-muted">Email</div>
                    <div className="font-medium">{contactContent.email}</div>
                  </div>
                </a>

                <a
                  href={`tel:${contactContent.phone.replace(/\s/g, "")}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground-muted">Telefon</div>
                    <div className="font-medium">{contactContent.phone}</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground-muted">Lokalizacja</div>
                    <div className="font-medium">Warszawa, Polska</div>
                  </div>
                </div>
              </div>

              {/* Calendly CTA */}
              <CalendlyButton url={contactContent.calendlyUrl} />
            </motion.div>

            {/* Contact form */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div className="relative p-8 rounded-3xl bg-card border border-border">
                {/* Success state */}
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Wiadomość wysłana!
                    </h3>
                    <p className="text-foreground-secondary">
                      Odezwiemy się w ciągu 24 godzin.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          Imię i nazwisko *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                          placeholder="Jan Kowalski"
                          data-lpignore="true"
                          autoComplete="name"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                          placeholder="jan@firma.pl"
                          data-lpignore="true"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium mb-2"
                        >
                          Telefon
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                          placeholder="+48 XXX XXX XXX"
                          data-lpignore="true"
                          autoComplete="tel"
                        />
                      </div>

                      {/* Company */}
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium mb-2"
                        >
                          Firma
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                          placeholder="Nazwa firmy"
                          data-lpignore="true"
                          autoComplete="organization"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                      >
                        Wiadomość *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none"
                        placeholder="W czym możemy pomóc?"
                      />
                    </div>

                    {/* RODO Consent */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        required
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-border text-accent focus:ring-accent"
                      />
                      <label
                        htmlFor="consent"
                        className="text-sm text-foreground-secondary"
                      >
                        Wyrażam zgodę na przetwarzanie moich danych osobowych w celu
                        obsługi zapytania. *{" "}
                        <a href="#" className="text-accent hover:underline">
                          Polityka prywatności
                        </a>
                      </label>
                    </div>

                    {/* Honeypot field - hidden from users, visible to bots */}
                    <div className="absolute -left-[9999px]" aria-hidden="true">
                      <label htmlFor="website">
                        Zostaw to pole puste
                        <input
                          type="text"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </label>
                    </div>

                    {/* Error message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium text-lg transition-all",
                        "bg-accent text-white hover:bg-accent-light",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Wysyłanie...
                        </>
                      ) : (
                        <>
                          Wyślij wiadomość
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
