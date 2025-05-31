"use client"

import { memo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Grid, Typography, Box, Alert } from "@mui/material"
import { motion } from "framer-motion"

import { MainLayout } from "@/widgets/Layout/MainLayout"
import { useAppSelector } from "@/shared/hooks/redux"
import { useGetProfileQuery, useGetGoalsQuery, useGetStatsQuery } from "@/entities/user/api/userApi"
import { ProfileHeader } from "@/widgets/Profile/ProfileHeader"
import { PersonalInfo } from "@/widgets/Profile/PersonalInfo"
import { NutritionGoals } from "@/widgets/Profile/NutritionGoals"
import { ProfileStats } from "@/widgets/Profile/ProfileStats"
import { ProfileSettings } from "@/widgets/Profile/ProfileSettings"
import { BMICalculator } from "@/widgets/Profile/BMICalculator"

const ProfilePage = memo(() => {
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)
  const [showSuccess, setShowSuccess] = useState(false)

  const { data: profile, isLoading: profileLoading } = useGetProfileQuery()
  const { data: goals, isLoading: goalsLoading } = useGetGoalsQuery()
  const { data: stats } = useGetStatsQuery({ period: "month" })

  const handleSuccess = (message: string) => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {t("profile.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Управляйте своим профилем, целями и настройками
          </Typography>
        </Box>

        {showSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Профиль успешно обновлен!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Заголовок профиля */}
          <Grid item xs={12}>
            <ProfileHeader user={user} profile={profile} stats={stats} />
          </Grid>

          {/* Личная информация */}
          <Grid item xs={12} md={8}>
            <PersonalInfo profile={profile} isLoading={profileLoading} onSuccess={handleSuccess} />
          </Grid>

          {/* BMI калькулятор */}
          <Grid item xs={12} md={4}>
            <BMICalculator profile={profile} />
          </Grid>

          {/* Цели питания */}
          <Grid item xs={12} md={8}>
            <NutritionGoals goals={goals} isLoading={goalsLoading} onSuccess={handleSuccess} />
          </Grid>

          {/* Статистика */}
          <Grid item xs={12} md={4}>
            <ProfileStats stats={stats} />
          </Grid>

          {/* Настройки */}
          <Grid item xs={12}>
            <ProfileSettings onSuccess={handleSuccess} />
          </Grid>
        </Grid>
      </motion.div>
    </MainLayout>
  )
})

ProfilePage.displayName = "ProfilePage"

export default ProfilePage
