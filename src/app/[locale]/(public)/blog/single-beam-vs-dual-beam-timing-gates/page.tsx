import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPageMetadata } from "@/i18n/metadata";
import { ArticleByline } from "@/components/ArticleByline";
import RelatedPosts from "@/components/RelatedPosts";
import { DownloadLink } from "@/components/DownloadLink";

const slug = "single-beam-vs-dual-beam-timing-gates";
const title = "Single-Beam vs Dual-Beam Timing Gates for Sprinting";
const description =
  "Compare single-beam, dual-beam, transponder, camera, and official timing—and see why TrackSpeed is a precise, reviewable option for repeatable sprint training.";

const faqItems = [
  {
    question: "Are dual-beam timing gates more accurate than single-beam gates?",
    answer:
      "Dual-beam gates are less likely to trigger from a swinging hand or foot because both beams normally must be broken together. That reduces one important source of error, but gate height, start method, alignment, distance, and the rest of the protocol still affect the result.",
  },
  {
    question: "Why do two timing-gate systems give different sprint times?",
    answer:
      "They may detect different events. One system may react to the first limb that breaks a beam, another to two simultaneous beam breaks, another to a chip worn on the athlete, and another to a body crossing visible in a camera frame. Start triggers and gate placement can add further differences.",
  },
  {
    question: "Can I compare camera timing with laser-gate times?",
    answer:
      "Do not treat results from different systems as interchangeable unless you have validated the exact setups against each other. For training, keep one method and one protocol, then compare the athlete with results collected the same way.",
  },
  {
    question: "Is TrackSpeed an accurate alternative to sprint timing gates?",
    answer:
      "For repeatable training, TrackSpeed is designed as a high-precision camera-based option. It records an automatic crossing at a configured line, preserves evidence that can be reviewed, and supports start, split, and finish points across multiple phones. Keep the setup consistent; TrackSpeed is a training system, not certified official photo-finish timing.",
  },
  {
    question: "Which timing system should I use for official race results?",
    answer:
      "Use the system required by the governing body and event. Under the 2026 World Athletics Technical Rules, fully automatic photo-finish timing is the recognized automatic method for stadium track races; ordinary training gates and phone timing are not substitutes for official competition timing.",
  },
];

const sourceLinks = [
  "https://doi.org/10.1016/j.footst.2026.100045",
  "https://journals.sagepub.com/doi/10.1177/17543371231203440",
  "https://pubmed.ncbi.nlm.nih.gov/24531428/",
  "https://pubmed.ncbi.nlm.nih.gov/28277431/",
  "https://worldathletics.org/about-iaaf/documents/book-of-rules",
  "https://training.microgate.it/en/products/witty",
  "https://freelap.com/documentation-and-support/get-started/understanding-the-components/",
];

export async function generateMetadata() {
  return getPageMetadata({
    title,
    description,
    path: "/blog/" + slug,
    type: "article",
    localized: false,
  });
}

