"use client"

interface DataPoint {
  type: string
  count: number
}

interface StartTypeChartProps {
  data: DataPoint[]
}

// Color palette for different start types
const COLORS = [
  '#5C8DB8', // Primary blue
  '#7BA9D4', // Light blue
  '#4A7A9D', // Dark blue
  '#8BC4EA', // Sky blue
  '#3D6B8A', // Navy
  '#9B9A97', // Gray fallback
]

const TYPE_LABELS: Record<string, string> = {
  whistle: 'Whistle',
  reaction: 'Reaction',
  voice: 'Voice',
  manual: 'Manual',
  solo: 'Solo',
  unknown: 'Unknown',
}

export default function StartTypeChart({ data }: StartTypeChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[#9B9A97]">
        No session data available
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.count, 0)
  let currentAngle = -90 // Start from top

  // Calculate pie slices
  const slices = data.map((item, index) => {
    const percentage = (item.count / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    currentAngle += angle

    return {
      ...item,
      percentage,
      angle,
      startAngle,
      endAngle: startAngle + angle,
      color: COLORS[index % COLORS.length],
    }
  })

  return (
    <div className="flex items-center gap-8">
      {/* Pie Chart using SVG */}
      <div className="relative w-48 h-48 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {slices.map((slice, index) => {
            const startAngle = (slices.slice(0, index).reduce((sum, s) => sum + s.angle, 0)) * (Math.PI / 180)
            const endAngle = startAngle + slice.angle * (Math.PI / 180)

            const x1 = 50 + 45 * Math.cos(startAngle)
            const y1 = 50 + 45 * Math.sin(startAngle)
            const x2 = 50 + 45 * Math.cos(endAngle)
            const y2 = 50 + 45 * Math.sin(endAngle)

            const largeArc = slice.angle > 180 ? 1 : 0

            // Handle full circle case
            if (slice.angle >= 359.9) {
              return (
                <circle
                  key={slice.type}
                  cx="50"
                  cy="50"
                  r="45"
                  fill={slice.color}
                />
              )
            }

            return (
              <path
                key={slice.type}
                d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={slice.color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            )
          })}
          {/* Center hole for donut effect */}
          <circle cx="50" cy="50" r="25" fill="#2B2E32" />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{total}</p>
            <p className="text-xs text-[#9B9A97]">sessions</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {slices.map((slice) => (
          <div key={slice.type} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-sm text-white">
              {TYPE_LABELS[slice.type] || slice.type}
            </span>
            <span className="text-sm text-[#9B9A97]">
              {slice.count} ({slice.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
