import Image from "next/image"
import { ArrowRight, Check, ExternalLink, Smartphone, Timer } from "lucide-react"
import { setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"

export default async function ProPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="bg-hero pt-28">
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5C8DB8]">
              TrackSpeed Pro
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-[#0E0E0C] md:text-6xl">
              Professional sprint timing on your phone.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5B6470]">
              Unlock multi-phone timing, unlimited history, athlete profiles,
              video export, and the complete Pro training workflow. Buy in the
              app or pay on the web and sign in with the same account.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/checkout/pro?plan=annual"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0E0E0C] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#26303E] active:scale-[0.99]"
              >
                Buy Pro on the web
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="trackspeed://subscribe"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#DCE5EE] bg-white px-6 text-sm font-semibold text-[#26303E] transition-colors hover:border-[#BFD2E2] active:scale-[0.99]"
              >
                Open app paywall
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-6">
              <a
                href="https://apps.apple.com/app/trackspeed/id6757509163"
                className="inline-block transition-opacity hover:opacity-80"
              >
                <Image
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={132}
                  height={44}
                  className="h-[44px] w-auto"
                />
              </a>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#DCE5EE] bg-white p-6 shadow-[0_18px_60px_-34px_rgba(14,24,35,0.5)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#5C8DB8]">
                  Annual Pro
                </p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-[#0E0E0C]">
                  $59.99
                </p>
                <p className="text-sm text-[#5B6470]">per year</p>
              </div>
              <div className="rounded-2xl bg-[#F4FAFD] p-4 text-[#5C8DB8]">
                <Timer className="h-7 w-7" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "Two-phone start and finish timing",
                "Unlimited sessions and saved history",
                "Athlete profiles and progress tracking",
                "Video export for review and sharing",
              ].map((feature) => (
                <div key={feature} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5C8DB8]" aria-hidden="true" />
                  <p className="text-sm leading-6 text-[#26303E]">{feature}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-[#F7FAFC] p-4">
              <div className="flex gap-3">
                <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-[#5C8DB8]" aria-hidden="true" />
                <p className="text-sm leading-6 text-[#5B6470]">
                  Web checkout creates a TrackSpeed account first. After payment,
                  download the app and sign in with the same email and password.
                </p>
              </div>
            </div>

            <Link
              href="/checkout/pro?plan=annual"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#5C8DB8] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#4a7da8] active:scale-[0.99]"
            >
              Continue to web checkout
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
