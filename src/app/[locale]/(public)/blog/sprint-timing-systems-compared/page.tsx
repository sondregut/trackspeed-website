import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from "@/i18n/navigation";
import GooglePlayIcon from "@/components/icons/GooglePlayIcon";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'blog'});
  return {
    title: t('posts.sprint-timing-systems-compared.title'),
    description: "An objective comparison of handheld stopwatches, laser gate systems, camera-based timing, and FAT systems. Find the best sprint timer for your training needs.",
    alternates: {
      canonical: 'https://mytrackspeed.com/blog/sprint-timing-systems-compared',
    },
    openGraph: {
      type: "article",
    },
  };
}

export default async function SprintTimingSystemsComparedPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'blog'});
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
      "Sprint Timing Systems Compared: Laser Gates vs Camera vs Stopwatch",
    description:
      "An objective comparison of handheld stopwatches, laser gate systems, camera-based timing, and FAT systems. Find the best sprint timer for your training needs.",
    keywords: [
      "sprint timing system comparison",
      "best sprint timer",
      "laser gate timing",
      "camera sprint timing",
      "stopwatch accuracy",
      "FAT timing system",
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
    datePublished: "2026-02-08",
    dateModified: "2026-02-17",
    mainEntityOfPage:
      "https://mytrackspeed.com/blog/sprint-timing-systems-compared",
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
              7 min read
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Sprint Timing Systems Compared: Laser Gates vs Camera vs Stopwatch
          </h1>
          <p
            className="text-lg md:text-xl"
            style={{ color: "var(--text-muted)" }}
          >
            An honest look at four common sprint timing methods -- their real
            accuracy, cost, and tradeoffs -- so you can choose the right one for
            your training.
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
          {/* Section 1: Overview */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                1
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Why Your Timing Method Matters
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                If you are serious about getting faster, you need timing data
                you can trust. A personal record only means something if it was
                measured the same way every time. A tenth of a second of
                improvement is invisible if your timing method has half a second
                of variability built in.
              </p>
              <p className="text-body mb-6">
                Sprint coaches and athletes generally rely on one of four timing
                methods: handheld stopwatches, laser gate systems, camera-based
                timing apps, or fully automatic timing (FAT) systems. Each sits
                at a different point on the spectrum of accuracy, cost, and
                convenience.
              </p>
              <p className="text-body">
                This guide walks through each one objectively -- how it actually
                works, where the error comes from, and what it costs -- so you
                can make an informed decision. Whether you are a casual runner
                tracking 40-yard dash progress, a competitive sprinter peaking
                for a meet, or a coach timing an entire team at practice, there
                is a right tool for the job.
              </p>
            </div>
          </section>

          {/* Section 2: Handheld Stopwatch */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                2
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Handheld Stopwatch
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                How It Works
              </h3>
              <p className="text-body mb-6">
                Someone stands at the finish line, watches the start signal, and
                clicks a button when the runner crosses. The time between the two
                clicks is the result. It is the oldest and most intuitive method
                of timing a sprint.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Real-World Accuracy
              </h3>
              <p className="text-body mb-6">
                The stopwatch itself is precise to 0.01 seconds, but the human
                operating it is not. Research consistently shows that human
                reaction time adds 0.2 to 0.3 seconds of error on average --
                and that error is not consistent. One run you might react
                quickly; the next you might be distracted. The same timer
                measuring the same athlete on the same day can produce results
                that vary by 0.15 to 0.4 seconds.
              </p>
              <p className="text-body mb-6">
                There is also a well-documented tendency for timers to
                anticipate the finish, pressing the button slightly early. This
                means hand-timed results almost always appear faster than the
                athlete actually ran. That is why official hand times have a
                mandatory 0.24-second adjustment added before they can be
                compared to electronic times.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "#166534" }}
                  >
                    Advantages
                  </div>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: "#166534" }}
                  >
                    <li>Inexpensive -- under $20</li>
                    <li>No setup required</li>
                    <li>Works anywhere, any conditions</li>
                    <li>Everyone understands how to use one</li>
                  </ul>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "#FEE2E2",
                    border: "1px solid #FECACA",
                  }}
                >
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "#991B1B" }}
                  >
                    Drawbacks
                  </div>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: "#991B1B" }}
                  >
                    <li>0.2-0.3s human reaction time error</li>
                    <li>Run-to-run inconsistency</li>
                    <li>Anticipation bias (times appear faster)</li>
                    <li>No recorded data for later analysis</li>
                    <li>Different timers give different results</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Laser Gate Systems */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                3
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Laser Gate Systems
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                How It Works
              </h3>
              <p className="text-body mb-6">
                Laser gate systems (also called infrared timing gates) place a
                transmitter and receiver on opposite sides of the running lane.
                An invisible beam runs between them. When a runner breaks the
                beam, the system records a timestamp. Place one gate at the
                start and one at the finish, and the difference is your time.
                Popular systems include Freelap, DASHR, and Brower Timing.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Real-World Accuracy
              </h3>
              <p className="text-body mb-6">
                The electronic trigger itself is fast -- sub-millisecond
                response time. But there is a subtle consistency problem that
                many buyers do not expect. The beam breaks when the first body
                part crosses it, and that body part is rarely the chest.
                Depending on arm swing phase, running lean, and stride position
                at the moment of crossing, an outstretched hand, a leading knee,
                or a forward-leaning head might break the beam 50 to 200
                milliseconds before the torso arrives.
              </p>
              <p className="text-body mb-6">
                This means two runs that are physically identical in chest
                crossing time can produce different laser gate results depending
                on where the athlete&apos;s arms happened to be during the
                stride cycle. The system is automated, but it is not measuring
                what you think it is measuring. For an individual athlete
                tracking their own progress, this adds noise. For comparing
                times across different athletes with different running forms, it
                can be misleading.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Setup and Cost
              </h3>
              <p className="text-body mb-6">
                Most systems require setting up tripods or stakes at each timing
                point, aligning the beam, and ensuring nothing obstructs the
                path. A basic two-gate system costs $500 to $1,000. Multi-split
                setups with three or more gates run $1,500 to $2,000 or more.
                Gates need charged batteries, and wind or uneven ground can make
                alignment tedious during outdoor sessions.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "#166534" }}
                  >
                    Advantages
                  </div>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: "#166534" }}
                  >
                    <li>Eliminates human reaction time</li>
                    <li>Fully automated triggering</li>
                    <li>Multiple split points possible</li>
                    <li>Durable hardware for outdoor use</li>
                  </ul>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "#FEE2E2",
                    border: "1px solid #FECACA",
                  }}
                >
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "#991B1B" }}
                  >
                    Drawbacks
                  </div>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: "#991B1B" }}
                  >
                    <li>$500-$2,000 investment</li>
                    <li>50-200ms body part variation</li>
                    <li>First-break triggers on arm/leg, not chest</li>
                    <li>Setup and alignment time at each session</li>
                    <li>Equipment to transport and maintain</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Camera-Based Timing (TrackSpeed) */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                4
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Camera-Based Timing
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                How It Works
              </h3>
              <p className="text-body mb-6">
                Camera-based timing uses a phone&apos;s camera running at 30
                to 120 frames per second to detect when a runner crosses a
                virtual finish line in the video frame. Unlike laser gates that
                trigger on the first beam break, camera-based systems like
                TrackSpeed analyze the motion to identify the athlete&apos;s
                body mass and track its leading edge. Sub-frame interpolation
                then calculates the exact crossing moment between frames. For
                a deeper look at the computer vision and interpolation involved,
                see{" "}
                <Link
                  href="/technology"
                  className="text-[#5C8DB8] hover:underline"
                >
                  how TrackSpeed achieves ~4ms accuracy
                </Link>
                .
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Real-World Accuracy
              </h3>
              <p className="text-body mb-6">
                TrackSpeed uses trajectory regression across multiple frames to
                pinpoint the crossing moment to approximately 4 milliseconds.
                Because it tracks the body&apos;s center mass rather than
                triggering on the first thing that enters the frame, the trigger
                point is consistent regardless of arm position or stride phase.
                This is the same principle used in{" "}
                <Link
                  href="/blog/what-is-photo-finish-timing"
                  className="text-[#5C8DB8] hover:underline"
                >
                  official photo finish timing
                </Link>{" "}
                -- measure the torso, not the extremities.
              </p>
              <p className="text-body mb-6">
                For multi-phone setups (one phone at start, one at finish), an
                NTP-style clock sync protocol keeps the two devices aligned to
                within 3 to 5 milliseconds, preserving the sub-frame precision
                end to end.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Requirements
              </h3>
              <p className="text-body mb-6">
                You need a phone with a stable mount -- a tripod, a fence
                clip, or even a shoe wedged against a wall. The phone needs to
                remain still during timing because the detection algorithm
                distinguishes camera shake from athlete movement using the
                built-in gyroscope. There is a brief learning curve to position
                the camera correctly, but once you have done it once or twice
                it becomes second nature. For a practical walkthrough, see our
                guide on{" "}
                <Link
                  href="/blog/how-to-time-a-40-yard-dash"
                  className="text-[#5C8DB8] hover:underline"
                >
                  how to time a 40-yard dash with your phone
                </Link>
                .
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "#166534" }}
                  >
                    Advantages
                  </div>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: "#166534" }}
                  >
                    <li>No extra hardware -- uses your phone</li>
                    <li>~4ms accuracy with sub-frame interpolation</li>
                    <li>Consistent body-mass detection</li>
                    <li>Finish photo thumbnails for review</li>
                    <li>Session history and progress tracking</li>
                  </ul>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "#FEE2E2",
                    border: "1px solid #FECACA",
                  }}
                >
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "#991B1B" }}
                  >
                    Drawbacks
                  </div>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: "#991B1B" }}
                  >
                    <li>Requires a stable phone mount</li>
                    <li>Brief learning curve for positioning</li>
                    <li>120fps can cause thermal throttling in long sessions</li>
                    <li>Not certified for official competition use</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: FAT Systems */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                5
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Fully Automatic Timing (FAT) Systems
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                How It Works
              </h3>
              <p className="text-body mb-6">
                FAT systems are the gold standard used at the Olympics, World
                Athletics championships, and NCAA meets. They use a specialized
                line-scan camera positioned at the finish line that captures a
                single vertical strip of pixels thousands of times per second.
                The start is triggered electronically by the starting gun. The
                result is the iconic photo finish image -- a composite where the
                horizontal axis represents time rather than space.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Real-World Accuracy
              </h3>
              <p className="text-body mb-6">
                FAT systems resolve times to 0.001 seconds (one thousandth).
                Because the camera scans continuously and the start trigger is
                electronic, there is no human delay and no gap between frames.
                The system captures the exact moment each runner&apos;s torso
                crosses the line. This is as accurate as timing gets.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Cost and Accessibility
              </h3>
              <p className="text-body mb-6">
                A complete FAT setup -- line-scan camera, electronic start
                system, software, and calibrated mounting hardware -- typically
                costs $10,000 to $30,000 or more. These systems are permanently
                or semi-permanently installed at competition venues. They require
                trained operators and are impractical for day-to-day training.
                You will not bring one to the local track for Tuesday practice.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "#166534" }}
                  >
                    Advantages
                  </div>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: "#166534" }}
                  >
                    <li>0.001s resolution -- the gold standard</li>
                    <li>Electronic start trigger, no human delay</li>
                    <li>Continuous capture, no missed frames</li>
                    <li>Certified for official competition results</li>
                  </ul>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "#FEE2E2",
                    border: "1px solid #FECACA",
                  }}
                >
                  <div
                    className="font-semibold mb-2"
                    style={{ color: "#991B1B" }}
                  >
                    Drawbacks
                  </div>
                  <ul
                    className="text-sm space-y-1"
                    style={{ color: "#991B1B" }}
                  >
                    <li>$10,000-$30,000+ cost</li>
                    <li>Fixed venue installation</li>
                    <li>Requires trained operators</li>
                    <li>Not available for everyday training</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Comparison Table (div grid) */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                6
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Side-by-Side Comparison
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              {/* Header Row */}
              <div
                className="grid grid-cols-6 gap-2 pb-3 mb-3 text-xs md:text-sm font-semibold"
                style={{
                  color: "var(--text-primary)",
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                <div className="col-span-1">System</div>
                <div className="col-span-1">Accuracy</div>
                <div className="col-span-1">Consistency</div>
                <div className="col-span-1">Cost</div>
                <div className="col-span-1">Portability</div>
                <div className="col-span-1">Setup</div>
              </div>

              {/* Stopwatch Row */}
              <div
                className="grid grid-cols-6 gap-2 py-3 text-xs md:text-sm"
                style={{
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                <div
                  className="col-span-1 font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Stopwatch
                </div>
                <div style={{ color: "var(--text-muted)" }}>
                  ~0.2-0.3s error
                </div>
                <div style={{ color: "var(--text-muted)" }}>Low</div>
                <div style={{ color: "var(--text-muted)" }}>Under $20</div>
                <div style={{ color: "var(--text-muted)" }}>Excellent</div>
                <div style={{ color: "var(--text-muted)" }}>None</div>
              </div>

              {/* Laser Gates Row */}
              <div
                className="grid grid-cols-6 gap-2 py-3 text-xs md:text-sm"
                style={{
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                <div
                  className="col-span-1 font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Laser Gates
                </div>
                <div style={{ color: "var(--text-muted)" }}>
                  Sub-ms trigger*
                </div>
                <div style={{ color: "var(--text-muted)" }}>Medium</div>
                <div style={{ color: "var(--text-muted)" }}>$500-$2,000</div>
                <div style={{ color: "var(--text-muted)" }}>Moderate</div>
                <div style={{ color: "var(--text-muted)" }}>5-15 min</div>
              </div>

              {/* TrackSpeed Row */}
              <div
                className="grid grid-cols-6 gap-2 py-3 text-xs md:text-sm"
                style={{
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                <div
                  className="col-span-1 font-medium"
                  style={{ color: "var(--accent-green)" }}
                >
                  TrackSpeed
                </div>
                <div style={{ color: "var(--text-muted)" }}>~4ms</div>
                <div style={{ color: "var(--text-muted)" }}>High</div>
                <div style={{ color: "var(--text-muted)" }}>Your phone</div>
                <div style={{ color: "var(--text-muted)" }}>Excellent</div>
                <div style={{ color: "var(--text-muted)" }}>1-2 min</div>
              </div>

              {/* FAT Row */}
              <div className="grid grid-cols-6 gap-2 py-3 text-xs md:text-sm">
                <div
                  className="col-span-1 font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  FAT
                </div>
                <div style={{ color: "var(--text-muted)" }}>0.001s</div>
                <div style={{ color: "var(--text-muted)" }}>Very high</div>
                <div style={{ color: "var(--text-muted)" }}>$10,000+</div>
                <div style={{ color: "var(--text-muted)" }}>None</div>
                <div style={{ color: "var(--text-muted)" }}>Professional</div>
              </div>

              <div
                className="mt-4 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                *Laser gate triggers are sub-millisecond, but inconsistent
                trigger points (arm, leg, or chest breaking the beam first) can
                cause 50-200ms of run-to-run variation for the same athlete.
              </div>
            </div>
          </section>

          {/* Section 7: Which Should You Choose? */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                7
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Which Should You Choose?
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-8">
                The right timing system depends on how you train, what you need
                to measure, and what you are willing to invest. Here are
                practical recommendations for four common situations.
              </p>

              {/* Casual Training */}
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
                  Casual Training
                </h3>
                <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  You run a few times a week and want to see if you are getting
                  faster over time.
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Recommendation: Camera-based timing or a stopwatch.
                  </strong>{" "}
                  A stopwatch is fine if you just want a rough number, but if
                  you want to see real progress (fractions of a second), you
                  need something more consistent. A camera-based timer like
                  TrackSpeed removes human error and gives you data you can
                  compare session to session without spending hundreds of
                  dollars on hardware.
                </p>
              </div>

              {/* Serious Athlete */}
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
                  Serious Athlete
                </h3>
                <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  You are training for competition and need precise, repeatable
                  data for your coach and your own tracking.
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Recommendation: Camera-based timing.
                  </strong>{" "}
                  At this level, you need consistency more than absolute
                  precision. A 0.05-second improvement needs to show up
                  reliably in your data, not get lost in measurement noise.
                  Camera-based body tracking gives you that consistency at ~4ms
                  accuracy. Laser gates work too, but the body-part variation
                  can mask real improvements. Save the FAT system for
                  competitions where it matters for official records.
                </p>
              </div>

              {/* Team Coach */}
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
                  Team Coach
                </h3>
                <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  You need to time multiple athletes efficiently during
                  practice, with results you can review and compare across the
                  roster.
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Recommendation: Camera-based timing.
                  </strong>{" "}
                  Setup time matters when you are running 20 athletes through
                  sprints at practice. TrackSpeed needs one or two phones on
                  tripods -- about a minute of setup. Laser gates need
                  alignment, charged batteries, and careful positioning every
                  session. Camera-based timing also logs every run
                  automatically, so you have a session history you can review
                  without manually recording results on a clipboard.
                </p>
              </div>

              {/* Competition */}
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
                  Official Competition
                </h3>
                <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  You are organizing a sanctioned meet where results need to be
                  certified.
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Recommendation: FAT system.
                  </strong>{" "}
                  There is no substitute here. Governing bodies require
                  certified FAT timing for official records. No phone app or
                  laser gate qualifies. For everything outside the official
                  meet -- warmups, practice, off-season training -- use one
                  of the more accessible options above.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16">
            <div className="card-feature p-6 md:p-8">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                The Bottom Line
              </h2>
              <p className="text-body mb-4">
                For the vast majority of sprint training, you do not need a
                $10,000 FAT system or even a $1,000 laser gate setup. What you
                need is consistent, reliable data that lets you see real changes
                in your performance over time.
              </p>
              <p className="text-body">
                A stopwatch is better than nothing, but its variability makes
                it hard to trust small improvements. Laser gates remove human
                error but introduce their own inconsistency from the
                first-break trigger problem. Camera-based timing offers the best
                balance of accuracy, consistency, and accessibility for daily
                training. And when race day arrives, the certified FAT system
                at the venue will give you your official time. For a more
                detailed look at how these systems stack up, visit our{" "}
                <Link
                  href="/#comparison"
                  className="text-[#5C8DB8] hover:underline"
                >
                  comparison overview on the homepage
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to upgrade your training data?
            </h2>
            <p className="text-body mb-8">
              Download TrackSpeed and start getting consistent, accurate sprint
              times from your phone -- no extra equipment required.
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
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
                <a
                  href="https://play.google.com/store/apps/details?id=com.trackspeed.android"
                  className="btn-primary inline-flex items-center gap-3"
                >
                  <GooglePlayIcon className="w-6 h-6" />
                  Download on Google Play
                </a>
              </div>
              <Link
                href="/technology"
                className="text-sm text-[#5C8DB8] hover:underline"
              >
                Learn how TrackSpeed achieves ~4ms accuracy
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
