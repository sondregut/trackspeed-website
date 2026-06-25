"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import PhoneMockup from "@/components/PhoneMockup";
import ScrollReveal from "@/components/ScrollReveal";

const valueProps = ["accuracy", "setup", "noHardware"] as const;

export default function CTA() {
  const t = useTranslations("home");

  return (
    <section className="relative isolate overflow-hidden bg-[#111820] px-6 py-24 text-white md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(92,141,184,0.22),transparent_30%),linear-gradient(180deg,#111820_0%,#0f151c_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_0.8fr] lg:items-center">
        <ScrollReveal>
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#9FCAB7]">
              Start timing today
            </p>
            <h2 className="max-w-3xl text-[clamp(3.2rem,7vw,6.2rem)] font-black leading-[0.9] tracking-[-0.035em] text-white">
              {t("ctaSection.title")}
            </h2>
            <p className="mt-6 max-w-xl text-xl leading-8 text-white/68">
              {t("ctaSection.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {valueProps.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-bold text-white/76 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  {t(`ctaSection.${key}`)}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <a href="https://apps.apple.com/us/app/trackspeed-sprint-timer/id6757509163" className="inline-flex transition-opacity hover:opacity-80">
                <Image
                  src="/app-store-badge.svg"
                  alt="Download on the App Store"
                  width={190}
                  height={64}
                  className="h-[56px] w-auto"
                />
              </a>
              <p className="mt-5 text-sm font-medium text-white/48">
                {t("ctaSection.freeNote")}
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="relative mx-auto min-h-[520px] w-full max-w-[520px]">
            <PhoneMockup
              src="/app-screens/templates.webp"
              alt="TrackSpeed sprint templates"
              sizes="(max-width: 1024px) 58vw, 300px"
              className="absolute left-0 top-10 w-[56%] rotate-[-7deg]"
            />
            <Image
              src="/photofinish_edit.webp"
              alt="TrackSpeed live finish result"
              width={388}
              height={800}
              sizes="(max-width: 1024px) 62vw, 330px"
              className="absolute right-0 top-0 h-auto w-[62%] rotate-[5deg] rounded-[38px] shadow-[0_42px_120px_-58px_rgba(0,0,0,0.9)]"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
