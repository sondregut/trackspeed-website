export default function TimingTechnology() {
  return (
    <section id="timing-technology" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The science behind
            <span className="block text-[#5C8DB8]">sub-frame precision</span>
          </h2>
          <p className="text-xl text-[#9B9A97] max-w-2xl mx-auto">
            How we achieve ~4ms accuracy with standard iPhone cameras
          </p>
        </div>

        {/* Main explanation card */}
        <div className="card-gunmetal rounded-3xl p-8 md:p-12 mb-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Visual diagram */}
            <div className="relative">
              {/* Frame timeline visualization */}
              <div className="bg-[#1A1D21] rounded-2xl p-6">
                <div className="text-sm text-[#787774] mb-4 font-mono">
                  120fps capture = 8.3ms between frames
                </div>

                {/* Timeline */}
                <div className="relative h-32 mb-6">
                  {/* Timeline line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#3D3D3D]"></div>

                  {/* Frame markers */}
                  <div className="absolute left-[20%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-[#3D3D3D] border-2 border-[#5C8DB8]"></div>
                    <span className="text-xs text-[#787774] mt-2">Frame N</span>
                    <span className="text-xs text-[#5C8DB8] font-mono">d₀ = 12px</span>
                  </div>

                  {/* Crossing point (interpolated) */}
                  <div className="absolute left-[45%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-3 h-8 bg-[#22C55E] rounded-sm"></div>
                    <span className="text-xs text-[#22C55E] mt-2 font-semibold">Gate</span>
                  </div>

                  {/* Athlete position indicator */}
                  <div className="absolute left-[38%] top-[25%] flex flex-col items-center">
                    <svg
                      className="w-6 h-6 text-[#5C8DB8]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
                    </svg>
                  </div>

                  <div className="absolute left-[70%] top-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-[#3D3D3D] border-2 border-[#5C8DB8]"></div>
                    <span className="text-xs text-[#787774] mt-2">Frame N+1</span>
                    <span className="text-xs text-[#5C8DB8] font-mono">d₁ = 18px</span>
                  </div>
                </div>

                {/* Formula */}
                <div className="bg-[#2B2E32] rounded-xl p-4 font-mono text-center">
                  <div className="text-[#9B9A97] text-sm mb-2">
                    Linear interpolation formula
                  </div>
                  <div className="text-[#5C8DB8] text-lg">
                    α = d₀ / (d₀ + d₁) = 12 / 30 = 0.4
                  </div>
                  <div className="text-[#22C55E] text-sm mt-2">
                    Crossing time = Frame N + (0.4 × 8.3ms) = +3.3ms
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Explanation */}
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Beyond frame-by-frame timing
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5C8DB8]/20 flex items-center justify-center text-[#5C8DB8] font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">120fps Capture</h4>
                    <p className="text-sm text-[#9B9A97]">
                      Camera captures 120 frames per second, giving us 8.3ms
                      resolution between frames.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5C8DB8]/20 flex items-center justify-center text-[#5C8DB8] font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Sub-frame Interpolation
                    </h4>
                    <p className="text-sm text-[#9B9A97]">
                      We measure the athlete&apos;s distance to the gate in
                      consecutive frames and calculate the exact crossing moment
                      using linear interpolation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#5C8DB8]/20 flex items-center justify-center text-[#5C8DB8] font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Rolling Shutter Fix</h4>
                    <p className="text-sm text-[#9B9A97]">
                      We add 0.75× exposure duration to compensate for the
                      camera&apos;s rolling shutter, ensuring the timing matches
                      when the athlete actually crossed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#22C55E]/20 flex items-center justify-center text-[#22C55E] font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">~4ms Effective Accuracy</h4>
                    <p className="text-sm text-[#9B9A97]">
                      The combination of high frame rate, sub-frame
                      interpolation, and exposure compensation delivers timing
                      precision comparable to professional systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card-gunmetal rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#5C8DB8] mb-2">8.3ms</div>
            <div className="text-sm text-[#9B9A97]">Frame interval at 120fps</div>
          </div>
          <div className="card-gunmetal rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#5C8DB8] mb-2">~0.5ms</div>
            <div className="text-sm text-[#9B9A97]">
              Interpolation resolution
            </div>
          </div>
          <div className="card-gunmetal rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#22C55E] mb-2">~4ms</div>
            <div className="text-sm text-[#9B9A97]">
              Effective timing accuracy
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
