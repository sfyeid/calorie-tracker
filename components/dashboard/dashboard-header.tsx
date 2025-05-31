"use client"

import type React from "react"
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material"
import { Brightness4, Brightness7, Menu } from "@mui/icons-material"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  onToggleTheme?: () => void
  isDarkMode?: boolean
  onMenuClick?: () => void
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleTheme, isDarkMode = false, onMenuClick }) => {
  const router = useRouter()

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("authToken")
    router.push("/auth/login")
  }

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <Menu />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Calorie Tracker
        </Typography>

        <IconButton color="inherit" onClick={onToggleTheme} aria-label="toggle theme" sx={{ mr: 1 }}>
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Button color="inherit" onClick={handleLogout}>
          Выйти
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default DashboardHeader
