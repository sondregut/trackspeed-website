import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Sprint Timing Tips, Guides & Technology",
  description:
    "Tips, guides, and deep dives on sprint timing technology, training drills, and getting the most out of phone-based timing.",
  alternates: {
    canonical: "https://mytrackspeed.com/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
