import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "5 Sprint Training Drills That Benefit from Accurate Timing",
  description:
    "Specific sprint training drills where precise, consistent timing data helps you track progress, break plateaus, and train smarter. Flying 30s, block starts, in-and-out 60s, and more.",
  alternates: {
    canonical: "https://mytrackspeed.com/blog/improve-sprint-speed-training",
  },
  openGraph: {
    type: "article",
  },
};

export default function ImproveSprintSpeedTrainingPage() {
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "5 Sprint Training Drills That Benefit from Accurate Timing",
    description:
      "Specific sprint training drills where precise, consistent timing data helps you track progress, break plateaus, and train smarter.",
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
    datePublished: "2026-02-03",
    dateModified: "2026-02-17",
    mainEntityOfPage:
      "https://mytrackspeed.com/blog/improve-sprint-speed-training",
    keywords: [
      "sprint training drills",
      "speed training",
      "sprint timing",
      "track practice",
      "sprint workouts",
    ],
  };

  return (
    <div className="bg-hero min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd),
        }}
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
              Training
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              6 min read
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            5 Sprint Training Drills That Benefit from Accurate Timing
          </h1>
          <p
            className="text-lg md:text-xl"
            style={{ color: "var(--text-muted)" }}
          >
            Stopwatch-based sprint training drills rely on guesswork. When you
            have precise, repeatable timing, every rep becomes measurable
            data&mdash;and that changes how you train.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <section className="mb-16">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Why Timing Matters for Sprint Training Drills
            </h2>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Most speed training programs tell you to &quot;run fast&quot; and
                rest. But without accurate timing, you have no way to know
                whether you actually ran faster, whether your rest interval was
                long enough, or whether you are improving week over week.
                Subjective effort is unreliable&mdash;a sprint that feels fast
                on tired legs might be slower than an easy rep on fresh ones.
              </p>
              <p className="text-body mb-6">
                Objective timing data solves three specific problems in sprint
                training drills:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: "rgba(92, 141, 184, 0.1)",
                      color: "#5C8DB8",
                    }}
                  >
                    1
                  </div>
                  <p className="text-body">
                    <strong style={{ color: "var(--text-primary)" }}>
                      Objective feedback per rep.
                    </strong>{" "}
                    You know immediately whether a cue change, a drill
                    variation, or a rest adjustment actually produced a faster
                    time.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: "rgba(92, 141, 184, 0.1)",
                      color: "#5C8DB8",
                    }}
                  >
                    2
                  </div>
                  <p className="text-body">
                    <strong style={{ color: "var(--text-primary)" }}>
                      Progress tracking across sessions.
                    </strong>{" "}
                    Comparing times from Tuesday to Thursday only works when the
                    timing method is consistent. A hand-started stopwatch
                    introduces 0.2&ndash;0.4 seconds of variation per
                    run&mdash;enough to hide real improvements entirely.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: "rgba(92, 141, 184, 0.1)",
                      color: "#5C8DB8",
                    }}
                  >
                    3
                  </div>
                  <p className="text-body">
                    <strong style={{ color: "var(--text-primary)" }}>
                      Identifying plateaus early.
                    </strong>{" "}
                    When your times flatten over several sessions, you can adjust
                    your program before wasting weeks on a drill that has stopped
                    producing adaptations.
                  </p>
                </li>
              </ul>
              <p className="text-body">
                The five drills below are staples of speed training programs at
                every level. Each one becomes significantly more useful when you
                have{" "}
                <Link
                  href="/technology"
                  className="text-[#5C8DB8] hover:underline"
                >
                  accurate, automated timing
                </Link>{" "}
                instead of a coach fumbling with a stopwatch button.
              </p>
            </div>
          </section>

          {/* Drill 1: Flying 30s */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                1
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Flying 30-Meter Sprints
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What It Is
              </h3>
              <p className="text-body mb-6">
                A flying 30 removes the acceleration phase entirely. You build
                up speed over 20&ndash;30 meters, then sprint at maximum
                velocity through a timed 30-meter zone. The clock only runs
                while you are at (or near) top speed.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                How to Set It Up
              </h3>
              <p className="text-body mb-6">
                Mark three points: a start cone, a timing-start cone 20&ndash;30
                meters down the track, and a timing-end cone 30 meters beyond
                that. Place your phone at the timing-start line pointed across
                the lane. If you have a second phone, place it at the
                timing-end line for a{" "}
                <Link
                  href="/blog/multi-phone-sprint-timing-setup"
                  className="text-[#5C8DB8] hover:underline"
                >
                  two-phone split setup
                </Link>
                . Sprint from the start cone, hit full speed by the timing-start
                cone, and maintain through the timing-end cone.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What to Measure
              </h3>
              <p className="text-body mb-6">
                Your flying 30 time is a pure measure of maximum velocity. For
                elite male sprinters, this is typically 2.8&ndash;3.2 seconds.
                For high school athletes, 3.5&ndash;4.2 seconds is a common
                range. Track this number across weeks to see whether your top
                speed is actually improving.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Why Accurate Timing Matters Here
              </h3>
              <p className="text-body">
                Because the acceleration variable has been removed, the
                differences between good and great reps are small&mdash;often
                0.05&ndash;0.15 seconds. A hand-timed stopwatch cannot
                distinguish a 3.10 from a 3.20 reliably. With automated timing
                that has{" "}
                <Link
                  href="/technology"
                  className="text-[#5C8DB8] hover:underline"
                >
                  millisecond-level consistency
                </Link>
                , you can trust that a 0.08-second improvement is real, not
                noise.
              </p>
            </div>
          </section>

          {/* Drill 2: Block Starts to 20m */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                2
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Block Starts to 20 Meters
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What It Is
              </h3>
              <p className="text-body mb-6">
                This drill isolates the start and initial acceleration
                phase&mdash;the first 20 meters out of blocks (or from a
                standing/3-point start). It is one of the most technically
                demanding parts of sprinting: block angles, push-off timing,
                shin angles, and drive phase mechanics all combine to determine
                how quickly you cover those first 20 meters.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                How to Set It Up
              </h3>
              <p className="text-body mb-6">
                Place one phone at the start line and a second phone at the
                20-meter mark. The{" "}
                <Link
                  href="/blog/multi-phone-sprint-timing-setup"
                  className="text-[#5C8DB8] hover:underline"
                >
                  two-phone setup
                </Link>{" "}
                captures both the reaction/start time and the 20-meter split
                automatically. The start phone detects your first movement out
                of the blocks, while the finish phone records when you cross the
                20-meter line.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What to Measure
              </h3>
              <p className="text-body mb-6">
                The total time from first movement to crossing the 20-meter
                mark. For competitive sprinters, this is often in the
                2.5&ndash;3.2 second range. More importantly, track the
                consistency of this number: a tight cluster of times indicates
                reliable technique, while a wide spread suggests inconsistency
                in your start mechanics.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Why Accurate Timing Matters Here
              </h3>
              <p className="text-body">
                Block start improvements are measured in hundredths of a
                second. Changing your block spacing by two inches might save
                0.03 seconds. Adjusting your first-step angle might cost 0.02
                seconds. Without timing that is repeatable to within a few
                hundredths, you cannot evaluate whether a technical change
                helped or hurt. Automated detection eliminates the reaction-time
                variability of a coach pressing a button.
              </p>
            </div>
          </section>

          {/* Drill 3: In-and-Out 60s */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                3
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                In-and-Out 60-Meter Sprints
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What It Is
              </h3>
              <p className="text-body mb-6">
                In-and-out sprints alternate between acceleration, maintenance,
                and deceleration zones within a single run. The standard format
                over 60 meters is: accelerate hard for 20 meters, maintain speed
                with relaxed form for 20 meters, then decelerate over the final
                20 meters. This drill teaches athletes to reach top speed and
                hold it without tensing up.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                How to Set It Up
              </h3>
              <p className="text-body mb-6">
                Mark four cones at 0, 20, 40, and 60 meters. Ideally, place
                timing gates at each transition point. With a single phone, you
                can time the full 60 meters. With two phones, place one at the
                20-meter mark and one at the 40-meter mark to capture the
                &quot;maintenance zone&quot; split separately&mdash;this is the
                most valuable data point, as it tells you how well you held
                speed through the relaxed phase.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What to Measure
              </h3>
              <p className="text-body mb-6">
                The key metric is the split time through the maintenance zone
                (20&ndash;40m). Compare this to your flying 30 time from Drill
                1. If the maintenance zone split is significantly slower than
                your flying time, you are losing speed during the &quot;hold&quot;
                phase&mdash;usually due to tension. A close match means you are
                maintaining velocity efficiently.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Why Accurate Timing Matters Here
              </h3>
              <p className="text-body">
                The whole point of this drill is comparing split times across
                zones. If your timing system has 0.2&ndash;0.3 seconds of
                variability (typical of hand timing), the zone comparisons
                become meaningless&mdash;you cannot tell whether a slower
                maintenance zone is due to actual speed loss or timing error.
                Consistent automated timing makes the zone-to-zone comparison
                reliable.
              </p>
            </div>
          </section>

          {/* Drill 4: Resisted Sprint Comparisons */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                4
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Resisted Sprint Comparisons
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What It Is
              </h3>
              <p className="text-body mb-6">
                Resisted sprints use a sled, parachute, or resistance band to
                overload the sprint pattern. The training effect comes from
                producing more force at high movement speeds. The drill itself is
                simple: sprint a set distance (typically 20&ndash;40 meters) with
                resistance, then sprint the same distance without resistance.
                Comparing the two times quantifies the resistance effect.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                How to Set It Up
              </h3>
              <p className="text-body mb-6">
                Pick a distance&mdash;30 meters works well for most athletes.
                Place your phone at the finish line. Run three reps with
                resistance and three reps without, using the same start
                protocol each time. A{" "}
                <Link
                  href="/blog/multi-phone-sprint-timing-setup"
                  className="text-[#5C8DB8] hover:underline"
                >
                  two-phone setup
                </Link>{" "}
                with phones at 0 and 30 meters ensures the start detection is
                consistent between resisted and free sprints.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What to Measure
              </h3>
              <p className="text-body mb-6">
                Track two numbers: your resisted time and your free time over
                the same distance. The difference tells you the speed cost of
                the resistance. Research suggests that resistance should slow you
                by no more than 10% of your free sprint time to maintain
                sprint-specific mechanics. If a sled slows you by 15&ndash;20%,
                the load is too heavy for speed development (though it may still
                have value for strength work).
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Why Accurate Timing Matters Here
              </h3>
              <p className="text-body">
                The 10% threshold depends on the timing being reliable. If your
                free sprint over 30 meters is 4.20 seconds, a 10% load should
                produce roughly 4.62 seconds. If your timing system has 0.3
                seconds of variability, you cannot distinguish a 10% load from a
                5% load. Precise timing turns sled pulls from &quot;it felt
                heavy&quot; into a quantified training stimulus you can adjust
                session to session.
              </p>
            </div>
          </section>

          {/* Drill 5: Fatigue Drop-Off Sets */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                5
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Fatigue Drop-Off Sets
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What It Is
              </h3>
              <p className="text-body mb-6">
                This is a volume-management protocol, not a single drill.
                Perform repeated sprints over a fixed distance (40 meters is the
                most common) with a fixed rest interval (typically 2&ndash;4
                minutes). Time every rep. When your time drops off by more than
                a predetermined threshold&mdash;usually 5&ndash;10% from your
                best rep of the day&mdash;the session is over.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                How to Set It Up
              </h3>
              <p className="text-body mb-6">
                Place your phone at the{" "}
                <Link
                  href="/blog/how-to-time-a-40-yard-dash"
                  className="text-[#5C8DB8] hover:underline"
                >
                  40-meter (or 40-yard) mark
                </Link>
                . Run each rep with maximum intent. After each rep, check your
                time. Record your fastest rep of the day as the baseline.
                Continue sprinting with full rest until your time exceeds the
                baseline by your chosen threshold (for example, if your best is
                5.00 seconds and your threshold is 5%, stop when a rep comes in
                at 5.25 or slower).
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                What to Measure
              </h3>
              <p className="text-body mb-6">
                Three things: (1) your best rep time, which indicates current
                sprint capacity; (2) the number of reps before drop-off, which
                indicates your speed endurance and recovery capacity; and (3)
                the pattern of degradation&mdash;does your time hold steady for
                six reps then fall off a cliff, or does it gradually creep up
                from rep one? These patterns reveal different things about your
                fitness.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Why Accurate Timing Matters Here
              </h3>
              <p className="text-body">
                The entire protocol depends on detecting small changes in sprint
                time from rep to rep. A 5% drop-off from a 5.00-second baseline
                is only 0.25 seconds. With hand timing, you might stop a session
                two reps too early (because a timing error made a rep look slow)
                or two reps too late (because a timing error made a rep look
                fast when you were already degraded). Automated timing ensures
                the stop decision is based on real fatigue, not measurement
                noise.
              </p>
            </div>
          </section>

          {/* Using Your Data */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(92, 141, 184, 0.15)",
                  color: "#5C8DB8",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Using Your Data Effectively
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Collecting precise times is only useful if you interpret them
                correctly. Here are three principles for turning sprint timing
                data into training decisions.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Look at Trends, Not Individual Runs
              </h3>
              <p className="text-body mb-6">
                A single sprint time is influenced by dozens of variables:
                wind, temperature, fatigue from yesterday&apos;s workout, what
                you ate, your warm-up quality. No single rep tells you much on
                its own. Instead, look at rolling averages across sessions. If
                your best flying 30 time has gone from 3.45 to 3.38 over the
                past month, that is a real trend&mdash;even if individual
                sessions fluctuated.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Compare Across Sessions, Not Just Within
              </h3>
              <p className="text-body mb-6">
                It is tempting to focus on session PRs, but the more valuable
                comparison is between sessions. Did your average rep time
                improve? Did your drop-off threshold extend by one rep? Did your
                block start consistency tighten? These cross-session patterns
                reveal whether your program is working better than any single
                fast rep.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Set Realistic Targets
              </h3>
              <p className="text-body">
                Sprint improvement is nonlinear. A beginner might drop 0.3
                seconds from their 40-meter time in a month. An advanced
                sprinter might fight for 0.05 seconds over an entire season.
                Use your timing data to set targets that match your training
                age and current level. If you have been running 4.90-second 40s
                consistently, targeting 4.80 over the next training block is
                ambitious but achievable. Targeting 4.50 is not&mdash;and
                chasing an unrealistic number leads to overtraining and
                frustration.
              </p>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-16">
            <div className="card-feature p-6 md:p-8">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Getting Started
              </h2>
              <p className="text-body mb-4">
                All five of these sprint training drills work with a single
                phone placed at one timing point. For drills that benefit from
                split timing (block starts, in-and-out 60s), a{" "}
                <Link
                  href="/blog/multi-phone-sprint-timing-setup"
                  className="text-[#5C8DB8] hover:underline"
                >
                  two-phone setup
                </Link>{" "}
                gives you additional data points without any extra cost.
                TrackSpeed handles the{" "}
                <Link
                  href="/#how-it-works"
                  className="text-[#5C8DB8] hover:underline"
                >
                  detection and timing automatically
                </Link>
                &mdash;place your phone, start the session, and sprint. Every
                rep is timed and saved so you can track your progress over
                weeks and months.
              </p>
              <p className="text-body">
                Start with the drill that matches your current training
                focus. If you are working on top speed, begin with flying 30s.
                If acceleration is the priority, use block starts to 20 meters.
                If you are managing volume for a competition phase, fatigue
                drop-off sets give you a built-in auto-regulation tool. The key
                is consistent measurement: same distance, same setup, same
                protocol, so the only variable is your performance.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to time your training?
            </h2>
            <p className="text-body mb-8">
              Download TrackSpeed and turn every sprint rep into measurable
              data. No stopwatch errors, no extra equipment&mdash;just your
              iPhone.
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
              <Link
                href="/blog"
                className="text-sm text-[#5C8DB8] hover:underline"
              >
                Browse more training guides
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
