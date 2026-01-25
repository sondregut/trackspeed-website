import Image from "next/image";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 card-gunmetal rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></span>
              <span className="text-sm text-[#9B9A97]">Precision sprint timing</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Sprint timing,
              <span className="block gradient-text">perfected</span>
            </h1>

            <p className="text-xl text-[#9B9A97] mb-8 max-w-lg mx-auto lg:mx-0">
              Turn your iPhone into a pro timing system. No extra hardware needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://apps.apple.com/app/trackspeed"
                className="btn-primary px-8 py-4 rounded-full text-white font-semibold text-lg inline-flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download for iOS
              </a>
              <a
                href="#how-it-works"
                className="px-8 py-4 rounded-full border border-[#3D3D3D] text-white font-semibold text-lg hover:bg-[#2B2E32] transition-colors inline-flex items-center justify-center"
              >
                See how it works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-[#3D3D3D]">
              <div>
                <div className="text-3xl font-bold text-[#5C8DB8]">~4ms</div>
                <div className="text-sm text-[#787774]">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5C8DB8]">120fps</div>
                <div className="text-sm text-[#787774]">Detection</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5C8DB8]">$0</div>
                <div className="text-sm text-[#787774]">Hardware</div>
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
