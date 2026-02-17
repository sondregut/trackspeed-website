import { Metadata } from "next";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TimingTechnology from "@/components/TimingTechnology";
import StartTypes from "@/components/StartTypes";

import MultiDevice from "@/components/MultiDevice";
import HowItWorks from "@/components/HowItWorks";
import Comparison from "@/components/Comparison";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Sprint Timing App for iPhone - Free, No Hardware",
  description:
    "Turn your iPhone into a timing system. ~4ms accuracy, 120fps detection, multi-device sync. Free for track coaches and athletes.",
  alternates: {
    canonical: "https://mytrackspeed.com",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      {/* Gradient transition */}
      <div className="gradient-divider" />
      <Testimonials />
      <HowItWorks />
      <Features />
      <StartTypes />

      <MultiDevice />
      <Comparison />
      <TimingTechnology />
      <CTA />
    </>
  );
}
