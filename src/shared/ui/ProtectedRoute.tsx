import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/shared/hooks/redux"

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}
