import type { Metadata } from "next"
import { Clock3, Smartphone, Timer } from "lucide-react"
import { setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import ProCheckoutForm from "@/components/checkout/ProCheckoutForm"
import {
  getRevenueCatWebCheckoutConfigIssues,
  normalizeProCheckoutPlan,
  type ProCheckoutPlan,
} from "@/lib/revenuecat-web"

export const metadata: Metadata = {
  title: "TrackSpeed Pro Web Checkout",
  description: "Create a TrackSpeed account, pay for Pro on the web, then unlock Pro in the mobile app.",
}

export default async function CheckoutProPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ plan?: string }>
}) {
  const { locale } = await params
  const { plan } = await searchParams
  const initialPlan = normalizeProCheckoutPlan(plan)
  const availablePlans: Record<ProCheckoutPlan, boolean> = {
    annual: getRevenueCatWebCheckoutConfigIssues("annual").length === 0,
    weekly: getRevenueCatWebCheckoutConfigIssues("weekly").length === 0,
  }
  setRequestLocale(locale)

  return (
    <div className="min-w-0 bg-hero pt-24 sm:pt-28">
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl min-w-0 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="min-w-0 pt-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5C8DB8]">
              TrackSpeed Pro
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#0E0E0C] sm:text-4xl md:text-6xl">
              Pay on the web. Time sprints in the app.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5B6470] sm:text-lg sm:leading-8">
              Create or sign into a TrackSpeed account, complete payment through
              RevenueCat and Stripe, then download the app and use the same credentials
              to unlock Pro.
            </p>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Timer,
                  label: "Multi-phone timing",
                },
                {
                  icon: Clock3,
                  label: "Unlimited sessions",
                },
                {
                  icon: Smartphone,
                  label: "App unlock included",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-0 rounded-2xl border border-[#E6EAF0] bg-white/80 px-4 py-4"
                >
                  <item.icon className="h-5 w-5 text-[#5C8DB8]" aria-hidden="true" />
                  <p className="mt-3 text-sm font-semibold leading-5 text-[#26303E]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-[#697483]">
              Prefer the App Store flow?{" "}
              <Link href="/pro" className="font-semibold text-[#5C8DB8] hover:underline">
                Open the app paywall instead.
              </Link>
            </p>
          </div>

          <div className="min-w-0 lg:sticky lg:top-28">
            <ProCheckoutForm initialPlan={initialPlan} availablePlans={availablePlans} />
          </div>
        </div>
      </section>
    </div>
  )
}
