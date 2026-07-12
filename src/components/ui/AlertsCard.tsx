import { AlertTriangle, CheckCircle, Bell } from 'lucide-react'

interface AlertsCardProps {
  items: string[]
}

export default function AlertsCard({ items }: AlertsCardProps) {
  return (
    <div className="card hover:shadow-card-hover">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-card bg-red-50 flex items-center justify-center">
            <Bell size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{items.length}</p>            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Inventory Alerts</p>          </div>        </div>        {items.length > 0 && <span className="badge-red">Low Stock</span>}
      </div>      {items.length === 0 ? (
        <div className="flex items-center gap-2 text-green-600 text-xs font-medium mt-2">
          <CheckCircle size={14} /> All inventory levels are healthy
        </div>      ) : (
        <ul className="space-y-1.5 mt-2">
          {items.slice(0, 4).map((alert, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <AlertTriangle size={12} className="text-orange-400 mt-0.5 shrink-0" />
              {alert}
            </li>          ))}          {items.length > 4 && (
            <li className="text-xs text-slate-400">+{items.length - 4} more items low on stock</li>
          )}
        </ul>      )}
    </div>  )
}