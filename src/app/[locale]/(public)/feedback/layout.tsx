import { Metadata } from "next";
import { getPageMetadata } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({
    title: "Feature Requests & Feedback",
    description:
      "Vote on TrackSpeed feature ideas, report bugs, and suggest improvements. Help shape the future of sprint timing.",
    path: "/feedback",
    localized: false,
    locale,
  });
}

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
