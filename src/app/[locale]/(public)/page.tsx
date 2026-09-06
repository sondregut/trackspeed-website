import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getPageMetadata} from '@/i18n/metadata';
import {getMessages} from 'next-intl/server';
import MarketingHome from '@/components/marketing/MarketingHome';
import type marketingCopy from '../../../../messages/en/marketing.json';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'marketing'});
  return getPageMetadata({
    title: `TrackSpeed: ${t('meta.title')}`,
    description: t('meta.description'),
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
    "Video timing overlays and CSV export",
    "One-phone solo laps",
    "Custom distances, sprint templates and repeat sessions",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "Free download with optional in-app purchases",
    availability: "https://schema.org/InStock",
    url: "https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163",
  },
};

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const messages = await getMessages({locale});
  const copy = messages.marketing as typeof marketingCopy;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
      <MarketingHome copy={copy} />
    </>
  );
}
