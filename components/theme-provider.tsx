"use client"

import type React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
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
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
