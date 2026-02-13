"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import "./pitch.css";

const SLIDES = [
  "title",
  "problem",
  "solution",
  "how-it-works",
  "why-now",
  "market",
  "competition",
  "technology",
  "business-model",
  "financial-projections",
  "team",
  "go-to-market",
  "vision",
  "contact",
] as const;

export default function PitchDeck() {
  const deckRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Lock body scroll and hide footer; navbar is scroll-direction aware
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const navbar = document.querySelector("nav:not(.pitch-nav)") as HTMLElement | null;
    const footer = document.querySelector("footer") as HTMLElement | null;
    if (footer) footer.style.display = "none";
    if (navbar) {
      navbar.style.transition = "transform 0.3s ease";
      navbar.style.transform = "translateY(0)";
    }
    return () => {
      document.body.style.overflow = "";
      if (footer) footer.style.display = "";
      if (navbar) {
        navbar.style.transition = "";
        navbar.style.transform = "";
      }
    };
  }, []);

  // Show navbar when scrolling up or at top, hide when scrolling down
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    let lastScrollTop = 0;

    const handleScroll = () => {
      const navbar = document.querySelector("nav:not(.pitch-nav)") as HTMLElement | null;
      if (!navbar) return;
      const scrollTop = deck.scrollTop;
      if (scrollTop <= 10 || scrollTop < lastScrollTop) {
        navbar.style.transform = "translateY(0)";
      } else {
        navbar.style.transform = "translateY(-100%)";
      }
      lastScrollTop = scrollTop;
    };

    deck.addEventListener("scroll", handleScroll, { passive: true });
    return () => deck.removeEventListener("scroll", handleScroll);
  }, []);

  // Track which slide is in view
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) setActiveSlide(index);
          }
        });
      },
      { root: deck, threshold: 0.6 }
    );

    deck.querySelectorAll(".pitch-slide").forEach((slide) => {
      observer.observe(slide);
    });

    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const deck = deckRef.current;
      if (!deck) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        scrollToSlide(Math.min(activeSlide + 1, SLIDES.length - 1));
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToSlide(Math.max(activeSlide - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeSlide]);

  const scrollToSlide = useCallback((index: number) => {
    const deck = deckRef.current;
    if (!deck) return;
    const slide = deck.querySelector(`[data-index="${index}"]`);
    slide?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div ref={deckRef} className="pitch-deck">
      {/* Navigation dots */}
      <nav className="pitch-nav" aria-label="Slide navigation">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`pitch-dot ${activeSlide === i ? "active" : ""}`}
            onClick={() => scrollToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </nav>

      {/* Slide 1 — Title */}
      <section className="pitch-slide bg-hero" data-index={0}>
        <div className="max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/icon.png"
              alt="TrackSpeed"
              width={80}
              height={80}
              className="rounded-2xl"
            />
          </div>
          <h1
            className="text-hero mb-4"
            style={{ fontSize: "clamp(3rem, 7vw, 5rem)" }}
          >
            TrackSpeed
          </h1>
          <p
            className="text-xl md:text-2xl lg:text-3xl font-medium mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Professional sprint timing with just an iPhone
          </p>
          <p
            className="text-base md:text-lg mb-12 max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Replacing $500–$5,000 timing hardware with computer vision
            and sub-frame interpolation — built for track &amp; field,
            made for every athlete.
          </p>
          <a
            href="https://apps.apple.com/app/trackspeed"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 text-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Live on the App Store
          </a>
          <SlideNumber current={1} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 2 — Problem */}
      <section className="pitch-slide" data-index={1} style={{ background: "var(--bg-warm)" }}>
        <div className="max-w-4xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="w-[280px] md:w-[340px]">
                <Image
                  src="/competitor_hardware.png"
                  alt="Expensive timing hardware with red X"
                  width={800}
                  height={800}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
            <div>
              <SlideLabel>The Problem</SlideLabel>
              <h2 className="text-section mb-4">
                Accurate sprint timing is locked behind expensive hardware
              </h2>
              <p className="text-body mb-8">
                Coaches, athletes, and teams face a tough choice: spend thousands on
                laser gates and sensor chips, or rely on stopwatches that are off by
                up to 200 milliseconds. Setup takes 10–20 minutes, equipment fills a
                carry bag, and most programs simply can&apos;t afford it.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <PriceCard name="Freelap" price="$535 – $1,265+" />
                <PriceCard name="DASHR" price="$375 – $1,300+" />
                <PriceCard name="Brower" price="$800 – $1,765+" />
              </div>
            </div>
          </div>
          <SlideNumber current={2} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 3 — Solution */}
      <section className="pitch-slide bg-hero" data-index={2}>
        <div className="max-w-4xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SlideLabel>The Solution</SlideLabel>
              <h2 className="text-section mb-6">
                Your iPhone is the timing system
              </h2>
              <p className="text-body mb-8">
                TrackSpeed turns any iPhone into a professional-grade timing gate.
                The camera captures at 30–120fps while computer vision detects when a
                runner&apos;s chest crosses the frame. Linear interpolation delivers
                sub-frame precision. No calibration, no extra hardware. Sync two phones
                for start + finish lines with sub-millisecond clock sync.
              </p>
              <div className="flex gap-8">
                <Stat value="~4ms" label="Accuracy" />
                <Stat value="<1 min" label="Setup" />
                <Stat value="$0" label="Hardware cost" />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-[220px] md:w-[260px]">
                <Image
                  src="/photofinish_edit.png"
                  alt="TrackSpeed photo finish review"
                  width={881}
                  height={1816}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
          <SlideNumber current={3} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 4 — How It Works */}
      <section className="pitch-slide" data-index={3} style={{ background: "var(--bg-sky)" }}>
        <div className="max-w-4xl w-full">
          <SlideLabel>How It Works</SlideLabel>
          <h2 className="text-section mb-12">Three steps. Under a minute.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Place phones"
              description="Set an iPhone at the start line and one at the finish line. Tap to connect via peer-to-peer."
              image="/connect.png"
            />
            <Step
              number="2"
              title="Run"
              description="Countdown syncs both devices. Photo finish detection triggers automatically when a runner crosses."
              image="/tracksetup.png"
            />
            <Step
              number="3"
              title="Review results"
              description="See split times, frame-by-frame scrubber, and photo finish confirmation — instantly."
              image="/photofinish_edit.png"
            />
          </div>
          <SlideNumber current={4} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 5 — Why Now */}
      <section className="pitch-slide bg-hero" data-index={4}>
        <div className="max-w-4xl w-full">
          <SlideLabel>Why Now</SlideLabel>
          <h2 className="text-section mb-4">
            The timing is right — literally
          </h2>
          <p className="text-body mb-10 max-w-3xl">
            Four converging trends make this the perfect moment to replace
            dedicated timing hardware with a phone app.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <WhyNowCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              }
              title="120fps in every pocket"
              description="iPhone cameras now shoot 120fps natively. The hardware for precise timing already exists in over a billion devices."
            />
            <WhyNowCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              }
              title="On-device AI is finally fast enough"
              description="Apple's Neural Engine and Vision framework enable real-time computer vision — no cloud round-trip, no latency."
            />
            <WhyNowCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              }
              title="Record participation"
              description="Track & field is the #1 US high school sport with 1.13M athletes (2023-24). More runners than ever need accurate timing."
            />
            <WhyNowCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              }
              title="Hardware fatigue"
              description="Coaches are tired of carrying, charging, and replacing expensive equipment. They want software solutions — not more gear."
            />
          </div>
          <SlideNumber current={5} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 6 — Market Opportunity */}
      <section className="pitch-slide" data-index={5} style={{ background: "var(--bg-warm)" }}>
        <div className="max-w-4xl w-full">
          <SlideLabel>Market Opportunity</SlideLabel>
          <h2 className="text-section mb-3">
            Built for track &amp; field. Made for every athlete.
          </h2>
          <p className="text-body mb-5 max-w-3xl">
            We&apos;re starting where precision matters most — track &amp; field, the
            #1 high school sport in America with 1.13 million participants. But sprint
            performance is universal. Football, soccer, rugby, and recreational athletes
            all train speed. Anyone who runs can benefit from accurate timing.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-5">
            <MarketCard
              label="TAM"
              value="$804M"
              description="Global sports timing system market (2024), growing to $1.2B by 2031"
              source="Valuates Reports"
            />
            <MarketCard
              label="SAM"
              value="$340M"
              description="Wireless sports timing systems — the segment we directly displace"
              source="IntelMarketResearch"
            />
            <MarketCard
              label="SOM"
              value="$12M"
              description="50K coaches & 150K athletes on mobile-first timing at $50/yr avg"
              source="Bottom-up estimate"
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <AudienceCard icon="🏟️" label="Track & field" detail="1.13M US high school athletes alone" />
            <AudienceCard icon="🏈" label="Team sports" detail="30M+ US youth sports participants" />
            <AudienceCard icon="🏃" label="Self-coached" detail="Recreational runners & fitness" />
            <AudienceCard icon="🏫" label="Schools" detail="PE departments & youth programs" />
          </div>
          <p
            className="text-xs max-w-3xl"
            style={{ color: "var(--text-muted)" }}
          >
            Sources: Valuates Reports &amp; IntelMarketResearch (2024 market sizing);
            NFHS 2023-24 participation survey; SFIA 2024 U.S. Team Sports Report.
          </p>
          <SlideNumber current={6} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 7 — Competition */}
      <section className="pitch-slide bg-dark-section" data-index={6}>
        <div className="max-w-4xl w-full">
          <SlideLabel dark>Competition</SlideLabel>
          <h2
            className="font-bold mb-3"
            style={{
              color: "var(--text-on-dark)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            The only high-accuracy, low-cost option
          </h2>
          <p
            className="text-base mb-8 max-w-3xl"
            style={{ color: "var(--text-on-dark-muted)", lineHeight: 1.6 }}
          >
            Existing solutions force a trade-off between accuracy and cost.
            TrackSpeed breaks that trade-off entirely.
          </p>
          {/* 2x2 Competitive positioning chart */}
          <div
            className="relative mx-auto rounded-xl p-6 md:p-8"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              maxWidth: "600px",
              aspectRatio: "1 / 1",
            }}
          >
            {/* Axis labels */}
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-2 text-[11px] font-medium tracking-wide uppercase"
              style={{ color: "var(--text-on-dark-muted)" }}
            >
              Price
            </span>
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-medium tracking-wide uppercase"
              style={{ color: "var(--text-on-dark-muted)" }}
            >
              Accuracy
            </span>
            {/* Axis endpoints */}
            <span
              className="absolute bottom-6 left-8 text-[10px]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Free
            </span>
            <span
              className="absolute bottom-6 right-4 text-[10px]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              $5,000+
            </span>
            <span
              className="absolute top-4 left-8 text-[10px]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              High
            </span>
            <span
              className="absolute bottom-10 left-8 text-[10px]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Low
            </span>
            {/* Grid lines */}
            <div
              className="absolute left-8 right-4 top-1/2 h-px"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />
            <div
              className="absolute top-4 bottom-6 left-1/2 w-px"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />

            {/* Competitor dots */}
            <CompetitorDot
              name="Stopwatch"
              x="10%"
              y="80%"
              color="rgba(255,255,255,0.4)"
              price="Free"
            />
            <CompetitorDot
              name="MySprint"
              x="14%"
              y="65%"
              color="rgba(255,255,255,0.4)"
              price="Free (video analysis)"
            />
            <CompetitorDot
              name="Jawku"
              x="28%"
              y="55%"
              color="rgba(255,255,255,0.4)"
              price="~$200"
            />
            <CompetitorDot
              name="Freelap"
              x="52%"
              y="28%"
              color="rgba(255,255,255,0.4)"
              price="$535 – $1,265+"
            />
            <CompetitorDot
              name="DASHR"
              x="48%"
              y="36%"
              color="rgba(255,255,255,0.4)"
              price="$375 – $1,300+"
            />
            <CompetitorDot
              name="Brower"
              x="72%"
              y="18%"
              color="rgba(255,255,255,0.4)"
              price="$800 – $1,765+"
            />
            <CompetitorDot
              name="FinishLynx"
              x="88%"
              y="10%"
              color="rgba(255,255,255,0.4)"
              price="$5,000 – $25,000+"
            />
            {/* TrackSpeed — highlighted */}
            <CompetitorDot
              name="TrackSpeed"
              x="14%"
              y="15%"
              color="#5C8DB8"
              highlighted
              price="$49.99/year"
            />
          </div>
          <p
            className="text-center text-sm mt-6 font-medium"
            style={{ color: "#5C8DB8" }}
          >
            TrackSpeed is the only solution in the high-accuracy, low-cost quadrant.
          </p>
          <SlideNumber current={7} total={SLIDES.length} dark />
        </div>
      </section>

      {/* Slide 8 — Technology */}
      <section className="pitch-slide bg-dark-section" data-index={7}>
        <div className="max-w-4xl w-full">
          <SlideLabel dark>Technology</SlideLabel>
          <h2
            className="text-section mb-4"
            style={{ color: "var(--text-on-dark)" }}
          >
            Deep tech moat, not just an app
          </h2>
          <p
            className="text-body mb-10 max-w-3xl"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            TrackSpeed isn&apos;t a stopwatch with a camera UI. It&apos;s a real-time
            computer vision pipeline built from the ground up for precision timing.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <TechCard
              title="Photo Finish Detection"
              description="Frame-by-frame body blob analysis at up to 120fps — detects chest crossings, not arm swings."
            />
            <TechCard
              title="Sub-Frame Interpolation"
              description="Linear interpolation between frames achieves ~4ms accuracy from 8–33ms frame intervals."
            />
            <TechCard
              title="NTP-Style Clock Sync"
              description="Multi-device time synchronization with sub-millisecond accuracy over peer-to-peer."
            />
            <TechCard
              title="IMU Stability Gating"
              description="Gyroscope monitoring ensures the device is stable before accepting timing data."
            />
            <TechCard
              title="Direction Hysteresis"
              description="State machine with on/off thresholds eliminates false triggers and double-counts."
            />
            <TechCard
              title="Frame Scrubber"
              description="Review the exact crossing moment frame-by-frame across multiple synced devices."
            />
          </div>
          <SlideNumber current={8} total={SLIDES.length} dark />
        </div>
      </section>

      {/* Slide 9 — Business Model */}
      <section className="pitch-slide bg-hero" data-index={8}>
        <div className="max-w-4xl w-full">
          <SlideLabel>Business Model</SlideLabel>
          <h2 className="text-section mb-10">Freemium with Pro subscription</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div
                className="card-feature text-center mb-6"
                style={{ border: "2px solid #5C8DB8" }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "#5C8DB8" }}
                >
                  TrackSpeed Pro
                </h3>
                <p
                  className="text-3xl font-bold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  $49.99<span className="text-base font-normal">/year</span>
                </p>
                <p
                  className="text-lg mb-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  or $8.99<span className="text-sm">/month</span>
                </p>
                <ul
                  className="text-sm text-left space-y-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <li>Multi-device sync (start + finish)</li>
                  <li>120fps capture</li>
                  <li>Frame-by-frame scrubber</li>
                  <li>Unlimited history &amp; exports</li>
                  <li>Team management features</li>
                </ul>
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Free tier includes single-device timing, basic history, and standard frame rate
                — enough to experience the product before upgrading.
              </p>
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Revenue levers
              </h3>
              <div className="space-y-4">
                <RevenueItem
                  title="Individual subscriptions"
                  description="Self-coached athletes and independent coaches paying monthly or yearly."
                />
                <RevenueItem
                  title="Team & school licenses"
                  description="Bulk pricing for programs managing rosters of athletes — higher LTV."
                />
                <RevenueItem
                  title="Platform expansion"
                  description="Android, Apple Watch companion, and API access for integrations."
                />
              </div>
            </div>
          </div>
          <SlideNumber current={9} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 10 — Financial Projections */}
      <section className="pitch-slide" data-index={9} style={{ background: "var(--bg-sky)" }}>
        <div className="max-w-4xl w-full">
          <SlideLabel>Financial Projections</SlideLabel>
          <h2 className="text-section mb-4">
            Path to $3M ARR
          </h2>
          <p className="text-body mb-6 max-w-3xl">
            Bottom-up model using top-tier hard-paywall benchmarks with opt-out
            trial. 60,000 subscribers at $50/year = $3M ARR. Android launch
            in Year 2 multiplies addressable downloads. Team &amp; school
            licenses provide further ARPU upside beyond this base case.
          </p>
          <ProjectionTable />
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <AssumptionCard label="Download → trial" value="20%" />
            <AssumptionCard label="Trial → paid" value="50%" />
            <AssumptionCard label="Download → paid" value="~10%" />
            <AssumptionCard label="Annual retention" value="50%" />
            <AssumptionCard label="LTV:CAC" value=">10:1" />
          </div>
          <p
            className="text-xs mt-4 max-w-3xl"
            style={{ color: "var(--text-muted)" }}
          >
            Hard-paywall model with 7-day opt-out trial. Top 10% D2T: 20.3%,
            median T2P for opt-out trials: 39.9% (top 10%: 68.3%). Winning
            D2P target: 10–12% (RevenueCat 2025; Adapty 2026; Business of
            Apps 2026). 82% of conversions within 24 hours. 7-day trials
            outperform 30-day in 2026. $50/yr ARPU uses actual pricing —
            team licenses ($200–$500/yr) offer upside not modeled here.
            Organic-first CAC under $5.
          </p>
          <SlideNumber current={10} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 11 — Team */}
      <section className="pitch-slide" data-index={10} style={{ background: "var(--bg-warm)" }}>
        <div className="max-w-4xl w-full">
          <SlideLabel>Team</SlideLabel>
          <h2 className="text-section mb-10">
            Athletes building for athletes
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            <div className="card-feature">
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Sondre Guttormsen
              </h3>
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "#5C8DB8" }}
              >
                Co-Founder &amp; Lead Developer
              </p>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Built TrackSpeed from the ground up — native iOS, computer vision
                pipeline, multi-device sync, backend, and website. Former D1
                athlete with deep domain knowledge.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/sondre_pv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium inline-flex items-center gap-1"
                  style={{ color: "#5C8DB8" }}
                >
                  <IgIcon /> @sondre_pv
                </a>
                <a
                  href="https://www.linkedin.com/in/sondre-guttormsen-803b8619b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium inline-flex items-center gap-1"
                  style={{ color: "#5C8DB8" }}
                >
                  <LinkedInIcon /> LinkedIn
                </a>
              </div>
            </div>
            <div className="card-feature">
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Simen Guttormsen
              </h3>
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "#5C8DB8" }}
              >
                Co-Founder &amp; Technical Advisor
              </p>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Technical advisor and second builder. Contributes to architecture
                decisions, code reviews, and feature development.
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <a
                  href="https://instagram.com/simen_guttormsen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium inline-flex items-center gap-1"
                  style={{ color: "#5C8DB8" }}
                >
                  <IgIcon /> @simen_g
                </a>
                <a
                  href="https://www.linkedin.com/in/simen-guttormsen/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium inline-flex items-center gap-1"
                  style={{ color: "#5C8DB8" }}
                >
                  <LinkedInIcon /> LinkedIn
                </a>
              </div>
            </div>
            <div className="card-feature">
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Andreas Trajkovski
              </h3>
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "#5C8DB8" }}
              >
                Co-Founder &amp; Jumpers World
              </p>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Founder of Jumpers World — one of the largest track &amp; field media
                brands. Deep network across the athletics community.
              </p>
              <a
                href="https://instagram.com/jumpers.world"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium inline-flex items-center gap-1"
                style={{ color: "#5C8DB8" }}
              >
                <IgIcon /> @jumpers.world
              </a>
            </div>
          </div>
          <p
            className="text-sm max-w-lg mx-auto text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Lean by design. Technical depth meets built-in distribution —
            every dollar goes into product and growth, not overhead.
          </p>
          <SlideNumber current={11} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 12 — Go-to-Market */}
      <section className="pitch-slide bg-hero" data-index={11}>
        <div className="max-w-4xl w-full">
          <SlideLabel>Go-to-Market</SlideLabel>
          <h2 className="text-section mb-4">
            Built-in distribution through athletics media
          </h2>
          <p className="text-body mb-10 max-w-3xl">
            We don&apos;t need to buy our audience — we already have it. Jumpers World
            and our personal networks give us direct access to the track &amp; field
            community, and we&apos;re expanding through influencer partnerships across
            all sports.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <GtmCard
              title="@jumpers.world"
              description="One of the largest T&F media brands — organic reach to coaches, athletes, and fans across social platforms."
              link="https://instagram.com/jumpers.world"
            />
            <GtmCard
              title="@sondre_pv & @simen_guttormsen"
              description="Personal social media accounts with established audiences in the athletics and tech community."
              link="https://instagram.com/sondre_pv"
            />
            <GtmCard
              title="Influencer partnerships"
              description="Collaborations with track & field creators and athletes across Instagram, TikTok, and YouTube."
            />
            <GtmCard
              title="Coach & club outreach"
              description="Direct outreach to high school and college track programs — product sells itself in demo."
            />
            <GtmCard
              title="Event presence"
              description="Live demos at track meets, coaching clinics, and athletics conventions."
            />
            <GtmCard
              title="Content marketing"
              description="Training tips, speed science, and timing comparisons — driving organic search and social traffic."
            />
          </div>
          <SlideNumber current={12} total={SLIDES.length} />
        </div>
      </section>

      {/* Slide 13 — Vision */}
      <section className="pitch-slide bg-dark-section" data-index={12}>
        <div className="max-w-3xl text-center">
          <SlideLabel dark>Vision</SlideLabel>
          <h2
            className="text-section mb-6"
            style={{ color: "var(--text-on-dark)" }}
          >
            Democratize sprint timing for every athlete
          </h2>
          <p
            className="text-lg md:text-xl leading-relaxed mb-6"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            Track &amp; field is where we start — it&apos;s where precision matters most.
            But sprinting isn&apos;t just for sprinters. Football players run 40-yard dashes.
            Soccer players track sprint speed. Baseball players measure home-to-first.
            Recreational athletes want to know if they&apos;re getting faster.
          </p>
          <p
            className="text-lg md:text-xl leading-relaxed mb-12"
            style={{ color: "var(--text-on-dark-muted)" }}
          >
            Speed is the most universal metric in sport. Every coach, every athlete,
            every school deserves access to accurate timing — without the price tag.
            TrackSpeed makes that possible with the phone already in their pocket.
          </p>
          <div className="flex flex-wrap gap-8 justify-center">
            <Stat value="$0" label="Hardware needed" dark />
            <Stat value="60s" label="Setup time" dark />
            <Stat value="All sports" label="Benefit from speed" dark />
          </div>
          <SlideNumber current={13} total={SLIDES.length} dark />
        </div>
      </section>

      {/* Slide 14 — Contact / CTA */}
      <section className="pitch-slide bg-hero" data-index={13}>
        <div className="max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/icon.png"
              alt="TrackSpeed"
              width={64}
              height={64}
              className="rounded-xl"
            />
          </div>
          <h2 className="text-section mb-4">Let&apos;s talk</h2>
          <p
            className="text-body mb-10 max-w-lg mx-auto"
          >
            TrackSpeed is live and growing. We&apos;re looking for investors and partners
            who believe accurate timing should be accessible to every athlete —
            not just those with a hardware budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://apps.apple.com/app/trackspeed"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Try TrackSpeed
            </a>
            <a
              href="https://trackspeed.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
              style={{
                background: "transparent",
                color: "var(--text-primary)",
                border: "1px solid var(--border-light)",
              }}
            >
              trackspeed.app
            </a>
          </div>
          {/* App Store QR Code */}
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <QrCode />
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            sondre@trackspeed.app
          </p>
          <SlideNumber current={14} total={SLIDES.length} />
        </div>
      </section>
    </div>
  );
}

