import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '@services/storage'
import type { Role, User } from '@types/index'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role?: Role) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(auth.current())
  }, [])

  const value = useMemo(() => ({
    user,
    login: async (email: string, password: string) => {
      const u = await auth.login(email, password)
      setUser(u)
    },
    signup: async (name: string, email: string, password: string, role?: Role) => {
      const u = await auth.signup(name, email, password, role)
      setUser(u)
    },
    logout: () => { auth.logout(); setUser(null) }
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
