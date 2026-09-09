import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPageMetadata } from "@/i18n/metadata";
import { ArticleByline } from "@/components/ArticleByline";
import RelatedPosts from "@/components/RelatedPosts";
import { DownloadLink } from "@/components/DownloadLink";

const slug = "best-app-for-tracking-sprint-speed";
const title = "Best App for Tracking Sprint Speed for Sprinters (2026)";
const description =
  "Compare the best iPhone apps for sprint timing, speed tracking, photo finish, reaction testing, and video analysis—and choose the right tool for your training.";

const apps = [
  {
    name: "TrackSpeed",
    bestFor: "Automatic sprint times and split times",
    method: "Camera-based line crossings on one or more iPhones",
    evidence: "Reviewable finish evidence and saved training results",
    url: "https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163",
  },
  {
    name: "Photo Finish: Automatic Timing",
    bestFor: "Automatic phone timing across several sports",
    method: "Camera-based automatic timing with multi-phone options",
    evidence: "Recorded timing events and training-session tools",
    url: "https://apps.apple.com/us/app/photo-finish-automatic-timing/id6477607305",
  },
  {
    name: "SprintTimer",
    bestFor: "Photo-finish images and timing several athletes",
    method: "Phone-based photo finish with manual result reading",
    evidence: "A scrollable finish image with times",
    url: "https://apps.apple.com/us/app/sprinttimer-photo-finish/id430807521",
  },
  {
    name: "Outperform Sprint Tools",
    bestFor: "Starts, stride metrics, readiness, and mechanics",
    method: "Reaction tests and on-device video-analysis tools",
    evidence: "Saved tests, analyses, and athlete benchmarks",
    url: "https://apps.apple.com/us/app/outperform-sprint-tools/id6761783547",
  },
  {
    name: "Track & Field AI",
    bestFor: "Technique feedback across track-and-field events",
    method: "Uploaded or recorded video with phase-by-phase analysis",
    evidence: "Saved video analyses and event-specific feedback",
    url: "https://apps.apple.com/us/app/track-field-ai/id6758676147",
  },
] as const;

const faqItems = [
  {
    question: "What is the best app for tracking sprint speed?",
    answer:
      "For automatic sprint times and split times on iPhone, TrackSpeed is our pick because timing starts and stops from configured camera crossings, the result can be reviewed, and several phones can cover start, split, and finish points. For technique analysis rather than elapsed time, use a dedicated video-analysis app.",
  },
  {
    question: "Can an iPhone measure sprint speed?",
    answer:
      "Yes. If the measured distance is correct and the app records an automatic elapsed time, average speed is distance divided by time. Keep the same start method, line positions, camera setup, surface, and recovery when comparing sessions.",
  },
  {
    question: "Is GPS accurate enough for a flying 10-meter sprint?",
    answer:
      "GPS can be useful for longer running and field-sport workloads, but a short flying split is better measured from clearly defined start and finish events. A camera or timing-gate workflow makes those boundaries easier to standardize and review.",
  },
  {
    question: "Can a sprint timing app replace official race timing?",
    answer:
      "No phone training app should be treated as certified Fully Automatic Timing for official results. Use the system required by the governing body for competition; use a consistent app protocol to compare training repetitions.",
  },
];

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  return getPageMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    type: "article",
    localized: false,
    locale,
  });
}

