import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, CheckCircle2, Download, LogIn } from "lucide-react"
import { setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { getPageMetadata } from "@/i18n/metadata"

export const metadata: Metadata = getPageMetadata({
  title: "TrackSpeed Pro Ready",
  description: "Download TrackSpeed and sign in with the same account to unlock Pro.",
  path: "/checkout/success",
  localized: false,
  robots: { index: false, follow: false, nocache: true },
})

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-w-0 bg-hero pt-24 sm:pt-28">
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl min-w-0">
          <div className="min-w-0 rounded-[32px] border border-[#DCE5EE] bg-white p-6 shadow-[0_18px_60px_-34px_rgba(14,24,35,0.5)] md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F4FAFD] text-[#5C8DB8]">
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5C8DB8]">
                  Payment complete
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#0E0E0C] md:text-5xl">
                  Your Pro access is ready.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#5B6470]">
                  Download TrackSpeed, then sign in with the same email and password
                  you used on the website. The app will unlock Pro after the subscription
                  check refreshes.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#E6EAF0] bg-[#F7FAFC] p-5">
                    <Download className="h-5 w-5 text-[#5C8DB8]" aria-hidden="true" />
                    <h2 className="mt-3 text-base font-bold text-[#0E0E0C]">
                      Download the app
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#5B6470]">
                      Install TrackSpeed from the App Store, or open it if it is
                      already installed.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <a
                        href="https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163"
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
                      <a
                        href="trackspeed://open"
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-[#DCE5EE] px-4 text-sm font-semibold text-[#26303E] transition-colors hover:border-[#BFD2E2]"
                      >
                        Open app
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E6EAF0] bg-[#F7FAFC] p-5">
                    <LogIn className="h-5 w-5 text-[#5C8DB8]" aria-hidden="true" />
                    <h2 className="mt-3 text-base font-bold text-[#0E0E0C]">
                      Sign in inside TrackSpeed
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#5B6470]">
                      Use the same credentials from checkout. If you were already
                      signed into the app, open Settings and refresh purchases.
                    </p>
                    <Link
                      href="/support"
                      className="mt-4 inline-flex text-sm font-semibold text-[#5C8DB8] hover:underline"
                    >
                      Get help
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
