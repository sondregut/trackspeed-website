interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
  }
  icon?: React.ReactNode
}

export default function StatCard({ title, value, subtitle, trend, icon }: StatCardProps) {
  return (
    <div className="bg-[#2B2E32] rounded-xl p-6 border border-[#3D3D3D]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#9B9A97] text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
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
          <div className="text-[#5C8DB8] opacity-60">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
