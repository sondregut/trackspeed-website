"use client";

import Image from "next/image";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Connect phones",
      description:
        "Pair your iPhones together. They sync automatically over Wi-Fi.",
      image: "/connect.png",
    },
    {
      number: "2",
      title: "Start your session",
      description:
        "Choose your start method—countdown, voice commands, or flying start.",
      image: "/tracksetup.png",
    },
    {
      number: "3",
      title: "Position your phone",
      description:
        "Place your phone at the finish line. No calibration needed.",
      image: "/setup.png",
    },
    {
      number: "4",
      title: "Get your time",
      description:
        "Run your sprint and get instant results with millisecond accuracy.",
      image: "/countdownstart.png",
    },
  ];

  return (
    <section id="how-it-works" className="section-padding px-6 bg-sky-wash">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-section mb-4">How it works</h2>
            <p className="text-body max-w-2xl mx-auto">
              Get started in under a minute
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <div className="flex flex-col items-center text-center">
                {/* Phone screenshot with built-in frame */}
                <div className="w-[180px] mb-8">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={368}
                    height={750}
                    className="w-full h-auto"
                  />
                </div>

                {/* Step label */}
                <span className="text-sm font-semibold uppercase tracking-widest mb-2 text-muted">
                  Step {step.number}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-base max-w-[260px] text-muted">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
