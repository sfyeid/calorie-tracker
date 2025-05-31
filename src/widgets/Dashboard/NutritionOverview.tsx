"use client"

import type React from "react"

import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, Typography, Box, LinearProgress, Grid } from "@mui/material"
import { LocalFireDepartment, FitnessCenter, Opacity, Grain } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { NutritionGoals, DiaryEntry } from "@/shared/types"

interface NutritionOverviewProps {
  goals: NutritionGoals | undefined
  todayEntry: DiaryEntry | undefined
}

interface NutrientCardProps {
  icon: React.ReactNode
  label: string
  current: number
  target: number
  unit: string
  color: "error" | "primary" | "warning" | "success"
}

const NutrientCard = memo(({ icon, label, current, target, unit, color }: NutrientCardProps) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0
  const remaining = Math.max(target - current, 0)

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card sx={{ height: "100%", borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box sx={{ color: `${color}.main`, mr: 1 }}>{icon}</Box>
            <Typography variant="h6" fontWeight="medium">
              {label}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
                {current.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                / {target} {unit}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              color={color}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "action.hover",
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Осталось: {remaining.toFixed(0)} {unit}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  )
})

NutrientCard.displayName = "NutrientCard"

export const NutritionOverview = memo(({ goals, todayEntry }: NutritionOverviewProps) => {
  const { t } = useTranslation()

  const defaultGoals = {
    calories: 2000,
    protein: 150,
    fat: 67,
    carbs: 250,
  }

  const currentGoals = goals || defaultGoals
  const current = {
    calories: todayEntry?.totalCalories || 0,
    protein: todayEntry?.totalProtein || 0,
    fat: todayEntry?.totalFat || 0,
    carbs: todayEntry?.totalCarbs || 0,
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {t("dashboard.dailyProgress")}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <NutrientCard
              icon={<LocalFireDepartment />}
              label={t("dashboard.calories")}
              current={current.calories}
              target={currentGoals.calories}
              unit="ккал"
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <NutrientCard
              icon={<FitnessCenter />}
              label={t("dashboard.protein")}
              current={current.protein}
              target={currentGoals.protein}
              unit="г"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <NutrientCard
              icon={<Opacity />}
              label={t("dashboard.fat")}
              current={current.fat}
              target={currentGoals.fat}
              unit="г"
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <NutrientCard
              icon={<Grain />}
              label={t("dashboard.carbs")}
              current={current.carbs}
              target={currentGoals.carbs}
              unit="г"
              color="success"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
})

NutritionOverview.displayName = "NutritionOverview"
