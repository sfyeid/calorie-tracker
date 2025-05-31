"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { ru } from "date-fns/locale"

interface CaloriesProgressChartProps {
  period: "day" | "week" | "month"
}

export const CaloriesProgressChart = memo(({ period }: CaloriesProgressChartProps) => {
  const theme = useTheme()

  const chartData = useMemo(() => {
    const data = []
    const today = new Date()

    if (period === "week") {
      const start = startOfWeek(today, { weekStartsOn: 1 })
      const end = endOfWeek(today, { weekStartsOn: 1 })
      const days = eachDayOfInterval({ start, end })

      days.forEach((date) => {
        data.push({
          date: format(date, "EEE", { locale: ru }),
          fullDate: format(date, "dd.MM"),
          calories: Math.floor(Math.random() * 800) + 1200,
          goal: 2000,
        })
      })
    } else if (period === "month") {
      for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i)
        data.push({
          date: format(date, "dd.MM"),
          fullDate: format(date, "dd.MM.yyyy"),
          calories: Math.floor(Math.random() * 800) + 1200,
          goal: 2000,
        })
      }
    } else {
      // День - почасовая статистика
      for (let hour = 8; hour <= 22; hour++) {
        data.push({
          date: `${hour}:00`,
          fullDate: `${hour}:00`,
          calories: Math.floor(Math.random() * 300) + 50,
          goal: null,
        })
      }
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
          <Typography variant="body2" color="error.main">
            Калории: {payload[0].value} ккал
          </Typography>
          {payload[1] && (
            <Typography variant="body2" color="text.secondary">
              Цель: {payload[1].value} ккал
            </Typography>
          )}
        </Box>
      )
    }
    return null
  }

  const getPeriodLabel = () => {
    switch (period) {
      case "day":
        return "Сегодня по часам"
      case "week":
        return "Текущая неделя"
      case "month":
        return "Последние 30 дней"
      default:
        return "График калорий"
    }
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          График калорий
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {getPeriodLabel()}
        </Typography>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="date"
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />

              {period !== "day" && (
                <ReferenceLine
                  y={2000}
                  stroke={theme.palette.text.disabled}
                  strokeDasharray="5 5"
                  label={{ value: "Цель", position: "topRight" }}
                />
              )}

              <Line
                type="monotone"
                dataKey="calories"
                stroke={theme.palette.error.main}
                strokeWidth={3}
                dot={{ fill: theme.palette.error.main, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: theme.palette.error.main, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
})

CaloriesProgressChart.displayName = "CaloriesProgressChart"
