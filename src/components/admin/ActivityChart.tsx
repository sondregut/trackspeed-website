"use client"

interface DataPoint {
  date: string
  sessions: number
  users: number
}

interface ActivityChartProps {
  data: DataPoint[]
  metric: 'sessions' | 'users'
}

export default function ActivityChart({ data, metric }: ActivityChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#9B9A97]">
        No activity data available
      </div>
    )
  }

  const values = data.map(d => d[metric])
  const maxValue = Math.max(...values, 1)
  const minDate = data[0]?.date
  const maxDate = data[data.length - 1]?.date

  // Calculate bar width based on data length
  const barWidth = Math.max(100 / data.length - 1, 2)
  const gap = Math.min(1, 10 / data.length)

  return (
    <div className="h-64">
      {/* Y-axis labels */}
      <div className="flex h-full">
        <div className="flex flex-col justify-between text-xs text-[#9B9A97] pr-2 py-1">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue / 2)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="flex-1 flex items-end gap-[2px] border-l border-b border-[#3D3D3D] px-1 pb-1">
          {data.map((point, index) => {
            const height = (point[metric] / maxValue) * 100
            return (
              <div
                key={point.date}
                className="group relative flex-1 min-w-[3px] max-w-[20px]"
              >
                {/* Bar */}
                <div
                  className="w-full bg-[#5C8DB8] hover:bg-[#7BA9D4] transition-colors rounded-t cursor-pointer"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1A1A] border border-[#3D3D3D] rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <p className="font-medium text-white">{point[metric]} {metric}</p>
                  <p className="text-[#9B9A97]">{formatDate(point.date)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-[#9B9A97] mt-2 ml-8">
        <span>{minDate ? formatDate(minDate) : ''}</span>
        <span>{maxDate ? formatDate(maxDate) : ''}</span>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
