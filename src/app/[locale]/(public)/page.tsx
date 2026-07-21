import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getPageMetadata} from '@/i18n/metadata';
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TimingTechnology from "@/components/TimingTechnology";
import StartTypes from "@/components/StartTypes";
import MultiDevice from "@/components/MultiDevice";
import HowItWorks from "@/components/HowItWorks";
import Comparison from "@/components/Comparison";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'home'});
  return getPageMetadata({
    title: `TrackSpeed: ${t('metadata.title')}`,
    description: t('metadata.description'),
    path: '',
    locale,
    absoluteTitle: true,
  });
}

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://mytrackspeed.com/#app",
  name: "TrackSpeed",
  alternateName: "TrackSpeed Sprint Timer",
  url: "https://mytrackspeed.com",
  downloadUrl:
    "https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163",
  installUrl:
    "https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163",
  operatingSystem: "iOS 17.0 or later",
  applicationCategory: "SportsApplication",
  applicationSubCategory: "Sprint timing and athletic training",
  description:
    "TrackSpeed turns an iPhone into an automatic sprint timing system for training, with camera-based crossing detection, multi-phone timing, split times, and photo-finish review.",
  image: "https://mytrackspeed.com/og-image-2026-06.png",
  screenshot: [
    "https://mytrackspeed.com/app-store-screenshots/01-trackspeed-app-store.webp",
    "https://mytrackspeed.com/photofinish_edit.webp",
  ],
  author: { "@id": "https://mytrackspeed.com/#founder" },
  provider: { "@id": "https://mytrackspeed.com/#organization" },
  featureList: [
    "Automatic camera-based sprint timing",
    "Multi-phone start, split, and finish timing",
    "Photo-finish review",
    "Flying, touch-release, countdown, voice, and in-frame starts",
    "Athlete profiles and session history",
    "Video export",
  ],
  offers: [
    {
      "@type": "Offer",
      price: "59.99",
      priceCurrency: "USD",
      name: "TrackSpeed Pro Annual",
      availability: "https://schema.org/InStock",
    },
    {
      "@type": "Offer",
      price: "7.99",
      priceCurrency: "USD",
      name: "TrackSpeed Pro Weekly",
      availability: "https://schema.org/InStock",
    },
  ],
};

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
      <Hero />
      <HowItWorks />
      <StartTypes />
      <MultiDevice />
      <Features />
      <Comparison />
      <TimingTechnology />
      <Testimonials />
      <CTA />
    </>
  );
}
