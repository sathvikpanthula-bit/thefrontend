import { CheckCircle, Clock, FileText } from 'lucide-react'

export default function SchemesCard() {
  const schemes = [
    { name: 'PM SVANidhi Loan',         status: 'Eligible',     stage: 'Application Pending', progress: 30,  color: '#F97316', icon: <Clock       size={13} className="text-orange-500" /> },
    { name: 'MSME Udyam Registration',  status: 'Recommended',  stage: 'Documents Ready',     progress: 60,  color: '#2563EB', icon: <FileText    size={13} className="text-blue-600"   /> },
    { name: 'FSSAI Food License',       status: 'Enrolled',     stage: 'License Active',      progress: 100, color: '#22C55E', icon: <CheckCircle size={13} className="text-green-600"  /> },
  ]
  return (
    <div className="card hover:shadow-card-hover">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-slate-800">Govt. Schemes Tracker</p>        <span className="badge-blue">3 Active</span>      </div>      <div className="space-y-4">
        {schemes.map(s => (
          <div key={s.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                {s.icon} {s.name}
              </div>              <span className="text-[10px] text-slate-400">{s.stage}</span>            </div>            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"                style={{ width: `${s.progress}%`, backgroundColor: s.color }} />            </div>          </div>        ))}      </div>    </div>  )
}