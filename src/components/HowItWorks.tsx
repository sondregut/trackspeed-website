"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import PhoneMockup from "@/components/PhoneMockup";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const stepKeys = ["connect", "start", "position", "time"] as const;
const stepVisuals = [
  { type: "screen", src: "/app-screens/connect-host.webp" },
  { type: "screen", src: "/app-screens/start-types.webp" },
  { type: "screen", src: "/app-screens/custom-session.webp" },
  { type: "photo", src: "/photofinish_edit.webp" },
] as const;

export default function HowItWorks() {
  const t = useTranslations("home");

  return (
    <section id="how-it-works" className="section-padding overflow-hidden px-6 bg-[#F7FAFC]">
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
          {stepKeys.map((key, index) => (
            <StaggerItem key={key}>
              <article className="group h-full overflow-hidden rounded-[32px] border border-[#E1E7ED] bg-white shadow-[0_26px_80px_-60px_rgba(15,23,42,0.55)]">
                <div className="relative bg-[#EEF4F6] px-6 pt-7">
                  <div className="absolute left-6 top-6 z-10 rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[#536879] shadow-[0_14px_36px_-24px_rgba(15,23,42,0.6)]">
                    {t("howItWorks.step", { number: index + 1 })}
                  </div>
                  {stepVisuals[index].type === "screen" ? (
                    <PhoneMockup
                      src={stepVisuals[index].src}
                      alt={t(`howItWorks.steps.${key}.title`)}
                      sizes="(max-width: 768px) 72vw, (max-width: 1200px) 34vw, 255px"
                      className="mx-auto w-[78%] transition-transform duration-500 group-hover:-translate-y-1"
                    />
                  ) : (
                    <Image
                      src={stepVisuals[index].src}
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
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
