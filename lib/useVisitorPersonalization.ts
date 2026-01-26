"use client";

import { useState, useEffect, useCallback } from "react";

// Types for visitor data
export interface VisitorData {
  // Identity
  visitorId: string;
  firstVisit: string;
  lastVisit: string;
  visitCount: number;

  // Quiz results
  quizCompleted: boolean;
  quizScore: number | null;
  quizLevel: "excellent" | "good" | "warning" | "critical" | null;
  quizDate: string | null;

  // Calculator results
  calculatorUsed: boolean;
  calculatorData: {
    employees: number;
    potentialSavings: number;
  } | null;
  calculatorDate: string | null;

  // Engagement
  selectedPath: string | null; // From contact form step 1
  sectionsVisited: string[];
  timeOnSite: number; // in seconds
  scrollDepth: number; // 0-100

  // Preferences
  preferredContactMethod: string | null;
  discountCodeRevealed: boolean;
}

const STORAGE_KEY = "catman_visitor_data";

const defaultVisitorData: VisitorData = {
  visitorId: "",
  firstVisit: "",
  lastVisit: "",
  visitCount: 0,
  quizCompleted: false,
  quizScore: null,
  quizLevel: null,
  quizDate: null,
  calculatorUsed: false,
  calculatorData: null,
  calculatorDate: null,
  selectedPath: null,
  sectionsVisited: [],
  timeOnSite: 0,
  scrollDepth: 0,
  preferredContactMethod: null,
  discountCodeRevealed: false,
};

