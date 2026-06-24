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
          <div className="relative mx-auto h-[400px] w-full max-w-[430px] sm:h-[500px] sm:max-w-[560px] lg:h-[560px] lg:max-w-[620px]">
            <div className="absolute left-[2%] top-10 h-[76%] w-[47%] rotate-[-6deg] rounded-[42px] bg-[#163234]/70 blur-2xl" />
            <div className="absolute right-[2%] top-10 h-[76%] w-[47%] rotate-[6deg] rounded-[42px] bg-[#2A4D5B]/70 blur-2xl" />
            <div className="relative z-10 grid h-full grid-cols-2 items-start gap-1 pt-8 sm:gap-3 sm:pt-9 lg:pt-10">
              <PhoneMockup
                src="/app-screens/connect-host.webp"
                alt="Host phone waiting for TrackSpeed connection"
                sizes="(max-width: 640px) 168px, (max-width: 1024px) 220px, 250px"
                className="w-full max-w-[168px] justify-self-end rotate-[-6deg] sm:max-w-[220px] lg:max-w-[250px]"
              />
              <PhoneMockup
                src="/app-screens/join-searching.webp"
                alt="Join phone connecting to TrackSpeed session"
                sizes="(max-width: 640px) 168px, (max-width: 1024px) 220px, 250px"
                className="w-full max-w-[168px] justify-self-start rotate-[6deg] sm:max-w-[220px] lg:max-w-[250px]"
              />
            </div>
            <div className="absolute left-1/2 top-[48%] z-10 h-14 w-14 -translate-x-1/2 rounded-full border border-white/16 bg-white/12 p-3 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.9)] backdrop-blur sm:h-16 sm:w-16">
              <div className="h-full w-full rounded-full bg-[#8FD9B0] shadow-[0_0_42px_rgba(143,217,176,0.55)]" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
