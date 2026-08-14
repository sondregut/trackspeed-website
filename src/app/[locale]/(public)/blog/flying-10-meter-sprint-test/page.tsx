import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPageMetadata } from "@/i18n/metadata";
import { ArticleByline } from "@/components/ArticleByline";
import RelatedPosts from "@/components/RelatedPosts";
import { DownloadLink } from "@/components/DownloadLink";

const slug = "flying-10-meter-sprint-test";
const title = "Flying 10-Meter Sprint Test: Setup, Timing, and Protocol";
const description =
  "Run a repeatable flying 10m sprint test with a clear setup, full-recovery protocol, automatic timing guidance, and practical result tracking.";

export async function generateMetadata() {
  return getPageMetadata({
    title,
    description,
    path: "/blog/" + slug,
    type: "article",
    localized: false,
  });
}

const faqItems = [
  {
    question: "What is a good flying 10-meter time?",
    answer:
      "There is no single useful benchmark for every age, sex, sport, surface, and setup. Establish a baseline with the same protocol, then compare the athlete with their own repeated results or with a properly matched team group.",
  },
  {
    question: "How long should the run-in be for a flying 10?",
    answer:
      "Twenty to thirty meters is a practical starting range for many trained athletes, but the distance should be long enough to reach upright maximum-velocity mechanics without creating unnecessary fatigue. Coaches should adapt it to the athlete and keep it unchanged between tests.",
  },
  {
    question: "How many flying 10 reps should an athlete run?",
    answer:
      "Three or four high-quality timed reps with full recovery is a practical testing session. Stop when mechanics or times clearly deteriorate; extra fatigued reps do not improve a maximum-velocity test.",
  },
  {
    question: "Can I time a flying 10 with a stopwatch?",
    answer:
      "You can, but manual button reaction adds variability at both boundaries of a very short interval. If you use hand timing, keep the same timer and method and do not compare those results directly with automatic or fully automatic timing.",
  },
];

export default async function FlyingTenMeterSprintTestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: "https://mytrackspeed.com/og-image-2026-06.png",
    author: {
      "@type": "Person",
      name: "Sondre Guttormsen",
      url: "https://mytrackspeed.com/about",
      jobTitle: "Founder, TrackSpeed",
    },
    publisher: {
      "@type": "Organization",
      name: "TrackSpeed",
      url: "https://mytrackspeed.com",
      logo: "https://mytrackspeed.com/trackspeed-icon-1d43ec40.png",
    },
    datePublished: "2026-08-09",
    dateModified: "2026-08-09",
    mainEntityOfPage: "https://mytrackspeed.com/blog/" + slug,
    keywords: [
      "flying 10 meter sprint test",
      "flying 10 timing",
      "maximum velocity test",
      "sprint timing app",
      "flying sprint protocol",
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://mytrackspeed.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://mytrackspeed.com/blog",
      },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="bg-hero min-h-screen">
      {[articleJsonLd, breadcrumbJsonLd, faqJsonLd].map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <span aria-hidden="true">←</span> Back to blog
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(92, 141, 184, 0.1)",
                color: "#5C8DB8",
              }}
            >
              Guides
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              7 min read
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>
          <ArticleByline slug={slug} />
          <p className="text-lg md:text-xl" style={{ color: "var(--text-muted)" }}>
            Measure maximum velocity with a short timed zone, a controlled
            run-in, and a protocol you can reproduce next week.
          </p>
        </div>
      </section>

      <article className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {locale !== "en" && (
            <div
              className="mb-6 p-3 rounded-lg text-sm"
              style={{
                background: "var(--bg-mint)",
                border: "1px solid var(--border-light)",
                color: "var(--text-muted)",
              }}
            >
              {t("englishOnly")}
            </div>
          )}

          <section className="mb-14">
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-5">
                A flying 10-meter test measures the athlete over a 10-meter
                zone after acceleration. Unlike a 10-meter start test, it
                removes most of the block or first-step component and focuses
                on upright maximum-velocity sprinting.
              </p>
              <p className="text-body">
                The distance is short, so setup differences can easily become
                larger than the performance change you are trying to measure.
                The goal is not merely to record a fast number. It is to create
                a test that means the same thing every time you run it.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Flying 10 Setup
            </h2>
            <div className="card-feature p-6 md:p-8">
              <ol className="space-y-4 text-body list-decimal pl-5">
                <li>
                  <strong>Acceleration zone:</strong> begin with 20–30 meters
                  as a practical range, then adjust for the athlete and keep it
                  fixed across testing days.
                </li>
                <li>
                  <strong>Timed zone:</strong> measure exactly 10 meters from
                  the first timing line to the second. Ten meters equals 10.94
                  yards, so do not substitute 10 yards.
                </li>
                <li>
                  <strong>Run-out:</strong> leave at least 20 meters after the
                  finish so the athlete can decelerate gradually.
                </li>
                <li>
                  <strong>Gate position:</strong> place each phone or timing
                  gate on a stable support, perpendicular to the lane, at the
                  same height and offset each session.
                </li>
              </ol>
              <div
                className="mt-7 rounded-xl p-5 text-center font-semibold"
                style={{ background: "var(--bg-mint)", color: "var(--text-primary)" }}
                aria-label="Flying 10 meter course layout"
              >
                Start → 20–30m build-up → | 10m timed zone | → 20m+ run-out
              </div>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              A Repeatable Testing Protocol
            </h2>
            <div className="card-feature p-6 md:p-8">
              <ol className="space-y-4 text-body list-decimal pl-5">
                <li>Complete a normal sprint warm-up and progressive build-ups.</li>
                <li>Use the same start point, lane, surface, footwear, and timing method.</li>
                <li>Run three or four high-quality timed reps.</li>
                <li>Take full recovery — four to six minutes is a practical starting point.</li>
                <li>Stop if mechanics or times clearly deteriorate.</li>
                <li>Record the best time and the median, plus wind and surface notes when relevant.</li>
              </ol>
              <p className="text-body mt-6">
                Treat this as a practical baseline, not a universal rule. A
                coach may change the build-up or recovery for age, training
                status, and the purpose of the session. Once selected, keep the
                testing version stable.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              How to Time It with TrackSpeed
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-5">
                Select <strong>Flying Start</strong>, then place one paired
                phone at the entrance to the timed zone and one at the exit.
                The first crossing starts the interval and the second stops it.
                The phones connect directly, so the setup does not depend on
                internet service at the track.
              </p>
              <ul className="space-y-3 text-body list-disc pl-5 mb-5">
                <li>Use a tripod or rigid support; do not hand-hold either phone.</li>
                <li>Keep the athlete&apos;s full crossing path clear in each camera view.</li>
                <li>Use the same camera side and lane direction during comparison sessions.</li>
                <li>Run a practice crossing before the first measured rep.</li>
              </ul>
              <p className="text-body">
                See the full{" "}
                <Link href="/blog/multi-phone-sprint-timing-setup" className="text-[#5C8DB8] hover:underline">
                  multi-phone setup guide
                </Link>{" "}
                for pairing and placement. TrackSpeed is designed for training
                feedback; official competition results still require the timing
                system specified by the governing body.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Convert Time to Speed
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-5">
                For a 10-meter segment, average speed is easy to calculate:
              </p>
              <ul className="space-y-3 text-body list-disc pl-5">
                <li><strong>Meters per second:</strong> 10 ÷ time in seconds</li>
                <li><strong>Kilometers per hour:</strong> 36 ÷ time in seconds</li>
                <li><strong>Miles per hour:</strong> 22.369 ÷ time in seconds</li>
              </ul>
              <p className="text-body mt-5">
                A 1.00-second flying 10 equals an average 10.0 m/s, 36.0 km/h,
                or about 22.4 mph across the zone. Report enough decimal places
                to preserve the measurement, but do not mistake extra decimals
                for certainty your setup does not provide.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              How to Interpret the Result
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-5">
                Start with the athlete&apos;s own baseline. A &quot;good&quot;
                flying 10 time changes with age, sex, sport, training history,
                surface, wind, run-in length, and measurement method. A number
                copied from a different protocol may be worse than no benchmark
                at all.
              </p>
              <p className="text-body mb-5">
                Compare repeated sessions only when the conditions are close.
                Look at the best rep, the middle result, and the spread between
                reps. A faster best with wildly inconsistent attempts may tell
                a different training story than a small improvement across all
                three.
              </p>
              <p className="text-body">
                Pair the flying 10 with an acceleration split when you need to
                distinguish maximum velocity from the ability to reach it. The{" "}
                <Link href="/blog/improve-sprint-speed-training" className="text-[#5C8DB8] hover:underline">
                  sprint drill guide
                </Link>{" "}
                explains how flying sprints fit alongside start and speed-endurance work.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Common Testing Errors
            </h2>
            <div className="card-feature p-6 md:p-8">
              <ul className="space-y-4 text-body list-disc pl-5">
                <li>Changing the run-in distance between athletes or sessions without recording it.</li>
                <li>Starting to decelerate at the second gate instead of sprinting through the line.</li>
                <li>Moving the camera, changing its side, or using an unstable support.</li>
                <li>Running too many reps after performance has already dropped.</li>
                <li>Comparing hand times with automatic times as if they were the same system.</li>
                <li>Calling a training time an official race result.</li>
              </ul>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              Flying 10 FAQ
            </h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="card-feature p-6">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    {item.question}
                  </h3>
                  <p className="text-body">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <div className="card-feature p-8 md:p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                Time the Same Test Every Session
              </h2>
              <p className="text-body mb-6 max-w-xl mx-auto">
                TrackSpeed turns paired iPhones into automatic start and finish
                gates for flying sprints, split tests, and regular speed training.
              </p>
              <DownloadLink store="ios" className="inline-block hover:opacity-80 transition-opacity">
                <Image
                  src="/app-store-badge.svg"
                  alt="Download TrackSpeed on the App Store"
                  width={120}
                  height={40}
                  className="h-[40px] w-auto"
                />
              </DownloadLink>
            </div>
          </section>

          <RelatedPosts
            currentSlug={slug}
            t={(key) => t(key)}
            tHas={(key) => t.has(key)}
            locale={locale}
          />
        </div>
      </article>
    </div>
  );
}
