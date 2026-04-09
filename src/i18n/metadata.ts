import { locales } from './routing';

const baseUrl = 'https://mytrackspeed.com';

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
