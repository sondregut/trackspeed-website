"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function MultiDevice() {
  const t = useTranslations("home");

  const featureKeys = ["wirelessConnection", "millisecondSync", "unlimitedGates"] as const;

  return (
    <section id="multi-device" className="section-padding px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div>
              <h2 className="text-section mb-6">
                {t("multiDevice.title")}
              </h2>
              <p className="text-body mb-10">
                {t("multiDevice.description")}
              </p>

              <StaggerContainer className="space-y-6">
                {featureKeys.map((key, index) => (
                  <StaggerItem key={index}>
                    <div className="flex gap-4">
                      <div className="icon-box flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-foreground">{t(`multiDevice.${key}.title`)}</h3>
                        <p className="text-muted">{t(`multiDevice.${key}.description`)}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex justify-center lg:justify-end">
              <div className="w-[280px] md:w-[320px]">
                <Image
                  src="/connect.png"
                  alt="Multiple phones connected for timing"
                  width={1150}
                  height={2369}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
