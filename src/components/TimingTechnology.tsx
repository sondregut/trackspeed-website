"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

export default function TimingTechnology() {
  return (
    <section id="timing-technology" className="section-padding px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-section mb-4">
              The science behind sub-frame precision
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              How we achieve ~4ms accuracy with standard iPhone cameras
            </p>
          </div>
        </ScrollReveal>

        {/* Main explanation card */}
        <ScrollReveal>
          <Card className="border-[var(--border-light)] rounded-3xl py-0 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-8">
            <CardContent className="p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left - Visual diagram */}
                <div className="relative">
                  {/* Frame timeline visualization */}
                  <div className="bg-bg-mint rounded-2xl p-6 border border-border">
                    <div className="text-sm mb-4 font-mono text-muted">
                      120fps capture = 8.3ms between frames
                    </div>

                    {/* Timeline */}
                    <div className="relative h-32 mb-6">
                      {/* Timeline line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border"></div>

                      {/* Frame markers */}
                      <div className="absolute left-[15%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-border"></div>
                        <span className="text-[10px] mt-1 text-muted">N-2</span>
                      </div>

                      <div className="absolute left-[30%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-border"></div>
                        <span className="text-[10px] mt-1 text-muted">N-1</span>
                      </div>

                      <div className="absolute left-[45%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full border-2 bg-bg-mint border-foreground"></div>
                        <span className="text-xs mt-2 text-text-secondary">Frame N</span>
                      </div>

                      {/* Gate line */}
                      <div className="absolute left-[55%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-1 h-10 rounded-sm bg-accent-green"></div>
                        <span className="text-xs mt-2 font-semibold text-accent-green">Gate</span>
                      </div>

                      {/* Athlete indicator */}
                      <div className="absolute left-[50%] top-[20%] flex flex-col items-center">
                        <svg
                          className="w-5 h-5 text-text-secondary"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
                        </svg>
                      </div>

                      <div className="absolute left-[70%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full border-2 bg-bg-mint border-foreground"></div>
                        <span className="text-xs mt-2 text-text-secondary">Frame N+1</span>
                      </div>

                      <div className="absolute left-[85%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-border"></div>
                        <span className="text-[10px] mt-1 text-muted">N+2</span>
                      </div>
                    </div>

                    {/* Formula */}
                    <div className="bg-white rounded-xl p-4 font-mono text-center border border-border">
                      <div className="text-sm mb-2 text-muted">
                        Trajectory regression (3+ frames)
                      </div>
                      <div className="text-sm text-foreground">
                        position = velocity × time + offset
                      </div>
                      <div className="text-sm mt-2 text-accent-green">
                        Solve for crossing time with sub-frame precision
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Explanation */}
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    Beyond frame-by-frame timing
                  </h3>
                  <Link
                    href="/technology"
                    className="inline-flex items-center gap-1 text-sm mb-6 text-accent-green hover:opacity-70 transition-opacity"
                  >
                    Learn how it works
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="icon-box flex-shrink-0 w-8 h-8 text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">Motion Detection</h4>
                        <p className="text-sm text-muted">
                          Frame differencing identifies moving objects. Blob analysis
                          finds the largest motion region (your body) and tracks its
                          leading edge toward the gate.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="icon-box flex-shrink-0 w-8 h-8 text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">
                          Trajectory Regression
                        </h4>
                        <p className="text-sm text-muted">
                          We track position across multiple frames and use linear
                          regression to calculate the precise moment you crossed the
                          gate line—even between frames.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="icon-box flex-shrink-0 w-8 h-8 text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">Rolling Shutter Correction</h4>
                        <p className="text-sm text-muted">
                          iPhone cameras scan top-to-bottom over ~5-12ms. We measure
                          where you crossed vertically and compensate for the exact
                          scan timing at that position.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold bg-[#D1FAE5] text-accent-green">
                        ✓
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">~4ms Effective Accuracy</h4>
                        <p className="text-sm text-muted">
                          The combination of 120fps capture, multi-frame trajectory
                          analysis, and rolling shutter correction delivers timing
                          precision comparable to professional systems.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Bottom stats */}
        <StaggerContainer className="grid md:grid-cols-3 gap-4">
          <StaggerItem>
            <Card className="border-[var(--border-light)] rounded-[20px] py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardContent className="text-center p-0">
                <div className="text-3xl font-bold mb-2 text-foreground">8.3ms</div>
                <div className="text-sm text-muted">Frame interval at 120fps</div>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="border-[var(--border-light)] rounded-[20px] py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardContent className="text-center p-0">
                <div className="text-3xl font-bold mb-2 text-foreground">~0.5ms</div>
                <div className="text-sm text-muted">
                  Interpolation resolution
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="border-[var(--border-light)] rounded-[20px] py-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardContent className="text-center p-0">
                <div className="text-3xl font-bold mb-2 text-accent-green">~4ms</div>
                <div className="text-sm text-muted">
                  Effective timing accuracy
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
