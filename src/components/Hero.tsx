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
  { value: "0", label: "Extra hardware" },
] as const;

export default function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative isolate overflow-hidden bg-[#0E171D] px-5 pt-20 text-white sm:px-6 lg:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(72,126,113,0.42),transparent_34%),linear-gradient(180deg,#0E171D_0%,#101C21_94%,#F7FAFC_94%,#F7FAFC_100%)]" />
      <div
        className="absolute inset-x-[-10%] top-[5%] h-[92%] bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('/track-lanes-ai-background.webp')" }}
      />
      <div className="absolute left-0 top-0 h-full w-[45%] bg-[linear-gradient(90deg,rgba(14,23,29,0.88),rgba(14,23,29,0))]" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-center gap-8 py-10 lg:grid-cols-[0.84fr_1.16fr] lg:py-12">
        <ScrollReveal className="min-w-0">
          <div className="w-full max-w-[20.5rem] sm:max-w-2xl">
            <Badge variant="outline" className="mb-6 gap-2 rounded-full border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white shadow-[0_20px_50px_-34px_rgba(0,0,0,0.6)] backdrop-blur">
              <AvatarGroup>
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/testimonials/sondre-guttormsen.webp" alt="Sondre Guttormsen" />
                  <AvatarFallback>SG</AvatarFallback>
                </Avatar>
              </AvatarGroup>
              <span className="font-bold text-white/78">{t("hero.socialProof")}</span>
            </Badge>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#8DDCB4]">
              TrackSpeed
            </p>
            <h1 className="max-w-[10.6ch] text-[2.85rem] font-black leading-[0.9] tracking-[-0.035em] text-white sm:max-w-[12ch] sm:text-[clamp(3.15rem,7.4vw,5.4rem)]">
              Turn your phone into a sprint timer.
            </h1>
            <p className="mt-5 max-w-full text-xl leading-8 text-white/68 sm:max-w-[34rem] md:text-[1.35rem] md:leading-8">
              Set gates, pick a start mode, run the rep, and review photo-finish proof from the phone already in your pocket.
            </p>

            <div className="mt-7 flex w-full max-w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
              <a href="https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163" className="inline-flex w-fit transition-opacity hover:opacity-80">
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
                className="inline-flex h-[54px] w-full items-center justify-center rounded-2xl border border-white/14 bg-white/10 px-6 text-sm font-bold text-white shadow-[0_18px_50px_-34px_rgba(0,0,0,0.65)] backdrop-blur transition-[transform,background-color] hover:bg-white/16 active:translate-y-px sm:w-auto"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 hidden max-w-xl grid-cols-3 gap-3 sm:grid">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.075] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                  <div className="text-2xl font-black tracking-[-0.02em] text-white">{stat.value}</div>
                  <div className="mt-1 text-sm font-semibold text-white/55">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="relative mx-auto h-[540px] w-full max-w-[740px] sm:h-[680px] lg:h-[720px]">
            <PhoneMockup
              src="/app-screens/templates.webp"
              alt="TrackSpeed sprint templates on iPhone"
              sizes="(max-width: 768px) 58vw, 360px"
              className="absolute left-[2%] top-[12%] w-[50%] rotate-[-7deg] opacity-95 sm:left-[6%] sm:w-[43%] lg:left-[2%] lg:w-[42%]"
              imageClassName="opacity-95"
            />

            <div className="absolute right-[-1%] top-[0%] w-[63%] min-w-[300px] rotate-[1deg] sm:right-[2%] sm:w-[56%] lg:right-[1%] lg:w-[55%]">
              <Image
                src="/photofinish_edit.webp"
                alt="TrackSpeed photo finish sprint timing screenshot"
                width={388}
                height={800}
                priority
                sizes="(max-width: 768px) 68vw, 430px"
                className="h-auto w-full drop-shadow-[0_42px_95px_rgba(0,0,0,0.58)]"
              />
            </div>

            <div className="absolute bottom-[11%] left-[3%] max-w-[250px] rounded-3xl border border-white/14 bg-[#11181E]/82 p-5 shadow-[0_26px_70px_-42px_rgba(0,0,0,0.85)] backdrop-blur-md sm:left-[7%]">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/46">{t("hero.result.label")}</div>
              <div className="mt-3 flex items-end justify-between gap-7">
                <div>
                  <div className="text-sm font-bold text-white">{t("hero.result.test")}</div>
                  <div className="mt-1 text-xs font-semibold text-white/48">photo-finish verified</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black tabular-nums text-white">0.99s</div>
                  <div className="text-xs font-bold tabular-nums text-[#F06A6A]">10.10 m/s</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
