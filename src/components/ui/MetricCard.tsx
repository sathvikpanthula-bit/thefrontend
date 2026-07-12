import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

interface MetricCardProps {
  title:    string
  value:    string
  subtitle?: string
  icon:     ReactNode
  iconBg:   string
  change?:  number
  badge?:   { text: string; color: 'green' | 'orange' | 'blue' | 'red' }
  children?: ReactNode
}

export default function MetricCard({
  title, value, subtitle, icon, iconBg, change, badge, children
}: MetricCardProps) {
  return (
    <div className="card hover:shadow-card-hover group">
      <div className="flex items-start justify-between mb-3">
        <div className={clsx('w-10 h-10 rounded-card flex items-center justify-center', iconBg)}>
          {icon}
        </div>
        {badge && (
          <span className={clsx(
            'text-xs font-semibold px-2.5 py-0.5 rounded-full',
            badge.color === 'green'  && 'bg-green-50  text-green-700',
            badge.color === 'orange' && 'bg-orange-50 text-orange-700',
            badge.color === 'blue'   && 'bg-blue-50   text-blue-700',
            badge.color === 'red'    && 'bg-red-50    text-red-700',
          )}>
            {badge.text}
          </span>
        )}
        {change !== undefined && (
          <span className={clsx(
            'flex items-center gap-0.5 text-xs font-semibold',
            change >= 0 ? 'text-green-600' : 'text-red-500'
          )}>
            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-0.5">{value}</p>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{title}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      {children}
    </div>
  )
}