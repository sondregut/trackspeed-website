import type { Metadata } from "next";
import { headers } from "next/headers";
import GetAppHandoff from "@/components/GetAppHandoff";
import { isAndroid, normalizeInstallSource } from "@/lib/app-download";

export const metadata: Metadata = {
  title: "Get TrackSpeed",
  description: "Open the right app store for TrackSpeed.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function GetTrackSpeedPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string | string[] }>;
}) {
  const [{ src }, requestHeaders] = await Promise.all([searchParams, headers()]);
  const source = normalizeInstallSource(Array.isArray(src) ? src[0] : src);
  const initialPlatform = isAndroid(requestHeaders.get("user-agent") ?? "")
    ? "android"
    : "ios";

  return <GetAppHandoff source={source} initialPlatform={initialPlatform} />;
}
