"use client"

import { memo } from "react"
import { Card, CardContent, Box, Typography, Avatar, Chip, Grid, LinearProgress } from "@mui/material"
import { Person } from "@mui/icons-material"
import { motion } from "framer-motion"

import type { User, UserProfile, NutritionStats } from "@/shared/types"

interface ProfileHeaderProps {
  user: User | null
  profile: UserProfile | undefined
  stats: NutritionStats | undefined
}

export const ProfileHeader = memo(({ user, profile, stats }: ProfileHeaderProps) => {
  const getActivityLevelLabel = (level?: string) => {
    const labels = {
      sedentary: "Малоподвижный",
      light: "Легкая активность",
      moderate: "Умеренная активность",
      active: "Активный",
      very_active: "Очень активный",
    }
    return labels[level as keyof typeof labels] || "Не указано"
  }

  const calculateAge = (birthYear?: number) => {
    if (!birthYear) return null
    return new Date().getFullYear() - birthYear
  }

  const getBMI = () => {
    if (!profile?.height || !profile?.weight) return null
    const heightInM = profile.height / 100
    return profile.weight / (heightInM * heightInM)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Недостаток веса", color: "info" }
    if (bmi < 25) return { label: "Нормальный вес", color: "success" }
    if (bmi < 30) return { label: "Избыточный вес", color: "warning" }
    return { label: "Ожирение", color: "error" }
  }

  const bmi = getBMI()
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  return (
    <Card
      sx={{
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  {user?.name?.charAt(0) || <Person />}
                </Avatar>
              </motion.div>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {user?.name || "Пользователь"}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                  {user?.email}
                </Typography>
                <Chip
                  label={getActivityLevelLabel(profile?.activityLevel)}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                  }}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Основные показатели */}
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold">
                    {calculateAge(profile?.age) || "—"}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    лет
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold">
                    {profile?.height || "—"}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    см
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold">
                    {profile?.weight || "—"}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    кг
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" fontWeight="bold">
                    {bmi ? bmi.toFixed(1) : "—"}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    ИМТ
                  </Typography>
                </Box>
              </Grid>

              {/* BMI статус */}
              {bmiCategory && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      Индекс массы тела: {bmiCategory.label}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((bmi! / 30) * 100, 100)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "white",
                        },
                      }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Декоративные элементы */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          }}
        />
      </CardContent>
    </Card>
  )
})

ProfileHeader.displayName = "ProfileHeader"