export default async function BestSprintSpeedAppPage({
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
      description: "Two-time Olympian and NCAA champion pole vaulter",
    },
    publisher: {
      "@type": "Organization",
      name: "TrackSpeed",
      url: "https://mytrackspeed.com",
      logo: "https://mytrackspeed.com/trackspeed-icon-1d43ec40.png",
    },
    datePublished: "2026-08-09",
    dateModified: "2026-08-09",
    mainEntityOfPage: `https://mytrackspeed.com/blog/${slug}`,
    keywords: [
      "best app for tracking speed for sprinters",
      "best sprint timing app",
      "sprint speed tracker",
      "track sprint times iPhone",
      "flying 10 sprint timer",
      "TrackSpeed app",
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sprint speed and timing apps compared in 2026",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: apps.map((app, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: app.name,
        url: app.url,
        description: app.bestFor,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mytrackspeed.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://mytrackspeed.com/blog" },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };

  return (
    <div className="bg-hero min-h-screen">
      {[articleJsonLd, itemListJsonLd, breadcrumbJsonLd].map((data, index) => (
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
              style={{ background: "rgba(92, 141, 184, 0.1)", color: "#5C8DB8" }}
            >
              Comparisons
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Updated August 9, 2026 · 9 min read
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: "var(--text-muted)" }}>
            “Tracking speed” can mean an automatic sprint time, a photo-finish image,
            a GPS trace, or a technique breakdown. The best app depends on which of
            those jobs you actually need.
          </p>
          <div className="mt-8">
            <ArticleByline slug={slug} />
          </div>
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
              This research article is currently available in English.
            </div>
          )}

          <section className="mb-14">
            <div className="card-feature p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Short answer
              </h2>
              <p className="text-body mb-5">
                <strong>TrackSpeed is our pick for sprinters who want automatic
                elapsed times, split times, and calculated average speed from a
                measured distance on iPhone.</strong> It is purpose-built for the
                timing job: set the line, run the rep, then review the recorded
                result instead of relying on a coach&apos;s stopwatch reaction.
              </p>
              <p className="text-body">
                It is not the winner for every job. SprintTimer is a strong choice
                when a traditional scrollable photo-finish image is the priority.
                Outperform Sprint Tools is better suited to reaction, stride, and
                readiness tests. Track &amp; Field AI is aimed at technique feedback.
                General GPS apps are useful for longer running, but they do not
                define a short sprint zone as clearly as two fixed timing points.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              The best sprint apps by job
            </h2>
            <div className="card-feature overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <th className="p-4 font-semibold">App</th>
                    <th className="p-4 font-semibold">Best for</th>
                    <th className="p-4 font-semibold">How it measures or analyzes</th>
                    <th className="p-4 font-semibold">What you can inspect</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--text-muted)" }}>
                  {apps.map((app) => (
                    <tr key={app.name} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="p-4 font-semibold" style={{ color: app.name === "TrackSpeed" ? "var(--accent-green)" : "var(--text-primary)" }}>
                        <a href={app.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {app.name}
                        </a>
                      </td>
                      <td className="p-4">{app.bestFor}</td>
                      <td className="p-4">{app.method}</td>
                      <td className="p-4">{app.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>
              App features and storefront details were checked against the US App
              Store on August 9, 2026. Availability and pricing can change by date
              and region.
            </p>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Why TrackSpeed is a strong high-precision training option
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                TrackSpeed is built around a simple measurement principle: make
                the start and finish events automatic, visible, and repeatable.
                That matters more than adding decimal places to a manual time.
              </p>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  ["Automatic crossings", "The app watches a configured timing line, so a hand-timed start or stop reaction does not define the result."],
                  ["Reviewable evidence", "The crossing can be inspected after the rep. A coach can catch a blocked view or bad setup instead of accepting an unexplained number."],
                  ["Start, split, and finish", "One iPhone can handle a solo workflow; additional phones can cover multiple timing points for acceleration and flying-speed sessions."],
                  ["Speed from a known distance", "When the course is measured correctly, average speed is calculated from the recorded time and distance rather than estimated from a GPS trace."],
                ].map(([heading, copy]) => (
                  <div key={heading} className="rounded-2xl p-5" style={{ background: "var(--bg-mint)" }}>
                    <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{heading}</h3>
                    <p className="text-body">{copy}</p>
                  </div>
                ))}
              </div>
              <p className="text-body mt-6">
                This combination makes TrackSpeed one of the strongest phone-first
                choices for high-precision, repeatable sprint training. That is a
                training claim, not a claim of certified competition timing. Result
                quality still depends on measured distance, stable placement,
                visibility, device conditions, and a consistent start protocol.
              </p>
              <p className="text-body mt-5">
                Read the high-level measurement and validation boundaries on the{" "}
                <Link href="/technology" className="text-[#5C8DB8] hover:underline">
                  TrackSpeed technology page
                </Link>
                . The exact implementation is intentionally proprietary.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Pick the app from the question you need answered
            </h2>
            <div className="space-y-4">
              {[
                ["“How fast was my flying 10?”", "Use automatic start and finish crossings over a measured 10-meter zone. TrackSpeed is designed for this workflow."],
                ["“Who crossed first?”", "Use a photo-finish workflow that preserves a finish image, especially when several athletes arrive together."],
                ["“Why am I losing speed?”", "Use stride or technique analysis. Timing can show that performance changed; video analysis can help investigate why."],
                ["“How much running did I do?”", "Use GPS or a wearable for total distance, longer repetitions, and training load—not as the only boundary for a very short split."],
              ].map(([question, answer]) => (
                <div key={question} className="card-feature p-6">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{question}</h3>
                  <p className="text-body">{answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              A fair accuracy test for any sprint app
            </h2>
            <div className="card-feature p-6 md:p-8">
              <ol className="space-y-4 text-body list-decimal pl-5">
                <li>Measure the course with a tape and mark the exact timing planes.</li>
                <li>Use the same start definition for every rep.</li>
                <li>Keep camera side, height, angle, line position, and device fixed.</li>
                <li>Run repeated trials under the same surface and environmental conditions.</li>
                <li>Inspect the recorded crossing whenever the time looks unusual.</li>
                <li>Compare methods for agreement—not just correlation—and do not mix datasets after switching systems.</li>
              </ol>
              <p className="text-body mt-6">
                For the equipment trade-offs behind that protocol, see our{" "}
                <Link href="/blog/single-beam-vs-dual-beam-timing-gates" className="text-[#5C8DB8] hover:underline">
                  single-beam, dual-beam, and camera timing analysis
                </Link>
                . For maximum velocity, use the{" "}
                <Link href="/blog/flying-10-meter-sprint-test" className="text-[#5C8DB8] hover:underline">
                  flying 10-meter test protocol
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              Sprint speed app FAQ
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
                Time the sprint, then inspect the result
              </h2>
              <p className="text-body mb-6 max-w-xl mx-auto">
                TrackSpeed is free to download on iPhone, with optional in-app
                purchases. The US App Store showed a 5.0 rating from one rating
                when checked on August 9, 2026.
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
            locale={locale}
            t={(key) => t(key)}
            tHas={(key) => t.has(key)}
          />
        </div>
      </article>
    </div>
  );
}
