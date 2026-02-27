import { locales } from './routing';

const baseUrl = 'https://mytrackspeed.com';

/**
 * Generate hreflang alternates for a given path.
 * English uses no prefix, other locales get /{locale} prefix.
 */
export function getAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    if (locale === 'en') {
      languages[locale] = `${baseUrl}${path}`;
    } else {
      languages[locale] = `${baseUrl}/${locale}${path}`;
    }
  }
  // x-default points to English (unprefixed)
  languages['x-default'] = `${baseUrl}${path}`;

  return {
    canonical: `${baseUrl}${path}`,
    languages,
  };
}
