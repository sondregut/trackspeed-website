interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
  }
  icon?: React.ReactNode
  highlight?: boolean  // Highlight card with warning color (e.g., at-risk users)
}

export default function StatCard({ title, value, subtitle, trend, icon, highlight }: StatCardProps) {
  return (
    <div className={`rounded-xl p-6 border ${
      highlight
        ? 'bg-red-500/10 border-red-500/30'
        : 'bg-[#2B2E32] border-[#3D3D3D]'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#9B9A97] text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${highlight ? 'text-red-400' : 'text-white'}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[#9B9A97] text-sm mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-sm mt-2 ${trend.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className={highlight ? 'text-red-400 opacity-60' : 'text-[#5C8DB8] opacity-60'}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