export default async function TimingGateAnalysisPage({
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
    mainEntityOfPage: "https://mytrackspeed.com/blog/" + slug,
    keywords: [
      "single beam vs dual beam timing gates",
      "sprint timing gates",
      "speed gates",
      "photocell timing",
      "sprint testing protocol",
      "camera sprint timing",
      "TrackSpeed timing app",
    ],
    citation: sourceLinks,
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
              Technology
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              10 min read
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
            A speed gate does not measure an abstract “true time.” It records a
            specific trigger. Understand that trigger and your sprint data
            becomes much easier to trust.
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
                Coaches often call every automatic sprint timer a timing gate or
                speed gate. The label hides an important difference: systems do
                not all start and stop the clock from the same physical event.
                A single infrared beam can be broken by a hand. A dual-beam gate
                waits for two beams. A transponder records the chip worn by the
                athlete. A camera identifies a crossing in an image. Fully
                automatic competition timing uses a start signal and a
                photo-finish image.
              </p>
              <p className="text-body">
                Those are not interchangeable definitions. The useful question
                is therefore not only “How many decimals does it show?” It is:
                <strong> what event caused this time to be recorded?</strong>
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              The Five Main Timing Methods
            </h2>
            <div className="card-feature overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <th className="p-4 font-semibold">System</th>
                    <th className="p-4 font-semibold">What triggers it</th>
                    <th className="p-4 font-semibold">Main strength</th>
                    <th className="p-4 font-semibold">Main caution</th>
                  </tr>
                </thead>
                <tbody style={{ color: "var(--text-muted)" }}>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td className="p-4 font-medium" style={{ color: "var(--text-primary)" }}>Single-beam photocell</td>
                    <td className="p-4">First object that breaks one beam</td>
                    <td className="p-4">Simple, fast setup</td>
                    <td className="p-4">A hand, knee, or foot can trigger early</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td className="p-4 font-medium" style={{ color: "var(--text-primary)" }}>Dual-beam photocell</td>
                    <td className="p-4">Two beams broken together</td>
                    <td className="p-4">Reduces isolated limb triggers</td>
                    <td className="p-4">Height and start protocol still matter</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td className="p-4 font-medium" style={{ color: "var(--text-primary)" }}>Transponder / radio</td>
                    <td className="p-4">A worn chip entering a transmitter field</td>
                    <td className="p-4">High-throughput multi-athlete sessions</td>
                    <td className="p-4">Measures chip position, not the torso plane</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td className="p-4 font-medium" style={{ color: "var(--text-primary)" }}>Camera-based training timer</td>
                    <td className="p-4">A visible line crossing in video frames</td>
                    <td className="p-4">Reviewable event and accessible hardware</td>
                    <td className="p-4">Camera placement and event definition must stay fixed</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium" style={{ color: "var(--text-primary)" }}>Photo-finish FAT</td>
                    <td className="p-4">Start device plus torso at the finish plane</td>
                    <td className="p-4">Official competition result</td>
                    <td className="p-4">A different purpose and workflow from training gates</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Single-Beam Gates: Useful, but Protocol-Sensitive
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-5">
                A single-beam gate sends one infrared line across the lane. The
                first body part to interrupt it creates the event. The hardware
                can timestamp that interruption very precisely while the
                interruption itself is not the body landmark the coach intended.
                That distinction is why resolution and measurement validity are
                not the same thing.
              </p>
              <p className="text-body mb-5">
                A 2014 study found differences between single- and dual-beam
                systems ranging from about −0.05 to +0.06 seconds over the
                acceleration split. A separate study found that single-beam
                results collected at different heights were not comparable,
                particularly over short splits.
              </p>
              <p className="text-body">
                The latest relevant study we found, published in 2026, adds a
                useful nuance. A standardized single-beam setup—with a 0.5-meter
                start distance and the first gate around 0.40 meters high—showed
                good reliability for 10- and 20-meter sprints in young male
                soccer players. It still showed systematic bias against the
                video reference, so the authors cautioned that the methods were
                not fully interchangeable. The lesson is not that single beam
                is “bad.” It is that a repeatable protocol can make it useful.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Dual-Beam Gates: Better Limb Rejection
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-5">
                A dual-beam gate places two beams vertically and requires both
                to be interrupted together. An isolated hand can break one beam
                without creating a time. Microgate describes this explicitly as
                a way to make the athlete&apos;s chest, rather than a moving arm,
                generate the signal.
              </p>
              <p className="text-body mb-5">
                That solves an important failure mode, not every failure mode.
                Two dual-beam systems can still disagree if their beams are at
                different heights, their start triggers differ, one lane is
                misaligned, or athletes begin at different distances behind the
                first gate.
              </p>
              <p className="text-body">
                Choose dual beam when short-split measurement quality matters
                enough to justify the extra equipment. Then document the full
                setup instead of writing only “electronic gates” in the test log.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Transponder and Camera Systems Measure Different Things
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card-feature p-6">
                <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  Transponder timing
                </h3>
                <p className="text-body">
                  Systems such as Freelap place transmitters along the course
                  and a transponder on the athlete. The chip detects each marker
                  and sends the intervals to an app or relay. This is excellent
                  for flow and athlete identification, but chip placement is
                  part of the measurement definition.
                </p>
              </div>
              <div className="card-feature p-6">
                <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  Camera timing
                </h3>
                <p className="text-body">
                  A camera system records a visible crossing. That makes the
                  event reviewable and avoids a physical beam across the lane.
                  The coach must still standardize camera side, height, angle,
                  line position, body-crossing rule, and start mode.
                </p>
              </div>
            </div>
            <p className="text-body mt-5">
              A 2025 comparison reported strong reliability and correlation
              across single-beam, dual-beam, and video-app methods, yet its
              agreement analysis still led the authors to recommend identical
              systems and setups for interpretation. High correlation does not
              make two methods interchangeable.
            </p>
          </section>

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Why TrackSpeed Is a Strong High-Precision Phone Timing Option
            </h2>
            <div className="card-feature p-6 md:p-8 mb-5">
              <p className="text-body mb-5">
                For athletes and coaches who want automatic timing without
                dedicated gate hardware, TrackSpeed is designed to be one of the
                strongest high-precision options available on iPhone. Its
                advantage is not simply displaying more decimal places. The app
                is built to make the timing event automatic, inspectable, and
                repeatable.
              </p>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    Automatic line crossing
                  </h3>
                  <p className="text-body">
                    TrackSpeed records the configured crossing automatically. A
                    coach&apos;s reaction to pressing a stopwatch does not define the
                    finish event.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    Measured course, recorded time
                  </h3>
                  <p className="text-body">
                    With correctly measured line positions, elapsed time and
                    distance produce a transparent average-speed result. Keep
                    those positions fixed between sessions.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    Reviewable evidence
                  </h3>
                  <p className="text-body">
                    A crossing thumbnail and its surrounding frame evidence make
                    the detected event visible. Coaches can inspect what crossed
                    the line instead of trusting an unexplained number on a
                    display.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                    Multiple timing points
                  </h3>
                  <p className="text-body">
                    Additional phones can cover start, split, and finish points in
                    the same session. Confirm every phone is connected, armed,
                    stable, and showing the correct line before each rep.
                  </p>
                </div>
              </div>
              <p className="text-body mt-6">
                That makes TrackSpeed a particularly strong choice for
                repeatable sprint training, flying sprints, and split timing.
                It is not a replacement for official fully automatic
                photo-finish timing, and results should still be compared only
                with sessions using the same camera position, line, start mode,
                and protocol.
              </p>
              <p className="text-body mt-5">
                Read the measurement principles, setup factors, and validation
                boundaries on the{" "}
                <Link href="/technology" className="text-[#5C8DB8] hover:underline">
                  TrackSpeed technology page
                </Link>
                .
                {" "}The exact detection and coordination implementation remains
                proprietary.
              </p>
              <p className="text-body mt-5">
                If you are choosing between apps rather than gate types, see our{" "}
                <Link href="/blog/best-app-for-tracking-sprint-speed" className="text-[#5C8DB8] hover:underline">
                  2026 sprint speed app comparison
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              The Start Trigger Can Matter More Than the Gate Brand
            </h2>
            <div className="card-feature p-6 md:p-8">
              <ul className="space-y-4 text-body list-disc pl-5">
                <li>
                  <strong>Beam start:</strong> the clock begins only when the
                  athlete reaches and breaks the first gate. Any movement before
                  that point is excluded.
                </li>
                <li>
                  <strong>Movement or pad start:</strong> the clock begins when
                  the athlete leaves a pad or triggers a movement sensor.
                </li>
                <li>
                  <strong>Sound or light start:</strong> the clock begins from a
                  signal, so the result includes reaction time.
                </li>
                <li>
                  <strong>Flying start:</strong> the athlete is already running;
                  the first crossing starts only the timed zone.
                </li>
              </ul>
              <p className="text-body mt-6">
                Label these as different tests. A “10-meter sprint” from first
                movement is not the same test as 10 meters between two beam
                crossings, even if both displays say 10 m.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              A Practical Gate-Audit Checklist
            </h2>
            <div className="card-feature p-6 md:p-8">
              <ol className="space-y-4 text-body list-decimal pl-5">
                <li>Name the system type: single beam, dual beam, transponder, camera, or FAT.</li>
                <li>Write down exactly what starts and stops the clock.</li>
                <li>Measure the course with a tape; do not rely on cones or field markings.</li>
                <li>Record gate or camera height, side, lane offset, and direction.</li>
                <li>Fix the athlete&apos;s starting distance and stance.</li>
                <li>Use rigid tripods and confirm alignment with a practice crossing.</li>
                <li>Keep surface, footwear, warm-up, recovery, and environmental notes.</li>
                <li>Compare only with sessions using the same protocol.</li>
              </ol>
              <p className="text-body mt-6">
                For maximum-velocity testing, use this checklist with the{" "}
                <Link href="/blog/flying-10-meter-sprint-test" className="text-[#5C8DB8] hover:underline">
                  flying 10-meter protocol
                </Link>
                . If you are deciding what equipment to buy, continue with the{" "}
                <Link href="/blog/best-app-for-tracking-sprint-speed" className="text-[#5C8DB8] hover:underline">
                  sprint speed app comparison
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Training Time vs Official Time
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-5">
                World Athletics&apos; 2026 Technical Rules recognize hand timing,
                fully automatic photo-finish timing, and transponder timing only
                for specified non-stadium events. For stadium finishes, the
                official crossing is when the athlete&apos;s torso reaches the
                vertical plane of the finish line.
              </p>
              <p className="text-body">
                Training gates answer a different question: is this athlete
                faster under a repeatable practice protocol? They can be highly
                useful without being official race timing. Keep those labels
                honest and the data remains valuable.
              </p>
            </div>
          </section>

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Timing Gate FAQ
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

          <section className="mb-14">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Research and Technical Sources
            </h2>
            <div className="card-feature p-6 md:p-8">
              <ul className="space-y-4 text-body list-disc pl-5">
                <li>
                  <a href="https://doi.org/10.1016/j.footst.2026.100045" className="text-[#5C8DB8] hover:underline">
                    2026 single-beam sprint protocol validity and reliability study
                  </a>
                </li>
                <li>
                  <a href="https://journals.sagepub.com/doi/10.1177/17543371231203440" className="text-[#5C8DB8] hover:underline">
                    Single-beam, dual-beam, and video-app test–retest comparison
                  </a>
                </li>
                <li>
                  <a href="https://pubmed.ncbi.nlm.nih.gov/24531428/" className="text-[#5C8DB8] hover:underline">
                    Sprint time differences between single- and dual-beam systems
                  </a>
                </li>
                <li>
                  <a href="https://pubmed.ncbi.nlm.nih.gov/28277431/" className="text-[#5C8DB8] hover:underline">
                    Validity of single-beam timing lights at different heights
                  </a>
                </li>
                <li>
                  <a href="https://worldathletics.org/about-iaaf/documents/book-of-rules" className="text-[#5C8DB8] hover:underline">
                    World Athletics 2026 Competition and Technical Rules
                  </a>
                </li>
                <li>
                  Official system explanations from{" "}
                  <a href="https://training.microgate.it/en/products/witty" className="text-[#5C8DB8] hover:underline">Microgate</a>
                  {" "}and{" "}
                  <a href="https://freelap.com/documentation-and-support/get-started/understanding-the-components/" className="text-[#5C8DB8] hover:underline">Freelap</a>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-16">
            <div className="card-feature p-8 md:p-10 text-center">
              <h2
                className="text-2xl md:text-3xl font-bold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Make the Protocol Repeatable
              </h2>
              <p className="text-body mb-6 max-w-xl mx-auto">
                TrackSpeed turns paired iPhones into automatic camera-based
                training gates, with no dedicated timing hardware required.
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
