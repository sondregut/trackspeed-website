import type { Metadata } from "next"
import { getPageMetadata } from "@/i18n/metadata"

export const metadata: Metadata = getPageMetadata({
  title: "Athlete Ambassador Program",
  description:
    "Apply to join the TrackSpeed Athlete Ambassador Program for athletes sharing real training, sprint timing, and performance goals.",
  path: "/influencer/apply",
  localized: false,
  robots: { index: true, follow: true },
})

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
