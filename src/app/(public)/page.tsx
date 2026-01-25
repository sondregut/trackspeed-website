import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TimingTechnology from "@/components/TimingTechnology";
import StartTypes from "@/components/StartTypes";
import QuickSetups from "@/components/QuickSetups";
import MultiDevice from "@/components/MultiDevice";
import HowItWorks from "@/components/HowItWorks";
import Comparison from "@/components/Comparison";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <StartTypes />
      <QuickSetups />
      <MultiDevice />
      <Comparison />
      <TimingTechnology />
      <CTA />
    </>
  );
}
