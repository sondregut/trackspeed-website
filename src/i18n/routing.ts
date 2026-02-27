import {defineRouting} from 'next-intl/routing';

export const locales = ['en', 'de', 'fr', 'nb', 'ja', 'zh-Hans', 'ko', 'hi', 'es', 'pt', 'it', 'ar', 'tr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Fran\u00e7ais',
  nb: 'Norsk',
  ja: '\u65e5\u672c\u8a9e',
  'zh-Hans': '\u4e2d\u6587',
  ko: '\ud55c\uad6d\uc5b4',
  hi: '\u0939\u093f\u0928\u094d\u0926\u0940',
  es: 'Espa\u00f1ol',
  pt: 'Portugu\u00eas',
  it: 'Italiano',
  ar: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
  tr: 'T\u00fcrk\u00e7e',
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
