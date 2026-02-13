"use client";

import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import AppleIcon from "@/components/icons/AppleIcon";

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-dark-section">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-on-dark">
            Ready to time faster?
          </h2>
          <p className="text-xl mb-10 max-w-xl mx-auto text-text-on-dark-muted">
            Download TrackSpeed and start training with precision timing today.
          </p>

          {/* Value props */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 mb-10">
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-text-on-dark-muted">~4ms accuracy</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-text-on-dark-muted">&lt;1 min setup</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-text-on-dark-muted">No extra hardware</span>
            </div>
          </div>

          <Button asChild size="lg" className="bg-white hover:bg-gray-100 rounded-2xl px-10 py-4 h-auto text-lg font-semibold text-foreground">
            <a href="https://apps.apple.com/app/trackspeed">
              <AppleIcon />
              Download for iOS
            </a>
          </Button>
          <p className="text-sm mt-6 text-text-on-dark-muted">
            Free to download. Premium features available.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
