import Image from "next/image";
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from "@/i18n/navigation";
import {getPageMetadata} from '@/i18n/metadata';
import { ArticleByline } from "@/components/ArticleByline";
import RelatedPosts from "@/components/RelatedPosts";
import { DownloadLink } from "@/components/DownloadLink";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'blog'});
  return getPageMetadata({
    title: t('posts.what-is-photo-finish-timing.title'),
    description: "Learn how photo finish timing works, from its origins in 1880s horse racing to modern smartphone alternatives. Covers FAT systems, line-scan cameras, and how TrackSpeed adapts photo finish concepts for training.",
    path: '/blog/what-is-photo-finish-timing',
    type: 'article',
    localized: false,
    locale,
  });
}

export default async function WhatIsPhotoFinishTimingPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'blog'});
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "What Is Photo Finish Timing and How Does It Work?",
    description:
      "Learn how photo finish timing works, from its origins in 1880s horse racing to modern smartphone alternatives. Covers FAT systems, line-scan cameras, and how TrackSpeed adapts photo finish concepts for training.",
    image: "https://mytrackspeed.com/og-image-2026-06.png",
    author: {
      "@type": "Person",
      name: "Sondre Guttormsen",
      url: "https://instagram.com/sondre_pv",
      jobTitle: "Founder, TrackSpeed",
      description: "Two-time Olympian, NCAA champion pole vaulter",
    },
    publisher: {
      "@type": "Organization",
      name: "TrackSpeed",
      url: "https://mytrackspeed.com",
      logo: "https://mytrackspeed.com/trackspeed-icon-1d43ec40.png",
    },
    datePublished: "2026-02-01",
    dateModified: "2026-08-09",
    mainEntityOfPage:
      "https://mytrackspeed.com/blog/what-is-photo-finish-timing",
    keywords: ["photo finish timing", "how photo finish works"],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mytrackspeed.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://mytrackspeed.com/blog" },
      { "@type": "ListItem", position: 3, name: "What Is Photo Finish Timing and How Does It Work?" },
    ],
  };

  return (
    <div className="bg-hero min-h-screen">
      <script
        type="application/ld+json"
        // Static JSON-LD — no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        // Static JSON-LD — no user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            What Is Photo Finish Timing and How Does It Work?
          </h1>
          <ArticleByline slug="what-is-photo-finish-timing" />
          <p
            className="text-lg md:text-xl"
            style={{ color: "var(--text-muted)" }}
          >
            From 1880s horse racing to modern smartphone apps, photo finish
            timing has shaped how we measure speed. Here is how the technology
            works, why it matters, and how you can use a version of it at every
            practice.
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
          {/* Section 1: A Brief History */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                1
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                A Brief History of Photo Finish Timing
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                The idea of using a camera to settle close finishes dates back
                further than most people realize. In the 1880s, horse racing
                tracks began experimenting with photography to determine which
                animal crossed the finish line first. Before cameras, judges
                relied entirely on eyesight, and disputed finishes were
                common&mdash;especially in races decided by fractions of a
                second.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Early Film-Based Systems
              </h3>
              <p className="text-body mb-6">
                The earliest photo finish systems used a strip of film aligned
                with the finish line. As competitors crossed, the camera exposed
                a narrow strip of the film, producing a composite image where
                time progressed along the horizontal axis instead of space. This
                meant that two horses (or runners) arriving at different moments
                appeared side by side in the image but at different horizontal
                positions, making the order of finish unmistakable.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                The Olympic Standard
              </h3>
              <p className="text-body mb-6">
                Photo finish technology reached the world stage at the 1932 Los
                Angeles Olympics, where the Kirby Two-Eyed Camera was used
                alongside human judges. By the 1948 London Olympics, photo
                finish cameras had become the official method for resolving close
                races. The technology continued to improve through the decades:
                from analog film that required chemical development (sometimes
                taking minutes) to fully electronic systems that could produce
                results in under a second.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                The Digital Revolution
              </h3>
              <p className="text-body">
                By the 1990s, digital line-scan cameras replaced film entirely.
                Companies like Swiss Timing and FinishLynx built purpose-built
                cameras that could scan at rates exceeding 2,000 lines per
                second, producing extremely high-resolution composite images.
                These systems remain the gold standard for competitive athletics
                today, used at every major track and field championship and
                Olympic Games.
              </p>
            </div>
          </section>

          {/* Section 2: How Traditional Photo Finish Works */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                2
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                How Traditional Photo Finish Works
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                A traditional photo finish camera is fundamentally different from
                a normal video camera. Instead of capturing full frames
                (complete images of the entire scene), it captures a single
                vertical line of pixels aligned precisely with the finish line.
                It then repeats this capture thousands of times per second.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                The Line-Scan Principle
              </h3>
              <p className="text-body mb-6">
                Imagine looking at the finish line through a very narrow slit.
                You see only what is directly on the line at any given instant.
                Now imagine recording what you see through that slit
                continuously, stacking each observation next to the last. What
                you build is an image where the vertical axis represents
                space&mdash;the height of the finish line&mdash;and the
                horizontal axis represents time. An athlete who arrives earlier
                appears further to the left in the image; one who arrives later
                appears further to the right.
              </p>

              {/* Line-scan concept diagram */}
              <div
                className="bg-[var(--bg-mint)] rounded-xl p-6 mb-6"
                style={{ border: "1px solid var(--border-light)" }}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Normal Camera
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Full frame, many times/sec
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      X = space, Y = space
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center text-lg font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    vs.
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Line-Scan Camera
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      1 pixel column, 2000+/sec
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      X = time, Y = space
                    </div>
                  </div>
                </div>
              </div>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Building the Composite Image
              </h3>
              <p className="text-body mb-6">
                Each vertical line captured by the camera becomes one column of
                pixels in the final image. Because the camera captures thousands
                of these columns per second, the resulting composite has
                extremely high temporal resolution. If an athlete&apos;s torso
                takes 50 milliseconds to pass through the finish line and the
                camera is scanning at 2,000 lines per second, the
                athlete&apos;s torso will span 100 pixel columns in the
                image&mdash;providing abundant detail for the judges to determine
                the precise moment the chest crossed the line.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Reading the Photo Finish Image
              </h3>
              <p className="text-body">
                Because time flows horizontally, the image looks slightly
                distorted compared to a normal photograph. A runner&apos;s body
                might appear stretched or compressed depending on their speed
                relative to the scan rate. Faster runners appear narrower;
                slower runners appear wider. Judges and timing officials are
                trained to read these images and can identify the exact pixel
                column where each athlete&apos;s torso intersects the finish
                line, translating that column back into a precise time.
              </p>
            </div>
          </section>

          {/* Section 3: FAT vs Photo Finish */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                3
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Fully Automatic Timing (FAT) and Photo Finish
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                In competitive athletics, the term &quot;Fully Automatic
                Timing&quot; (FAT) refers to a complete system where no human
                input is needed to produce the official result. FAT combines
                three components: a starting device (the gun or electronic
                start), a time base (a precise clock), and a photo finish camera
                to determine when each athlete crosses the finish line.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Why FAT Is the Gold Standard
              </h3>
              <p className="text-body mb-6">
                FAT systems resolve times to the nearest thousandth of a second
                (0.001s). At major competitions, official results are rounded to
                hundredths (0.01s), but the thousandth digit is available for
                tiebreaking. The start signal triggers the clock electronically
                with zero human reaction delay, and the photo finish camera
                captures the finish with sub-millisecond precision. Every
                component in the chain is engineered for accuracy and certified
                by governing bodies like World Athletics.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                The Cost Barrier
              </h3>
              <p className="text-body mb-6">
                Professional FAT systems are expensive. A complete setup from
                manufacturers like Swiss Timing or FinishLynx typically costs
                $10,000 or more, and that does not include installation,
                calibration, or the trained operators needed to run the system.
                This cost puts certified photo finish timing out of reach for
                most training facilities, youth programs, and individual
                athletes.
              </p>

              {/* Cost comparison */}
              <div
                className="bg-[var(--bg-mint)] rounded-xl p-4 mb-6"
                style={{ border: "1px solid var(--border-light)" }}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div
                      className="text-xl font-bold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      $10,000+
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Professional FAT system
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-xl font-bold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      $500-2,000
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Laser gate system
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-xl font-bold mb-1"
                      style={{ color: "var(--accent-green)" }}
                    >
                      Your phone
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      TrackSpeed app
                    </div>
                  </div>
                </div>
              </div>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Semi-Automatic and Hand Timing
              </h3>
              <p className="text-body">
                Below FAT, there are less precise alternatives. Semi-automatic
                timing uses an electronic start but a human-operated button for
                the finish, adding roughly 0.1-0.3 seconds of reaction time
                variability. Hand timing&mdash;where a person starts and stops a
                stopwatch manually&mdash;introduces even more error, typically
                0.2-0.5 seconds per split. These methods are acceptable for
                practice but not for official record keeping, which is why
                governing bodies mandate FAT for any result submitted as a
                record.
              </p>
            </div>
          </section>

          {/* Section 4: The Smartphone Alternative */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                4
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                The Smartphone Alternative
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Modern smartphones have closed much of the gap between consumer
                and professional hardware. A phone can capture video at 120
                frames per second with precise frame timestamps, and it carries
                a gyroscope, accelerometer, and a processor powerful enough to
                run computer vision algorithms in real time. This combination
                makes smartphone-based photo finish timing a practical
                possibility.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Full-Frame Capture Adds Context
              </h3>
              <p className="text-body mb-6">
                Unlike a line-scan camera that records only the finish plane, a
                smartphone records the surrounding scene. That context can make a
                training event easier to review because the athlete, configured
                line, and approach remain visible. A phone camera is still not the
                specialized certified system used for an official stadium result.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                The Timing Event Must Be Defined
              </h3>
              <p className="text-body mb-6">
                A camera training timer needs a clear rule for the crossing it
                records. The phone must be stable, the line must be placed
                correctly, and the view must stay unobstructed. An unusual result
                should be checked against the saved evidence instead of accepted
                only because it has several decimal places.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                The Implementation Is Proprietary
              </h3>
              <p className="text-body">
                TrackSpeed&apos;s internal detection and multi-phone coordination are
                not published in this guide. What a coach can validate is the
                complete measurement workflow: a defined start, a measured course,
                an automatic configured crossing, reviewable evidence, and a
                consistent protocol from one session to the next.
              </p>
            </div>
          </section>

          {/* Section 5: How TrackSpeed Adapts the Concept */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                5
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                How TrackSpeed Adapts the Concept
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                TrackSpeed takes the principles behind photo finish
                timing&mdash;detecting exactly when a body crosses a defined
                line&mdash;and reimplements them using the tools available on a
                smartphone. The approach is fundamentally different from a
                line-scan camera, but the goal is the same: determine the
                precise moment of crossing.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Automatic Configured Crossing
              </h3>
              <p className="text-body mb-6">
                TrackSpeed watches a configured timing line and records the
                intended camera crossing automatically. That removes a coach&apos;s
                manual stop reaction from the result and makes the event definition
                visible before the athlete runs.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Reviewable Finish Evidence
              </h3>
              <p className="text-body mb-6">
                TrackSpeed preserves finish evidence so a coach can inspect an
                unexpected time. A moved phone, blocked view, incorrect line, or
                other setup problem should lead to a rejected result rather than
                an invented explanation.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Stable, Repeatable Placement
              </h3>
              <p className="text-body mb-6">
                Camera side, height, angle, line position, visibility, device
                conditions, and course measurement all affect the test. Keep them
                documented and fixed. For the full validation checklist, see the{" "}
                <Link
                  href="/technology"
                  className="font-medium hover:underline"
                  style={{ color: "#5C8DB8" }}
                >
                  TrackSpeed measurement guide
                </Link>
                .
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                A Consistent Event Definition
              </h3>
              <p className="text-body mb-6">
                Beam systems and camera systems can record different physical
                events. Do not mix results across methods as if they were identical.
                Within TrackSpeed, use the same start mode, line definition, measured
                distance, and placement whenever you compare an athlete over time.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Practical Advantages
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--bg-mint)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div
                    className="font-semibold mb-2 text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    No Special Hardware
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Uses a compatible iPhone camera. Mount it securely at the
                    configured timing line before arming the session.
                  </p>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--bg-mint)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div
                    className="font-semibold mb-2 text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Works Anywhere
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Track, field, parking lot, or hallway. No permanent
                    installation, no calibration required, no wiring.
                  </p>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--bg-mint)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div
                    className="font-semibold mb-2 text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Multiple Timing Points
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Place phones at start, split, and finish positions. Confirm
                    that every phone is connected, armed, stable, and showing the
                    correct line before the rep.
                  </p>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--bg-mint)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div
                    className="font-semibold mb-2 text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Instant Results
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Times appear on screen within a second of the crossing. No
                    waiting for film development or manual operator review.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Competition vs Training */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">
                6
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                When You Need Official Timing vs. Training Timing
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                It is important to understand when certified FAT timing is
                required and when a training-grade alternative is not just
                acceptable but actually preferable.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Competition: Certified FAT Required
              </h3>
              <p className="text-body mb-6">
                For sanctioned meets, record attempts, and any result that will
                appear in official rankings, governing bodies like World
                Athletics, the NCAA, and national federations require certified
                FAT systems. The equipment must be inspected, calibrated, and
                operated by licensed officials. There is no shortcut
                here&mdash;if the result counts officially, it needs official
                equipment.
              </p>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Training: Consistency Matters More Than Absolute Accuracy
              </h3>
              <p className="text-body mb-6">
                In day-to-day training, the goal is different. Athletes and
                coaches need to measure improvement, compare efforts across
                sessions, and evaluate the effect of technique changes. For
                these purposes, what matters most is not that the time matches
                what a $10,000 FAT system would produce, but that the timing
                method is consistent&mdash;giving the same result for the same
                performance, session after session.
              </p>

              <p className="text-body mb-6">
                A system that consistently measures 10.35 seconds for a given
                performance level is more useful for training than a stopwatch
                that fluctuates between 10.1 and 10.6 depending on the
                operator&apos;s reaction time. Consistent relative timing lets
                you track progress with confidence even if the absolute number
                differs slightly from what an official system would record.
              </p>

              {/* Comparison table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{ borderBottom: "1px solid var(--border-light)" }}
                    >
                      <th
                        className="text-left py-3 pr-4 font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Context
                      </th>
                      <th
                        className="text-left py-3 px-4 font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        What Matters
                      </th>
                      <th
                        className="text-left py-3 pl-4 font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Best Tool
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--text-muted)" }}>
                    <tr
                      style={{ borderBottom: "1px solid var(--border-light)" }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Official meet
                      </td>
                      <td className="py-3 px-4">
                        Absolute accuracy, 0.01s resolution
                      </td>
                      <td className="py-3 pl-4">Certified FAT</td>
                    </tr>
                    <tr
                      style={{ borderBottom: "1px solid var(--border-light)" }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Tryouts / time trials
                      </td>
                      <td className="py-3 px-4">
                        Consistency across athletes
                      </td>
                      <td className="py-3 pl-4">FAT or consistent automated</td>
                    </tr>
                    <tr
                      style={{ borderBottom: "1px solid var(--border-light)" }}
                    >
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Daily practice
                      </td>
                      <td className="py-3 px-4">
                        Repeatable measurement, session tracking
                      </td>
                      <td
                        className="py-3 pl-4"
                        style={{ color: "var(--accent-green)" }}
                      >
                        TrackSpeed
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="py-3 pr-4 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Solo training
                      </td>
                      <td className="py-3 px-4">
                        Automated, no helper needed
                      </td>
                      <td
                        className="py-3 pl-4"
                        style={{ color: "var(--accent-green)" }}
                      >
                        TrackSpeed
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                TrackSpeed Is Designed for Training
              </h3>
              <p className="text-body">
                TrackSpeed does not claim to replace certified FAT systems and is
                not intended for official competition results. It is built for
                the 99% of timing that happens outside of meets: practice reps,
                tempo runs, acceleration drills, combine prep, and{" "}
                <Link
                  href="/blog/how-to-time-a-40-yard-dash"
                  className="font-medium hover:underline"
                  style={{ color: "#5C8DB8" }}
                >
                  40-yard dash training
                </Link>
                . In these contexts, having automated, consistent,
                sub-10-millisecond timing available at every session is
                transformative compared to the alternatives of hand timing or no
                timing at all.
              </p>
            </div>
          </section>

          {/* Further Reading */}
          <section className="mb-16">
            <div className="card-feature p-6 md:p-8">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Further Reading
              </h2>
              <p className="text-body mb-4">
                Want to dive deeper into how photo finish timing compares with
                other approaches, or learn more about the technology behind
                TrackSpeed?
              </p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/technology"
                    className="font-medium hover:underline"
                    style={{ color: "#5C8DB8" }}
                  >
                    How TrackSpeed Measures Sprint Times
                  </Link>
                  <span
                    className="text-sm ml-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    &mdash; Measurement principles, reviewable evidence, setup
                    factors, and validation boundaries
                  </span>
                </li>
                <li>
                  <Link
                    href="/blog/single-beam-vs-dual-beam-timing-gates"
                    className="font-medium hover:underline"
                    style={{ color: "#5C8DB8" }}
                  >
                    Sprint Timing Systems Compared
                  </Link>
                  <span
                    className="text-sm ml-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    &mdash; Side-by-side comparison of FAT, laser gates, radar,
                    and smartphone timing
                  </span>
                </li>
                <li>
                  <Link
                    href="/blog/how-to-time-a-40-yard-dash"
                    className="font-medium hover:underline"
                    style={{ color: "#5C8DB8" }}
                  >
                    How to Time a 40-Yard Dash with Your Phone
                  </Link>
                  <span
                    className="text-sm ml-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    &mdash; Practical setup guide for getting accurate combine
                    times
                  </span>
                </li>
                <li>
                  <Link
                    href="/#features"
                    className="font-medium hover:underline"
                    style={{ color: "#5C8DB8" }}
                  >
                    TrackSpeed Features Overview
                  </Link>
                  <span
                    className="text-sm ml-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    &mdash; See what the app can do for your training
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Bring photo finish timing to your practice
            </h2>
            <p className="text-body mb-8">
              No specialized equipment, no setup complexity. Just mount your
              phone at the finish line and start getting consistent,
              millisecond-resolution timing data.
            </p>
            <div className="flex flex-col items-center gap-4">
              <DownloadLink store="ios" className="inline-block hover:opacity-80 transition-opacity">
                <Image
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={120}
                  height={40}
                  className="h-[40px] w-auto"
                />
              </DownloadLink>
              <Link
                href="/blog"
                className="text-sm hover:underline"
                style={{ color: "#5C8DB8" }}
              >
                Read more articles
              </Link>
            </div>
          </section>

          <RelatedPosts currentSlug="what-is-photo-finish-timing" t={(key) => t(key)} tHas={(key) => t.has(key)} locale={locale} />
        </div>
      </article>
    </div>
  );
}
