"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import PhoneMockup from "@/components/PhoneMockup";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const stepKeys = ["connect", "start", "position", "time"] as const;
const stepVisuals = [
  { type: "connection", hostSrc: "/app-screens/connect-host.webp", joinSrc: "/app-screens/join-searching.webp" },
  { type: "screen", src: "/app-screens/start-types.webp" },
  { type: "framed", src: "/setup.webp" },
  { type: "photo", src: "/photofinish_edit.webp" },
] as const;

export default function HowItWorks() {
  const t = useTranslations("home");

  return (
    <section id="how-it-works" className="section-padding scroll-mt-24 overflow-hidden px-6 bg-[#F7FAFC]">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="grid gap-6 md:grid-cols-[0.8fr_1fr] md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#5C7286]">
                Race-day setup
              </p>
              <h2 className="text-section">{t("howItWorks.title")}</h2>
            </div>
            <p className="text-body max-w-2xl md:justify-self-end md:text-right">
              {t("howItWorks.subtitle")}. Connect phones, choose the start, position the gate, and run.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {stepKeys.map((key, index) => {
            const visual = stepVisuals[index];

            return (
              <StaggerItem key={key}>
                <article className="group h-full overflow-hidden rounded-[32px] border border-[#E1E7ED] bg-white shadow-[0_26px_80px_-60px_rgba(15,23,42,0.55)]">
                  <div className="relative h-[500px] overflow-hidden bg-[#EEF4F6] px-6 pt-7 sm:h-[540px] md:h-[430px] lg:h-[430px]">
                    <div className="absolute left-6 top-6 z-10 rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#536879] shadow-[0_14px_36px_-24px_rgba(15,23,42,0.6)]">
                      {t("howItWorks.step", { number: index + 1 })}
                    </div>
                    {visual.type === "connection" ? (
                      <ConnectionStepVisual
                        hostSrc={visual.hostSrc}
                        joinSrc={visual.joinSrc}
                        title={t(`howItWorks.steps.${key}.title`)}
                      />
                    ) : visual.type === "screen" ? (
                      <PhoneMockup
                        src={visual.src}
                        alt={t(`howItWorks.steps.${key}.title`)}
                        sizes="(max-width: 768px) 72vw, (max-width: 1200px) 34vw, 255px"
                        className="mx-auto w-[78%] transition-transform duration-500 group-hover:-translate-y-1"
                      />
                    ) : (
                      <Image
                        src={visual.src}
                        alt={t(`howItWorks.steps.${key}.title`)}
                        width={388}
                        height={800}
                        sizes="(max-width: 768px) 72vw, (max-width: 1200px) 34vw, 255px"
                        className="mx-auto h-auto w-[78%] transition-transform duration-500 group-hover:-translate-y-1"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black tracking-[-0.02em] text-[#111827]">
                      {t(`howItWorks.steps.${key}.title`)}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-muted">
                      {t(`howItWorks.steps.${key}.description`)}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

function ConnectionStepVisual({
  hostSrc,
  joinSrc,
  title,
}: {
  hostSrc: string;
  joinSrc: string;
  title: string;
}) {
  return (
    <div className="relative mx-auto h-full max-w-[350px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[190px] overflow-hidden">
        <PhoneMockup
          src={joinSrc}
          alt={`${title} join phone`}
          sizes="220px"
          className="absolute left-1/2 top-[-330px] w-[74%] -translate-x-1/2 rotate-180 opacity-90 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.45)] sm:top-[-390px] md:top-[-315px]"
          imageClassName="opacity-95"
        />
      </div>

      <div className="absolute left-1/2 top-[86px] z-[1] w-[84%] -translate-x-1/2 transition-transform duration-500 group-hover:-translate-y-1 sm:top-[98px] md:top-[76px]">
        <PhoneMockup
          src={hostSrc}
          alt={title}
          sizes="(max-width: 768px) 70vw, 245px"
          className="w-full"
        />
      </div>

      <div className="absolute left-[18%] right-[18%] top-[137px] h-px bg-gradient-to-r from-transparent via-[#8DDCB4]/70 to-transparent sm:top-[150px] md:top-[126px]" />
      <div className="absolute left-1/2 top-[128px] z-[2] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 shadow-[0_18px_42px_-28px_rgba(15,23,42,0.75)] sm:top-[141px] md:top-[117px]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#72D39B]" />
      </div>
    </div>
  );
}
