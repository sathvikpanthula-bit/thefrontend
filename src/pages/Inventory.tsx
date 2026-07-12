import { useState, useEffect } from 'react'
import api from '../lib/api'
import { InventoryItem } from '../types'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, CheckCircle, AlertTriangle, Package, X } from 'lucide-react'
import clsx from 'clsx'

const DEMO_INVENTORY: InventoryItem[] = [
  { id: 1, item_name: 'Watermelon',      category: 'Fruits', stock_qty: 18, unit: 'piece', price_per_unit: 40,  low_stock_threshold: 5, updated_at: new Date().toISOString() },
  { id: 2, item_name: 'Banana',          category: 'Fruits', stock_qty: 3,  unit: 'dozen', price_per_unit: 40,  low_stock_threshold: 5, updated_at: new Date().toISOString() },
  { id: 3, item_name: 'Mango (Alphonso)',category: 'Fruits', stock_qty: 12, unit: 'kg',     price_per_unit: 180, low_stock_threshold: 3, updated_at: new Date().toISOString() },
  { id: 4, item_name: 'Papaya',          category: 'Fruits', stock_qty: 4,  unit: 'piece', price_per_unit: 60,  low_stock_threshold: 5, updated_at: new Date().toISOString() },
  { id: 5, item_name: 'Pomegranate',     category: 'Fruits', stock_qty: 22, unit: 'piece', price_per_unit: 90,  low_stock_threshold: 5, updated_at: new Date().toISOString() },
  { id: 6, item_name: 'Grapes (Green)',  category: 'Fruits', stock_qty: 8,  unit: 'kg',     price_per_unit: 120, low_stock_threshold: 3, updated_at: new Date().toISOString() },
]

const CATEGORIES = ['Fruits', 'Vegetables', 'Dairy', 'Grains', 'Beverages', 'Snacks', 'Other']
const UNITS      = ['kg', 'piece', 'dozen', 'litre', 'gram', 'pack', 'bunch']

interface ItemFormData {
  item_name:           string
  category:            string
  stock_qty:           string
  unit:                string
  price_per_unit:      string
  low_stock_threshold: string
}

const emptyForm: ItemFormData = {
  item_name: '', category: 'Fruits', stock_qty: '', unit: 'kg',
  price_per_unit: '', low_stock_threshold: '5',
}

interface ItemModalProps {
  initialData?: ItemFormData
  onClose: () => void
  onSave:  (data: ItemFormData) => Promise<void>
  title:   string
}

