"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("common.nav");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-[20px] transition-[background-color,box-shadow] duration-200 ${
        scrolled
          ? "bg-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          : "bg-white/70"
      }`}
      style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.3)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="TrackSpeed"
              width={26}
              height={26}
              sizes="26px"
              className="rounded-md"
            />
            <span className="text-lg font-bold text-foreground">TrackSpeed</span>
          </Link>

          {/* Desktop nav - centered links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("features")}
            </Link>
            <Link href="/#how-it-works" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("howItWorks")}
            </Link>
            <Link href="/technology" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("technology")}
            </Link>
            <Link href="/pro" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              Pro
            </Link>
            <Link href="/support" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("support")}
            </Link>
            <Link href="/blog" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("blog")}
            </Link>
            <Link href="/about" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("about")}
            </Link>
            {/* TODO: Unhide when shop is ready */}
            {/* <Link href="/shop" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("shop")}
            </Link> */}
          </div>

          {/* Language switcher + App Store badge */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <a href="https://apps.apple.com/app/trackspeed" className="inline-block hover:opacity-80 transition-opacity">
              <Image
                src="/app-store-badge.svg"
                alt="Download on the App Store"
                width={120}
                height={40}
                sizes="120px"
                className="h-[34px] w-auto"
              />
            </a>
          </div>

          {/* Mobile menu - Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 text-foreground"
                aria-label={t("openMenu")}
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetTitle className="sr-only">{t("navigation")}</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                  <Link href="/#features" className="text-sm font-bold text-muted">
                    {t("features")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/#how-it-works" className="text-sm font-bold text-muted">
                    {t("howItWorks")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/technology" className="text-sm font-bold text-muted">
                    {t("technology")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/pro" className="text-sm font-bold text-muted">
                    Pro
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/support" className="text-sm font-bold text-muted">
                    {t("support")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/blog" className="text-sm font-bold text-muted">
                    {t("blog")}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/about" className="text-sm font-bold text-muted">
                    {t("about")}
                  </Link>
                </SheetClose>
                {/* TODO: Unhide when shop is ready */}
                {/* <SheetClose asChild>
                  <Link href="/shop" className="text-sm font-bold text-muted">
                    {t("shop")}
                  </Link>
                </SheetClose> */}
                <div className="mt-2">
                  <LanguageSwitcher />
                </div>
                <a
                  href="https://apps.apple.com/app/trackspeed"
                  className="inline-block mt-2 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/app-store-badge.svg"
                    alt="Download on the App Store"
                    width={120}
                    height={40}
                    sizes="120px"
                    className="h-[40px] w-auto"
                  />
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
