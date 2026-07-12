import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { DashboardMetrics, Sale } from '../types'
import {  
  TrendingUp, Package, Lightbulb, BadgeCheck, Zap,  
  IndianRupee, AlertTriangle, Plus, RefreshCw, BarChart2
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import clsx from 'clsx'

const QUICK_SALES_MOCK = [
  { day: 'Mon', sales: 1850 }, { day: 'Tue', sales: 2200 }, { day: 'Wed', sales: 1700 },  
  { day: 'Thu', sales: 2650 }, { day: 'Fri', sales: 3100 }, { day: 'Sat', sales: 2900 }, { day: 'Sun', sales: 2450 },
]

function HealthMeter({ score }: { score: number }) {
  const color = score >= 75 ? '#22C55E' : score >= 50 ? '#F97316' : '#EF4444';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work';
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="12" />
          <circle
            cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="12"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold" style={{ color }}>{score}%</span>
          <span className="text-[11px] font-semibold text-slate-500">{label}</span>
        </div>
      </div>
      <div className="text-xs text-slate-500 mt-2 text-center">Digital Business Health Score</div>
    </div>
  )
}

function QuickSaleModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ item_name: '', quantity: '', unit_price: '', payment_mode: 'Cash' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/sales/', {
        amount: parseFloat(form.quantity) * parseFloat(form.unit_price),
        description: `${form.item_name} (${form.quantity} units)`,
      })
      onSaved()
      onClose()
    } catch { } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card-lg w-full max-w-md bg-white rounded-xl p-5 shadow-lg">
        <h2 className="text-base font-bold text-slate-800 mb-4">Add Sale Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Item Name</label>
            <input className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="e.g. Watermelon"              value={form.item_name}
              onChange={e => setForm({ ...form, item_name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity</label>
              <input type="number" className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="2"                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Unit Price (₹)</label>
              <input type="number" className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="40"                value={form.unit_price}
                onChange={e => setForm({ ...form, unit_price: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Mode</label>
            <select className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" value={form.payment_mode}
              onChange={e => setForm({ ...form, payment_mode: e.target.value })}>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="border border-slate-200 rounded-lg p-2 text-sm flex-1 font-semibold hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={loading} className="bg-orange-500 text-white rounded-lg p-2 text-sm flex-1 font-semibold hover:bg-orange-600 disabled:opacity-50">
              {loading ? 'Saving...' : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DashboardHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [metrics, setMetrics]         = useState<DashboardMetrics | null>(null)
  const [recentSales, setRecentSales] = useState<Sale[]>([])
  const [loading, setLoading]         = useState(true)
  const [showSaleModal, setShowSaleModal] = useState(false)

  const loadData = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        api.get('/dashboard/metrics'),
        api.get('/sales/'),
      ])
      setMetrics(mRes.data)
      setRecentSales(Array.isArray(sRes.data) ? sRes.data.slice(0, 5) : [])
    } catch {
      setMetrics({
        today_sales: 2450, today_sales_change: 12.3, weekly_profit: 14280,
        low_stock_items: ['Bananas low: 3 dozen remaining', 'Mangoes low: 4 kg remaining'],
        health_score: 78,
        ai_tip: 'Consumer Behavior Insight: Watermelon sales peak between 1 PM – 4 PM. Bundle with lime juice for higher margins!',
      })
    } finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-3 h-3 rounded-full bg-orange-400 animate-bounce"             style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-3 sm:p-5 space-y-4 sm:space-y-5 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-4 sm:p-5 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-start">
          <div>
            <div className="text-[10px] sm:text-xs font-semibold opacity-80 uppercase tracking-wider">Good Morning</div>
            <div className="text-xl sm:text-2xl font-bold mt-0.5">{user?.vendor_name || 'Vendor'} 👋</div>
            <div className="text-xs sm:text-sm opacity-95 mt-1">{user?.business_name} · {user?.area}, {user?.city}</div>
          </div>
          <div className="text-left sm:text-right border-t border-white/20 pt-3 sm:pt-0 sm:border-0">
            <div className="text-[10px] sm:text-xs opacity-80">Today's Performance</div>
            <div className="text-2xl sm:text-3xl font-extrabold">{fmt(metrics?.today_sales || 0)}</div>
            <div className={clsx(
              'text-xs font-semibold mt-0.5',
              (metrics?.today_sales_change || 0) >= 0 ? 'text-green-200' : 'text-red-200'
            )}>
              {(metrics?.today_sales_change || 0) >= 0 ? '↑' : '↓'} {Math.abs(metrics?.today_sales_change || 0)}% vs yesterday
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today's Sales</div>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <IndianRupee size={16} className="text-green-600" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{fmt(metrics?.today_sales || 0)}</div>
          <div className="mt-2 inline-block bg-green-50 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded">↑ {metrics?.today_sales_change || 0}% today</div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Weekly Profit</div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{fmt(metrics?.weekly_profit || 0)}</div>
          <div className="text-xs text-slate-400 mt-2">Last 7 days revenue</div>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock Alerts</div>
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <AlertTriangle size={16} className="text-orange-500" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{(metrics?.low_stock_items || []).length}</div>
          {(metrics?.low_stock_items || []).length > 0 ? (
            <div className="mt-2 inline-block bg-orange-50 text-orange-700 text-[11px] font-semibold px-2 py-0.5 rounded">{(metrics?.low_stock_items || [])[0]?.split(':')[0]} low</div>
          ) : (
            <div className="mt-2 inline-block bg-green-50 text-green-700 text-[11px] font-semibold px-2 py-0.5 rounded">All stocked up</div>
          )}
        </div>

        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Profile Status</div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <BadgeCheck size={16} className="text-purple-600" />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-700">PM SVANidhi</div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Application</span><span>65%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Tip + Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-100 border-l-4 border-l-orange-400 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
              <Lightbulb size={14} className="text-orange-600" />
            </div>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wide">IBM Watsonx AI Insight</div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{metrics?.ai_tip || 'Loading AI insights...'}</p>
          <button onClick={() => navigate('/dashboard/ai')} className="mt-4 text-xs text-orange-600 font-semibold hover:underline flex items-center gap-1 bg-transparent border-0 p-0 cursor-pointer">
            Ask AI Assistant for more insights →
          </button>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center justify-center">
          <HealthMeter score={metrics?.health_score || 40} />
        </div>
      </div>

      {/* Weekly Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-4 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-slate-800">Weekly Sales Trend</div>
              <div className="text-xs text-slate-400">Last 7 days performance</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <BarChart2 size={16} className="text-blue-600" />
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[300px]">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={QUICK_SALES_MOCK} barSize={24}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="sales" fill="#F97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="text-sm font-bold text-slate-800 mb-4">Quick Actions</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            <button onClick={() => setShowSaleModal(true)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-800 text-sm font-semibold transition-all border-0 text-left cursor-pointer">
              <Plus size={16} className="text-green-600" /> Add Sale Entry
            </button>
            <button onClick={() => navigate('/dashboard/inventory')} className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-sm font-semibold transition-all border-0 text-left cursor-pointer">
              <Package size={16} className="text-blue-600" /> Update Inventory
            </button>
            <button onClick={() => navigate('/dashboard/ai')} className="w-full flex items-center gap-3 p-3 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 text-sm font-semibold transition-all border-0 text-left cursor-pointer">
              <Zap size={16} className="text-orange-600" /> AI Business Coach
            </button>
            <button onClick={() => window.location.reload()} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium transition-all border-0 text-left cursor-pointer sm:col-span-2 lg:col-span-1">
              <RefreshCw size={14} className="text-slate-400" /> Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock + Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {(metrics?.low_stock_items || []).length > 0 && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <div className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" /> Low Stock Alerts
            </div>
            <div className="space-y-2">
              {(metrics?.low_stock_items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-orange-50 rounded-lg text-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full shrink-0" />
                  <span className="text-slate-700 text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recentSales.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <div className="text-sm font-bold text-slate-800 mb-3">Recent Transactions</div>
            <div className="space-y-2">
              {recentSales.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 text-xs sm:text-sm">
                  <div>
                    <div className="font-semibold text-slate-700">{s.item_name || s.description || 'General Sale'}</div>
                    <div className="text-[10px] sm:text-xs text-slate-400">
                      {s.sale_date ? new Date(s.sale_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={(s.payment_mode || 'Cash') === 'UPI' ? 'bg-blue-50 text-blue-700 text-[10px] sm:text-xs px-2 py-0.5 rounded font-medium' : 'bg-slate-100 text-slate-700 text-[10px] sm:text-xs px-2 py-0.5 rounded font-medium'}>{s.payment_mode || 'Cash'}</span>
                    <span className="font-bold text-green-600">+₹{((s.total_amount || s.amount || 0)).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showSaleModal && <QuickSaleModal onClose={() => setShowSaleModal(false)} onSaved={loadData} />}
    </div>
  )
}