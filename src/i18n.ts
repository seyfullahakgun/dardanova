import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './i18n/routing';

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale || defaultLocale;
  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
}); 