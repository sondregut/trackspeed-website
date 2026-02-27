"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import AppleIcon from "@/components/icons/AppleIcon";
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
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icon.png"
              alt="TrackSpeed"
              width={28}
              height={28}
              className="rounded-lg"
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
            <Link href="/support" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("support")}
            </Link>
            <Link href="/blog" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("blog")}
            </Link>
            <Link href="/about" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              {t("about")}
            </Link>
          </div>

          {/* Language switcher + App Store button */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Button asChild className="bg-black text-white hover:bg-gray-800 rounded-lg px-3 py-1.5 h-auto">
              <a href="https://apps.apple.com/app/trackspeed">
                <AppleIcon className="w-4 h-4" />
                <span className="text-xs font-semibold">{t("appStore")}</span>
              </a>
            </Button>
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
                <div className="mt-2">
                  <LanguageSwitcher />
                </div>
                <a
                  href="https://apps.apple.com/app/trackspeed"
                  className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg w-fit mt-2"
                >
                  <AppleIcon className="w-5 h-5" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] opacity-80">{t("downloadOnThe")}</span>
                    <span className="text-sm font-semibold -mt-0.5">{t("appStore")}</span>
                  </div>
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
