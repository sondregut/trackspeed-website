"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { DownloadLink } from "@/components/DownloadLink";
import ScrollReveal from "@/components/ScrollReveal";

const methods = [
  {
    name: "TrackSpeed",
    event: "Automatic crossing at a configured camera line",
    evidence: "Reviewable finish evidence",
    hardware: "iPhone; more phones for more timing points",
    scope: "Repeatable training and testing",
    highlighted: true,
  },
  {
    name: "Manual stopwatch",
    event: "A person's button press",
    evidence: "Usually a number only",
    hardware: "Stopwatch or phone",
    scope: "Simple group practice",
    highlighted: false,
  },
  {
    name: "Photocell timing gates",
    event: "An object breaking one or more beams",
    evidence: "Varies by system",
    hardware: "Gates, tripods, controller, and/or transponders",
    scope: "Dedicated training-gate workflow",
    highlighted: false,
  },
  {
    name: "Certified photo-finish FAT",
    event: "Official start signal and finish-plane image",
    evidence: "Official photo-finish image",
    hardware: "Specialized certified system",
    scope: "Official stadium competition",
    highlighted: false,
  },
] as const;

export default function Comparison() {
  return (
    <section id="comparison" className="section-padding px-6 bg-mint-wash">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-accent-green">
              Compare the recorded event
            </p>
            <h2 className="text-section mb-4">Different timing tools answer different questions</h2>
            <p className="text-body max-w-3xl mx-auto">
              A fair comparison starts with what triggers the time, what evidence
              remains afterward, and whether the result is for training or official competition.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="card-feature overflow-x-auto rounded-3xl">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <th className="p-5 font-semibold">Method</th>
                  <th className="p-5 font-semibold">What records the event</th>
                  <th className="p-5 font-semibold">Evidence</th>
                  <th className="p-5 font-semibold">Equipment</th>
                  <th className="p-5 font-semibold">Intended scope</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--text-muted)" }}>
                {methods.map((method) => (
                  <tr
                    key={method.name}
                    style={{
                      borderBottom: "1px solid var(--border-light)",
                      background: method.highlighted ? "var(--bg-sky)" : "transparent",
                    }}
                  >
                    <td className="p-5 font-semibold" style={{ color: method.highlighted ? "var(--accent-green)" : "var(--text-primary)" }}>
                      {method.name}
                    </td>
                    <td className="p-5">{method.event}</td>
                    <td className="p-5">{method.evidence}</td>
                    <td className="p-5">{method.hardware}</td>
                    <td className="p-5">{method.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-8 text-center">
            <p className="text-body max-w-3xl mx-auto">
              TrackSpeed does not replace certified FAT for official results. For
              training, keep the distance, start method, line position, placement,
              and conditions consistent, then compare like with like.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/blog/single-beam-vs-dual-beam-timing-gates"
                className="font-semibold text-[#5C8DB8] hover:underline"
              >
                Read the timing-gate evidence
              </Link>
              <span className="hidden text-muted sm:inline" aria-hidden="true">·</span>
              <Link
                href="/blog/best-app-for-tracking-sprint-speed"
                className="font-semibold text-[#5C8DB8] hover:underline"
              >
                Compare sprint speed apps
              </Link>
            </div>
            <div className="mt-8 flex justify-center">
              <DownloadLink store="ios" className="inline-block transition-opacity hover:opacity-80">
                <Image
                  src="/app-store-badge.svg"
                  alt="Download TrackSpeed on the App Store"
                  width={120}
                  height={40}
                  className="h-[40px] w-auto"
                />
              </DownloadLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
