import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Landmark, QrCode, FileText, Send, Loader2, ExternalLink, Sparkles } from 'lucide-react'

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const { user, token: contextToken } = useAuth() as any
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user?.vendor_name || 'Vendor'}, I am your IBM Granite business copilot. How can I help you manage your shop layout or analyze your ledger entries today?`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll workspace downward on fresh chat entries
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const suggestions = [
    "Check PM SVANidhi loan eligibility",
    "How to set up UPI QR code?",
    "Give me watermelon pricing tips",
    "Benefits of MSME registration"
  ]

  const handleSendMessage = async (e: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault()
    
    const textToSend = customText || input
    if (!textToSend.trim() || isLoading) return

    setInput('')
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const activeToken = contextToken || localStorage.getItem('access_token') || localStorage.getItem('token')
      
      // ✅ Dynamically switches to your live Render backend URL
      const baseUrl = import.meta.env.VITE_API_URL || 'https://vyaapari-api.onrender.com'
      const response = await fetch(`${baseUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': activeToken ? `Bearer ${activeToken}` : ''
        },
        body: JSON.stringify({ message: textToSend })
      })

      if (!response.ok) throw new Error(`Server returned status code ${response.status}`)
      
      const data = await response.json()
      const assistantMessage = typeof data === 'string' 
        ? data 
        : (data.content || data.reply || data.response || data.message || JSON.stringify(data))

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I couldn't reach the live backend cloud server. Please verify your internet connection or deployment status.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)] overflow-y-auto lg:overflow-hidden p-1">
      
      {/* 🤖 LEFT SIDE: IBM Granite Chatbot Workspace */}
      <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[500px] lg:h-full">
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3.5 flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-800">IBM Granite AI Copilot</h1>
            <p className="text-[11px] text-slate-500">Active Profile: <span className="text-indigo-600 font-semibold">{user?.vendor_name || 'Vendor Profile'}</span></p>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Live via watsonx</span>
        </div>

        {/* Chat Messages Scrolling Window */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <Loader2 size={14} className="animate-spin text-indigo-600" />
              <span>Granite is generating response...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Footer Interaction Zone */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-3">
          
          {/* ✨ RESPONSIVE HORIZONTAL SUGGESTIONS CAROUSEL (Hides after first message) */}
          {messages.length <= 1 && (
            <div className="w-full">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap -mx-1 px-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => handleSendMessage(e, suggestion)}
                    className="inline-flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 hover:border-orange-200 rounded-full px-3.5 py-1.5 font-medium transition-all text-slate-600 shadow-sm shrink-0 cursor-pointer border-solid bg-transparent"
                  >
                    <Sparkles size={12} className="text-orange-400 shrink-0" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Input Control */}
          <form onSubmit={(e) => handleSendMessage(e)} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Ask about your ledger or stock..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 disabled:opacity-60"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white p-2.5 sm:p-3 rounded-xl transition-all flex items-center justify-center shrink-0 border-0 cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* 📋 RIGHT SIDE: Direct Portal Navigation Links */}
      <div className="space-y-4 lg:overflow-y-auto h-auto lg:h-full pr-1 shrink-0 pb-6 lg:pb-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Official Resource Links</h3>

        {/* Link Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2.5"><Landmark size={18} /></div>
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1">PM SVANidhi Portal</h4>
          <p className="text-[11px] sm:text-xs text-slate-500 mb-3 leading-relaxed">Apply for collateral-free working capital loans directly through the official government street vendor portal.</p>
          <a href="https://pmsvanidhi.mohua.gov.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">Open Official Portal <ExternalLink size={12} /></a>
        </div>

        {/* Link Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-2.5"><QrCode size={18} /></div>
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1">BHIM UPI Merchant Setup</h4>
          <p className="text-[11px] sm:text-xs text-slate-500 mb-3 leading-relaxed">Access official guidelines on registering your commercial merchant account to handle direct daily digital QR earnings.</p>
          <a href="https://www.bhimupi.org.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">Open BHIM Portal <ExternalLink size={12} /></a>
        </div>

        {/* Link Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-2.5"><FileText size={18} /></div>
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1">MSME Udyam Registration</h4>
          <p className="text-[11px] sm:text-xs text-slate-500 mb-3 leading-relaxed">Register your small enterprise officially with the Ministry of MSME to lock in vendor subsidies and interest benefits.</p>
          <a href="https://udyamregistration.gov.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">Go to Udyam Register <ExternalLink size={12} /></a>
        </div>
      </div>

    </div>
  )
}