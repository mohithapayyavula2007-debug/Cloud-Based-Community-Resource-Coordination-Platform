import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import supabase from '../lib/supabase'

type AuthCtx = { user: User | null; session: Session | null; loading: boolean; displayName: string }
const AuthContext = createContext<AuthCtx>({ user: null, session: null, loading: true, displayName: '' })

function nameFromUser(u: User | null): string {
  if (!u) return ''
  const meta = (u.user_metadata || {}) as Record<string, unknown>
  return (meta.full_name as string) || (meta.name as string) || (u.email ? u.email.split('@')[0] : 'Neighbor')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, loading, displayName: nameFromUser(user) }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
