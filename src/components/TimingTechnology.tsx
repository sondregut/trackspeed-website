"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function TimingTechnology() {
  const t = useTranslations("home");
  return (
    <section id="timing-technology" className="section-padding px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-section mb-4">
              {t("timingTechnology.title")}
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              {t("timingTechnology.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Main explanation card */}
        <ScrollReveal>
          <Card className="border-[var(--border-light)] rounded-3xl py-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-8">
            <CardContent className="p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left - Visual diagram */}
                <div className="relative">
                  <div className="rounded-3xl border border-[#20314A] bg-[#101927] p-4 shadow-[0_22px_50px_-30px_rgba(15,23,42,0.55)] sm:p-5">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9FB3C8]">
                          {t("timingTechnology.frameCapture")}
                        </div>
                        <div className="mt-1 max-w-[30ch] text-sm leading-snug text-white">
                          {t("timingTechnology.formulaResult")}
                        </div>
                      </div>
                      <div className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-[#B7F4D2]">
                        {t("timingTechnology.visual.estimatedCrossing")}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <TimingPanel
                        label={t("timingTechnology.visual.before")}
                        status={t("timingTechnology.visual.beforeStatus")}
                        side="before"
                      />
                      <TimingPanel
                        label={t("timingTechnology.visual.after")}
                        status={t("timingTechnology.visual.afterStatus")}
                        side="after"
                      />
                    </div>

                    <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs text-[#C7D4E4] sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                      <span className="font-mono text-[#F3B4B4]">
                        {t("timingTechnology.visual.before")}
                      </span>
                      <span className="hidden h-px w-16 bg-gradient-to-r from-[#F3B4B4] via-[#B7F4D2] to-[#7DD3FC] sm:block" />
                      <span className="font-mono text-[#7DD3FC] sm:text-right">
                        {t("timingTechnology.visual.after")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right - Explanation */}
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    {t("timingTechnology.beyondFrameByFrame")}
                  </h3>
                  <Link
                    href="/technology"
                    className="inline-flex items-center gap-1 text-sm mb-6 text-accent-green hover:opacity-70 transition-opacity"
                  >
                    {t("timingTechnology.learnHowItWorks")}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="icon-box flex-shrink-0 w-8 h-8 text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">{t("timingTechnology.motionDetection.title")}</h4>
                        <p className="text-sm text-muted">
                          {t("timingTechnology.motionDetection.description")}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="icon-box flex-shrink-0 w-8 h-8 text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">
                          {t("timingTechnology.trajectoryRegression.title")}
                        </h4>
                        <p className="text-sm text-muted">
                          {t("timingTechnology.trajectoryRegression.description")}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="icon-box flex-shrink-0 w-8 h-8 text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">{t("timingTechnology.rollingShutterCorrection.title")}</h4>
                        <p className="text-sm text-muted">
                          {t("timingTechnology.rollingShutterCorrection.description")}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold bg-[#D1FAE5] text-accent-green">
                        ✓
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">{t("timingTechnology.effectiveAccuracy.title")}</h4>
                        <p className="text-sm text-muted">
                          {t("timingTechnology.effectiveAccuracy.description")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Bottom stats */}
        <StaggerContainer className="grid md:grid-cols-3 gap-4">
          <StaggerItem>
            <Card className="border-[var(--border-light)] rounded-[20px] py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardContent className="text-center p-0">
                <div className="text-3xl font-bold mb-2 text-foreground">{t("timingTechnology.stats.frameInterval.value")}</div>
                <div className="text-sm text-muted">{t("timingTechnology.stats.frameInterval.label")}</div>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="border-[var(--border-light)] rounded-[20px] py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardContent className="text-center p-0">
                <div className="text-3xl font-bold mb-2 text-foreground">{t("timingTechnology.stats.interpolation.value")}</div>
                <div className="text-sm text-muted">
                  {t("timingTechnology.stats.interpolation.label")}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="border-[var(--border-light)] rounded-[20px] py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardContent className="text-center p-0">
                <div className="text-3xl font-bold mb-2 text-accent-green">{t("timingTechnology.stats.accuracy.value")}</div>
                <div className="text-sm text-muted">
                  {t("timingTechnology.stats.accuracy.label")}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}

type TimingPanelProps = {
  label: string;
  status: string;
  side: "before" | "after";
};

function TimingPanel({ label, status, side }: TimingPanelProps) {
  const isBefore = side === "before";
  const gateX = 206;
  const chestX = isBefore ? 138 : 232;
  const guideColor = isBefore ? "#F3B4B4" : "#7DD3FC";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#132238]">
      <svg
        viewBox="0 0 320 230"
        role="img"
        aria-label={status}
        className="block aspect-[16/11.5] w-full"
      >
        <defs>
          <linearGradient id={`trackGradient-${side}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#1D4262" />
            <stop offset="100%" stopColor="#12233B" />
          </linearGradient>
          <linearGradient id={`kitGradient-${side}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#40D5C8" />
            <stop offset="100%" stopColor="#128994" />
          </linearGradient>
          <filter id={`softShadow-${side}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#07111F" floodOpacity="0.45" />
          </filter>
        </defs>

        <rect width="320" height="230" fill={`url(#trackGradient-${side})`} />
        <rect y="150" width="320" height="80" fill="#235A83" opacity="0.5" />
        <path d="M -30 211 L 354 162" stroke="#D7E9F5" strokeOpacity="0.35" strokeWidth="2" />
        <path d="M -28 187 L 350 139" stroke="#D7E9F5" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M -24 165 L 342 118" stroke="#D7E9F5" strokeOpacity="0.22" strokeWidth="2" />
        <path d="M 0 120 C 72 96 142 86 320 92" stroke="#92B9CC" strokeOpacity="0.18" strokeWidth="18" fill="none" />

        <line x1={gateX} y1="18" x2={gateX} y2="205" stroke="#F8FBFF" strokeWidth="4" />
        <line x1={gateX} y1="18" x2={gateX} y2="205" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="10" />
        <line
          x1={Math.min(chestX, gateX)}
          y1="100"
          x2={Math.max(chestX, gateX)}
          y2="100"
          stroke={guideColor}
          strokeDasharray="5 5"
          strokeLinecap="round"
          strokeWidth="2.5"
        />

        <g filter={`url(#softShadow-${side})`}>
          <path d={`M ${chestX - 24} 132 L ${chestX - 58} 178 L ${chestX - 42} 185 L ${chestX - 6} 143 Z`} fill="#141827" />
          <path d={`M ${chestX - 7} 137 L ${chestX + 53} 165 L ${chestX + 58} 152 L ${chestX + 17} 124 Z`} fill="#141827" />
          <path d={`M ${chestX - 10} 105 L ${chestX - 54} 120 L ${chestX - 49} 132 L ${chestX - 1} 119 Z`} fill="#D8B99E" />
          <path d={`M ${chestX + 4} 103 L ${chestX + 48} 91 L ${chestX + 50} 78 L ${chestX + 9} 90 Z`} fill="#D8B99E" />
          <path
            d={`M ${chestX - 18} 82 C ${chestX + 4} 74 ${chestX + 35} 86 ${chestX + 36} 109 C ${chestX + 37} 127 ${chestX + 17} 142 ${chestX - 14} 133 C ${chestX - 23} 116 ${chestX - 27} 96 ${chestX - 18} 82 Z`}
            fill={`url(#kitGradient-${side})`}
          />
          <path d={`M ${chestX + 34} 67 C ${chestX + 52} 67 ${chestX + 62} 80 ${chestX + 55} 94 C ${chestX + 47} 106 ${chestX + 29} 101 ${chestX + 25} 87 C ${chestX + 21} 75 ${chestX + 25} 68 ${chestX + 34} 67 Z`} fill="#D8B99E" />
          <path d={`M ${chestX + 25} 69 C ${chestX + 33} 58 ${chestX + 51} 60 ${chestX + 60} 73 C ${chestX + 48} 70 ${chestX + 37} 70 ${chestX + 25} 69 Z`} fill="#1B2434" />
        </g>

        <circle cx={chestX} cy="100" r="7" fill={guideColor} stroke="#F8FBFF" strokeWidth="3" />
        <circle cx={gateX} cy="100" r="4" fill="#F8FBFF" />
      </svg>

      <div className="border-t border-white/10 bg-[#0F1A2B] px-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-white">{label}</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9FB3C8]">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
