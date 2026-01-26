import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-hero min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            {/* Social proof pill */}
            <div className="social-proof-pill mb-8">
              {/* Overlapping avatars */}
              <div className="flex -space-x-2 mr-2">
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
                  <Image
                    src="/testimonials/sondre-guttormsen.jpg"
                    alt="Sondre Guttormsen"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden relative">
                  <Image
                    src="/testimonials/andreas-trajkovski.jpg"
                    alt="Andreas Trajkovski"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-200 to-green-400 border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 border-2 border-white" />
              </div>
              <span className="font-bold">Loved by olympians</span>
            </div>

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
              <a
                href="https://apps.apple.com/app/trackspeed"
                className="btn-app-store text-base"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download on the App Store
              </a>
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

          {/* Right - iPhone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="iphone-mockup w-[280px] md:w-[320px]">
              <div className="iphone-screen aspect-[9/19.5] overflow-hidden">
                <Image
                  src="/screenshot-home.png"
                  alt="TrackSpeed app home screen"
                  width={320}
                  height={693}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
