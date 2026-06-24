"use client";

import { useTranslations } from "next-intl";
import PhoneMockup from "@/components/PhoneMockup";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const typeKeys = ["touch", "voice", "countdown", "flying", "frame"] as const;

export default function StartTypes() {
  const t = useTranslations("home");

  return (
    <section id="start-types" className="section-padding overflow-hidden px-6 bg-[#FFF8EC]">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <ScrollReveal>
          <div className="relative mx-auto max-w-[520px] lg:mx-0">
            <div className="absolute inset-x-[-24%] bottom-[-12%] h-[48%] rotate-[-7deg] rounded-[48px] bg-[#20282E]" />
            <PhoneMockup
              src="/app-screens/start-types.webp"
              alt="TrackSpeed start type setup screen"
              sizes="(max-width: 1024px) 76vw, 420px"
              className="relative mx-auto w-[78%]"
            />
          </div>
        </ScrollReveal>

        <div>
          <ScrollReveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#8B6B34]">
              Start modes
            </p>
            <h2 className="text-section max-w-2xl">{t("startTypes.title")}</h2>
            <p className="text-body mt-5 max-w-2xl">{t("startTypes.subtitle")}</p>
          </ScrollReveal>

          <StaggerContainer className="mt-9 grid gap-3 sm:grid-cols-2">
            {typeKeys.map((key, index) => (
              <StaggerItem key={key} className={index === 0 ? "sm:col-span-2" : ""}>
                <article
                  className={[
                    "w-full rounded-[26px] border p-5 text-left",
                    index === 0
                      ? "border-[#141820] bg-white shadow-[0_22px_70px_-54px_rgba(15,23,42,0.75)]"
                      : "border-[#E8DCC6] bg-white/72",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black tracking-[-0.02em] text-[#111827]">
                        {t(`startTypes.types.${key}.title`)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {t(`startTypes.types.${key}.description`)}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#F2E7D2] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#735C35]">
                      {index + 1}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#6B7280]">
                    {t("startTypes.bestFor", { useCase: t(`startTypes.types.${key}.useCase`) })}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
