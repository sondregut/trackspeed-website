import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's strip-types test runner requires the explicit extension.
import * as appDownload from "../src/lib/app-download.ts";

const {
  ANDROID_PACKAGE_NAME,
  GOOGLE_PLAY_URL,
  IOS_APP_STORE_URL,
  androidIntentUrl,
  androidMarketUrl,
  getInstallDestination,
  hasAttributionProviderLink,
  instagramExternalBrowserUrl,
  isAndroid,
  isFacebookInApp,
  isInAppBrowser,
  isInstagramInApp,
  isIOS,
  isTikTokInApp,
  normalizeInstallSource,
} = appDownload;

const IPHONE_INSTAGRAM_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Instagram 382.0.0.0";
const ANDROID_TIKTOK_UA =
  "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Mobile TikTok 40.2.4 BytedanceWebview";

test("detects iOS, including iPadOS desktop-style user agents", () => {
  assert.equal(isIOS(IPHONE_INSTAGRAM_UA), true);
  assert.equal(
    isIOS({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
      platform: "MacIntel",
      maxTouchPoints: 5,
    }),
    true,
  );
  assert.equal(isIOS(ANDROID_TIKTOK_UA), false);
});

test("detects Android and the supported social in-app browsers", () => {
  assert.equal(isAndroid(ANDROID_TIKTOK_UA), true);
  assert.equal(isInstagramInApp(IPHONE_INSTAGRAM_UA), true);
  assert.equal(isInstagramInApp("Mozilla/5.0 Barcelona/345.0"), true);
  assert.equal(isFacebookInApp("Mozilla/5.0 [FBAN/FBIOS;FBAV/510.0]"), true);
  assert.equal(isFacebookInApp("Mozilla/5.0 FB_IAB Messenger"), true);
  assert.equal(isTikTokInApp(ANDROID_TIKTOK_UA), true);
  assert.equal(isInAppBrowser("Mozilla/5.0 Mobile Safari/605.1.15"), false);
});

test("uses a neutral source for missing, unknown, or unsafe source values", () => {
  assert.equal(normalizeInstallSource(), "website");
  assert.equal(normalizeInstallSource(""), "website");
  assert.equal(normalizeInstallSource("newsletter"), "website");
  assert.equal(normalizeInstallSource("<script>"), "website");
  assert.equal(normalizeInstallSource(" IG "), "instagram");
  assert.equal(normalizeInstallSource("Messenger"), "facebook");
  assert.equal(normalizeInstallSource("TT"), "tiktok");
});

test("returns raw store destinations while attribution links are unconfigured", () => {
  assert.equal(getInstallDestination("instagram", "ios"), IOS_APP_STORE_URL);
  assert.equal(getInstallDestination("tiktok", "android"), GOOGLE_PLAY_URL);
  assert.equal(hasAttributionProviderLink("instagram", "ios"), false);
  assert.equal(hasAttributionProviderLink("facebook", "android"), false);
});

test("builds the platform handoff schemes without redirect chains", () => {
  assert.equal(
    instagramExternalBrowserUrl(IOS_APP_STORE_URL),
    `instagram://extbrowser/?url=${encodeURIComponent(IOS_APP_STORE_URL)}`,
  );
  assert.equal(
    androidIntentUrl(GOOGLE_PLAY_URL),
    `intent://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_NAME}#Intent;scheme=https;end`,
  );
  assert.equal(
    androidMarketUrl(),
    `market://details?id=${ANDROID_PACKAGE_NAME}`,
  );
});