// Generate unique visitor ID
function generateVisitorId(): string {
  return `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function useVisitorPersonalization() {
  const [visitorData, setVisitorData] = useState<VisitorData>(defaultVisitorData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);

  // Load visitor data from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const now = new Date().toISOString();

      if (stored) {
        const parsed: VisitorData = JSON.parse(stored);

        // Check if returning visitor (visited more than 30 minutes ago)
        const lastVisitDate = new Date(parsed.lastVisit);
        const timeSinceLastVisit = Date.now() - lastVisitDate.getTime();
        const isReturning = timeSinceLastVisit > 30 * 60 * 1000; // 30 minutes

        setIsReturningVisitor(isReturning);

        // Update visit data
        setVisitorData({
          ...parsed,
          lastVisit: now,
          visitCount: parsed.visitCount + (isReturning ? 1 : 0),
        });
      } else {
        // New visitor
        const newData: VisitorData = {
          ...defaultVisitorData,
          visitorId: generateVisitorId(),
          firstVisit: now,
          lastVisit: now,
          visitCount: 1,
        };
        setVisitorData(newData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      }

      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading visitor data:", error);
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visitorData));
    } catch (error) {
      console.error("Error saving visitor data:", error);
    }
  }, [visitorData, isLoaded]);

  // Track section visit
  const trackSectionVisit = useCallback((sectionId: string) => {
    setVisitorData((prev) => {
      if (prev.sectionsVisited.includes(sectionId)) return prev;
      return {
        ...prev,
        sectionsVisited: [...prev.sectionsVisited, sectionId],
      };
    });
  }, []);

  // Save quiz results
  const saveQuizResults = useCallback(
    (score: number, level: VisitorData["quizLevel"]) => {
      setVisitorData((prev) => ({
        ...prev,
        quizCompleted: true,
        quizScore: score,
        quizLevel: level,
        quizDate: new Date().toISOString(),
      }));
    },
    []
  );

  // Save calculator results
  const saveCalculatorResults = useCallback(
    (employees: number, potentialSavings: number) => {
      setVisitorData((prev) => ({
        ...prev,
        calculatorUsed: true,
        calculatorData: { employees, potentialSavings },
        calculatorDate: new Date().toISOString(),
      }));
    },
    []
  );

  // Save selected path from contact form
  const saveSelectedPath = useCallback((path: string) => {
    setVisitorData((prev) => ({
      ...prev,
      selectedPath: path,
    }));
  }, []);

  // Save preferred contact method
  const saveContactMethod = useCallback((method: string) => {
    setVisitorData((prev) => ({
      ...prev,
      preferredContactMethod: method,
    }));
  }, []);

  // Mark discount code as revealed
  const markDiscountRevealed = useCallback(() => {
    setVisitorData((prev) => ({
      ...prev,
      discountCodeRevealed: true,
    }));
  }, []);

  // Update scroll depth
  const updateScrollDepth = useCallback((depth: number) => {
    setVisitorData((prev) => ({
      ...prev,
      scrollDepth: Math.max(prev.scrollDepth, Math.min(100, depth)),
    }));
  }, []);

  // Get personalized greeting
  const getPersonalizedGreeting = useCallback((): string => {
    if (!isReturningVisitor) return "";

    if (visitorData.quizCompleted && visitorData.quizLevel) {
      const levelMessages: Record<string, string> = {
        excellent: "Twoja organizacja jest gotowa na rozwój!",
        good: "Masz solidne fundamenty do transformacji.",
        warning: "Widzimy potencjał do poprawy w Twojej organizacji.",
        critical: "Rozumiemy wyzwania przed którymi stoisz.",
      };
      return levelMessages[visitorData.quizLevel] || "";
    }

    if (visitorData.calculatorUsed && visitorData.calculatorData) {
      const savings = visitorData.calculatorData.potentialSavings;
      if (savings > 500000) {
        return `Pamiętamy - potencjalne oszczędności to ${savings.toLocaleString("pl-PL")} PLN rocznie.`;
      }
    }

    if (visitorData.selectedPath) {
      const pathMessages: Record<string, string> = {
        diagnoza: "Wracasz do tematu diagnozy organizacyjnej?",
        rozwoj: "Nadal myślisz o rozwoju liderów?",
        wdrozenie: "Gotowy na wsparcie we wdrożeniu?",
        rozmowa: "Cieszmy się, że wracasz!",
      };
      return pathMessages[visitorData.selectedPath] || "";
    }

    return `Witaj ponownie! To Twoja ${visitorData.visitCount}. wizyta.`;
  }, [isReturningVisitor, visitorData]);

  // Get recommended next action
  const getRecommendedAction = useCallback((): {
    action: string;
    href: string;
    reason: string;
  } | null => {
    if (!visitorData.quizCompleted) {
      return {
        action: "Zrób diagnozę",
        href: "#diagnoza",
        reason: "Sprawdź gotowość swojej organizacji",
      };
    }

    if (!visitorData.calculatorUsed) {
      return {
        action: "Oblicz potencjalne oszczędności",
        href: "#kalkulator",
        reason: "Zobacz ile kosztuje brak zmiany",
      };
    }

    if (!visitorData.selectedPath) {
      return {
        action: "Porozmawiajmy",
        href: "#kontakt",
        reason: "Omówmy Twoje wyzwania",
      };
    }

    return {
      action: "Umów rozmowę",
      href: "#kontakt",
      reason: "Następny krok to 20-minutowa konsultacja",
    };
  }, [visitorData]);

  // Get engagement score (0-100)
  const getEngagementScore = useCallback((): number => {
    let score = 0;

    // Visit count (max 20 points)
    score += Math.min(20, visitorData.visitCount * 5);

    // Quiz completion (25 points)
    if (visitorData.quizCompleted) score += 25;

    // Calculator usage (20 points)
    if (visitorData.calculatorUsed) score += 20;

    // Sections visited (max 20 points)
    score += Math.min(20, visitorData.sectionsVisited.length * 4);

    // Scroll depth (max 10 points)
    score += Math.floor(visitorData.scrollDepth / 10);

    // Contact path selected (5 points)
    if (visitorData.selectedPath) score += 5;

    return Math.min(100, score);
  }, [visitorData]);

  return {
    visitorData,
    isLoaded,
    isReturningVisitor,
    trackSectionVisit,
    saveQuizResults,
    saveCalculatorResults,
    saveSelectedPath,
    saveContactMethod,
    markDiscountRevealed,
    updateScrollDepth,
    getPersonalizedGreeting,
    getRecommendedAction,
    getEngagementScore,
  };
}
