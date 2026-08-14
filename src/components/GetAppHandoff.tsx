"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DownloadLink } from "@/components/DownloadLink";
import {
  getInstallDestination,
  getRawStoreUrl,
  hasAttributionProviderLink,
  instagramExternalBrowserUrl,
  isAndroid,
  isInstagramInApp,
  isMobileBrowser,
  TRACKSPEED_HOMEPAGE_URL,
  type InstallSource,
  type StorePlatform,
} from "@/lib/app-download";

const AUTO_FALLBACK_DELAY_MS = 1_800;

const SOURCE_LABELS: Record<InstallSource, string> = {
  website: "TrackSpeed",
  instagram: "Instagram",
  threads: "Threads",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
};

export default function GetAppHandoff({
  source,
  initialPlatform,
}: {
  source: InstallSource;
  initialPlatform: StorePlatform;
}) {
  const [showFallback, setShowFallback] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!isMobileBrowser()) {
      window.location.replace(TRACKSPEED_HOMEPAGE_URL);
      return;
    }

    const detectedPlatform: StorePlatform = isAndroid() ? "android" : "ios";

    const destination = getInstallDestination(source, detectedPlatform);
    const rawStoreUrl = getRawStoreUrl(detectedPlatform);
    let fallbackTimer = window.setTimeout(
      () => setShowFallback(true),
      AUTO_FALLBACK_DELAY_MS,
    );

    const markHandoffSuccessful = () => {
      if (
        document.visibilityState === "hidden" ||
        !document.hasFocus()
      ) {
        window.clearTimeout(fallbackTimer);
      }
    };

    window.addEventListener("pagehide", markHandoffSuccessful, { once: true });
    window.addEventListener("blur", markHandoffSuccessful, { once: true });
    document.addEventListener("visibilitychange", markHandoffSuccessful);

    if (detectedPlatform === "ios" && isInstagramInApp()) {
      if (hasAttributionProviderLink(source, "ios")) {
        void fetch(destination, { mode: "no-cors", keepalive: true }).catch(
          () => undefined,
        );
      }

      window.location.href = instagramExternalBrowserUrl(rawStoreUrl);
    } else {
      window.location.replace(destination);
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      fallbackTimer = 0;
      window.removeEventListener("pagehide", markHandoffSuccessful);
      window.removeEventListener("blur", markHandoffSuccessful);
      document.removeEventListener("visibilitychange", markHandoffSuccessful);
    };
  }, [source]);

  return (
    <main id="main" className="relative isolate flex min-h-[100dvh] overflow-hidden bg-[#0E171D] px-4 py-5 text-white sm:px-6 sm:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(92,141,184,0.34),transparent_32%),radial-gradient(circle_at_12%_88%,rgba(67,126,102,0.24),transparent_34%)]" />
      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-5 sm:gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <section className="max-w-xl py-2 sm:py-8">
          <div className="flex items-center gap-3">
            <Image
              src="/trackspeed-icon-1d43ec40.png"
              alt="TrackSpeed"
              width={44}
              height={44}
              priority
              className="rounded-[13px]"
            />
            <span className="text-lg font-black tracking-[-0.02em]">TrackSpeed</span>
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#8DDCB4] sm:mt-20">
            Sprint timing from your phone
          </p>
          <h1 className="mt-4 max-w-none text-[clamp(2.35rem,10vw,5.25rem)] font-black leading-[0.91] tracking-[-0.045em] sm:max-w-[11ch]">
            Opening TrackSpeed for you.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-white/66 sm:mt-6 sm:text-lg sm:leading-8">
            You came from {SOURCE_LABELS[source]}. We are sending this phone to
            the correct app store now.
          </p>
        </section>

        <section className="rounded-[30px] border border-white/12 bg-white/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_32px_90px_-52px_rgba(0,0,0,0.9)] backdrop-blur-md sm:p-7">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <span
              className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8DDCB4] motion-reduce:animate-none"
              aria-hidden="true"
            />
            <p className="text-sm font-bold text-white/78" aria-live="polite">
              {showFallback
                ? "Still here? Tap below to continue."
                : "Opening the store..."}
            </p>
          </div>

          <div className="py-7">
            <p className="text-sm leading-6 text-white/58">
              {showFallback
                ? "Your in-app browser may have blocked the automatic handoff. The button below retries it directly."
                : "This usually takes less than a second. You can use the button below if the store does not appear."}
            </p>

            <DownloadLink
              store={initialPlatform}
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-white px-6 text-sm font-black text-[#0E171D] transition-transform active:scale-[0.98]"
            >
              Download TrackSpeed
            </DownloadLink>

            <a
              href={TRACKSPEED_HOMEPAGE_URL}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/12 px-5 text-sm font-bold text-white/72 transition-colors hover:bg-white/[0.06] active:scale-[0.98]"
            >
              Go to the TrackSpeed website
            </a>
          </div>

          <p className="border-t border-white/10 pt-5 text-xs leading-5 text-white/42">
            If needed, open this page in Safari or Chrome from the in-app browser menu.
          </p>
        </section>
      </div>

      <noscript>
        <div className="fixed inset-x-4 bottom-4 rounded-2xl bg-white p-4 text-[#0E171D]">
          JavaScript is off. Open the TrackSpeed website to choose your store.
        </div>
      </noscript>
    </main>
  );
}
