"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const CONSENT_KEY = "cookie-consent";

async function initPostHog() {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY
  ) {
    const posthog = (await import("posthog-js")).default;
    if (!posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        loaded: (ph) => {
          ph.opt_in_capturing();
        },
      });
    }
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(CONSENT_KEY) === null
  );

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") {
      initPostHog();
    }
    // If "declined", do nothing
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    initPostHog();
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
      style={{ background: "rgba(255, 255, 255, 0.97)", borderTop: "1px solid var(--border-light)" }}
      aria-live="polite"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          We use cookies to analyze site usage and improve your experience.{" "}
          <Link
            href="/privacy"
            className="underline transition-opacity hover:opacity-70"
            style={{ color: "var(--text-primary)" }}
          >
            Privacy Policy
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
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
