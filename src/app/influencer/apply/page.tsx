"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Dumbbell,
  ShieldCheck,
  Target,
  Trophy,
  UserPlus,
  Video,
  Zap,
} from "lucide-react"

const benefits = [
  {
    title: "TrackSpeed Pro access",
    description: "Use the full timing workflow while you are active in the program.",
    icon: Zap,
  },
  {
    title: "Early feature access",
    description: "Test new training, timing, and performance workflow features before launch.",
    icon: ShieldCheck,
  },
  {
    title: "Personal referral code",
    description: "Track subscriptions, earn 20% commission, and give referred annual users a bonus month.",
    icon: UserPlus,
  },
]

const eligibility = [
  "Ages 16+",
  "Training for sprints or speed work at least 3 times per week",
  "Working toward a clear athletic goal",
  "Able to film clear sprint training content with a phone",
  "Comfortable showing training, app setup, and timing results",
  "Willing to provide a public review TrackSpeed can use in advertising",
]

const ongoingRequirements = [
  "Post 4 stories or short-form updates per month tagging TrackSpeed",
  "Create content that shows TrackSpeed from setup to sprint result",
  "Show real running with the app and how easy it is to use",
  "Allow approved videos and public reviews to be used in TrackSpeed ads",
  "Keep your referral code visible when you recommend the app",
]

type FormData = {
  name: string
  location: string
  email: string
  phone: string
  password: string
  tiktok: string
  instagram: string
  primarySport: string
  athleticGoal: string
  trainingFrequency: string
  audienceSize: string
  videoUrl: string
  applicationNote: string
  adUsageConsent: boolean
}

