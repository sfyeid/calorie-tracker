"use client"

import type React from "react"

import { memo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material"
import {
  Dashboard,
  MenuBook,
  Restaurant,
  Analytics,
  Person,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material"
import { motion } from "framer-motion"

const DRAWER_WIDTH = 280
const DRAWER_WIDTH_COLLAPSED = 80

interface NavigationItem {
  key: string
  label: string
  icon: React.ReactNode
  path: string
}

const navigationItems: NavigationItem[] = [
  {
    key: "dashboard",
    label: "navigation.dashboard",
    icon: <Dashboard />,
    path: "/dashboard",
  },
  {
    key: "diary",
    label: "navigation.diary",
    icon: <MenuBook />,
    path: "/diary",
  },
  {
    key: "foods",
    label: "navigation.foods",
    icon: <Restaurant />,
    path: "/foods",
  },
  {
    key: "analytics",
    label: "navigation.analytics",
    icon: <Analytics />,
    path: "/analytics",
  },
  {
    key: "profile",
    label: "navigation.profile",
    icon: <Person />,
    path: "/profile",
  },
]

export const Sidebar = memo(() => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [collapsed, setCollapsed] = useState(false)

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <Typography variant="h6" component="div" fontWeight="bold" color="primary">
            Calorie Tracker
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={toggleCollapsed} size="small">
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path

          return (
            <motion.div
              key={item.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: 2,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "primary.contrastText",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={t(item.label)} />}
                </ListItemButton>
              </ListItem>
            </motion.div>
          )
        })}
      </List>

      <Divider />

      {/* Settings */}
      <List sx={{ px: 1, pb: 1 }}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate("/settings")}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                justifyContent: collapsed ? "center" : "flex-start",
                px: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                }}
              >
                <Settings />
              </ListItemIcon>
              {!collapsed && <ListItemText primary={t("navigation.settings")} />}
            </ListItemButton>
          </ListItem>
        </motion.div>
      </List>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={false} // Управляется через мобильное меню
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
})

Sidebar.displayName = "Sidebar"
