"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#191919]/80 backdrop-blur-lg border-b border-[#3D3D3D]">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="TrackSpeed"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold">TrackSpeed</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[#9B9A97] hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-[#9B9A97] hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/support" className="text-[#9B9A97] hover:text-white transition-colors">
              Support
            </Link>
            <a
              href="https://apps.apple.com/app/trackspeed"
              className="btn-primary px-5 py-2 rounded-full text-white font-medium"
            >
              Download
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#3D3D3D] pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-[#9B9A97] hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-[#9B9A97] hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/support"
                className="text-[#9B9A97] hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Support
              </Link>
              <a
                href="https://apps.apple.com/app/trackspeed"
                className="btn-primary px-5 py-2 rounded-full text-white font-medium text-center"
              >
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
