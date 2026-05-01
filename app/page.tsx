import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Offerings } from "@/components/sections/Offerings";
import { Casebook } from "@/components/sections/Casebook";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Manifest } from "@/components/sections/Manifest";

import { Process } from "@/components/sections/Process";

import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { ForWhom } from "@/components/sections/ForWhom";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Sparkles } from "lucide-react";
import { Preloader } from "@/components/ui/Preloader";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { EasterEgg } from "@/components/ui/EasterEgg";
import { ReturningVisitorBanner } from "@/components/ui/ReturningVisitorBanner";
import { LeadScoreIndicator } from "@/components/ui/LeadScoreIndicator";
import { AIConcierge } from "@/components/ui/AIConcierge";

function DiagnozaTeaser() {
  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px] opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(184,134,11,0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <div
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(184,134,11,0.18) 0%, rgba(26,26,26,0.95) 60%, rgba(212,168,67,0.12) 100%)",
            border: "1.5px solid rgba(184,134,11,0.45)",
            boxShadow: "0 25px 80px -20px rgba(184,134,11,0.4)",
          }}
        >
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, #b8860b 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Top corner accent */}
          <div
            className="absolute top-0 right-0 w-48 h-48 opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, #b8860b 0%, transparent 60%)",
            }}
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/15 border border-accent/40 text-sm font-semibold uppercase tracking-widest text-accent mb-6">
              <Sparkles className="w-4 h-4" />
              Diagnoza wstępna
            </span>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight">
              Sprawdź <span className="text-accent">gotowość</span> swojej organizacji
            </h2>

            <p className="text-lg md:text-xl text-foreground-secondary max-w-2xl mx-auto mb-10">
              Bezpłatne narzędzie. 6 pytań. 2 minuty. Konkretny obraz tego, gdzie jesteś
              i co warto zmienić.
            </p>

            <Link
              href="/diagnoza"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-accent text-white font-semibold text-lg transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-accent/40"
            >
              <ClipboardCheck className="w-5 h-5" />
              Przejdź do diagnozy
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="mt-6 text-sm text-foreground-muted">
              Bez rejestracji. Bez zobowiązań. Wyniki natychmiast.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <CursorGlow />
      <StickyCTA />
      <NoiseOverlay />
      <EasterEgg />
      <ReturningVisitorBanner />
      <LeadScoreIndicator />
      <AIConcierge />
      <Navbar />
      <main className="relative" style={{ overflow: "visible" }}>
        <Hero />

        <ForWhom />
        <About />
        <Services />
        <Process />
        <DiagnozaTeaser />
        <Offerings />
        <Casebook />
        <TrustedBy />

        <Manifest />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
