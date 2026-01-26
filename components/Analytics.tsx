"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
function usePageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);
}

function PageTracker() {
  usePageTracking();
  return null;
}

export function Analytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      {/* Page view tracker */}
      <Suspense fallback={null}>
        <PageTracker />
      </Suspense>
    </>
  );
}

// ============================================
// Event Tracking Helper Functions
// ============================================

/**
 * Track custom events in Google Analytics
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || typeof window.gtag !== "function") {
    // Log to console in development
    console.log("[GA Event]", eventName, parameters);
    return;
  }

  window.gtag("event", eventName, parameters);
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(ctaName: string, location: string) {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_location: location,
  });
}

/**
 * Track form submissions
 */
export function trackFormSubmission(formName: string, success: boolean) {
  trackEvent("form_submission", {
    form_name: formName,
    form_success: success,
  });
}

/**
 * Track Calendly interactions
 */
export function trackCalendlyOpen(location: string) {
  trackEvent("calendly_open", {
    calendly_location: location,
  });
}

/**
 * Track scroll depth milestones
 */
export function trackScrollDepth(percentage: number) {
  trackEvent("scroll_depth", {
    depth_percentage: percentage,
  });
}

/**
 * Track outbound link clicks
 */
export function trackOutboundLink(url: string, linkText: string) {
  trackEvent("outbound_link", {
    link_url: url,
    link_text: linkText,
  });
}

/**
 * Track section views (when user scrolls to a section)
 */
export function trackSectionView(sectionName: string) {
  trackEvent("section_view", {
    section_name: sectionName,
  });
}
