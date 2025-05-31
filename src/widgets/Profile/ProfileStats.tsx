"use client"

import { memo } from "react"
import { Card, CardContent, Typography, Box, LinearProgress, Divider } from "@mui/material"
import { TrendingUp, EmojiEvents, LocalFireDepartment, Restaurant } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { NutritionStats } from "@/shared/types"

interface ProfileStatsProps {
  stats: NutritionStats | undefined
}

export const ProfileStats = memo(({ stats }: ProfileStatsProps) => {
  const achievements = [
    {
      title: "Дней подряд",
      value: 15,
      target: 30,
      icon: <TrendingUp />,
      color: "primary.main",
    },
    {
      title: "Цель калорий",
      value: stats?.goalAchievement?.calories || 0,
      target: 100,
      icon: <LocalFireDepartment />,
      color: "error.main",
      unit: "%",
    },
    {
      title: "Записей питания",
      value: 127,
      target: 150,
      icon: <Restaurant />,
      color: "success.main",
    },
  ]

  return (
    <Card sx={{ borderRadius: 3, height: "fit-content" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <EmojiEvents sx={{ mr: 1, color: "warning.main" }} />
          <Typography variant="h6" fontWeight="bold">
            Достижения
          </Typography>
        </Box>

        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Box sx={{ mb: index < achievements.length - 1 ? 3 : 0 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ color: achievement.color }}>{achievement.icon}</Box>
                  <Typography variant="body2" fontWeight="medium">
                    {achievement.title}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: achievement.color }}>
                  {achievement.value}
                  {achievement.unit || ""}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={(achievement.value / achievement.target) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "action.hover",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: achievement.color,
                  },
                }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {achievement.value} из {achievement.target}
              </Typography>
            </Box>

            {index < achievements.length - 1 && <Divider sx={{ my: 2 }} />}
          </motion.div>
        ))}

        <Box sx={{ mt: 3, p: 2, backgroundColor: "action.hover", borderRadius: 2, textAlign: "center" }}>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            🎯 Следующая цель
          </Typography>
          <Typography variant="caption" color="text.secondary">
            30 дней подряд ведения дневника питания
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
})

ProfileStats.displayName = "ProfileStats"
