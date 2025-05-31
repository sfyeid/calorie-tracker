"use client"

import { memo, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, subDays } from "date-fns"
import { ru } from "date-fns/locale"

export const CaloriesChart = memo(() => {
  const { t } = useTranslation()
  const theme = useTheme()

  // Генерируем данные за последние 7 дней
  const chartData = useMemo(() => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      data.push({
        date: format(date, "dd.MM", { locale: ru }),
        calories: Math.floor(Math.random() * 800) + 1200, // Случайные данные для демо
        goal: 2000,
      })
    }
    return data
  }, [])

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
            {label}
          </Typography>
          <Typography variant="body2" color="error.main">
            Калории: {payload[0].value} ккал
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Цель: {payload[1].value} ккал
          </Typography>
        </Box>
      )
    }
    return null
  }

  return (
    <Card sx={{ height: 400, borderRadius: 3 }}>
      <CardContent sx={{ p: 3, height: "100%" }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {t("analytics.caloriesChart")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Последние 7 дней
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
              <Line
                type="monotone"
                dataKey="calories"
                stroke={theme.palette.error.main}
                strokeWidth={3}
                dot={{ fill: theme.palette.error.main, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: theme.palette.error.main, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="goal"
                stroke={theme.palette.text.disabled}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
})

CaloriesChart.displayName = "CaloriesChart"
