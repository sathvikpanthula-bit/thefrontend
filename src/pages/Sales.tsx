import { useState, useEffect } from 'react'
import api from '../lib/api'
import { Sale } from '../types'
import toast from 'react-hot-toast'
import { Plus, TrendingUp, IndianRupee, Smartphone, Coins, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import clsx from 'clsx'

const DEMO_SALES: Sale[] = [
  { id: 1, item_name: 'Watermelon',       quantity: 3,   unit_price: 40,  total_amount: 120, payment_mode: 'UPI',  transaction_ref: 'TXN824712', sale_date: new Date(Date.now() - 1  * 3600000).toISOString() },
  { id: 2, item_name: 'Mango (Alphonso)', quantity: 2,   unit_price: 180, total_amount: 360, payment_mode: 'Cash', transaction_ref: null,        sale_date: new Date(Date.now() - 2  * 3600000).toISOString() },
  { id: 3, item_name: 'Banana',           quantity: 1,   unit_price: 40,  total_amount: 40,  payment_mode: 'UPI',  transaction_ref: 'TXN293847', sale_date: new Date(Date.now() - 3  * 3600000).toISOString() },
  { id: 4, item_name: 'Pomegranate',      quantity: 2,   unit_price: 90,  total_amount: 180, payment_mode: 'Cash', transaction_ref: null,        sale_date: new Date(Date.now() - 4  * 3600000).toISOString() },
  { id: 5, item_name: 'Grapes (Green)',   quantity: 1.5, unit_price: 120, total_amount: 180, payment_mode: 'UPI',  transaction_ref: 'TXN736492', sale_date: new Date(Date.now() - 5  * 3600000).toISOString() },
  { id: 6, item_name: 'Papaya',           quantity: 1,   unit_price: 60,  total_amount: 60,  payment_mode: 'Cash', transaction_ref: null,        sale_date: new Date(Date.now() - 26 * 3600000).toISOString() },
  { id: 7, item_name: 'Watermelon',       quantity: 5,   unit_price: 40,  total_amount: 200, payment_mode: 'UPI',  transaction_ref: 'TXN112938', sale_date: new Date(Date.now() - 28 * 3600000).toISOString() },
  { id: 8, item_name: 'Mango (Alphonso)', quantity: 3,   unit_price: 180, total_amount: 540, payment_mode: 'Cash', transaction_ref: null,        sale_date: new Date(Date.now() - 50 * 3600000).toISOString() },
]

const WEEKLY_DATA = [
  { day: 'Mon', upi: 820,  cash: 680  },
  { day: 'Tue', upi: 1100, cash: 900  },
  { day: 'Wed', upi: 640,  cash: 760  },
  { day: 'Thu', upi: 1350, cash: 980  },
  { day: 'Fri', upi: 1820, cash: 1200 },
  { day: 'Sat', upi: 1600, cash: 1100 },
  { day: 'Sun', upi: 1250, cash: 980  },
]

function AddSaleModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    item_name: '', quantity: '', unit_price: '', payment_mode: 'Cash', transaction_ref: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/sales/', {
        amount: parseFloat(form.quantity) * parseFloat(form.unit_price),
        description: `${form.item_name} (${form.quantity} units)`,
      })
      toast.success('Sale recorded successfully!')
      onSaved()
      onClose()
    } catch { 
      toast.error('Failed to record sale')
    } finally { 
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card-lg w-full max-w-md bg-white rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Record New Sale</h2>
          <button onClick={onClose} className="p-1 rounded-card hover:bg-slate-100 text-slate-400 border-0 bg-transparent cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Item Name *</label>
            <input className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="e.g. Watermelon"
              value={form.item_name}
              onChange={e => setForm({ ...form, item_name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity *</label>
              <input type="number" min="0" step="0.1" className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="2"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Unit Price ₹ *</label>
              <input type="number" min="0" className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="40"
                value={form.unit_price}
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
          {form.payment_mode === 'UPI' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">UPI Transaction Ref</label>
              <input className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="TXN123456"
                value={form.transaction_ref}
                onChange={e => setForm({ ...form, transaction_ref: e.target.value })} />
            </div>
          )}
          {form.quantity && form.unit_price && (
            <div className="bg-green-50 rounded-lg p-3 text-sm font-bold text-green-700">
              Total: ₹{(parseFloat(form.quantity) * parseFloat(form.unit_price)).toLocaleString('en-IN')}
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="border border-slate-200 rounded-lg p-2 text-sm flex-1 font-semibold hover:bg-slate-50 bg-white">Cancel</button>
            <button type="submit" disabled={loading} className="bg-green-600 text-white rounded-lg p-2 text-sm flex-1 font-semibold hover:bg-green-700 disabled:opacity-50 border-0 cursor-pointer">
              {loading ? 'Saving...' : 'Record Sale ₹'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Sales() {
  const [sales, setSales]         = useState<Sale[]>([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterMode, setFilterMode] = useState<'All' | 'UPI' | 'Cash'>('All')

  const loadSales = async () => {
    try {
      const res = await api.get('/sales/')
      setSales(Array.isArray(res.data) && res.data.length > 0 ? res.data : DEMO_SALES)
    } catch {
      setSales(DEMO_SALES)
    } finally { setLoading(false) }
  }

  useEffect(() => { loadSales() }, [])

  const filtered      = sales.filter(s => filterMode === 'All' || (s.payment_mode || 'Cash') === filterMode)
  const totalRevenue  = sales.reduce((sum, s) => sum + (s.total_amount || s.amount || 0), 0)
  const upiRevenue    = sales.filter(s => s.payment_mode === 'UPI').reduce((sum, s) => sum + (s.total_amount || s.amount || 0), 0)
  const cashRevenue   = sales.filter(s => s.payment_mode !== 'UPI').reduce((sum, s) => sum + (s.total_amount || s.amount || 0), 0)
  const upiPct        = totalRevenue > 0 ? Math.round((upiRevenue / totalRevenue) * 100) : 0

  const pieData = [
    { name: 'UPI',  value: upiRevenue,  color: '#2563EB' },
    { name: 'Cash', value: cashRevenue, color: '#22C55E' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="flex gap-2">
        {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-orange-400 animate-bounce" />)}
      </div>
    </div>
  )

  return (
    <div className="p-3 sm:p-5 space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Sales & Revenue</h1>
          <p className="text-sm text-slate-400">{filtered.length} transactions tracked · {upiPct}% digital</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-green-700 flex items-center gap-2 border-0 cursor-pointer shadow-sm">
          <Plus size={16} /> Record Sale
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <IndianRupee size={18} className="text-green-600" />
            </div>
            <span className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">₹{totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-400 mt-1">All-time Revenue</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Smartphone size={18} className="text-blue-600" />
            </div>
            <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded font-medium">{upiPct}%</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">₹{upiRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-400 mt-1">UPI Collections</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Coins size={18} className="text-green-600" />
            </div>
            <span className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded font-medium">{100 - upiPct}%</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">₹{cashRevenue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-400 mt-1">Cash Collections</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            ₹{filtered.length > 0 ? Math.round(totalRevenue / filtered.length).toLocaleString('en-IN') : 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">Avg. Transaction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Weekly Revenue Split (UPI vs Cash)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={WEEKLY_DATA} barSize={20}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                formatter={(v: number, n: string) => [`₹${v.toLocaleString('en-IN')}`, n === 'upi' ? 'UPI' : 'Cash']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="upi"  name="UPI"  fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cash" name="Cash" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Payment Split</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                dataKey="value"
                label={({ name, value }) => `${name}: ₹${value.toLocaleString('en-IN')}`}
                labelLine={false} fontSize={10}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <span className="text-xs text-slate-500 font-medium">Filter by:</span>
        {((['All', 'UPI', 'Cash'] as const)).map(m => (
          <button key={m} onClick={() => setFilterMode(m)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer',
              filterMode === m
                ? m === 'UPI'  ? 'bg-blue-600 text-white border-blue-600'
                : m === 'Cash' ? 'bg-green-500 text-white border-green-500'
                :                'bg-orange-500 text-white border-orange-500'
                : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
            )}>
            {m}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} transactions</span>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Item</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Ref / Note</th>
                <th className="p-3">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-slate-400 text-xs">{idx + 1}</td>
                  <td className="p-3 font-semibold text-slate-700">{s.item_name || s.description || 'General Item'}</td>
                  <td className="p-3 text-slate-600">{s.quantity || 1}</td>
                  <td className="p-3 text-slate-600">₹{s.unit_price || (s.total_amount || s.amount || 0)}</td>
                  <td className="p-3 font-bold text-green-700">+₹{((s.total_amount || s.amount || 0)).toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className={clsx('inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full', (s.payment_mode || 'Cash') === 'UPI' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700')}>
                      {(s.payment_mode || 'Cash') === 'UPI' ? <Smartphone size={10} /> : <Coins size={10} />}
                      {s.payment_mode || 'Cash'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-xs font-mono">{s.transaction_ref || '—'}</td>
                  <td className="p-3 text-slate-400 text-xs">
                    <div>{s.sale_date ? new Date(s.sale_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}</div>
                    <div className="text-[10px]">{s.sale_date ? new Date(s.sale_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-slate-400 py-10">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && <AddSaleModal onClose={() => setShowModal(false)} onSaved={loadSales} />}
    </div>
  )
}