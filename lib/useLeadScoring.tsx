"use client";

import { useState, useEffect, useCallback, useRef, createContext, useContext, ReactNode } from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface LeadScore {
  visitorId: string;
  sessionId: string;
  pageViews: number;
  uniquePages: string[];
  totalTimeOnSite: number;
  lastActivity: string;
  quizStarted: boolean;
  quizCompleted: boolean;
  quizScore: number | null;
  calculatorUsed: boolean;
  calculatorSavings: number | null;
  contactFormStarted: boolean;
  contactFormStep: number;
  videoRecorded: boolean;
  calendlyClicked: boolean;
  easterEggFound: boolean;
  scrollDepth: number;
  clickCount: number;
  timeOnContactPage: number;
  returnVisit: boolean;
  visitCount: number;
  score: number;
  grade: "hot" | "warm" | "cold" | "new";
  alerts: string[];
}

interface LeadScoringContextType {
  leadData: LeadScore | null;
  isLoaded: boolean;
  trackQuizStart: () => void;
  trackQuizComplete: (score: number) => void;
  trackCalculatorUse: (savings: number) => void;
  trackContactFormProgress: (step: number) => void;
  trackVideoRecorded: () => void;
  trackCalendlyClick: () => void;
  trackEasterEgg: () => void;
  resetData: () => void;
}

// ============================================================================
// CONSTANTS & HELPERS
// ============================================================================

const STORAGE_KEY = "catman_lead_score_v2";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function calculateScore(data: Partial<LeadScore>): { score: number; grade: LeadScore["grade"]; alerts: string[] } {
  let score = 0;
  const alerts: string[] = [];

  // Page engagement (max 15 points) - 3 points per page view
  score += Math.min(15, (data.pageViews || 0) * 3);

  // Time on site (max 15 points) - 1 point per 30 seconds
  const seconds = data.totalTimeOnSite || 0;
  score += Math.min(15, Math.floor(seconds / 30));

  // Scroll depth (max 10 points) - 1 point per 10%
  score += Math.floor((data.scrollDepth || 0) / 10);

  // Quiz engagement (max 20 points)
  if (data.quizStarted) {
    score += 5;
    alerts.push("Rozpoczął quiz");
  }
  if (data.quizCompleted) {
    score += 15;
    alerts.push("Ukończył quiz");
  }

  // Calculator usage (max 15 points)
  if (data.calculatorUsed) {
    score += 10;
    alerts.push("Użył kalkulatora ROI");
    if ((data.calculatorSavings || 0) > 500000) {
      score += 5;
      alerts.push(`Wysoki potencjał: ${(data.calculatorSavings || 0).toLocaleString("pl-PL")} PLN`);
    }
  }

  // Contact form engagement (max 15 points)
  if (data.contactFormStarted) {
    score += 3;
  }
  const step = data.contactFormStep || 0;
  score += Math.min(7, step * 2);
  if (data.videoRecorded) {
    score += 5;
    alerts.push("Nagrał wideo");
  }

  // Calendly click (10 points) - strong intent signal
  if (data.calendlyClicked) {
    score += 10;
    alerts.push("Kliknął Calendly");
  }

  // Return visit bonus (5 points)
  if (data.returnVisit) {
    score += 5;
    alerts.push("Powracający użytkownik");
  }

  // Multiple visits (max 5 points)
  score += Math.min(5, ((data.visitCount || 1) - 1) * 2);

  // Easter egg (bonus 3 points)
  if (data.easterEggFound) {
    score += 3;
    alerts.push("Znalazł Easter Egg!");
  }

  // Cap at 100
  score = Math.min(100, Math.max(0, score));

  // Determine grade
  let grade: LeadScore["grade"] = "new";
  if (score >= 60) {
    grade = "hot";
    alerts.unshift("🔥 Gorący lead!");
  } else if (score >= 35) {
    grade = "warm";
  } else if (score >= 15) {
    grade = "cold";
  }

  return { score, grade, alerts };
}

