import Image from "next/image";

export default function StartTypes() {
  const startTypes = [
    {
      title: "Flying Start",
      description: "Run through at full speed. First gate crossing starts the timer automatically. Perfect for max velocity testing.",
      useCase: "Speed testing, flying 10m/20m/30m",
      image: "/start-flying.png",
    },
    {
      title: "Touch Release",
      description: "Place finger on screen, lift to start. Captures reaction time just like blocks at a real track meet.",
      useCase: "40 yard dash, combine testing",
      image: "/start-touch-release.png",
    },
    {
      title: "Countdown",
      description: "3... 2... 1... BEEP! A visual and audio countdown gives you a predictable start signal. Great for consistent training.",
      useCase: "Solo training, timed intervals",
      image: "/start-countdown.png",
    },
    {
      title: "Voice Command",
      description: '"On your marks... Set... GO!" AI voice commands with realistic timing based on official rules.',
      useCase: "Solo training, group starts",
      image: "/start-voice-command.png",
    },
    {
      title: "Start in Frame",
      description: "Begin stationary in the camera view, then take off. Timer starts when you leave the frame. No second device needed.",
      useCase: "Solo training, single phone setup",
      image: "/start-in-frame.png",
    },
  ];

  return (
    <section id="start-types" className="py-24 px-6 bg-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Five ways to
            <span className="block text-[#5C8DB8]">start your sprint</span>
          </h2>
          <p className="text-xl text-[#9B9A97] max-w-2xl mx-auto">
            Choose the start method that matches your training goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {startTypes.map((type, index) => (
            <div
              key={index}
              className={`card-gunmetal rounded-2xl overflow-hidden hover:border-[#5C8DB8]/30 transition-colors ${index === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="relative h-80 bg-[#0D0D0D]">
                <Image
                  src={type.image}
                  alt={type.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{type.title}</h3>
                <p className="text-[#9B9A97] mb-3">{type.description}</p>
                <p className="text-sm text-[#5C8DB8]">Best for: {type.useCase}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
