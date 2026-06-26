"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const APP_STORE_URL = "https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("common.nav");
  const mobileNavItems = [
    { href: "/#features", label: t("features") },
    { href: "/#how-it-works", label: t("howItWorks") },
    { href: "/technology", label: t("technology") },
    { href: "/pro", label: "Pro" },
    { href: "/support", label: t("support") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("about") },
  ];

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
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
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
            <span className="text-lg font-bold text-foreground max-[360px]:hidden">TrackSpeed</span>
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
            <a href={APP_STORE_URL} className="inline-block hover:opacity-80 transition-opacity">
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
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="p-2 text-foreground"
                  aria-label={t("openMenu")}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                showCloseButton={false}
                className="w-[min(88vw,340px)] border-l border-[#DCE5EE] bg-[#F7FAFC] p-0"
              >
                <SheetTitle className="sr-only">{t("navigation")}</SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation and App Store download link.
                </SheetDescription>
                <div className="flex h-full flex-col">
                  <div className="border-b border-[#E2EAF2] bg-white px-5 pb-4 pt-5">
                    <div className="flex items-center justify-between gap-4">
                      <SheetClose asChild>
                        <Link href="/" className="flex min-w-0 items-center gap-2">
                          <Image
                            src="/icon.png"
                            alt="TrackSpeed"
                            width={28}
                            height={28}
                            sizes="28px"
                            className="rounded-md"
                          />
                          <span className="truncate text-lg font-bold text-[#0E0E0C]">
                            TrackSpeed
                          </span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <button
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DCE5EE] bg-[#F7FAFC] text-[#26303E] transition-colors hover:bg-[#EEF5FA] active:scale-[0.98]"
                          aria-label="Close menu"
                        >
                          <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </SheetClose>
                    </div>
                  </div>

                  <nav className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="rounded-[24px] border border-[#E2EAF2] bg-white p-1 shadow-[0_18px_40px_-32px_rgba(14,24,35,0.45)]">
                      {mobileNavItems.map((item) => (
                        <SheetClose key={item.href} asChild>
                          <Link
                            href={item.href}
                            className="flex min-h-12 items-center rounded-[18px] px-4 text-[15px] font-bold text-[#26303E] transition-colors hover:bg-[#F1F6FA] active:bg-[#E8F1F7]"
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>

                    <div className="mt-3 rounded-[24px] border border-[#E2EAF2] bg-white px-3 py-3 shadow-[0_18px_40px_-34px_rgba(14,24,35,0.35)]">
                      <LanguageSwitcher />
                    </div>
                  </nav>

                  <div className="border-t border-[#E2EAF2] bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    <div className="rounded-[24px] border border-[#E2EAF2] bg-[#F7FAFC] p-4">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#5C7286]">
                        Get TrackSpeed
                      </p>
                      <a
                        href={APP_STORE_URL}
                        className="inline-flex transition-opacity hover:opacity-80 active:scale-[0.99]"
                        aria-label="Download TrackSpeed on the App Store"
                      >
                        <Image
                          src="/app-store-badge.svg"
                          alt="Download on the App Store"
                          width={150}
                          height={50}
                          sizes="150px"
                          className="h-[46px] w-auto"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
