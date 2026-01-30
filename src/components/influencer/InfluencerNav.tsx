"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const navItems = [
  { href: "/influencer/dashboard", label: "Dashboard" },
  { href: "/influencer/connect", label: "Payouts" },
]

export default function InfluencerNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Don't show nav on login/apply pages
  if (pathname === "/influencer/login" || pathname === "/influencer/apply") {
    return null
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/influencer/auth", { method: "DELETE" })
      router.push("/influencer/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
    setIsLoggingOut(false)
  }

  return (
    <nav className="border-b border-[#3D3D3D] bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo/Title */}
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold text-white">
              TrackSpeed Affiliate
            </span>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href)

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
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-sm text-[#9B9A97] hover:text-white transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </nav>
  )
}
