import type { Metadata } from "next"
import InfluencerNav from "@/components/influencer/InfluencerNav"

export const metadata: Metadata = {
  title: "Influencer Portal | TrackSpeed",
  description: "TrackSpeed influencer affiliate program portal",
}

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#191919]">
      <InfluencerNav />
      {children}
    </div>
  )
}
