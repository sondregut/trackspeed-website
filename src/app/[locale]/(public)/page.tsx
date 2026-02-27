import {getTranslations, setRequestLocale} from 'next-intl/server';
import {getAlternates} from '@/i18n/metadata';
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import TimingTechnology from "@/components/TimingTechnology";
import StartTypes from "@/components/StartTypes";

import MultiDevice from "@/components/MultiDevice";
import HowItWorks from "@/components/HowItWorks";
import Comparison from "@/components/Comparison";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'home'});
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: getAlternates(''),
  };
}

export default async function Home({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

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
