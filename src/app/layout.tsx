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
    default: "TrackSpeed - Sprint Timing App for iPhone",
    template: "%s | TrackSpeed",
  },
  description:
    "Turn your iPhone into a sprint timing system. ~4ms accuracy, no hardware needed. Used by track coaches and athletes. Download free on iOS.",
  keywords: [
    "sprint timing",
    "track and field",
    "athletic timing",
    "iPhone timing app",
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
    title: "TrackSpeed - Sprint Timing App for iPhone",
    description:
      "Turn your iPhone into a sprint timing system. ~4ms accuracy, no hardware needed. Used by track coaches and athletes.",
    type: "website",
    url: "https://mytrackspeed.com",
    images: [
      {
        url: "/photofinish_edit.png",
        width: 881,
        height: 1816,
        alt: "TrackSpeed photo finish timing review on iPhone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackSpeed - Sprint Timing App for iPhone",
    description:
      "Turn your iPhone into a sprint timing system. ~4ms accuracy, no hardware needed. Download free on iOS.",
    images: ["/photofinish_edit.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "apple-itunes-app": "app-id=6757509163",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bricolage.variable} antialiased`}
      >
        {children}
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "TrackSpeed",
              url: "https://mytrackspeed.com",
              downloadUrl:
                "https://apps.apple.com/app/trackspeed/id6757509163",
              operatingSystem: "iOS",
              applicationCategory: "SportsApplication",
              description:
                "Turn your iPhone into a sprint timing system. ~4ms accuracy, no hardware needed. Used by track coaches and athletes.",
              offers: [
                {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  name: "Free",
                },
                {
                  "@type": "Offer",
                  price: "49.99",
                  priceCurrency: "USD",
                  name: "TrackSpeed Pro (Annual)",
                  priceValidUntil: "2027-12-31",
                },
                {
                  "@type": "Offer",
                  price: "8.99",
                  priceCurrency: "USD",
                  name: "TrackSpeed Pro (Monthly)",
                  priceValidUntil: "2027-12-31",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TrackSpeed",
              url: "https://mytrackspeed.com",
              logo: "https://mytrackspeed.com/icon.png",
            }),
          }}
        />
      </body>
    </html>
  );
}
