export default function QuickSetups() {
  const presets = [
    {
      category: "Combine Tests",
      color: "#E85D4C",
      tests: ["40 Yard Dash", "5-10-5"],
    },
    {
      category: "Acceleration",
      color: "var(--text-secondary)",
      tests: ["10m", "20m", "30m", "60m"],
    },
    {
      category: "Flying Sprints",
      color: "var(--accent-green)",
      tests: ["Flying 10m", "Flying 20m", "Flying 30m"],
    },
  ];

  return (
    <section id="quick-setups" className="section-padding px-6 bg-sky-wash">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-section mb-4">
            One-tap test presets
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            Pre-configured tests for common sprint distances. Select and go.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {presets.map((category, catIndex) => (
            <div key={catIndex} className="card-feature">
              <h3
                className="text-lg font-semibold mb-3 flex items-center gap-2"
                style={{ color: category.color }}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.category}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {category.tests.join(", ")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p style={{ color: 'var(--text-muted)' }}>
            Plus unlimited custom configurations for any distance and start type
          </p>
        </div>
      </div>
    </section>
  );
}
