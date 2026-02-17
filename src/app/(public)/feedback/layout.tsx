import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feature Requests & Feedback",
  description:
    "Vote on TrackSpeed feature ideas, report bugs, and suggest improvements. Help shape the future of sprint timing.",
  alternates: {
    canonical: "https://mytrackspeed.com/feedback",
  },
};

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
