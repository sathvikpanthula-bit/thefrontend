import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User, AuthState } from '../types'
import api from '../lib/api'

interface AuthContextType extends AuthState {
  login:      (token: string, user: User) => void
  logout:     () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

type AuthAction =
  | { type: 'LOGIN';       payload: { token: string; user: User } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token, isAuthenticated: true }
    case 'LOGOUT':
      return { user: null, token: null, isAuthenticated: false }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
  })

  // Rehydrate session from localStorage on first mount
  useEffect(() => {
    const token   = localStorage.getItem('vyaapari_token')
    const userStr = localStorage.getItem('vyaapari_user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        dispatch({ type: 'LOGIN', payload: { token, user } })
      } catch {
        localStorage.clear()
      }
    }
  }, [])

  const login = (token: string, user: User) => {
    // 💾 1. Flush any lingering session residue from local storage
    localStorage.clear()

    // 💾 2. Set structural tokens cleanly
    localStorage.setItem('vyaapari_token', token)
    localStorage.setItem('vyaapari_user', JSON.stringify(user))
    dispatch({ type: 'LOGIN', payload: { token, user } })

    // 🚀 3. Break component cache hooks by executing a clean redirect into the application dashboard
    window.location.href = '/dashboard'
  };

  const logout = () => {
    // 🗑️ 1. Clear out operational storage
    localStorage.clear()
    dispatch({ type: 'LOGOUT' })

    // 🗑️ 2. Strip client request headers completely
    delete api.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['X-User-Email'];

    // 🚀 3. Kick browser context back to root page, vaporizing old in-memory arrays!
    window.location.href = '/'
  };

  const updateUser = (user: User) => {
    localStorage.setItem('vyaapari_user', JSON.stringify(user))
    dispatch({ type: 'UPDATE_USER', payload: user })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}