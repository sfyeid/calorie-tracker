"use client"

import type React from "react"

import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, Typography, Box, CircularProgress, Divider } from "@mui/material"
import { FitnessCenter, Opacity, Grain, Restaurant } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { DiaryEntry } from "@/shared/types"
import { useGetGoalsQuery } from "@/entities/user/api/userApi"

interface DaySummaryProps {
  diaryEntry: DiaryEntry | undefined
  isLoading: boolean
}

interface NutrientSummaryProps {
  icon: React.ReactNode
  label: string
  current: number
  target: number
  unit: string
  color: string
}

const NutrientSummary = memo(({ icon, label, current, target, unit, color }: NutrientSummaryProps) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ color }}>{icon}</Box>
        <Typography variant="body2" fontWeight="medium">
          {label}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography variant="body2" fontWeight="bold">
          {current.toFixed(0)} / {target} {unit}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {percentage.toFixed(0)}%
        </Typography>
      </Box>
    </Box>
  )
})

NutrientSummary.displayName = "NutrientSummary"

export const DaySummary = memo(({ diaryEntry, isLoading }: DaySummaryProps) => {
  const { t } = useTranslation()
  const { data: goals } = useGetGoalsQuery()

  const defaultGoals = {
    calories: 2000,
    protein: 150,
    fat: 67,
    carbs: 250,
  }

  const currentGoals = goals || defaultGoals
  const current = {
    calories: diaryEntry?.totalCalories || 0,
    protein: diaryEntry?.totalProtein || 0,
    fat: diaryEntry?.totalFat || 0,
    carbs: diaryEntry?.totalCarbs || 0,
  }

  const mealsCount = diaryEntry?.meals?.length || 0
  const caloriesPercentage = (current.calories / currentGoals.calories) * 100

  if (isLoading) {
    return (
      <Card sx={{ height: "fit-content", borderRadius: 3 }}>
        <CardContent sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card sx={{ height: "fit-content", borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Сводка за день
          </Typography>

          {/* Основные показатели */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={Math.min(caloriesPercentage, 100)}
                size={80}
                thickness={4}
                sx={{ color: "error.main" }}
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
                <Typography variant="h6" fontWeight="bold" color="error.main">
                  {current.calories}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ккал
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {currentGoals.calories - current.calories > 0
                ? `Осталось ${(currentGoals.calories - current.calories).toFixed(0)} ккал`
                : `Превышение на ${(current.calories - currentGoals.calories).toFixed(0)} ккал`}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Детализация по нутриентам */}
          <Box sx={{ mb: 3 }}>
            <NutrientSummary
              icon={<FitnessCenter />}
              label="Белки"
              current={current.protein}
              target={currentGoals.protein}
              unit="г"
              color="primary.main"
            />
            <NutrientSummary
              icon={<Opacity />}
              label="Жиры"
              current={current.fat}
              target={currentGoals.fat}
              unit="г"
              color="warning.main"
            />
            <NutrientSummary
              icon={<Grain />}
              label="Углеводы"
              current={current.carbs}
              target={currentGoals.carbs}
              unit="г"
              color="success.main"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Статистика приемов пищи */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Restaurant color="action" />
              <Typography variant="body2">Приемов пищи</Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {mealsCount}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
})

DaySummary.displayName = "DaySummary"
