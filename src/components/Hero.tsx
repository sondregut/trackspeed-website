"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PhoneMockup from "@/components/PhoneMockup";
import ScrollReveal from "@/components/ScrollReveal";

const heroStats = [
  { value: "~4ms", label: "Timing accuracy" },
  { value: "2+ phones", label: "Wireless gates" },
  { value: "$0", label: "Extra hardware" },
] as const;

export default function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative isolate overflow-hidden bg-[#F8FAF9] px-6 pt-20 lg:pt-24">
      <div className="absolute inset-x-0 top-0 h-[78%] bg-[linear-gradient(180deg,#ffffff_0%,#f3f7f5_62%,#e8f1ed_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[#102528]" />
      <div className="absolute inset-x-[-12%] bottom-[-14%] h-[42%] rotate-[-7deg] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.10)_0_2px,transparent_2px_132px)] opacity-60" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-12">
        <ScrollReveal>
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-6 gap-2 rounded-full border-white bg-white/90 px-3 py-1.5 text-sm shadow-[0_20px_50px_-34px_rgba(15,23,42,0.45)]">
              <AvatarGroup>
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/testimonials/sondre-guttormsen.webp" alt="Sondre Guttormsen" />
                  <AvatarFallback>SG</AvatarFallback>
                </Avatar>
              </AvatarGroup>
              <span className="font-bold text-muted">{t("hero.socialProof")}</span>
            </Badge>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#496173]">
              TrackSpeed
            </p>
            <h1 className="max-w-[12ch] text-[clamp(3.15rem,7.4vw,5.2rem)] font-black leading-[0.9] tracking-[-0.035em] text-[#101418]">
              Turn your phone into a sprint timer.
            </h1>
            <p className="mt-5 max-w-[34rem] text-xl leading-8 text-[#52606f] md:text-[1.35rem] md:leading-8">
              Set gates, pick a start mode, run the rep, and review photo-finish proof from the phone already in your pocket.
            </p>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href="https://apps.apple.com/app/trackspeed" className="inline-flex w-fit transition-opacity hover:opacity-80">
                <Image
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={180}
                  height={60}
                  priority
                  className="h-[54px] w-auto"
                />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex h-[54px] w-full items-center justify-center rounded-2xl border border-[#d9e1e7] bg-white px-6 text-sm font-bold text-[#111827] shadow-[0_18px_50px_-34px_rgba(15,23,42,0.55)] transition-[transform,background-color] hover:bg-[#f7fafc] active:translate-y-px sm:w-auto"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_20px_56px_-42px_rgba(15,23,42,0.6)]">
                  <div className="text-2xl font-black tracking-[-0.02em] text-[#111827]">{stat.value}</div>
                  <div className="mt-1 text-sm font-semibold text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="relative min-h-[560px] lg:min-h-[640px]">
            <PhoneMockup
              src="/app-screens/connect-host.webp"
              alt="TrackSpeed wireless two-phone timing setup"
              sizes="260px"
              className="absolute left-[4%] top-[7%] hidden w-[32%] rotate-[-8deg] md:block"
            />

            <div className="absolute right-0 top-[1%] w-[52%] min-w-[278px] lg:w-[48%]">
              <Image
                src="/photofinish_edit.webp"
                alt="TrackSpeed photo finish sprint timing screenshot"
                width={388}
                height={800}
                priority
                sizes="(max-width: 768px) 56vw, 390px"
                className="h-auto w-full drop-shadow-[0_42px_90px_rgba(15,23,42,0.34)]"
              />
            </div>

            <PhoneMockup
              src="/app-screens/start-types.webp"
              alt="TrackSpeed start modes screenshot"
              sizes="310px"
              className="absolute bottom-[4%] left-[20%] w-[42%] md:left-[24%] lg:w-[38%]"
            />

            <div className="absolute bottom-[22%] left-[2%] max-w-[240px] rounded-3xl border border-white/80 bg-white/92 p-5 shadow-[0_26px_70px_-42px_rgba(15,23,42,0.65)] backdrop-blur">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{t("hero.result.label")}</div>
              <div className="mt-3 flex items-end justify-between gap-8">
                <div>
                  <div className="text-sm font-bold text-[#111827]">{t("hero.result.test")}</div>
                  <div className="mt-1 text-xs font-semibold text-muted">photo-finish verified</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black tabular-nums text-[#111827]">0.99s</div>
                  <div className="text-xs font-bold tabular-nums text-[#A13A3A]">10.10 m/s</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