/* ========================================
   Sub-components
   ======================================== */

function SlideLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className="text-sm font-semibold uppercase tracking-widest mb-4"
      style={{ color: "#5C8DB8" }}
    >
      {children}
    </p>
  );
}

function SlideNumber({
  current,
  total,
  dark,
}: {
  current: number;
  total: number;
  dark?: boolean;
}) {
  return (
    <span
      className="pitch-slide-number"
      style={{ color: dark ? "var(--text-on-dark-muted)" : undefined }}
    >
      {current} / {total}
    </span>
  );
}

function Stat({
  value,
  label,
  dark,
}: {
  value: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div>
      <div
        className="text-2xl md:text-3xl font-bold"
        style={{ color: dark ? "var(--text-on-dark)" : "var(--text-primary)" }}
      >
        {value}
      </div>
      <div
        className="text-sm"
        style={{
          color: dark ? "var(--text-on-dark-muted)" : "var(--text-muted)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function PriceCard({ name, price }: { name: string; price: string }) {
  return (
    <div className="card-feature text-center">
      <p className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
        {name}
      </p>
      <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
        {price}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
  image,
}: {
  number: string;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <div className="w-[140px] md:w-[160px]">
          <Image
            src={image}
            alt={title}
            width={881}
            height={1816}
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>
      <div
        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mb-2"
        style={{ background: "#5C8DB8", color: "white" }}
      >
        {number}
      </div>
      <h3 className="text-card-title mb-1">{title}</h3>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}

function MarketCard({
  label,
  value,
  description,
  source,
}: {
  label: string;
  value: string;
  description: string;
  source?: string;
}) {
  return (
    <div className="card-feature text-center">
      <p
        className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: "#5C8DB8" }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-bold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </p>
      <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
      {source && (
        <p className="text-[10px] italic" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
          {source}
        </p>
      )}
    </div>
  );
}

function AudienceCard({
  icon,
  label,
  detail,
}: {
  icon: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="card-feature text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <p
        className="text-sm font-semibold mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {detail}
      </p>
    </div>
  );
}

function TechCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <h3
        className="text-sm font-semibold mb-2"
        style={{ color: "var(--text-on-dark)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-on-dark-muted)" }}
      >
        {description}
      </p>
    </div>
  );
}

function RevenueItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--bg-sky)",
        border: "1px solid var(--border-light)",
      }}
    >
      <h4
        className="text-sm font-semibold mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h4>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </div>
  );
}

function GtmCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link?: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--bg-sky)",
        border: "1px solid var(--border-light)",
      }}
    >
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold mb-2 inline-flex items-center gap-1.5 hover:underline"
          style={{ color: "#5C8DB8" }}
        >
          <IgIcon /> {title}
        </a>
      ) : (
        <h3
          className="text-sm font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
      )}
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {description}
      </p>
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IgIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

/* ========================================
   New components — Why Now
   ======================================== */

function WhyNowCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-xl p-5 flex gap-4"
      style={{
        background: "var(--bg-sky)",
        border: "1px solid var(--border-light)",
      }}
    >
      <div
        className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: "#5C8DB8", color: "white" }}
      >
        {icon}
      </div>
      <div>
        <h3
          className="text-sm font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

/* ========================================
   New components — Competition
   ======================================== */

function CompetitorDot({
  name,
  x,
  y,
  color,
  highlighted,
  price,
}: {
  name: string;
  x: string;
  y: string;
  color: string;
  highlighted?: boolean;
  price?: string;
}) {
  return (
    <div
      className="absolute flex flex-col items-center group"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      {price && (
        <div
          className="absolute bottom-full mb-2 px-2 py-1 rounded text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.85)",
            color: "white",
          }}
        >
          {price}
        </div>
      )}
      <div
        className="rounded-full"
        style={{
          width: highlighted ? 16 : 10,
          height: highlighted ? 16 : 10,
          background: color,
          boxShadow: highlighted ? `0 0 12px ${color}60` : undefined,
        }}
      />
      <span
        className="text-[10px] font-medium mt-1 whitespace-nowrap"
        style={{
          color: highlighted ? color : "rgba(255,255,255,0.5)",
          fontWeight: highlighted ? 700 : 500,
        }}
      >
        {name}
      </span>
    </div>
  );
}

