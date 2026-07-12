import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { BUSINESS_TYPES, LANGUAGES } from '../types'
import { Eye, EyeOff, Loader2, Store, IndianRupee, Smartphone, BadgeCheck } from 'lucide-react'

export default function LandingPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'landing' | 'login' | 'register'>('landing')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  // Register form state
  const [regForm, setRegForm] = useState({
    vendor_name:      '',
    business_name:    '',
    business_type:    'Fruit Vendor',
    city:             '',
    area:             '',
    primary_language: 'English',
    email:            '',
    password:         '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', loginForm)
      login(res.data.access_token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.vendor_name}!`)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (regForm.password.length < 6) { 
      toast.error('Password must be at least 6 characters')
      return 
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', regForm)
      login(res.data.access_token, res.data.user)
      toast.success(`Welcome to VYAAPARI, ${res.data.user.vendor_name}! 🎉`)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Login view ──────────────────────────────────────────────────────────────
  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to your VYAAPARI account</p>
          </div>
          <div className="card-lg">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="form-label">Email Address</label>
                {/* ✨ Updated Placeholder */}
                <input type="email" className="form-input" placeholder="vendor@example.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} className="form-input pr-10"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="mt-5 text-center text-sm">
              <span className="text-slate-500">New vendor? </span>
              <button onClick={() => setMode('register')} className="text-orange-600 font-semibold hover:underline">
                Create Account
              </button>
            </div>
            <button onClick={() => setMode('landing')} className="mt-3 w-full text-xs text-slate-400 hover:text-slate-600">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Register view ───────────────────────────────────────────────────────────
  if (mode === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4 py-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Create Your Vendor Profile</h1>
            <p className="text-sm text-slate-500 mt-1">Set up your digital business identity in 2 minutes</p>
          </div>
          <div className="card-lg">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Vendor Name *</label>
                  {/* ✨ Updated Placeholder */}
                  <input className="form-input" placeholder="Your Full Name"
                    value={regForm.vendor_name}
                    onChange={e => setRegForm({ ...regForm, vendor_name: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Business Name *</label>
                  {/* ✨ Updated Placeholder */}
                  <input className="form-input" placeholder="Your Shop/Stall Name"
                    value={regForm.business_name}
                    onChange={e => setRegForm({ ...regForm, business_name: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="form-label">Business Type *</label>
                <select className="form-input" value={regForm.business_type}
                  onChange={e => setRegForm({ ...regForm, business_type: e.target.value })}>
                  {BUSINESS_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">City *</label>
                  <input className="form-input" placeholder="Hyderabad"
                    value={regForm.city}
                    onChange={e => setRegForm({ ...regForm, city: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Area / Locality *</label>
                  <input className="form-input" placeholder="Madhapur"
                    value={regForm.area}
                    onChange={e => setRegForm({ ...regForm, area: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="form-label">Primary Language</label>
                <select className="form-input" value={regForm.primary_language}
                  onChange={e => setRegForm({ ...regForm, primary_language: e.target.value })}>
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div>
                  <label className="form-label">Email Address *</label>
                  {/* ✨ Updated Placeholder */}
                  <input type="email" className="form-input" placeholder="name@example.com"
                    value={regForm.email}
                    onChange={e => setRegForm({ ...regForm, email: e.target.value })} required />
                </div>
                <div className="mt-3">
                  <label className="form-label">Password *</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} className="form-input pr-10"
                      placeholder="Min. 6 characters"
                      value={regForm.password}
                      onChange={e => setRegForm({ ...regForm, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2" disabled={loading}>
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Creating Account...' : 'Create My Vendor Profile →'}
              </button>
            </form>
            <div className="mt-5 text-center text-sm">
              <span className="text-slate-500">Already registered? </span>
              <button onClick={() => setMode('login')} className="text-orange-600 font-semibold hover:underline">
                Sign In
              </button>
            </div>
            <button onClick={() => setMode('landing')} className="mt-3 w-full text-xs text-slate-400 hover:text-slate-600">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Marketing landing view ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-base">V</span>
          </div>
          <div>
            <div className="text-base font-bold text-slate-800 leading-tight">VYAAPARI</div>
            <div className="text-[10px] text-orange-500 font-semibold tracking-widest">STREET VENDOR AGENT</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setMode('login')}    className="btn-secondary text-sm">Sign In</button>
          <button onClick={() => setMode('register')} className="btn-primary text-sm">Get Started Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <BadgeCheck size={14} /> Powered by IBM Granite AI — Trusted by 10,000+ Vendors
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 max-w-3xl mx-auto leading-tight">
          India's Smartest Platform for <span className="text-orange-500">Street Vendors</span>
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-xl mx-auto">
          Manage your business digitally. Access government schemes, accept UPI payments,
          track inventory, and grow with AI-powered insights — all in one app.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button onClick={() => setMode('register')} className="btn-primary text-base px-8 py-3 shadow-lg">
            Start Free — Set Up in 2 Mins →
          </button>
          <button onClick={() => setMode('login')} className="btn-secondary text-base px-6 py-3">
            Sign In
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          No credit card needed · Simple Dashboard · Free government scheme guidance
        </p>
      </section>

      {/* Features grid */}
      <section className="px-6 py-16 bg-white">
        <h2 className="text-center text-2xl font-bold text-slate-800 mb-10">
          Everything a Street Vendor Needs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {[
            { icon: <IndianRupee size={22} className="text-green-600" />,  bg: 'bg-green-50',  title: 'UPI & Digital Sales',    desc: 'Accept QR payments, track cash & UPI transactions in real time with automatic ledger.' },
            { icon: <Store       size={22} className="text-orange-600" />, bg: 'bg-orange-50', title: 'Inventory Tracking',    desc: 'Monitor stock levels with smart low-stock alerts. Never miss a sale due to empty shelves.' },
            { icon: <Smartphone  size={22} className="text-blue-600" />,   bg: 'bg-blue-50',   title: 'IBM Granite AI Coach',    desc: 'Ask any business question in plain English — get expert advice instantly.' },
            { icon: <BadgeCheck  size={22} className="text-purple-600" />, bg: 'bg-purple-50', title: 'Govt. Scheme Access',     desc: 'Discover PM SVANidhi loans, MSME registration, FSSAI licenses — guided step-by-step.' },
          ].map(f => (
            <div key={f.title} className="card hover:shadow-card-hover cursor-default">
              <div className={`w-11 h-11 rounded-card ${f.bg} flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <div className="font-bold text-slate-800 mb-2">{f.title}</div>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof banner */}
      <section className="bg-orange-500 px-6 py-14 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { val: '₹2.4Cr+',  label: 'Sales Tracked Monthly' },
              { val: '12,500+',  label: 'Vendors Empowered'      },
              { val: '₹45Cr+',   label: 'Loans Facilitated'      },
            ].map(s => (
              <div key={s.val}>
                <div className="text-3xl font-extrabold">{s.val}</div>
                <div className="text-orange-100 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <blockquote className="text-lg font-medium italic max-w-xl mx-auto text-orange-50">
            "VYAAPARI helped me get my PM SVANidhi loan in 2 weeks and track my sales dynamically. My daily stall tracking is incredibly easy now!"
          </blockquote>
          <div className="text-orange-200 text-sm mt-3">— Sunita Devi, Vendor Partner</div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 bg-white text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Ready to Grow Your Business?</h2>
        <p className="text-slate-500 mb-7 text-sm">
          Join thousands of street vendors already using VYAAPARI to digitalize and grow.
        </p>
        <button onClick={() => setMode('register')} className="btn-primary text-base px-10 py-3 shadow-lg">
          Create Your Free Vendor Profile →
        </button>
      </section>

      <footer className="border-t border-slate-100 px-6 py-6 text-center text-xs text-slate-400">
        © 2026 VYAAPARI — Street Vendor Digitalization Agent · Built with IBM watsonx.ai · Made in India 🇮🇳
      </footer>
    </div>
  )
}