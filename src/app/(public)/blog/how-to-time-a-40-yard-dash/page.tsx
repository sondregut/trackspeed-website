import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Time a 40-Yard Dash Accurately with Your Phone",
  description:
    "Learn how to get reliable, repeatable 40-yard dash times using just your iPhone. Eliminate stopwatch error with phone-based computer vision timing.",
  alternates: {
    canonical: "https://mytrackspeed.com/blog/how-to-time-a-40-yard-dash",
  },
  openGraph: {
    type: "article",
  },
};

export default function HowToTime40YardDashPage() {
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "How to Time a 40-Yard Dash Accurately with Your Phone",
    description:
      "Learn how to get reliable, repeatable 40-yard dash times using just your iPhone. Eliminate stopwatch error with phone-based computer vision timing.",
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
    datePublished: "2026-02-10",
    dateModified: "2026-02-17",
    mainEntityOfPage:
      "https://mytrackspeed.com/blog/how-to-time-a-40-yard-dash",
    keywords: [
      "40 yard dash timer",
      "time 40 with phone",
      "40 yard dash time",
      "sprint timing app",
      "phone sprint timer",
    ],
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
              Guides
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              5 min read
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            How to Time a 40-Yard Dash Accurately with Your Phone
          </h1>
          <p
            className="text-lg md:text-xl"
            style={{ color: "var(--text-muted)" }}
          >
            The 40-yard dash is the gold standard speed test for football
            players, but getting a reliable time usually means expensive
            equipment or inconsistent stopwatch reads. Here is how to get
            accurate, repeatable results using just your iPhone.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section 1: Why Stopwatch Timing Falls Short */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                1
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Why Stopwatch Timing Falls Short
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                If you have ever hand-timed a 40-yard dash, you know the
                problem: the time you get depends as much on the person holding
                the stopwatch as it does on the athlete running. Human reaction
                time adds anywhere from 0.2 to 0.3 seconds of error on every
                single rep, and that error is not consistent.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Reaction Time Error
              </h3>
              <p className="text-body mb-6">
                When a timer watches for the first movement and clicks start,
                there is an inherent delay between seeing the movement and
                pressing the button. The same delay happens at the finish. On
                average, this adds about 0.24 seconds to every hand-timed
                result, which is why the NFL Combine switched to electronic
                timing decades ago. But the bigger issue is that this delay is
                not constant. One rep your reaction might be 0.18 seconds and
                the next it could be 0.31 seconds.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Inconsistency Between Timers
              </h3>
              <p className="text-body mb-6">
                If two different coaches time the same run, they will almost
                never agree. Studies have shown that hand-timed results can vary
                by 0.2 seconds or more between two trained timers watching the
                exact same run. That makes it impossible to reliably track
                improvement week over week or compare athletes timed by
                different people.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Why This Matters for Training
              </h3>
              <p className="text-body">
                When you are training to drop your 40 time, the improvements you
                are chasing are measured in hundredths of a second. If your
                timing method has a quarter-second margin of error, you cannot
                tell whether a 0.05-second improvement is real progress or just
                noise in the measurement. You need a{" "}
                <Link
                  href="/blog/sprint-timing-systems-compared"
                  className="text-[#5C8DB8] hover:underline"
                >
                  more consistent timing method
                </Link>{" "}
                to know whether your training is actually working.
              </p>
            </div>
          </section>

          {/* Section 2: What You Need */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                2
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                What You Need
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                The setup is intentionally simple. You do not need laser gates,
                timing pads, or any specialized hardware. Here is the full
                equipment list:
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "rgba(34, 197, 94, 0.15)",
                      color: "var(--accent-green)",
                    }}
                  >
                    1
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      An iPhone with TrackSpeed installed
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Any iPhone that supports iOS 17 or later. TrackSpeed uses
                      your phone&apos;s camera and computer vision to
                      automatically detect when a runner crosses the finish line.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "rgba(34, 197, 94, 0.15)",
                      color: "var(--accent-green)",
                    }}
                  >
                    2
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      A tripod or stable mount (recommended)
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Any phone tripod or clamp mount works. A steady phone
                      gives the most accurate detection. You can also lean the
                      phone against a bag or water bottle in a pinch.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "rgba(92, 141, 184, 0.15)",
                      color: "#5C8DB8",
                    }}
                  >
                    +
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      A second iPhone (optional, for start gate)
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Adding a second phone at the start line gives you a fully
                      automated timing gate with{" "}
                      <Link
                        href="/technology"
                        className="text-[#5C8DB8] hover:underline"
                      >
                        clock-synced accuracy
                      </Link>
                      . But a single phone still gives you far better results
                      than a stopwatch.
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl p-4"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>
                    No calibration needed.
                  </strong>{" "}
                  TrackSpeed uses Photo Finish detection mode by default, which
                  works out of the box with no setup or calibration step. Just
                  point the camera at the finish line and go.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Step-by-Step Setup */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                3
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Step-by-Step Setup
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Getting your first accurate 40-yard dash time takes about two
                minutes of setup. Here is exactly what to do:
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Mark Your Distance
              </h3>
              <p className="text-body mb-6">
                Measure out 40 yards (120 feet) on a flat surface. A football
                field makes this easy since the yard lines are already marked,
                but any flat, straight stretch of ground works. Use cones or
                markers at the start and finish if you are on an open field or
                parking lot.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Position Your Phone at the Finish
              </h3>
              <p className="text-body mb-6">
                Place your iPhone on a tripod or stable surface at the finish
                line, about 3 to 5 feet to the side of the lane. The camera
                should be aimed perpendicular to the running direction so the
                athlete runs across the frame from one side to the other. This
                gives the{" "}
                <Link
                  href="/technology"
                  className="text-[#5C8DB8] hover:underline"
                >
                  detection algorithm
                </Link>{" "}
                a clear view of the runner crossing the finish plane.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Set Your Frame Rate
              </h3>
              <p className="text-body mb-6">
                For outdoor 40-yard dashes, 60fps is the recommended setting. It
                provides strong accuracy while keeping your phone running cool
                during multiple reps. At 60fps, TrackSpeed captures a frame
                every 16.7 milliseconds and uses sub-frame interpolation to
                calculate the exact crossing moment between frames. If you want
                the highest precision for a small number of reps, 120fps gives
                you the tightest thumbnail accuracy, but generates more heat
                during sustained use.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Arm and Run
              </h3>
              <p className="text-body mb-6">
                Open TrackSpeed, tap to arm the session, and wait for the
                stability indicator to turn green. This confirms the phone is
                steady and ready to detect. Then run your 40. The app
                automatically detects the runner crossing the finish line and
                records the time. You will see the result immediately along with
                a finish-line thumbnail frame showing the exact moment of
                crossing.
              </p>

              <div
                className="rounded-xl p-4"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>
                    Tip:
                  </strong>{" "}
                  The phone needs to be still when the runner crosses. If you
                  see a &quot;Hold Still&quot; warning, wait for it to clear
                  before starting the next rep. The built-in gyroscope monitors
                  device stability continuously.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Single Phone vs Two-Phone Setup */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                4
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Single Phone vs Two-Phone Setup
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                TrackSpeed works with either one or two iPhones. The right
                choice depends on whether you have a helper or a second device
                available.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "var(--bg-mint)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div
                    className="font-semibold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Single Phone (Finish Only)
                  </div>
                  <ul
                    className="text-sm space-y-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <li>Phone at the finish line only</li>
                    <li>
                      You start the timer manually by tapping or reacting to a
                      verbal &quot;go&quot;
                    </li>
                    <li>
                      Finish detection is fully automatic via computer vision
                    </li>
                    <li>Start has some human reaction delay (like a hand timer at the start only)</li>
                    <li>Great for solo training or quick reps</li>
                  </ul>
                </div>
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: "rgba(92, 141, 184, 0.06)",
                    border: "1px solid rgba(92, 141, 184, 0.2)",
                  }}
                >
                  <div
                    className="font-semibold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Two Phones (Start + Finish)
                  </div>
                  <ul
                    className="text-sm space-y-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <li>One phone at the start, one at the finish</li>
                    <li>Both detect crossings automatically</li>
                    <li>
                      Devices sync clocks over peer-to-peer with sub-millisecond
                      precision
                    </li>
                    <li>Zero human reaction time in the measurement</li>
                    <li>The most accurate setup possible</li>
                  </ul>
                </div>
              </div>

              <p className="text-body mb-4">
                With a single phone, the finish time is captured with full
                computer-vision accuracy, but the start still depends on your
                reaction to press the button or respond to a signal. This is
                still a major improvement over a handheld stopwatch because at
                least the finish detection is fully consistent and automated.
              </p>

              <p className="text-body">
                With two phones, both the start and finish are detected
                automatically. The devices use an{" "}
                <Link
                  href="/technology"
                  className="text-[#5C8DB8] hover:underline"
                >
                  NTP-style clock synchronization protocol
                </Link>{" "}
                to align their internal clocks to within a few milliseconds of
                each other. This eliminates human error entirely from the
                measurement. For a detailed walkthrough on setting up a
                two-phone timing gate, see our{" "}
                <Link
                  href="/blog/multi-phone-sprint-timing-setup"
                  className="text-[#5C8DB8] hover:underline"
                >
                  multi-phone sprint timing guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Section 5: Tips for Consistent Results */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                5
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Tips for Consistent Results
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Getting a single accurate time is useful. Getting consistently
                accurate times across weeks and months of training is what
                actually helps you improve. Here is how to keep your data
                reliable.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Use the Same Setup Position Every Time
              </h3>
              <p className="text-body mb-6">
                Place your phone at the same distance from the lane and the same
                height for every session. Small changes in camera angle can
                shift the detection point by a few pixels, which translates to a
                few milliseconds of variation. Consistency in setup means
                consistency in results. Mark your tripod position with tape or a
                cone if you are training at the same field regularly.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Let the Phone Warm Up
              </h3>
              <p className="text-body mb-6">
                If your iPhone has been in a cold car or bag, give it a minute
                to reach operating temperature before starting your session.
                Cold batteries deliver less consistent power, and the camera
                sensor performs best at normal operating temperatures. Open the
                app and let it run the camera for 30 seconds before your first
                timed rep.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Avoid Direct Sunlight on the Screen
              </h3>
              <p className="text-body mb-6">
                Direct sun on the phone can cause thermal throttling, especially
                at 120fps. Position the phone so the screen is shaded, or point
                the camera so that the sun is not hitting the lens directly.
                Backlighting (sun behind the runner) creates high-contrast
                silhouettes that are actually ideal for detection. Shooting into
                the sun, however, can cause lens flare and washed-out frames.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Use a Tripod or Stable Mount
              </h3>
              <p className="text-body mb-6">
                TrackSpeed uses the iPhone&apos;s gyroscope to detect camera
                shake and will only arm the detector when the device is stable.
                Hand-holding the phone can work in a pinch, but you will spend
                more time waiting for the stability indicator to turn green
                between reps. A cheap phone tripod eliminates this friction and
                ensures the camera stays perfectly still during every run.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Run Through the Line
              </h3>
              <p className="text-body">
                Just like in an official race, always sprint through the finish
                line at full speed. Do not slow down or lean early. The
                detection tracks the leading edge of your body mass as it
                crosses the gate plane, so decelerating before the line will
                give you a slower and less consistent time. Treat every rep like
                it counts.
              </p>
            </div>
          </section>

          {/* Section 6: Understanding Your Results */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                6
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Understanding Your Results
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Once you have an electronically timed 40-yard dash result, how
                do you know if it is good? Hand-timed results are typically 0.2
                to 0.3 seconds faster than electronic times because the human
                timer reacts late on both the start and finish. So if you have
                been told your 40 is 4.6 hand-timed, your electronic time is
                likely closer to 4.8 or 4.9 seconds.
              </p>

              <p className="text-body mb-6">
                Here is a general reference for electronically timed 40-yard
                dash results at different competitive levels:
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                      }}
                    >
                      <th
                        className="text-left py-3 pr-4 font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Level
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Typical Range
                      </th>
                      <th
                        className="text-left py-3 pl-4 font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Context
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
                        NFL Combine
                      </td>
                      <td className="py-3 px-4">4.3 - 4.6s</td>
                      <td className="py-3 pl-4">
                        Elite athletes, electronically timed on a standardized
                        surface
                      </td>
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
                        College (D1)
                      </td>
                      <td className="py-3 px-4">4.5 - 4.8s</td>
                      <td className="py-3 pl-4">
                        Scholarship-level athletes at top programs
                      </td>
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
                        High School (Varsity)
                      </td>
                      <td className="py-3 px-4">4.7 - 5.2s</td>
                      <td className="py-3 pl-4">
                        Strong varsity players; sub-4.8 stands out on a
                        recruiting profile
                      </td>
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
                        Recreational
                      </td>
                      <td className="py-3 px-4">5.0 - 6.0s+</td>
                      <td className="py-3 pl-4">
                        Casual athletes and fitness enthusiasts
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                className="rounded-xl p-4 mb-6"
                style={{
                  background: "var(--bg-mint)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  <strong style={{ color: "var(--text-primary)" }}>
                    Important:
                  </strong>{" "}
                  Do not compare electronically timed results directly to
                  hand-timed numbers. A 4.8-second electronic 40 is roughly
                  equivalent to a 4.5 to 4.6 hand-timed 40. The most valuable
                  comparison is your own electronic time measured the same way
                  from session to session.
                </p>
              </div>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Tracking Improvement Over Time
              </h3>
              <p className="text-body mb-4">
                The real value of accurate timing is not a single number but the
                trend over time. When your timing method is consistent, you can
                see whether your sprint training is producing real gains or
                whether you have plateaued. Even a 0.05-second improvement over
                several weeks represents genuine progress that would be
                invisible with hand timing.
              </p>

              <p className="text-body">
                TrackSpeed saves all your session data with timestamps, so you
                can review your history and see exactly how your 40 time has
                changed across training cycles. Combined with the{" "}
                <Link
                  href="/#how-it-works"
                  className="text-[#5C8DB8] hover:underline"
                >
                  finish-line thumbnail
                </Link>{" "}
                captured at the moment of crossing, you can also review your
                form and body position at the finish.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to time your 40?
            </h2>
            <p className="text-body mb-8">
              Download TrackSpeed and get your first accurate, electronic
              40-yard dash time in under two minutes. No calibration, no
              expensive equipment.
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
                href="/blog/sprint-timing-systems-compared"
                className="text-sm text-[#5C8DB8] hover:underline"
              >
                Compare TrackSpeed to laser gates and stopwatch timing
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
