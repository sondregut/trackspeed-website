"use client"

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

  // Don't show nav on login page
  if (pathname === "/admin/login") {
    return null
  }

  return (
    <nav className="border-b border-[#3D3D3D] bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo/Title */}
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold text-white">TrackSpeed Admin</span>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
          </div>

          {/* Right side - logout */}
          <Link
            href="/admin/login"
            className="text-sm text-[#9B9A97] hover:text-white transition-colors"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  )
}
