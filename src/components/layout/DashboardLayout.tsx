import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {  
  LayoutDashboard, Bot, Package, TrendingUp,  
  Menu, X, LogOut, ChevronDown, Globe
} from 'lucide-react'
import { LANGUAGES, Language } from '../../types'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/dashboard',         icon: LayoutDashboard, label: 'Dashboard',      end: true },
  { to: '/dashboard/ai',        icon: Bot,             label: 'AI Assistant'              },
  { to: '/dashboard/inventory', icon: Package,         label: 'Inventory'                 },
  { to: '/dashboard/sales',     icon: TrendingUp,      label: 'Sales & Revenue'           },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // 📱 Mobile setup: Start with sidebar closed on mobile screens
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [lang, setLang] = useState<Language>((user?.primary_language as Language) || 'English')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-brand-gray overflow-hidden relative">
      
      {/* 🌓 DARK BACKGROUND OVERLAY (Only visible on mobile when menu is active) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar (Drawer on mobile, locked on desktop) ──────────────────────────────── */}
      <aside
        className={clsx(
          'flex flex-col bg-white border-r border-slate-100 shadow-sm transition-all duration-300 shrink-0 z-50',
          // Mobile vs Desktop structural sizing rules
          'fixed inset-y-0 left-0 transform md:relative md:transform-none',
          sidebarOpen ? 'w-60 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16 lg:w-60'
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 min-h-[64px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            {/* Show label if menu is pulled forward on mobile OR if open on desktop layout */}
            <div className={clsx('md:hidden lg:block', !sidebarOpen && 'md:invisible')}>
              <p className="font-bold text-slate-800 text-sm leading-tight">VYAAPARI</p>
              <p className="text-orange-500 text-[10px] font-medium">Vendor Dashboard</p>
            </div>
          </div>

          {/* Mobile close button inside the sidebar panel */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden p-1 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              // 🔄 Automatically snaps the sidebar closed when an item is selected on mobile
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx('sidebar-link flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all', isActive && 'active')
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className={clsx('md:hidden lg:block', !sidebarOpen && 'md:hidden')}>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Business Metadata Info */}
        <div className={clsx('px-4 py-4 border-t border-slate-100 md:hidden lg:block', !sidebarOpen && 'md:hidden')}>
          <p className="text-xs text-slate-400 font-medium truncate">{user?.business_name}</p>
          <p className="text-[11px] text-slate-400 truncate">{user?.area}, {user?.city}</p>
        </div>
      </aside>

      {/* ── Main Workspace Area ─────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 w-full">
        
        {/* Top Header Navbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-5 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-3">
            {/* Responsive Sidebar Toggle Icon */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 border-0 bg-transparent cursor-pointer"
            >
              <Menu size={20} />
            </button>

            {/* Business Context Pill Info */}
            <div className="hidden sm:flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-1.5">
              <span className="text-orange-600 text-xs font-semibold">{user?.business_type}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-xs">{user?.area}, {user?.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 sm:px-3 py-1.5 cursor-pointer">
              <Globe size={14} className="text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-xs font-medium text-slate-600 focus:outline-none cursor-pointer border-0"
              >
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>

            {/* Profile Avatar Control Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 sm:gap-2 hover:bg-slate-50 rounded-lg px-2 py-1.5 border-0 bg-transparent cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user?.vendor_name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.vendor_name}</p>
                  <p className="text-[11px] text-slate-400">{user?.email}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-50 py-1">
                  <div className="px-4 py-2.5 border-b border-slate-50 md:hidden">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.vendor_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <div className="px-4 py-2.5 border-b border-slate-50">
                    <p className="text-xs font-bold text-slate-800 truncate">{user?.business_name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{user?.business_type}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold border-0 bg-transparent text-left cursor-pointer"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Area Container Context */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}