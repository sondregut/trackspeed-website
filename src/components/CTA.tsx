"use client";

import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";

export default function CTA() {
  const t = useTranslations("home");
  return (
    <section className="py-24 px-6 bg-dark-section">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-on-dark">
            {t("ctaSection.title")}
          </h2>
          <p className="text-xl mb-10 max-w-xl mx-auto text-text-on-dark-muted">
            {t("ctaSection.subtitle")}
          </p>

          {/* Value props */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 mb-10">
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-text-on-dark-muted">{t("ctaSection.accuracy")}</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-text-on-dark-muted">{t("ctaSection.setup")}</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-text-on-dark-muted">{t("ctaSection.noHardware")}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <a href="https://apps.apple.com/app/trackspeed" className="inline-block hover:opacity-80 transition-opacity">
              <Image
                src="/app-store-badge.svg"
                alt="Download on the App Store"
                width={180}
                height={60}
                className="h-[52px] w-auto"
              />
            </a>
          </div>
          <p className="text-sm mt-6 text-text-on-dark-muted">
            {t("ctaSection.freeNote")}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