/* ========================================
   New components — Financial Projections
   ======================================== */

function ProjectionTable() {
  const rows = [
    { label: "Cumulative downloads", y1: "100K", y2: "500K", y3: "1.5M" },
    { label: "Active paid subs", y1: "10K", y2: "25K", y3: "60K" },
    { label: "Blended ARPU", y1: "$50", y2: "$50", y3: "$50" },
    { label: "ARR", y1: "$500K", y2: "$1.25M", y3: "$3M" },
    { label: "YoY growth", y1: "—", y2: "~2.5x", y3: "~2.4x" },
  ];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border-light)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--bg-warm)" }}>
            <th
              className="text-left px-4 py-3 font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              &nbsp;
            </th>
            <th
              className="text-center px-4 py-3 font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Year 1
            </th>
            <th
              className="text-center px-4 py-3 font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Year 2
            </th>
            <th
              className="text-center px-4 py-3 font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Year 3
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              style={{
                background: i % 2 === 0 ? "white" : "var(--bg-sky)",
                borderTop: "1px solid var(--border-light)",
              }}
            >
              <td
                className="px-4 py-3 font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {row.label}
              </td>
              <td
                className="px-4 py-3 text-center font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {row.y1}
              </td>
              <td
                className="px-4 py-3 text-center font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {row.y2}
              </td>
              <td
                className="px-4 py-3 text-center font-semibold"
                style={{ color: "#5C8DB8" }}
              >
                {row.y3}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssumptionCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-feature text-center">
      <p className="text-lg font-bold mb-1" style={{ color: "#5C8DB8" }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

/* ========================================
   New components — QR Code
   ======================================== */

function QrCode() {
  // Stylized QR code placeholder pointing to App Store
  // Using an inline SVG that represents a QR pattern
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="QR code linking to TrackSpeed on the App Store"
    >
      <rect width="120" height="120" rx="8" fill="white" />
      {/* Top-left finder pattern */}
      <rect x="8" y="8" width="28" height="28" rx="2" fill="#1A1A1A" />
      <rect x="12" y="12" width="20" height="20" rx="1" fill="white" />
      <rect x="16" y="16" width="12" height="12" rx="1" fill="#1A1A1A" />
      {/* Top-right finder pattern */}
      <rect x="84" y="8" width="28" height="28" rx="2" fill="#1A1A1A" />
      <rect x="88" y="12" width="20" height="20" rx="1" fill="white" />
      <rect x="92" y="16" width="12" height="12" rx="1" fill="#1A1A1A" />
      {/* Bottom-left finder pattern */}
      <rect x="8" y="84" width="28" height="28" rx="2" fill="#1A1A1A" />
      <rect x="12" y="88" width="20" height="20" rx="1" fill="white" />
      <rect x="16" y="92" width="12" height="12" rx="1" fill="#1A1A1A" />
      {/* Data modules — decorative pattern */}
      {/* Row 1 */}
      <rect x="42" y="8" width="6" height="6" fill="#1A1A1A" />
      <rect x="54" y="8" width="6" height="6" fill="#1A1A1A" />
      <rect x="66" y="8" width="6" height="6" fill="#1A1A1A" />
      {/* Row 2 */}
      <rect x="42" y="18" width="6" height="6" fill="#1A1A1A" />
      <rect x="48" y="18" width="6" height="6" fill="#5C8DB8" />
      <rect x="60" y="18" width="6" height="6" fill="#1A1A1A" />
      <rect x="72" y="18" width="6" height="6" fill="#1A1A1A" />
      {/* Row 3 */}
      <rect x="48" y="28" width="6" height="6" fill="#1A1A1A" />
      <rect x="60" y="28" width="6" height="6" fill="#5C8DB8" />
      <rect x="72" y="28" width="6" height="6" fill="#1A1A1A" />
      {/* Row 4 */}
      <rect x="8" y="42" width="6" height="6" fill="#1A1A1A" />
      <rect x="18" y="42" width="6" height="6" fill="#1A1A1A" />
      <rect x="30" y="42" width="6" height="6" fill="#1A1A1A" />
      <rect x="42" y="42" width="6" height="6" fill="#5C8DB8" />
      <rect x="54" y="42" width="6" height="6" fill="#1A1A1A" />
      <rect x="66" y="42" width="6" height="6" fill="#1A1A1A" />
      <rect x="84" y="42" width="6" height="6" fill="#1A1A1A" />
      <rect x="96" y="42" width="6" height="6" fill="#1A1A1A" />
      <rect x="108" y="42" width="6" height="6" fill="#1A1A1A" />
      {/* Row 5 */}
      <rect x="8" y="48" width="6" height="6" fill="#1A1A1A" />
      <rect x="24" y="48" width="6" height="6" fill="#1A1A1A" />
      <rect x="36" y="48" width="6" height="6" fill="#1A1A1A" />
      <rect x="48" y="48" width="6" height="6" fill="#1A1A1A" />
      <rect x="60" y="48" width="6" height="6" fill="#5C8DB8" />
      <rect x="72" y="48" width="6" height="6" fill="#1A1A1A" />
      <rect x="90" y="48" width="6" height="6" fill="#1A1A1A" />
      <rect x="102" y="48" width="6" height="6" fill="#1A1A1A" />
      {/* Center area — brand accent */}
      <rect x="48" y="54" width="6" height="6" fill="#5C8DB8" />
      <rect x="54" y="54" width="12" height="12" rx="2" fill="#5C8DB8" />
      <rect x="66" y="54" width="6" height="6" fill="#5C8DB8" />
      <rect x="42" y="60" width="6" height="6" fill="#1A1A1A" />
      <rect x="72" y="60" width="6" height="6" fill="#1A1A1A" />
      {/* Row 6 */}
      <rect x="8" y="54" width="6" height="6" fill="#1A1A1A" />
      <rect x="18" y="54" width="6" height="6" fill="#1A1A1A" />
      <rect x="30" y="54" width="6" height="6" fill="#1A1A1A" />
      <rect x="84" y="54" width="6" height="6" fill="#1A1A1A" />
      <rect x="96" y="54" width="6" height="6" fill="#1A1A1A" />
      <rect x="108" y="54" width="6" height="6" fill="#1A1A1A" />
      {/* Row 7 */}
      <rect x="14" y="66" width="6" height="6" fill="#1A1A1A" />
      <rect x="24" y="66" width="6" height="6" fill="#1A1A1A" />
      <rect x="36" y="66" width="6" height="6" fill="#1A1A1A" />
      <rect x="48" y="66" width="6" height="6" fill="#1A1A1A" />
      <rect x="60" y="66" width="6" height="6" fill="#1A1A1A" />
      <rect x="72" y="66" width="6" height="6" fill="#1A1A1A" />
      <rect x="90" y="66" width="6" height="6" fill="#1A1A1A" />
      <rect x="102" y="66" width="6" height="6" fill="#1A1A1A" />
      {/* Row 8 */}
      <rect x="8" y="72" width="6" height="6" fill="#1A1A1A" />
      <rect x="20" y="72" width="6" height="6" fill="#1A1A1A" />
      <rect x="42" y="72" width="6" height="6" fill="#5C8DB8" />
      <rect x="54" y="72" width="6" height="6" fill="#1A1A1A" />
      <rect x="66" y="72" width="6" height="6" fill="#1A1A1A" />
      <rect x="84" y="72" width="6" height="6" fill="#1A1A1A" />
      <rect x="96" y="72" width="6" height="6" fill="#1A1A1A" />
      {/* Bottom-right area */}
      <rect x="42" y="84" width="6" height="6" fill="#1A1A1A" />
      <rect x="54" y="84" width="6" height="6" fill="#1A1A1A" />
      <rect x="66" y="84" width="6" height="6" fill="#5C8DB8" />
      <rect x="84" y="84" width="6" height="6" fill="#1A1A1A" />
      <rect x="96" y="84" width="6" height="6" fill="#1A1A1A" />
      <rect x="42" y="96" width="6" height="6" fill="#1A1A1A" />
      <rect x="60" y="96" width="6" height="6" fill="#1A1A1A" />
      <rect x="72" y="96" width="6" height="6" fill="#1A1A1A" />
      <rect x="90" y="96" width="6" height="6" fill="#1A1A1A" />
      <rect x="108" y="96" width="6" height="6" fill="#1A1A1A" />
      <rect x="48" y="108" width="6" height="6" fill="#1A1A1A" />
      <rect x="60" y="108" width="6" height="6" fill="#5C8DB8" />
      <rect x="78" y="108" width="6" height="6" fill="#1A1A1A" />
      <rect x="96" y="108" width="6" height="6" fill="#1A1A1A" />
      <rect x="108" y="108" width="6" height="6" fill="#1A1A1A" />
    </svg>
  );
}
