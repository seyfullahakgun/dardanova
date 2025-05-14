import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/routing";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always"
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
