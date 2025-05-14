"use client";
import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations("Footer");
  const pathname = usePathname();

  const currentLocale = pathname.split("/")[1];

  return (
    <>
      <div className="flex flex-col items-center justify-center p-4 gap-12 w-screen min-h-[360px] bg-[#212121]">
        <h4 className="text-4xl font-bold text-center">{t("letsTalk")}</h4>
        <Link
          href={`/${currentLocale}/contact`}
          className="text-black text-xl font-bold text-center py-4 px-6 border-2 border-black bg-white hover:bg-primary hover:scale-105 transition-all duration-300"
        >
          {t("contact")}
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-12 gap-12 w-screen min-h-[500px] box-border bg-[#101010]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full max-w-screen-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 cursor-default">
              <Image src="/logo.svg" alt="logo" width={30} height={30} />
              <h1 className="uppercase font-bold text-xl">Dardanova</h1>
            </div>
            <h6 className="text-secondary text-center">{t("description")}</h6>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-md text-white font-bold">{t("company")}</h4>
            <Link href={`/${currentLocale}`} className="text-secondary">
              {t("home")}
            </Link>
            <Link href={`/${currentLocale}/about`} className="text-secondary">
              {t("about")}
            </Link>
            <Link href={`/${currentLocale}/team`} className="text-secondary">
              {t("blog")}
            </Link>
            <Link href={`/${currentLocale}/contact`} className="text-secondary">
              {t("contactUs")}
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-md text-white font-bold">{t("ourServices")}</h4>
            <p className="text-secondary">{t("webDevelopment")}</p>
            <p className="text-secondary">{t("mobileDevelopment")}</p>
            <p className="text-secondary">{t("desktopDevelopment")}</p>
            <p className="text-secondary">{t("uiuxDesign")}</p>
            <p className="text-secondary">{t("seoServices")}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-md text-white font-bold">{t("contactInfo")}</h4>
            <p className="text-secondary">{t("address")}</p>
            <Link href={"tel:+905442827393"} className="text-secondary">
              +90 (544) 282 73 93
            </Link>
            <Link
              href={"mailto:contact@dardanova.com"}
              className="text-secondary"
            >
              info@dardanova.com
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
