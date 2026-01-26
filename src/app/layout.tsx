import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
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
  keywords: ["sprint timing", "track and field", "athletic timing", "iPhone timing app"],
  openGraph: {
    title: "TrackSpeed - Sprint Timing App",
    description: "Professional sprint timing using your iPhone",
    type: "website",
    url: "https://mytrackspeed.com",
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
      </body>
    </html>
  );
}
