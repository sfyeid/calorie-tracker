"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface MacrosDistributionChartProps {
  period: "day" | "week" | "month"
}

export const MacrosDistributionChart = memo(({ period }: MacrosDistributionChartProps) => {
  const theme = useTheme()

  const chartData = useMemo(() => {
    // Имитация данных в зависимости от периода
    const baseData = {
      protein: 120,
      fat: 65,
      carbs: 200,
    }

    return [
      {
        name: "Белки",
        value: baseData.protein * 4, // 1г белка = 4 ккал
        grams: baseData.protein,
        color: theme.palette.primary.main,
        percentage: 25,
      },
      {
        name: "Жиры",
        value: baseData.fat * 9, // 1г жира = 9 ккал
        grams: baseData.fat,
        color: theme.palette.warning.main,
        percentage: 35,
      },
      {
        name: "Углеводы",
        value: baseData.carbs * 4, // 1г углеводов = 4 ккал
        grams: baseData.carbs,
        color: theme.palette.success.main,
        percentage: 40,
      },
    ]
  }, [period, theme])

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
          <Typography variant="body2">
            {data.grams}г ({data.value} ккал)
          </Typography>
          <Typography variant="body2">{data.percentage}% от общих калорий</Typography>
        </Box>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null

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

  const getPeriodLabel = () => {
    switch (period) {
      case "day":
        return "за сегодня"
      case "week":
        return "за неделю"
      case "month":
        return "за месяц"
      default:
        return ""
    }
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Распределение макронутриентов
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Среднее соотношение {getPeriodLabel()}
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
                formatter={(value, entry: any) => (
                  <span style={{ color: entry.color, fontWeight: 500 }}>
                    {value} ({entry.payload.grams}г)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
})

MacrosDistributionChart.displayName = "MacrosDistributionChart"
