"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function Features() {
  const t = useTranslations("home");

  const statKeys = ["accuracy", "sync", "hardware"] as const;

  const featureKeys = ["smartDetection", "multiDeviceSync", "instantResults", "trackProgress"] as const;

  const featureIcons = [
    <svg key="eye" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>,
    <svg key="phone" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>,
    <svg key="bolt" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    <svg key="chart" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>,
  ];

  return (
    <section id="features" className="section-padding px-6 bg-mint-wash">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-section mb-4">
              {t("features.title")}
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Stats bar */}
        <StaggerContainer className="grid grid-cols-3 gap-4 mb-16">
          {statKeys.map((key, index) => (
            <StaggerItem key={index}>
              <Card className="border-[var(--border-light)] rounded-[20px] py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <CardContent className="text-center p-0">
                  <div className="text-3xl md:text-4xl font-bold mb-1 text-foreground">
                    {t(`features.stats.${key}.value`)}
                  </div>
                  <div className="text-sm text-muted">{t(`features.stats.${key}.label`)}</div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Feature grid */}
        <StaggerContainer className="grid md:grid-cols-2 gap-4">
          {featureKeys.map((key, index) => (
            <StaggerItem key={index}>
              <Card className="border-[var(--border-light)] rounded-3xl py-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-[#D1D5DB] transition-all">
                <CardContent className="flex gap-4 p-7">
                  <div className="icon-box flex-shrink-0">
                    {featureIcons[index]}
                  </div>
                  <div>
                    <h3 className="text-card-title mb-1">{t(`features.${key}.title`)}</h3>
                    <p className="text-sm text-muted">{t(`features.${key}.description`)}</p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
