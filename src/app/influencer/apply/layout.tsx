import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Athlete Ambassador Program",
  description:
    "Apply to join the TrackSpeed Athlete Ambassador Program for athletes sharing real training, sprint timing, and performance goals.",
  alternates: {
    canonical: "https://mytrackspeed.com/influencer/apply",
  },
  openGraph: {
    title: "TrackSpeed Athlete Ambassador Program",
    description:
      "Apply to become a TrackSpeed athlete ambassador and share real sprint training with your audience.",
    url: "https://mytrackspeed.com/influencer/apply",
  },
  twitter: {
    title: "TrackSpeed Athlete Ambassador Program",
    description:
      "Apply to become a TrackSpeed athlete ambassador and share real sprint training with your audience.",
  },
}

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
