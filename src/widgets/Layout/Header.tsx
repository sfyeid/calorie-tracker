"use client"

import type React from "react"

import { useState } from "react"

import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Menu as MenuIcon, Brightness4, Brightness7, Language, ExitToApp, Person } from "@mui/icons-material"
import { motion } from "framer-motion"

import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux"
import { toggleTheme } from "@/entities/theme/model/themeSlice"
import { logout } from "@/entities/auth/model/authSlice"
import { useToggle } from "@/shared/hooks/useToggle"

export const Header = memo(() => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const { user } = useAppSelector((state) => state.auth)
  const { mode: themeMode } = useAppSelector((state) => state.theme)

  const [profileMenuOpen, toggleProfileMenu] = useToggle(false)
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null)

  const handleThemeToggle = () => {
    dispatch(toggleTheme())
  }

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "ru" ? "en" : "ru"
    i18n.changeLanguage(newLang)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget)
    toggleProfileMenu()
  }

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null)
    toggleProfileMenu()
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/auth/login")
    handleProfileMenuClose()
  }

  const handleProfile = () => {
    navigate("/profile")
    handleProfileMenuClose()
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Заголовок страницы можно сделать динамическим */}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Переключатель языка */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton color="inherit" onClick={handleLanguageToggle} title="Сменить язык">
              <Language />
            </IconButton>
          </motion.div>

          {/* Переключатель темы */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton color="inherit" onClick={handleThemeToggle} title="Сменить тему">
              {themeMode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </motion.div>

          {/* Профиль пользователя */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "primary.main",
                  fontSize: "0.875rem",
                }}
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>
            </IconButton>
          </motion.div>

          <Menu
            anchorEl={profileMenuAnchor}
            open={profileMenuOpen}
            onClose={handleProfileMenuClose}
            onClick={handleProfileMenuClose}
            PaperProps={{
              elevation: 8,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                minWidth: 200,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {user?.name || "Пользователь"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfile}>
              <Person fontSize="small" sx={{ mr: 1 }} />
              {t("navigation.profile")}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp fontSize="small" sx={{ mr: 1 }} />
              {t("auth.logout")}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
})

Header.displayName = "Header"
