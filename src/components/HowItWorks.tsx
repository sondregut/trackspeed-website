"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function HowItWorks() {
  const t = useTranslations("home");

  const stepKeys = ["connect", "start", "position", "time"] as const;
  const stepImages = ["/connect.png", "/tracksetup.png", "/setup.png", "/countdownstart.png"];

  return (
    <section id="how-it-works" className="section-padding px-6 bg-sky-wash">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-section mb-4">{t("howItWorks.title")}</h2>
            <p className="text-body max-w-2xl mx-auto">
              {t("howItWorks.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stepKeys.map((key, index) => (
            <StaggerItem key={index}>
              <div className="flex flex-col items-center text-center">
                {/* Phone screenshot with built-in frame */}
                <div className="w-[180px] mb-8">
                  <Image
                    src={stepImages[index]}
                    alt={t(`howItWorks.steps.${key}.title`)}
                    width={368}
                    height={750}
                    className="w-full h-auto"
                  />
                </div>

                {/* Step label */}
                <span className="text-sm font-semibold uppercase tracking-widest mb-2 text-muted">
                  {t("howItWorks.step", { number: index + 1 })}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {t(`howItWorks.steps.${key}.title`)}
                </h3>

                {/* Description */}
                <p className="text-base max-w-[260px] text-muted">
                  {t(`howItWorks.steps.${key}.description`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
