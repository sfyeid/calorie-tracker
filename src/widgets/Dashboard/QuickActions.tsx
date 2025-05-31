"use client"

import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Card, CardContent, Typography, Button, Box, Divider } from "@mui/material"
import { Add, Search, Restaurant, Analytics, TrendingUp } from "@mui/icons-material"
import { motion } from "framer-motion"

export const QuickActions = memo(() => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const actions = [
    {
      label: t("dashboard.addMeal"),
      icon: <Add />,
      color: "primary" as const,
      onClick: () => navigate("/diary"),
    },
    {
      label: "Поиск продуктов",
      icon: <Search />,
      color: "secondary" as const,
      onClick: () => navigate("/foods"),
    },
    {
      label: "Создать рецепт",
      icon: <Restaurant />,
      color: "success" as const,
      onClick: () => navigate("/recipes"),
    },
    {
      label: "Аналитика",
      icon: <Analytics />,
      color: "info" as const,
      onClick: () => navigate("/analytics"),
    },
  ]

  return (
    <Card sx={{ height: "100%", borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <TrendingUp sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" fontWeight="bold">
            {t("dashboard.quickAdd")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outlined"
                fullWidth
                startIcon={action.icon}
                onClick={action.onClick}
                color={action.color}
                sx={{
                  py: 1.5,
                  justifyContent: "flex-start",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                {action.label}
              </Button>
            </motion.div>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Сегодняшний прогресс
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            73%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            от дневной цели
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
})

QuickActions.displayName = "QuickActions"
