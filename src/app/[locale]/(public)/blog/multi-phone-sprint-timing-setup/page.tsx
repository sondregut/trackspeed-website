import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from "@/i18n/navigation";
import GooglePlayIcon from "@/components/icons/GooglePlayIcon";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'blog'});
  return {
    title: t('posts.multi-phone-sprint-timing-setup.title'),
    description: "Step-by-step guide to setting up two or more phones for accurate split timing at start and finish lines during track practice. No internet required.",
    alternates: {
      canonical: 'https://mytrackspeed.com/blog/multi-phone-sprint-timing-setup',
    },
    openGraph: {
      type: "article",
    },
  };
}

export default async function MultiPhoneSprintTimingSetupPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'blog'});
  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline:
      "How to Set Up Multi-Phone Sprint Timing for Track Practice",
    description:
      "Step-by-step guide to setting up two or more phones for accurate split timing at start and finish lines during track practice. No internet required.",
    keywords: "multi phone timing, split timing setup",
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
    datePublished: "2026-02-05",
    dateModified: "2026-02-17",
    mainEntityOfPage:
      "https://mytrackspeed.com/blog/multi-phone-sprint-timing-setup",
  };

  return (
    <div className="bg-hero min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostJsonLd),
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
              Guides
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              4 min read
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            How to Set Up Multi-Phone Sprint Timing for Track Practice
          </h1>
          <p
            className="text-lg md:text-xl"
            style={{ color: "var(--text-muted)" }}
          >
            Use two or more phones as synchronized timing gates to capture
            true elapsed time, split times, and eliminate reaction-time
            errors during training.
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
          {/* Section 1: Why Multi-Phone Timing */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                1
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Why Multi-Phone Timing
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                A handheld stopwatch relies on human reaction at both the
                start and the finish. That introduces reaction-time error into
                every measurement. When a coach presses &quot;go&quot; and the
                athlete responds, the clock includes however long it took both
                humans to react — not just how fast the athlete ran.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                True Elapsed Time
              </h3>
              <p className="text-body mb-6">
                With a phone at the start line and another at the finish line,
                timing begins the moment the athlete&apos;s body crosses the
                start gate. The finish gate records the moment they cross the
                end. The difference is pure running time, with no reaction delay
                mixed in. This is the same principle used in professional
                Fully Automatic Timing (FAT) systems, scaled down to equipment
                you already own.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Split Timing
              </h3>
              <p className="text-body">
                Multi-phone setups also unlock split timing. Place a third phone
                at an intermediate point -- the 20-meter mark, the halfway point
                of a 100-meter dash, or any distance that matters for your
                training plan -- and you get segment-by-segment breakdowns of
                acceleration, top speed, and deceleration. That data is far more
                actionable than a single finish time when you are trying to
                identify where an athlete gains or loses speed.
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
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "rgba(92, 141, 184, 0.1)",
                      color: "#5C8DB8",
                    }}
                  >
                    A
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      2 or more phones
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Any model that runs iOS 17 or later. They do not need to
                      be the same model -- an older phone at the start and a
                      newer one at the finish works fine.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "rgba(92, 141, 184, 0.1)",
                      color: "#5C8DB8",
                    }}
                  >
                    B
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      TrackSpeed installed on each device
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Each phone acts as an independent timing gate.
                      Download from the App Store before heading to the track.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "rgba(92, 141, 184, 0.1)",
                      color: "#5C8DB8",
                    }}
                  >
                    C
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Tripods or stable mounts (recommended)
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Phone tripods, clamp mounts, or even water bottles and
                      tape will work. The key is that the phone must stay still
                      during timing. TrackSpeed uses the gyroscope to detect
                      movement, and an unstable device will delay arming.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "rgba(92, 141, 184, 0.1)",
                      color: "#5C8DB8",
                    }}
                  >
                    D
                  </div>
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No internet connection needed
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Devices communicate directly over peer-to-peer wireless.
                      WiFi and Bluetooth must be enabled on both phones, but you
                      do not need a WiFi network or cellular signal. This works
                      on a track in the middle of nowhere.
                    </div>
                  </div>
                </div>
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
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Step A: Position the phones
              </h3>
              <p className="text-body mb-6">
                Place one phone at the start line and the other at the finish
                line. Each phone should be perpendicular to the lane the athlete
                will run through, with the camera pointing across the lane at
                approximately chest height. This ensures the detection system
                tracks the athlete&apos;s torso rather than an arm or leg, which
                matches how official timing works. If you are using tripods,
                extend them so the camera lens is roughly 1.0 to 1.3 meters off
                the ground. Position the phone about 1 to 2 meters back from
                the lane edge so the full lane width is visible in the frame.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Step B: Create a session on the host phone
              </h3>
              <p className="text-body mb-6">
                Open TrackSpeed on the phone that will act as the host (either
                start or finish -- it does not matter which). Tap to create a
                new multi-phone session. The host phone will begin broadcasting
                its availability. On the second phone, open TrackSpeed and it
                will discover the host automatically. Tap to join the session.
                You will see both devices listed once they are connected.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Step C: Wait for clock synchronization
              </h3>
              <p className="text-body mb-6">
                Once connected, the devices begin an{" "}
                <Link
                  href="/technology"
                  className="text-[#5C8DB8] hover:underline"
                >
                  NTP-style clock synchronization
                </Link>{" "}
                process. They exchange a series of timestamped messages to
                measure and correct for the clock offset between them. A sync
                indicator on each phone shows the current status. Wait until
                both devices show a successful sync before proceeding. This
                typically takes a few seconds and achieves sub-5-millisecond
                alignment.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Step D: Arm both gates
              </h3>
              <p className="text-body mb-6">
                Tap the arm button on the host device and it will signal the
                other phone to arm as well. Both phones enter a ready state
                where the camera is actively analyzing frames for motion.
                The status indicator on each phone will show &quot;Ready&quot;
                once the gyroscope confirms the device is stable. If a phone
                is still wobbling from being placed on the tripod, give it a
                moment to settle -- the stability gate prevents false triggers
                from camera shake.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Step E: Run
              </h3>
              <p className="text-body">
                The athlete takes their position and sprints. The start gate
                detects their body crossing the start line and records the
                timestamp. The finish gate detects the crossing at the finish
                line and records its timestamp. Because both clocks are
                synchronized, TrackSpeed subtracts the start time from the
                finish time to produce the true elapsed sprint time. The result
                appears on both phones immediately, along with a thumbnail frame
                of each crossing.
              </p>
            </div>
          </section>

          {/* Section 4: Getting Accurate Split Times */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                4
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Getting Accurate Split Times
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Split times reveal where in a sprint an athlete is fast and
                where they are losing time. A 100-meter dash might show a slow
                first 10 meters (acceleration phase) but a strong 60 to
                80-meter segment (top speed). Without splits, that information
                is invisible.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Adding a Third Phone
              </h3>
              <p className="text-body mb-6">
                To capture split times, place an additional phone at the
                intermediate distance you want to measure -- for example, at the
                20-meter mark of a 40-yard dash, or at the 60-meter mark of a
                100-meter sprint. Set it up the same way as the start and finish
                phones: perpendicular to the lane, chest height, stable mount.
                When the third phone joins the session, all three devices
                synchronize their clocks together.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Reading the Results
              </h3>
              <p className="text-body mb-6">
                After the run, you will see the total time plus the time for
                each segment. For a three-gate setup at 0m, 20m, and 40m, you
                get a 0-20m split, a 20-40m split, and the total 0-40m time.
                Comparing these splits across sessions shows whether
                acceleration drills are paying off or whether an athlete needs
                to work on maintaining speed.
              </p>

              <p className="text-body">
                For specific guidance on timing a{" "}
                <Link
                  href="/blog/how-to-time-a-40-yard-dash"
                  className="text-[#5C8DB8] hover:underline"
                >
                  40-yard dash with accurate phone-based timing
                </Link>
                , see our dedicated guide. It covers the particular distances
                and considerations for that test.
              </p>
            </div>
          </section>

          {/* Section 5: Tips for Track Practice */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                5
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Tips for Track Practice
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Timing Multiple Athletes Efficiently
              </h3>
              <p className="text-body mb-6">
                You do not need to re-create the session between athletes. Once
                the gates are armed, each crossing is recorded as a separate
                run. Have athletes line up and go one at a time with enough
                spacing (10 to 15 seconds) between runners for the gates to
                reset. The session collects all runs in sequence, so a coach can
                time an entire team without touching the phones.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Keeping Phones Cool
              </h3>
              <p className="text-body mb-6">
                Running the camera continuously generates heat, especially at
                higher frame rates. For long practice sessions, consider using
                60fps instead of 120fps to reduce thermal load. If a phone
                starts feeling warm, pause the session and let it cool for a
                few minutes. Keeping phones out of direct sunlight helps too --
                a small shade or placing the tripod so the phone faces away from
                the sun makes a noticeable difference on hot days.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Consistent Positioning
              </h3>
              <p className="text-body mb-6">
                For comparable results across training sessions, mark where you
                place the tripods. Use tape on the track surface or note
                landmarks so you can reproduce the same setup next time.
                Consistent camera angle and distance from the lane means the
                detection triggers at the same relative position on the
                athlete&apos;s body, reducing variability in your data.
              </p>

              <p className="text-body">
                Combine multi-phone timing with structured{" "}
                <Link
                  href="/blog/improve-sprint-speed-training"
                  className="text-[#5C8DB8] hover:underline"
                >
                  sprint training drills
                </Link>{" "}
                to make the most of accurate timing data. Knowing exact split
                times lets you adjust rest intervals, distances, and training
                focus based on measured performance rather than guesswork.
              </p>
            </div>
          </section>

          {/* Section 6: Troubleshooting Connection Issues */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                6
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Troubleshooting Connection Issues
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                The peer-to-peer connection between phones is generally
                reliable, but here are the most common issues and how to
                resolve them.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                WiFi and Bluetooth Must Be Enabled
              </h3>
              <p className="text-body mb-6">
                Even though you do not need a WiFi network, both WiFi and
                Bluetooth radios must be turned on. iOS uses them together to
                establish the peer-to-peer link. Check Settings or Control
                Center on both devices and make sure neither radio is disabled.
                Airplane mode will block the connection entirely.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Stay Within Range
              </h3>
              <p className="text-body mb-6">
                The phones need to stay within approximately 30 feet (10 meters)
                of each other during the initial connection and clock
                synchronization. Once synced, the connection is more tolerant of
                distance, but for the most reliable operation keep them within
                reasonable range. For a 100-meter sprint, the phones will be far
                apart, which is fine -- the peer-to-peer protocol handles this
                well on open tracks without walls or interference. However,
                initial pairing works best at close range, so pair the devices
                before walking them out to their positions.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                If the Connection Drops
              </h3>
              <p className="text-body mb-6">
                If phones lose their connection mid-session, bring them back
                within range and the app will attempt to reconnect automatically.
                If it does not reconnect after 15 to 20 seconds, end the
                session on both phones and start a new one. The reconnection
                process is quick, and re-establishing the clock sync only takes
                a few seconds.
              </p>

              <p className="text-body">
                For persistent issues or questions not covered here, visit our{" "}
                <Link
                  href="/support"
                  className="text-[#5C8DB8] hover:underline"
                >
                  support page
                </Link>{" "}
                for additional help.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to set up multi-phone timing?
            </h2>
            <p className="text-body mb-8">
              Download TrackSpeed on each phone you plan to use, head to the
              track, and follow the steps above. Accurate split timing is
              minutes away.
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
                href="/blog"
                className="text-sm text-[#5C8DB8] hover:underline"
              >
                Browse more sprint timing guides
              </Link>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
