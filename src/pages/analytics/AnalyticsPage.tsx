"use client"

import type React from "react"

import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Grid, Typography, Box, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { motion } from "framer-motion"

import { MainLayout } from "@/widgets/Layout/MainLayout"
import { useGetStatsQuery } from "@/entities/user/api/userApi"
import { CaloriesProgressChart } from "@/widgets/Analytics/CaloriesProgressChart"
import { MacrosDistributionChart } from "@/widgets/Analytics/MacrosDistributionChart"
import { WeeklyOverview } from "@/widgets/Analytics/WeeklyOverview"
import { GoalsAchievement } from "@/widgets/Analytics/GoalsAchievement"
import { NutritionTrends } from "@/widgets/Analytics/NutritionTrends"

const AnalyticsPage = memo(() => {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<"day" | "week" | "month">("week")

  const { data: stats, isLoading } = useGetStatsQuery({ period })

  const handlePeriodChange = (_: React.MouseEvent<HTMLElement>, newPeriod: "day" | "week" | "month" | null) => {
    if (newPeriod) {
      setPeriod(newPeriod)
    }
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {t("analytics.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Анализируйте свой прогресс и достигайте поставленных целей
          </Typography>
        </Box>

        {/* Переключатель периода */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={handlePeriodChange}
            aria-label="period selection"
            sx={{
              "& .MuiToggleButton-root": {
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 500,
              },
            }}
          >
            <ToggleButton value="day" aria-label="day">
              День
            </ToggleButton>
            <ToggleButton value="week" aria-label="week">
              Неделя
            </ToggleButton>
            <ToggleButton value="month" aria-label="month">
              Месяц
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={3}>
          {/* Обзор за неделю */}
          <Grid item xs={12}>
            <WeeklyOverview period={period} stats={stats} isLoading={isLoading} />
          </Grid>

          {/* График прогресса калорий */}
          <Grid item xs={12} md={8}>
            <CaloriesProgressChart period={period} />
          </Grid>

          {/* Достижение целей */}
          <Grid item xs={12} md={4}>
            <GoalsAchievement stats={stats} isLoading={isLoading} />
          </Grid>

          {/* Распределение макронутриентов */}
          <Grid item xs={12} md={6}>
            <MacrosDistributionChart period={period} />
          </Grid>

          {/* Тренды питания */}
          <Grid item xs={12} md={6}>
            <NutritionTrends period={period} />
          </Grid>
        </Grid>
      </motion.div>
    </MainLayout>
  )
})

AnalyticsPage.displayName = "AnalyticsPage"

export default AnalyticsPage
