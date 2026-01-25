export default function Comparison() {
  const features = [
    {
      name: "Price",
      trackspeed: "Free / $4/mo*",
      freelap: "$500 - $2,000+",
      brower: "$1,500 - $5,000+",
      dashr: "$500 - $1,500+",
      stopwatch: "$10 - $50",
      highlight: true,
    },
    {
      name: "Claimed Accuracy",
      trackspeed: "±10ms",
      freelap: "±20ms",
      brower: "±1ms*",
      dashr: "±10ms",
      stopwatch: "±200ms",
    },
    {
      name: "Real-World Reliability",
      trackspeed: "±10ms",
      freelap: "±20ms",
      brower: "±50-60ms**",
      dashr: "±10ms",
      stopwatch: "±200ms",
      highlight: true,
    },
    {
      name: "Chest Detection",
      trackspeed: "Yes (torso only)",
      freelap: "No (any body part)",
      brower: "No (beam break)",
      dashr: "No (beam break)",
      stopwatch: "Visual guess",
      highlight: true,
    },
    {
      name: "Setup Time",
      trackspeed: "< 1 min",
      freelap: "5-10 min",
      brower: "10-20 min",
      dashr: "5-10 min",
      stopwatch: "Instant",
      highlight: true,
    },
    {
      name: "Hardware",
      trackspeed: "iPhone only",
      freelap: "Sensors + chips",
      brower: "Gates + pads",
      dashr: "Laser gates",
      stopwatch: "None",
      highlight: true,
    },
    {
      name: "Split Times",
      trackspeed: true,
      freelap: true,
      brower: true,
      dashr: true,
      stopwatch: false,
    },
    {
      name: "Photo Finish",
      trackspeed: true,
      freelap: false,
      brower: "Paid add-on",
      dashr: false,
      stopwatch: false,
      highlight: true,
    },
    {
      name: "Portability",
      trackspeed: "Pocket-sized",
      freelap: "Carry bag",
      brower: "Vehicle needed",
      dashr: "Carry bag",
      stopwatch: "Pocket-sized",
    },
  ];

  const renderValue = (value: string | boolean) => {
    if (value === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#22C55E]/20">
          <svg className="w-4 h-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      );
    }
    if (value === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#787774]/20">
          <svg className="w-4 h-4 text-[#787774]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      );
    }
    return value;
  };

  return (
    <section id="comparison" className="py-24 px-6 bg-[#0e1316]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How we <span className="text-[#5C8DB8]">compare</span>
          </h2>
          <p className="text-xl text-[#9B9A97]">
            Professional timing without the professional price tag
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="card-gunmetal rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1a1d20]">
                  <th className="text-left py-5 px-6 text-[#787774] font-medium text-sm uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="py-5 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <span className="text-[#5C8DB8] font-bold">TrackSpeed</span>
                      <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
                        YOU ARE HERE
                      </span>
                    </div>
                  </th>
                  <th className="py-5 px-4 text-center text-[#787774] font-medium">Freelap</th>
                  <th className="py-5 px-4 text-center text-[#787774] font-medium">Brower</th>
                  <th className="py-5 px-4 text-center text-[#787774] font-medium">DASHR</th>
                  <th className="py-5 px-4 text-center text-[#787774] font-medium">Stopwatch</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className={`border-t border-[#3D3D3D]/30 ${
                      feature.highlight ? "bg-[#5C8DB8]/5" : ""
                    }`}
                  >
                    <td className="py-4 px-6 text-white font-medium">{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-white font-semibold">
                        {renderValue(feature.trackspeed)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-[#9B9A97]">
                      {renderValue(feature.freelap)}
                    </td>
                    <td className="py-4 px-4 text-center text-[#9B9A97]">
                      {renderValue(feature.brower)}
                    </td>
                    <td className="py-4 px-4 text-center text-[#9B9A97]">
                      {renderValue(feature.dashr)}
                    </td>
                    <td className="py-4 px-4 text-center text-[#9B9A97]">
                      {renderValue(feature.stopwatch)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="card-gunmetal rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#5C8DB8] font-bold text-lg">TrackSpeed</span>
              <span className="text-[10px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-1 rounded-full">
                YOU ARE HERE
              </span>
            </div>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-[#3D3D3D]/30 last:border-0">
                  <span className="text-[#9B9A97]">{feature.name}</span>
                  <span className="text-white font-medium">{renderValue(feature.trackspeed)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Freelap", "Brower", "DASHR", "Stopwatch"].map((competitor) => (
              <div key={competitor} className="bg-[#2B2E32]/50 rounded-xl p-4">
                <h4 className="text-[#787774] font-medium text-sm mb-3">{competitor}</h4>
                <div className="space-y-2 text-sm">
                  {features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-[#787774]">{feature.name}</span>
                      <span className="text-[#9B9A97]">
                        {renderValue(feature[competitor.toLowerCase() as keyof typeof feature] as string | boolean)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-[#787774] text-xs mt-8 space-y-1">
          <p>*When billed annually. Prices are approximate.</p>
          <p>**Per <a href="https://www.researchgate.net/publication/266796025" className="text-[#5C8DB8] hover:underline" target="_blank" rel="noopener">peer-reviewed study</a>: Brower found "not reliable enough to monitor small changes for elite athletes"</p>
          <p>Beam systems trigger on any body part (hand/leg), not chest. TrackSpeed is designed for training, not official competition.</p>
        </div>
      </div>
    </section>
  );
}