const initialFormData: FormData = {
  name: "",
  location: "",
  email: "",
  phone: "",
  password: "",
  tiktok: "",
  instagram: "",
  primarySport: "",
  athleticGoal: "",
  trainingFrequency: "",
  audienceSize: "",
  videoUrl: "",
  applicationNote: "",
  adUsageConsent: false,
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-semibold text-[#26303E]">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

const inputClass =
  "w-full rounded-lg border border-[#DCE5EE] bg-white px-3 py-3 text-sm text-[#0E0E0C] outline-none transition placeholder:text-[#7B8490] focus:border-[#5C8DB8] focus:ring-2 focus:ring-[#5C8DB8]/20"

export default function InfluencerApplyPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      if (!formData.tiktok.trim() && !formData.instagram.trim()) {
        throw new Error("Add at least one TikTok or Instagram handle.")
      }
      if (!formData.adUsageConsent) {
        throw new Error("Confirm that TrackSpeed can use approved videos and your public review in ads.")
      }

      const socialLinks: Record<string, string> = {}
      if (formData.instagram.trim()) socialLinks.instagram = formData.instagram.trim()
      if (formData.tiktok.trim()) socialLinks.tiktok = formData.tiktok.trim()
      if (formData.videoUrl.trim()) socialLinks["content sample"] = formData.videoUrl.trim()

      const applicationNote = [
        `Location: ${formData.location.trim()}`,
        formData.phone.trim() ? `Phone: ${formData.phone.trim()}` : null,
        `Primary sport/event: ${formData.primarySport.trim()}`,
        `Athletic goal: ${formData.athleticGoal.trim()}`,
        `Training frequency: ${formData.trainingFrequency.trim()}`,
        formData.audienceSize.trim() ? `Audience size: ${formData.audienceSize.trim()}` : null,
        formData.videoUrl.trim() ? `Content sample: ${formData.videoUrl.trim()}` : null,
        "Ad usage consent: Applicant agreed TrackSpeed may use approved videos and their public review in ads, social posts, and marketing.",
        "",
        "Why this athlete would be a strong ambassador:",
        formData.applicationNote.trim(),
      ]
        .filter((line): line is string => line !== null)
        .join("\n")

      const response = await fetch("/api/influencer/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          socialLinks,
          applicationNote,
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
      <div className="min-h-screen bg-[#F8FBFD] px-6 py-16 text-[#0E0E0C]">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-lg border border-[#DCE5EE] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-[#EAF5EE] text-[#168A45]">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold">Application submitted</h1>
            <p className="mt-4 text-sm leading-6 text-[#5B6470]">
              Thanks for applying to the TrackSpeed Athlete Ambassador Program. We will review your
              training background, content sample, and social profiles, then follow up by email.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-[#DCE5EE] px-5 py-3 text-sm font-semibold text-[#26303E] transition hover:border-[#B8C8D8]"
              >
                Back to TrackSpeed
              </Link>
              <Link
                href="/influencer/login"
                className="inline-flex items-center justify-center rounded-lg bg-[#0E0E0C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#26303E]"
              >
                Check status
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FBFD] text-[#0E0E0C]">
      <header className="sticky top-0 z-40 border-b border-[#DCE5EE]/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/trackspeed-icon-1d43ec40.png" alt="TrackSpeed" width={28} height={28} sizes="28px" className="rounded-md" />
            <span className="text-lg font-bold">TrackSpeed</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#benefits" className="text-sm font-semibold text-[#5B6470] transition hover:text-[#0E0E0C]">
              Benefits
            </a>
            <a href="#requirements" className="text-sm font-semibold text-[#5B6470] transition hover:text-[#0E0E0C]">
              Requirements
            </a>
            <a href="#apply" className="text-sm font-semibold text-[#5B6470] transition hover:text-[#0E0E0C]">
              Apply
            </a>
          </nav>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0E0E0C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#26303E]"
          >
            Apply
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-[#DCE5EE] bg-white px-6 pt-20 pb-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] tracking-normal text-[#0E0E0C] md:text-7xl">
                TrackSpeed Athlete Ambassador Program
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-[#26303E]">
                We are looking for athletes who train consistently, share their journey, and want to
                help more athletes time sprints with a phone.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#apply"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5C8DB8] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#4A7A9E]"
                >
                  Apply now
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#requirements"
                  className="inline-flex items-center justify-center rounded-lg border border-[#DCE5EE] bg-white px-6 py-3.5 text-sm font-bold text-[#26303E] transition hover:border-[#B8C8D8]"
                >
                  See requirements
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-lg border border-[#DCE5EE] bg-[#F4FAFD] p-5 shadow-sm">
                <div className="rounded-lg bg-[#0E0E0C] p-5 text-white">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-sm font-semibold text-white/60">Ambassador snapshot</p>
                      <p className="mt-1 text-2xl font-bold">Train. Share. Earn.</p>
                    </div>
                    <Trophy className="h-9 w-9 text-[#9ED7A8]" />
                  </div>
                  <div className="mt-5">
                    <div className="rounded-lg bg-white/8 p-4">
                      <p className="text-sm text-white/60">Referral commission</p>
                      <p className="mt-1 text-3xl font-bold">20%</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {["Pro access", "Beta timing features", "Bonus month for referrals"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-white/85">
                        <Check className="h-4 w-4 text-[#9ED7A8]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold md:text-5xl">What ambassadors get</h2>
              <p className="mt-4 text-base leading-7 text-[#5B6470]">
                The program is built for athletes who can show real training, explain what matters
                on the track, and help other athletes understand better sprint timing.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.title} className="rounded-lg border border-[#DCE5EE] bg-white p-5 shadow-sm">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EDF6FB] text-[#5C8DB8]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#5B6470]">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="requirements" className="border-y border-[#DCE5EE] bg-white px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-[#EFF8F2] text-[#168A45]">
                <Dumbbell className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold md:text-5xl">Who we are looking for</h2>
              <p className="mt-4 text-base leading-7 text-[#5B6470]">
                You do not need a huge audience. You do need a real sprint or speed routine, a clear
                goal, and enough comfort on camera to show how TrackSpeed works in practice.
              </p>
              <ul className="mt-7 space-y-3">
                {eligibility.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[#26303E]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#168A45]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-[#F4FAFD] text-[#5C8DB8]">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-bold md:text-5xl">Ongoing expectations</h2>
              <p className="mt-4 text-base leading-7 text-[#5B6470]">
                The goal is honest content that converts because it shows the product working. We
                want athletes who can show setup, running with the app, and why the result matters.
              </p>
              <ul className="mt-7 space-y-3">
                {ongoingRequirements.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[#26303E]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5C8DB8]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-[#F4FAFD] px-6 py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <aside className="rounded-lg border border-[#DCE5EE] bg-white p-6 shadow-sm">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#0E0E0C] text-white">
                <Video className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Content sample</h2>
              <p className="mt-3 text-sm leading-6 text-[#5B6470]">
                Include a public or unlisted link to a short clip or post that shows how you would
                explain TrackSpeed. This should be practical, conversion-focused content showing
                the app in use, setup, a sprint, and the timing result.
              </p>
              <div className="mt-6 space-y-3 text-sm text-[#26303E]">
                {[
                  "Running with TrackSpeed",
                  "Fast phone setup",
                  "Clear timing result",
                  "Permission to use the video as an ad",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#168A45]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </aside>

            <div id="apply" className="rounded-lg border border-[#DCE5EE] bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-7">
                <h2 className="text-3xl font-bold">Apply to join</h2>
                <p className="mt-3 text-sm leading-6 text-[#5B6470]">
                  Approved ambassadors receive a dashboard login for referral tracking and payouts.
                  Your password is used only for that portal.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="apply-name" label="Your name *">
                    <input
                      id="apply-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className={inputClass}
                      placeholder="Your name"
                      required
                      autoComplete="name"
                    />
                  </Field>
                  <Field id="apply-location" label="City, Country *">
                    <input
                      id="apply-location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className={inputClass}
                      placeholder="Oslo, Norway"
                      required
                      autoComplete="address-level2"
                    />
                  </Field>
                  <Field id="apply-email" label="Email *">
                    <input
                      id="apply-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={inputClass}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      spellCheck={false}
                    />
                  </Field>
                  <Field id="apply-phone" label="Phone">
                    <input
                      id="apply-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={inputClass}
                      placeholder="+1 (555) 000-0000"
                      autoComplete="tel"
                    />
                  </Field>
                  <Field id="apply-tiktok" label="TikTok">
                    <input
                      id="apply-tiktok"
                      type="text"
                      value={formData.tiktok}
                      onChange={(e) => updateField("tiktok", e.target.value)}
                      className={inputClass}
                      placeholder="@yourtiktok"
                      spellCheck={false}
                    />
                  </Field>
                  <Field id="apply-instagram" label="Instagram">
                    <input
                      id="apply-instagram"
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => updateField("instagram", e.target.value)}
                      className={inputClass}
                      placeholder="@yourinstagram"
                      spellCheck={false}
                    />
                  </Field>
                  <Field id="apply-primary-sport" label="Primary sport/event *">
                    <input
                      id="apply-primary-sport"
                      type="text"
                      value={formData.primarySport}
                      onChange={(e) => updateField("primarySport", e.target.value)}
                      className={inputClass}
                      placeholder="100m, football, hurdles..."
                      required
                    />
                  </Field>
                  <Field id="apply-training-frequency" label="Training frequency *">
                    <select
                      id="apply-training-frequency"
                      value={formData.trainingFrequency}
                      onChange={(e) => updateField("trainingFrequency", e.target.value)}
                      className={inputClass}
                      required
                    >
                      <option value="">Select frequency</option>
                      <option value="3 sessions per week">3 sessions per week</option>
                      <option value="4-5 sessions per week">4-5 sessions per week</option>
                      <option value="6+ sessions per week">6+ sessions per week</option>
                    </select>
                  </Field>
                  <Field id="apply-athletic-goal" label="Athletic goal *">
                    <input
                      id="apply-athletic-goal"
                      type="text"
                      value={formData.athleticGoal}
                      onChange={(e) => updateField("athleticGoal", e.target.value)}
                      className={inputClass}
                      placeholder="Run sub-11, make nationals..."
                      required
                    />
                  </Field>
                  <Field id="apply-audience-size" label="Audience size">
                    <select
                      id="apply-audience-size"
                      value={formData.audienceSize}
                      onChange={(e) => updateField("audienceSize", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select range</option>
                      <option value="Under 1,000">Under 1,000</option>
                      <option value="1,000-5,000">1,000-5,000</option>
                      <option value="5,000-25,000">5,000-25,000</option>
                      <option value="25,000+">25,000+</option>
                    </select>
                  </Field>
                  <Field id="apply-video-url" label="Content sample link *">
                    <input
                      id="apply-video-url"
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => updateField("videoUrl", e.target.value)}
                      className={inputClass}
                      placeholder="https://www.tiktok.com/@.../video/..."
                      required
                      spellCheck={false}
                    />
                  </Field>
                  <Field id="apply-password" label="Portal password *">
                    <input
                      id="apply-password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className={inputClass}
                      placeholder="Min 8 characters"
                      minLength={8}
                      required
                      autoComplete="new-password"
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field id="apply-note" label="What makes you a strong ambassador? *">
                    <textarea
                      id="apply-note"
                      value={formData.applicationNote}
                      onChange={(e) => updateField("applicationNote", e.target.value)}
                      className={`${inputClass} min-h-36 resize-y`}
                      placeholder="Share your training story, content style, past results, how you would show TrackSpeed setup/use, or why your review would be credible..."
                      required
                    />
                  </Field>
                </div>

                <label className="mt-4 flex gap-3 rounded-lg border border-[#DCE5EE] bg-[#F8FBFD] p-4">
                  <input
                    type="checkbox"
                    checked={formData.adUsageConsent}
                    onChange={(e) => updateField("adUsageConsent", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#B8C8D8] text-[#5C8DB8] focus:ring-[#5C8DB8]"
                    required
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#26303E]">
                      Ad usage permission *
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-[#5B6470]">
                      I agree that TrackSpeed may use my approved videos and public review in ads,
                      social posts, and marketing.
                    </span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E0E0C] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#26303E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? "Submitting..." : "Submit application"}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </button>

                <p className="mt-5 text-sm text-[#5B6470]">
                  Already approved?{" "}
                  <Link href="/influencer/login" className="font-semibold text-[#5C8DB8] hover:underline">
                    Sign in to your dashboard
                  </Link>
                </p>
              </form>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-7xl text-xs leading-5 text-[#5B6470]">
            ** Commission is calculated from net revenue received by TrackSpeed after App Store and
            platform fees, taxes, refunds, chargebacks, and other payment deductions.
          </p>
        </section>
      </main>
    </div>
  )
}
