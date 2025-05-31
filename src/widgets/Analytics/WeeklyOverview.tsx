"use client"

import { memo } from "react"
import { Card, CardContent, Typography, Box, Grid, Skeleton } from "@mui/material"
import { TrendingUp, TrendingDown, Remove } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { NutritionStats } from "@/shared/types"

interface WeeklyOverviewProps {
  period: "day" | "week" | "month"
  stats: NutritionStats | undefined
  isLoading: boolean
}

interface MetricCardProps {
  title: string
  value: number
  unit: string
  change: number
  color: string
}

const MetricCard = memo(({ title, value, unit, change, color }: MetricCardProps) => {
  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp sx={{ fontSize: 16 }} />
    if (change < 0) return <TrendingDown sx={{ fontSize: 16 }} />
    return <Remove sx={{ fontSize: 16 }} />
  }

  const getTrendColor = () => {
    if (change > 0) return "success.main"
    if (change < 0) return "error.main"
    return "text.secondary"
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card sx={{ height: "100%", borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ color, mb: 1 }}>
            {value.toFixed(0)}
            <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
              {unit}
            </Typography>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", color: getTrendColor() }}>
            {getTrendIcon()}
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {change > 0 ? "+" : ""}
              {change.toFixed(1)}% за период
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
})

MetricCard.displayName = "MetricCard"

export const WeeklyOverview = memo(({ period, stats, isLoading }: WeeklyOverviewProps) => {
  const getPeriodLabel = () => {
    switch (period) {
      case "day":
        return "за день"
      case "week":
        return "за неделю"
      case "month":
        return "за месяц"
      default:
        return "за период"
    }
  }

  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width={300} height={32} sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    )
  }

  const metrics = [
    {
      title: "Средние калории",
      value: stats?.avgCalories || 0,
      unit: "ккал",
      change: 5.2,
      color: "error.main",
    },
    {
      title: "Средние белки",
      value: stats?.avgProtein || 0,
      unit: "г",
      change: -2.1,
      color: "primary.main",
    },
    {
      title: "Средние жиры",
      value: stats?.avgFat || 0,
      unit: "г",
      change: 1.8,
      color: "warning.main",
    },
    {
      title: "Средние углеводы",
      value: stats?.avgCarbs || 0,
      unit: "г",
      change: 0.5,
      color: "success.main",
    },
  ]

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Обзор питания {getPeriodLabel()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Средние показатели и изменения по сравнению с предыдущим периодом
        </Typography>

        <Grid container spacing={2}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={metric.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MetricCard {...metric} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
})

WeeklyOverview.displayName = "WeeklyOverview"
