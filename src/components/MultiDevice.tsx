"use client";

import Image from "next/image";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function MultiDevice() {
  const features = [
    {
      title: "Wireless Connection",
      description: "Phones connect automatically via peer-to-peer WiFi. No internet required.",
    },
    {
      title: "Millisecond-Accurate Sync",
      description: "NTP-style clock synchronization ensures accurate timing across devices.",
    },
    {
      title: "Unlimited Gates",
      description: "Add split timing with 3+ phones. Track acceleration phases and top speed.",
    },
  ];

  return (
    <section id="multi-device" className="section-padding px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div>
              <h2 className="text-section mb-6">
                Connect multiple phones for precise timing
              </h2>
              <p className="text-body mb-10">
                Use one iPhone at the start line and another at the finish.
                Add more phones for split times at any distance.
              </p>

              <StaggerContainer className="space-y-6">
                {features.map((feature, index) => (
                  <StaggerItem key={index}>
                    <div className="flex gap-4">
                      <div className="icon-box flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-foreground">{feature.title}</h3>
                        <p className="text-muted">{feature.description}</p>
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
