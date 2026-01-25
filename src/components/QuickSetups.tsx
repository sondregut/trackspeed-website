export default function QuickSetups() {
  const presets = [
    {
      category: "Combine Tests",
      color: "#E85D4C",
      tests: [
        { name: "40 Yard Dash", distance: "36.58m", start: "Touch Release", popular: true },
        { name: "Pro Agility", distance: "20 yards", start: "Touch Release", popular: false },
      ],
    },
    {
      category: "Acceleration",
      color: "#5C8DB8",
      tests: [
        { name: "10m Sprint", distance: "10m", start: "Voice Command", popular: true },
        { name: "20m Sprint", distance: "20m", start: "Audio Gun", popular: false },
        { name: "30m Sprint", distance: "30m", start: "Voice Command", popular: true },
        { name: "60m Sprint", distance: "60m", start: "Audio Gun", popular: false },
      ],
    },
    {
      category: "Max Speed",
      color: "#4CAF50",
      tests: [
        { name: "Flying 10m", distance: "10m", start: "Flying", popular: true },
        { name: "Flying 20m", distance: "20m", start: "Flying", popular: false },
        { name: "Flying 30m", distance: "30m", start: "Flying", popular: true },
      ],
    },
  ];

  return (
    <section id="quick-setups" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            One-tap
            <span className="block text-[#5C8DB8]">test presets</span>
          </h2>
          <p className="text-xl text-[#9B9A97] max-w-2xl mx-auto">
            Pre-configured tests for common sprint distances. Select and go.
          </p>
        </div>

        <div className="space-y-8">
          {presets.map((category, catIndex) => (
            <div key={catIndex}>
              <h3
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: category.color }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.category}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.tests.map((test, testIndex) => (
                  <div
                    key={testIndex}
                    className="card-gunmetal rounded-xl p-5 hover:border-[#5C8DB8]/30 transition-colors relative"
                  >
                    {test.popular && (
                      <span className="absolute -top-2 -right-2 bg-[#5C8DB8] text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    <h4 className="text-lg font-semibold mb-2">{test.name}</h4>
                    <div className="space-y-1 text-sm text-[#9B9A97]">
                      <p>Distance: <span className="text-white">{test.distance}</span></p>
                      <p>Start: <span className="text-white">{test.start}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#9B9A97]">
            Plus unlimited custom configurations for any distance and start type
          </p>
        </div>
      </div>
    </section>
  );
}
