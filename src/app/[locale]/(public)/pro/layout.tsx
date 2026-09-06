import { getPageMetadata } from "@/i18n/metadata";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return getPageMetadata({
    title: "TrackSpeed Pro — Make Every Session Count",
    description: "Explore TrackSpeed Pro for connected sprint timing, photo review, athlete profiles and session history. See current plans and purchase terms in the app.",
    path: "/pro",
    localized: false,
    robots: locale === "en" ? undefined : {index: false, follow: true},
  });
}

export default function ProLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}