function createEmptyLeadData(): LeadScore {
  return {
    visitorId: generateId("v"),
    sessionId: generateId("s"),
    pageViews: 1,
    uniquePages: [typeof window !== "undefined" ? window.location.pathname : "/"],
    totalTimeOnSite: 0,
    lastActivity: new Date().toISOString(),
    quizStarted: false,
    quizCompleted: false,
    quizScore: null,
    calculatorUsed: false,
    calculatorSavings: null,
    contactFormStarted: false,
    contactFormStep: 0,
    videoRecorded: false,
    calendlyClicked: false,
    easterEggFound: false,
    scrollDepth: 0,
    clickCount: 0,
    timeOnContactPage: 0,
    returnVisit: false,
    visitCount: 1,
    score: 2, // Starting score for first page view
    grade: "new",
    alerts: [],
  };
}

// ============================================================================
// CONTEXT
// ============================================================================

const LeadScoringContext = createContext<LeadScoringContextType | null>(null);

export function LeadScoringProvider({ children }: { children: ReactNode }) {
  const [leadData, setLeadData] = useState<LeadScore | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const maxScrollDepthRef = useRef(0);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Save to localStorage helper
  const saveData = useCallback((data: LeadScore) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save lead data:", e);
    }
  }, []);

  // Update with recalculation
  const updateData = useCallback((updates: Partial<LeadScore>) => {
    setLeadData((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        ...updates,
        lastActivity: new Date().toISOString()
      };

      const { score, grade, alerts } = calculateScore(updated);
      updated.score = score;
      updated.grade = grade;
      updated.alerts = alerts;

      saveData(updated);

      // Log when becoming hot
      if (grade === "hot" && prev.grade !== "hot") {
        console.log("🔥 HOT LEAD:", {
          id: updated.visitorId,
          score: updated.score,
          alerts: updated.alerts,
        });
      }

      return updated;
    });
  }, [saveData]);

  // Initialize on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const sessionId = generateId("s");

      if (stored) {
        const parsed: LeadScore = JSON.parse(stored);
        const timeSinceLastVisit = Date.now() - new Date(parsed.lastActivity).getTime();
        const isReturnVisit = timeSinceLastVisit > 30 * 60 * 1000; // 30 min

        const updated: LeadScore = {
          ...parsed,
          sessionId,
          pageViews: parsed.pageViews + 1,
          lastActivity: new Date().toISOString(),
          returnVisit: isReturnVisit || parsed.returnVisit,
          visitCount: isReturnVisit ? parsed.visitCount + 1 : parsed.visitCount,
        };

        // Add current page to unique pages
        const currentPage = window.location.pathname;
        if (!updated.uniquePages.includes(currentPage)) {
          updated.uniquePages.push(currentPage);
        }

        const { score, grade, alerts } = calculateScore(updated);
        updated.score = score;
        updated.grade = grade;
        updated.alerts = alerts;

        setLeadData(updated);
        saveData(updated);
        maxScrollDepthRef.current = updated.scrollDepth;
      } else {
        const newData = createEmptyLeadData();
        const { score, grade, alerts } = calculateScore(newData);
        newData.score = score;
        newData.grade = grade;
        newData.alerts = alerts;

        setLeadData(newData);
        saveData(newData);
      }

      setIsLoaded(true);
    } catch (error) {
      console.error("Lead scoring init error:", error);
      const newData = createEmptyLeadData();
      setLeadData(newData);
      setIsLoaded(true);
    }
  }, [saveData]);

  // Track time on site
  useEffect(() => {
    if (!isLoaded || !leadData) return;

    timeIntervalRef.current = setInterval(() => {
      setLeadData((prev) => {
        if (!prev) return prev;

        const updated = {
          ...prev,
          totalTimeOnSite: prev.totalTimeOnSite + 5,
          lastActivity: new Date().toISOString(),
        };

        const { score, grade, alerts } = calculateScore(updated);
        updated.score = score;
        updated.grade = grade;
        updated.alerts = alerts;

        saveData(updated);
        return updated;
      });
    }, 5000); // Every 5 seconds

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [isLoaded, leadData?.visitorId, saveData]);

  // Track scroll depth automatically
  useEffect(() => {
    if (!isLoaded || !leadData) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      if (scrollPercent > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = scrollPercent;

        // Only update state every 10% increment to reduce re-renders
        const roundedPercent = Math.floor(scrollPercent / 10) * 10;

        setLeadData((prev) => {
          if (!prev) return prev;
          const currentRounded = Math.floor(prev.scrollDepth / 10) * 10;

          if (roundedPercent > currentRounded) {
            const updated = { ...prev, scrollDepth: scrollPercent };
            const { score, grade, alerts } = calculateScore(updated);
            updated.score = score;
            updated.grade = grade;
            updated.alerts = alerts;
            saveData(updated);
            return updated;
          }
          return prev;
        });
      }
    };

    // Throttle scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [isLoaded, leadData?.visitorId, saveData]);

  // Track clicks automatically
  useEffect(() => {
    if (!isLoaded || !leadData) return;

    const handleClick = () => {
      setLeadData((prev) => {
        if (!prev) return prev;
        return { ...prev, clickCount: prev.clickCount + 1 };
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isLoaded, leadData?.visitorId]);

  // Tracking functions
  const trackQuizStart = useCallback(() => {
    updateData({ quizStarted: true });
  }, [updateData]);

  const trackQuizComplete = useCallback((score: number) => {
    updateData({ quizCompleted: true, quizScore: score });
  }, [updateData]);

  const trackCalculatorUse = useCallback((savings: number) => {
    updateData({ calculatorUsed: true, calculatorSavings: savings });
  }, [updateData]);

  const trackContactFormProgress = useCallback((step: number) => {
    updateData({ contactFormStarted: true, contactFormStep: step });
  }, [updateData]);

  const trackVideoRecorded = useCallback(() => {
    updateData({ videoRecorded: true });
  }, [updateData]);

  const trackCalendlyClick = useCallback(() => {
    updateData({ calendlyClicked: true });
  }, [updateData]);

  const trackEasterEgg = useCallback(() => {
    updateData({ easterEggFound: true });
  }, [updateData]);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    const newData = createEmptyLeadData();
    const { score, grade, alerts } = calculateScore(newData);
    newData.score = score;
    newData.grade = grade;
    newData.alerts = alerts;
    setLeadData(newData);
    saveData(newData);
    maxScrollDepthRef.current = 0;
  }, [saveData]);

  return (
    <LeadScoringContext.Provider
      value={{
        leadData,
        isLoaded,
        trackQuizStart,
        trackQuizComplete,
        trackCalculatorUse,
        trackContactFormProgress,
        trackVideoRecorded,
        trackCalendlyClick,
        trackEasterEgg,
        resetData,
      }}
    >
      {children}
    </LeadScoringContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useLeadScoring() {
  const context = useContext(LeadScoringContext);

  // Fallback for components that use the hook outside provider
  const [fallbackData, setFallbackData] = useState<LeadScore | null>(null);
  const [fallbackLoaded, setFallbackLoaded] = useState(false);

  useEffect(() => {
    if (context) return;

    // Simple fallback - just read from localStorage
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFallbackData(JSON.parse(stored));
        }
      } catch (e) {
        // Ignore
      }
      setFallbackLoaded(true);
    }
  }, [context]);

  if (context) {
    return context;
  }

  // Return dummy functions for fallback
  return {
    leadData: fallbackData,
    isLoaded: fallbackLoaded,
    trackQuizStart: () => {},
    trackQuizComplete: () => {},
    trackCalculatorUse: () => {},
    trackContactFormProgress: () => {},
    trackVideoRecorded: () => {},
    trackCalendlyClick: () => {},
    trackEasterEgg: () => {},
    resetData: () => {},
  };
}
