import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  gradient: "primary" | "success" | "warning" | "danger" | "info"
  className?: string
}

export function MetricCard({ title, value, icon, trend, gradient, className }: MetricCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg p-6 shadow-card transition-smooth hover:shadow-glow",
      `bg-gradient-${gradient}`,
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center space-x-2">
          <span className={cn(
            "text-sm font-medium",
            trend.isPositive ? "text-green-100" : "text-red-100"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}
          </span>
          <span className="text-sm text-white/60">vs last month</span>
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
    </div>
  )
}