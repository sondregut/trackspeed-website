import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Position your iPhone",
      description: "Place your phone at the finish line. No calibration needed—the app uses up to 120fps capture with linear interpolation to detect crossings with millisecond accuracy.",
      image: "/screenshot-setup.png",
    },
    {
      number: "02",
      title: "Start the session",
      description: "Choose your start method—countdown beeps, AI voice commands, touch release, or flying start. Multiple phones sync automatically for split timing.",
      image: "/screenshot-templates.png",
    },
    {
      number: "03",
      title: "Cross the line",
      description: "Run your sprint. Get instant results with photo finish thumbnails to verify each crossing.",
      image: "/screenshot-timing.png",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-[#0e1316]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How it works
          </h2>
          <p className="text-xl text-[#9B9A97] max-w-2xl mx-auto">
            Get started in under a minute
          </p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-6xl font-bold text-[#3D3D3D]">{step.number}</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-xl text-[#9B9A97]">{step.description}</p>
              </div>

              {/* Screenshot */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="iphone-mockup w-[260px] mx-auto">
                  <div className="iphone-screen aspect-[9/19.5] overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={260}
                      height={563}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
