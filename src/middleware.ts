import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Admin sayfaları için özel kontrol
  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("auth");
    const isLoginPath = pathname === "/admin/login";

    // Eğer admin sayfasına erişilmeye çalışılıyorsa ve kullanıcı giriş yapmamışsa
    if (!authCookie && !isLoginPath) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Eğer kullanıcı giriş yapmışsa ve login sayfasına gitmeye çalışıyorsa
    if (isLoginPath && authCookie) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // Admin sayfaları için locale kontrolünü atla
    return NextResponse.next();
  }

  // Admin olmayan sayfalar için next-intl middleware'ini çalıştır
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/admin/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
