import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center text-ink-soft">
      <div className="animate-pulse font-display italic text-2xl">Gathering the neighborhood…</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
