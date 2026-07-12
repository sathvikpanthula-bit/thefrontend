import { Lightbulb } from 'lucide-react'

interface AITipCardProps {
  tip: string
}

export default function AITipCard({ tip }: AITipCardProps) {
  return (
    <div className="card-lg border-l-4 border-l-orange-400 bg-gradient-to-r from-orange-50 to-white hover:shadow-card-hover">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-card bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb size={18} className="text-orange-500" />
        </div>
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">AI Business Tip</p>          <p className="text-sm text-slate-700 leading-relaxed font-medium">{tip}</p>          <p className="text-[11px] text-slate-400 mt-2">Powered by IBM watsonx.ai · Granite</p>        </div>      </div>    </div>  )
}