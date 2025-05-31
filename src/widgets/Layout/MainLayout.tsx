"use client"

import { memo, type ReactNode } from "react"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface MainLayoutProps {
  children: ReactNode
}

export const MainLayout = memo(({ children }: MainLayoutProps) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: { md: `calc(100% - 280px)` },
        }}
      >
        <Header />
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            backgroundColor: "background.default",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
})

MainLayout.displayName = "MainLayout"
