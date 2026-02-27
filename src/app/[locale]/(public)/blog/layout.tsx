import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getAlternates} from '@/i18n/metadata';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'blog'});
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: getAlternates('/blog'),
  };
}

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return children;
}
