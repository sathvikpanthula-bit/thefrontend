import { PlusCircle, Package, QrCode } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface QuickActionsProps {
  onAddSale:     () => void
  onUpdateStock: () => void
}

export default function QuickActions({ onAddSale, onUpdateStock }: QuickActionsProps) {
  const navigate = useNavigate()
  return (
    <div className="card hover:shadow-card-hover">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Quick Actions</p>      <div className="grid grid-cols-3 gap-2">
        <button onClick={onAddSale}
          className="flex flex-col items-center gap-1.5 p-3 rounded-card bg-green-50 hover:bg-green-100 text-green-700 transition-all group">
          <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-semibold text-center leading-tight">Add Sale</span>
        </button>        <button onClick={onUpdateStock}
          className="flex flex-col items-center gap-1.5 p-3 rounded-card bg-blue-50 hover:bg-blue-100 text-blue-700 transition-all group">
          <Package size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-semibold text-center leading-tight">Update Stock</span>
        </button>        <button onClick={() => navigate('/dashboard/ai')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-card bg-orange-50 hover:bg-orange-100 text-orange-700 transition-all group">
          <QrCode size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-semibold text-center leading-tight">Download QR</span>
        </button>      </div>    </div>  )
}