import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Offerings } from "@/components/sections/Offerings";
import { Casebook } from "@/components/sections/Casebook";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Manifest } from "@/components/sections/Manifest";
import { Contact } from "@/components/sections/Contact";
import { ROICalculator } from "@/components/sections/ROICalculator";
import { AssessmentQuiz } from "@/components/sections/AssessmentQuiz";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Preloader } from "@/components/ui/Preloader";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { EasterEgg } from "@/components/ui/EasterEgg";

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <CursorGlow />
      <StickyCTA />
      <NoiseOverlay />
      <EasterEgg />
      <Navbar />
      <main className="relative" style={{ overflow: "visible" }}>
        <Hero />
        <About />
        <Services />
        <AssessmentQuiz />
        <Offerings />
        <Casebook />
        <ROICalculator />
        <TrustedBy />
        <Manifest />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
