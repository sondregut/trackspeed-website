"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/ScrollReveal";
import { useInView, useSpring, useMotionValue } from "framer-motion";

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1200, bounce: 0 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest).toString());
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export default function Hero() {
  const t = useTranslations("home");
  return (
    <section className="bg-hero min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <ScrollReveal>
            <div className="text-center lg:text-left">
              {/* Social proof pill */}
              <Badge variant="outline" className="mb-8 px-3 py-1.5 text-sm gap-2 rounded-full border-[var(--border-light)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <AvatarGroup>
                  <Avatar className="w-7 h-7">
                    <AvatarImage src="/testimonials/sondre-guttormsen.jpg" alt="Sondre Guttormsen" />
                    <AvatarFallback>SG</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-7 h-7">
                    <AvatarImage src="/testimonials/andreas-trajkovski.jpg" alt="Andreas Trajkovski" />
                    <AvatarFallback>AT</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-gradient-to-br from-green-200 to-green-400" />
                  </Avatar>
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-gradient-to-br from-purple-200 to-purple-400" />
                  </Avatar>
                </AvatarGroup>
                <span className="font-bold text-muted">{t("hero.socialProof")}</span>
              </Badge>

              <p className="text-hero mb-4">
                {t("hero.title")}
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-6 text-muted">
                {t("hero.subtitle")}
              </h1>

              <p className="text-body mb-8 max-w-lg mx-auto lg:mx-0">
                {t("hero.description")}
              </p>

              <div className="flex justify-center lg:justify-start mb-12">
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

              {/* Stats */}
              <div className="flex gap-8 justify-center lg:justify-start text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    ~<AnimatedNumber value={4} suffix="ms" />
                  </div>
                  <div className="text-sm text-muted">{t("hero.stats.accuracy")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    &lt;<AnimatedNumber value={1} suffix=" min" />
                  </div>
                  <div className="text-sm text-muted">{t("hero.stats.setup")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">
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
              <div className="relative w-[280px] md:w-[320px]">
                {/* Brand glow behind phone */}
                <div
                  className="absolute inset-0 -inset-x-8 -inset-y-8 rounded-[60px] blur-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(92, 141, 184, 0.1) 0%, transparent 70%)' }}
                />
                <Image
                  src="/photofinish_edit.png"
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
