"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function StartTypes() {
  const [selected, setSelected] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const startTypes = [
    {
      title: "Flying Start",
      description: "Run through at full speed. First gate crossing starts the timer automatically. Perfect for max velocity testing.",
      useCase: "Speed testing, flying 10m/20m/30m",
      image: "/start-flying.png",
    },
    {
      title: "Touch Release",
      description: "Place finger on screen, lift to start. Captures reaction time just like blocks at a real track meet.",
      useCase: "40 yard dash, combine testing",
      image: "/start-touch.png",
    },
    {
      title: "Countdown",
      description: "3... 2... 1... BEEP! A visual and audio countdown gives you a predictable start signal. Great for consistent training.",
      useCase: "Solo training, timed intervals",
      image: "/start-countdown.png",
    },
    {
      title: "Voice Command",
      description: '"On your marks... Set... GO!" AI voice commands with realistic timing based on official rules.',
      useCase: "Solo training, group starts",
      image: "/start-voice.png",
    },
    {
      title: "Start in Frame",
      description: "Begin stationary in the camera view, then take off. Timer starts when you leave the frame. No second device needed.",
      useCase: "Solo training, single phone setup",
      image: "/start-frame.png",
    },
  ];

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
              Five ways to start your sprint
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Choose the start method that matches your training goals
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
                    {startTypes.map((type, index) => (
                      <Image
                        key={index}
                        src={type.image}
                        alt={type.title}
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
                {startTypes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelected(index);
                      cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === selected ? "bg-foreground scale-125" : "bg-border"
                    }`}
                    aria-label={`View ${startTypes[index].title}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Start type cards */}
          <div className="space-y-6 pb-28">
            {startTypes.map((type, index) => (
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
                        src={type.image}
                        alt={type.title}
                        width={200}
                        height={433}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {type.title}
                </h3>
                <p className="mb-3 text-muted">
                  {type.description}
                </p>
                <p className="text-sm font-medium text-text-secondary">
                  Best for: {type.useCase}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
