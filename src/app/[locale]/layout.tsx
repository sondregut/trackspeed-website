import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {Noto_Sans_JP, Noto_Sans_KR, Noto_Sans_SC, Noto_Sans_Arabic, Noto_Sans_Devanagari} from 'next/font/google';

const notoSansJP = Noto_Sans_JP({
  variable: '--font-cjk',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

const notoSansKR = Noto_Sans_KR({
  variable: '--font-cjk',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

const notoSansSC = Noto_Sans_SC({
  variable: '--font-cjk',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

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

function getLocaleFontClass(locale: string): string {
  switch (locale) {
    case 'ja': return notoSansJP.variable;
    case 'ko': return notoSansKR.variable;
    case 'zh-Hans': return notoSansSC.variable;
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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div lang={locale} dir={dir} className={fontClass}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
