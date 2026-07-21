import { Metadata } from "next";
import { getPageMetadata } from "@/i18n/metadata";

export const metadata: Metadata = getPageMetadata({
  title: "TrackSpeed Pro - Upgrade Your Sprint Timing",
  description:
    "Upgrade to TrackSpeed Pro: multi-device sync, photo-finish review, video export, and unlimited history. $59.99/year or $7.99/week.",
  path: "/pro",
  localized: false,
});

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
