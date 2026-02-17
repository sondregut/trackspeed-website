import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrackSpeed Pro - Upgrade Your Sprint Timing",
  description:
    "Upgrade to TrackSpeed Pro: 120fps capture, multi-device sync, frame scrubber, unlimited history. $49.99/year or $8.99/month.",
  alternates: {
    canonical: "https://mytrackspeed.com/pro",
  },
};

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
