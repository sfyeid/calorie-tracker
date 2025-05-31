import { Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ru } from "date-fns/locale"

import { useAppTheme } from "@/shared/hooks/useAppTheme"
import { AppLoader } from "@/shared/ui/AppLoader"
import { ProtectedRoute } from "@/shared/ui/ProtectedRoute"
import { AppRoutes } from "./routes"

export const App = () => {
  const theme = useAppTheme()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <Suspense fallback={<AppLoader />}>
          <Routes>
            <Route path="/auth/*" element={<AppRoutes.Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppRoutes.Main />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
