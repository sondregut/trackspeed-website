import type { Metadata } from 'next';
import { locales } from './routing';

export const baseUrl = 'https://mytrackspeed.com';
export const defaultSocialImage = '/og-image-2026-06.png';

/**
 * Generate hreflang alternates for a given path.
 * English uses no prefix, other locales get /{locale} prefix.
 */
export function getAlternates(path: string, locale?: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) {
    if (l === 'en') {
      languages[l] = `${baseUrl}${path}`;
    } else {
      languages[l] = `${baseUrl}/${l}${path}`;
    }
  }
  languages['x-default'] = `${baseUrl}${path}`;

  const canonical = locale && locale !== 'en'
    ? `${baseUrl}/${locale}${path}`
    : `${baseUrl}${path}`;

  return {
    canonical,
    languages,
  };
}

export function getCanonical(path: string) {
  return {
    canonical: `${baseUrl}${path}`,
  };
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: string;
  type?: 'website' | 'article';
  localized?: boolean;
  absoluteTitle?: boolean;
  robots?: Metadata['robots'];
};

/**
 * Keeps canonical, Open Graph, Twitter, and hreflang metadata aligned.
 * Set localized=false for routes whose visible body is currently English-only.
 */
export function getPageMetadata({
  title,
  description,
  path,
  locale,
  type = 'website',
  localized = true,
  absoluteTitle = false,
  robots,
}: PageMetadataOptions): Metadata {
  const alternates = localized
    ? getAlternates(path, locale)
    : getCanonical(path);
  const canonical = alternates.canonical;

  return {
    title: absoluteTitle ? {absolute: title} : title,
    description,
    alternates,
    robots,
    openGraph: {
      type,
      siteName: 'TrackSpeed',
      title,
      description,
      url: canonical,
      images: [
        {
          url: defaultSocialImage,
          width: 1200,
          height: 630,
          alt: 'TrackSpeed automatic sprint timing app on iPhone',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultSocialImage],
    },
  };
}
