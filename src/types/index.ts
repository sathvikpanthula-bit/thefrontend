export interface User {
  id: number
  vendor_name: string
  business_name: string
  business_type: string
  city: string
  area: string
  primary_language: string
  email: string
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface InventoryItem {
  id: number
  item_name: string
  category: string
  stock_qty: number
  unit: string
  price_per_unit: number
  low_stock_threshold: number
  updated_at: string
}

export interface Sale {
  id: number
  item_name: string
  quantity: number
  unit_price: number
  total_amount: number
  payment_mode: string
  transaction_ref: string | null
  sale_date: string
}

export interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface DashboardMetrics {
  today_sales: number
  today_sales_change: number
  weekly_profit: number
  low_stock_items: string[]
  health_score: number
  ai_tip: string
}

export type Language = 'English' | 'Hindi' | 'Marathi' | 'Telugu' | 'Tamil'
export const LANGUAGES: Language[] = ['English', 'Hindi', 'Marathi', 'Telugu', 'Tamil']

export const BUSINESS_TYPES = [
  'Fruit Vendor',
  'Vegetable Vendor',
  'Tea Stall',
  'Flower Vendor',
  'Chaat & Snack Stall',
  'Juice Corner',
  'Bread & Bakery Stall',
  'Dairy Products Vendor',
  'Fish & Seafood Vendor',
  'Garment & Cloth Vendor',
  'Stationery Stall',
  'Mobile Accessories Stall',
  'Coconut Water Stall',
  'Sugarcane Juice Stall',
  'Rice & Grains Vendor',
  'Other',
]