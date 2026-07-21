import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { getPageMetadata } from "@/i18n/metadata"
import CreatorRewardClaimForm from "@/components/CreatorRewardClaimForm"

export function generateMetadata(): Metadata {
  return getPageMetadata({
    title: "Creator Reward Program",
    description: "Post about Track Speed, submit your TikTok or Instagram Reel, and get rewarded after manual approval.",
    path: "/creator-reward",
    localized: false,
  })
}

export default async function CreatorRewardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  const query = await searchParams
  setRequestLocale(locale)

  const appUserId =
    typeof query.account === "string"
      ? query.account
      : typeof query.rc_app_user_id === "string"
        ? query.rc_app_user_id
        : ""
  const email = typeof query.email === "string" ? query.email : ""
  const username = typeof query.name === "string" ? query.name : ""

  return (
    <div className="bg-white pt-24 pb-16">
      <section className="px-6">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Creator Reward Program
            </h1>
            <p className="mt-5 text-xl leading-8 text-text-secondary">
              Post about Track Speed. Submit your link. Get rewarded.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted">
              Post an honest TikTok or Instagram Reel about Track Speed. If your post meets the requirements,
              we&apos;ll send you a cash reward equal to 50% of your purchase. If your post reaches 20,000+
              views, we&apos;ll reimburse 100%.
            </p>
            <div className="mt-6 rounded-xl border border-[#5C8DB8]/25 bg-[#F4FAFD] p-4 text-sm leading-6 text-text-secondary">
              <strong className="text-foreground">Important:</strong> This is not an App Store refund. Apple refunds are
              handled separately by Apple. This is a manual creator reward paid externally after approval.
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 px-6">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Rules</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted">
              <li>One reward per user.</li>
              <li>Post must be public.</li>
              <li>Post must show or mention Track Speed.</li>
              <li>Post should show the app being used for sprint timing, flying sprints, starts, acceleration, or team testing.</li>
              <li>Post must stay live for at least 14 days.</li>
              <li>Reward is not based on saying something positive.</li>
              <li>Fake views, spam, misleading claims, or deleted posts are not eligible.</li>
              <li>Reward approval is manual.</li>
              <li>We may change or end the program at any time.</li>
            </ul>
          </div>

          <div className="grid gap-4 self-start sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-muted">Valid post</p>
              <p className="mt-2 text-3xl font-bold text-foreground">50%</p>
              <p className="mt-2 text-sm text-muted">Get 50% of your purchase back as a cash reward.</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-muted">20,000+ views</p>
              <p className="mt-2 text-3xl font-bold text-foreground">100%</p>
              <p className="mt-2 text-sm text-muted">Get 100% of your purchase back as a cash reward.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 px-6">
        <div className="mx-auto max-w-5xl">
          <CreatorRewardClaimForm
            initialAppUserId={appUserId}
            initialEmail={email}
            initialUsername={username}
          />
        </div>
      </section>
    </div>
  )
}
