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
      name: "Accuracy",
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
      brower: "Carry bag",
      dashr: "Carry bag",
      stopwatch: "Pocket-sized",
    },
  ];

  const renderValue = (value: string | boolean) => {
    if (value === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ background: '#D1FAE5' }}>
          <svg className="w-4 h-4" style={{ color: 'var(--accent-green)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      );
    }
    if (value === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ background: 'var(--border-light)' }}>
          <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      );
    }
    return value;
  };

  return (
    <section id="comparison" className="section-padding px-6 bg-mint-wash">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-section mb-4">
            How we compare
          </h2>
          <p className="text-body">
            Professional timing without the professional price tag
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="card-feature overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-mint)' }}>
                  <th className="text-left py-5 px-6 font-medium text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
                    Feature
                  </th>
                  <th className="py-5 px-4 text-center" style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <div className="inline-flex flex-col items-center gap-1">
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>TrackSpeed</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: 'var(--accent-green)', background: '#D1FAE5' }}>
                        YOU ARE HERE
                      </span>
                    </div>
                  </th>
                  <th className="py-5 px-4 text-center font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>Freelap</th>
                  <th className="py-5 px-4 text-center font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>Brower</th>
                  <th className="py-5 px-4 text-center font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>DASHR</th>
                  <th className="py-5 px-4 text-center font-medium" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>Stopwatch</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    style={{
                      background: feature.highlight ? 'var(--bg-sky)' : 'white',
                      borderTop: '1px solid var(--border-light)'
                    }}
                  >
                    <td className="py-4 px-6 font-medium" style={{ color: 'var(--text-primary)' }}>{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {renderValue(feature.trackspeed)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center" style={{ color: 'var(--text-muted)' }}>
                      {renderValue(feature.freelap)}
                    </td>
                    <td className="py-4 px-4 text-center" style={{ color: 'var(--text-muted)' }}>
                      {renderValue(feature.brower)}
                    </td>
                    <td className="py-4 px-4 text-center" style={{ color: 'var(--text-muted)' }}>
                      {renderValue(feature.dashr)}
                    </td>
                    <td className="py-4 px-4 text-center" style={{ color: 'var(--text-muted)' }}>
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
          <div className="card-feature p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>TrackSpeed</span>
              <span className="text-[10px] px-2 py-1 rounded-full" style={{ color: 'var(--accent-green)', background: '#D1FAE5' }}>
                YOU ARE HERE
              </span>
            </div>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex justify-between items-center py-2" style={{ borderBottom: index < features.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{feature.name}</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{renderValue(feature.trackspeed)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Freelap", "Brower", "DASHR", "Stopwatch"].map((competitor) => (
              <div key={competitor} className="card-feature p-4">
                <h4 className="font-medium text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{competitor}</h4>
                <div className="space-y-2 text-sm">
                  {features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>{feature.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {renderValue(feature[competitor.toLowerCase() as keyof typeof feature] as string | boolean)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs mt-8 space-y-1" style={{ color: 'var(--text-muted)' }}>
          <p>*When billed annually. Prices are approximate.</p>
          <p>**Per <a href="https://www.researchgate.net/publication/266796025" className="underline hover:no-underline" style={{ color: 'var(--text-secondary)' }} target="_blank" rel="noopener">peer-reviewed study</a>: Brower found &quot;not reliable enough to monitor small changes for elite athletes&quot;</p>
          <p>Beam systems trigger on any body part (hand/leg), not chest. TrackSpeed is designed for training, not official competition.</p>
        </div>
      </div>
    </section>
  );
}
