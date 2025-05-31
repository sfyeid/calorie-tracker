"use client"

import { useMemo } from "react"
import { createTheme, type Theme } from "@mui/material/styles"
import { useAppSelector } from "./redux"

export const useAppTheme = (): Theme => {
  const themeMode = useAppSelector((state) => state.theme.mode)
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  const mode = useMemo(() => {
    if (themeMode === "system") {
      return systemPrefersDark ? "dark" : "light"
    }
    return themeMode
  }, [themeMode, systemPrefersDark])

  return useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#2196f3",
            light: "#64b5f6",
            dark: "#1976d2",
          },
          secondary: {
            main: "#f50057",
            light: "#ff5983",
            dark: "#c51162",
          },
          success: {
            main: "#4caf50",
          },
          warning: {
            main: "#ff9800",
          },
          error: {
            main: "#f44336",
          },
          background: {
            default: mode === "dark" ? "#121212" : "#fafafa",
            paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 500,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 8,
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === "dark" ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode],
  )
}
