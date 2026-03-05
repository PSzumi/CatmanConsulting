import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Offerings } from "@/components/sections/Offerings";
import { Casebook } from "@/components/sections/Casebook";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Manifest } from "@/components/sections/Manifest";
import { Credentials } from "@/components/sections/Credentials";
import { Process } from "@/components/sections/Process";
import { AsSeenIn } from "@/components/sections/AsSeenIn";
import { AvailabilityBanner } from "@/components/sections/AvailabilityBanner";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { ForWhom } from "@/components/sections/ForWhom";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="py-12 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 rounded-2xl border border-accent/15 bg-accent/5">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent mb-1">
              Diagnoza wstępna
            </p>
            <p className="text-foreground font-medium">
              Sprawdź gotowość organizacji i policz ukryte koszty.
            </p>
          </div>
          <Link
            href="/diagnoza"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/40 text-accent text-sm font-medium hover:bg-accent hover:text-white transition-all shrink-0"
          >
            Przejdź do diagnozy
            <ArrowRight className="w-4 h-4" />
          </Link>
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
        <AsSeenIn />
        <ForWhom />
        <About />
        <Services />
        <Process />
        <DiagnozaTeaser />
        <Offerings />
        <Casebook />
        <TrustedBy />
        <Credentials />
        <Manifest />
        <FAQ />
        <AvailabilityBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
