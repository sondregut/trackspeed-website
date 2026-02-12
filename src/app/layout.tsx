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
  title: "TrackSpeed - Sprint Timing App",
  description: "Professional sprint timing using your iPhone. 240fps detection, multi-device sync, millisecond accuracy.",
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
  ],
  alternates: {
    canonical: "https://mytrackspeed.com",
  },
  openGraph: {
    title: "TrackSpeed - Sprint Timing App",
    description: "Professional sprint timing using your iPhone",
    type: "website",
    url: "https://mytrackspeed.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrackSpeed - Sprint Timing App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackSpeed - Sprint Timing App",
    description: "Professional sprint timing using your iPhone. Millisecond accuracy, no extra hardware needed.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
              operatingSystem: "iOS",
              applicationCategory: "SportsApplication",
              description:
                "Professional sprint timing using your iPhone camera. Millisecond accuracy, no extra hardware needed.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                ratingCount: "1",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