function ItemModal({ initialData = emptyForm, onClose, onSave, title }: ItemModalProps) {
  const [form, setForm]   = useState<ItemFormData>(initialData)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="card-lg w-full max-w-md bg-white rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-card hover:bg-slate-100 text-slate-400 border-0 bg-transparent cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Item Name *</label>
            <input className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="e.g. Alphonso Mango"
              value={form.item_name}
              onChange={e => setForm({ ...form, item_name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Unit</label>
              <select className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white" value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Stock Quantity *</label>
              <input type="number" min="0" step="0.1" className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="20"
                value={form.stock_qty}
                onChange={e => setForm({ ...form, stock_qty: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Price per Unit (₹) *</label>
              <input type="number" min="0" step="0.5" className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="40"
                value={form.price_per_unit}
                onChange={e => setForm({ ...form, price_per_unit: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Low Stock Alert Threshold</label>
            <input type="number" min="0" className="w-full border border-slate-200 rounded-lg p-2 text-sm" placeholder="5"
              value={form.low_stock_threshold}
              onChange={e => setForm({ ...form, low_stock_threshold: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="border border-slate-200 rounded-lg p-2 text-sm flex-1 font-semibold hover:bg-slate-50 bg-white">Cancel</button>
            <button type="submit" disabled={saving} className="bg-orange-500 text-white rounded-lg p-2 text-sm flex-1 font-semibold hover:bg-orange-600 border-0 cursor-pointer">
              {saving ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Inventory() {
  const [items, setItems]         = useState<InventoryItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editItem, setEditItem]   = useState<InventoryItem | null>(null)
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('All')

  const loadItems = async () => {
    try {
      const res = await api.get('/inventory/')
      setItems(Array.isArray(res.data) && res.data.length > 0 ? res.data : DEMO_INVENTORY)
    } catch {
      setItems(DEMO_INVENTORY)
    } finally { setLoading(false) }
  }

  useEffect(() => { loadItems() }, [])

  const handleAdd = async (form: ItemFormData) => {
    try {
      // 🚀 FIXED: Mapping variables directly to what the backend ItemRequest schema expects to clear 422!
      await api.post('/inventory/', {
        name: form.item_name,
        category: form.category,
        quantity: parseFloat(form.stock_qty),
        price: parseFloat(form.price_per_unit),
      })
      toast.success(`${form.item_name} added to inventory`)
      await loadItems()
      setShowAddModal(false)
    } catch { toast.error('Failed to add item') }
  }

  const handleEdit = async (form: ItemFormData) => {
    if (!editItem) return
    try {
      await api.put(`/inventory/${editItem.id}`, {
        name: form.item_name,
        category: form.category,
        quantity: parseFloat(form.stock_qty),
        price: parseFloat(form.price_per_unit),
      })
      toast.success('Item updated successfully')
      await loadItems()
      setEditItem(null)
    } catch { toast.error('Failed to update item') }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}" from inventory?`)) return
    try {
      await api.delete(`/inventory/${id}`)
      toast.success(`${name} removed`)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch { toast.error('Failed to delete item') }
  }

  const filteredItems = items.filter(item => {
    const itemName = item.item_name || item.name || ''
    const itemCategory = item.category || 'General'
    const matchSearch = itemName.toLowerCase().includes(search.toLowerCase())
    const matchCat    = filterCat === 'All' || itemCategory === filterCat
    return matchSearch && matchCat
  })

  const lowStockCount = items.filter(i => (i.stock_qty || i.quantity || 0) <= (i.low_stock_threshold || 5)).length
  const totalValue    = items.reduce((sum, i) => sum + ((i.stock_qty || i.quantity || 0) * (i.price_per_unit || i.price || 0)), 0)

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
          <h1 className="text-xl font-bold text-slate-800">Inventory Management</h1>
          <p className="text-sm text-slate-400">
            {items.length} items · ₹{totalValue.toLocaleString('en-IN')} total stock value
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-orange-500 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-orange-600 flex items-center gap-2 border-0 cursor-pointer shadow-sm">
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Package size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">{items.length}</p>
            <p className="text-xs text-slate-400">Total Products</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            lowStockCount > 0 ? 'bg-orange-50' : 'bg-green-50'
          )}>
            {lowStockCount > 0
              ? <AlertTriangle size={18} className="text-orange-500" />
              : <CheckCircle  size={18} className="text-green-500" />}
          </div>
          <div>
            <p className={clsx('text-xl font-bold', lowStockCount > 0 ? 'text-orange-600' : 'text-green-600')}>
              {lowStockCount}
            </p>
            <p className="text-xs text-slate-400">Low Stock Items</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <span className="text-green-700 font-bold text-sm">₹</span>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">₹{totalValue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400">Stock Value</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <input className="w-full max-w-xs border border-slate-200 rounded-lg p-2 text-sm bg-white" placeholder="🔍  Search items..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-1.5 flex-wrap">
          {['All', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer',
                filterCat === cat
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
              )}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Item Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock Level</th>
                <th className="p-3">Price / Unit</th>
                <th className="p-3">Stock Value</th>
                <th className="p-3">Status</th>
                <th className="p-3">Updated</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.map(item => {
                const stockQty = item.stock_qty || item.quantity || 0
                const pricePerUnit = item.price_per_unit || item.price || 0
                const lowStockThreshold = item.low_stock_threshold || 5
                const isLow = stockQty <= lowStockThreshold
                const itemUnit = item.unit || 'units'
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-semibold text-slate-700">{item.item_name || item.name}</td>
                    <td className="p-3"><span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{item.category || 'General'}</span></td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={clsx('font-bold', isLow ? 'text-red-600' : 'text-slate-700')}>
                          {stockQty} {itemUnit}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={clsx('h-full rounded-full', isLow ? 'bg-red-400' : 'bg-green-400')}
                            style={{ width: `${Math.min((stockQty / (lowStockThreshold * 4)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold">₹{pricePerUnit}/{itemUnit}</td>
                    <td className="p-3 font-semibold text-green-700">
                      ₹{(stockQty * pricePerUnit).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      {isLow
                        ? <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700"><AlertTriangle size={10} /> Low Stock</span>
                        : <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700"><CheckCircle size={10} /> In Stock</span>}
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {item.updated_at ? new Date(item.updated_at).toLocaleDateString('en-IN') : 'Recent'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditItem(item)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-all border-0 bg-transparent cursor-pointer">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.item_name || item.name || '')}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-all border-0 bg-transparent cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-slate-400 py-10">
                    No items found. {search && 'Try a different search term.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <ItemModal title="Add Inventory Item"
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd} />
      )}

      {editItem && (
        <ItemModal title="Edit Inventory Item"
          initialData={{
            item_name:           editItem.item_name || editItem.name || '',
            category:            editItem.category || 'Fruits',
            stock_qty:           String(editItem.stock_qty || editItem.quantity || '0'),
            unit:                editItem.unit || 'kg',
            price_per_unit:      String(editItem.price_per_unit || editItem.price || '0'),
            low_stock_threshold: String(editItem.low_stock_threshold || '5'),
          }}
          onClose={() => setEditItem(null)}
          onSave={handleEdit} />
      )}
    </div>
  )
}