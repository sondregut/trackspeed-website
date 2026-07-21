import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { getLocale } from "next-intl/server";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mytrackspeed.com"),
  applicationName: "TrackSpeed",
  title: {
    default: "TrackSpeed - Sprint Timing App for Phone",
    template: "%s | TrackSpeed",
  },
  description:
    "Turn your phone into a sprint timing system. ~4ms accuracy, no extra hardware needed. Used by track coaches and athletes. Available on iOS.",
  keywords: [
    "sprint timing",
    "track and field",
    "athletic timing",
    "phone timing app",
    "photo finish app",
    "sprint stopwatch",
    "race timing app",
    "coach timing tool",
    "track meet timer",
    "running timer",
    "athletics app",
    "100m timing app",
    "how to time sprints with phone",
    "track and field timing system",
    "training timer for sprints",
    "multi-device timing system",
    "millisecond timer app",
  ],
  openGraph: {
    siteName: "TrackSpeed",
    title: "TrackSpeed - Sprint Timing App for Phone",
    description:
      "Turn your phone into a sprint timing system. ~4ms accuracy, no hardware needed. Used by track coaches and athletes.",
    type: "website",
    url: "https://mytrackspeed.com",
    images: [
      {
        url: "/og-image-2026-06.png",
        width: 1200,
        height: 630,
        alt: "TrackSpeed sprint timing app — ~4ms accuracy, 120fps detection, no hardware needed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackSpeed - Sprint Timing App for Phone",
    description:
      "Turn your phone into a sprint timing system. ~4ms accuracy, no extra hardware needed. Available on iOS.",
    images: ["/og-image-2026-06.png"],
  },
  icons: {
    icon: [
      { url: "/trackspeed-favicon-16-1d43ec40.png", sizes: "16x16", type: "image/png" },
      { url: "/trackspeed-favicon-32-1d43ec40.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/trackspeed-favicon-32-1d43ec40.png",
    apple: "/trackspeed-apple-touch-icon-1d43ec40.png",
  },
  itunes: {
    appId: "6757509163",
  },
  manifest: "/manifest.json",
  verification: {
    google: "88hRhOzH0AXwFdBwhN2dIcldF3TyVXEo4y26qt46YI8",
  },
  other: {
    "theme-color": "#FFFFFF",
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://mytrackspeed.com/#founder",
      name: "Sondre Guttormsen",
      url: "https://mytrackspeed.com/about",
      jobTitle: "Founder and developer of TrackSpeed",
      sameAs: [
        "https://www.linkedin.com/in/sondre-guttormsen-803b8619b",
        "https://instagram.com/sondre_pv",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://mytrackspeed.com/#organization",
      name: "TrackSpeed",
      url: "https://mytrackspeed.com",
      logo: {
        "@type": "ImageObject",
        url: "https://mytrackspeed.com/trackspeed-icon-1d43ec40.png",
        width: 1024,
        height: 1024,
      },
      description:
        "Automatic sprint timing for training using iPhone cameras and multi-device synchronization.",
      foundingDate: "2025",
      founder: { "@id": "https://mytrackspeed.com/#founder" },
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@mytrackspeed.com",
        contactType: "customer support",
      },
      sameAs: [
        "https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163",
        "https://x.com/trackspeedapp",
        "https://instagram.com/mytrackspeed",
        "https://tiktok.com/@trackspeedapp",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://mytrackspeed.com/#website",
      name: "TrackSpeed",
      alternateName: "TrackSpeed Sprint Timer",
      url: "https://mytrackspeed.com",
      publisher: { "@id": "https://mytrackspeed.com/#organization" },
      inLanguage: [
        "en",
        "de",
        "fr",
        "nb",
        "ja",
        "zh-Hans",
        "ko",
        "hi",
        "es",
        "pt",
        "it",
        "ar",
        "tr",
      ],
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${bricolage.variable} antialiased`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:text-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]">Skip to main content</a>
        {children}
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd),
          }}
        />
      </body>
    </html>
  );
}
