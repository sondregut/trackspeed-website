"use client"

import { useState } from "react"
import Link from "next/link"

export default function InfluencerApplyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    applicationNote: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const socialLinks: Record<string, string> = {}
      if (formData.instagram) socialLinks.instagram = formData.instagram
      if (formData.tiktok) socialLinks.tiktok = formData.tiktok
      if (formData.youtube) socialLinks.youtube = formData.youtube
      if (formData.twitter) socialLinks.twitter = formData.twitter

      const response = await fetch("/api/influencer/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          socialLinks,
          applicationNote: formData.applicationNote,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Application failed")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Application failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1A1A1A] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Application Submitted!
          </h1>
          <p className="text-[#9B9A97] mb-6">
            Thank you for applying to the TrackSpeed affiliate program. We&apos;ll
            review your application and get back to you within 24-48 hours.
          </p>
          <Link
            href="/influencer/login"
            className="text-[#5C8DB8] hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Become a TrackSpeed Affiliate
          </h1>
          <p className="text-[#9B9A97]">
            Earn 20% commission on every yearly subscription you refer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#9B9A97] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#5C8DB8]"
                placeholder="John Smith"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9B9A97] mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#5C8DB8]"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9B9A97] mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#5C8DB8]"
                placeholder="Min 8 characters"
                minLength={8}
                required
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-white mb-4">
              Social Media (at least one recommended)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9B9A97] mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#5C8DB8]"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9B9A97] mb-1">
                  TikTok
                </label>
                <input
                  type="text"
                  value={formData.tiktok}
                  onChange={(e) =>
                    setFormData({ ...formData, tiktok: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#5C8DB8]"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9B9A97] mb-1">
                  YouTube
                </label>
                <input
                  type="text"
                  value={formData.youtube}
                  onChange={(e) =>
                    setFormData({ ...formData, youtube: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#5C8DB8]"
                  placeholder="Channel URL"
                />
              </div>
              <div>
                <label className="block text-xs text-[#9B9A97] mb-1">
                  X (Twitter)
                </label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white text-sm placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#5C8DB8]"
                  placeholder="@username"
                />
              </div>
            </div>
          </div>

          {/* Application Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#9B9A97] mb-2">
              Why do you want to promote TrackSpeed?
            </label>
            <textarea
              value={formData.applicationNote}
              onChange={(e) =>
                setFormData({ ...formData, applicationNote: e.target.value })
              }
              className="w-full px-4 py-3 bg-[#2B2E32] border border-[#3D3D3D] rounded-lg text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#5C8DB8] resize-none"
              rows={3}
              placeholder="Tell us about your audience and why TrackSpeed would be a good fit..."
            />
          </div>

          {/* Program Details */}
          <div className="mb-6 p-4 bg-[#2B2E32] rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">
              Program Benefits
            </h3>
            <ul className="text-sm text-[#9B9A97] space-y-1">
              <li>• 20% commission (~$10) on yearly subscriptions</li>
              <li>• Your audience gets 30-day trial (vs 7-day)</li>
              <li>• Unique promo code with your name</li>
              <li>• Automatic payouts via Stripe</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#5C8DB8] hover:bg-[#4A7A9E] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>

          <p className="text-center text-sm text-[#9B9A97] mt-4">
            Already have an account?{" "}
            <Link href="/influencer/login" className="text-[#5C8DB8] hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
