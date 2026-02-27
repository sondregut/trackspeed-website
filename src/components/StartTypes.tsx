"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/ScrollReveal";

export default function StartTypes() {
  const t = useTranslations("home");
  const [selected, setSelected] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const typeKeys = ["flying", "touch", "countdown", "voice", "frame"] as const;
  const typeImages = ["/start-flying.png", "/start-touch.png", "/start-countdown.png", "/start-voice.png", "/start-frame.png"];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cardRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) {
            setSelected(index);
          }
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="start-types" ref={sectionRef} className="px-6 bg-mint-wash">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center pt-28 pb-16">
            <h2 className="text-section mb-4">
              {t("startTypes.title")}
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              {t("startTypes.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Sticky phone mockup */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div className="iphone-mockup w-[280px] mx-auto">
                <div className="iphone-screen aspect-[9/19.5] overflow-hidden">
                  <div className="relative w-full h-full">
                    {typeKeys.map((key, index) => (
                      <Image
                        key={index}
                        src={typeImages[index]}
                        alt={t(`startTypes.types.${key}.title`)}
                        width={280}
                        height={606}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                          index === selected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {typeKeys.map((key, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelected(index);
                      cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === selected ? "bg-foreground scale-125" : "bg-border"
                    }`}
                    aria-label={`View ${t(`startTypes.types.${key}.title`)}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Start type cards */}
          <div className="space-y-6 pb-28">
            {typeKeys.map((key, index) => (
              <div
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                onClick={() => setSelected(index)}
                className={`p-6 cursor-pointer transition-all duration-300 rounded-3xl ${
                  index === selected
                    ? "bg-white border-2 border-gray-900 shadow-lg scale-[1.02]"
                    : "bg-gray-100/80 border border-transparent hover:bg-gray-100"
                }`}
              >
                {/* Mobile: show image inline */}
                <div className="lg:hidden mb-4">
                  <div className="iphone-mockup w-[200px] mx-auto">
                    <div className="iphone-screen aspect-[9/19.5] overflow-hidden">
                      <Image
                        src={typeImages[index]}
                        alt={t(`startTypes.types.${key}.title`)}
                        width={200}
                        height={433}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {t(`startTypes.types.${key}.title`)}
                </h3>
                <p className="mb-3 text-muted">
                  {t(`startTypes.types.${key}.description`)}
                </p>
                <p className="text-sm font-medium text-text-secondary">
                  {t("startTypes.bestFor", { useCase: t(`startTypes.types.${key}.useCase`) })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
