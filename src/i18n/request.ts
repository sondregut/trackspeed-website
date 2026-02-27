import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = {
    common: (await import(`../../messages/${locale}/common.json`)).default,
    home: (await import(`../../messages/${locale}/home.json`)).default,
    about: (await import(`../../messages/${locale}/about.json`)).default,
    technology: (await import(`../../messages/${locale}/technology.json`)).default,
    support: (await import(`../../messages/${locale}/support.json`)).default,
    blog: (await import(`../../messages/${locale}/blog.json`)).default,
    pro: (await import(`../../messages/${locale}/pro.json`)).default,
    legal: (await import(`../../messages/${locale}/legal.json`)).default,
    feedback: (await import(`../../messages/${locale}/feedback.json`)).default,
    pitch: (await import(`../../messages/${locale}/pitch.json`)).default,
  };

  return {
    locale,
    messages,
  };
});
