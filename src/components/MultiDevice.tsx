import Image from "next/image";

export default function MultiDevice() {
  const features = [
    {
      title: "Wireless Connection",
      description: "Phones connect automatically via peer-to-peer WiFi. No internet required.",
    },
    {
      title: "Sub-millisecond Sync",
      description: "NTP-style clock synchronization ensures accurate timing across devices.",
    },
    {
      title: "Unlimited Gates",
      description: "Add split timing with 3+ phones. Track acceleration phases and top speed.",
    },
  ];

  return (
    <section id="multi-device" className="section-padding px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-section mb-6">
              Connect multiple phones for precise timing
            </h2>
            <p className="text-body mb-10">
              Use one iPhone at the start line and another at the finish.
              Add more phones for split times at any distance.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="icon-box flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[500px] w-full">
              <Image
                src="/multi-device.png"
                alt="Multiple phones connected for timing"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
