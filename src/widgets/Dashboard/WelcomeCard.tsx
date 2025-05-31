"use client"

import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, Box, Typography, Avatar, Chip, Grid } from "@mui/material"
import { LocalFireDepartment, Restaurant } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { User, DiaryEntry } from "@/shared/types"

interface WelcomeCardProps {
  user: User | null
  todayEntry: DiaryEntry | undefined
}

export const WelcomeCard = memo(({ user, todayEntry }: WelcomeCardProps) => {
  const { t } = useTranslation()

  const totalCalories = todayEntry?.totalCalories || 0
  const mealsCount = todayEntry?.meals?.length || 0

  return (
    <Card
      sx={{
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  mr: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  fontSize: "1.5rem",
                }}
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Добро пожаловать, {user?.name || "Пользователь"}!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Отслеживайте свой прогресс и достигайте целей
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Chip
                  icon={<LocalFireDepartment />}
                  label={`${totalCalories} ккал сегодня`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Chip
                  icon={<Restaurant />}
                  label={`${mealsCount} приемов пищи`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
              </motion.div>
            </Box>
          </Grid>
        </Grid>

        {/* Декоративные элементы */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          }}
        />
      </CardContent>
    </Card>
  )
})

WelcomeCard.displayName = "WelcomeCard"
