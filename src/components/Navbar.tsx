"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
      }}
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
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>TrackSpeed</span>
          </Link>

          {/* Desktop nav - centered links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-bold transition-colors hover:text-gray-900" style={{ color: 'var(--text-muted)' }}>
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-bold transition-colors hover:text-gray-900" style={{ color: 'var(--text-muted)' }}>
              How It Works
            </Link>
            <Link href="#start-types" className="text-sm font-bold transition-colors hover:text-gray-900" style={{ color: 'var(--text-muted)' }}>
              Start Types
            </Link>
            <Link href="/support" className="text-sm font-bold transition-colors hover:text-gray-900" style={{ color: 'var(--text-muted)' }}>
              Support
            </Link>
          </div>

          {/* App Store button */}
          <a
            href="https://apps.apple.com/app/trackspeed"
            className="hidden md:flex items-center gap-1.5 bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span className="text-xs font-semibold">App Store</span>
          </a>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            style={{ color: 'var(--text-primary)' }}
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
          <div className="md:hidden mt-4 pb-4 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-sm font-bold"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-bold"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#start-types"
                className="text-sm font-bold"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setIsOpen(false)}
              >
                Start Types
              </Link>
              <Link
                href="/support"
                className="text-sm font-bold"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setIsOpen(false)}
              >
                Support
              </Link>
              <a
                href="https://apps.apple.com/app/trackspeed"
                className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg w-fit"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] opacity-80">Download on the</span>
                  <span className="text-sm font-semibold -mt-0.5">App Store</span>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
