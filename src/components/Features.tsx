"use client";

import { useTranslations } from "next-intl";
import { BarChart3, Radio, ScanLine, Timer, Zap } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function Features() {
  const t = useTranslations("home");

  const statKeys = ["accuracy", "sync", "hardware"] as const;

  const featureKeys = ["smartDetection", "multiDeviceSync", "instantResults", "trackProgress"] as const;

  const featureIcons = [ScanLine, Radio, Zap, BarChart3] as const;

  return (
    <section id="features" className="section-padding scroll-mt-24 overflow-hidden px-5 sm:px-6 bg-mint-wash">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <ScrollReveal className="lg:sticky lg:top-28">
            <div className="max-w-xl">
              <h2 className="text-section mb-5">
                {t("features.title")}
              </h2>
              <p className="text-body max-w-lg">
                {t("features.subtitle")}
              </p>
            </div>

            <div className="mt-8 rounded-[32px] border border-[#163A36]/10 bg-[#102B2A] p-5 text-white shadow-[0_24px_60px_-32px_rgba(16,43,42,0.75)] sm:p-6">
              <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5">
                <div className="min-w-0">
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-[#8DDCB4]">
                    TrackSpeed
                  </div>
                  <div className="mt-2 text-2xl font-black leading-none tracking-tight sm:text-3xl">
                    {t("features.stats.accuracy.value")}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white/62">
                    {t("features.stats.accuracy.label")}
                  </div>
                </div>
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-[#8DDCB4] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                  <Timer className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-white/10">
                {statKeys.map((key) => (
                  <div key={key} className="px-3 py-5 first:pl-0 last:pr-0 sm:px-5">
                    <div className="text-2xl font-black tracking-tight sm:text-3xl">
                      {t(`features.stats.${key}.value`)}
                    </div>
                    <div className="mt-1 text-[0.7rem] font-bold uppercase leading-snug tracking-[0.12em] text-white/48 sm:text-xs">
                      {t(`features.stats.${key}.label`)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#8DDCB4]/16 text-[#8DDCB4]">
                    <span className="absolute h-6 w-6 rounded-full border border-[#8DDCB4]/35" />
                    <span className="absolute h-4 w-4 rounded-full border border-[#8DDCB4]/55" />
                    <span className="absolute h-2.5 w-2.5 rounded-full bg-[#8DDCB4]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="h-2.5 w-3/5 rounded-full bg-white/82" />
                    <div className="mt-2 h-2 w-4/5 rounded-full bg-white/18" />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#8DDCB4]/45 to-[#8DDCB4]/20" />
                  <Radio className="h-5 w-5 text-[#8DDCB4]" strokeWidth={1.8} aria-hidden="true" />
                  <div className="h-px bg-gradient-to-r from-[#8DDCB4]/20 via-[#8DDCB4]/45 to-transparent" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4">
            {featureKeys.map((key, index) => {
              const Icon = featureIcons[index];

              return (
                <StaggerItem key={key}>
                  <div className="group rounded-[28px] border border-[#DCE7E2] bg-white/78 p-5 shadow-[0_16px_40px_-28px_rgba(15,45,42,0.35)] backdrop-blur transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#BED8CE] hover:bg-white sm:p-6">
                    <div className="flex gap-4">
                      <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-[#E1ECE7] bg-[#F5FBF8] text-[#183B36] transition-colors group-hover:border-[#BDE5D2] group-hover:bg-[#E9F8F0] sm:h-14 sm:w-14">
                        <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 pt-1">
                        <h3 className="text-card-title mb-2">{t(`features.${key}.title`)}</h3>
                        <p className="text-sm leading-6 text-muted sm:text-base">
                          {t(`features.${key}.description`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
