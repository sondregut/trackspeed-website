import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Achieve ~4ms Timing Accuracy - TrackSpeed",
  description:
    "A deep dive into the computer vision, trajectory analysis, and physics-based corrections that enable millisecond-precision timing with your iPhone.",
};

export default function TechnologyPage() {
  return (
    <div className="bg-hero min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/#timing-technology"
            className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
          >
            How We Achieve ~4ms Timing Accuracy with Your iPhone
          </h1>
          <p className="text-lg md:text-xl" style={{ color: "var(--text-muted)" }}>
            The challenge: cameras capture discrete frames, but athletes cross finish lines between frames. Here&apos;s
            how we solve it with computer vision, trajectory analysis, and physics-based corrections.
          </p>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Motion Detection Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">1</div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                Motion Detection
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Before we can time a crossing, we need to reliably detect when an athlete enters and moves through the
                frame. This happens in several stages.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Frame Differencing
              </h3>
              <p className="text-body mb-6">
                We compare consecutive frames to identify what&apos;s changed—anything that moved between frames shows up
                as a difference. By working at a reduced resolution, we keep this process fast enough to run at 120fps
                in real-time.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Connected Component Analysis
              </h3>
              <p className="text-body mb-6">
                The motion differences form &quot;blobs&quot; in the image. We use connected component analysis to group
                adjacent pixels together and identify distinct moving objects. The largest blob that meets our size
                threshold (significant enough to be a person) becomes the target we track.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Adaptive Noise Calibration
              </h3>
              <p className="text-body mb-6">
                Environmental conditions vary—wind moving grass, flickering lights, or camera sensor noise. During a
                brief warmup period, we measure the baseline noise level and adapt our detection thresholds accordingly.
                This prevents false triggers while maintaining sensitivity to actual movement.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                IMU Stability Gate
              </h3>
              <p className="text-body">
                Even a tripod-mounted phone can wobble. We use the iPhone&apos;s gyroscope to detect camera shake. The
                detector only arms once the device has been stable for a sufficient period. If the phone moves during
                timing, we can distinguish camera motion from athlete motion.
              </p>
            </div>
          </section>

          {/* Trajectory Analysis Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">2</div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                Trajectory Analysis & Sub-Frame Interpolation
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                At 120fps, each frame represents 8.3 milliseconds. But athletes rarely cross the gate exactly when a
                frame is captured. The real crossing happens somewhere between frames—and we need to find exactly where.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Multi-Frame Position Tracking
              </h3>
              <p className="text-body mb-6">
                We don&apos;t just look at two frames. We maintain a buffer of recent positions, tracking where the
                athlete&apos;s leading edge was across multiple frames. This gives us a trajectory—a history of movement
                that we can analyze.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Linear Regression
              </h3>
              <p className="text-body mb-6">
                With multiple position samples, we fit a line to the trajectory using linear regression. This tells us
                the athlete&apos;s velocity and allows us to calculate exactly when they crossed the gate line—even if
                that moment fell between frame captures.
              </p>

              {/* Formula visualization */}
              <div
                className="bg-[var(--bg-mint)] rounded-xl p-4 mb-6 font-mono text-center"
                style={{ border: "1px solid var(--border-light)" }}
              >
                <div className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  Position = Velocity × Time + Offset
                </div>
                <div className="text-sm" style={{ color: "var(--accent-green)" }}>
                  Solve for Time when Position = Gate Line
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Why Regression Beats Simple Interpolation
              </h3>
              <p className="text-body">
                A naive approach would just look at the two frames immediately before and after the crossing and
                interpolate linearly. But this is sensitive to noise in those specific frames. By using multiple frames,
                regression averages out measurement noise and gives us a more accurate velocity estimate—and therefore a
                more accurate crossing time.
              </p>
            </div>
          </section>

          {/* Rolling Shutter Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">3</div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                Rolling Shutter Correction
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                This is where physics meets photography. iPhone cameras don&apos;t capture the entire frame at once—they
                scan from top to bottom, one row of pixels at a time.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                How Rolling Shutter Works
              </h3>
              <p className="text-body mb-6">
                When you take a photo or video frame, the camera starts reading from the top row of pixels and works its
                way down. The bottom of the frame is captured several milliseconds after the top. At 120fps, this
                &quot;readout time&quot; is around 5ms. At 30fps, it can be 12ms or more.
              </p>

              {/* Rolling shutter diagram */}
              <div
                className="bg-[var(--bg-mint)] rounded-xl p-6 mb-6"
                style={{ border: "1px solid var(--border-light)" }}
              >
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div
                      className="w-16 h-24 rounded-lg mb-2 relative overflow-hidden"
                      style={{ border: "2px solid var(--border-light)" }}
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-1/3"
                        style={{ background: "var(--accent-green)", opacity: 0.3 }}
                      ></div>
                      <div className="absolute inset-x-0 top-1/3 h-1/3" style={{ background: "#FEF3C7" }}></div>
                      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "#FEE2E2" }}></div>
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Top = earliest
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Bottom = latest
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                      5-12ms
                    </div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                      scan time
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Why This Matters
              </h3>
              <p className="text-body mb-6">
                If an athlete crosses near the top of the frame, that position was captured at the start of the frame&apos;s
                timestamp. If they cross near the bottom, that position was captured up to 12ms later—but both get the
                same frame timestamp. Without correction, you could have systematic errors of 5-12ms.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Our Compensation
              </h3>
              <p className="text-body">
                We measure where vertically in the frame the athlete crossed the gate line. Then we add a time offset
                proportional to that position—crossings near the bottom of the frame get a larger time adjustment. This
                eliminates what would otherwise be a significant source of systematic error.
              </p>
            </div>
          </section>

          {/* Clock Sync Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">4</div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                Multi-Device Clock Synchronization
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                When using two iPhones—one at the start and one at the finish—their clocks need to agree. Even a few
                milliseconds of drift would wipe out all our sub-frame precision.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                The Clock Drift Problem
              </h3>
              <p className="text-body mb-6">
                Every device has a crystal oscillator that keeps time. These are remarkably accurate, but not
                perfect—they can drift by several parts per million. Over an hour, two iPhones might drift apart by
                hundreds of milliseconds.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                NTP-Style Synchronization
              </h3>
              <p className="text-body mb-6">
                We use a protocol inspired by the Network Time Protocol. The devices exchange ping-pong messages,
                measuring the round-trip time. From the timestamps of when messages were sent and received, we can
                calculate the clock offset between devices.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Statistical Filtering
              </h3>
              <p className="text-body mb-6">
                Network latency varies—sometimes a message takes longer due to interference or processing delays. We
                take many measurements and keep only the samples with the lowest round-trip times (the cleanest
                measurements). Then we compute the median offset, which is robust against outliers.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Continuous Drift Tracking
              </h3>
              <p className="text-body">
                For longer sessions, we don&apos;t just sync once. We periodically re-measure the offset and track how
                the clocks are drifting relative to each other. This keeps accuracy stable even during extended training
                sessions.
              </p>
            </div>
          </section>

          {/* Chest Detection Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">5</div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                Body Detection vs. Laser Gates
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                Traditional laser gate timing systems trigger when something—anything—breaks the beam. This sounds
                simple, but it creates a consistency problem.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                The &quot;First Break&quot; Problem
              </h3>
              <p className="text-body mb-6">
                When a sprinter runs through a laser gate, what breaks the beam first? It could be their chest, but it
                could also be an outstretched arm, a leading knee, or their head if they&apos;re leaning. The trigger
                point varies based on running form, arm swing, and lean angle.
              </p>

              <p className="text-body mb-6">
                Athletes with pronounced arm swing can trigger a laser gate 100-200ms before their chest crosses. This
                creates inconsistency: the same athlete might get different trigger points on different runs based on
                subtle form variations.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Our Approach: Track the Body Mass
              </h3>
              <p className="text-body mb-6">
                Instead of triggering on &quot;first break,&quot; we analyze the motion to find the largest moving
                region—the athlete&apos;s torso. We then track the leading edge of this body mass as it approaches and
                crosses the gate line.
              </p>

              {/* Comparison visualization */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl p-4" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
                  <div className="font-semibold mb-2" style={{ color: "#991B1B" }}>
                    Laser Gates
                  </div>
                  <ul className="text-sm space-y-1" style={{ color: "#991B1B" }}>
                    <li>Triggers on first beam break</li>
                    <li>Could be arm, leg, or chest</li>
                    <li>Varies with running form</li>
                    <li>Inconsistent trigger point</li>
                  </ul>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)" }}
                >
                  <div className="font-semibold mb-2" style={{ color: "var(--accent-green)" }}>
                    TrackSpeed
                  </div>
                  <ul className="text-sm space-y-1" style={{ color: "#166534" }}>
                    <li>Tracks body mass region</li>
                    <li>Identifies torso leading edge</li>
                    <li>Consistent across form variations</li>
                    <li>Matches official timing protocol</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Matching Official Standards
              </h3>
              <p className="text-body">
                In official track timing, it&apos;s the athlete&apos;s torso (specifically the chest) crossing the line
                that counts—not their arm or foot. Our approach naturally aligns with this standard, providing more
                consistent and comparable results across different athletes and running styles.
              </p>
            </div>
          </section>

          {/* Putting It Together Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ background: "rgba(34, 197, 94, 0.15)", color: "var(--accent-green)" }}
              >
                ✓
              </div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                Putting It All Together
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">Each component contributes to the final accuracy:</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-24 text-right font-mono text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    8.3ms
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Frame Interval
                    </div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                      The theoretical resolution at 120fps
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-24 text-right font-mono text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ~0.5ms
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Trajectory Regression
                    </div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                      Sub-frame precision from multi-frame analysis
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-24 text-right font-mono text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    5-12ms
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Rolling Shutter Correction
                    </div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                      Eliminates systematic scan-time error
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-24 text-right font-mono text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ±3-5ms
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Clock Synchronization
                    </div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                      Device-to-device time alignment
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl p-6 text-center"
                style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)" }}
              >
                <div className="text-4xl font-bold mb-2" style={{ color: "var(--accent-green)" }}>
                  ~4ms
                </div>
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Combined effective timing accuracy
                </div>
              </div>
            </div>
          </section>

          {/* Frame Rate Options Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box flex-shrink-0 w-10 h-10 text-lg font-bold">6</div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                Why 30fps and 60fps Also Work
              </h2>
            </div>
            <div className="card-feature p-6 md:p-8">
              <p className="text-body mb-6">
                You might wonder: if 120fps gives the best timing, why offer lower frame rates? The answer involves
                thermal management and the power of our trajectory analysis.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                The Thermal Challenge
              </h3>
              <p className="text-body mb-6">
                Running a camera at 120fps generates significant heat. During long training sessions or on hot days,
                your iPhone may throttle performance to prevent overheating. Lower frame rates generate less heat,
                allowing for longer continuous operation.
              </p>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                Sub-Frame Interpolation Saves the Day
              </h3>
              <p className="text-body mb-6">
                Here&apos;s the key insight: our trajectory regression doesn&apos;t just work between frames—it works
                across the larger gaps too. At 30fps, frames are 33ms apart. But by tracking position across multiple
                frames and fitting a trajectory, we can still calculate the crossing time with high precision.
              </p>

              <p className="text-body mb-6">
                The math is the same whether frames are 8.3ms or 33ms apart. As long as we have enough samples to
                establish a reliable trajectory, we can interpolate the exact crossing moment.
              </p>

              {/* FPS comparison */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "var(--bg-mint)", border: "1px solid var(--border-light)" }}
                >
                  <div className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                    30fps
                  </div>
                  <div className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                    33ms between frames
                  </div>
                  <div className="text-xs font-medium" style={{ color: "var(--accent-green)" }}>
                    Lowest heat
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Best for long sessions
                  </div>
                </div>
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "var(--bg-mint)", border: "1px solid var(--border-light)" }}
                >
                  <div className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                    60fps
                  </div>
                  <div className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                    16.7ms between frames
                  </div>
                  <div className="text-xs font-medium" style={{ color: "var(--accent-green)" }}>
                    Balanced
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Good accuracy + duration
                  </div>
                </div>
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: "var(--bg-mint)", border: "1px solid var(--border-light)" }}
                >
                  <div className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                    120fps
                  </div>
                  <div className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                    8.3ms between frames
                  </div>
                  <div className="text-xs font-medium" style={{ color: "var(--accent-green)" }}>
                    Most precise
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Best thumbnail accuracy
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                The Tradeoff: Thumbnail Quality
              </h3>
              <p className="text-body">
                The main difference you&apos;ll notice is in the finish photo thumbnail. At 120fps, we can show you a
                frame that&apos;s within ~4ms of the actual crossing. At 30fps, the closest frame might be up to 16ms
                away. The calculated time remains accurate either way—but the photo won&apos;t be as perfectly timed.
                For training purposes, this is usually an acceptable tradeoff for the ability to time more athletes
                without your phone overheating.
              </p>
            </div>
          </section>

          {/* Comparison Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              How This Compares to Professional Systems
            </h2>
            <div className="card-feature p-6 md:p-8">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <th className="text-left py-3 pr-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                        System
                      </th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                        Resolution
                      </th>
                      <th className="text-left py-3 px-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                        Detection
                      </th>
                      <th className="text-left py-3 pl-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "var(--text-muted)" }}>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>
                        FAT (Official)
                      </td>
                      <td className="py-3 px-4">0.001s</td>
                      <td className="py-3 px-4">Photo finish camera</td>
                      <td className="py-3 pl-4">$10,000+</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td className="py-3 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>
                        Laser Gates
                      </td>
                      <td className="py-3 px-4">±50-200ms*</td>
                      <td className="py-3 px-4">First beam break</td>
                      <td className="py-3 pl-4">$500-2000</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium" style={{ color: "var(--accent-green)" }}>
                        TrackSpeed
                      </td>
                      <td className="py-3 px-4">~4ms</td>
                      <td className="py-3 px-4">Body tracking</td>
                      <td className="py-3 pl-4">Your iPhone</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs" style={{ color: "var(--text-muted)" }}>
                *Laser gates trigger with sub-millisecond speed, but inconsistent trigger points (arm vs chest)
                can cause 50-200ms variation between runs for the same athlete.
              </div>

              <div className="mt-4 p-4 rounded-xl" style={{ background: "var(--bg-mint)", border: "1px solid var(--border-light)" }}>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Note:</strong> TrackSpeed is designed for training
                  and unofficial timing. For official competitions, use certified timing equipment as required by your
                  sport&apos;s governing body.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Ready to time your training?
            </h2>
            <p className="text-body mb-8">Download TrackSpeed and experience millisecond precision with just your iPhone.</p>
            <a
              href="https://apps.apple.com/app/trackspeed-sprint-timer/id6739832765"
              className="btn-primary inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on the App Store
            </a>
          </section>
        </div>
      </article>
    </div>
  );
}
