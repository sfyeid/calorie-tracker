"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, subDays } from "date-fns"
import { ru } from "date-fns/locale"

interface NutritionTrendsProps {
  period: "day" | "week" | "month"
}

export const NutritionTrends = memo(({ period }: NutritionTrendsProps) => {
  const theme = useTheme()

  const chartData = useMemo(() => {
    const data = []
    const today = new Date()
    const days = period === "week" ? 7 : period === "month" ? 30 : 1

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i)
      data.push({
        date: format(date, period === "month" ? "dd.MM" : "EEE", { locale: ru }),
        fullDate: format(date, "dd.MM.yyyy"),
        protein: Math.floor(Math.random() * 50) + 100,
        fat: Math.floor(Math.random() * 30) + 50,
        carbs: Math.floor(Math.random() * 100) + 150,
      })
    }

    return data
  }, [period])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "background.paper",
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {payload[0].payload.fullDate}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}г
            </Typography>
          ))}
        </Box>
      )
    }
    return null
  }

  const getPeriodLabel = () => {
    switch (period) {
      case "day":
        return "Сегодня"
      case "week":
        return "За неделю"
      case "month":
        return "За месяц"
      default:
        return "Тренды питания"
    }
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Тренды питания
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {getPeriodLabel()}
        </Typography>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="date"
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="carbs"
                stackId="1"
                stroke={theme.palette.success.main}
                fill={theme.palette.success.main}
                fillOpacity={0.6}
                name="Углеводы"
              />
              <Area
                type="monotone"
                dataKey="fat"
                stackId="1"
                stroke={theme.palette.warning.main}
                fill={theme.palette.warning.main}
                fillOpacity={0.6}
                name="Жиры"
              />
              <Area
                type="monotone"
                dataKey="protein"
                stackId="1"
                stroke={theme.palette.primary.main}
                fill={theme.palette.primary.main}
                fillOpacity={0.6}
                name="Белки"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
})

NutritionTrends.displayName = "NutritionTrends"
