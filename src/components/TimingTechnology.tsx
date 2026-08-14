"use client";

import { Camera, Eye, Network, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

const trustSignals = [
  {
    icon: Camera,
    title: "Automatic crossing events",
    description:
      "A configured camera line defines the timing point, so a coach's start-or-stop reaction does not become part of the recorded rep.",
  },
  {
    icon: Eye,
    title: "Evidence you can review",
    description:
      "The finish evidence makes an unusual result inspectable. Poor framing, a blocked view, or an incorrect line is easier to catch than with a number-only timer.",
  },
  {
    icon: Network,
    title: "Start, split, and finish",
    description:
      "Several phones can cover several timing points in one session, while a single-phone workflow remains available for solo training.",
  },
  {
    icon: ShieldCheck,
    title: "Honest training scope",
    description:
      "TrackSpeed is built for repeatable training and testing. It is not certified Fully Automatic Timing for official meet results.",
  },
] as const;

export default function TimingTechnology() {
  return (
    <section id="timing-technology" className="section-padding px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-accent-green">
              Measurement you can inspect
            </p>
            <h2 className="text-section mb-4">What makes a sprint time trustworthy?</h2>
            <p className="text-body max-w-3xl mx-auto">
              Useful timing is more than a decimal. The event must be clearly
              defined, automatically recorded, reviewable, and collected with a
              repeatable protocol.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid gap-4 md:grid-cols-2">
          {trustSignals.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title}>
              <Card className="h-full border-[var(--border-light)] rounded-3xl py-0 shadow-[0_12px_34px_-28px_rgba(15,45,42,0.4)]">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9F8F0] text-[#183B36]">
                    <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
                  <p className="text-body">{description}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal>
          <div className="mt-8 rounded-[28px] border border-[#163A36]/10 bg-[#102B2A] p-6 text-white shadow-[0_24px_60px_-32px_rgba(16,43,42,0.75)] md:flex md:items-center md:justify-between md:gap-8 md:p-8">
            <div>
              <h3 className="text-2xl font-black tracking-tight">The setup is part of the measurement</h3>
              <p className="mt-2 max-w-2xl leading-7 text-white/66">
                Keep distance, start definition, line position, phone placement,
                visibility, surface, and recovery consistent. Compare results only
                with sessions that used the same protocol.
              </p>
            </div>
            <Link
              href="/technology"
              className="mt-6 inline-flex shrink-0 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#102B2A] transition-opacity hover:opacity-90 md:mt-0"
            >
              Read the validation guide
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
