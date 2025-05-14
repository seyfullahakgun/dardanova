import { defineRouting } from "next-intl/routing";

export const locales = ['tr', 'en'] as const;
export const defaultLocale = 'tr' as const;

export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always"
});
