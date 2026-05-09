"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/ScrollReveal";

export default function Testimonials() {
  const t = useTranslations("home");

  return (
    <section className="section-padding px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
          <ScrollReveal>
            <a
              href="https://instagram.com/sondre_pv"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-light)] bg-[#0E0E0C] shadow-[0_24px_60px_-36px_rgba(14,14,12,0.65)]">
                <Image
                  src="/testimonials/sondre-guttormsen.webp"
                  alt={`${t("testimonials.sondre.name")}, ${t("testimonials.sondre.role")}`}
                  width={640}
                  height={800}
                  sizes="(max-width: 1024px) 100vw, 430px"
                  className="aspect-[4/5] w-full object-cover opacity-95 transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0E0E0C] via-[#0E0E0C]/75 to-transparent p-5 pt-24">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-base font-bold text-white">
                        {t("testimonials.sondre.name")}
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        {t("testimonials.sondre.role")}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      @sondre_pv
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
                {t("testimonials.kicker")}
              </p>
              <h2 className="text-section mb-5">{t("testimonials.title")}</h2>
              <p className="text-body mb-8 max-w-2xl">
                {t("testimonials.subtitle")}
              </p>

              <blockquote className="border-l-2 border-[var(--text-primary)] pl-5">
                <p className="text-xl md:text-2xl font-semibold leading-snug text-foreground">
                  &ldquo;{t("testimonials.sondre.quote")}&rdquo;
                </p>
              </blockquote>

              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[var(--border-light)] bg-white p-4">
                  <div className="text-lg font-bold tabular-nums text-foreground">
                    {t("testimonials.proof.olympian.value")}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {t("testimonials.proof.olympian.label")}
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border-light)] bg-white p-4">
                  <div className="text-lg font-bold tabular-nums text-foreground">
                    {t("testimonials.proof.hardware.value")}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {t("testimonials.proof.hardware.label")}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
