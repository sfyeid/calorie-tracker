"use client"

import { memo } from "react"
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from "@mui/material"
import { FitnessCenter, TrendingUp, TrendingDown } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { UserProfile } from "@/shared/types"

interface BMICalculatorProps {
  profile: UserProfile | undefined
}

export const BMICalculator = memo(({ profile }: BMICalculatorProps) => {
  const calculateBMI = () => {
    if (!profile?.height || !profile?.weight) return null
    const heightInM = profile.height / 100
    return profile.weight / (heightInM * heightInM)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5)
      return {
        label: "Недостаток веса",
        color: "info" as const,
        description: "Рекомендуется увеличить калорийность питания",
        icon: <TrendingUp />,
      }
    if (bmi < 25)
      return {
        label: "Нормальный вес",
        color: "success" as const,
        description: "Отличный результат! Поддерживайте текущий режим",
        icon: <FitnessCenter />,
      }
    if (bmi < 30)
      return {
        label: "Избыточный вес",
        color: "warning" as const,
        description: "Рекомендуется снизить калорийность и увеличить активность",
        icon: <TrendingDown />,
      }
    return {
      label: "Ожирение",
      color: "error" as const,
      description: "Обратитесь к специалисту для составления плана питания",
      icon: <TrendingDown />,
    }
  }

  const getIdealWeight = () => {
    if (!profile?.height || !profile?.gender) return null

    // Формула Брока (упрощенная)
    const baseWeight = profile.height - 100
    const adjustment = profile.gender === "male" ? 0.9 : 0.85
    return Math.round(baseWeight * adjustment)
  }

  const bmi = calculateBMI()
  const bmiCategory = bmi ? getBMICategory(bmi) : null
  const idealWeight = getIdealWeight()

  if (!bmi || !profile) {
    return (
      <Card sx={{ borderRadius: 3, height: "fit-content" }}>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <FitnessCenter sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            BMI Калькулятор
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Заполните рост и вес в личной информации для расчета ИМТ
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card sx={{ borderRadius: 3, height: "fit-content" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Индекс массы тела
          </Typography>

          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
              {bmi.toFixed(1)}
            </Typography>
            <Chip label={bmiCategory.label} color={bmiCategory.color} icon={bmiCategory.icon} sx={{ mb: 2 }} />
          </Box>

          {/* BMI шкала */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ваш ИМТ на шкале
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min((bmi / 35) * 100, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: `${bmiCategory.color}.main`,
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                18.5
              </Typography>
              <Typography variant="caption" color="text.secondary">
                25
              </Typography>
              <Typography variant="caption" color="text.secondary">
                30
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {bmiCategory.description}
          </Typography>

          {idealWeight && (
            <Box sx={{ p: 2, backgroundColor: "action.hover", borderRadius: 2 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Идеальный вес
              </Typography>
              <Typography variant="h6" color="primary.main">
                {idealWeight} кг
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {profile.weight && profile.weight > idealWeight
                  ? `Рекомендуется снизить на ${(profile.weight - idealWeight).toFixed(1)} кг`
                  : profile.weight && profile.weight < idealWeight
                    ? `Рекомендуется набрать ${(idealWeight - profile.weight).toFixed(1)} кг`
                    : "Ваш вес в норме"}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
})

BMICalculator.displayName = "BMICalculator"
