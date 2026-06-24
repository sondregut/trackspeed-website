import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
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
  title: {
    default: "TrackSpeed - Sprint Timing App for Phone",
    template: "%s | TrackSpeed",
  },
  description:
    "Turn your phone into a sprint timing system. ~4ms accuracy, no hardware needed. Used by track coaches and athletes. Download free on iOS.",
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
    "free sprint timer",
    "track and field timing system",
    "training timer for sprints",
    "multi-device timing system",
    "millisecond timer app",
  ],
  alternates: {
    canonical: "https://mytrackspeed.com",
  },
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
      "Turn your phone into a sprint timing system. ~4ms accuracy, no hardware needed. Download free on iOS.",
    images: ["/og-image-2026-06.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "88hRhOzH0AXwFdBwhN2dIcldF3TyVXEo4y26qt46YI8",
  },
  other: {
    "apple-itunes-app": "app-id=6757509163",
    "theme-color": "#FFFFFF",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bricolage.variable} antialiased`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:text-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]">Skip to main content</a>
        {children}
        <CookieConsent />
        <script
          type="application/ld+json"
          // JSON.stringify on static objects is safe — no user input
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "TrackSpeed",
              url: "https://mytrackspeed.com",
              downloadUrl: "https://apps.apple.com/app/trackspeed/id6757509163",
              operatingSystem: "iOS",
              applicationCategory: "SportsApplication",
              description:
                "Turn your phone into a sprint timing system. ~4ms accuracy, no hardware needed. Used by track coaches and athletes.",
              screenshot: [
                "https://mytrackspeed.com/photofinish_edit.png",
              ],
              featureList: "Multi-device timing, 120fps camera detection, Sub-4ms accuracy, Photo finish review, Five start methods, Frame scrubber",
              offers: [
                {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  description: "Free",
                  availability: "https://schema.org/InStock",
                },
                {
                  "@type": "Offer",
                  price: "59.99",
                  priceCurrency: "USD",
                  description: "TrackSpeed Pro (Annual)",
                  priceValidUntil: "2027-12-31",
                  availability: "https://schema.org/InStock",
                },
                {
                  "@type": "Offer",
                  price: "4.99",
                  priceCurrency: "USD",
                  description: "TrackSpeed Pro (Weekly)",
                  priceValidUntil: "2027-12-31",
                  availability: "https://schema.org/InStock",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          // Static JSON-LD — no user input
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TrackSpeed",
              url: "https://mytrackspeed.com",
              logo: "https://mytrackspeed.com/icon.png",
              description: "Professional sprint timing using your phone. No extra hardware needed. Founded by Olympic athletes.",
              foundingDate: "2025",
              sameAs: [
                "https://apps.apple.com/app/trackspeed/id6757509163",
                "https://x.com/trackspeedapp",
                "https://instagram.com/mytrackspeed",
                "https://tiktok.com/@trackspeedapp",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          // Static JSON-LD — no user input
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "TrackSpeed",
              url: "https://mytrackspeed.com",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://mytrackspeed.com/blog?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
