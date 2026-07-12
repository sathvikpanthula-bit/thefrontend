interface HealthMeterProps {
  score:  number
  label?: string
}

export default function HealthMeter({ score, label = 'Business Health Score' }: HealthMeterProps) {
  const radius        = 52
  const circumference = 2 * Math.PI * radius
  const offset        = circumference - (score / 100) * circumference
  const color  = score >= 80 ? '#22C55E' : score >= 60 ? '#F97316' : '#EF4444'  const bg     = score >= 80 ? '#F0FDF4' : score >= 60 ? '#FFF7ED' : '#FEF2F2'
  return (
    <div className="card flex flex-col items-center justify-center text-center py-6 hover:shadow-card-hover">      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{label}</p>      <div className="relative w-32 h-32" style={{ background: bg, borderRadius: '50%', padding: 4 }}>        <svg width="128" height="128" viewBox="0 0 128 128">          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />          <circle            cx="64" cy="64" r={radius}            fill="none" stroke={color} strokeWidth="10"            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 64 64)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />        </svg>        <div className="absolute inset-0 flex flex-col items-center justify-center">          <span className="text-3xl font-bold" style={{ color }}>{score}</span>          <span className="text-[10px] text-slate-400 font-medium">/ 100</span>        </div>      </div>      <p className="text-xs text-slate-500 mt-3 max-w-[140px]">        {score >= 80 ? '🌟 Excellent — Keep it up!' : score >= 60 ? '📈 Good — Room to grow' : '⚠️ Needs attention'}      </p>      <div className="mt-3 w-full space-y-1.5">        <HealthBar label="Digital Visibility"  pct={score >= 60 ? score : 30} color={color} />        <HealthBar label="UPI Adoption"         pct={score >= 80 ? 90 : score >= 60 ? 55 : 20}    color={color} />        <HealthBar label="Scheme Enrollment"    pct={score >= 80 ? 70 : 35}                        color={color} />      </div>    </div>  )}

function HealthBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
        <span>{label}</span><span>{pct}%</span>
      </div>      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"          style={{ width: `${pct}%`, backgroundColor: color }} />      </div>    </div>  )
}