"use client";

import { useState, useEffect } from "react";
import posthog from "posthog-js";

const CONSENT_KEY = "cookie-consent";

function initPostHog() {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    !posthog.__loaded
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      loaded: (ph) => {
        ph.opt_in_capturing();
      },
    });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") {
      initPostHog();
    } else if (consent === null) {
      setVisible(true);
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
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          We use cookies to analyze site usage and improve your experience.{" "}
          <a
            href="/privacy"
            className="underline transition-opacity hover:opacity-70"
            style={{ color: "var(--text-primary)" }}
          >
            Privacy Policy
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm rounded-lg transition-opacity hover:opacity-70"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border-light)" }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: "#5C8DB8" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
