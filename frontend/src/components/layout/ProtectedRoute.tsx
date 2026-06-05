import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { Spinner } from '@/components/common/Spinner'
import { useAuthContext } from '@/contexts/AuthContext'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Spinner size={28} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <>{children}</>
}

