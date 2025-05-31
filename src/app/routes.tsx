import { lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

// Lazy loading страниц
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"))
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"))
const DiaryPage = lazy(() => import("@/pages/diary/DiaryPage"))
const FoodsPage = lazy(() => import("@/pages/foods/FoodsPage"))
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"))
const AnalyticsPage = lazy(() => import("@/pages/analytics/AnalyticsPage"))

const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="*" element={<Navigate to="/auth/login" replace />} />
  </Routes>
)

const MainRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/diary" element={<DiaryPage />} />
    <Route path="/foods" element={<FoodsPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/analytics" element={<AnalyticsPage />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
)

export const AppRoutes = {
  Auth: AuthRoutes,
  Main: MainRoutes,
}
