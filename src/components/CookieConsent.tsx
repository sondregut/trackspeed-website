"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const CONSENT_KEY = "cookie-consent";
const CONSENT_CHANGE_EVENT = "cookie-consent-change";
type ConsentStatus = "accepted" | "declined" | null;

function getConsentSnapshot(): ConsentStatus {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

function getServerConsentSnapshot(): ConsentStatus {
  return null;
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

function notifyConsentChanged() {
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

async function initPostHog() {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY
  ) {
    const posthog = (await import("posthog-js")).default;
    if (!posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false,
        loaded: (ph) => {
          ph.opt_in_capturing();
        },
      });
    }
  }
}

async function capturePageview() {
  if (typeof window === "undefined" || localStorage.getItem(CONSENT_KEY) !== "accepted") {
    return;
  }

  const posthog = (await import("posthog-js")).default;
  if (!posthog.__loaded) {
    await initPostHog();
  }
  posthog.capture("$pageview", {
    $current_url: window.location.href,
    path: window.location.pathname,
  });
}

export default function CookieConsent() {
  const pathname = usePathname();
  const consentStatus = useSyncExternalStore(
    subscribeToConsentChanges,
    getConsentSnapshot,
    getServerConsentSnapshot
  );
  const visible = consentStatus === null;

  useEffect(() => {
    if (consentStatus === "accepted") {
      initPostHog();
    }
  }, [consentStatus]);

  useEffect(() => {
    if (consentStatus === "accepted") {
      capturePageview();
    }
  }, [consentStatus, pathname]);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    notifyConsentChanged();
    initPostHog();
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
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
