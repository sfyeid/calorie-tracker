"use client"

import { memo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

import type { NutritionGoals, DiaryEntry } from "@/shared/types"

interface MacrosChartProps {
  todayEntry: DiaryEntry | undefined
  goals: NutritionGoals | undefined
}

export const MacrosChart = memo(({ todayEntry, goals }: MacrosChartProps) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const current = {
    protein: todayEntry?.totalProtein || 0,
    fat: todayEntry?.totalFat || 0,
    carbs: todayEntry?.totalCarbs || 0,
  }

  const chartData = [
    {
      name: "Белки",
      value: current.protein * 4, // 1г белка = 4 ккал
      color: theme.palette.primary.main,
      percentage: goals ? ((current.protein / goals.protein) * 100).toFixed(1) : "0",
    },
    {
      name: "Жиры",
      value: current.fat * 9, // 1г жира = 9 ккал
      color: theme.palette.warning.main,
      percentage: goals ? ((current.fat / goals.fat) * 100).toFixed(1) : "0",
    },
    {
      name: "Углеводы",
      value: current.carbs * 4, // 1г углеводов = 4 ккал
      color: theme.palette.success.main,
      percentage: goals ? ((current.carbs / goals.carbs) * 100).toFixed(1) : "0",
    },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
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
            {data.name}
          </Typography>
          <Typography variant="body2">Калории: {data.value} ккал</Typography>
          <Typography variant="body2">Прогресс: {data.percentage}%</Typography>
        </Box>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Не показываем метки для очень маленьких сегментов

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card sx={{ height: 400, borderRadius: 3 }}>
      <CardContent sx={{ p: 3, height: "100%" }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {t("analytics.macrosChart")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Распределение макронутриентов
        </Typography>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => <span style={{ color: entry.color, fontWeight: 500 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
})

MacrosChart.displayName = "MacrosChart"
