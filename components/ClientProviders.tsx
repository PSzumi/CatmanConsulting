"use client";

import { ReactNode } from "react";
import { LeadScoringProvider } from "@/lib/useLeadScoring";

export function ClientProviders({ children }: { children: ReactNode }) {
  return <LeadScoringProvider>{children}</LeadScoringProvider>;
}
