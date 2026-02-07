"use client";

import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";

export default function Hero() {
  return (
    <section className="bg-hero min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <ScrollReveal>
            <div className="text-center lg:text-left">
              {/* Social proof pill */}
              <Badge variant="outline" className="mb-8 px-3 py-1.5 text-sm gap-2 rounded-full border-[var(--border-light)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <AvatarGroup>
                  <Avatar className="w-7 h-7">
                    <AvatarImage src="/testimonials/sondre-guttormsen.jpg" alt="Sondre Guttormsen" />
                    <AvatarFallback>SG</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-7 h-7">
                    <AvatarImage src="/testimonials/andreas-trajkovski.jpg" alt="Andreas Trajkovski" />
                    <AvatarFallback>AT</AvatarFallback>
                  </Avatar>
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-gradient-to-br from-green-200 to-green-400" />
                  </Avatar>
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-gradient-to-br from-purple-200 to-purple-400" />
                  </Avatar>
                </AvatarGroup>
                <span className="font-bold" style={{ color: 'var(--text-muted)' }}>Loved by olympians</span>
              </Badge>

              <h1 className="text-hero mb-4">
                TrackSpeed
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight mb-6" style={{ color: 'var(--text-muted)' }}>
                Sprint timing with just your iPhone
              </h2>

              <p className="text-body mb-8 max-w-lg mx-auto lg:mx-0">
                Turn your iPhone into a professional timing system. No extra hardware, no calibration, instant results.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
                <Button asChild size="lg" className="bg-black text-white hover:bg-[#1a1a1a] rounded-[10px] px-5 py-3 h-auto text-base font-medium">
                  <a href="https://apps.apple.com/app/trackspeed">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Download on the App Store
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 justify-center lg:justify-start text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>~4ms</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>&lt;1 min</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Setup</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>$0</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Hardware</div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - iPhone mockup */}
          <ScrollReveal delay={0.2}>
            <div className="flex justify-center lg:justify-end">
              <div className="w-[280px] md:w-[320px]">
                <Image
                  src="/photofinish_edit.png"
                  alt="TrackSpeed photo finish timing"
                  width={881}
                  height={1816}
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
