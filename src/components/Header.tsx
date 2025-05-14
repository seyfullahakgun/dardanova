"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuHamburger from "./MenuHamburger";
import { useTranslations } from "next-intl";
import useWindowDimensions from "@/utils/useWindowDimensions";
import { NavItem } from "@/types";

const Header = () => {
  const router = usePathname(); // Get the current path
  const t = useTranslations("Header"); // Translation function
  const { screenWidth } = useWindowDimensions(); // Get the screen width

  const currentLocale = router.split("/")[1]; // Get current locale from the pathname

  const menuRef = React.useRef<HTMLDivElement>(null); // Ref for the menu
  const menuButtonRef = React.useRef<HTMLLabelElement>(null); // Ref for the menu button

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu açık mı kapalı mı kontrolü

  // Aktif olan linki kontrol etmek için yardımcı fonksiyon
  const isActive = (path: string) => {
    return router === path ? "!text-primary" : "text-secondary"; // Aktif sayfa primary renk
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navList: {
    title: string;
    href: string;
  }[] = [
    {
      title: t("home"),
      href: `/${currentLocale}`,
    },
    {
      title: t("about"),
      href: `/${currentLocale}/about`,
    },
    {
      title: t("blog"),
      href: `/${currentLocale}/blog`,
    },
  ];

  useEffect(() => {
    if (screenWidth > 1020) {
      setIsMenuOpen(false); // Eğer ekran genişliği 1020'den büyük
    }
  }, [screenWidth]);

  // Close the menu if a click occurs outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (
          menuButtonRef.current &&
          !menuButtonRef.current.contains(event.target as Node)
        ) {
          setIsMenuOpen(false); // Close the menu if click is outside
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute top-0 left-0 bg-transparent w-screen max-w-screen box-border p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between w-full max-w-screen-xl mx-auto"
      >
        <div className="flex items-center gap-2 cursor-default">
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
          <motion.h1
            drag
            dragConstraints={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            className="uppercase font-bold text-3xl"
          >
            Dardanova
          </motion.h1>
        </div>
        <div className="hidden lg:flex items-center gap-[75px] text-lg text-secondary">
          {navList.map((item: NavItem) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-white hover:scale-105 transition-all duration-300 ${isActive(
                item.href
              )}`}
            >
              {item.title}
            </Link>
          ))}
          <Link
            href={`/${currentLocale}/contact`}
            className="text-black text-center font-bold p-4 bg-white hover:bg-primary hover:scale-105 transition-all duration-300"
          >
            {t("contact")}
          </Link>
        </div>
        <div className="lg:hidden">
          <MenuHamburger
            ref={menuButtonRef}
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
          />
        </div>
      </motion.div>
      {/* Sliding Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 left-0 w-[300px] h-screen bg-dark z-50 transition-transform duration-300 ease-in-out"
        style={{
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white">
          <div className="flex items-center gap-2 cursor-default">
            <Image src="/logo.svg" alt="logo" width={30} height={30} />
            <h1 className="uppercase font-bold text-xl">Dardanova</h1>
          </div>
        </div>
        <div className="flex flex-col gap-10 p-6">
          {navList.map((item: NavItem) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`hover:text-white transition-all duration-300 ${isActive(
                item.href
              )}`}
            >
              {item.title}
            </Link>
          ))}
          <Link
            href={`/${currentLocale}/contact`}
            onClick={handleLinkClick}
            className="text-black font-bold text-center p-4 bg-white hover:bg-primary hover:scale-105 transition-all duration-300"
          >
            {t("contact")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
