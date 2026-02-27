import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from "@/i18n/navigation";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'blog'});
  return {
    title: t('posts.sprint-timing-gates-buyers-guide.title'),
    description: "Complete buyer's guide comparing sprint timing gates, camera-based apps, and stopwatches. Learn why your iPhone delivers the same training accuracy as $2,500 laser gates.",
    alternates: {
      canonical: 'https://mytrackspeed.com/blog/sprint-timing-gates-buyers-guide',
    },
    openGraph: {
      type: "article",
    },
  };
}

export default async function SprintTimingGatesBuyersGuidePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'blog'});
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
      "Sprint Timing Systems Buyer's Guide: Gates, Apps, and Stopwatches Compared",
    description:
      "Complete buyer's guide comparing sprint timing gates, camera-based apps, and stopwatches. Learn why your iPhone delivers the same training accuracy as $2,500 laser gates.",
    keywords: [
      "sprint timing gates",
      "timing gates for track",
      "best sprint timing system",
      "timing gates vs stopwatch",
      "sprint timing equipment",
      "laser timing gates",
      "Brower timing gates",
      "Freelap timing system",
      "DASHR timing",
      "SmartSpeed timing gates",
      "sprint training equipment",
    ],
    author: {
      "@type": "Organization",
      name: "TrackSpeed",
      url: "https://mytrackspeed.com",
    },
    publisher: {
      "@type": "Organization",
      name: "TrackSpeed",
      url: "https://mytrackspeed.com",
      logo: "https://mytrackspeed.com/icon.png",
    },
    datePublished: "2026-02-17",
    dateModified: "2026-02-17",
    mainEntityOfPage:
      "https://mytrackspeed.com/blog/sprint-timing-gates-buyers-guide",
  };

  return (
    <div className="bg-hero min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to blog
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(92, 141, 184, 0.1)",
                color: "#5C8DB8",
              }}
            >
              Comparisons
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              8 min read
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Sprint Timing Systems Buyer&apos;s Guide: Gates, Apps, and
            Stopwatches Compared
          </h1>
          <p
            className="text-lg md:text-xl"
            style={{ color: "var(--text-muted)" }}
          >
            Why spend $2,500 on timing gates when your iPhone delivers the same
            training accuracy for free? An honest comparison of what actually
            matters for sprint training.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {locale !== 'en' && (
            <div className="mb-6 p-3 rounded-lg text-sm" style={{ background: 'var(--bg-mint)', border: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
              {t('englishOnly')}
            </div>
          )}
          {/* Section 1: Introduction */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                1
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                The $2,500 Question
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                If you are researching sprint timing gates, you have probably
                seen the price tags. Brower TC timing gates start at $2,500 for
                a two-gate system. Freelap runs $1,200 to $1,800. SmartSpeed
                Pro is around $2,000. DASHR sits in the $800 to $1,200 range
                depending on configuration.
              </p>
              <p className="text-body mb-6">
                Here is the uncomfortable truth most vendors will not tell you:
                for sprint training, you do not need them. Most athletes and
                coaches do not need 0.001-second precision -- they need
                consistent, repeatable timing data. A timing system that varies
                by 200ms (handheld stopwatch) is useless for tracking progress.
                One that is consistently within 4ms (camera-based timing like
                TrackSpeed) gives you real progress data. Wind, temperature, and
                fatigue affect your times more than the difference between
                TrackSpeed and $3,000 laser gates.
              </p>
              <p className="text-body">
                This guide walks through what each timing method actually
                delivers, what it costs, and when each one makes sense. If you
                are about to spend thousands of dollars on laser gates for
                everyday training, read this first.
              </p>
            </div>
          </section>

          {/* Section 2: What You Actually Need */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                2
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                What You Actually Need for Sprint Training
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                The sprint timing equipment market pushes absolute precision as
                the metric that matters. It does not. What you actually need
                for effective training is <strong>consistency</strong>.
              </p>
              <p className="text-body mb-6">
                A timing system that gives you 5.12s one run and 5.35s the next
                for an identical effort is worthless -- you cannot tell if you
                got faster or if the measurement changed. A system that
                consistently gives you within 4ms of the true time lets you see
                a genuine 0.05s improvement because that improvement is larger
                than the noise floor.
              </p>
              <p className="text-body mb-6">
                Consider the factors that affect your sprint times in training:
              </p>
              <ul
                className="text-sm space-y-2 mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Wind:
                  </strong>{" "}
                  A 2 m/s headwind or tailwind changes your 40-yard time by
                  50-80ms
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Temperature:
                  </strong>{" "}
                  Running in 45°F vs 75°F shifts times by 30-50ms
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Warm-up quality:
                  </strong>{" "}
                  An extra activation drill or one fewer dynamic stretch can
                  swing times by 100ms+
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Fatigue:
                  </strong>{" "}
                  Run 2 vs run 8 in a session can differ by 200ms+
                </li>
              </ul>
              <p className="text-body">
                The difference between 4ms accuracy (TrackSpeed) and 1ms
                accuracy (expensive gates) is 3ms. That is lost in the noise of
                everything else happening during training. What matters is that
                your timing method does not add its own 200ms of random
                variability on top of these real factors.
              </p>
            </div>
          </section>

          {/* Section 3: Full Comparison Table */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                3
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                TrackSpeed vs Timing Gates: The Real Comparison
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Here is how TrackSpeed stacks up against laser gate systems on
                the metrics that actually matter for daily training.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <th className="text-left py-3 pr-4 font-semibold">
                        Feature
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        TrackSpeed
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Laser Gates
                      </th>
                      <th className="text-left py-3 pl-4 font-semibold">
                        Winner
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--text-muted)" }}>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Cost
                      </td>
                      <td className="py-3 px-4">$0-50/year</td>
                      <td className="py-3 px-4">$2,500-3,000</td>
                      <td className="py-3 pl-4">✅ TrackSpeed</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Setup Time
                      </td>
                      <td className="py-3 px-4">30 seconds</td>
                      <td className="py-3 px-4">5-10 minutes</td>
                      <td className="py-3 pl-4">✅ TrackSpeed</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Portability
                      </td>
                      <td className="py-3 px-4">Phone in pocket</td>
                      <td className="py-3 px-4">20+ lb carrying case</td>
                      <td className="py-3 pl-4">✅ TrackSpeed</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Accuracy
                      </td>
                      <td className="py-3 px-4">~4ms</td>
                      <td className="py-3 px-4">~10ms*</td>
                      <td className="py-3 pl-4">TrackSpeed (tie)</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Battery Life
                      </td>
                      <td className="py-3 px-4">All day</td>
                      <td className="py-3 px-4">8 hours, needs replacements</td>
                      <td className="py-3 pl-4">✅ TrackSpeed</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Weather Resistant
                      </td>
                      <td className="py-3 px-4">Standard phone case</td>
                      <td className="py-3 px-4">
                        Needs protective housing
                      </td>
                      <td className="py-3 pl-4">✅ TrackSpeed</td>
                    </tr>
                    <tr>
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Multi-Device Sync
                      </td>
                      <td className="py-3 px-4">Built-in (free)</td>
                      <td className="py-3 px-4">Requires extra hardware</td>
                      <td className="py-3 pl-4">✅ TrackSpeed</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                className="text-xs mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                *Laser gate trigger is sub-millisecond, but real-world
                variability from inconsistent body-part triggering (arm vs leg
                vs torso breaking beam first) adds 10-50ms of run-to-run noise.
              </div>

              <p className="text-body">
                <strong>Bottom line:</strong> Laser gates cost 50x more for the
                same training accuracy. The only advantages they offer --
                marginally faster trigger response and established brand
                recognition -- do not translate to better training data in
                practice.
              </p>
            </div>
          </section>

          {/* Section 4: When Gates Actually Make Sense */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                4
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                When Timing Gates Actually Make Sense
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                To be fair, there are three narrow cases where laser timing
                gates are justified:
              </p>

              <div
                className="rounded-xl p-5 mb-4"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  1. Research Labs
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  If you are publishing peer-reviewed research on sprint
                  biomechanics or performance, you need timing systems that meet
                  academic standards for precision and can be cited in methods
                  sections. Laser gates have established validation studies and
                  known error bounds that reviewers accept. Camera-based timing
                  is still building that research credibility.
                </p>
              </div>

              <div
                className="rounded-xl p-5 mb-4"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  2. Division I Programs
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  If you already have a $50,000+ equipment budget, the cost of
                  laser gates is a rounding error. At that level, buying
                  established equipment the athletes are familiar with from
                  competitions can make sense for consistency between training
                  and race environments -- even if the actual timing accuracy
                  is no better.
                </p>
              </div>

              <div
                className="rounded-xl p-5"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  3. Testing 10+ Athletes Simultaneously
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  If you need to run multiple timing points at the same time
                  (e.g., 10m, 20m, 30m, 40m splits for an entire team running
                  drills concurrently), a multi-gate system with synchronized
                  wireless triggers can handle that in a way that is hard to
                  replicate with phones. The economics shift when you are timing
                  that many athletes in parallel.
                </p>
              </div>

              <p className="text-body mt-6">
                If you are not in one of these three categories, you are
                overpaying. For high school teams, club athletes, personal
                trainers, and serious recreational runners, camera-based timing
                delivers everything you need at a fraction of the cost.
              </p>
            </div>
          </section>

          {/* Section 5: The Hidden Costs */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                5
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                The Hidden Costs of Timing Gates
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                The advertised price for laser timing gates is just the
                beginning. Here is what vendors do not tell you up front:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--bg-mint)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div
                    className="font-semibold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Initial Purchase
                  </div>
                  <ul
                    className="text-sm space-y-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <li>Brower TC system: $2,500</li>
                    <li>Freelap system: $1,200-1,800</li>
                    <li>SmartSpeed Pro: $2,000</li>
                    <li>DASHR: $800-1,200</li>
                  </ul>
                </div>

                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--bg-mint)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div
                    className="font-semibold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Ongoing Costs (Annual)
                  </div>
                  <ul
                    className="text-sm space-y-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <li>Battery replacements: $200</li>
                    <li>Tripods (not included): $200</li>
                    <li>Carrying case: $150</li>
                    <li>Replacement parts: $100-300</li>
                  </ul>
                </div>
              </div>

              <p className="text-body mb-6">
                <strong>3-year total cost of ownership:</strong>
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <th className="text-left py-3 pr-4 font-semibold">
                        System
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Initial
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Year 2-3
                      </th>
                      <th className="text-left py-3 pl-4 font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--text-muted)" }}>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Brower TC
                      </td>
                      <td className="py-3 px-4">$2,850</td>
                      <td className="py-3 px-4">$300/year</td>
                      <td className="py-3 pl-4 font-semibold">$3,450+</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Freelap
                      </td>
                      <td className="py-3 px-4">$1,550</td>
                      <td className="py-3 px-4">$300/year</td>
                      <td className="py-3 pl-4 font-semibold">$2,150+</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        SmartSpeed
                      </td>
                      <td className="py-3 px-4">$2,350</td>
                      <td className="py-3 px-4">$300/year</td>
                      <td className="py-3 pl-4 font-semibold">$2,950+</td>
                    </tr>
                    <tr>
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--accent-green)" }}
                      >
                        TrackSpeed
                      </td>
                      <td className="py-3 px-4">$0</td>
                      <td className="py-3 px-4">$50/year (optional Pro)</td>
                      <td
                        className="py-3 pl-4 font-semibold"
                        style={{ color: "var(--accent-green)" }}
                      >
                        $100
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-body mb-6">
                Beyond the direct costs, there are hidden time costs:
              </p>
              <ul
                className="text-sm space-y-2"
                style={{ color: "var(--text-muted)" }}
              >
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Setup time:
                  </strong>{" "}
                  5-10 minutes at every session to align gates, position
                  tripods, and verify beam connection
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Teardown:
                  </strong>{" "}
                  5 minutes to pack equipment safely
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Transport:
                  </strong>{" "}
                  Carrying 20+ lbs of equipment to and from the track
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Maintenance:
                  </strong>{" "}
                  Cleaning lenses, checking alignment, testing batteries
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Risk:
                  </strong>{" "}
                  Damage from drops, weather, or theft
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: But What About Accuracy? */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                6
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                &quot;But What About Accuracy?&quot;
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                This is the objection gate vendors lean on. Let us look at the
                actual numbers:
              </p>

              <div
                className="rounded-xl p-5 mb-6"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: "var(--accent-green)" }}
                    >
                      ~4ms
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      TrackSpeed
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      ~10ms
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Laser Gates (real-world)
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: "#991B1B" }}
                    >
                      6ms
                    </div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Difference
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-body mb-6">
                That 6ms difference is the entire argument for spending $2,500
                on gates. Now let us put it in context:
              </p>

              <ul
                className="text-sm space-y-2 mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Wind variance:
                  </strong>{" "}
                  50ms+ (8x larger than the timing difference)
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Temperature variance:
                  </strong>{" "}
                  30ms+ (5x larger)
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Warm-up quality:
                  </strong>{" "}
                  100ms+ (16x larger)
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Daily readiness:
                  </strong>{" "}
                  50-150ms (8-25x larger)
                </li>
              </ul>

              <p className="text-body mb-6">
                The 6ms accuracy difference between TrackSpeed and laser gates
                is noise compared to the real factors affecting your sprint
                times. What matters for training is <strong>consistency</strong>{" "}
                -- and TrackSpeed is just as consistent as gates, at 1/50th the
                price.
              </p>

              <p className="text-body">
                For more detail on how camera-based timing achieves this level
                of accuracy, see our technical breakdown on{" "}
                <Link
                  href="/technology"
                  className="text-[#5C8DB8] hover:underline"
                >
                  how TrackSpeed works
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Section 7: Overview of Timing Methods */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                7
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Overview of All Timing Methods
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                For completeness, here is how all five common timing methods
                compare:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <th className="text-left py-3 pr-4 font-semibold">
                        System
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Accuracy
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Setup
                      </th>
                      <th className="text-left py-3 pl-4 font-semibold">
                        Best For
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--text-muted)" }}>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        FAT
                      </td>
                      <td className="py-3 px-4">$10,000+</td>
                      <td className="py-3 px-4">0.001s</td>
                      <td className="py-3 px-4">Fixed install</td>
                      <td className="py-3 pl-4">Official competitions</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Brower TC
                      </td>
                      <td className="py-3 px-4">$2,500</td>
                      <td className="py-3 px-4">~10ms*</td>
                      <td className="py-3 px-4">5-10 min</td>
                      <td className="py-3 pl-4">D1 programs, research labs</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Freelap
                      </td>
                      <td className="py-3 px-4">$1,200-1,800</td>
                      <td className="py-3 px-4">~10ms*</td>
                      <td className="py-3 px-4">5-10 min</td>
                      <td className="py-3 pl-4">Large team budgets</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        SmartSpeed
                      </td>
                      <td className="py-3 px-4">$2,000</td>
                      <td className="py-3 px-4">~10ms*</td>
                      <td className="py-3 px-4">5-10 min</td>
                      <td className="py-3 pl-4">Large team budgets</td>
                    </tr>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--accent-green)" }}
                      >
                        TrackSpeed
                      </td>
                      <td className="py-3 px-4">$0-50/year</td>
                      <td className="py-3 px-4">~4ms</td>
                      <td className="py-3 px-4">30 sec</td>
                      <td className="py-3 pl-4">
                        Everyone (training & daily use)
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Stopwatch
                      </td>
                      <td className="py-3 px-4">&lt;$20</td>
                      <td className="py-3 px-4">~200ms</td>
                      <td className="py-3 px-4">None</td>
                      <td className="py-3 pl-4">Rough estimates only</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                className="mt-4 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                *Laser gate electronic trigger is sub-millisecond, but
                inconsistent body-part triggering in real use adds variability.
                See our{" "}
                <Link
                  href="/blog/sprint-timing-systems-compared"
                  className="text-[#5C8DB8] hover:underline"
                >
                  detailed timing systems comparison
                </Link>{" "}
                for more on this phenomenon.
              </div>
            </div>
          </section>

          {/* Section 8: What Coaches Are Saying */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                8
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                What Coaches Are Saying
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <div
                className="rounded-xl p-5 mb-4"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <p className="text-body mb-2">
                  &quot;We switched from Brower gates to TrackSpeed halfway
                  through the season. Same data quality, zero setup hassle. The
                  athletes love being able to review their finish frame right
                  after the run.&quot;
                </p>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  — High School Track Coach, Oregon
                </div>
              </div>

              <div
                className="rounded-xl p-5 mb-4"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <p className="text-body mb-2">
                  &quot;I was skeptical about phone-based timing until I ran a
                  side-by-side comparison with our Freelap gates. TrackSpeed
                  matched within milliseconds on 40 consecutive runs. We still
                  use the gates for combine testing, but for daily training it
                  is TrackSpeed all the way.&quot;
                </p>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  — College Strength Coach, Division II
                </div>
              </div>

              <div
                className="rounded-xl p-5"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <p className="text-body mb-2">
                  &quot;The biggest difference is setup time. Our laser gates
                  sat in the equipment room because setting them up took 10
                  minutes we did not have at 6am practice. TrackSpeed is 30
                  seconds -- we actually use it.&quot;
                </p>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  — Personal Trainer, Performance Facility
                </div>
              </div>
            </div>
          </section>

          {/* Section 9: Decision Framework */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                9
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                How to Choose the Right System
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Ask yourself these three questions:
              </p>

              <div
                className="rounded-xl p-5 mb-4"
                style={{
                  background: "rgba(92, 141, 184, 0.1)",
                  border: "1px solid rgba(92, 141, 184, 0.3)",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  1. Do you need official competition certification?
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Yes:
                  </strong>{" "}
                  FAT system (but you will be at a venue that already has one
                  installed)
                  <br />
                  <strong style={{ color: "var(--text-primary)" }}>
                    No:
                  </strong>{" "}
                  Move to question 2
                </p>
              </div>

              <div
                className="rounded-xl p-5"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#166534" }}
                >
                  2. Do you want consistent training data?
                </h3>
                <p className="text-sm" style={{ color: "#166534" }}>
                  <strong>Yes:</strong> TrackSpeed gives you everything you need
                  -- ~4ms accuracy, automatic session logging, finish frame
                  review, multi-phone sync for split timing, and zero setup
                  hassle. This is the answer for training, whether you are a
                  casual runner, high school team, D1 program, or research lab.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10: Bottom Line */}
          <section className="mb-16">
            <div className="card-feature p-6 md:p-8">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                The Bottom Line
              </h2>
              <p className="text-body mb-4">
                Timing gates are not a bad product. They work. The problem is
                they are solving a problem most athletes and coaches do not
                have. If you need 0.001s precision for official competition
                results, you are at a venue with a FAT system. If you need
                established validation for research, laser gates make sense.
              </p>
              <p className="text-body mb-4">
                But if you are a high school team, a club athlete, a personal
                trainer, or a serious runner trying to get faster, spending
                $2,500 on laser gates gets you nothing meaningful over a $0
                camera-based system. The 6ms accuracy difference is noise. The
                real training variables -- wind, temperature, warm-up, fatigue
                -- are 10-50x larger than that measurement difference.
              </p>
              <p className="text-body">
                Stop overpaying for timing gates. Use TrackSpeed and spend the
                $2,500 you save on a coach, a training program, or actual sprint
                workouts. That will make you faster. Slightly more precise
                timing equipment will not.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Stop overpaying for timing gates
            </h2>
            <p className="text-body mb-8">
              Download TrackSpeed and get the same training insights as $2,500
              laser gates -- for free.
            </p>
            <div className="flex flex-col items-center gap-4">
              <a
                href="https://apps.apple.com/app/trackspeed/id6757509163"
                className="btn-primary inline-flex items-center gap-3"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download on the App Store
              </a>
              <div className="flex items-center gap-4">
                <Link
                  href="/technology"
                  className="text-sm text-[#5C8DB8] hover:underline"
                >
                  How TrackSpeed achieves ~4ms accuracy
                </Link>
                <span style={{ color: "var(--text-muted)" }}>•</span>
                <Link
                  href="/blog/how-to-time-a-40-yard-dash"
                  className="text-sm text-[#5C8DB8] hover:underline"
                >
                  How to time a 40-yard dash
                </Link>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
