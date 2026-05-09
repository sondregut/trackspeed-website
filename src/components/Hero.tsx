"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ScrollReveal";
function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          if (prefersReducedMotion) {
            setDisplay(value.toString());
          } else {
            const start = Date.now();
            const duration = 1200;
            function tick() {
              const progress = Math.min((Date.now() - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(Math.round(value * eased).toString());
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export default function Hero() {
  const t = useTranslations("home");
  return (
    <section className="bg-hero min-h-[100dvh] flex items-start lg:items-center justify-center pt-24 pb-0 md:pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Content */}
          <ScrollReveal>
            <div className="text-center lg:text-left">
              {/* Social proof pill */}
              <Badge variant="outline" className="mb-5 px-3 py-1.5 text-sm gap-2 rounded-full border-[var(--border-light)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <AvatarGroup>
                  <Avatar className="w-7 h-7">
                    <AvatarImage src="/testimonials/sondre-guttormsen.webp" alt="Sondre Guttormsen" />
                    <AvatarFallback>SG</AvatarFallback>
                  </Avatar>
                </AvatarGroup>
                <span className="font-bold text-muted">{t("hero.socialProof")}</span>
              </Badge>

              <p className="text-hero mb-3">
                {t("hero.title")}
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-5 text-muted">
                {t("hero.subtitle")}
              </h1>

              <p className="text-body mb-6 max-w-lg mx-auto lg:mx-0">
                {t("hero.description")}
              </p>

              <div
                className="mb-7 mx-auto lg:mx-0 max-w-md rounded-2xl border border-[var(--border-light)] bg-white/90 p-4 shadow-[0_10px_30px_-20px_rgba(14,14,12,0.35)]"
                aria-label={t("hero.result.ariaLabel")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="text-left">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {t("hero.result.label")}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-foreground">
                      {t("hero.result.test")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold tabular-nums text-foreground">
                      0.99s
                    </div>
                    <div className="text-xs font-semibold tabular-nums text-[#A13A3A]">
                      10.10 m/s
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <a href="https://apps.apple.com/app/trackspeed" className="inline-block hover:opacity-80 transition-opacity">
                  <Image
                    src="/app-store-badge.svg"
                    alt="Download on the App Store"
                    width={180}
                    height={60}
                    className="h-[52px] w-auto"
                  />
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm font-semibold text-foreground underline decoration-[var(--border-light)] underline-offset-4 transition-colors hover:text-[var(--brand)]"
                >
                  {t("hero.secondaryCta")}
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-6 sm:gap-8 justify-center lg:justify-start text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    ~<AnimatedNumber value={4} suffix="ms" />
                  </div>
                  <div className="text-sm text-muted">{t("hero.stats.accuracy")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    &lt;<AnimatedNumber value={1} suffix=" min" />
                  </div>
                  <div className="text-sm text-muted">{t("hero.stats.setup")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground tabular-nums">
                    $<AnimatedNumber value={0} />
                  </div>
                  <div className="text-sm text-muted">{t("hero.stats.hardware")}</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - iPhone mockup */}
          <ScrollReveal delay={0.2}>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-[250px] md:w-[300px] lg:w-[320px]">
                {/* Brand glow behind phone */}
                <div
                  className="absolute inset-0 -inset-x-8 -inset-y-8 rounded-[60px] blur-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(92, 141, 184, 0.1) 0%, transparent 70%)' }}
                />
                <Image
                  src="/photofinish_edit.webp"
                  alt="TrackSpeed sprint timing app showing photo finish review on iPhone"
                  width={388}
                  height={800}
                  priority
                  sizes="(max-width: 768px) 280px, 320px"
                  className="w-full h-auto relative"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
