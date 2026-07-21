"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const CONSENT_KEY = "cookie-consent";
const CONSENT_CHANGE_EVENT = "cookie-consent-change";
const DISTINCT_ID_KEY = "trackspeed-posthog-distinct-id";
type ConsentStatus = "accepted" | "declined" | null;

function getConsentSnapshot(): ConsentStatus {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

function subscribeToConsentChanges(callback: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === CONSENT_KEY) callback();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
  };
}

function getDistinctId() {
  const existing = localStorage.getItem(DISTINCT_ID_KEY);
  if (existing) return existing;

  const nextId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `web_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  localStorage.setItem(DISTINCT_ID_KEY, nextId);
  return nextId;
}

function notifyConsentChanged() {
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

async function trackPostHog(event: "$pageview" | "cookie_consent_accepted", properties: Record<string, unknown>) {
  if (typeof window === "undefined" || localStorage.getItem(CONSENT_KEY) !== "accepted") {
    return;
  }

  try {
    await fetch("/api/analytics/posthog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event,
        distinctId: getDistinctId(),
        properties,
      }),
    });
  } catch {
    // Analytics must never block page interaction.
  }
}

async function capturePageview() {
  if (typeof window === "undefined" || localStorage.getItem(CONSENT_KEY) !== "accepted") {
    return;
  }

  await trackPostHog("$pageview", {
    $current_url: window.location.href,
    path: window.location.pathname,
  });
}

export default function CookieConsent() {
  const pathname = usePathname();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);
  const visible = consentStatus === null;

  useEffect(() => {
    const syncConsent = () => {
      setConsentStatus(getConsentSnapshot());
    };

    syncConsent();
    return subscribeToConsentChanges(syncConsent);
  }, []);

  useEffect(() => {
    if (consentStatus === "accepted") {
      capturePageview();
    }
  }, [consentStatus, pathname]);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsentStatus("accepted");
    notifyConsentChanged();
    trackPostHog("cookie_consent_accepted", { source: "cookie_banner" });
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setConsentStatus("declined");
    notifyConsentChanged();
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
      style={{ background: "rgba(255, 255, 255, 0.97)", borderTop: "1px solid var(--border-light)" }}
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <p className="min-w-0 text-center text-sm leading-5 sm:text-left" style={{ color: "var(--text-secondary)" }}>
          We use cookies to analyze site usage and improve your experience.{" "}
          <Link
            href="/privacy"
            className="underline transition-opacity hover:opacity-70"
            style={{ color: "var(--text-primary)" }}
          >
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 items-center justify-center gap-3">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm rounded-lg transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-[#5C8DB8]"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border-light)" }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-lg text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#5C8DB8]"
            style={{ background: "#5C8DB8" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
