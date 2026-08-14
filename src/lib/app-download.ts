export const IOS_APP_STORE_URL =
  "https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163";

export const ANDROID_PACKAGE_NAME = "com.trackspeed.android";

export const GOOGLE_PLAY_URL =
  `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}`;

export const TRACKSPEED_HOMEPAGE_URL = "https://mytrackspeed.com";

export type StorePlatform = "ios" | "android";
export type InstallSource =
  | "website"
  | "instagram"
  | "threads"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "x";

type BrowserSignals = {
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
};

type InstallDestination = {
  ios: string;
  android: string;
};

const RAW_STORE_DESTINATIONS: InstallDestination = {
  ios: IOS_APP_STORE_URL,
  android: GOOGLE_PLAY_URL,
};

// TrackSpeed does not currently have an attribution-provider link configured.
// Replace individual channel values with OneLink/Branch/Adjust URLs when those
// links exist. Keeping every source explicit prevents an untagged visit from
// being incorrectly attributed to Instagram or another channel.
const INSTALL_DESTINATIONS: Record<InstallSource, InstallDestination> = {
  website: RAW_STORE_DESTINATIONS,
  instagram: RAW_STORE_DESTINATIONS,
  threads: RAW_STORE_DESTINATIONS,
  facebook: RAW_STORE_DESTINATIONS,
  tiktok: RAW_STORE_DESTINATIONS,
  youtube: RAW_STORE_DESTINATIONS,
  x: RAW_STORE_DESTINATIONS,
};

const SOURCE_ALIASES: Record<string, InstallSource> = {
  website: "website",
  web: "website",
  instagram: "instagram",
  ig: "instagram",
  threads: "threads",
  thread: "threads",
  facebook: "facebook",
  fb: "facebook",
  messenger: "facebook",
  tiktok: "tiktok",
  tt: "tiktok",
  youtube: "youtube",
  yt: "youtube",
  x: "x",
  twitter: "x",
};

function currentBrowserSignals(): Required<BrowserSignals> {
  if (typeof navigator === "undefined") {
    return { userAgent: "", platform: "", maxTouchPoints: 0 };
  }

  return {
    userAgent: navigator.userAgent || "",
    platform: navigator.platform || "",
    maxTouchPoints: navigator.maxTouchPoints || 0,
  };
}

function resolvedSignals(signals?: BrowserSignals): Required<BrowserSignals> {
  const current = currentBrowserSignals();

  return {
    userAgent: signals?.userAgent ?? current.userAgent,
    platform: signals?.platform ?? current.platform,
    maxTouchPoints: signals?.maxTouchPoints ?? current.maxTouchPoints,
  };
}

export function isIOS(signals?: BrowserSignals | string): boolean {
  const resolved =
    typeof signals === "string"
      ? resolvedSignals({ userAgent: signals })
      : resolvedSignals(signals);

  return (
    /iPad|iPhone|iPod/i.test(resolved.userAgent) ||
    (resolved.platform === "MacIntel" && resolved.maxTouchPoints > 1)
  );
}

export function isAndroid(signals?: BrowserSignals | string): boolean {
  const resolved =
    typeof signals === "string"
      ? resolvedSignals({ userAgent: signals })
      : resolvedSignals(signals);

  return /Android/i.test(resolved.userAgent);
}

export function isInstagramInApp(signals?: BrowserSignals | string): boolean {
  const resolved =
    typeof signals === "string"
      ? resolvedSignals({ userAgent: signals })
      : resolvedSignals(signals);

  return /Instagram|Barcelona/i.test(resolved.userAgent);
}

export function isFacebookInApp(signals?: BrowserSignals | string): boolean {
  const resolved =
    typeof signals === "string"
      ? resolvedSignals({ userAgent: signals })
      : resolvedSignals(signals);

  return /FBAN|FBAV|FB_IAB|FBIOS|Messenger/i.test(resolved.userAgent);
}

export function isTikTokInApp(signals?: BrowserSignals | string): boolean {
  const resolved =
    typeof signals === "string"
      ? resolvedSignals({ userAgent: signals })
      : resolvedSignals(signals);

  return /TikTok|musical_ly|BytedanceWebview/i.test(resolved.userAgent);
}

export function isInAppBrowser(signals?: BrowserSignals | string): boolean {
  return (
    isInstagramInApp(signals) ||
    isFacebookInApp(signals) ||
    isTikTokInApp(signals)
  );
}

export function isMobileBrowser(signals?: BrowserSignals | string): boolean {
  const resolved =
    typeof signals === "string"
      ? resolvedSignals({ userAgent: signals })
      : resolvedSignals(signals);

  return (
    isIOS(resolved) ||
    isAndroid(resolved) ||
    /Mobile|IEMobile|Opera Mini/i.test(resolved.userAgent)
  );
}

export function normalizeInstallSource(source?: string | null): InstallSource {
  if (!source) return "website";

  const normalized = source.trim().toLowerCase();
  return SOURCE_ALIASES[normalized] ?? "website";
}

export function getInstallDestination(
  source: InstallSource,
  platform: StorePlatform,
): string {
  return INSTALL_DESTINATIONS[source][platform];
}

export function getRawStoreUrl(platform: StorePlatform): string {
  return RAW_STORE_DESTINATIONS[platform];
}

export function hasAttributionProviderLink(
  source: InstallSource,
  platform: StorePlatform,
): boolean {
  return getInstallDestination(source, platform) !== getRawStoreUrl(platform);
}

export function instagramExternalBrowserUrl(targetUrl: string): string {
  return `instagram://extbrowser/?url=${encodeURIComponent(targetUrl)}`;
}

export function facebookSafariUrl(targetUrl: string): string {
  return `x-safari-${targetUrl}`;
}

export function androidIntentUrl(targetUrl: string): string {
  const withoutScheme = targetUrl.replace(/^https?:\/\//i, "");
  return `intent://${withoutScheme}#Intent;scheme=https;end`;
}

export function androidMarketUrl(
  packageName: string = ANDROID_PACKAGE_NAME,
): string {
  return `market://details?id=${encodeURIComponent(packageName)}`;
}
