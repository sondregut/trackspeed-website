"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/codes", label: "Promo Codes" },
  { href: "/admin/redemptions", label: "Redemptions" },
  { href: "/admin/influencers", label: "Influencers" },
  { href: "/admin/emails", label: "Emails" },
  { href: "/admin/sms", label: "SMS" },
  { href: "/admin/notifications", label: "Push" },
]

export default function AdminNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Don't show nav on login page
  if (pathname === "/admin/login") {
    return null
  }

  return (
    <nav className="border-b border-[#3D3D3D] bg-[#1A1A1A] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14">
          <span className="text-lg font-semibold text-white shrink-0">TrackSpeed Admin</span>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-[#5C8DB8] text-white"
                      : "text-[#9B9A97] hover:text-white hover:bg-[#2B2E32]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="text-sm text-[#9B9A97] hover:text-white transition-colors hidden sm:block"
            >
              Logout
            </Link>

            {/* Hamburger button - mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-[#9B9A97] hover:text-white hover:bg-[#2B2E32] transition-colors"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-[#3D3D3D] pt-2">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#5C8DB8] text-white"
                        : "text-[#9B9A97] hover:text-white hover:bg-[#2B2E32]"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#9B9A97] hover:text-white hover:bg-[#2B2E32] transition-colors sm:hidden"
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
