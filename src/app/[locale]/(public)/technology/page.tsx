import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { getPageMetadata } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { DownloadLink } from "@/components/DownloadLink";

const title = "How TrackSpeed Measures Sprint Times";
const description =
  "A transparent, non-proprietary guide to TrackSpeed's camera timing workflow, reviewable evidence, setup factors, and limits for sprint training.";

const faqItems = [
  {
    question: "How does TrackSpeed time a sprint?",
    answer:
      "You configure a timing line in the phone's camera view. TrackSpeed records an automatic crossing event at that line and uses the start and finish events to calculate elapsed time. With a measured distance, it can also show average speed.",
  },
  {
    question: "Why is reviewable crossing evidence useful?",
    answer:
      "It lets an athlete or coach check whether the view was blocked, the line was misplaced, or the detected event did not match the intended test. A visible event is easier to audit than an unexplained number.",
  },
  {
    question: "Does TrackSpeed work with more than one phone?",
    answer:
      "Yes. Multiple iPhones can cover start, split, and finish positions in one session. Keep every phone stable, correctly positioned, and on the same documented protocol.",
  },
  {
    question: "Is TrackSpeed official race timing?",
    answer:
      "No. TrackSpeed is designed for training, testing, and unofficial timing. Official results must use the timing system required by the relevant governing body and event rules.",
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getPageMetadata({
    title,
    description,
    path: "/technology",
    type: "article",
    localized: false,
    robots: locale === "en" ? undefined : { index: false, follow: true },
  });
}

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const techArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
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
    datePublished: "2026-02-01",
    dateModified: "2026-08-09",
    mainEntityOfPage: "https://mytrackspeed.com/technology",
    inLanguage: "en",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mytrackspeed.com" },
      { "@type": "ListItem", position: 2, name: title, item: "https://mytrackspeed.com/technology" },
    ],
  };

  return (
    <div className="bg-hero min-h-screen">
      {[techArticleJsonLd, breadcrumbJsonLd].map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <span aria-hidden="true">←</span> Back to TrackSpeed
          </Link>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-green">
            Measurement and validation
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: "var(--text-muted)" }}>
            The useful question is not how many decimal places a timer displays.
            It is whether the start and finish events are automatic, clearly
            defined, reviewable, and collected with a repeatable setup.
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
              This technical guide is currently available in English. This
              localized duplicate is excluded from indexing; the English page is canonical.
            </div>
          )}

          <section className="mb-14">
            <div className="card-feature p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                What TrackSpeed records
              </h2>
              <p className="text-body mb-5">
                TrackSpeed turns an iPhone camera into an automatic timing point
                for sprint training. The athlete or coach places a visible timing
                line in the camera view. When the configured crossing occurs, the
                app records the event and uses it with the session&apos;s start event
                to calculate elapsed time.
              </p>
              <p className="text-body">
                A measured distance and elapsed time can also produce average speed.
                That number is only as trustworthy as the course measurement and the
                start and finish definitions, so TrackSpeed treats setup as part of
                the test—not as a detail to ignore.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              Four parts of a trustworthy training time
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                ["1. A defined event", "The timing line and start mode say exactly what starts and stops the clock. A flying split and a movement start are different tests and should be labeled differently."],
                ["2. Automatic recording", "The app records the configured crossing without a coach pressing a stopwatch at the finish, removing that manual stop reaction from the workflow."],
                ["3. Reviewable evidence", "The finish evidence can be inspected after the rep. If the camera moved, the view was blocked, or the line was wrong, the result should be rejected rather than explained away."],
                ["4. A repeatable protocol", "Distance, start position, line placement, phone side and height, surface, footwear, recovery, and environmental conditions should remain documented and consistent."],
              ].map(([heading, copy]) => (
                <div key={heading} className="card-feature p-6">
                  <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{heading}</h3>
                  <p className="text-body">{copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              One phone or several timing points
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-5">
                A single-phone session supports solo training workflows. When a test
                needs separate start, split, and finish locations, additional iPhones
                can join the session and record events at those positions.
              </p>
              <p className="text-body">
                This is useful for acceleration splits and flying-speed zones because
                the test can preserve clearly marked locations instead of estimating
                the boundaries from a general running trace. The internal coordination
                method is proprietary; the athlete-facing rule is simple: confirm that
                every phone is connected, armed, stable, and showing the correct line
                before the rep.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Precision, accuracy, and validity are different
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-5">
                <strong>Precision</strong> describes how finely a system can place an
                event in time. <strong>Accuracy</strong> asks how close that event is to
                the intended reference. <strong>Validity</strong> asks whether the event
                actually represents the performance question being tested.
              </p>
              <p className="text-body mb-5">
                A sensor can have excellent internal resolution and still record the
                wrong body part, the wrong start event, or an incorrectly measured
                course. This is why TrackSpeed emphasizes automatic crossings,
                reviewable evidence, and a repeatable protocol together.
              </p>
              <p className="text-body">
                Device model, frame visibility, lighting, stable placement, thermal
                conditions, course measurement, and the athlete&apos;s path can all affect
                a training result. Treat any product accuracy figure as a claim tied
                to a defined test setup—not a guarantee for every recording.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              How the main timing categories differ
            </h2>
            <div className="card-feature overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <th className="p-4 font-semibold">Method</th>
                    <th className="p-4 font-semibold">Recorded event</th>
                    <th className="p-4 font-semibold">Best use</th>
                    <th className="p-4 font-semibold">Main caution</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--text-muted)" }}>
                  {[
                    ["Manual stopwatch", "A person's button press", "Simple group practice", "Start and stop reaction become part of the time"],
                    ["Photocell gate", "An object breaking one or more beams", "Dedicated training-gate workflow", "Gate height, limb triggers, alignment, and start method matter"],
                    ["Camera training timer", "A crossing visible at a configured line", "Reviewable automatic training times", "Framing, visibility, placement, and protocol matter"],
                    ["Photo-finish FAT", "Official start signal and finish-plane image", "Official stadium competition", "Specialized certified workflow and event rules"],
                  ].map(([method, event, use, caution]) => (
                    <tr key={method} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="p-4 font-semibold" style={{ color: "var(--text-primary)" }}>{method}</td>
                      <td className="p-4">{event}</td>
                      <td className="p-4">{use}</td>
                      <td className="p-4">{caution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-body mt-5">
              See the research-backed comparison in our{" "}
              <Link href="/blog/single-beam-vs-dual-beam-timing-gates" className="text-[#5C8DB8] hover:underline">
                single-beam vs dual-beam timing-gate guide
              </Link>
              .
            </p>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Validation boundary
            </h2>
            <div className="rounded-3xl border border-[#F2D79B] bg-[#FFF8E8] p-6 md:p-8">
              <p className="text-body mb-5">
                TrackSpeed is a training and testing tool. It is not certified Fully
                Automatic Timing equipment and does not replace the system required
                for an official meet result, record, qualifying mark, or ranking.
              </p>
              <p className="text-body">
                For training decisions, compare like with like: the same app version,
                device class where practical, distance, start mode, line positions,
                placement, surface, and recovery. If the method changes, start a new
                comparison series instead of mixing the datasets.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>
              TrackSpeed technology FAQ
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
                See the timing evidence on your own sprint
              </h2>
              <p className="text-body mb-6 max-w-xl mx-auto">
                Download TrackSpeed on iPhone, mark a measured course, keep the
                protocol fixed, and review every result that looks unusual.
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
              <div className="mt-6">
                <Link href="/blog/best-app-for-tracking-sprint-speed" className="text-[#5C8DB8] hover:underline">
                  Compare the best sprint speed apps for each training job
                </Link>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
