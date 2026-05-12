import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  REFRESH_TOKEN_STORAGE_KEY,
  USER_EMAIL_STORAGE_KEY,
} from '../lib/authStorage.js'

function readSession() {
  if (typeof localStorage === 'undefined') return null
  try {
    const token = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
    if (!token || token.length === 0) return null
    const email = localStorage.getItem(USER_EMAIL_STORAGE_KEY) ?? ''
    return { token, email }
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession())

  const login = useCallback(({ token, email }) => {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token)
    localStorage.setItem(USER_EMAIL_STORAGE_KEY, email ?? '')
    setUser({ token, email: email ?? '' })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_EMAIL_STORAGE_KEY)
    localStorage.removeItem('sms_auth')
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
