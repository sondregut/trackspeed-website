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
    <section id="multi-device" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Connect multiple phones for
              <span className="text-[#5C8DB8]"> precise timing</span>
            </h2>
            <p className="text-xl text-[#9B9A97] mb-8">
              Use one iPhone at the start line and another at the finish.
              Add more phones for split times at any distance.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#5C8DB8]/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#5C8DB8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-[#9B9A97]">{feature.description}</p>
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
