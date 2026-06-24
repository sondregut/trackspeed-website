"use client";

import { useTranslations } from "next-intl";
import PhoneMockup from "@/components/PhoneMockup";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const featureKeys = ["wirelessConnection", "millisecondSync", "unlimitedGates"] as const;

export default function MultiDevice() {
  const t = useTranslations("home");

  return (
    <section id="multi-device" className="relative isolate overflow-hidden bg-[#102528] px-6 py-24 text-white md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(34,197,94,0.16),transparent_28%),linear-gradient(180deg,#102528_0%,#18252f_100%)]" />
      <div className="absolute inset-x-[-12%] bottom-[-15%] h-[55%] rotate-[-7deg] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_132px)] opacity-65" />

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.82fr_1fr] lg:items-center">
        <ScrollReveal>
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#8FD9B0]">
              Wireless timing gates
            </p>
            <h2 className="max-w-2xl text-[clamp(3rem,6vw,5.4rem)] font-black leading-[0.92] tracking-[-0.035em]">
              {t("multiDevice.title")}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/68">
              {t("multiDevice.description")}
            </p>

            <StaggerContainer className="mt-10 grid gap-4">
              {featureKeys.map((key) => (
                <StaggerItem key={key}>
                  <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <div className="flex gap-4">
                      <div className="mt-1 h-3 w-3 rounded-full bg-[#8FD9B0] shadow-[0_0_0_7px_rgba(143,217,176,0.12)]" />
                      <div>
                        <h3 className="text-lg font-black tracking-[-0.01em] text-white">
                          {t(`multiDevice.${key}.title`)}
                        </h3>
                        <p className="mt-1 leading-7 text-white/62">
                          {t(`multiDevice.${key}.description`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="relative mx-auto min-h-[620px] w-full max-w-[650px]">
            <div className="absolute -left-6 top-12 hidden rounded-3xl border border-white/10 bg-white/[0.08] px-5 py-4 text-sm font-bold text-white/72 shadow-[0_24px_70px_-48px_rgba(0,0,0,0.85)] backdrop-blur md:block">
              Start and finish phones stay in sync
            </div>
            <div className="absolute left-[2%] top-4 h-[560px] w-[47%] rotate-[-7deg] rounded-[42px] bg-[#163234]/70 blur-2xl" />
            <div className="absolute right-[2%] top-20 h-[540px] w-[47%] rotate-[6deg] rounded-[42px] bg-[#2A4D5B]/70 blur-2xl" />
            <PhoneMockup
              src="/app-screens/connect-host.webp"
              alt="Host phone waiting for TrackSpeed connection"
              sizes="(max-width: 1024px) 45vw, 300px"
              className="absolute left-[1%] top-4 w-[49%] rotate-[-7deg]"
            />
            <PhoneMockup
              src="/app-screens/join-searching.webp"
              alt="Join phone connecting to TrackSpeed session"
              sizes="(max-width: 1024px) 48vw, 320px"
              className="absolute right-[1%] top-24 w-[53%] rotate-[6deg]"
            />
            <div className="absolute left-1/2 top-[44%] z-10 h-16 w-16 -translate-x-1/2 rounded-full border border-white/16 bg-white/12 p-3 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.9)] backdrop-blur">
              <div className="h-full w-full rounded-full bg-[#8FD9B0] shadow-[0_0_42px_rgba(143,217,176,0.55)]" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
