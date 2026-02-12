import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrackSpeed Pro - Special Offer",
  description: "Get TrackSpeed Pro with a special discount. Professional sprint timing on your iPhone.",
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
