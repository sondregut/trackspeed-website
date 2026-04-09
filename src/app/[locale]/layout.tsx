import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {Noto_Sans_Arabic, Noto_Sans_Devanagari} from 'next/font/google';

// Arabic and Devanagari kept in next/font (small CSS, not flagged as unused)
const notoSansArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: '--font-devanagari',
  subsets: ['devanagari'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

// CJK fonts loaded via Google Fonts only for matching locales,
// eliminating ~89KB of unused CSS for non-CJK visitors.
const CJK_FONT_FAMILY: Record<string, string> = {
  ja: 'Noto Sans JP',
  ko: 'Noto Sans KR',
  'zh-Hans': 'Noto Sans SC',
};

function getLocaleFontClass(locale: string): string {
  switch (locale) {
    case 'ar': return notoSansArabic.variable;
    case 'hi': return notoSansDevanagari.variable;
    default: return '';
  }
}

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = getLocaleFontClass(locale);
  const cjkFamily = CJK_FONT_FAMILY[locale];
  const cjkGoogleParam = cjkFamily?.replace(/ /g, '+');

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {cjkGoogleParam && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css2?family=${cjkGoogleParam}:wght@400;500;700&display=swap`}
          />
        </>
      )}
      <div
        lang={locale}
        dir={dir}
        className={fontClass || undefined}
        style={cjkFamily ? ({'--font-cjk': cjkFamily} as React.CSSProperties) : undefined}
      >
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
