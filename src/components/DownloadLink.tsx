"use client";

import {
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  androidIntentUrl,
  androidMarketUrl,
  facebookSafariUrl,
  getRawStoreUrl,
  instagramExternalBrowserUrl,
  isAndroid,
  isFacebookInApp,
  isInAppBrowser,
  isInstagramInApp,
  isIOS,
  type StorePlatform,
} from "@/lib/app-download";

type DownloadLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> & {
  store: StorePlatform;
  href?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const FALLBACK_DELAY_MS = 1_500;

export function DownloadLink({
  store,
  href,
  children,
  onClick,
  ...anchorProps
}: DownloadLinkProps) {
  const destination = href ?? getRawStoreUrl(store);
  const rawStoreUrl = getRawStoreUrl(store);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);

  const clearPendingFallback = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  const armFallback = useCallback(() => {
    clearPendingFallback();
    setFallbackOpen(false);
    setCopied(false);

    const handlePageExit = () => {
      if (
        document.visibilityState === "hidden" ||
        !document.hasFocus()
      ) {
        clearPendingFallback();
      }
    };

    const timer = window.setTimeout(() => {
      cleanupRef.current = null;
      window.removeEventListener("pagehide", handlePageExit);
      window.removeEventListener("blur", handlePageExit);
      document.removeEventListener("visibilitychange", handlePageExit);
      setFallbackOpen(true);
    }, FALLBACK_DELAY_MS);

    window.addEventListener("pagehide", handlePageExit, { once: true });
    window.addEventListener("blur", handlePageExit, { once: true });
    document.addEventListener("visibilitychange", handlePageExit);

    cleanupRef.current = () => {
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", handlePageExit);
      window.removeEventListener("blur", handlePageExit);
      document.removeEventListener("visibilitychange", handlePageExit);
    };
  }, [clearPendingFallback]);

  const attemptHandoff = useCallback(() => {
    armFallback();

    if (isAndroid()) {
      window.location.href =
        store === "android"
          ? androidMarketUrl()
          : androidIntentUrl(rawStoreUrl);
      return;
    }

    if (isIOS() && isInstagramInApp()) {
      window.location.href = instagramExternalBrowserUrl(rawStoreUrl);
      return;
    }

    if (isIOS() && isFacebookInApp()) {
      window.open(facebookSafariUrl(rawStoreUrl), "_blank");
      return;
    }

    window.location.href = destination;
  }, [armFallback, destination, rawStoreUrl, store]);

  useEffect(() => clearPendingFallback, [clearPendingFallback]);

  useEffect(() => {
    if (!fallbackOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    retryButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFallbackOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [fallbackOpen]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !isInAppBrowser()
    ) {
      return;
    }

    event.preventDefault();
    attemptHandoff();
  }

  async function copyStoreLink() {
    try {
      await navigator.clipboard.writeText(rawStoreUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const fallback = fallbackOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0E171D]/70 p-4 backdrop-blur-sm sm:items-center"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setFallbackOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-fallback-title"
            className="w-full max-w-md rounded-[28px] border border-white/60 bg-[#F7FAFC] p-5 shadow-[0_28px_90px_-35px_rgba(5,18,27,0.72)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#5C8DB8]">
                  TrackSpeed
                </p>
                <h2
                  id="download-fallback-title"
                  className="mt-2 text-2xl font-black tracking-[-0.025em] text-[#0E171D]"
                >
                  Open the store manually
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFallbackOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DCE5EE] bg-white text-[#26303E] transition-transform active:scale-[0.98]"
                aria-label="Close download help"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <p className="mt-4 text-[15px] leading-6 text-[#5B6470]">
              This in-app browser did not switch away. Tap the menu in the
              top-right, choose <strong className="text-[#26303E]">Open in browser</strong>,
              then tap Download TrackSpeed again.
            </p>

            <div className="mt-6 grid gap-3">
              <button
                ref={retryButtonRef}
                type="button"
                onClick={attemptHandoff}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#0E171D] px-5 text-sm font-bold text-white transition-transform active:scale-[0.98]"
              >
                Try opening the store again
              </button>
              <button
                type="button"
                onClick={copyStoreLink}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#DCE5EE] bg-white px-5 text-sm font-bold text-[#26303E] transition-transform active:scale-[0.98]"
              >
                {copied ? "Store link copied" : "Copy store link"}
              </button>
            </div>
          </section>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <a href={destination} onClick={handleClick} {...anchorProps}>
        {children}
      </a>
      {fallback}
    </>
  );
}
