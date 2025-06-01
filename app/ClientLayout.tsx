"use client"

import type React from "react"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material"
import { Restaurant, Person, LocalDining, ExitToApp, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
})

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      setIsAuthenticated(!!token)
    }
  }, [pathname])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      setIsAuthenticated(false)
      router.push("/auth/login")
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDrawerClose = () => {
    setMobileOpen(false)
  }

  const isAuthPage = pathname?.startsWith("/auth")

  const navigationItems = [
    {
      text: "База продуктов",
      icon: <LocalDining />,
      href: "/",
    },
    {
      text: "Дневник",
      icon: <Restaurant />,
      href: "/diary",
    },
    {
      text: "Профиль",
      icon: <Person />,
      href: "/profile",
    },
  ]

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Restaurant sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            CalorieTracker
          </Typography>
        </Box>
        <IconButton color="inherit" onClick={handleDrawerClose} sx={{ display: { md: "none" } }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ pt: 0 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={handleDrawerClose}
              selected={pathname === item.href}
              sx={{
                py: 1.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: "auto" }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleLogout()
              handleDrawerClose()
            }}
            sx={{ py: 1.5, color: "error.main" }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "error.main" }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Выход" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAuthPage && isAuthenticated && (
        <>
          <AppBar position="static" sx={{ mb: 0 }}>
            <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Restaurant sx={{ mr: { xs: 1, sm: 2 } }} />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                CalorieTracker
              </Typography>

              {!isMobile && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {navigationItems.map((item) => (
                    <Button
                      key={item.text}
                      color="inherit"
                      component={Link}
                      href={item.href}
                      startIcon={item.icon}
                      sx={{
                        fontSize: { sm: "0.875rem", md: "1rem" },
                        px: { sm: 1.5, md: 2 },
                        backgroundColor: pathname === item.href ? "rgba(255,255,255,0.1)" : "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      <Box sx={{ display: { sm: "none", md: "block" } }}>{item.text}</Box>
                      <Box sx={{ display: { xs: "none", sm: "block", md: "none" } }}>
                        {item.text === "База продуктов" ? "База" : item.text}
                      </Box>
                    </Button>
                  ))}
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    startIcon={<ExitToApp />}
                    sx={{
                      fontSize: { sm: "0.875rem", md: "1rem" },
                      px: { sm: 1.5, md: 2 },
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <Box sx={{ display: { sm: "none", md: "block" } }}>Выход</Box>
                    <Box sx={{ display: { xs: "none", sm: "block", md: "none" } }}>
                      <ExitToApp />
                    </Box>
                  </Button>
                </Box>
              )}
            </Toolbar>
          </AppBar>

          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 280,
              },
            }}
          >
            {drawer}
          </Drawer>
        </>
      )}
      <main>{children}</main>
    </ThemeProvider>
  )
}
