import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Pitch Deck",
  description:
    "TrackSpeed pitch deck. Replacing $500-$5,000 timing hardware with computer vision on your phone.",
  robots: { index: false, follow: false },
};

export default function PitchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
