import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardProps {
  title: string
  value: string
  icon: LucideIcon
  change: string
  isPositive: boolean
  color: string
}

function StatCard({ title, value, icon: Icon, change, isPositive, color }: CardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full",
          isPositive 
            ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" 
            : "text-rose-600 bg-rose-50 dark:bg-rose-900/20"
        )}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
      </div>
    </div>
  )
}

export default function DashboardCards() {
  const stats = [
    {
      title: 'Total Bookings',
      value: '1,284',
      icon: TrendingUp,
      change: '+12.5%',
      isPositive: true,
      color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Total Users',
      value: '8,432',
      icon: TrendingUp,
      change: '+3.2%',
      isPositive: true,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Active Bookings',
      value: '432',
      icon: TrendingUp,
      change: '-2.4%',
      isPositive: false,
      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Total Revenue',
      value: '$42,560',
      icon: TrendingUp,
      change: '+18.2%',
      isPositive: true,
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
