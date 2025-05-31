"use client"

import type React from "react"

import { memo } from "react"
import { Card, CardContent, Typography, Box, CircularProgress, Skeleton } from "@mui/material"
import { EmojiEvents, TrendingUp } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { NutritionStats } from "@/shared/types"

interface GoalsAchievementProps {
  stats: NutritionStats | undefined
  isLoading: boolean
}

interface GoalItemProps {
  label: string
  value: number
  color: string
  icon: React.ReactNode
}

const GoalItem = memo(({ label, value, color, icon }: GoalItemProps) => (
  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ color }}>{icon}</Box>
        <Typography variant="body2" fontWeight="medium">
          {label}
        </Typography>
      </Box>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" value={Math.min(value, 100)} size={40} thickness={4} sx={{ color }} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" fontWeight="bold" sx={{ color }}>
            {value.toFixed(0)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  </motion.div>
))

GoalItem.displayName = "GoalItem"

export const GoalsAchievement = memo(({ stats, isLoading }: GoalsAchievementProps) => {
  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 3, height: "fit-content" }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          {[...Array(4)].map((_, index) => (
            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          ))}
        </CardContent>
      </Card>
    )
  }

  const goals = [
    {
      label: "Калории",
      value: stats?.goalAchievement?.calories || 75,
      color: "error.main",
      icon: "🔥",
    },
    {
      label: "Белки",
      value: stats?.goalAchievement?.protein || 85,
      color: "primary.main",
      icon: "💪",
    },
    {
      label: "Жиры",
      value: stats?.goalAchievement?.fat || 90,
      color: "warning.main",
      icon: "🥑",
    },
    {
      label: "Углеводы",
      value: stats?.goalAchievement?.carbs || 70,
      color: "success.main",
      icon: "🌾",
    },
  ]

  const averageAchievement = goals.reduce((sum, goal) => sum + goal.value, 0) / goals.length

  return (
    <Card sx={{ borderRadius: 3, height: "fit-content" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <EmojiEvents sx={{ mr: 1, color: "warning.main" }} />
          <Typography variant="h6" fontWeight="bold">
            Достижение целей
          </Typography>
        </Box>

        {/* Общий прогресс */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
            <CircularProgress
              variant="determinate"
              value={averageAchievement}
              size={80}
              thickness={4}
              sx={{ color: "primary.main" }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                {averageAchievement.toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                общий
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Средний прогресс по всем целям
          </Typography>
        </Box>

        {/* Детализация по целям */}
        {goals.map((goal, index) => (
          <motion.div
            key={goal.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GoalItem
              label={goal.label}
              value={goal.value}
              color={goal.color}
              icon={<span style={{ fontSize: "1.2rem" }}>{goal.icon}</span>}
            />
          </motion.div>
        ))}

        <Box sx={{ mt: 3, p: 2, backgroundColor: "action.hover", borderRadius: 2, textAlign: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
            <TrendingUp color="success" />
            <Typography variant="body2" fontWeight="medium">
              Отличный прогресс!
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Вы достигли {averageAchievement.toFixed(0)}% от поставленных целей
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
})

GoalsAchievement.displayName = "GoalsAchievement"
