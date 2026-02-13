"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
            <Link href="#features" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              How It Works
            </Link>
            <Link href="#start-types" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              Start Types
            </Link>
            <Link href="/support" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              Support
            </Link>
            <Link href="/feedback" className="text-sm font-bold text-muted transition-colors hover:text-gray-900">
              Feedback
            </Link>
          </div>

          {/* App Store button */}
          <Button asChild className="hidden md:flex bg-black text-white hover:bg-gray-800 rounded-lg px-3 py-1.5 h-auto">
            <a href="https://apps.apple.com/app/trackspeed">
              <AppleIcon className="w-4 h-4" />
              <span className="text-xs font-semibold">App Store</span>
            </a>
          </Button>

          {/* Mobile menu - Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 text-foreground"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                <SheetClose asChild>
                  <Link href="#features" className="text-sm font-bold text-muted">
                    Features
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#how-it-works" className="text-sm font-bold text-muted">
                    How It Works
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#start-types" className="text-sm font-bold text-muted">
                    Start Types
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/support" className="text-sm font-bold text-muted">
                    Support
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/feedback" className="text-sm font-bold text-muted">
                    Feedback
                  </Link>
                </SheetClose>
                <a
                  href="https://apps.apple.com/app/trackspeed"
                  className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg w-fit mt-2"
                >
                  <AppleIcon className="w-5 h-5" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] opacity-80">Download on the</span>
                    <span className="text-sm font-semibold -mt-0.5">App Store</span>
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
