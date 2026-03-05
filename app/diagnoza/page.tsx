import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AssessmentQuiz } from "@/components/sections/AssessmentQuiz";
import { ROICalculator } from "@/components/sections/ROICalculator";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DiagnozaPage() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <NoiseOverlay />
      <Navbar />
      <main className="relative pt-24">
        {/* Back link */}
        <div className="max-w-4xl mx-auto px-6 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć na stronę główną
          </Link>
        </div>

        {/* Page intro */}
        <div className="max-w-4xl mx-auto px-6 pb-16 text-center">
          <span className="inline-block text-sm font-medium uppercase tracking-[0.2em] text-accent mb-4">
            Diagnoza wstępna
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sprawdź gotowość swojej organizacji
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            Dwa bezpłatne narzędzia, które pomogą Ci zobaczyć gdzie jesteś i ile kosztuje Cię brak zmiany.
          </p>
        </div>

        <AssessmentQuiz />
        <ROICalculator />
      </main>
      <Footer />
    </>
  );
}
